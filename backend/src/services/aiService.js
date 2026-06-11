const Groq = require('groq-sdk');

class AIService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY || 'dummy_key'
    });
    this.primaryModel = 'llama-3.3-70b-versatile';
    this.fallbackModel = 'llama-3.1-8b-instant';
  }

  async checkHealth() {
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'dummy_key') {
      throw new Error("GROQ_API_KEY is missing or invalid in environment.");
    }

    try {
      // Lightweight check to verify connection and model access
      const models = await this.groq.models.list();
      const modelIds = models.data.map(m => m.id);
      
      if (!modelIds.includes(this.primaryModel)) {
        console.warn(`[Groq AI] Warning: Primary model ${this.primaryModel} not found in available models.`);
      }
      return true;
    } catch (error) {
      console.error(`[Groq AI] Health check failed:`, error.message);
      throw new Error("Groq API connection failed. Please verify your API key and network.");
    }
  }

  _withTimeout(promise, ms) {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`Request timed out after ${ms} ms`));
      }, ms);
    });

    return Promise.race([
      promise,
      timeoutPromise
    ]).finally(() => clearTimeout(timeoutId));
  }

  async generateAssistantResponse(prompt, retries = 3) {
    await this.checkHealth();
    
    let attempt = 0;
    while (attempt < retries) {
      try {
        console.log(`[Groq AI] Attempt ${attempt + 1}: Generating response...`);
        const payload = {
          messages: [{ role: 'user', content: prompt }],
          model: this.primaryModel,
          temperature: 0.7,
          max_tokens: 1024
        };
        
        console.log(`[Groq AI] Request Payload:`, JSON.stringify({ ...payload, messages: "[HIDDEN]" }));
        console.log(`[Groq AI] Model: ${this.primaryModel}`);

        const requestPromise = this.groq.chat.completions.create(payload);
        const chatCompletion = await this._withTimeout(requestPromise, 10000);

        const responseText = chatCompletion.choices[0]?.message?.content || "";
        console.log(`[Groq AI] Response received successfully.`);
        console.log(`[Groq AI] Raw Response Snippet:`, responseText.substring(0, 100) + '...');
        
        return this._parseJSONResponse(responseText);
      } catch (error) {
        console.error(`[Groq AI] Exact Error on attempt ${attempt + 1}:`, error);
        
        if (attempt === retries - 1) {
          console.log(`[Groq AI] All retries failed. Attempting fallback model...`);
          return await this._generateFallbackResponse(prompt);
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        attempt++;
      }
    }
  }

  async _generateFallbackResponse(prompt) {
    try {
      const payload = {
        messages: [{ role: 'user', content: prompt }],
        model: this.fallbackModel,
        temperature: 0.7,
        max_tokens: 1024
      };
      
      console.log(`[Groq AI] Fallback Request Payload:`, JSON.stringify({ ...payload, messages: "[HIDDEN]" }));
      console.log(`[Groq AI] Model: ${this.fallbackModel}`);

      const requestPromise = this.groq.chat.completions.create(payload);
      const chatCompletion = await this._withTimeout(requestPromise, 10000);

      const responseText = chatCompletion.choices[0]?.message?.content || "";
      console.log(`[Groq AI] Fallback Response received successfully.`);
      return this._parseJSONResponse(responseText);
    } catch (error) {
      console.error(`[Groq AI] Exact Fallback Error:`, error);
      throw new Error("AI Service is currently unavailable. Please try again later.");
    }
  }

  _parseJSONResponse(responseText) {
    let cleanedJSON = responseText.trim();
    
    // Attempt to extract json from markdown code blocks even if there's surrounding text
    const jsonBlockMatch = cleanedJSON.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      cleanedJSON = jsonBlockMatch[1].trim();
    } else {
      // If no code block, try to just find the first { and last }
      const startIdx = cleanedJSON.indexOf('{');
      const endIdx = cleanedJSON.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        cleanedJSON = cleanedJSON.substring(startIdx, endIdx + 1);
      }
    }

    try {
      return JSON.parse(cleanedJSON);
    } catch (e) {
      console.error('[Groq AI] Failed to parse JSON response:', responseText);
      return {
        content: responseText,
        impact: 'Medium',
        actionability: 50
      };
    }
  }
}

module.exports = new AIService();

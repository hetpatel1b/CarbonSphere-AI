const Groq = require('groq-sdk');

class GroqService {
  constructor() {
    this.keys = [];
    this.clients = [];
    this.currentIndex = 0;
    this.primaryModel = 'llama-3.3-70b-versatile';
    this.fallbackModel = 'llama-3.1-8b-instant';
    this._initializeKeys();
  }

  _initializeKeys() {
    const potentialKeys = [
      process.env.GROQ_API_KEY_1,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY
    ];

    potentialKeys.forEach(key => {
      if (key && key.trim() !== '' && key !== 'dummy_key') {
        if (!this.keys.includes(key)) {
          this.keys.push(key);
          this.clients.push(new Groq({ apiKey: key }));
        }
      }
    });

    if (this.keys.length > 0) {
      this.keys.forEach((_, i) => {
        console.log(`[Groq AI] ✓ Groq Key #${i + 1} Loaded`);
      });
      if (this.keys.length < 2) {
        console.warn(`[Groq AI] Warning: Only ${this.keys.length} Groq key(s) loaded. Failover requires at least 2 keys.`);
      }
    } else {
      console.warn(`[Groq AI] Warning: No valid Groq API keys found.`);
    }
  }

  getHealthStats() {
    return {
      status: this.keys.length > 0 ? "healthy" : "unhealthy",
      availableKeys: this.keys.length,
      activeKey: this.keys.length > 0 ? this.currentIndex + 1 : 0
    };
  }

  _getNextClient() {
    if (this.clients.length === 0) throw new Error("No Groq API keys available.");
    const client = this.clients[this.currentIndex];
    const keyIndex = this.currentIndex;
    // Round-robin load balancing
    this.currentIndex = (this.currentIndex + 1) % this.clients.length;
    return { client, keyIndex };
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
    if (this.clients.length === 0) throw new Error("No Groq API keys available.");
    
    let attempt = 0;
    // Max attempts across all keys to prevent immediate failure if retries < keys
    const maxAttempts = Math.max(retries, this.clients.length); 

    while (attempt < maxAttempts) {
      const { client, keyIndex } = this._getNextClient();
      console.log(`[Groq] Using API Key #${keyIndex + 1}`);

      try {
        const payload = {
          messages: [{ role: 'user', content: prompt }],
          model: this.primaryModel,
          temperature: 0.7,
          max_tokens: 1024
        };

        const requestPromise = client.chat.completions.create(payload);
        const chatCompletion = await this._withTimeout(requestPromise, 15000);

        const responseText = chatCompletion.choices[0]?.message?.content || "";
        return this._parseJSONResponse(responseText);
      } catch (error) {
        console.error(`[Groq] Error with API Key #${keyIndex + 1}:`, error.message);
        
        const isRateLimit = error.status === 429 || error.message.toLowerCase().includes('rate') || error.message.toLowerCase().includes('quota');
        if (isRateLimit) {
          console.log(`[Groq] Rate Limit Detected`);
        }
        
        if (attempt < maxAttempts - 1) {
          console.log(`[Groq] Failover Triggered`);
        } else {
           console.log(`[Groq] All failover attempts exhausted. Returning error.`);
           throw new Error("AI Service is currently unavailable due to repeated failures or rate limits.");
        }
        
        // Minor delay before next attempt
        await new Promise(resolve => setTimeout(resolve, 500));
        attempt++;
      }
    }
  }

  _parseJSONResponse(responseText) {
    let cleanedJSON = responseText.trim();
    
    // Attempt to extract json from markdown code blocks
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
      console.error('[Groq] Failed to parse JSON response. Treating as raw text.');
      return {
        content: responseText,
        impact: 'Medium',
        actionability: 50
      };
    }
  }
}

module.exports = new GroqService();

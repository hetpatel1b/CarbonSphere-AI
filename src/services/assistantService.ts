import { getToken } from '../utils/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface AssistantResponse {
  content: string;
  impact?: 'High' | 'Medium' | 'Low';
  actionability?: number;
}

export const assistantService = {
  chat: async (message: string): Promise<AssistantResponse> => {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/assistant/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to communicate with AI Assistant');
    }

    const data = await response.json();
    
    // Defensive parsing
    let parsedContent = data?.data?.content || data?.content || data?.message?.content || data?.data;
    
    // If the backend somehow returned a stringified JSON string for content
    if (typeof parsedContent === 'string' && parsedContent.trim().startsWith('{')) {
      try {
        const innerJson = JSON.parse(parsedContent);
        parsedContent = innerJson.content || innerJson.message?.content || parsedContent;
      } catch (e) {
        // Ignore JSON parse errors, just use the string
      }
    }
    
    // If it's still an object for some reason, stringify it or extract safely
    if (typeof parsedContent === 'object' && parsedContent !== null) {
      parsedContent = parsedContent.content || JSON.stringify(parsedContent);
    }
    
    return {
      content: typeof parsedContent === 'string' ? parsedContent : String(parsedContent),
      impact: data?.data?.impact,
      actionability: data?.data?.actionability
    };
  }
};

import { apiClient } from '../lib/apiClient';

export interface AssistantResponse {
  content: string;
  impact?: 'High' | 'Medium' | 'Low';
  actionability?: number;
}

export const assistantService = {
  chat: async (message: string): Promise<AssistantResponse> => {
    const data = await apiClient.post<any>('/assistant/chat', { message });
    
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

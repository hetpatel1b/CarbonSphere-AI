import { apiClient } from '../lib/apiClient';

export interface AssistantResponse {
  content: string;
  impact?: 'High' | 'Medium' | 'Low';
  actionability?: number;
}

export const assistantService = {
  chat: async (message: string): Promise<AssistantResponse> => {
    const response = await apiClient.post<unknown>('/assistant/chat', { message });
    
    // Defensive parsing
    const safeData = response as Record<string, any>;
    let parsedContent = safeData?.data?.content || safeData?.content || safeData?.message?.content || safeData?.data;
    
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
      impact: safeData?.data?.impact,
      actionability: safeData?.data?.actionability
    };
  }
};

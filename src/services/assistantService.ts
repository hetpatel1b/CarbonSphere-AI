import { apiClient } from '../lib/apiClient';

export interface AssistantResponse {
  content: string;
  impact?: 'High' | 'Medium' | 'Low';
  actionability?: number;
}

interface InnerJson {
  content?: string;
  message?: { content?: string };
}

interface ApiResponsePayload {
  data?: {
    content?: string | InnerJson;
    impact?: 'High' | 'Medium' | 'Low';
    actionability?: number;
    [key: string]: string | number | boolean | null | undefined | InnerJson | object;
  };
  content?: string | InnerJson;
  message?: {
    content?: string;
  };
}

export const assistantService = {
  chat: async (message: string): Promise<AssistantResponse> => {
    const response = await apiClient.post<ApiResponsePayload>('/assistant/chat', { message });
    
    // Defensive parsing
    const safeData = response as ApiResponsePayload;
    let parsedContent = safeData?.data?.content || safeData?.content || safeData?.message?.content || safeData?.data;
    
    // If the backend somehow returned a stringified JSON string for content
    if (typeof parsedContent === 'string' && parsedContent.trim().startsWith('{')) {
      try {
        const innerJson = JSON.parse(parsedContent) as InnerJson;
        parsedContent = (innerJson.content || innerJson.message?.content || parsedContent) as string | InnerJson;
      } catch (e) {
        // Ignore JSON parse errors, just use the string
      }
    }
    
    // If it's still an object for some reason, stringify it or extract safely
    if (typeof parsedContent === 'object' && parsedContent !== null) {
      const parsedObj = parsedContent as InnerJson;
      parsedContent = parsedObj.content || JSON.stringify(parsedContent);
    }
    
    return {
      content: typeof parsedContent === 'string' ? parsedContent : String(parsedContent),
      impact: safeData?.data?.impact,
      actionability: safeData?.data?.actionability
    };
  }
};

import { apiClient } from '../lib/apiClient';

export interface AIRecommendation {
  _id?: string;
  title: string;
  description: string;
  category: string;
  saving?: string; // Stored as estimatedCarbonSaving in DB but we might map it
  estimatedCarbonSaving?: number;
  confidence?: number;
}

export interface AIInsight {
  executiveSummary?: string;
  score: number;
  topEmissionSources?: string[];
  strengths: string[];
  weaknesses: string[];
  riskAssessment?: string;
  monthlyImprovementPlan?: string;
  carbonReductionOpportunities?: string;
  challengeSuggestion: string;
  generatedAt?: string;
}

export interface AICoachResponse {
  insight: AIInsight;
  recommendations: AIRecommendation[];
}

export const aiCoachService = {
  async getLatestInsight(): Promise<AICoachResponse> {
    const res = await apiClient.get<{ success: boolean; data: AICoachResponse }>('/ai-coach/latest');
    return res.data;
  },

  async generateNewAnalysis(): Promise<AICoachResponse> {
    const res = await apiClient.post<{ success: boolean; data: AICoachResponse }>('/ai-coach/analyze');
    return res.data;
  }
};

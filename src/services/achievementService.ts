import { apiClient } from '../lib/apiClient';
import { ApiResponse, AchievementDocument } from '../types';

export type { AchievementDocument };
export type Rarity = "Common" | "Rare" | "Epic" | "Legendary";

export const achievementService = {
  async getAchievementStatus(): Promise<AchievementDocument[]> {
    const res = await apiClient.get<ApiResponse<AchievementDocument[]>>('/achievements/status');
    return res.data;
  }
};

import { apiClient } from './client';
import { DailyScore } from '../types';

export const dailyScoreApi = {
  getDailyScores: async () => {
    const res = await apiClient.get<DailyScore[]>('/daily-scores');
    return res.data;
  }
};

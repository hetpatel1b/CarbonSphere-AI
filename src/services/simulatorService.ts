import { apiClient } from '../lib/apiClient';
import { ApiResponse, SimulationRecord } from '../types';

export const runSimulation = async (scenarioId: string): Promise<ApiResponse<SimulationRecord>> => {
  return apiClient.post<ApiResponse<SimulationRecord>>('/simulator/run', { scenarioId });
};

export const fetchSimulationHistory = async (page?: number, limit?: number): Promise<ApiResponse<SimulationRecord[]>> => {
  let path = '/simulator/history';
  const params = [];
  if (page !== undefined) params.push(`page=${page}`);
  if (limit !== undefined) params.push(`limit=${limit}`);
  if (params.length > 0) path += `?${params.join('&')}`;

  return apiClient.get<ApiResponse<SimulationRecord[]>>(path);
};

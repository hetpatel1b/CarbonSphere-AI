import { apiClient } from '../lib/apiClient';
import { ApiResponse, Report } from '../types';

export const fetchReports = async (page?: number, limit?: number): Promise<ApiResponse<Report[]>> => {
  let path = '/reports';
  const params = [];
  if (page !== undefined) params.push(`page=${page}`);
  if (limit !== undefined) params.push(`limit=${limit}`);
  if (params.length > 0) path += `?${params.join('&')}`;

  return apiClient.get<ApiResponse<Report[]>>(path);
};

export const fetchReportById = async (id: string): Promise<ApiResponse<Report>> => {
  return apiClient.get<ApiResponse<Report>>(`/reports/${id}`);
};

export const generateReport = async (reportType: string): Promise<ApiResponse<Report>> => {
  return apiClient.post<ApiResponse<Report>>('/reports/generate', { reportType });
};

export const deleteReport = async (id: string): Promise<ApiResponse<void>> => {
  return apiClient.delete<ApiResponse<void>>(`/reports/${id}`);
};

import api from './api';
import { DailySalesStats, TopClientsStats, ApiResponse } from '../types';

export const saleService = {
  async getDailyStats(): Promise<DailySalesStats[]> {
    const response = await api.get<ApiResponse<DailySalesStats[]>>('/sales/stats');
    return response.data.data || [];
  },

  async getTopClientsStats(): Promise<TopClientsStats> {
    const response = await api.get<ApiResponse<TopClientsStats>>('/sales/top-clients');
    return response.data.data!;
  },

  async createSale(saleData: { clientId: number; valor: number; data: string }): Promise<any> {
    const response = await api.post<ApiResponse<any>>('/sales', saleData);
    return response.data.data;
  }
}; 
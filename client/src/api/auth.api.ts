import { apiClient } from './client';
import { LoginResponse, User } from '../types';

export const authApi = {
  login: async (mobile: string, password: string):Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', { mobile, password });
    return response.data;
  },
  register: async (data: { name: string; mobile: string; operator: string; password: string }) => {
    const response = await apiClient.post<{ message: string; user: User }>('/auth/register', data);
    return response.data;
  },
  getProfile: async ():Promise<User> => {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

import { apiClient } from './client';
import { AdminStats, PaginatedResponse, User, Subject, Chapter, Section, QuizQuestion } from '../types';

export const adminApi = {
  getStats: async () => {
    const res = await apiClient.get<AdminStats>('/admin/stats');
    return res.data;
  },
  getUsers: async (page = 1, limit = 10, search = '') => {
    const res = await apiClient.get<PaginatedResponse<User>>(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
    return res.data;
  },
  getSubscriptions: async (page = 1, limit = 10) => {
    const res = await apiClient.get<PaginatedResponse<any>>(`/admin/subscriptions?page=${page}&limit=${limit}`);
    return res.data;
  },
  createSubject: async (data: any) => {
    const res = await apiClient.post<Subject>('/admin/subjects', data);
    return res.data;
  },
  updateSubject: async (id: string, data: any) => {
    const res = await apiClient.put<Subject>(`/admin/subjects/${id}`, data);
    return res.data;
  },
  deleteSubject: async (id: string) => {
    await apiClient.delete(`/admin/subjects/${id}`);
  },
  createChapter: async (subjectId: string, data: any) => {
    const res = await apiClient.post<Chapter>(`/admin/subjects/${subjectId}/chapters`, data);
    return res.data;
  },
  createSection: async (chapterId: string, data: any) => {
    const res = await apiClient.post<Section>(`/admin/chapters/${chapterId}/sections`, data);
    return res.data;
  },
  createQuestion: async (sectionId: string, data: any) => {
    const res = await apiClient.post<QuizQuestion>(`/admin/sections/${sectionId}/questions`, data);
    return res.data;
  },
  updateQuestion: async (id: string, data: any) => {
    const res = await apiClient.put<QuizQuestion>(`/admin/questions/${id}`, data);
    return res.data;
  },
  deleteQuestion: async (id: string) => {
    await apiClient.delete(`/admin/questions/${id}`);
  },
  importQuestions: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/admin/import/questions', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  getSmsLogs: async (page = 1, limit = 10) => {
    const res = await apiClient.get<PaginatedResponse<any>>(`/admin/sms-logs?page=${page}&limit=${limit}`);
    return res.data;
  },
  getTransactions: async (page = 1, limit = 10) => {
    const res = await apiClient.get<PaginatedResponse<any>>(`/admin/transactions?page=${page}&limit=${limit}`);
    return res.data;
  }
};

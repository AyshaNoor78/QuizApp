import { apiClient } from './client';
import { Subject, Chapter, Section, QuizQuestion, QuizSession, SubmitAnswerResponse, QuizResult, PaginatedResponse } from '../types';

export const quizApi = {
  getSubjects: async () => {
    const res = await apiClient.get<Subject[]>('/quiz/subjects');
    return res.data;
  },
  getChapters: async (subjectId: string) => {
    const res = await apiClient.get<Chapter[]>(`/quiz/subjects/${subjectId}/chapters`);
    return res.data;
  },
  getSections: async (chapterId: string) => {
    const res = await apiClient.get<Section[]>(`/quiz/chapters/${chapterId}/sections`);
    return res.data;
  },
  startQuiz: async (sectionId: string) => {
    const res = await apiClient.post<QuizSession>('/quiz/start', { sectionId });
    return res.data;
  },
  getNextQuestion: async (sessionId: string) => {
    const res = await apiClient.get<QuizQuestion | null>(`/quiz/session/${sessionId}/next-question`);
    return res.data;
  },
  submitAnswer: async (sessionId: string, questionId: string, selectedOption: string) => {
    const res = await apiClient.post<SubmitAnswerResponse>(`/quiz/session/${sessionId}/submit`, { questionId, selectedOption });
    return res.data;
  },
  getResult: async (sessionId: string) => {
    const res = await apiClient.get<QuizResult>(`/quiz/session/${sessionId}/result`);
    return res.data;
  },
  getHistory: async (page = 1, limit = 10) => {
    const res = await apiClient.get<PaginatedResponse<QuizResult>>(`/quiz/history?page=${page}&limit=${limit}`);
    return res.data;
  }
};

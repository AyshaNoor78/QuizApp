import { useState, useEffect } from 'react';
import { quizApi } from '../api/quiz.api';
import { QuizSession, QuizQuestion, SubmitAnswerResponse } from '../types';
import toast from 'react-hot-toast';

export const useQuiz = (sectionId?: string) => {
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<SubmitAnswerResponse | null>(null);

  const startQuiz = async () => {
    if (!sectionId) return;
    setLoading(true);
    try {
      const sess = await quizApi.startQuiz(sectionId);
      setSession(sess);
      await nextQuestion(sess.id);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = async (sessId: string) => {
    setLoading(true);
    setFeedback(null);
    try {
      const q = await quizApi.getNextQuestion(sessId);
      setCurrentQuestion(q);
      if (!q) {
        // null question means quiz finished or limit reached
        setSession(s => s ? { ...s, status: 'COMPLETED' } : null);
      }
    } catch (err: any) {
      toast.error('Failed to get question');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (questionId: string, option: string) => {
    if (!session) return;
    setLoading(true);
    try {
      const fb = await quizApi.submitAnswer(session.id, questionId, option);
      setFeedback(fb);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    currentQuestion,
    loading,
    feedback,
    startQuiz,
    nextQuestion,
    submitAnswer
  };
};

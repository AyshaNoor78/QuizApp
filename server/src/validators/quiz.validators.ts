import { z } from 'zod';

export const startQuizSchema = z.object({
  body: z.object({
    sectionId: z.string().uuid('Invalid section ID format'),
  }),
});

export const submitAnswerSchema = z.object({
  body: z.object({
    questionId: z.string().uuid('Invalid question ID format'),
    answer: z.enum(['A', 'B', 'C', 'D']),
  }),
});

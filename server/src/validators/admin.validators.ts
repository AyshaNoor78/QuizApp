import { z } from 'zod';

export const createSubjectSchema = z.object({
  body: z.object({
    nameEn: z.string().min(1),
    nameBn: z.string().optional(),
    descriptionEn: z.string().optional(),
    descriptionBn: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const createChapterSchema = z.object({
  body: z.object({
    subjectId: z.string().uuid(),
    nameEn: z.string().min(1),
    nameBn: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const createSectionSchema = z.object({
  body: z.object({
    chapterId: z.string().uuid(),
    nameEn: z.string().min(1),
    nameBn: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const createQuestionSchema = z.object({
  body: z.object({
    sectionId: z.string().uuid(),
    questionTextEn: z.string().min(1),
    questionTextBn: z.string().optional(),
    optionAEn: z.string().min(1),
    optionABn: z.string().optional(),
    optionBEn: z.string().min(1),
    optionBBn: z.string().optional(),
    optionCEn: z.string().min(1),
    optionCBn: z.string().optional(),
    optionDEn: z.string().min(1),
    optionDBn: z.string().optional(),
    correctAnswer: z.enum(['A', 'B', 'C', 'D']),
    explanationEn: z.string().optional(),
    explanationBn: z.string().optional(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
    marks: z.number().optional(),
  }),
});

export const updateQuestionSchema = createQuestionSchema.deepPartial();

export const importQuestionsSchema = z.object({
  body: z.object({
    questions: z.array(z.any()).min(1),
  }),
});

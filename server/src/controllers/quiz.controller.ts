import { Request, Response, NextFunction } from 'express';
import { quizService } from '../services/quiz.service';

export const getSubjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await quizService.getSubjects();
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const getChapters = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await quizService.getChapters(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const getSections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await quizService.getSections(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const startSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await quizService.startSession(req.user!.id, req.body.sectionId);
    res.status(201).json({ success: true, data });
  } catch (error) { next(error); }
};

export const getNextQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await quizService.getNextQuestion(req.user!.id, req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const submitAnswer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await quizService.submitAnswer(req.user!.id, req.params.id, req.body.questionId, req.body.answer);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const getResult = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await quizService.getResult(req.user!.id, req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const getHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await quizService.getHistory(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

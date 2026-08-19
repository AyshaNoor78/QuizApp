import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service';

export const createSubject = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await adminService.createSubject(req.body) }); } catch (e) { next(e); }
};
export const createChapter = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await adminService.createChapter(req.body) }); } catch (e) { next(e); }
};
export const createSection = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await adminService.createSection(req.body) }); } catch (e) { next(e); }
};
export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await adminService.createQuestion(req.body) }); } catch (e) { next(e); }
};
export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json({ success: true, data: await adminService.updateQuestion(req.params.id, req.body) }); } catch (e) { next(e); }
};
export const importQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await adminService.importQuestions(req.body.questions) }); } catch (e) { next(e); }
};
export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json({ success: true, data: await adminService.getStats() }); } catch (e) { next(e); }
};
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json({ success: true, data: await adminService.getUsers(Number(req.query.page)||1, Number(req.query.limit)||10) }); } catch (e) { next(e); }
};
export const getSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json({ success: true, data: await adminService.getSubscriptions(req.query.status, Number(req.query.page)||1, Number(req.query.limit)||10) }); } catch (e) { next(e); }
};
export const getSmsLogs = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json({ success: true, data: await adminService.getSmsLogs(Number(req.query.page)||1, Number(req.query.limit)||10) }); } catch (e) { next(e); }
};
export const getTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(200).json({ success: true, data: await adminService.getTransactions(Number(req.query.page)||1, Number(req.query.limit)||10) }); } catch (e) { next(e); }
};

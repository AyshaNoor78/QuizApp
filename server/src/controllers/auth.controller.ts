import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) { next(error); }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await authService.login(req.body.mobileNumber, req.body.password);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await authService.refreshToken(req.body.refreshToken);
    res.status(200).json({ success: true, data: { accessToken: token } });
  } catch (error) { next(error); }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user) await authService.logout(req.user.id, req.body.refreshToken);
    res.status(200).json({ success: true, message: 'Logged out' });
  } catch (error) { next(error); }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await authService.getProfile(req.user!.id);
    res.status(200).json({ success: true, data: profile });
  } catch (error) { next(error); }
};

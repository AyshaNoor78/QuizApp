import { Request, Response, NextFunction } from 'express';
import { subscriptionService } from '../services/subscription.service';

export const getStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await subscriptionService.getStatus(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const requestOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await subscriptionService.requestOtp(req.user!.id, req.body.mobileNumber);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await subscriptionService.verifyOtpAndSubscribe(req.user!.id, req.body.mobileNumber, req.body.otp);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const handleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['x-bdapps-signature'] as string;
    const data = await subscriptionService.handleCallback(req.body, signature);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

export const cancelSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await subscriptionService.cancelSubscription(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (error) { next(error); }
};

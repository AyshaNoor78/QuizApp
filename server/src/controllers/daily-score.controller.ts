import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDailyScores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const scores = await prisma.dailyScore.findMany({
      where: { userId: req.user!.id },
      orderBy: { date: 'desc' },
      take: 30,
    });
    res.status(200).json({ success: true, data: scores });
  } catch (error) { next(error); }
};

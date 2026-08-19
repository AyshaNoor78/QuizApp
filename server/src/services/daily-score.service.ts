import { PrismaClient } from '@prisma/client';
import { smsService } from './sms.service';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class DailyScoreService {
  async calculateDailyScores(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const answers = await prisma.quizAnswer.findMany({
      where: { answeredAt: { gte: startOfDay, lte: endOfDay } },
      include: { quizSession: true, question: true },
    });

    const userStats: Record<string, any> = {};

    for (const a of answers) {
      const userId = a.quizSession.userId;
      if (!userStats[userId]) {
        userStats[userId] = { total: 0, correct: 0, incorrect: 0, marks: 0 };
      }
      userStats[userId].total += 1;
      if (a.isCorrect) {
        userStats[userId].correct += 1;
        userStats[userId].marks += a.question.marks;
      } else {
        userStats[userId].incorrect += 1;
      }
    }

    for (const userId of Object.keys(userStats)) {
      const stat = userStats[userId];
      const percentage = stat.total > 0 ? (stat.correct / stat.total) * 100 : 0;
      await prisma.dailyScore.upsert({
        where: { userId_date: { userId, date: startOfDay } },
        update: { totalQuestions: stat.total, correctAnswers: stat.correct, incorrectAnswers: stat.incorrect, totalMarks: stat.marks, percentage },
        create: { userId, date: startOfDay, totalQuestions: stat.total, correctAnswers: stat.correct, incorrectAnswers: stat.incorrect, totalMarks: stat.marks, percentage },
      });
    }

    logger.info('Calculated daily scores for date:', startOfDay);
  }

  async sendDailyScoreNotifications(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const scores = await prisma.dailyScore.findMany({
      where: { date: startOfDay },
    });

    for (const s of scores) {
      const sub = await prisma.subscription.findFirst({
        where: { userId: s.userId, status: 'ACTIVE' },
      });
      if (sub) {
        await smsService.sendDailyScore(s.userId);
      }
    }
    logger.info('Queued daily score SMS notifications');
  }
}

export const dailyScoreService = new DailyScoreService();

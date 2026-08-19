import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminService {
  async createSubject(data: any) { return prisma.subject.create({ data }); }
  async createChapter(data: any) { return prisma.chapter.create({ data }); }
  async createSection(data: any) { return prisma.section.create({ data }); }
  async createQuestion(data: any) { return prisma.question.create({ data }); }
  async updateQuestion(id: string, data: any) { return prisma.question.update({ where: { id }, data }); }
  
  async importQuestions(questions: any[]) {
    const results = [];
    for (const q of questions) {
      results.push(await prisma.question.create({ data: q }));
    }
    return results;
  }

  async getStats() {
    const users = await prisma.user.count();
    const subs = await prisma.subscription.count({ where: { status: 'ACTIVE' } });
    const qs = await prisma.question.count();
    return { totalUsers: users, activeSubscriptions: subs, totalQuestions: qs };
  }

  async getUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const users = await prisma.user.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } });
    const total = await prisma.user.count();
    return { data: users, total, page, limit };
  }

  async getSubscriptions(status?: any, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};
    const subs = await prisma.subscription.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include: { user: true } });
    const total = await prisma.subscription.count({ where });
    return { data: subs, total, page, limit };
  }

  async getSmsLogs(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const logs = await prisma.smsLog.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } });
    const total = await prisma.smsLog.count();
    return { data: logs, total, page, limit };
  }

  async getTransactions(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const txns = await prisma.subscriptionTransaction.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, include: { user: true } });
    const total = await prisma.subscriptionTransaction.count();
    return { data: txns, total, page, limit };
  }
}

export const adminService = new AdminService();

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { config } from '../config';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class AuthService {
  async register(data: any) {
    const { mobileNumber, password, name, operator } = data;
    
    const existing = await prisma.user.findUnique({ where: { mobileNumber } });
    if (existing) throw new Error('Mobile number already registered');

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { mobileNumber, passwordHash, name, operator },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(mobileNumber: string, password: string) {
    const user = await prisma.user.findUnique({ where: { mobileNumber } });
    if (!user || !user.isActive) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new Error('Invalid credentials');

    const payload = { id: user.id, role: user.role, mobileNumber: user.mobileNumber, operator: user.operator };
    const accessToken = jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiry });
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiry });

    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.refreshToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const sub = await prisma.subscription.findFirst({
      where: { userId: user.id, status: 'ACTIVE' },
    });

    const { passwordHash: _, ...profile } = user;
    return {
      accessToken,
      refreshToken,
      user: {
        ...profile,
        subscriptionStatus: sub ? sub.status : 'INACTIVE',
      },
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret) as any;
      const userTokens = await prisma.refreshToken.findMany({
        where: { userId: decoded.id, isRevoked: false, expiresAt: { gt: new Date() } }
      });

      let validToken = null;
      for (const t of userTokens) {
        if (await bcrypt.compare(token, t.tokenHash)) {
          validToken = t;
          break;
        }
      }

      if (!validToken) throw new Error('Invalid refresh token');

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user || !user.isActive) throw new Error('User inactive');

      const payload = { id: user.id, role: user.role, mobileNumber: user.mobileNumber, operator: user.operator };
      return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiry });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async logout(userId: string, token: string) {
    const userTokens = await prisma.refreshToken.findMany({ where: { userId, isRevoked: false } });
    for (const t of userTokens) {
      if (await bcrypt.compare(token, t.tokenHash)) {
        await prisma.refreshToken.update({
          where: { id: t.id },
          data: { isRevoked: true },
        });
        break;
      }
    }
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const sub = await prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    const { passwordHash: _, ...profile } = user;
    return {
      ...profile,
      subscriptionStatus: sub ? sub.status : 'INACTIVE',
    };
  }
}

export const authService = new AuthService();

import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { config } from '../config';

export const applySecurityMiddleware = (app: Express) => {
  app.use(helmet());
  app.use(cors({
    origin: config.server.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  }));
  app.use(express.json({ limit: '10kb' }));
};

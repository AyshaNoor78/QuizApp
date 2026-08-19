import dotenv from 'dotenv';

dotenv.config();

export const config = {
  database: {
    url: process.env.DATABASE_URL as string,
  },
  redis: {
    url: process.env.REDIS_URL as string,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'access_secret_fallback_123',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_fallback_123',
    accessExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  server: {
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    apiBaseUrl: process.env.API_BASE_URL || '/api',
  },
  bdapps: {
    baseUrl: process.env.BDAPPS_BASE_URL as string,
    appId: process.env.BDAPPS_APP_ID as string,
    appPassword: process.env.BDAPPS_APP_PASSWORD as string,
    subscriptionProductId: process.env.BDAPPS_SUB_PRODUCT_ID as string,
    callbackUrl: process.env.BDAPPS_CALLBACK_URL as string,
    callbackSecret: process.env.BDAPPS_CALLBACK_SECRET as string,
    smsAppId: process.env.BDAPPS_SMS_APP_ID as string,
    smsPassword: process.env.BDAPPS_SMS_PASSWORD as string,
    smsSenderAddress: process.env.BDAPPS_SMS_SENDER_ADDRESS as string,
  },
  otp: {
    expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10),
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10),
    maxRequestsPerHour: parseInt(process.env.OTP_MAX_REQUESTS_PER_HOUR || '3', 10),
  },
  admin: {
    mobile: process.env.ADMIN_MOBILE || '01800000000',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    name: process.env.ADMIN_NAME || 'Super Admin',
  },
  cron: {
    dailyScoreCron: process.env.CRON_DAILY_SCORE || '0 20 * * *',
  },
  log: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

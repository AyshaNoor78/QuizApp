import { z } from 'zod';

export const requestOtpSchema = z.object({
  body: z.object({
    mobileNumber: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid BD mobile number format'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    mobileNumber: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid BD mobile number format'),
    otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d+$/, 'OTP must be numeric'),
  }),
});

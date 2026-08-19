/**
 * Generates a 6-digit numeric OTP.
 */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Masks a mobile number, returning only the last 4 digits visible.
 */
export function maskMobileNumber(mobile: string): string {
  if (!mobile || mobile.length < 4) return mobile;
  return '*'.repeat(mobile.length - 4) + mobile.slice(-4);
}

/**
 * Formats a given number into a percentage string with 2 decimal places.
 */
export function formatPercentage(value: number): string {
  return Number(value).toFixed(2) + '%';
}

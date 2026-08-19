import React, { useRef, useState, useEffect } from 'react';

interface Props {
  length?: number;
  onComplete: (otp: string) => void;
  onResend: () => void;
  isResending: boolean;
}

const OtpInput: React.FC<Props> = ({ length = 6, onComplete, onResend, isResending }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    const otpString = newOtp.join('');
    if (otpString.length === length) {
      onComplete(otpString);
    }

    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, length).split('');
    if (pasted.some(char => isNaN(Number(char)))) return;
    
    const newOtp = [...otp];
    pasted.forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);

    if (newOtp.join('').length === length) {
      onComplete(newOtp.join(''));
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 sm:gap-3 mb-6" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all outline-none"
            maxLength={1}
          />
        ))}
      </div>
      
      <div className="text-sm font-medium text-gray-500">
        {timeLeft > 0 ? (
          <p>Resend OTP in <span className="text-primary-600">{formatTime(timeLeft)}</span></p>
        ) : (
          <button
            onClick={() => {
              setTimeLeft(300);
              setOtp(new Array(length).fill(''));
              onResend();
            }}
            disabled={isResending}
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            {isResending ? 'Resending...' : 'Resend OTP'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OtpInput;

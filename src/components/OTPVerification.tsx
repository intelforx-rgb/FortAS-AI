import React, { useState, useEffect, useRef } from 'react';
import { Shield, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';

interface OTPVerificationProps {
  mobile: string;
  onVerify: (otp: string) => Promise<boolean>;
  onResend: () => Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
  demoOTP?: string; // For demo purposes
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({
  mobile,
  onVerify,
  onResend,
  onBack,
  isLoading = false,
  demoOTP
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpValue: string = otp.join('')) => {
    if (otpValue.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const isValid = await onVerify(otpValue);
      if (isValid) {
        setSuccess(true);
        // Success animation will be handled by parent component
      } else {
        setError('Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setTimer(60);
    setCanResend(false);
    setError('');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    
    try {
      await onResend();
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-green-200">
            <div className="p-4 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">✅ Verification Successful!</h2>
            <p className="text-slate-600 mb-6">Your account has been verified successfully.</p>
            <div className="animate-pulse">
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-slate-500 mt-2">Redirecting...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-lg">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">🔐 OTP Verification</h1>
          <p className="text-slate-300">Enter the 6-digit code sent to</p>
          <p className="text-yellow-400 font-bold">{mobile}</p>
        </div>

        {/* Demo OTP Display */}
        {demoOTP && (
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 mb-6 text-center">
            <p className="text-yellow-800 font-bold text-sm mb-1">🔍 DEMO MODE</p>
            <p className="text-yellow-700 text-xs">Your OTP: <span className="font-bold text-lg">{demoOTP}</span></p>
          </div>
        )}

        {/* OTP Form */}
        <div className="bg-white rounded-2xl shadow-2xl border-4 border-slate-200 p-8">
          {/* OTP Input */}
          <div className="flex gap-3 justify-center mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                value={digit}
                onChange={e => handleInputChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-slate-300 rounded-xl
                         focus:border-blue-500 focus:outline-none transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
                maxLength={1}
                disabled={isVerifying || isLoading}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-4 text-center">
              <p className="text-red-700 font-semibold text-sm">{error}</p>
            </div>
          )}

          {/* Timer and Resend */}
          <div className="text-center mb-6">
            {!canResend ? (
              <p className="text-slate-600 text-sm">
                Resend OTP in <span className="font-bold text-blue-600">{timer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors
                         flex items-center justify-center gap-2 mx-auto"
              >
                <RefreshCw size={16} />
                Resend OTP
              </button>
            )}
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleVerify()}
            disabled={otp.some(digit => digit === '') || isVerifying || isLoading}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white
                     font-bold text-lg rounded-xl transition-all duration-300 shadow-lg
                     hover:from-blue-700 hover:to-blue-900 hover:shadow-xl
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-3"
          >
            {isVerifying ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </>
            ) : (
              <>
                <Shield size={20} />
                Verify OTP
              </>
            )}
          </button>

          {/* Back Button */}
          <button
            onClick={onBack}
            disabled={isVerifying || isLoading}
            className="w-full mt-4 py-3 px-6 text-slate-600 hover:text-slate-800 font-semibold
                     transition-colors flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} />
            Back to Registration
          </button>
        </div>
      </div>
    </div>
  );
};
    
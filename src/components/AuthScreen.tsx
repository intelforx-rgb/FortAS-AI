import React, { useState } from 'react';
import { Factory, LogIn, UserPlus, ArrowLeft, Eye, EyeOff, Mail, Phone, User, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { OTPVerification } from './OTPVerification';
import type { RegisterData, LoginData } from '../types';

interface AuthScreenProps {
  onComplete: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onComplete }) => {
  const { register, login, sendOTP, verifyOTP, isLoading, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [pendingMobile, setPendingMobile] = useState('');
  const [pendingUserData, setPendingUserData] = useState<RegisterData | null>(null);
  const [demoOTP, setDemoOTP] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    clearError();
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login flow
      const credentials: LoginData = {
        emailOrMobile: formData.email || formData.mobile,
        password: formData.password
      };
      
      const success = await login(credentials);
      if (success) {
        // Send OTP for login verification
        const user = JSON.parse(localStorage.getItem('cemtras_current_user') || '{}');
        if (user.mobile) {
          const otpResponse = await sendOTP(user.mobile);
          if (otpResponse.success) {
            setPendingMobile(user.mobile);
            setDemoOTP(otpResponse.otp || '');
            setShowOTP(true);
          }
        }
      }
    } else {
      // Registration flow
      if (formData.password !== formData.confirmPassword) {
        return; // Error will be shown in UI
      }
      
      const userData: RegisterData = {
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password
      };
      
      // Send OTP first
      const otpResponse = await sendOTP(formData.mobile);
      if (otpResponse.success) {
        setPendingUserData(userData);
        setPendingMobile(formData.mobile);
        setDemoOTP(otpResponse.otp || '');
        setShowOTP(true);
      }
    }
  };

  const handleOTPVerify = async (otp: string): Promise<boolean> => {
    const isValid = await verifyOTP(pendingMobile, otp);
    
    if (isValid) {
      if (pendingUserData) {
        // Complete registration
        const success = await register(pendingUserData);
        if (success) {
          setTimeout(() => onComplete(), 1500);
          return true;
        }
      } else {
        // Complete login
        setTimeout(() => onComplete(), 1500);
        return true;
      }
    }
    
    return false;
  };

  const handleOTPResend = async (): Promise<void> => {
    const otpResponse = await sendOTP(pendingMobile);
    if (otpResponse.success) {
      setDemoOTP(otpResponse.otp || '');
    }
  };

  const handleOTPBack = () => {
    setShowOTP(false);
    setPendingMobile('');
    setPendingUserData(null);
    setDemoOTP('');
  };

  if (showOTP) {
    return (
      <OTPVerification
        mobile={pendingMobile}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        onBack={handleOTPBack}
        isLoading={isLoading}
        demoOTP={demoOTP}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 flex items-center justify-center p-6">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-yellow-500 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-blue-500 rounded-lg rotate-45"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border-4 border-white rounded-full"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg">
              <Factory className="text-white" size={32} />
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-500">
              <img 
                src="/untitled (10).jpeg" 
                alt="FortAS AI"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2"> FortAS AI</h1>
          <p className="text-slate-300">Secure access to your technical AI assistant</p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl border-4 border-slate-200 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 px-6 font-bold text-lg transition-all duration-300 ${
                isLogin 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <LogIn className="inline mr-2" size={20} />
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 px-6 font-bold text-lg transition-all duration-300 ${
                !isLogin 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <UserPlus className="inline mr-2" size={20} />
              Register
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 mb-6 text-center">
                <p className="text-red-700 font-semibold text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Register Fields */}
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors font-semibold"
                    required={!isLogin}
                  />
                </div>
              )}

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors font-semibold"
                  required
                />
              </div>

              {/* Mobile (Register only) */}
              {!isLogin && (
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-300 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors font-semibold"
                    required={!isLogin}
                  />
                </div>
              )}

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-12 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors font-semibold"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password (Register only) */}
              {!isLogin && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors font-semibold ${
                      formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-300 focus:border-yellow-500'
                    }`}
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )}

              {/* Password Mismatch Warning */}
              {!isLogin && formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <div className="text-red-600 text-sm font-semibold">
                  Passwords do not match
                </div>
              )}

              {/* Remember Me (Login only) */}
              {isLogin && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-2 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-slate-700 font-semibold">
                    Remember Me
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || (!isLogin && formData.password !== formData.confirmPassword)}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
                  isLogin
                    ? 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isLogin ? 'Logging in...' : 'Registering...'}
                  </>
                ) : (
                  <>
                    {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                    {isLogin ? 'Login with OTP' : 'Register with OTP'}
                  </>
                )}
              </button>

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="text-center">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => window.location.reload()}
            className="text-white hover:text-yellow-400 font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft size={20} />
            Back to Access Choice
          </button>
        </div>
      </div>
    </div>
  );
};
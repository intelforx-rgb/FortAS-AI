import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/authService';
import type { User, AuthState, RegisterData, LoginData, UserProfile, PasswordResetData } from '../types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginData) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  sendOTP: (mobile: string) => Promise<{ success: boolean; message: string; otp?: string }>;
  verifyOTP: (mobile: string, otp: string) => Promise<boolean>;
  sendPasswordResetOTP: (email: string) => Promise<{ success: boolean; message: string; otp?: string }>;
  resetPassword: (resetData: PasswordResetData) => Promise<boolean>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  upgradeToPremium: () => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Check for existing user session on mount
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setAuthState({
        user: currentUser,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (credentials: LoginData, rememberMe: boolean = false): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await AuthService.login(credentials);
      if (user) {
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Invalid credentials'
        }));
        return false;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Login failed. Please try again.'
      }));
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await AuthService.register(userData);
      AuthService.saveCurrentUser(user);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Registration failed. Please try again.'
      }));
      return false;
    }
  };

  const sendPasswordResetOTP = async (email: string) => {
    try {
      const response = await AuthService.sendOTP(email, 'reset');
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send reset OTP. Please try again.'
      };
    }
  };

  const resetPassword = async (resetData: PasswordResetData): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await AuthService.resetPassword(resetData);
      if (success) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Password reset failed. Please try again.'
        }));
        return false;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Password reset failed. Please try again.'
      }));
      return false;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!authState.user) return false;
    
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const updatedUser = await AuthService.updateProfile(authState.user.id, updates);
      if (updatedUser) {
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
          isLoading: false
        }));
        return true;
      }
      return false;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Profile update failed. Please try again.'
      }));
      return false;
    }
  };

  const upgradeToPremium = async (): Promise<boolean> => {
    if (!authState.user) return false;
    
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await AuthService.upgradeToPremium(authState.user.id);
      if (success) {
        const updatedUser = { ...authState.user, membershipType: 'Premium' as const };
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
          isLoading: false
        }));
        return true;
      }
      return false;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Upgrade failed. Please try again.'
      }));
      return false;
    }
  };

  const logout = () => {
    AuthService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  };

  const sendOTP = async (mobile: string) => {
    try {
      const response = await AuthService.sendOTP(mobile);
      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      };
    }
  };

  const verifyOTP = async (mobile: string, otp: string): Promise<boolean> => {
    try {
      return await AuthService.verifyOTP(mobile, otp);
    } catch (error) {
      return false;
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    sendOTP,
    verifyOTP,
    sendPasswordResetOTP,
    resetPassword,
    updateProfile,
    upgradeToPremium,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
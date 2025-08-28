export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: FileUpload[];
}

export type UserRole = 'Operations' | 'Project Management' | 'Sales & Marketing' | 'Procurement' | 'Erection & Commissioning' | 'Engineering & Design';

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  selectedRole: UserRole | 'General AI';
  uploadedFiles?: FileUpload[];
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  isAuthenticated: boolean;
  registrationDate: Date;
  membershipType: 'Free' | 'Premium';
  preferredRole?: UserRole | 'General AI';
  profilePicture?: string;
  lastLoginDate?: Date;
  activityStats?: {
    totalChats: number;
    filesUploaded: number;
    reportsGenerated: number;
  };
}

export interface OTPResponse {
  success: boolean;
  message: string;
  otpSent?: boolean;
  otp?: string; // For demo purposes
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  role: UserRole | 'General AI';
  createdAt: Date;
  lastUpdated: Date;
}

export interface ChatHistoryState {
  histories: ChatHistory[];
  currentChatId: string | null;
  maxHistories: number;
}

export interface FileUpload {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string | ArrayBuffer;
  url?: string;
  uploadDate: Date;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  membershipType: 'Free' | 'Premium';
  preferredRole?: UserRole | 'General AI';
  profilePicture?: string;
  registrationDate: Date;
  lastLoginDate?: Date;
  activityStats: {
    totalChats: number;
    filesUploaded: number;
    reportsGenerated: number;
  };
  settings: {
    autoLogout: boolean;
    rememberMe: boolean;
    notifications: boolean;
  };
}

export interface PasswordResetData {
  email: string;
  newPassword: string;
  otp: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
}

export interface LoginData {
  emailOrMobile: string;
  password: string;
}
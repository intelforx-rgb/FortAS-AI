export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
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
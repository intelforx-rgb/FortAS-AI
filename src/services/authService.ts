import type { User, RegisterData, LoginData, OTPResponse, UserProfile, PasswordResetData } from '../types';

// Simple password hashing (in production, use bcrypt or similar)
class PasswordUtils {
  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'salt_key_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const hashedInput = await this.hashPassword(password);
    return hashedInput === hashedPassword;
  }
}

export class AuthService {
  private static users: Map<string, User & { hashedPassword: string }> = new Map();
  private static otpStore: Map<string, { otp: string; expires: number; type: 'register' | 'login' | 'reset' }> = new Map();
  private static sessions: Map<string, { userId: string; expires: number }> = new Map();

  // Generate random 6-digit OTP
  private static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate session token
  private static generateSessionToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Load users from localStorage
  private static loadUsers(): void {
    const storedUsers = JSON.parse(localStorage.getItem('fortas_users') || '[]');
    storedUsers.forEach((user: User & { hashedPassword: string }) => {
      this.users.set(user.email, user);
      this.users.set(user.mobile, user);
    });
  }

  // Save users to localStorage
  private static saveUsers(): void {
    const usersArray = Array.from(this.users.values())
      .filter((user, index, arr) => arr.findIndex(u => u.id === user.id) === index);
    localStorage.setItem('fortas_users', JSON.stringify(usersArray));
  }

  // Mock OTP sending service
  static async sendOTP(identifier: string, type: 'register' | 'login' | 'reset' = 'register'): Promise<OTPResponse> {
    const otp = this.generateOTP();
    const expires = Date.now() + 300000; // 5 minutes expiry
    
    this.otpStore.set(identifier, { otp, expires, type });
    
    // Log OTP to console for demo purposes
    console.log(`🔐 OTP sent to ${identifier} (${type}): ${otp}`);
    
    return {
      success: true,
      message: `OTP sent to ${identifier}`,
      otpSent: true,
      otp // Include for demo purposes
    };
  }

  // Verify OTP
  static async verifyOTP(identifier: string, otp: string, type: 'register' | 'login' | 'reset' = 'register'): Promise<boolean> {
    const stored = this.otpStore.get(identifier);
    
    if (!stored || stored.type !== type) {
      return false;
    }

    if (Date.now() > stored.expires) {
      this.otpStore.delete(identifier);
      return false;
    }

    if (stored.otp === otp) {
      this.otpStore.delete(identifier);
      return true;
    }

    return false;
  }

  // Register new user
  static async register(userData: RegisterData): Promise<User> {
    this.loadUsers();
    
    // Check if user already exists
    if (this.users.has(userData.email) || this.users.has(userData.mobile)) {
      throw new Error('User already exists with this email or mobile number');
    }

    const userId = `user_${Date.now()}`;
    const hashedPassword = await PasswordUtils.hashPassword(userData.password);
    
    const user: User = {
      id: userId,
      fullName: userData.fullName,
      email: userData.email,
      mobile: userData.mobile,
      isAuthenticated: true,
      registrationDate: new Date(),
      membershipType: 'Free', // Default to Free
      lastLoginDate: new Date(),
      activityStats: {
        totalChats: 0,
        filesUploaded: 0,
        reportsGenerated: 0
      }
    };

    // Store user with hashed password
    const userWithPassword = { ...user, hashedPassword };
    this.users.set(userData.email, userWithPassword);
    this.users.set(userData.mobile, userWithPassword);
    
    this.saveUsers();
    return user;
  }

  // Login user
  static async login(credentials: LoginData): Promise<User | null> {
    this.loadUsers();
    
    const user = this.users.get(credentials.emailOrMobile);
    
    if (!user) {
      return null;
    }

    const isValidPassword = await PasswordUtils.verifyPassword(credentials.password, user.hashedPassword);
    if (!isValidPassword) {
      return null;
    }

    // Update last login date
    user.lastLoginDate = new Date();
    this.saveUsers();

    // Create session
    const sessionToken = this.generateSessionToken();
    const sessionExpiry = rememberMe 
      ? Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      : Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    
    this.sessions.set(sessionToken, { userId: user.id, expires: sessionExpiry });
    localStorage.setItem('fortas_session_token', sessionToken);

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      isAuthenticated: true,
      registrationDate: user.registrationDate,
      membershipType: user.membershipType,
      preferredRole: user.preferredRole,
      profilePicture: user.profilePicture,
      lastLoginDate: user.lastLoginDate,
      activityStats: user.activityStats
    };
  }

  // Password reset
  static async resetPassword(resetData: PasswordResetData): Promise<boolean> {
    this.loadUsers();
    
    const user = this.users.get(resetData.email);
    if (!user) {
      return false;
    }

    const isValidOTP = await this.verifyOTP(resetData.email, resetData.otp, 'reset');
    if (!isValidOTP) {
      return false;
    }

    // Update password
    user.hashedPassword = await PasswordUtils.hashPassword(resetData.newPassword);
    this.saveUsers();
    
    return true;
  }

  // Get current user from session
  static getCurrentUser(): User | null {
    const sessionToken = localStorage.getItem('fortas_session_token');
    if (!sessionToken) {
      return null;
    }

    const session = this.sessions.get(sessionToken);
    if (!session || Date.now() > session.expires) {
      this.logout();
      return null;
    }

    this.loadUsers();
    const user = Array.from(this.users.values()).find(u => u.id === session.userId);
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      isAuthenticated: true,
      registrationDate: user.registrationDate,
      membershipType: user.membershipType,
      preferredRole: user.preferredRole,
      profilePicture: user.profilePicture,
      lastLoginDate: user.lastLoginDate,
      activityStats: user.activityStats
    };
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<User | null> {
    this.loadUsers();
    
    const userEntry = Array.from(this.users.entries()).find(([_, user]) => user.id === userId);
    if (!userEntry) {
      return null;
    }

    const [key, user] = userEntry;
    
    // Update user data
    Object.assign(user, updates);
    this.saveUsers();

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      isAuthenticated: true,
      registrationDate: user.registrationDate,
      membershipType: user.membershipType,
      preferredRole: user.preferredRole,
      profilePicture: user.profilePicture,
      lastLoginDate: user.lastLoginDate,
      activityStats: user.activityStats
    };
  }

  // Update activity stats
  static updateActivityStats(userId: string, type: 'chat' | 'file' | 'report'): void {
    this.loadUsers();
    
    const userEntry = Array.from(this.users.entries()).find(([_, user]) => user.id === userId);
    if (!userEntry) return;

    const [key, user] = userEntry;
    
    if (!user.activityStats) {
      user.activityStats = { totalChats: 0, filesUploaded: 0, reportsGenerated: 0 };
    }

    switch (type) {
      case 'chat':
        user.activityStats.totalChats++;
        break;
      case 'file':
        user.activityStats.filesUploaded++;
        break;
      case 'report':
        user.activityStats.reportsGenerated++;
        break;
    }

    this.saveUsers();
  }

  // Upgrade to premium
  static async upgradeToPremium(userId: string): Promise<boolean> {
    this.loadUsers();
    
    const userEntry = Array.from(this.users.entries()).find(([_, user]) => user.id === userId);
    if (!userEntry) {
      return false;
    }

    const [key, user] = userEntry;
    user.membershipType = 'Premium';
    this.saveUsers();
    
    return true;
  }

  // Logout user
  static logout(): void {
    const sessionToken = localStorage.getItem('fortas_session_token');
    if (sessionToken) {
      this.sessions.delete(sessionToken);
    }
    localStorage.removeItem('fortas_session_token');
  }

  // Check session validity
  static isSessionValid(): boolean {
    const sessionToken = localStorage.getItem('fortas_session_token');
    if (!sessionToken) {
      return false;
    }

    const session = this.sessions.get(sessionToken);
    return session ? Date.now() < session.expires : false;
  }
}
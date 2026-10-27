export type AuthTab = 'signin' | 'signup' | 'otp';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  avatarUrl: string;
  authMethod: 'password' | 'google' | 'github' | 'otp' | 'microsoft';
  lastLogin: string;
  twoFactorEnabled: boolean;
  activeSessionsCount: number;
}

export type Language = 'en' | 'hi';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, UserCheck, ShieldAlert } from 'lucide-react';
import { Language, UserProfile } from '../types/auth';
import { DEMO_USERS, I18N } from '../data/mockUsers';

interface SignInFormProps {
  language: Language;
  onSuccessLogin: (user: UserProfile) => void;
  onForgotPassword: () => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  language,
  onSuccessLogin,
  onForgotPassword,
  onToast,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSSO, setActiveSSO] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const t = I18N[language];

  const handleSelectDemoUser = (user: UserProfile) => {
    setEmail(user.email);
    setPassword('••••••••••••'); // Placeholder representation
    setValidationError(null);
    onToast(
      'info',
      language === 'hi' ? 'डेमो क्रेडेंशियल भरे गए' : 'Demo Account Selected',
      `${user.name} (${user.role})`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!email.trim()) {
      setValidationError(
        language === 'hi'
          ? 'कृपया अपना कार्य ईमेल दर्ज करें'
          : 'Please enter your work email address'
      );
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setValidationError(
        language === 'hi'
          ? 'कृपया एक वैध ईमेल पता दर्ज करें'
          : 'Please enter a valid email format'
      );
      return;
    }

    if (!password) {
      setValidationError(
        language === 'hi'
          ? 'कृपया अपना पासवर्ड दर्ज करें'
          : 'Please enter your password'
      );
      return;
    }

    setIsLoading(true);

    // Simulate authentic zero-trust authentication handshake
    setTimeout(() => {
      setIsLoading(false);
      // Check if matches a demo user or construct a session
      const matched = DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      const authenticatedUser: UserProfile = matched || {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: email.trim(),
        role: 'Verified Organization Member',
        company: 'Global Technologies Inc.',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
        authMethod: 'password',
        lastLogin: 'Just now (Secure Local Session)',
        twoFactorEnabled: true,
        activeSessionsCount: 1,
      };

      onSuccessLogin(authenticatedUser);
      onToast(
        'success',
        language === 'hi' ? 'लॉगिन सफल!' : 'Authentication Successful',
        language === 'hi'
          ? `स्वागत है, ${authenticatedUser.name}`
          : `Welcome back, ${authenticatedUser.name}`
      );
    }, 900);
  };

  const handleSocialSSO = (provider: 'google' | 'github' | 'microsoft') => {
    setActiveSSO(provider);
    setTimeout(() => {
      setActiveSSO(null);
      const ssoUser: UserProfile = {
        id: `usr_${provider}_${Date.now()}`,
        name: provider === 'google' ? 'Marcus Chen' : provider === 'github' ? 'Alex Wright' : 'Priya Sharma',
        email: `${provider}.user@auraid.io`,
        role: 'Enterprise Single Sign-On Member',
        company: 'Nexus Systems',
        avatarUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
        authMethod: provider,
        lastLogin: 'Just now (SAML 2.0 / OIDC Verified)',
        twoFactorEnabled: true,
        activeSessionsCount: 2,
      };
      onSuccessLogin(ssoUser);
      onToast(
        'success',
        language === 'hi' ? `${provider} से लॉगिन संपन्न` : `Authenticated via ${provider.toUpperCase()}`,
        `SSO session token verified.`
      );
    }, 1100);
  };

  return (
    <div className="w-full">
      {/* Demo Users quick select strip */}
      <div className="mb-6 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/90">
        <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-400">
          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>{t.demoQuickFill}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {DEMO_USERS.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => handleSelectDemoUser(user)}
              className="text-left px-2.5 py-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-indigo-500/50 transition-all text-xs group"
            >
              <div className="font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                {user.name}
              </div>
              <div className="text-[11px] text-slate-400 truncate font-mono">
                {user.role.split(' ')[0]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {validationError && (
        <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            {t.emailLabel}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t.passwordLabel}
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {t.forgotPassword}
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.passwordPlaceholder}
              autoComplete="current-password"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me option */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-950 accent-indigo-600"
            />
            <span className="text-xs text-slate-400 hover:text-slate-300 transition-colors">
              {t.rememberMe}
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.signingIn}</span>
            </>
          ) : (
            <>
              <span>{t.signInButton}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Social SSO Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-slate-950 text-slate-400 font-medium">
            {t.orContinueWith}
          </span>
        </div>
      </div>

      {/* SSO Buttons */}
      <div className="space-y-2">
        <button
          type="button"
          disabled={!!activeSSO}
          onClick={() => handleSocialSSO('google')}
          className="w-full py-2.5 px-4 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
        >
          {activeSSO === 'google' ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.2 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.1L1.6 16.1C3.5 20.4 7.4 23 12 23z"
              />
            </svg>
          )}
          <span>{t.googleSSO}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!!activeSSO}
            onClick={() => handleSocialSSO('github')}
            className="py-2.5 px-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {activeSSO === 'github' ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            ) : (
              <svg className="w-4 h-4 fill-current text-slate-200" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
            <span className="truncate">{t.githubSSO}</span>
          </button>

          <button
            type="button"
            disabled={!!activeSSO}
            onClick={() => handleSocialSSO('microsoft')}
            className="py-2.5 px-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {activeSSO === 'microsoft' ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
            )}
            <span className="truncate">{t.microsoftSSO}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

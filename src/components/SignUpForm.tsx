import React, { useState, useMemo } from 'react';
import { Mail, Lock, User, Building, Eye, EyeOff, Check, X, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { Language, UserProfile } from '../types/auth';
import { I18N } from '../data/mockUsers';

interface SignUpFormProps {
  language: Language;
  onSuccessRegister: (user: UserProfile) => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  language,
  onSuccessRegister,
  onToast,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t = I18N[language];

  // Real-time password evaluation
  const passwordChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const strengthScore = useMemo(() => {
    let score = 0;
    if (passwordChecks.length) score += 1;
    if (passwordChecks.hasUpper) score += 1;
    if (passwordChecks.hasNumber) score += 1;
    if (passwordChecks.hasSymbol) score += 1;
    return score;
  }, [passwordChecks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please provide your full name');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(language === 'hi' ? 'कृपया एक वैध कार्य ईमेल दर्ज करें' : 'Please enter a valid work email address');
      return;
    }

    if (strengthScore < 3) {
      setErrorMsg(
        language === 'hi'
          ? 'पासवर्ड सुरक्षित नहीं है। कम से कम 8 अक्षर, बड़ा अक्षर और अंक शामिल करें।'
          : 'Password is too weak. Please fulfill at least 3 strength criteria.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(language === 'hi' ? 'पासवर्ड मेल नहीं खा रहे हैं' : 'Passwords do not match');
      return;
    }

    if (!termsAgreed) {
      setErrorMsg(
        language === 'hi'
          ? 'कृपया सेवा की शर्तों को स्वीकार करें'
          : 'Please accept the Master Services Agreement to continue'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: fullName.trim(),
        email: email.trim(),
        role: 'Workspace Administrator',
        company: company.trim() || 'AuraID Workspace',
        avatarUrl:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
        authMethod: 'password',
        lastLogin: 'Just now (Initial Provisioning)',
        twoFactorEnabled: false,
        activeSessionsCount: 1,
      };

      onSuccessRegister(newUser);
      onToast(
        'success',
        language === 'hi' ? 'खाता सफलतापूर्वक बना!' : 'Account Created Successfully',
        language === 'hi' ? 'कार्यक्षेत्र कंसोल में आपका स्वागत है' : 'Your enterprise workspace is ready.'
      );
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          {t.fullNameLabel}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t.fullNamePlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Work Email */}
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
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          {t.companyLabel}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Building className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={t.companyPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Password with Strength Bar */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          {t.passwordLabel}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Lock className="w-4 h-4" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t.passwordPlaceholder}
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

        {/* Strength meter bars */}
        {password.length > 0 && (
          <div className="mt-2 space-y-1.5">
            <div className="flex gap-1 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  strengthScore <= 1
                    ? 'w-1/4 bg-rose-500'
                    : strengthScore === 2
                    ? 'w-2/4 bg-amber-500'
                    : strengthScore === 3
                    ? 'w-3/4 bg-emerald-500'
                    : 'w-full bg-indigo-500'
                }`}
              />
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
              <span className={`flex items-center gap-1 ${passwordChecks.length ? 'text-emerald-400' : ''}`}>
                {passwordChecks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-600" />}
                8+ characters
              </span>
              <span className={`flex items-center gap-1 ${passwordChecks.hasUpper ? 'text-emerald-400' : ''}`}>
                {passwordChecks.hasUpper ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-600" />}
                Uppercase letter
              </span>
              <span className={`flex items-center gap-1 ${passwordChecks.hasNumber ? 'text-emerald-400' : ''}`}>
                {passwordChecks.hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-600" />}
                One number
              </span>
              <span className={`flex items-center gap-1 ${passwordChecks.hasSymbol ? 'text-emerald-400' : ''}`}>
                {passwordChecks.hasSymbol ? <Check className="w-3 h-3" /> : <X className="w-3 h-3 text-slate-600" />}
                Special symbol
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
          {t.confirmPasswordLabel}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t.confirmPasswordPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={termsAgreed}
            onChange={(e) => setTermsAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
          />
          <span className="text-xs text-slate-400 hover:text-slate-300 leading-snug">
            {t.termsAgreement}
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
            <span>{t.creatingAccount}</span>
          </>
        ) : (
          <>
            <span>{t.signUpButton}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};

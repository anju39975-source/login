import React, { useState, useRef, useEffect } from 'react';
import { Smartphone, ArrowRight, Loader2, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';
import { Language, UserProfile } from '../types/auth';
import { I18N } from '../data/mockUsers';

interface OtpLoginFormProps {
  language: Language;
  onSuccessLogin: (user: UserProfile) => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const OtpLoginForm: React.FC<OtpLoginFormProps> = ({
  language,
  onSuccessLogin,
  onToast,
}) => {
  const [target, setTarget] = useState('+91 98765 43210');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(45);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const t = I18N[language];

  // Countdown timer when on verify step
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'verify' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) {
      setErrorMsg(language === 'hi' ? 'कृपया मान्य मोबाइल या ईमेल दर्ज करें' : 'Please enter a valid mobile number or email');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
      setCountdown(45);
      setErrorMsg(null);
      // Auto-prefill a test code after a quick moment or allow manual typing
      setDigits(['4', '8', '2', '9', '1', '0']);
      onToast(
        'info',
        language === 'hi' ? 'OTP भेजा गया' : 'Verification Code Dispatched',
        language === 'hi' ? 'परीक्षण कोड: 482910' : 'Demo Code: 482910'
      );
    }, 700);
  };

  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newDigits = [...digits];
    newDigits[index] = val.slice(-1);
    setDigits(newDigits);

    // Auto advance
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      setDigits(pasteData.split(''));
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) {
      setErrorMsg(language === 'hi' ? 'कृपया पूरा 6-अंकीय कोड दर्ज करें' : 'Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const otpUser: UserProfile = {
        id: `usr_otp_${Date.now()}`,
        name: 'Verified Mobile Subscriber',
        email: target.includes('@') ? target : 'sms.verified@auraid.io',
        role: 'Verified Mobile Operator',
        company: 'TeleSecure Network',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
        authMethod: 'otp',
        lastLogin: 'Just now (SMS / Token Authenticated)',
        twoFactorEnabled: true,
        activeSessionsCount: 1,
      };

      onSuccessLogin(otpUser);
      onToast(
        'success',
        language === 'hi' ? 'सत्यापन सफल!' : 'OTP Verified Successfully',
        `Logged in via ${target}`
      );
    }, 900);
  };

  return (
    <div className="w-full">
      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {errorMsg}
        </div>
      )}

      {step === 'input' ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 leading-relaxed">
            {t.otpSub}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {t.otpPhoneOrEmail}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Smartphone className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="+91 98765 43210 or user@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending code...</span>
              </>
            ) : (
              <>
                <span>{t.sendCode}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2">
              <KeyRound className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-400">
              {t.codeSentTo} <span className="font-semibold text-slate-200">{target}</span>
            </p>
          </div>

          {/* 6 Digit Inputs */}
          <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
              />
            ))}
          </div>

          {/* Resend and timer */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <button
              type="button"
              onClick={() => {
                setStep('input');
                setErrorMsg(null);
              }}
              className="hover:text-slate-200 transition-colors text-slate-400"
            >
              Change phone/email
            </button>

            {countdown > 0 ? (
              <span className="font-mono text-slate-400">
                {t.resendIn} {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setCountdown(45);
                  onToast('info', 'Code resent', 'New 6-digit code generated');
                }}
                className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.resendNow}</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || digits.join('').length < 6}
            className="w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.verifyingOtp}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.verifyAndLogin}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Mail, X, ArrowLeft, CheckCircle2, Loader2, KeyRound } from 'lucide-react';
import { Language } from '../types/auth';
import { I18N } from '../data/mockUsers';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  language,
  onToast,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const t = I18N[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(language === 'hi' ? 'कृपया एक मान्य कार्य ईमेल दर्ज करें' : 'Please provide a valid work email');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onToast(
        'success',
        language === 'hi' ? 'रीसेट लिंक भेजा गया' : 'Password Recovery Link Sent',
        email
      );
    }, 900);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setEmail('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl">
        <button
          onClick={handleReset}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <KeyRound className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1.5">{t.forgotTitle}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">{t.forgotDesc}</p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="alex.wright@auraid.io"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-800 focus:border-indigo-500 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing request...</span>
                  </>
                ) : (
                  <span>{t.sendRecovery}</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Check Your Work Inbox</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              A secure password reset authorization token has been sent to{' '}
              <span className="font-semibold text-slate-200">{email}</span>. Valid for 15 minutes.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.backToLogin}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

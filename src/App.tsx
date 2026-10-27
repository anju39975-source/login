/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles,
  Layers,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { AuthTab, Language, ToastMessage, UserProfile } from './types/auth';
import { I18N } from './data/mockUsers';
import { Header } from './components/Header';
import { SignInForm } from './components/SignInForm';
import { SignUpForm } from './components/SignUpForm';
import { OtpLoginForm } from './components/OtpLoginForm';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { ComplianceModal } from './components/ComplianceModal';
import { UserDashboard } from './components/UserDashboard';
import { ToastContainer } from './components/Toast';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authTab, setAuthTab] = useState<AuthTab>('signin');
  const [language, setLanguage] = useState<Language>('hi'); // Defaulting to Hindi/English friendly experience as requested in Hindi
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const t = I18N[language];

  const addToast = useCallback(
    (type: 'success' | 'error' | 'info', title: string, message?: string) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);

      // Auto dismiss after 4.5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 4500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleLogout = () => {
    const userName = currentUser?.name || 'User';
    setCurrentUser(null);
    setAuthTab('signin');
    addToast(
      'info',
      language === 'hi' ? 'सत्र समाप्त हुआ' : 'Logged Out',
      language === 'hi' ? `${userName} का सत्र सुरक्षित रूप से समाप्त किया गया` : `Session ended safely for ${userName}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Header */}
      <Header
        language={language}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'))}
        onOpenCompliance={() => setIsComplianceOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {currentUser ? (
          /* Authenticated Dashboard View */
          <UserDashboard
            user={currentUser}
            language={language}
            onLogout={handleLogout}
            onToast={addToast}
          />
        ) : (
          /* Authentication Split Container (Baseline 1440px desktop capable) */
          <div className="w-full max-w-6xl mx-auto rounded-3xl bg-slate-900/60 border border-slate-800/90 shadow-2xl backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Showcase Side (Hidden on small screens, 5 cols on desktop) */}
            <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 bg-slate-950 overflow-hidden border-r border-slate-800/80">
              {/* Architectural Backdrop image with measured contrast scrim */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/src/assets/images/login_showcase_bg_1793064392694.jpg"
                  alt="AuraID Headquarters Architecture"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-35 filter brightness-90 saturate-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/40" />
              </div>

              {/* Showcase Header */}
              <div className="relative z-10">
                {/* Zero-Pill Compliance tags (pure unboxed text with middle dots) */}
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-6">
                  <span>ISO 27001</span>
                  <span aria-hidden="true">·</span>
                  <span>SOC 2 Type II</span>
                  <span aria-hidden="true">·</span>
                  <span>FIDO2 Ready</span>
                </div>

                <h2 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  {language === 'hi'
                    ? 'उद्यम-स्तरीय सुरक्षित प्रमाणीकरण और पहचान प्रबंधन।'
                    : 'Unified Zero-Trust Identity & Access Management.'}
                </h2>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  {language === 'hi'
                    ? 'एकल साइन-ऑन (SSO), बहु-कारक प्रमाणीकरण (MFA), और त्वरित एक्सेस नियंत्रण।'
                    : 'Streamline developer authentication across 1,000+ cloud instances with hardware security tokens.'}
                </p>
              </div>

              {/* Testimonial & Metrics */}
              <div className="relative z-10 space-y-6 pt-10">
                {/* Attributable Quote */}
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    {t.heroQuote}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                      alt={t.quoteAuthor}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-indigo-400/30"
                    />
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{t.quoteAuthor}</p>
                      <p className="text-[11px] text-slate-400 leading-tight">{t.quoteRole}</p>
                    </div>
                  </div>
                </div>

                {/* Quantitative Rigor Metrics strip */}
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="block text-lg font-bold font-mono tabular-nums text-white">
                      {t.stat1Value}
                    </span>
                    <span className="block text-[11px] text-slate-400 leading-tight">
                      {t.stat1Label}
                    </span>
                  </div>
                  <div>
                    <span className="block text-lg font-bold font-mono tabular-nums text-white">
                      {t.stat2Value}
                    </span>
                    <span className="block text-[11px] text-slate-400 leading-tight">
                      {t.stat2Label}
                    </span>
                  </div>
                  <div>
                    <span className="block text-lg font-bold font-mono tabular-nums text-indigo-400">
                      {t.stat3Value}
                    </span>
                    <span className="block text-[11px] text-slate-400 leading-tight">
                      {t.stat3Label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Authentication Form Area (7 cols on desktop) */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                {/* Segmented Tab Controls (Sign In / Sign Up / OTP) */}
                <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 mb-6">
                  <button
                    type="button"
                    onClick={() => setAuthTab('signin')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      authTab === 'signin'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.tabSignIn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab('signup')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      authTab === 'signup'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.tabSignUp}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab('otp')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                      authTab === 'otp'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.tabOtp}
                  </button>
                </div>

                {/* Form Title & Context */}
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {authTab === 'signin' && t.welcomeBack}
                    {authTab === 'signup' && t.createHeader}
                    {authTab === 'otp' && t.otpHeader}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {authTab === 'signin' && t.subWelcome}
                    {authTab === 'signup' && t.createSub}
                    {authTab === 'otp' && t.otpSub}
                  </p>
                </div>

                {/* Interactive Form Component */}
                {authTab === 'signin' && (
                  <SignInForm
                    language={language}
                    onSuccessLogin={(user) => setCurrentUser(user)}
                    onForgotPassword={() => setIsForgotOpen(true)}
                    onToast={addToast}
                  />
                )}

                {authTab === 'signup' && (
                  <SignUpForm
                    language={language}
                    onSuccessRegister={(user) => setCurrentUser(user)}
                    onToast={addToast}
                  />
                )}

                {authTab === 'otp' && (
                  <OtpLoginForm
                    language={language}
                    onSuccessLogin={(user) => setCurrentUser(user)}
                    onToast={addToast}
                  />
                )}
              </div>

              {/* Quiet Footer Guarantee */}
              <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>256-Bit Encrypted · FIPS 140-3 Compliant</span>
                </span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsComplianceOpen(true)}
                    className="hover:text-slate-300 transition-colors"
                  >
                    {language === 'hi' ? 'सुरक्षा नीतियां' : 'Security Policy'}
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() =>
                      addToast(
                        'info',
                        language === 'hi' ? 'सहायता केंद्र' : 'Support Desk',
                        'Contact support@auraid.io or call 24/7 SecOps hotline.'
                      )
                    }
                    className="hover:text-slate-300 transition-colors"
                  >
                    {t.help}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Dialog Modals */}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        language={language}
        onToast={addToast}
      />

      <ComplianceModal
        isOpen={isComplianceOpen}
        onClose={() => setIsComplianceOpen(false)}
        language={language}
      />

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

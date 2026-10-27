import React, { useState } from 'react';
import { 
  LogOut, 
  ShieldCheck, 
  Key, 
  Laptop, 
  Smartphone, 
  Globe, 
  CheckCircle2, 
  AlertTriangle,
  User,
  Building,
  Mail,
  Clock,
  Radio,
  Lock
} from 'lucide-react';
import { UserProfile, Language } from '../types/auth';
import { I18N } from '../data/mockUsers';

interface UserDashboardProps {
  user: UserProfile;
  language: Language;
  onLogout: () => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  language,
  onLogout,
  onToast,
}) => {
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);
  const [sessionCount, setSessionCount] = useState(user.activeSessionsCount);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  const t = I18N[language];

  const handleToggle2FA = () => {
    const nextState = !twoFactor;
    setTwoFactor(nextState);
    onToast(
      nextState ? 'success' : 'info',
      nextState
        ? (language === 'hi' ? 'द्वि-चरणीय सुरक्षा सक्रिय' : 'Two-Factor Authentication Enabled')
        : (language === 'hi' ? 'द्वि-चरणीय सुरक्षा निष्क्रिय' : 'Two-Factor Authentication Disabled'),
      nextState ? 'Hardware & TOTP tokens required on next login.' : 'Basic password authentication active.'
    );
  };

  const handleRevokeSessions = () => {
    setSessionCount(1);
    onToast('success', t.revokedSuccess, language === 'hi' ? 'केवल वर्तमान सत्र सक्रिय है' : 'Current terminal preserved.');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      onToast('error', 'Password too short', 'Minimum 8 characters required');
      return;
    }
    setShowPasswordModal(false);
    setNewPassword('');
    onToast('success', 'Master Password Updated', 'All cryptographic keys re-signed.');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <img
            src={user.avatarUrl}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg shadow-indigo-500/10"
          />
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{user.name}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {t.activeSession}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{user.role}</span>
              <span>·</span>
              <span className="text-indigo-400">{user.company}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-xs font-semibold text-slate-300 hover:text-rose-400 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t.logout}</span>
        </button>
      </div>

      {/* Grid of panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Security Posture */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {t.securityHealth}
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <p className="text-xs font-semibold text-emerald-300">{t.securityHealthy}</p>
              <p className="text-[11px] text-emerald-400/80 mt-0.5 leading-relaxed">
                {t.securityDetails}
              </p>
            </div>

            {/* 2FA Toggle */}
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-200">{t.toggle2fa}</p>
                  <p className="text-[11px] text-slate-500">
                    {twoFactor ? t.enabled : t.disabled}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggle2FA}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    twoFactor ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                  aria-label="Toggle 2FA"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      twoFactor ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Change Password trigger */}
            <div className="mt-4 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="w-full py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                <span>Change Master Password</span>
              </button>
            </div>
          </div>

          {/* Identity details */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t.accountDetails}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" /> Email:
                </span>
                <span className="text-slate-200 font-mono text-[11px] truncate max-w-[170px]">
                  {user.email}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-slate-500" /> Method:
                </span>
                <span className="text-slate-200 uppercase font-semibold text-[11px]">
                  {user.authMethod}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> Last Login:
                </span>
                <span className="text-slate-300 text-[11px]">{user.lastLogin}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Active Sessions & Activity Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Sessions Panel */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Active Authenticated Devices</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Currently running cryptographic sessions for this identity ({sessionCount} active)
                </p>
              </div>
              {sessionCount > 1 && (
                <button
                  type="button"
                  onClick={handleRevokeSessions}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  {t.revokeAllSessions}
                </button>
              )}
            </div>

            <div className="space-y-3">
              {/* Session 1: Current */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">
                        Chrome 132 · Linux / macOS Workstation
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300">
                        THIS DEVICE
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      IP: 198.51.100.24 · Active now · TLS 1.3 End-to-end
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              {/* Session 2 */}
              {sessionCount >= 2 && (
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-200">
                        iOS Mobile Authenticator
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        IP: 203.0.113.88 · Last active 42 mins ago
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Standby</span>
                </div>
              )}

              {/* Session 3 */}
              {sessionCount >= 3 && (
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-200">
                        Firefox Developer Edition · Office Lab
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        IP: 192.0.2.14 · Last active 3 hours ago
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Standby</span>
                </div>
              )}
            </div>
          </div>

          {/* Audit events */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-3">{t.recentActivity}</h3>
            <div className="divide-y divide-slate-800/60 text-xs">
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-200">Session Handshake Established</span>
                  <p className="text-[11px] text-slate-400">Zero-trust token verified with FIDO2 assertion</p>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Just now</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-200">OAuth Access Token Refreshed</span>
                  <p className="text-[11px] text-slate-400">Scoped to read:profile, write:workspace</p>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">18m ago</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-medium text-slate-200">Policy Evaluation Passed</span>
                  <p className="text-[11px] text-slate-400">Device health compliant with corporate posture</p>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">1h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Change Master Password */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h4 className="text-sm font-bold text-white mb-2">Update Master Password</h4>
            <p className="text-xs text-slate-400 mb-4">
              Enter a new secure password for your AuraID identity token.
            </p>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 8 chars)"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

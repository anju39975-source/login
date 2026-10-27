import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { Language } from '../types/auth';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close compliance details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {language === 'hi' ? 'सुरक्षा और अनुपालन सत्यापन' : 'Security & Compliance Specifications'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'hi' ? 'शून्य-विश्वास प्रमाणीकरण वास्तुकला' : 'Zero-Trust Enterprise Identity Architecture'}
            </p>
          </div>
        </div>

        <div className="space-y-3.5 my-6">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-white">ISO/IEC 27001:2022 Certified</span>
              <span className="text-[11px] text-emerald-400 font-mono">ACTIVE AUDIT</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Comprehensive Information Security Management System covering cryptographic key rotators and identity vaults.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-white">SOC 2 Type II Certified</span>
              <span className="text-[11px] text-emerald-400 font-mono">ANNUAL AUDIT</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Independent assessment of Security, Availability, and Confidentiality controls across all microservices.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-white">FIDO2 / WebAuthn Hardware Keys</span>
              <span className="text-[11px] text-indigo-400 font-mono">HARDWARE-BOUND</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Resistant to phishing, credential stuffing, and man-in-the-middle replay attacks with hardware authenticator support.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>TLS 1.3 · AES-256-GCM Encryption</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
          >
            {language === 'hi' ? 'समझ गया' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

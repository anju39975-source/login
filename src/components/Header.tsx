import React from 'react';
import { ShieldCheck, Globe2 } from 'lucide-react';
import { Language } from '../types/auth';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenCompliance: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenCompliance,
}) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            AuraID
          </span>
        </div>

        {/* Zone 2: 4-5 nav links, 1-2 word labels, single-line */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            type="button"
            onClick={onOpenCompliance}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-left"
          >
            {language === 'hi' ? 'सुरक्षा मानक' : 'Security Standards'}
          </button>
          <a
            href="#compliance"
            onClick={(e) => { e.preventDefault(); onOpenCompliance(); }}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {language === 'hi' ? 'अनुपालन' : 'Compliance'}
          </a>
          <span className="text-slate-500 text-xs flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            {language === 'hi' ? 'सिस्टम सामान्य' : 'SSO Operational'}
          </span>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            title="Switch Language / भाषा बदलें"
          >
            <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

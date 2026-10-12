import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, Check, GraduationCap, KeyRound, Lock, Scale, ShieldCheck, Target } from 'lucide-react';

interface TermsModalProps {
  onAccept: () => void;
}

const TERMS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Target,
    title: 'Purpose',
    text: 'This is a fun project created for the DTU community to track foosball matches and rankings.',
  },
  {
    icon: Lock,
    title: 'Data Collection',
    text: 'We only collect your username, nationality, and game statistics. No personal identifiable information (PII) is required or stored.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy & GDPR',
    text: 'Your data is protected and used solely for this application. You can request data deletion at any time by contacting Bando.',
  },
  {
    icon: KeyRound,
    title: 'Account Security',
    text: 'Please use a unique password for your account. We recommend not reusing passwords from other services.',
  },
  {
    icon: AlertTriangle,
    title: 'Beta Software',
    text: 'This application is in beta. You may encounter bugs or unexpected behavior. We appreciate your understanding!',
  },
  {
    icon: GraduationCap,
    title: 'DTU Community',
    text: 'This service is intended for use by the DTU community. Please be respectful and have fun!',
  },
];

const TermsModal: React.FC<TermsModalProps> = ({ onAccept }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  return (
    <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 text-left">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
        className="w-full sm:max-w-lg max-h-[92dvh] flex flex-col bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Red Background */}
        <div className="bg-primary text-white px-6 pt-6 pb-5 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8 blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Scale size={22} />
            </div>
            <div>
              <h2 id="terms-title" className="text-xl font-bold leading-tight">Terms & Conditions</h2>
              <p className="text-sm text-white/80">Welcome to Foosball DTU!</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <p className="text-sm text-gray-500 mb-4">
            Please read and accept our terms before continuing.
          </p>

          <div className="flex flex-col gap-4">
            {TERMS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white">
          <label className="flex items-center gap-3 p-3 mb-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="peer sr-only"
            />
            <span
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors
                peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50
                ${agreedToTerms ? 'bg-primary border-primary text-white' : 'bg-white border-slate-300 text-transparent'}`}
            >
              <Check size={16} strokeWidth={3} />
            </span>
            <span className="text-sm font-medium text-gray-700">
              I have read and agree to the terms and conditions
            </span>
          </label>

          <button
            onClick={onAccept}
            disabled={!agreedToTerms}
            className="w-full h-12 rounded-xl bg-primary text-white font-semibold text-base
                       shadow-lg shadow-primary/25 hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer
                       disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {agreedToTerms ? "Let me cook!👨‍🍳 " : "Please accept the terms to continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthenticationLayout } from './AuthenticationLayout';
import { 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  KeyRound, 
  AlertCircle 
} from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { setActiveTab } = useApp();

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 500);
  };

  return (
    <AuthenticationLayout portalType="CUSTOMER" subtitle="Account Recovery System">
      <div className="space-y-5">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#4A5D4E]/10 text-[#4A5D4E] mb-1">
            <KeyRound size={20} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Reset Your Password
          </h2>
          <p className="text-xs text-[#707070]">
            Enter your registered email address to receive a secure recovery code.
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-4 py-2 text-center animate-fadeIn">
            <div className="w-12 h-12 bg-[#D9E3D0] text-[#4A5D4E] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#1A1A1A]">Recovery Email Sent!</h3>
              <p className="text-xs text-[#707070] leading-relaxed max-w-xs mx-auto">
                We sent password reset instructions to <span className="font-bold text-[#2D2D2D]">{email}</span>. Please check your inbox or spam folder.
              </p>
            </div>

            <div className="p-3 bg-[#F0EBE1] rounded-xl text-[10px] text-[#707070] text-left border border-[#E6E1D6]">
              <span className="font-bold uppercase text-[#4A5D4E] block mb-0.5">Prototype Note:</span>
              For academic demonstration purposes, you can also proceed directly to the reset interface.
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => setActiveTab('PASSWORD_RESET')}
                className="w-full bg-[#4A5D4E] text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#3A493D]"
              >
                Proceed to Password Reset
              </button>
              <button
                onClick={() => setActiveTab('CUSTOMER_LOGIN')}
                className="w-full text-xs font-bold text-[#707070] hover:text-[#2D2D2D] py-1"
              >
                Return to Login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2.5">
                <AlertCircle size={16} className="flex-shrink-0 text-rose-600" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5D4E]">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. customer@avolab.demo"
                  className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E] placeholder-[#999]"
                  required
                />
                <Mail size={16} className="absolute left-3.5 top-3 text-[#888]" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#4A5D4E] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#3A493D] disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Sending Code...</span>
              ) : (
                <>
                  <span>Send Reset Instructions</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setActiveTab('CUSTOMER_LOGIN')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4A5D4E] hover:underline"
              >
                <ArrowLeft size={14} />
                <span>Return to Login</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </AuthenticationLayout>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthenticationLayout } from './AuthenticationLayout';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  UserCheck,
  Sparkles
} from 'lucide-react';

export const StaffLoginPage: React.FC = () => {
  const { login, setActiveTab } = useApp();

  const [email, setEmail] = useState('staff@avolab.demo');
  const [password, setPassword] = useState('Demo@123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fillDemoAccount = () => {
    setEmail('staff@avolab.demo');
    setPassword('Demo@123');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = login(cleanEmail, password);
      setIsSubmitting(false);

      if (result.success && result.user?.role === 'STAFF') {
        setActiveTab('STAFF_DASHBOARD');
      } else if (result.success && result.user?.role !== 'STAFF') {
        setErrorMsg(`Account exists but is registered as ${result.user?.role}. Staff credentials required.`);
      } else {
        setPassword('');
        setErrorMsg('Invalid email or password. Please try again.');
      }
    }, 400);
  };

  return (
    <AuthenticationLayout portalType="STAFF" subtitle="AVOLAB Operations & Order Management System (OMS)">
      <div className="space-y-5">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#849673]/20 text-[#4A5D4E] mb-1">
            <UserCheck size={20} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Staff Portal
          </h2>
          <p className="text-xs text-[#707070]">
            Sign in to manage daily operations.
          </p>
        </div>

        {/* Demo Account Badge */}
        <div className="bg-[#F0EBE1] border border-[#E6E1D6] rounded-2xl p-3.5 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#4A5D4E] flex items-center gap-1">
              <Sparkles size={13} className="text-[#849673]" /> Demo Staff Credentials
            </span>
            <span className="text-[9px] bg-[#D9E3D0] text-[#4A5D4E] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Staff OMS
            </span>
          </div>
          <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-[#E6E1D6]">
            <div>
              <p className="font-mono text-[11px] text-[#2D2D2D] font-semibold">staff@avolab.demo</p>
              <p className="font-mono text-[10px] text-[#888]">Pass: Demo@123</p>
            </div>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="text-[10px] bg-[#4A5D4E] text-white px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider hover:bg-[#3A493D]"
            >
              Fill Credentials
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle size={16} className="flex-shrink-0 text-rose-600" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5D4E]">
              Staff Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@avolab.demo"
                className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E] focus:bg-white placeholder-[#999] transition-all"
                required
              />
              <Mail size={16} className="absolute left-3.5 top-3 text-[#888]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5D4E]">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E] focus:bg-white placeholder-[#999] transition-all"
                required
              />
              <Lock size={16} className="absolute left-3.5 top-3 text-[#888]" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-[#888] hover:text-[#2D2D2D] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-[#4A5D4E] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#3A493D] disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? (
              <span>Authenticating Staff...</span>
            ) : (
              <>
                <span>Sign In to Staff Portal</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

      </div>
    </AuthenticationLayout>
  );
};

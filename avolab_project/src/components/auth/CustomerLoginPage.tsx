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
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const CustomerLoginPage: React.FC = () => {
  const { login, setActiveTab, redirectAfterLogin, setRedirectAfterLogin, showToast } = useApp();

  const [email, setEmail] = useState('customer@avolab.demo');
  const [password, setPassword] = useState('Demo@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Demo Quick-Fill Action
  const fillDemoAccount = () => {
    setEmail('customer@avolab.demo');
    setPassword('Demo@123');
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
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

      if (result.success) {
        if (redirectAfterLogin) {
          const target = redirectAfterLogin;
          setRedirectAfterLogin(null);
          setActiveTab(target);
          showToast(`Welcome back! Returning to ${target.toLowerCase()}...`);
        } else {
          setActiveTab('ACCOUNT');
        }
      } else {
        // Keep email, clear password
        setPassword('');
        setErrorMsg('Invalid email or password. Please try again.');
      }
    }, 400);
  };

  return (
    <AuthenticationLayout portalType="CUSTOMER">
      <div className="space-y-5">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Welcome Back
          </h2>
          <p className="text-xs text-[#707070]">
            Sign in to continue your skincare journey.
          </p>
        </div>

        {/* Demo Account Indicator & Quick Fill Banner */}
        <div className="bg-[#F0EBE1] border border-[#E6E1D6] rounded-2xl p-3.5 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#4A5D4E] flex items-center gap-1">
              <Sparkles size={13} className="text-[#849673]" /> Pre-filled Demo Credentials
            </span>
            <span className="text-[9px] bg-[#D9E3D0] text-[#4A5D4E] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Academic Test
            </span>
          </div>
          <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-[#E6E1D6]">
            <div>
              <p className="font-mono text-[11px] text-[#2D2D2D] font-semibold">customer@avolab.demo</p>
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
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5D4E]">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@avolab.demo"
                className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E] focus:bg-white placeholder-[#999] transition-all"
                required
              />
              <Mail size={16} className="absolute left-3.5 top-3 text-[#888]" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5D4E]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setActiveTab('FORGOT_PASSWORD')}
                className="text-[11px] font-semibold text-[#4A5D4E] hover:underline"
              >
                Forgot password?
              </button>
            </div>
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[#5A5A5A] text-[11px]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#E6E1D6] text-[#4A5D4E] focus:ring-[#4A5D4E]"
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-[#4A5D4E] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#3A493D] disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Register CTA */}
        <div className="pt-3 border-t border-[#E6E1D6] text-center">
          <p className="text-xs text-[#707070]">
            New to AVOLAB?{' '}
            <button
              onClick={() => setActiveTab('CUSTOMER_REGISTER')}
              className="font-bold text-[#4A5D4E] hover:underline"
            >
              Create an account.
            </button>
          </p>
        </div>

      </div>
    </AuthenticationLayout>
  );
};

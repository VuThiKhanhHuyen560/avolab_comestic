import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthenticationLayout } from './AuthenticationLayout';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight 
} from 'lucide-react';

export const PasswordResetPage: React.FC = () => {
  const { setActiveTab, showToast } = useApp();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      showToast('Password updated successfully! Please sign in with your new password.');
    }, 500);
  };

  return (
    <AuthenticationLayout portalType="CUSTOMER" subtitle="Set a new password for your AVOLAB account">
      <div className="space-y-5">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#4A5D4E]/10 text-[#4A5D4E] mb-1">
            <Lock size={20} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Create New Password
          </h2>
          <p className="text-xs text-[#707070]">
            Please enter your new password below.
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-4 py-2 text-center animate-fadeIn">
            <div className="w-12 h-12 bg-[#D9E3D0] text-[#4A5D4E] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#1A1A1A]">Password Successfully Reset!</h3>
              <p className="text-xs text-[#707070]">
                Your security credentials have been updated.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('CUSTOMER_LOGIN')}
              className="w-full bg-[#4A5D4E] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#3A493D] flex items-center justify-center gap-2"
            >
              <span>Sign In with New Password</span>
              <ArrowRight size={15} />
            </button>
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
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E] placeholder-[#999]"
                  required
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-[#888]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#888]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4A5D4E]">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E] placeholder-[#999]"
                  required
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-[#888]" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 bg-[#4A5D4E] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#3A493D] disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <span>Save New Password</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </AuthenticationLayout>
  );
};

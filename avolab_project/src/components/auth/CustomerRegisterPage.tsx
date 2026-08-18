import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuthenticationLayout } from './AuthenticationLayout';
import { SkinType, SkinConcern } from '../../types';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  Check, 
  AlertCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CustomerRegisterPage: React.FC = () => {
  const { registerCustomer, setActiveTab } = useApp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [skinType, setSkinType] = useState<SkinType>('Sensitive');
  const [skinConcerns, setSkinConcerns] = useState<SkinConcern[]>(['Dryness & Dehydration', 'Redness & Irritation']);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ALL_CONCERNS: SkinConcern[] = [
    'Acne & Blemishes',
    'Dryness & Dehydration',
    'Redness & Irritation',
    'Dullness & Uneven Tone',
    'Aging & Fine Lines',
    'Dark Circles',
    'Pore Size'
  ];

  const toggleConcern = (concern: SkinConcern) => {
    setSkinConcerns(prev =>
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('Please enter your first and last name.');
      return;
    }
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your entries.');
      return;
    }
    if (!termsAccepted) {
      setErrorMsg('You must accept the Terms of Service to create an account.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = registerCustomer({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: cleanEmail,
        password,
        phone,
        skinType,
        skinConcerns
      });
      setIsSubmitting(false);

      if (result.success) {
        setActiveTab('ACCOUNT');
      } else {
        setErrorMsg(result.message);
      }
    }, 500);
  };

  return (
    <AuthenticationLayout portalType="CUSTOMER" subtitle="Join the AVOLAB Botanical Club & receive 100 bonus points">
      <div className="space-y-5">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Create an Account
          </h2>
          <p className="text-xs text-[#707070]">
            Experience gentle, AI-matched vegan skincare solutions.
          </p>
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
          
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Sophia"
                className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Martinez"
                className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sophia@example.com"
                className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                required
              />
              <Mail size={15} className="absolute left-3 top-2.5 text-[#888]" />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 chars"
                  className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl pl-9 pr-7 py-2 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                  required
                />
                <Lock size={15} className="absolute left-3 top-2.5 text-[#888]" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2.5 text-[#888]"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                  required
                />
                <Lock size={15} className="absolute left-3 top-2.5 text-[#888]" />
              </div>
            </div>
          </div>

          {/* Skin Type Selection */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">
              Primary Skin Profile (for AI Formula Matching)
            </label>
            <select
              value={skinType}
              onChange={(e) => setSkinType(e.target.value as SkinType)}
              className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
            >
              <option value="Sensitive">Sensitive Skin</option>
              <option value="Dry">Dry / Parched Skin</option>
              <option value="Oily">Oily / Acne-Prone</option>
              <option value="Combination">Combination Skin</option>
              <option value="Normal">Normal Skin</option>
            </select>
          </div>

          {/* Skin Concerns Multi-Select */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">
              Skin Concerns
            </label>
            <div className="flex flex-wrap gap-1">
              {ALL_CONCERNS.map(concern => {
                const selected = skinConcerns.includes(concern);
                return (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => toggleConcern(concern)}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 border ${
                      selected
                        ? 'bg-[#4A5D4E] text-white border-[#4A5D4E]'
                        : 'bg-[#F9F7F2] text-[#5A5A5A] border-[#E6E1D6]'
                    }`}
                  >
                    {selected && <Check size={10} />}
                    <span>{concern}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phone optional */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 012-3456"
                className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
              />
              <Phone size={15} className="absolute left-3 top-2.5 text-[#888]" />
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2 pt-1 text-xs text-[#5A5A5A]">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded border-[#E6E1D6] text-[#4A5D4E] focus:ring-[#4A5D4E]"
              required
            />
            <label htmlFor="terms" className="text-[11px] leading-tight cursor-pointer">
              I agree to the AVOLAB <span className="underline font-semibold">Terms of Service</span> and <span className="underline font-semibold">Privacy Policy</span>.
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-[#4A5D4E] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#3A493D] disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create Account (+100 Points)</span>
                <Sparkles size={15} className="text-[#D9E3D0]" />
              </>
            )}
          </button>
        </form>

        {/* Return to Sign In */}
        <div className="pt-3 border-t border-[#E6E1D6] text-center">
          <p className="text-xs text-[#707070]">
            Already have an AVOLAB account?{' '}
            <button
              onClick={() => setActiveTab('CUSTOMER_LOGIN')}
              className="font-bold text-[#4A5D4E] hover:underline"
            >
              Sign In.
            </button>
          </p>
        </div>

      </div>
    </AuthenticationLayout>
  );
};

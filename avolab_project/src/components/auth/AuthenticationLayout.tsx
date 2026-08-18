import React from 'react';
import { AvolabLogo } from '../common/AvolabLogo';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Sparkles, Shield, UserCheck, ShoppingBag } from 'lucide-react';

interface AuthenticationLayoutProps {
  children: React.ReactNode;
  portalType?: 'CUSTOMER' | 'STAFF' | 'ADMIN';
  subtitle?: string;
}

export const AuthenticationLayout: React.FC<AuthenticationLayoutProps> = ({
  children,
  portalType = 'CUSTOMER',
  subtitle
}) => {
  const { setActiveTab } = useApp();

  return (
    <div className="min-h-screen bg-[#F9F7F2] relative flex flex-col justify-between items-center py-8 px-4 sm:px-6 lg:px-8 selection:bg-[#D9E3D0] selection:text-[#4A5D4E] overflow-x-hidden">
      
      {/* Background Aesthetic Layer - Subtle Skincare & Botanical Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Ambient Radial Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#D9E3D0]/40 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#E0D7C6]/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#F0EBE1]/60 blur-2xl" />

        {/* Subtle Botanical Line Art Watermark */}
        <svg
          className="absolute top-10 right-10 text-[#4A5D4E]/5 w-72 h-72 transform rotate-12"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M100,10 C120,50 160,80 180,120 C160,160 120,180 100,190 C80,180 40,160 20,120 C40,80 80,50 100,10 Z M100,30 C90,70 60,100 40,130 C70,140 100,120 100,30 Z" />
        </svg>
        <svg
          className="absolute bottom-10 left-10 text-[#849673]/5 w-64 h-64 transform -rotate-45"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M100,10 C120,50 160,80 180,120 C160,160 120,180 100,190 C80,180 40,160 20,120 C40,80 80,50 100,10 Z" />
        </svg>
      </div>

      {/* Top Bar - Storefront Return Shortcut */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between z-10 mb-6">
        <button
          onClick={() => setActiveTab('HOME')}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#4A5D4E] hover:text-[#3A493D] bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#E6E1D6] hover:border-[#4A5D4E] transition-all shadow-2xs"
        >
          <ArrowLeft size={14} />
          <span>Return to Storefront</span>
        </button>

        {/* Portal Indicator Badge */}
        <div className="flex items-center gap-1.5 bg-[#4A5D4E] text-[#F9F7F2] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xs">
          {portalType === 'CUSTOMER' && <ShoppingBag size={12} className="text-[#D9E3D0]" />}
          {portalType === 'STAFF' && <UserCheck size={12} className="text-[#D9E3D0]" />}
          {portalType === 'ADMIN' && <Shield size={12} className="text-[#D9E3D0]" />}
          <span>{portalType === 'CUSTOMER' ? 'Customer' : portalType === 'STAFF' ? 'Staff OMS' : 'Admin BI'}</span>
        </div>
      </div>

      {/* Main Authentication Card Container */}
      <div className="w-full max-w-md mx-auto z-10 flex-1 flex flex-col justify-center my-auto">
        
        {/* AVOLAB Logo */}
        <div className="mb-6 text-center">
          <AvolabLogo
            variant="authentication"
            onClick={() => setActiveTab('HOME')}
          />
          {subtitle && (
            <p className="text-xs text-[#707070] mt-2 font-medium max-w-xs mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#E6E1D6] shadow-xl shadow-[#4A5D4E]/5 p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {/* Subtle top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#4A5D4E] via-[#849673] to-[#D9E3D0]" />

          {children}
        </div>

        {/* Portal Switcher Navigation */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] font-semibold text-[#707070]">
          <span className="uppercase text-[9px] tracking-widest text-[#849673]">Portals:</span>
          <button
            onClick={() => setActiveTab('CUSTOMER_LOGIN')}
            className={`hover:text-[#4A5D4E] transition-colors ${portalType === 'CUSTOMER' ? 'text-[#4A5D4E] font-bold border-b border-[#4A5D4E]' : ''}`}
          >
            Customer
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveTab('STAFF_LOGIN')}
            className={`hover:text-[#4A5D4E] transition-colors ${portalType === 'STAFF' ? 'text-[#4A5D4E] font-bold border-b border-[#4A5D4E]' : ''}`}
          >
            Staff Portal
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveTab('ADMIN_LOGIN')}
            className={`hover:text-[#4A5D4E] transition-colors ${portalType === 'ADMIN' ? 'text-[#4A5D4E] font-bold border-b border-[#4A5D4E]' : ''}`}
          >
            Admin Portal
          </button>
        </div>

      </div>

      {/* Footer Branding Notice */}
      <footer className="w-full text-center z-10 mt-8 pt-4 border-t border-[#E6E1D6]/60">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#888] font-medium">
          © 2026 AVOLAB COSMETICS • Clean Science & Botanical Skincare
        </p>
      </footer>

    </div>
  );
};

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, UserCheck, ShoppingBag, RefreshCw, Cpu } from 'lucide-react';

export const RoleBanner: React.FC = () => {
  const { role, setRole, setActiveTab, resetDemoData } = useApp();

  const handleSwitchRole = (newRole: 'CUSTOMER' | 'STAFF' | 'ADMIN') => {
    setRole(newRole);
    if (newRole === 'CUSTOMER') {
      setActiveTab('HOME');
    } else if (newRole === 'STAFF') {
      setActiveTab('STAFF_DASHBOARD');
    } else if (newRole === 'ADMIN') {
      setActiveTab('ADMIN_BI_ANALYTICS');
    }
  };

  return (
    <div className="bg-[#4A5D4E] text-[#F6F1E8] text-xs px-4 py-2 border-b border-[#4C5D4B]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#DDEAD2] text-[#4A5D4E] px-2.5 py-0.5 rounded text-[10px] uppercase tracking-widest font-extrabold flex items-center gap-1">
            <Cpu size={12} /> Digital Ecosystem
          </span>
          <span className="text-[#DDEAD2] font-semibold hidden md:inline text-[11px] uppercase tracking-wider">
            AVOLAB COSMETICS Digital Transformation Academic Platform
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#DDEAD2] font-semibold text-xs">Switch View Role:</span>
          
          <div className="inline-flex rounded-lg p-0.5 bg-[#4C5D4B] border border-[#DDEAD2]/30">
            <button
              onClick={() => handleSwitchRole('CUSTOMER')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                role === 'CUSTOMER'
                  ? 'bg-[#DDEAD2] text-[#4A5D4E] shadow-xs'
                  : 'text-[#F6F1E8] hover:text-[#DDEAD2]'
              }`}
            >
              <ShoppingBag size={13} />
              Customer
            </button>

            <button
              onClick={() => handleSwitchRole('STAFF')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                role === 'STAFF'
                  ? 'bg-[#DDEAD2] text-[#4A5D4E] shadow-xs'
                  : 'text-[#F6F1E8] hover:text-[#DDEAD2]'
              }`}
            >
              <UserCheck size={13} />
              Staff
            </button>

            <button
              onClick={() => handleSwitchRole('ADMIN')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                role === 'ADMIN'
                  ? 'bg-[#DDEAD2] text-[#4A5D4E] shadow-xs'
                  : 'text-[#F6F1E8] hover:text-[#DDEAD2]'
              }`}
            >
              <Shield size={13} />
              Admin
            </button>
          </div>

          <button
            onClick={resetDemoData}
            title="Reset dataset to default"
            className="text-[#DDEAD2] hover:text-[#F6F1E8] transition-colors p-1 flex items-center gap-1 text-[11px] font-semibold"
          >
            <RefreshCw size={12} />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

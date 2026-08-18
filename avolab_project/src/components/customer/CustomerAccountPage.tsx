import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SkinType, SkinConcern } from '../../types';
import { 
  User, 
  Sparkles, 
  Gift, 
  Package, 
  RefreshCw, 
  Shield, 
  Heart, 
  Mail, 
  Phone, 
  Calendar, 
  Check, 
  LogOut, 
  Edit3, 
  Save 
} from 'lucide-react';

export const CustomerAccountPage: React.FC = () => {
  const { currentUser, setActiveTab, logout, orders, showToast } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || 'Sophia Martinez');
  const [phone, setPhone] = useState(currentUser?.phone || '+1 (555) 012-3456');
  const [skinType, setSkinType] = useState<SkinType>(currentUser?.skinType || 'Sensitive');
  const [skinConcerns, setSkinConcerns] = useState<SkinConcern[]>(
    currentUser?.skinConcerns || ['Dryness & Dehydration', 'Redness & Irritation']
  );

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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    showToast('Skin profile & personal settings updated successfully!');
  };

  if (!currentUser) {
    return null;
  }

  const myOrders = orders.filter(o => o.customerEmail.toLowerCase() === currentUser.email.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 selection:bg-[#D9E3D0] selection:text-[#4A5D4E]">
      
      {/* Account Hero Banner */}
      <div className="bg-gradient-to-br from-[#4A5D4E] via-[#3A493D] to-[#2D3930] text-[#F9F7F2] rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-5 z-10">
          <div className="relative">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300'}
              alt={currentUser.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-[#D9E3D0] shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 bg-[#849673] rounded-full border-2 border-[#4A5D4E] flex items-center justify-center text-[10px] text-white font-bold">
              ✓
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{currentUser.name}</h1>
              <span className="bg-[#D9E3D0] text-[#4A5D4E] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                {currentUser.loyaltyTier || 'Sprout'} Member
              </span>
            </div>
            <p className="text-xs text-[#D9E3D0] flex items-center gap-2">
              <Mail size={13} /> {currentUser.email}
              <span className="opacity-60">•</span>
              <Calendar size={13} /> Member since {currentUser.joinedDate || '2025'}
            </p>
          </div>
        </div>

        {/* Loyalty Quick Card */}
        <div className="z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 text-white min-w-[240px]">
          <div className="p-3 bg-[#D9E3D0] text-[#4A5D4E] rounded-xl font-bold">
            <Gift size={22} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#D9E3D0] font-bold">Loyalty Points</p>
            <p className="text-2xl font-extrabold">{currentUser.loyaltyPoints || 250} <span className="text-xs font-normal">pts</span></p>
            <button
              onClick={() => setActiveTab('LOYALTY')}
              className="text-[10px] underline font-semibold hover:text-[#D9E3D0] mt-0.5 block"
            >
              Redeem Rewards →
            </button>
          </div>
        </div>
      </div>

      {/* Grid Layout: Account Navigation & Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white border border-[#E6E1D6] rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#4A5D4E] border-b border-[#E6E1D6] pb-2">
              Quick Shortcuts
            </h3>
            
            <button
              onClick={() => setActiveTab('ORDERS')}
              className="w-full text-left p-3 rounded-xl hover:bg-[#F9F7F2] border border-transparent hover:border-[#E6E1D6] flex items-center justify-between text-xs font-semibold text-[#2D2D2D] transition-all"
            >
              <span className="flex items-center gap-2.5">
                <Package size={16} className="text-[#4A5D4E]" />
                <span>My Orders & QR Codes</span>
              </span>
              <span className="text-[10px] bg-[#F0EBE1] text-[#4A5D4E] px-2 py-0.5 rounded-full font-bold">
                {myOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('SUBSCRIPTIONS')}
              className="w-full text-left p-3 rounded-xl hover:bg-[#F9F7F2] border border-transparent hover:border-[#E6E1D6] flex items-center justify-between text-xs font-semibold text-[#2D2D2D] transition-all"
            >
              <span className="flex items-center gap-2.5">
                <RefreshCw size={16} className="text-[#4A5D4E]" />
                <span>Auto-Refill Subscriptions</span>
              </span>
              <span className="text-[10px] bg-[#D9E3D0] text-[#4A5D4E] px-2 py-0.5 rounded-full font-bold">
                Active
              </span>
            </button>

            <button
              onClick={() => setActiveTab('WISHLIST_COMPARE')}
              className="w-full text-left p-3 rounded-xl hover:bg-[#F9F7F2] border border-transparent hover:border-[#E6E1D6] flex items-center justify-between text-xs font-semibold text-[#2D2D2D] transition-all"
            >
              <span className="flex items-center gap-2.5">
                <Heart size={16} className="text-[#4A5D4E]" />
                <span>Saved Wishlist & Comparisons</span>
              </span>
              <span className="text-[10px] bg-[#F0EBE1] text-[#4A5D4E] px-2 py-0.5 rounded-full font-bold">
                View
              </span>
            </button>

            <button
              onClick={logout}
              className="w-full text-left p-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center gap-2.5 text-xs font-bold transition-all mt-4"
            >
              <LogOut size={16} />
              <span>Sign Out of Account</span>
            </button>
          </div>
        </div>

        {/* Right Column: Skin Profile & Personal Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E6E1D6] rounded-2xl p-6 space-y-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-[#E6E1D6] pb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-[#849673]" />
                <h2 className="text-base font-bold text-[#1A1A1A]">AI Skin Profile & Personal Details</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4A5D4E] hover:underline"
              >
                {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">Full Name</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-xs text-[#2D2D2D] disabled:opacity-75 focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">Phone Number</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-xs text-[#2D2D2D] disabled:opacity-75 focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-[#E6E1D6]/60">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">
                  Primary Skin Type
                </label>
                <select
                  disabled={!isEditing}
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value as SkinType)}
                  className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-xs text-[#2D2D2D] disabled:opacity-75 focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                >
                  <option value="Sensitive">Sensitive Skin</option>
                  <option value="Dry">Dry / Parched Skin</option>
                  <option value="Oily">Oily / Acne-Prone</option>
                  <option value="Combination">Combination Skin</option>
                  <option value="Normal">Normal Skin</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E6E1D6]/60">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">
                  Primary Skin Concerns
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_CONCERNS.map(concern => {
                    const selected = skinConcerns.includes(concern);
                    return (
                      <button
                        key={concern}
                        type="button"
                        disabled={!isEditing}
                        onClick={() => toggleConcern(concern)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 border ${
                          selected
                            ? 'bg-[#4A5D4E] text-white border-[#4A5D4E]'
                            : 'bg-[#F9F7F2] text-[#5A5A5A] border-[#E6E1D6]'
                        }`}
                      >
                        {selected && <Check size={11} />}
                        <span>{concern}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {isEditing && (
                <div className="pt-4 border-t border-[#E6E1D6]">
                  <button
                    type="submit"
                    className="bg-[#4A5D4E] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#3A493D] shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

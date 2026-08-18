import React from 'react';
import { useApp } from '../../context/AppContext';
import { Gift, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export const LoyaltyCenter: React.FC = () => {
  const { customer, showToast } = useApp();

  const tiers = [
    { name: 'Seed', minSpent: 0, perks: 'Earn 1 pt per $1, Free birthday mini' },
    { name: 'Sprout', minSpent: 100, perks: 'Earn 1.25 pts per $1, Free shipping over $30' },
    { name: 'Bloom', minSpent: 300, perks: 'Earn 1.5 pts per $1, Early access to new formulations' },
    { name: 'Flora', minSpent: 500, perks: 'Earn 2 pts per $1, Free full-size gift quarterly' },
  ];

  const handleRedeemVoucher = (cost: number, voucherName: string) => {
    if (customer.loyaltyPoints < cost) {
      alert(`You need ${cost} points to redeem ${voucherName}. Current balance: ${customer.loyaltyPoints} pts.`);
      return;
    }
    customer.loyaltyPoints -= cost;
    showToast(`Redeemed "${voucherName}" voucher! Added to your account.`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1C2E20] to-[#2E4A32] text-amber-50 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="bg-amber-100 text-[#1C2E20] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
            AVOLAB Botanical Rewards
          </span>
          <h1 className="font-serif text-3xl font-bold">Welcome, {customer.name}</h1>
          <p className="text-xs text-emerald-200">Current Tier: <span className="font-bold text-amber-200">{customer.loyaltyTier} Member</span> • Total Spent: ${customer.totalSpent.toFixed(2)}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center flex-shrink-0 min-w-[200px]">
          <span className="text-xs text-emerald-200 block">Active Loyalty Points</span>
          <span className="font-serif text-4xl font-bold text-amber-200">{customer.loyaltyPoints}</span>
          <span className="text-[10px] text-emerald-300 block mt-1">pts available</span>
        </div>
      </div>

      {/* Tiers Progress */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <Award size={18} className="text-[#2E4A32]" /> Loyalty Tier Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map(t => {
            const isCurrent = customer.loyaltyTier === t.name;

            return (
              <div
                key={t.name}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-[#2E4A32] text-amber-100 border-[#2E4A32] shadow-md'
                    : 'bg-[#FAF8F5] text-stone-800 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">{t.name}</h4>
                  {isCurrent && <span className="bg-amber-100 text-[#2E4A32] text-[9px] font-bold px-2 py-0.5 rounded-full">ACTIVE</span>}
                </div>
                <p className="text-[11px] opacity-80 mt-1">Min Spent: ${t.minSpent}</p>
                <p className="text-xs mt-3 leading-relaxed font-medium">{t.perks}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redeemable Rewards Catalog */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <Gift size={18} className="text-[#2E4A32]" /> Redeem Points for Skincare Vouchers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 space-y-2 flex flex-col justify-between">
            <div>
              <p className="font-bold text-stone-900">$5 OFF Any Purchase Voucher</p>
              <p className="text-stone-500 text-[11px]">Cost: 100 Loyalty Points</p>
            </div>
            <button
              onClick={() => handleRedeemVoucher(100, '$5 OFF Voucher')}
              className="w-full bg-[#2E4A32] text-amber-100 py-2 rounded-xl font-bold hover:bg-[#1C2E20]"
            >
              Redeem (100 Pts)
            </button>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 space-y-2 flex flex-col justify-between">
            <div>
              <p className="font-bold text-stone-900">$15 OFF Botanical Order</p>
              <p className="text-stone-500 text-[11px]">Cost: 250 Loyalty Points</p>
            </div>
            <button
              onClick={() => handleRedeemVoucher(250, '$15 OFF Voucher')}
              className="w-full bg-[#2E4A32] text-amber-100 py-2 rounded-xl font-bold hover:bg-[#1C2E20]"
            >
              Redeem (250 Pts)
            </button>
          </div>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 space-y-2 flex flex-col justify-between">
            <div>
              <p className="font-bold text-stone-900">Free Deluxe Cleanser Full Size</p>
              <p className="text-stone-500 text-[11px]">Cost: 400 Loyalty Points</p>
            </div>
            <button
              onClick={() => handleRedeemVoucher(400, 'Free Deluxe Cleanser')}
              className="w-full bg-[#2E4A32] text-amber-100 py-2 rounded-xl font-bold hover:bg-[#1C2E20]"
            >
              Redeem (400 Pts)
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

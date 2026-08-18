import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LoyaltyTierInfo, RewardItem } from '../../types';
import { Award, Gift, Plus, Edit2, Trash2, Check, X, Sparkles, Star } from 'lucide-react';
import { normalizeAVOLABImage } from '../../utils/productImages';

export const AdminLoyaltyManager: React.FC = () => {
  const { loyaltyTiers, rewards, addLoyaltyTier, updateLoyaltyTier, addReward, updateReward, deleteReward } = useApp();
  const [activeTab, setActiveTab] = useState<'TIERS' | 'REWARDS'>('TIERS');

  // Reward Modal
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<RewardItem | null>(null);
  const [rewardForm, setRewardForm] = useState<Partial<RewardItem>>({
    name: '',
    pointsRequired: 250,
    dollarValue: 15,
    description: '',
    tierRequirement: 'Seedling',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400'
  });

  const handleOpenCreateReward = () => {
    setEditingReward(null);
    setRewardForm({
      name: '$20 Off Full-Size Serum',
      pointsRequired: 300,
      dollarValue: 20,
      description: 'Instant $20 voucher applicable on any full-size bio-active serum.',
      tierRequirement: 'Bloom',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400'
    });
    setIsRewardModalOpen(true);
  };

  const handleSaveReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardForm.name || !rewardForm.pointsRequired) return;

    if (editingReward) {
      updateReward(editingReward.id, rewardForm);
    } else {
      addReward({
        name: rewardForm.name,
        pointsRequired: Number(rewardForm.pointsRequired) || 200,
        dollarValue: Number(rewardForm.dollarValue) || 10,
        description: rewardForm.description || '',
        tierRequirement: rewardForm.tierRequirement as any || 'Seedling',
        image: rewardForm.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400'
      });
    }

    setIsRewardModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1C2E20]">Loyalty Program & Rewards Catalog</h1>
          <p className="text-xs text-stone-500">Configure point accumulation multipliers, tier thresholds (Seedling, Bloom, Radiance), and redeemable reward vouchers.</p>
        </div>

        <button
          onClick={handleOpenCreateReward}
          className="bg-[#2E4A32] text-amber-100 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1C2E20] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Add Redeemable Reward
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('TIERS')}
          className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'TIERS' ? 'border-[#2E4A32] text-[#1C2E20]' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Loyalty Tiers ({loyaltyTiers.length})
        </button>
        <button
          onClick={() => setActiveTab('REWARDS')}
          className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'REWARDS' ? 'border-[#2E4A32] text-[#1C2E20]' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Redeemable Rewards Catalog ({rewards.length})
        </button>
      </div>

      {/* Tiers Tab */}
      {activeTab === 'TIERS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loyaltyTiers.map(tier => (
            <div key={tier.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <Award size={14} /> Tier: {tier.name}
                  </span>
                  <span className="text-emerald-800 font-mono font-bold text-xs">{tier.multiplier}x Points</span>
                </div>

                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100">
                  <p className="text-[10px] font-bold text-stone-400 uppercase">Qualifying Threshold</p>
                  <p className="font-serif text-lg font-bold text-[#1C2E20]">{tier.minPointsRequired} + Points</p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-bold text-stone-800">Tier Benefits:</p>
                  <ul className="text-xs text-stone-600 space-y-1 list-disc list-inside">
                    {tier.perks.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <button
                  onClick={() => updateLoyaltyTier(tier.id, { multiplier: tier.multiplier + 0.1 })}
                  className="w-full text-center py-2 bg-stone-100 text-stone-800 hover:bg-[#2E4A32] hover:text-amber-100 rounded-xl text-xs font-bold transition-colors"
                >
                  Adjust Tier Multiplier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rewards Catalog Tab */}
      {activeTab === 'REWARDS' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map(rew => (
            <div key={rew.id} className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <img src={normalizeAVOLABImage(rew.image)} alt={rew.name} className="w-full h-36 object-cover" />
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-100 text-emerald-900 font-bold font-mono text-xs px-2.5 py-0.5 rounded-full">
                      {rew.pointsRequired} Points
                    </span>
                    <span className="text-xs font-bold text-stone-500">${rew.dollarValue} Value</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#1C2E20]">{rew.name}</h3>
                  <p className="text-xs text-stone-600">{rew.description}</p>
                </div>
              </div>

              <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-800 uppercase">Req: {rew.tierRequirement || 'Seedling'}</span>
                <button
                  onClick={() => deleteReward(rew.id)}
                  className="text-xs text-red-600 font-bold hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reward Form Modal */}
      {isRewardModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-serif text-xl font-bold text-[#1C2E20]">Add Redeemable Reward Item</h2>
              <button onClick={() => setIsRewardModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveReward} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Reward Item Title *</label>
                <input
                  type="text"
                  required
                  value={rewardForm.name || ''}
                  onChange={e => setRewardForm({ ...rewardForm, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Points Required *</label>
                  <input
                    type="number"
                    required
                    value={rewardForm.pointsRequired || 200}
                    onChange={e => setRewardForm({ ...rewardForm, pointsRequired: parseInt(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Dollar Value ($)</label>
                  <input
                    type="number"
                    value={rewardForm.dollarValue || 10}
                    onChange={e => setRewardForm({ ...rewardForm, dollarValue: parseFloat(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Required Tier</label>
                <select
                  value={rewardForm.tierRequirement || 'Seedling'}
                  onChange={e => setRewardForm({ ...rewardForm, tierRequirement: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                >
                  <option value="Seedling">Seedling (All Members)</option>
                  <option value="Bloom">Bloom Tier</option>
                  <option value="Radiance">Radiance VIP Tier</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={rewardForm.description || ''}
                  onChange={e => setRewardForm({ ...rewardForm, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsRewardModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2E4A32] text-amber-100 rounded-xl font-bold hover:bg-[#1C2E20]"
                >
                  Save Reward Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

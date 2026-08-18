import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tag, Plus, CheckCircle2, Calendar, Percent } from 'lucide-react';

export const AdminCampaignManager: React.FC = () => {
  const { campaigns, createCampaign, showToast } = useApp();
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(20);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    createCampaign({
      title,
      code: code.toUpperCase(),
      discountPercentage: Number(discountPercentage),
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      status: 'ACTIVE'
    });

    showToast(`Created new marketing campaign code: ${code.toUpperCase()}`);
    setTitle('');
    setCode('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#1C2E20]">Marketing Campaigns & Voucher Codes</h1>
        <p className="text-xs text-stone-500 mt-0.5">Manage seasonal promotional discounts, coupon codes, and automated vouchers</p>
      </div>

      {/* Campaign Creation Form */}
      <form onSubmit={handleCreate} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 text-xs">
        <h3 className="font-serif text-lg font-bold text-[#1C2E20]">Create New Campaign Voucher</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-stone-500 mb-1 font-medium">Campaign Title</label>
            <input
              type="text"
              placeholder="e.g. Summer Botanical Glow 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
              required
            />
          </div>

          <div>
            <label className="block text-stone-500 mb-1 font-medium">Promo Coupon Code</label>
            <input
              type="text"
              placeholder="e.g. GLOW20"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-mono font-bold uppercase"
              required
            />
          </div>

          <div>
            <label className="block text-stone-500 mb-1 font-medium">Discount Percentage (%)</label>
            <input
              type="number"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(Number(e.target.value))}
              className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-bold"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#2E4A32] text-amber-100 px-6 py-2.5 rounded-xl font-bold hover:bg-[#1C2E20] flex items-center gap-2"
        >
          <Plus size={16} /> Launch Campaign
        </button>
      </form>

      {/* Active Campaigns List */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 font-semibold">
            <tr>
              <th className="p-4">Campaign Name</th>
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Active Dates</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {campaigns.map(c => (
              <tr key={c.id} className="hover:bg-stone-50">
                <td className="p-4 font-bold text-stone-900">{c.title}</td>
                <td className="p-4 font-mono font-bold text-[#2E4A32] bg-emerald-50/50 px-2.5 py-1 rounded-lg w-fit">
                  {c.code}
                </td>
                <td className="p-4 font-bold text-stone-800">{c.discountPercentage}% OFF</td>
                <td className="p-4 text-stone-500">{c.startDate} to {c.endDate}</td>
                <td className="p-4">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

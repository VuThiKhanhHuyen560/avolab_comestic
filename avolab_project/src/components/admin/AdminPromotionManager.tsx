import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Promotion } from '../../types';
import { Plus, Edit2, Trash2, Percent, Tag, Calendar, Check, X, ToggleLeft, ToggleRight } from 'lucide-react';

export const AdminPromotionManager: React.FC = () => {
  const { promotions, addPromotion, updatePromotion, deletePromotion } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  const [formData, setFormData] = useState<Partial<Promotion>>({
    name: '',
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    minOrderValue: 40,
    maxDiscountAmount: 30,
    usageLimit: 500,
    usedCount: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    isActive: true,
    applicableCategory: 'All Skincare'
  });

  const handleOpenCreate = () => {
    setEditingPromo(null);
    setFormData({
      name: 'Spring Renewal Discount',
      code: `RENEW${Math.floor(10 + Math.random() * 90)}`,
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderValue: 50,
      maxDiscountAmount: 40,
      usageLimit: 300,
      usedCount: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      isActive: true,
      applicableCategory: 'Serums & Oils'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Promotion) => {
    setEditingPromo(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) return;

    if (editingPromo) {
      updatePromotion(editingPromo.id, formData);
    } else {
      addPromotion({
        name: formData.name || 'Promotional Offer',
        code: formData.code.toUpperCase(),
        discountType: (formData.discountType as any) || 'PERCENTAGE',
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue) || 0,
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : undefined,
        usageLimit: Number(formData.usageLimit) || 1000,
        usedCount: Number(formData.usedCount) || 0,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        endDate: formData.endDate || '2026-12-31',
        isActive: formData.isActive ?? true,
        applicableCategory: formData.applicableCategory || 'All Skincare'
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1C2E20]">Promotions & Coupon Codes</h1>
          <p className="text-xs text-stone-500">Configure promotional discount codes, tier vouchers, and checkout coupon rules.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#2E4A32] text-amber-100 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1C2E20] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Create New Promo Code
        </button>
      </div>

      {/* Promotions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map(promo => (
          <div key={promo.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-amber-100 text-[#1C2E20] font-mono text-sm font-extrabold px-3 py-1 rounded-lg border border-amber-300">
                  {promo.code}
                </span>
                <button
                  onClick={() => updatePromotion(promo.id, { isActive: !promo.isActive })}
                  className="flex items-center gap-1 text-xs font-bold"
                >
                  {promo.isActive ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={10} /> Active
                    </span>
                  ) : (
                    <span className="bg-stone-200 text-stone-600 text-[10px] px-2 py-0.5 rounded-full">
                      Paused
                    </span>
                  )}
                </button>
              </div>

              <h3 className="font-serif text-base font-bold text-[#1C2E20]">{promo.name}</h3>
              <p className="text-xs text-stone-600">
                {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}% OFF` : `$${promo.discountValue} OFF`} on {promo.applicableCategory || 'All Items'}
              </p>

              <div className="bg-stone-50 p-3 rounded-xl text-[11px] text-stone-600 space-y-1 font-mono">
                <p>Min Spend: ${promo.minOrderValue}</p>
                <p>Redemptions: {promo.usedCount} / {promo.usageLimit}</p>
                <p className="text-stone-400">Valid: {promo.startDate} to {promo.endDate}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold">
              <button
                onClick={() => handleOpenEdit(promo)}
                className="text-stone-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Edit2 size={14} /> Edit Code
              </button>

              <button
                onClick={() => deletePromotion(promo.id)}
                className="text-red-600 hover:text-red-800 flex items-center gap-1"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Promotion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-serif text-xl font-bold text-[#1C2E20]">
                {editingPromo ? 'Edit Promotion' : 'Create Promotion Code'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Promotion Title</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType || 'PERCENTAGE'}
                    onChange={e => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Dollar ($)</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue || 0}
                    onChange={e => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Min Order Spend ($)</label>
                  <input
                    type="number"
                    value={formData.minOrderValue || 0}
                    onChange={e => setFormData({ ...formData, minOrderValue: parseFloat(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Total Max Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit || 500}
                    onChange={e => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2E4A32] text-amber-100 rounded-xl font-bold hover:bg-[#1C2E20]"
                >
                  Save Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

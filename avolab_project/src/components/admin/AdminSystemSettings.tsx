import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminAuditLogs } from './AdminAuditLogs';
import { Settings, Shield, Globe, Bell, DollarSign, Store, Save, RefreshCw } from 'lucide-react';

export const AdminSystemSettings: React.FC = () => {
  const { systemSettings, updateSystemSettings, showToast, resetDemoData } = useApp();
  const [activeTab, setActiveTab] = useState<'SETTINGS' | 'AUDIT'>('SETTINGS');

  const [form, setForm] = useState({ ...systemSettings });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings(form);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1C2E20]">System Settings & Compliance Logs</h1>
          <p className="text-xs text-stone-500">Global enterprise configurations, tax/currency rules, BOPIS pickup thresholds, and system audit logs.</p>
        </div>

        <button
          onClick={resetDemoData}
          className="bg-red-50 text-red-800 hover:bg-red-100 border border-red-200 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
        >
          <RefreshCw size={16} /> Reset System Demo Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('SETTINGS')}
          className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'SETTINGS' ? 'border-[#2E4A32] text-[#1C2E20]' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Global System Configurations
        </button>
        <button
          onClick={() => setActiveTab('AUDIT')}
          className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'AUDIT' ? 'border-[#2E4A32] text-[#1C2E20]' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Audit Logs & Security Trail
        </button>
      </div>

      {/* Settings Form */}
      {activeTab === 'SETTINGS' && (
        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Company / Brand Name</label>
              <input
                type="text"
                value={form.storeName || 'AVOLAB COSMETICS'}
                onChange={e => setForm({ ...form, storeName: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Support Contact Email</label>
              <input
                type="email"
                value={form.supportEmail || 'care@avolab.com'}
                onChange={e => setForm({ ...form, supportEmail: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Default Currency Code</label>
              <input
                type="text"
                value={form.currency || 'USD ($)'}
                onChange={e => setForm({ ...form, currency: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Free Shipping Order Minimum ($)</label>
              <input
                type="number"
                value={form.freeShippingThreshold || 60}
                onChange={e => setForm({ ...form, freeShippingThreshold: parseFloat(e.target.value) })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Default Standard Shipping Rate ($)</label>
              <input
                type="number"
                value={form.flatShippingRate || 5.95}
                onChange={e => setForm({ ...form, flatShippingRate: parseFloat(e.target.value) })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Tax Calculation Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.taxRate || 8.5}
                onChange={e => setForm({ ...form, taxRate: parseFloat(e.target.value) })}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 space-y-3">
            <h4 className="font-bold text-[#1C2E20] text-sm">Feature Toggles & Policy Engine</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enableBopis ?? true}
                  onChange={e => setForm({ ...form, enableBopis: e.target.checked })}
                  className="rounded text-emerald-800 focus:ring-emerald-700"
                />
                <div>
                  <p className="font-bold text-stone-900">Enable BOPIS Store Pickup</p>
                  <p className="text-[10px] text-stone-500">Allow customers to choose store pickup at checkout.</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.enableAiAdvisor ?? true}
                  onChange={e => setForm({ ...form, enableAiAdvisor: e.target.checked })}
                  className="rounded text-emerald-800 focus:ring-emerald-700"
                />
                <div>
                  <p className="font-bold text-stone-900">Enable Gemini AI Skincare Advisor</p>
                  <p className="text-[10px] text-stone-500">Live AI chat bot & skin diagnosis on storefront.</p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-200">
            <button
              type="submit"
              className="bg-[#2E4A32] text-amber-100 hover:bg-[#1C2E20] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md"
            >
              <Save size={16} /> Save System Settings
            </button>
          </div>
        </form>
      )}

      {/* Audit Logs */}
      {activeTab === 'AUDIT' && (
        <AdminAuditLogs />
      )}
    </div>
  );
};

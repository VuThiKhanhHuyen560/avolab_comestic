import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, UserCheck, Award, Package, Heart, Sparkles } from 'lucide-react';

export const StaffCustomerLookup: React.FC = () => {
  const { customer, orders } = useApp();
  const [search, setSearch] = useState('');

  const customerOrders = orders.filter(o => o.customerId === customer?.id || o.customerEmail === customer?.email);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#1C2E20]">In-Store Counter Customer 360 Lookup</h1>
        <p className="text-xs text-stone-500 mt-0.5">Assist in-person customers, check skin profiles, and verify loyalty tier benefits</p>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search customer by name, email, or telephone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#2E4A32]"
        />
        <Search size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
      </div>

      {/* Customer 360 Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#2E4A32] flex items-center justify-center font-bold text-lg">
              {customer?.name?.charAt(0) || 'C'}
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">{customer?.name || 'Customer'}</h2>
              <p className="text-xs text-stone-500">{customer?.email || 'N/A'} • {customer?.phone || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200 text-center">
            <span className="text-[10px] text-stone-400 font-mono uppercase block">Loyalty Status</span>
            <span className="font-bold text-sm text-[#2E4A32]">{customer?.loyaltyTier || 'Sprout'} Tier ({customer?.loyaltyPoints || 0} pts)</span>
          </div>
        </div>

        {/* Skin Profile Attributes */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={14} className="text-emerald-700" /> Customer Skin Profile
          </h3>

          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-stone-500 block">Skin Type:</span>
              <span className="font-bold text-stone-900">{customer?.skinType || 'Sensitive'}</span>
            </div>
            <div>
              <span className="text-stone-500 block">Skin Concerns:</span>
              <span className="font-bold text-stone-900">{customer?.skinConcerns?.join(', ') || 'None'}</span>
            </div>
          </div>
        </div>

        {/* Customer Order History */}
        <div className="space-y-2">
          <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
            <Package size={14} className="text-emerald-700" /> Order History ({customerOrders.length})
          </h3>

          <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden text-xs">
            {customerOrders.map(ord => (
              <div key={ord.id} className="p-3 bg-white flex items-center justify-between">
                <div>
                  <p className="font-mono font-bold text-stone-900">{ord.orderNumber}</p>
                  <p className="text-[10px] text-stone-400">{ord.fulfillmentType} • {ord.items.length} items</p>
                </div>
                <span className="font-bold text-[#1C2E20]">${ord.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

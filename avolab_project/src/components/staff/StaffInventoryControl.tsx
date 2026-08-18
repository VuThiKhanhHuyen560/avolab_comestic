import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, Minus, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import { getAVOLABProductImageFor } from '../../utils/productImages';

export const StaffInventoryControl: React.FC = () => {
  const { products, currentStaffStoreId, stores, adjustStock, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [reason, setReason] = useState('Stock Count Reconciliation');

  const currentStore = stores.find(s => s.id === currentStaffStoreId) || stores[0];

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdjust = (productId: string, qtyDelta: number) => {
    adjustStock(productId, currentStaffStoreId, qtyDelta, reason);
    showToast(`Stock adjusted by ${qtyDelta > 0 ? `+${qtyDelta}` : qtyDelta} for ${currentStore.name}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="border-b border-stone-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C2E20]">Store Shelf Inventory Adjustment</h1>
          <p className="text-xs text-stone-500 mt-0.5">Real-time stock reconciliation and damage removal for {currentStore.name}</p>
        </div>

        <div className="bg-[#FAF8F5] p-2.5 rounded-2xl border border-stone-200 text-xs flex items-center gap-2">
          <span className="text-stone-500 font-medium">Adjustment Reason:</span>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="bg-white border border-stone-200 rounded-xl p-1.5 font-semibold text-stone-800"
          >
            <option value="Stock Count Reconciliation">Stock Count Reconciliation</option>
            <option value="Store Restock Received">Store Restock Received</option>
            <option value="Damaged / Expired Removal">Damaged / Expired Removal</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#2E4A32]"
        />
        <Search size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 font-semibold">
            <tr>
              <th className="p-4">Product Details</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Category</th>
              <th className="p-4">Current Stock ({currentStore.name})</th>
              <th className="p-4 text-right">Quick Adjust</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map(p => {
              const currentStock = p.stockByLocation.find(l => l.locationId === currentStaffStoreId)?.quantity || 0;

              return (
                <tr key={p.id} className="hover:bg-stone-50/80">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={getAVOLABProductImageFor(p)} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-stone-900">{p.name}</p>
                        <p className="text-[10px] text-stone-400">${p.price}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-mono text-stone-600">{p.sku}</td>
                  <td className="p-4 text-stone-600">{p.category}</td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      currentStock > 10 ? 'bg-emerald-100 text-emerald-800' : currentStock > 0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {currentStock} Units
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-stone-200">
                      <button
                        onClick={() => handleAdjust(p.id, -1)}
                        className="p-1 text-stone-600 hover:text-rose-600 rounded hover:bg-stone-200"
                        title="Reduce Stock (-1)"
                      >
                        <Minus size={14} />
                      </button>
                      <button
                        onClick={() => handleAdjust(p.id, 1)}
                        className="p-1 text-stone-600 hover:text-emerald-700 rounded hover:bg-stone-200"
                        title="Increase Stock (+1)"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => handleAdjust(p.id, 5)}
                        className="px-2 py-0.5 bg-[#2E4A32] text-amber-100 rounded text-[10px] font-bold hover:bg-[#1C2E20]"
                      >
                        +5 Restock
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

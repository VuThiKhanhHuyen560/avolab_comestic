import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, RefreshCcw, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getAVOLABProductImageFor } from '../../utils/productImages';

export const AdminInventoryMatrix: React.FC = () => {
  const { products, stores, adjustStock, showToast } = useApp();

  const handleReplenishStore = (productId: string, storeId: string, storeName: string) => {
    // Transfer 20 units from Warehouse to Store
    adjustStock(productId, 'wh-1', -20, `Replenishment transfer dispatched to ${storeName}`);
    adjustStock(productId, storeId, 20, `Replenishment transfer received from Central Warehouse`);
    showToast(`Transferred 20 units to ${storeName}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#1C2E20]">Omnichannel Multi-Store Inventory Matrix</h1>
        <p className="text-xs text-stone-500 mt-0.5">Real-time stock balance across Central Warehouse and Physical BOPIS Counters</p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 overflow-x-auto shadow-sm">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 font-semibold">
            <tr>
              <th className="p-4">Product Formulation</th>
              <th className="p-4">SKU</th>
              <th className="p-4 text-center">Central Warehouse (wh-1)</th>
              {stores.map(st => (
                <th key={st.id} className="p-4 text-center">{st.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map(p => {
              const whStock = p.stockByLocation.find(l => l.locationId === 'wh-1')?.quantity || 0;

              return (
                <tr key={p.id} className="hover:bg-stone-50/80">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={getAVOLABProductImageFor(p)} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-stone-900">{p.name}</p>
                        <p className="text-[10px] text-stone-400">{p.category}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 font-mono text-stone-600">{p.sku}</td>

                  {/* Warehouse Stock */}
                  <td className="p-4 text-center bg-stone-50/60 font-bold text-stone-900">
                    {whStock} Units
                  </td>

                  {/* Store Columns */}
                  {stores.map(st => {
                    const stStock = p.stockByLocation.find(l => l.locationId === st.id)?.quantity || 0;

                    return (
                      <td key={st.id} className="p-4 text-center">
                        <div className="space-y-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            stStock > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {stStock} Units
                          </span>

                          {stStock < 15 && (
                            <button
                              onClick={() => handleReplenishStore(p.id, st.id, st.name)}
                              className="block mx-auto text-[9px] font-bold text-[#2E4A32] underline hover:text-emerald-900"
                            >
                              Transfer +20 from WH
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

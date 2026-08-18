import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, StockTransfer } from '../../types';
import { 
  Boxes, 
  Search, 
  ArrowLeftRight, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Warehouse, 
  Store, 
  Edit3, 
  X,
  Building2
} from 'lucide-react';
import { getAVOLABProductImageFor } from '../../utils/productImages';

export const AdminInventoryManager: React.FC = () => {
  const { 
    products, 
    stores, 
    warehouses, 
    stockTransfers, 
    addStockTransfer, 
    updateStockTransferStatus, 
    adjustStock 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'MATRIX' | 'TRANSFERS'>('MATRIX');
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');

  // Adjust stock modal
  const [adjustModalProd, setAdjustModalProd] = useState<Product | null>(null);
  const [selectedLocId, setSelectedLocId] = useState<string>('wh-1');
  const [qtyDelta, setQtyDelta] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Stock Audit Adjustment');

  // Request transfer modal
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferProdId, setTransferProdId] = useState<string>(products[0]?.id || 'prod-1');
  const [sourceLocId, setSourceLocId] = useState<string>('wh-1');
  const [destLocId, setDestLocId] = useState<string>('store-1');
  const [transferQty, setTransferQty] = useState<number>(25);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === transferProdId);
    if (!prod) return;

    addStockTransfer({
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      sourceLocationId: sourceLocId,
      sourceLocationName: sourceLocId.startsWith('wh') ? 'Warehouse' : 'Store',
      destinationLocationId: destLocId,
      destinationLocationName: destLocId.startsWith('wh') ? 'Warehouse' : 'Store',
      quantity: transferQty,
      status: 'REQUESTED',
      createdAt: new Date().toISOString()
    });

    setIsTransferModalOpen(false);
  };

  const handlePerformAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalProd) return;

    adjustStock(adjustModalProd.id, selectedLocId, qtyDelta, adjustReason);
    setAdjustModalProd(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1C2E20]">Omnichannel Inventory Matrix</h1>
          <p className="text-xs text-stone-500">Real-time multi-location stock levels across warehouses, flagship stores, and transfer logistics.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="bg-[#2E4A32] text-amber-100 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1C2E20] transition-colors flex items-center gap-2 shadow-sm"
          >
            <ArrowLeftRight size={16} /> Request Stock Transfer
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex border-b border-stone-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('MATRIX')}
          className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'MATRIX' ? 'border-[#2E4A32] text-[#1C2E20]' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Stock Matrix Table
        </button>
        <button
          onClick={() => setActiveTab('TRANSFERS')}
          className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'TRANSFERS' ? 'border-[#2E4A32] text-[#1C2E20]' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Inter-Store Transfers ({stockTransfers.length})
        </button>
      </div>

      {/* Matrix Tab */}
      {activeTab === 'MATRIX' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search inventory by product name or SKU..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-600 text-[11px] font-bold uppercase tracking-wider border-b border-stone-200">
                    <th className="p-4">Product SKU</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Flagship Store (store-1)</th>
                    <th className="p-4">Mall Store (store-2)</th>
                    <th className="p-4">Central Warehouse (wh-1)</th>
                    <th className="p-4">Total Stock</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                  {filteredProducts.map(p => {
                    const store1Stock = p.stockByLocation?.find(l => l.locationId === 'store-1')?.quantity || 0;
                    const store2Stock = p.stockByLocation?.find(l => l.locationId === 'store-2')?.quantity || 0;
                    const wh1Stock = p.stockByLocation?.find(l => l.locationId === 'wh-1')?.quantity || 0;

                    return (
                      <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                        <td className="p-4 font-mono font-bold text-stone-800">{p.sku}</td>
                        <td className="p-4 font-bold text-stone-900 flex items-center gap-2">
                          <img src={getAVOLABProductImageFor(p)} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                          <span>{p.name}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-stone-700">{store1Stock} units</td>
                        <td className="p-4 font-mono font-bold text-stone-700">{store2Stock} units</td>
                        <td className="p-4 font-mono font-bold text-stone-700">{wh1Stock} units</td>
                        <td className="p-4">
                          <span className={`font-mono font-bold px-2.5 py-1 rounded text-[11px] ${p.totalStock < 25 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
                            {p.totalStock} total
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setAdjustModalProd(p);
                              setSelectedLocId('wh-1');
                              setQtyDelta(10);
                            }}
                            className="bg-stone-100 hover:bg-[#2E4A32] hover:text-amber-100 text-stone-800 px-3 py-1 rounded-xl text-xs font-bold transition-colors"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Transfers Tab */}
      {activeTab === 'TRANSFERS' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-100 text-stone-600 text-[11px] font-bold uppercase tracking-wider border-b border-stone-200">
                  <th className="p-4">Transfer #</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Route (Source &rarr; Dest)</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Logistics Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {stockTransfers.map(st => (
                  <tr key={st.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-stone-900">{st.transferNumber}</td>
                    <td className="p-4 font-bold text-stone-900">{st.productName} ({st.sku})</td>
                    <td className="p-4 text-stone-600 font-mono text-[11px]">
                      {st.sourceLocationId} &rarr; {st.destinationLocationId}
                    </td>
                    <td className="p-4 font-bold font-mono text-emerald-800">{st.quantity} units</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        st.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-900' :
                        st.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-900' :
                        st.status === 'APPROVED' ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {st.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {st.status === 'REQUESTED' && (
                        <button
                          onClick={() => updateStockTransferStatus(st.id, 'APPROVED')}
                          className="px-2.5 py-1 bg-amber-600 text-white rounded-lg font-bold text-[11px]"
                        >
                          Approve
                        </button>
                      )}
                      {st.status === 'APPROVED' && (
                        <button
                          onClick={() => updateStockTransferStatus(st.id, 'IN_TRANSIT')}
                          className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold text-[11px]"
                        >
                          Dispatch
                        </button>
                      )}
                      {st.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => updateStockTransferStatus(st.id, 'RECEIVED')}
                          className="px-2.5 py-1 bg-emerald-800 text-amber-100 rounded-lg font-bold text-[11px]"
                        >
                          Confirm Delivery
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustModalProd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif text-lg font-bold text-[#1C2E20]">Adjust Stock: {adjustModalProd.name}</h3>
              <button onClick={() => setAdjustModalProd(null)} className="text-stone-400 hover:text-stone-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePerformAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Target Inventory Location</label>
                <select
                  value={selectedLocId}
                  onChange={e => setSelectedLocId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                >
                  <option value="wh-1">Avolab Central Warehouse (wh-1)</option>
                  <option value="store-1">Avolab Flagship Downtown (store-1)</option>
                  <option value="store-2">Avolab Green Beauty Mall (store-2)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Quantity Change (+ to Add, - to Subtract)</label>
                <input
                  type="number"
                  required
                  value={qtyDelta}
                  onChange={e => setQtyDelta(parseInt(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Audit Reason</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setAdjustModalProd(null)}
                  className="px-4 py-2 border border-stone-200 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2E4A32] text-amber-100 rounded-xl font-bold hover:bg-[#1C2E20]"
                >
                  Apply Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-serif text-xl font-bold text-[#1C2E20]">Request Stock Transfer</h2>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Select Product *</label>
                <select
                  value={transferProdId}
                  onChange={e => setTransferProdId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Source Location</label>
                  <select
                    value={sourceLocId}
                    onChange={e => setSourceLocId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  >
                    <option value="wh-1">Warehouse (wh-1)</option>
                    <option value="store-1">Store 1 (store-1)</option>
                    <option value="store-2">Store 2 (store-2)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Destination Location</label>
                  <select
                    value={destLocId}
                    onChange={e => setDestLocId(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  >
                    <option value="store-1">Store 1 (store-1)</option>
                    <option value="store-2">Store 2 (store-2)</option>
                    <option value="wh-1">Warehouse (wh-1)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Transfer Units</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={transferQty}
                  onChange={e => setTransferQty(parseInt(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2E4A32] text-amber-100 rounded-xl font-bold hover:bg-[#1C2E20]"
                >
                  Submit Transfer Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

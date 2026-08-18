import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StoreLocation, WarehouseLocation } from '../../types';
import { Store, Warehouse, Plus, Edit2, Trash2, MapPin, Phone, Clock, Check, X } from 'lucide-react';

export const AdminStoresManager: React.FC = () => {
  const { stores, warehouses, addStore, updateStore, deleteStore, addWarehouse, updateWarehouse } = useApp();
  const [activeTab, setActiveTab] = useState<'STORES' | 'WAREHOUSES'>('STORES');

  // Modal State
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreLocation | null>(null);
  const [storeForm, setStoreForm] = useState<Partial<StoreLocation>>({
    name: '',
    address: '',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    phone: '+1 (415) 555-0199',
    openingHours: 'Mon-Sat: 10am - 8pm, Sun: 11am - 6pm',
    managerName: 'Elena Vance',
    bopisEnabled: true,
    latitude: 37.7749,
    longitude: -122.4194
  });

  const handleOpenCreateStore = () => {
    setEditingStore(null);
    setStoreForm({
      name: 'Avolab Boutique - SOHO',
      address: '428 West Broadway',
      city: 'New York',
      state: 'NY',
      zipCode: '10012',
      phone: '+1 (212) 555-0144',
      openingHours: 'Mon-Sat: 10am - 8pm',
      managerName: 'Marcus Vance',
      bopisEnabled: true,
      latitude: 40.7242,
      longitude: -74.0011
    });
    setIsStoreModalOpen(true);
  };

  const handleOpenEditStore = (st: StoreLocation) => {
    setEditingStore(st);
    setStoreForm({ ...st });
    setIsStoreModalOpen(true);
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeForm.name || !storeForm.address) return;

    if (editingStore) {
      updateStore(editingStore.id, storeForm);
    } else {
      addStore({
        name: storeForm.name,
        address: storeForm.address,
        city: storeForm.city || 'San Francisco',
        state: storeForm.state || 'CA',
        zipCode: storeForm.zipCode || '94102',
        phone: storeForm.phone || '+1 (555) 000-0000',
        openingHours: storeForm.openingHours || 'Mon-Sat: 10am - 7pm',
        managerName: storeForm.managerName || 'Manager',
        bopisEnabled: storeForm.bopisEnabled ?? true,
        latitude: Number(storeForm.latitude) || 37.77,
        longitude: Number(storeForm.longitude) || -122.41
      });
    }

    setIsStoreModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1C2E20]">Store Locations & Warehouses</h1>
          <p className="text-xs text-stone-500">Manage physical boutique stores, BOPIS pickup counters, and regional distribution centers.</p>
        </div>

        <button
          onClick={handleOpenCreateStore}
          className="bg-[#2E4A32] text-amber-100 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1C2E20] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Add Retail Store Location
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('STORES')}
          className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'STORES' ? 'border-[#2E4A32] text-[#1C2E20]' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Retail Boutiques ({stores.length})
        </button>
        <button
          onClick={() => setActiveTab('WAREHOUSES')}
          className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'WAREHOUSES' ? 'border-[#2E4A32] text-[#1C2E20]' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Fulfillment Warehouses ({warehouses.length})
        </button>
      </div>

      {/* Stores List */}
      {activeTab === 'STORES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map(st => (
            <div key={st.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                    <Store size={12} /> {st.bopisEnabled ? 'BOPIS Ready' : 'In-Store Only'}
                  </span>
                  <span className="text-stone-400 font-mono text-[10px]">ID: {st.id}</span>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#1C2E20]">{st.name}</h3>

                <div className="text-xs text-stone-600 space-y-1.5 pt-1">
                  <p className="flex items-start gap-2">
                    <MapPin size={14} className="text-emerald-800 shrink-0 mt-0.5" />
                    <span>{st.address}, {st.city}, {st.state} {st.zipCode}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-emerald-800 shrink-0" />
                    <span>{st.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={14} className="text-emerald-800 shrink-0" />
                    <span>{st.openingHours}</span>
                  </p>
                </div>

                <div className="bg-stone-50 p-2.5 rounded-xl text-[11px] text-stone-500 font-mono">
                  Store Manager: <span className="font-bold text-stone-800">{st.managerName}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold">
                <button
                  onClick={() => handleOpenEditStore(st)}
                  className="text-stone-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <Edit2 size={14} /> Edit Store
                </button>

                <button
                  onClick={() => deleteStore(st.id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Warehouses List */}
      {activeTab === 'WAREHOUSES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map(wh => (
            <div key={wh.id} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                    <Warehouse size={12} /> Distribution Center
                  </span>
                  <span className="text-stone-400 font-mono text-[10px]">ID: {wh.id}</span>
                </div>

                <h3 className="font-serif text-lg font-bold text-[#1C2E20]">{wh.name}</h3>

                <div className="text-xs text-stone-600 space-y-1.5 pt-1">
                  <p className="flex items-start gap-2">
                    <MapPin size={14} className="text-amber-800 shrink-0 mt-0.5" />
                    <span>{wh.address}, {wh.city}, {wh.state}</span>
                  </p>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl text-[11px] text-stone-600 space-y-1 font-mono">
                  <p>Facility Lead: <span className="font-bold text-stone-800">{wh.managerName}</span></p>
                  <p>Total Storage Capacity: <span className="font-bold text-emerald-800">{wh.capacity || 50000} units</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Store Form Modal */}
      {isStoreModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-serif text-xl font-bold text-[#1C2E20]">
                {editingStore ? 'Edit Store Location' : 'Add Retail Store Location'}
              </h2>
              <button onClick={() => setIsStoreModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStore} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Boutique Store Name *</label>
                <input
                  type="text"
                  required
                  value={storeForm.name || ''}
                  onChange={e => setStoreForm({ ...storeForm, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={storeForm.address || ''}
                  onChange={e => setStoreForm({ ...storeForm, address: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">City</label>
                  <input
                    type="text"
                    value={storeForm.city || ''}
                    onChange={e => setStoreForm({ ...storeForm, city: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">State</label>
                  <input
                    type="text"
                    value={storeForm.state || ''}
                    onChange={e => setStoreForm({ ...storeForm, state: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    value={storeForm.zipCode || ''}
                    onChange={e => setStoreForm({ ...storeForm, zipCode: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={storeForm.phone || ''}
                    onChange={e => setStoreForm({ ...storeForm, phone: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Store Manager</label>
                  <input
                    type="text"
                    value={storeForm.managerName || ''}
                    onChange={e => setStoreForm({ ...storeForm, managerName: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsStoreModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2E4A32] text-amber-100 rounded-xl font-bold hover:bg-[#1C2E20]"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Clock, Store, CheckCircle2, Search, Filter, Building2, Check } from 'lucide-react';
import { getAVOLABProductImageFor } from '../../utils/productImages';

export const StoreLocator: React.FC = () => {
  const { stores, products, setCurrentStaffStoreId } = useApp();
  const [selectedStoreId, setSelectedStoreId] = useState<string>(stores[0]?.id || 'store-1');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pickupSelectedStoreId, setPickupSelectedStoreId] = useState<string | null>(null);

  const cities = [
    { id: 'ALL', name: 'All Cities' },
    { id: 'Ho Chi Minh City', name: 'Ho Chi Minh City' },
    { id: 'Hanoi', name: 'Hanoi' },
    { id: 'Da Nang', name: 'Da Nang' },
    { id: 'Can Tho', name: 'Can Tho' },
    { id: 'Hai Phong', name: 'Hai Phong' },
    { id: 'Nha Trang', name: 'Nha Trang' },
  ];

  const filteredStores = stores.filter(st => {
    const matchesCity = selectedCity === 'ALL' || st.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesSearch = 
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const selectedStore = stores.find(s => s.id === selectedStoreId) || filteredStores[0] || stores[0];

  const handleSelectPickup = (storeId: string) => {
    setPickupSelectedStoreId(storeId);
    setCurrentStaffStoreId(storeId);
  };

  return (
    <div className="bg-[#F6F1E8] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Header */}
        <div className="border-b border-[#4C5D4B]/20 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#DDEAD2] text-[#4A5D4E] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                12 Flagship Stores
              </span>
              <span className="bg-[#DDEAD2] text-[#4A5D4E] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 size={12} /> Click & Collect Ready
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[#4A5D4E] tracking-tight">
              FLAGSHIP STORES
            </h1>
            <p className="text-xs text-[#4C5D4B] mt-1 font-medium">
              Explore AVOLAB luxury beauty flagship destinations across Vietnam. Experience in-store consultations & real-time BOPIS pickup.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search store name, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#4C5D4B]/30 rounded-xl pl-9 pr-4 py-2 text-xs text-[#4A5D4E] placeholder-[#4C5D4B]/60 focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
            />
            <Search size={14} className="absolute left-3 top-3 text-[#4A5D4E]" />
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-xs font-bold text-[#4A5D4E] uppercase tracking-wider flex items-center gap-1 mr-2">
            <Filter size={13} /> Filter:
          </span>
          {cities.map(city => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCity === city.id
                  ? 'bg-[#4A5D4E] text-[#FFFFFF] shadow-sm'
                  : 'bg-[#FFFFFF] text-[#4A5D4E] border border-[#4C5D4B]/20 hover:bg-[#DDEAD2]'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>

        {/* Main Stores Grid & Detail view */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left List Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#4A5D4E] text-xs uppercase tracking-widest flex items-center gap-1.5">
                <Building2 size={14} /> Vietnam Flagship Network ({filteredStores.length})
              </h3>
            </div>

            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
              {filteredStores.map((st, index) => {
                const isSelected = selectedStoreId === st.id;
                const isPickupChosen = pickupSelectedStoreId === st.id;

                return (
                  <div
                    key={st.id}
                    onClick={() => setSelectedStoreId(st.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFFFFF] border-[#4A5D4E] ring-2 ring-[#4A5D4E]/30 shadow-md'
                        : 'bg-[#FFFFFF] border-[#4C5D4B]/20 hover:border-[#4A5D4E] shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4C5D4B]">
                          STORE {String(index + 1).padStart(2, '0')} • {st.city}
                        </span>
                        <h4 className="font-bold text-base text-[#4A5D4E] mt-0.5">{st.name}</h4>
                      </div>
                      
                      <span className="bg-[#DDEAD2] text-[#4A5D4E] text-[10px] font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap">
                        Click & Collect
                      </span>
                    </div>

                    <p className="text-xs text-[#4C5D4B] mt-2 flex items-start gap-1.5 leading-relaxed">
                      <MapPin size={14} className="text-[#4A5D4E] flex-shrink-0 mt-0.5" />
                      <span>{st.address}</span>
                    </p>

                    <div className="mt-3 pt-3 border-t border-[#4C5D4B]/15 flex items-center justify-between text-xs">
                      <span className="text-[#4C5D4B] flex items-center gap-1 text-[11px] font-medium">
                        <Clock size={13} className="text-[#4A5D4E]" /> {st.hours}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectPickup(st.id);
                          }}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                            isPickupChosen
                              ? 'bg-[#4A5D4E] text-[#FFFFFF] flex items-center gap-1'
                              : 'bg-[#DDEAD2] text-[#4A5D4E] hover:bg-[#DDEAD2] hover:opacity-90'
                          }`}
                        >
                          {isPickupChosen ? (
                            <>
                              <Check size={12} /> Pickup Selected
                            </>
                          ) : (
                            'Select for Pickup'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredStores.length === 0 && (
                <div className="p-8 text-center bg-[#FFFFFF] border border-dashed border-[#4C5D4B]/30 rounded-2xl">
                  <p className="text-xs font-medium text-[#4C5D4B]">No flagship stores found matching your filter criteria.</p>
                  <button
                    onClick={() => { setSelectedCity('ALL'); setSearchQuery(''); }}
                    className="mt-3 text-xs text-[#4A5D4E] underline font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Detail & Inventory Column */}
          <div className="lg:col-span-7 space-y-6">
            {selectedStore && (
              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#4C5D4B]/20 shadow-sm space-y-6">
                
                {/* Store Header Detail */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#4C5D4B]/20 pb-5 gap-4">
                  <div>
                    <span className="bg-[#DDEAD2] text-[#4A5D4E] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-widest">
                      {selectedStore.city} Flagship
                    </span>
                    <h2 className="font-serif text-2xl font-bold text-[#4A5D4E] mt-1">{selectedStore.name}</h2>
                    <p className="text-xs text-[#4C5D4B] mt-1 flex items-center gap-1">
                      <MapPin size={13} className="text-[#4A5D4E]" /> {selectedStore.address}
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectPickup(selectedStore.id)}
                    className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all shadow-2xs ${
                      pickupSelectedStoreId === selectedStore.id
                        ? 'bg-[#4A5D4E] text-[#FFFFFF]'
                        : 'bg-[#4A5D4E] text-[#FFFFFF] hover:bg-[#4C5D4B]'
                    }`}
                  >
                    {pickupSelectedStoreId === selectedStore.id ? '✓ Preferred Pickup Store' : 'Set as Pickup Store'}
                  </button>
                </div>

                {/* Operating Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#DDEAD2]/40 p-4 rounded-2xl border border-[#4C5D4B]/15">
                  <div className="flex items-center gap-2.5">
                    <Clock size={18} className="text-[#4A5D4E]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#4C5D4B] font-bold">Operating Hours</p>
                      <p className="font-semibold text-[#4A5D4E]">{selectedStore.hours}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone size={18} className="text-[#4A5D4E]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#4C5D4B] font-bold">Direct Counter Line</p>
                      <p className="font-semibold text-[#4A5D4E]">{selectedStore.phone || '(028) 3822 1092'}</p>
                    </div>
                  </div>
                </div>

                {/* Real-time Inventory Table for Selected Store */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#4A5D4E] text-xs uppercase tracking-widest">
                      Live Product Availability at {selectedStore.name}
                    </h3>
                    <span className="text-[11px] text-[#4C5D4B] font-medium">BOPIS Express Verified</span>
                  </div>

                  <div className="divide-y divide-[#4C5D4B]/15 border border-[#4C5D4B]/20 rounded-2xl overflow-hidden bg-[#FFFFFF]">
                    {products.slice(0, 8).map(p => {
                      const locStock = p.stockByLocation?.find(l => l.locationId === selectedStore.id)?.quantity || (p.stockQuantity > 0 ? 15 : 0);

                      return (
                        <div key={p.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#DDEAD2]/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <img src={getAVOLABProductImageFor(p)} alt={p.name} className="w-10 h-10 rounded-xl object-cover border border-[#4C5D4B]/20" />
                            <div>
                              <p className="font-bold text-[#4A5D4E]">{p.name}</p>
                              <p className="text-[10px] text-[#4C5D4B]">SKU: {p.sku} • ${p.price}</p>
                            </div>
                          </div>

                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                            locStock > 5
                              ? 'bg-[#DDEAD2] text-[#4A5D4E]'
                              : locStock > 0
                              ? 'bg-[#DDEAD2] text-[#4C5D4B]'
                              : 'bg-stone-200 text-[#4C5D4B]'
                          }`}>
                            {locStock > 0 ? `${locStock} Units Available` : 'Out of Stock'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

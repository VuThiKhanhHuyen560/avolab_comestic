import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, QrCode, Filter, Store, Truck, ShieldAlert } from 'lucide-react';
import { OrderStatus } from '../../types';

export const AdminOrderManager: React.FC = () => {
  const { orders, updateOrderStatus, stores, showToast } = useApp();
  const [filterStore, setFilterStore] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');

  const filteredOrders = orders.filter(o => {
    if (filterStore !== 'ALL' && o.storeId !== filterStore) return false;
    if (filterStatus !== 'ALL' && o.orderStatus !== filterStatus) return false;
    if (filterType !== 'ALL' && o.fulfillmentType !== filterType) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#1C2E20]">Omnichannel Master Orders Manager</h1>
        <p className="text-xs text-stone-500 mt-0.5">Global overview of all customer orders, store pickups, and courier deliveries</p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-medium">
        <div>
          <label className="block text-stone-500 text-[11px] mb-1">Filter Store Location:</label>
          <select
            value={filterStore}
            onChange={(e) => setFilterStore(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl p-2 text-stone-800"
          >
            <option value="ALL">All Store Locations</option>
            {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-stone-500 text-[11px] mb-1">Filter Fulfillment Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl p-2 text-stone-800"
          >
            <option value="ALL">All Fulfillment Types</option>
            <option value="BOPIS">BOPIS Store Pickup</option>
            <option value="DELIVERY">Standard Delivery</option>
          </select>
        </div>

        <div>
          <label className="block text-stone-500 text-[11px] mb-1">Filter Order Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-xl p-2 text-stone-800"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="PICKING">PICKING</option>
            <option value="PACKED">PACKED</option>
            <option value="READY_FOR_PICKUP">READY FOR PICKUP</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 font-semibold">
            <tr>
              <th className="p-4">Order Ref</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Fulfillment / Store</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Override Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredOrders.map(ord => (
              <tr key={ord.id} className="hover:bg-stone-50/80">
                <td className="p-4 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                <td className="p-4">
                  <p className="font-bold text-stone-900">{ord.customerName}</p>
                  <p className="text-[10px] text-stone-400">{ord.customerEmail}</p>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-stone-800">{ord.fulfillmentType}</p>
                  <p className="text-[10px] text-stone-500">{ord.storeName || 'Online Fulfillment Warehouse'}</p>
                </td>
                <td className="p-4 font-bold text-[#1C2E20]">${ord.total.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    ord.orderStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                    ord.orderStatus === 'READY_FOR_PICKUP' ? 'bg-amber-100 text-amber-800' :
                    'bg-sky-100 text-sky-800'
                  }`}>
                    {ord.orderStatus}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <select
                    value={ord.orderStatus}
                    onChange={(e) => {
                      updateOrderStatus(ord.id, e.target.value as OrderStatus);
                      showToast(`Order ${ord.orderNumber} updated to ${e.target.value}`);
                    }}
                    className="bg-[#FAF8F5] border border-stone-200 rounded-lg p-1.5 text-xs font-semibold text-stone-800"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PICKING">PICKING</option>
                    <option value="PACKED">PACKED</option>
                    <option value="READY_FOR_PICKUP">READY_FOR_PICKUP</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

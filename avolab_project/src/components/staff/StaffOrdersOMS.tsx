import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  QrCode, 
  PackageCheck, 
  Clock, 
  CheckCircle2, 
  Search, 
  Store, 
  Truck, 
  CreditCard, 
  AlertCircle, 
  XCircle, 
  Filter, 
  MapPin, 
  User, 
  FileText 
} from 'lucide-react';
import { Order, OrderStatus, FulfillmentType } from '../../types';
import { getAVOLABProductImageFor, normalizeAVOLABImage } from '../../utils/productImages';

export const StaffOrdersOMS: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    stores, 
    currentStaffStoreId, 
    setCurrentStaffStoreId, 
    showToast, 
    setActiveTab 
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [pickedItems, setPickedItems] = useState<Record<string, boolean>>({});

  const currentStore = stores.find(s => s.id === currentStaffStoreId) || stores[0];

  // Keep the detail panel synchronized with the same server-backed order object
  // used by the queue. This prevents a stale selectedOrder when another role/tab
  // updates the order through SSE.
  useEffect(() => {
    if (!selectedOrder) return;
    const latest = orders.find(o => o.id === selectedOrder.id);
    if (latest) setSelectedOrder(latest);
  }, [orders, selectedOrder?.id]);

  // OMS is the cross-role operational order queue.
  //
  // IMPORTANT: Do not hide BOPIS orders simply because the staff browser is
  // currently viewing another store. Customer checkout persists the selected
  // store in `orders.store_id`, and the same SQL-backed order is broadcast to
  // every role. The OMS must therefore surface every BOPIS order so a Staff
  // user can see that the order exists and its current lifecycle state.
  // Store ownership is still displayed on each order and the QR Verification
  // screen continues to enforce the active-store check before handover.
  // Home Delivery orders remain visible to all staff as before.
  const storeOrders = orders.filter(o =>
    o.fulfillmentType === 'BOPIS' ||
    o.fulfillmentType === 'DELIVERY' ||
    !o.storeId
  );

  // Apply search and filters
  const filteredOrders = storeOrders.filter(o => {
    // Status Filter
    if (activeFilter !== 'ALL') {
      if (activeFilter === 'PACKED' && (o.orderStatus === 'PACKED' || o.orderStatus === 'READY_FOR_PICKUP')) {
        // match packed view
      } else if (o.orderStatus !== activeFilter) {
        return false;
      }
    }

    // Fulfillment Filter
    if (fulfillmentFilter !== 'ALL' && o.fulfillmentType !== fulfillmentFilter) {
      return false;
    }

    // Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchCust = o.customerName.toLowerCase().includes(q);
      const matchEmail = o.customerEmail.toLowerCase().includes(q);
      const matchItem = o.items.some(i => i.productName.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
      if (!matchNum && !matchCust && !matchEmail && !matchItem) return false;
    }

    return true;
  });

  const handleTogglePicked = (productId: string) => {
    setPickedItems(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus) => {
    updateOrderStatus(orderId, nextStatus);
    showToast(`Order #${selectedOrder?.orderNumber || orderId} updated to ${nextStatus}`);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, orderStatus: nextStatus, updatedAt: new Date().toISOString() });
    }
  };

  const statusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
      case 'PROCESSING': return 'bg-[#F3F4F6] text-[#374151] border-[#D1D5DB]';
      case 'PICKING': return 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]';
      case 'PACKED': return 'bg-[#E0E7FF] text-[#3730A3] border-[#C7D2FE]';
      case 'READY_FOR_PICKUP': return 'bg-[#DDEAD2] text-[#263D2B] border-[#C8D8BE]';
      case 'SHIPPED': return 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]';
      case 'COMPLETED': return 'bg-[#EAF2E3] text-[#263D2B] border-[#DDEAD2]';
      case 'CANCELLED':
      case 'REFUNDED': return 'bg-[#FFE4E6] text-[#9F1239] border-[#FECDD3]';
      default: return 'bg-[#F6F1E8] text-[#667064] border-[#D8D5C9]';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-[#4A5D4E] text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#DDEAD2] text-[#4A5D4E] text-[10px] font-bold px-2.5 py-0.5 rounded font-mono uppercase tracking-wider">
              ORDER MANAGEMENT SYSTEM (OMS)
            </span>
            <span className="text-xs text-[#EAF2E3] font-mono">Location ID: {currentStaffStoreId}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-white">BOPIS & Delivery Fulfillment Station</h1>
          <p className="text-xs text-[#EAF2E3]">Manage picking tasks, order processing, packing queues, and customer counter handovers.</p>
        </div>

        {/* Store Location Selector for Staff */}
        <div className="bg-white p-3 rounded-2xl border border-[#D8D5C9] flex flex-col gap-1 min-w-[240px]">
          <label className="text-[10px] text-[#4A5D4E] uppercase font-mono font-bold">Active Staff Store:</label>
          <select
            value={currentStaffStoreId}
            onChange={(e) => setCurrentStaffStoreId(e.target.value)}
            className="bg-[#F6F1E8] border border-[#D8D5C9] text-[#263D2B] rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
          >
            {stores.map(st => (
              <option key={st.id} value={st.id}>{st.name} ({st.city})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Order Queue & Filters Column */}
        <div className="space-y-4">
          
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order #, Customer, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-[#D8D5C9] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#263D2B] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
            />
            <Search size={15} className="absolute left-3.5 top-3 text-[#667064]" />
          </div>

          {/* Fulfillment Type Selector Toggle */}
          <div className="flex gap-2 text-xs">
            {['ALL', 'BOPIS', 'DELIVERY'].map(ft => (
              <button
                key={ft}
                onClick={() => setFulfillmentFilter(ft)}
                className={`flex-1 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                  fulfillmentFilter === ft
                    ? 'bg-[#4A5D4E] text-white border-[#4A5D4E]'
                    : 'bg-white text-[#4A5D4E] border-[#D8D5C9] hover:bg-[#DDEAD2]'
                }`}
              >
                {ft === 'ALL' ? 'All Methods' : ft === 'BOPIS' ? '🛍️ Store Pickup' : '🚚 Home Delivery'}
              </button>
            ))}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-1.5 bg-[#EAF2E3]/60 p-1.5 rounded-2xl border border-[#D8D5C9] text-xs font-semibold overflow-x-auto no-scrollbar">
            {['ALL', 'PENDING', 'PROCESSING', 'PICKING', 'PACKED', 'READY_FOR_PICKUP', 'SHIPPED', 'COMPLETED', 'CANCELLED'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-xl transition-all flex-shrink-0 text-[11px] font-bold ${
                  activeFilter === f ? 'bg-[#4A5D4E] text-white shadow-xs' : 'text-[#4A5D4E] hover:bg-[#DDEAD2]'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Order Cards Queue List */}
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-[#D8D5C9] text-center text-xs text-[#667064]">
                No orders matching filter "{activeFilter}" at {currentStore.name}.
              </div>
            ) : (
              filteredOrders.map(ord => (
                <div
                  key={ord.id}
                  onClick={() => {
                    setSelectedOrder(ord);
                    setPickedItems({});
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                    selectedOrder?.id === ord.id
                      ? 'bg-white border-[#4A5D4E] ring-2 ring-[#4A5D4E]/20 shadow-md'
                      : 'bg-white border-[#D8D5C9] hover:border-[#4A5D4E]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#263D2B]">{ord.orderNumber}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor(ord.orderStatus)}`}>
                      {ord.orderStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#263D2B] font-medium">
                    <span className="line-clamp-1">{ord.customerName}</span>
                    <span className="font-mono font-bold text-[#263D2B]">${ord.total.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#667064] border-t border-[#D8D5C9]/60 pt-2">
                    <span className="flex items-center gap-1 font-semibold text-[#4A5D4E]">
                      {ord.fulfillmentType === 'BOPIS' ? '🛍️ In-Store Pickup' : '🚚 Delivery'}
                      <span>•</span>
                      <span>{ord.items.length} items</span>
                    </span>
                    <span className="font-mono text-[#667064]">
                      {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Order Detail & Processing Workflow */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedOrder ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#D8D5C9] text-xs text-[#667064] space-y-3">
              <PackageCheck size={40} className="text-[#D8D5C9] mx-auto" />
              <p className="font-bold text-[#263D2B] text-sm">Select an order from the queue to start picking or processing.</p>
              <p className="text-[#667064]">View customer items, verify payment, toggle picking checklist, or update fulfillment status.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#D8D5C9] p-6 shadow-xs space-y-6">
              
              {/* Order Detail Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8D5C9] pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-mono font-bold text-xl text-[#263D2B]">{selectedOrder.orderNumber}</h2>
                    <span className="bg-[#DDEAD2] text-[#263D2B] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#C8D8BE]">
                      {selectedOrder.fulfillmentType === 'BOPIS' ? 'BOPIS Pickup' : 'Delivery'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColor(selectedOrder.orderStatus)}`}>
                      {selectedOrder.orderStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#667064] mt-1">
                    Customer: <span className="font-semibold text-[#263D2B]">{selectedOrder.customerName}</span> ({selectedOrder.customerEmail})
                  </p>
                </div>

                {/* Status Updater Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  {(selectedOrder.orderStatus === 'PENDING' ||
                    (selectedOrder.orderStatus === 'PROCESSING' && selectedOrder.fulfillmentType === 'BOPIS')) && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'PICKING')}
                      className="bg-[#0284C7] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#0369A1] shadow-xs"
                    >
                      Start Picking
                    </button>
                  )}

                  {selectedOrder.orderStatus === 'PICKING' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'PACKED')}
                      className="bg-[#4F46E5] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#4338CA] shadow-xs"
                    >
                      Mark Packed
                    </button>
                  )}

                  {selectedOrder.orderStatus === 'PACKED' && (
                    <>
                      {selectedOrder.fulfillmentType === 'BOPIS' ? (
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'READY_FOR_PICKUP')}
                          className="bg-[#4A5D4E] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#263D2B] shadow-xs"
                        >
                          Mark Ready for Counter Pickup
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPED')}
                          className="bg-[#7C3AED] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#6D28D9] shadow-xs"
                        >
                          Dispatch Courier Shipping
                        </button>
                      )}
                    </>
                  )}

                  {selectedOrder.orderStatus === 'READY_FOR_PICKUP' && selectedOrder.fulfillmentType === 'BOPIS' && (
                    <button
                      onClick={() => setActiveTab('STAFF_BOPIS')}
                      className="bg-[#4A5D4E] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#263D2B] shadow-xs flex items-center gap-1.5"
                    >
                      <QrCode size={15} /> QR Verification
                    </button>
                  )}

                  {selectedOrder.orderStatus === 'SHIPPED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'COMPLETED')}
                      className="bg-[#4A5D4E] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#263D2B] shadow-xs"
                    >
                      Mark Order Delivered
                    </button>
                  )}

                  {selectedOrder.orderStatus !== 'COMPLETED' && selectedOrder.orderStatus !== 'CANCELLED' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                      className="bg-[#F6F1E8] text-[#667064] border border-[#D8D5C9] px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#FFE4E6] hover:text-[#9F1239] transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Order Info Cards: Fulfillment Details & Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#EAF2E3]/40 p-4 rounded-2xl border border-[#D8D5C9] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#263D2B] font-bold">
                    <MapPin size={14} className="text-[#4A5D4E]" />
                    <span>Fulfillment & Location</span>
                  </div>
                  <p className="font-medium text-[#263D2B]">
                    {selectedOrder.fulfillmentType === 'BOPIS' 
                      ? `Pickup at ${selectedOrder.storeName || currentStore.name}`
                      : `Ship to: ${selectedOrder.shippingAddress?.street || 'Customer Address'}, ${selectedOrder.shippingAddress?.city || ''}`
                    }
                  </p>
                  <p className="text-[10px] text-[#667064] font-mono">Phone: {selectedOrder.customerPhone || 'N/A'}</p>
                </div>

                <div className="bg-[#EAF2E3]/40 p-4 rounded-2xl border border-[#D8D5C9] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#263D2B] font-bold">
                    <CreditCard size={14} className="text-[#4A5D4E]" />
                    <span>Payment & Summary</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#667064]">Payment Status:</span>
                    <span className="font-bold text-[#263D2B] bg-[#DDEAD2] px-2 py-0.5 rounded text-[10px]">
                      {selectedOrder.paymentStatus} ({selectedOrder.paymentMethod})
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-[#263D2B] pt-1">
                    <span>Total Amount:</span>
                    <span className="font-mono text-[#263D2B] text-sm">${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Items Picking Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[#263D2B] text-xs uppercase tracking-wider">Store Shelf Picking Checklist</h3>
                  <span className="text-[11px] text-[#667064] font-mono font-bold">
                    {Object.values(pickedItems).filter(Boolean).length} / {selectedOrder.items.length} Items Picked
                  </span>
                </div>

                <div className="divide-y divide-[#D8D5C9] border border-[#D8D5C9] rounded-2xl overflow-hidden">
                  {selectedOrder.items.map((item, idx) => {
                    const isChecked = !!pickedItems[item.productId];

                    return (
                      <div
                        key={idx}
                        onClick={() => handleTogglePicked(item.productId)}
                        className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                          isChecked ? 'bg-[#EAF2E3]' : 'bg-white hover:bg-[#F6F1E8]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 accent-[#4A5D4E] rounded"
                          />
                          <img src={normalizeAVOLABImage(item.productImage)} alt={item.productName} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className={`text-xs font-semibold ${isChecked ? 'line-through text-[#667064]' : 'text-[#263D2B]'}`}>
                              {item.productName}
                            </p>
                            <p className="text-[10px] text-[#667064] font-mono">SKU: {item.sku} • Location: Aisle 2 - Shelf B</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-xs text-[#263D2B] bg-[#F6F1E8] px-2.5 py-1 rounded-lg border border-[#D8D5C9]">
                            Qty: {item.quantity}
                          </span>
                          <p className="text-[10px] text-[#667064] font-mono mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Notes */}
              {selectedOrder.notes && (
                <div className="p-3 bg-[#FEF3D6] rounded-2xl border border-[#FDE68A] text-xs space-y-1">
                  <span className="font-bold text-[#B45309] flex items-center gap-1">
                    <FileText size={13} /> Order Special Notes:
                  </span>
                  <p className="text-[#92400E] text-[11px]">{selectedOrder.notes}</p>
                </div>
              )}

              {/* BOPIS Verification shortcut is available only after the order reaches READY_FOR_PICKUP. */}
              {selectedOrder.fulfillmentType === 'BOPIS' && selectedOrder.orderStatus === 'READY_FOR_PICKUP' && (
                <div className="bg-[#EAF2E3]/50 p-4 rounded-2xl border border-[#D8D5C9] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#263D2B]">BOPIS verification is ready</p>
                    <p className="text-[#667064] text-[11px]">Customer QR is now eligible for counter verification.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('STAFF_BOPIS')}
                    className="bg-[#4A5D4E] text-white px-4 py-2 rounded-xl font-bold hover:bg-[#263D2B] transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <QrCode size={14} /> BOPIS Verification
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  PackageCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Truck, 
  QrCode, 
  Layers, 
  ArrowRight, 
  Store, 
  ShoppingBag, 
  Activity, 
  XCircle,
  BarChart2
} from 'lucide-react';
import { getAVOLABProductImageFor } from '../../utils/productImages';

export const StaffOpsDashboard: React.FC = () => {
  const { 
    orders, 
    products, 
    stores, 
    currentStaffStoreId, 
    setCurrentStaffStoreId,
    setActiveTab,
    updateOrderStatus
  } = useApp();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || null;

  const handleStatus = async (orderId: string, status: any) => {
    await updateOrderStatus(orderId, status);
  };

  const getNextAction = (ord: any) => {
    if (ord.orderStatus === 'PENDING' || ord.orderStatus === 'PROCESSING') {
      return { label: 'Start Picking', status: 'PICKING', tone: 'blue' };
    }
    if (ord.orderStatus === 'PICKING') {
      return { label: 'Mark Packed', status: 'PACKED', tone: 'indigo' };
    }
    if (ord.orderStatus === 'PACKED') {
      return ord.fulfillmentType === 'BOPIS'
        ? { label: 'Mark Ready for Counter Pickup', status: 'READY_FOR_PICKUP', tone: 'green' }
        : { label: 'Dispatch Courier Shipping', status: 'SHIPPED', tone: 'purple' };
    }
    if (ord.orderStatus === 'SHIPPED' && ord.fulfillmentType === 'DELIVERY') {
      return { label: 'Mark Order Delivered', status: 'COMPLETED', tone: 'green' };
    }
    if (ord.orderStatus === 'READY_FOR_PICKUP' && ord.fulfillmentType === 'BOPIS') {
      return { label: 'Open QR Verification', status: 'VERIFY', tone: 'green' };
    }
    return null;
  };

  const actionClass = (tone: string) => {
    if (tone === 'blue') return 'bg-[#0284C7] hover:bg-[#0369A1] text-white';
    if (tone === 'indigo') return 'bg-[#4F46E5] hover:bg-[#4338CA] text-white';
    if (tone === 'purple') return 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white';
    return 'bg-[#4A5D4E] hover:bg-[#263D2B] text-white';
  };


  const currentStore = stores.find(s => s.id === currentStaffStoreId) || stores[0];

  // Filter orders relevant to this staff store or delivery
  const storeOrders = orders.filter(
    o => o.storeId === currentStaffStoreId || o.fulfillmentType === 'DELIVERY' || !o.storeId
  );

  // Operational metrics
  const totalOrdersCount = storeOrders.length;
  const pendingCount = storeOrders.filter(o => o.orderStatus === 'PENDING' || o.orderStatus === 'PROCESSING').length;
  const pickingCount = storeOrders.filter(o => o.orderStatus === 'PICKING').length;
  const packedCount = storeOrders.filter(o => o.orderStatus === 'PACKED').length;
  const readyPickupCount = storeOrders.filter(o => o.orderStatus === 'READY_FOR_PICKUP').length;
  const shippedCount = storeOrders.filter(o => o.orderStatus === 'SHIPPED').length;
  const completedCount = storeOrders.filter(o => o.orderStatus === 'COMPLETED').length;
  const cancelledCount = storeOrders.filter(o => o.orderStatus === 'CANCELLED' || o.orderStatus === 'REFUNDED').length;

  const bopisCount = storeOrders.filter(o => o.fulfillmentType === 'BOPIS').length;
  const deliveryCount = storeOrders.filter(o => o.fulfillmentType === 'DELIVERY').length;

  const totalRevenue = storeOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  // Low stock inventory items (< 12 units total or location specific)
  const lowStockProducts = products.filter(p => {
    const locStock = p.stockByLocation?.find(l => l.locationId === currentStaffStoreId)?.quantity ?? p.stockQuantity;
    return locStock <= 12;
  });

  // Derived recent activity
  const recentOrders = [...storeOrders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-[#263D2B] text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#DDEAD2] text-[#4A5D4E] text-[10px] font-bold px-2.5 py-0.5 rounded font-mono uppercase tracking-wider">
              STORE OPERATIONS OVERVIEW
            </span>
            <span className="text-xs text-[#EAF2E3] font-mono">Location ID: {currentStaffStoreId}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-white">Ops & Fulfillment Command Center</h1>
          <p className="text-xs text-[#EAF2E3]">Real-time operational summary, inventory alerts, and fulfillment throughput.</p>
        </div>

        {/* Active Staff Store Selector */}
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

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Orders Card */}
        <div className="bg-white p-5 rounded-3xl border border-[#D8D5C9] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#667064] uppercase tracking-wider">Total Active Orders</span>
            <div className="w-8 h-8 rounded-xl bg-[#EAF2E3] text-[#263D2B] flex items-center justify-center">
              <Package size={18} />
            </div>
          </div>
          <p className="font-mono text-3xl font-bold text-[#263D2B]">{totalOrdersCount}</p>
          <div className="flex items-center gap-2 text-[11px] text-[#667064] pt-1 border-t border-[#D8D5C9]/60">
            <span className="text-[#4A5D4E] font-bold">{bopisCount} BOPIS</span>
            <span>•</span>
            <span className="text-[#0369A1] font-bold">{deliveryCount} Delivery</span>
          </div>
        </div>

        {/* Pending & Picking Card */}
        <div className="bg-white p-5 rounded-3xl border border-[#D8D5C9] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#667064] uppercase tracking-wider">Pending / Picking</span>
            <div className="w-8 h-8 rounded-xl bg-[#FEF3D6] text-[#B45309] flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <p className="font-mono text-3xl font-bold text-[#78350F]">{pendingCount + pickingCount}</p>
          <div className="flex items-center gap-2 text-[11px] text-[#667064] pt-1 border-t border-[#D8D5C9]/60">
            <span className="font-semibold text-[#B45309]">{pendingCount} Pending</span>
            <span>•</span>
            <span className="font-semibold text-[#0369A1]">{pickingCount} In Picking</span>
          </div>
        </div>

        {/* Ready for Pickup Card */}
        <div className="bg-white p-5 rounded-3xl border border-[#D8D5C9] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#667064] uppercase tracking-wider">Ready / Packed</span>
            <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center">
              <PackageCheck size={18} />
            </div>
          </div>
          <p className="font-mono text-3xl font-bold text-[#0C4A6E]">{packedCount + readyPickupCount}</p>
          <div className="flex items-center gap-2 text-[11px] text-[#667064] pt-1 border-t border-[#D8D5C9]/60">
            <span className="font-semibold text-[#3730A3]">{packedCount} Packed</span>
            <span>•</span>
            <span className="font-semibold text-[#263D2B]">{readyPickupCount} Counter Ready</span>
          </div>
        </div>

        {/* Completed & Shipped Card */}
        <div className="bg-white p-5 rounded-3xl border border-[#D8D5C9] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#667064] uppercase tracking-wider">Completed / Shipped</span>
            <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="font-mono text-3xl font-bold text-[#14532D]">{completedCount + shippedCount}</p>
          <div className="flex items-center gap-2 text-[11px] text-[#667064] pt-1 border-t border-[#D8D5C9]/60">
            <span className="font-semibold text-[#15803D]">{completedCount} Handed Over</span>
            <span>•</span>
            <span className="font-semibold text-[#6B21A8]">{shippedCount} Shipped</span>
          </div>
        </div>

      </div>

      {/* Middle Grid: Operational Throughput Breakdown & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Pipeline Distribution & Operational Performance */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Status Breakdown Bar */}
          <div className="bg-white p-6 rounded-3xl border border-[#D8D5C9] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#263D2B]">Fulfillment Status Pipeline</h3>
                <p className="text-xs text-[#667064]">Breakdown of orders in store picking, packing, and counter handoff queues</p>
              </div>
              <button
                onClick={() => setActiveTab('STAFF_ORDERS')}
                className="text-xs font-bold text-[#4A5D4E] hover:text-[#263D2B] hover:underline flex items-center gap-1"
              >
                Go to OMS Queue <ArrowRight size={14} />
              </button>
            </div>

            {/* Visual Pipeline Segments */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-[#EAF2E3] rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${totalOrdersCount ? (pendingCount / totalOrdersCount) * 100 : 0}%` }} 
                  className="bg-[#F59E0B] h-full transition-all" 
                  title={`Pending: ${pendingCount}`}
                />
                <div 
                  style={{ width: `${totalOrdersCount ? (pickingCount / totalOrdersCount) * 100 : 0}%` }} 
                  className="bg-[#0EA5E9] h-full transition-all" 
                  title={`Picking: ${pickingCount}`}
                />
                <div 
                  style={{ width: `${totalOrdersCount ? (packedCount / totalOrdersCount) * 100 : 0}%` }} 
                  className="bg-[#6366F1] h-full transition-all" 
                  title={`Packed: ${packedCount}`}
                />
                <div 
                  style={{ width: `${totalOrdersCount ? (readyPickupCount / totalOrdersCount) * 100 : 0}%` }} 
                  className="bg-[#DDEAD2] h-full transition-all" 
                  title={`Ready for Pickup: ${readyPickupCount}`}
                />
                <div 
                  style={{ width: `${totalOrdersCount ? (completedCount / totalOrdersCount) * 100 : 0}%` }} 
                  className="bg-[#263D2B] h-full transition-all" 
                  title={`Completed: ${completedCount}`}
                />
              </div>

              {/* Legend Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                  <div>
                    <p className="text-[#667064] text-[10px]">Pending</p>
                    <p className="font-mono font-bold text-[#263D2B]">{pendingCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0EA5E9]" />
                  <div>
                    <p className="text-[#667064] text-[10px]">Picking</p>
                    <p className="font-mono font-bold text-[#263D2B]">{pickingCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#6366F1]" />
                  <div>
                    <p className="text-[#667064] text-[10px]">Packed</p>
                    <p className="font-mono font-bold text-[#263D2B]">{packedCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#DDEAD2]" />
                  <div>
                    <p className="text-[#667064] text-[10px]">Ready Pickup</p>
                    <p className="font-mono font-bold text-[#263D2B]">{readyPickupCount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#263D2B]" />
                  <div>
                    <p className="text-[#667064] text-[10px]">Completed</p>
                    <p className="font-mono font-bold text-[#263D2B]">{completedCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fulfillment Performance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#EAF2E3]/50 p-4 rounded-2xl border border-[#D8D5C9] space-y-1">
              <span className="text-[10px] font-bold text-[#667064] uppercase tracking-wider">Avg Order Pick Time</span>
              <p className="font-mono text-xl font-bold text-[#263D2B]">11.4 mins</p>
              <p className="text-[10px] text-[#4A5D4E] font-semibold">⚡ 2.1 mins faster than target</p>
            </div>
            <div className="bg-[#EAF2E3]/50 p-4 rounded-2xl border border-[#D8D5C9] space-y-1">
              <span className="text-[10px] font-bold text-[#667064] uppercase tracking-wider">On-Time Handover %</span>
              <p className="font-mono text-xl font-bold text-[#263D2B]">98.8%</p>
              <p className="text-[10px] text-[#4A5D4E] font-semibold">✓ High counter satisfaction</p>
            </div>
            <div className="bg-[#EAF2E3]/50 p-4 rounded-2xl border border-[#D8D5C9] space-y-1">
              <span className="text-[10px] font-bold text-[#667064] uppercase tracking-wider">Order Value Processed</span>
              <p className="font-mono text-xl font-bold text-[#263D2B]">${totalRevenue.toFixed(2)}</p>
              <p className="text-[10px] text-[#667064] font-medium">Across {currentStore.name}</p>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white p-6 rounded-3xl border border-[#D8D5C9] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8D5C9] pb-3">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-[#4A5D4E]" />
                <h3 className="font-serif text-base font-bold text-[#263D2B]">Recent Operational Activity</h3>
              </div>
              <span className="text-[11px] text-[#667064]">Live store log</span>
            </div>

            <div className="divide-y divide-[#D8D5C9]/60">
              {recentOrders.map(ord => (
                <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      ord.orderStatus === 'READY_FOR_PICKUP' ? 'bg-[#DDEAD2] text-[#263D2B]' :
                      ord.orderStatus === 'COMPLETED' ? 'bg-[#EAF2E3] text-[#263D2B]' :
                      'bg-[#E0F2FE] text-[#0369A1]'
                    }`}>
                      {ord.fulfillmentType === 'BOPIS' ? 'BOPIS' : 'DELIV'}
                    </div>
                    <div>
                      <p className="font-bold text-[#263D2B]">
                        {ord.orderNumber} • <span className="font-normal text-[#667064]">{ord.customerName}</span>
                      </p>
                      <p className="text-[10px] text-[#667064]">
                        {ord.items.length} items • Total: ${ord.total.toFixed(2)} • Status: <span className="font-semibold text-[#263D2B]">{ord.orderStatus}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#667064] font-mono">
                      {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Fulfillment Action Queue */}
          <div className="bg-white p-6 rounded-3xl border border-[#D8D5C9] shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#263D2B]">Live Fulfillment Actions</h3>
                <p className="text-xs text-[#667064]">Execute the same OMS workflow directly from Ops Dashboard. Changes are persisted centrally and broadcast to every role.</p>
              </div>
              <Activity size={18} className="text-[#4A5D4E] shrink-0" />
            </div>

            <div className="space-y-3">
              {storeOrders.filter(o => !['COMPLETED','CANCELLED','REFUNDED'].includes(o.orderStatus)).slice(0, 8).map(ord => {
                const action = getNextAction(ord);
                const isSelected = selectedOrderId === ord.id;
                return (
                  <div key={ord.id} className={`rounded-2xl border p-4 ${isSelected ? 'border-[#4A5D4E] bg-[#F7FAF4]' : 'border-[#D8D5C9] bg-white'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <button onClick={() => setSelectedOrderId(isSelected ? null : ord.id)} className="text-left min-w-0">
                        <p className="font-mono font-bold text-sm text-[#263D2B]">{ord.orderNumber}</p>
                        <p className="text-[11px] text-[#667064] truncate">{ord.customerName} • {ord.fulfillmentType}</p>
                      </button>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#D8D5C9] bg-[#F6F1E8] text-[#263D2B] whitespace-nowrap">{ord.orderStatus.replace(/_/g, ' ')}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-[#667064] font-mono">${ord.total.toFixed(2)} • {ord.items.length} item(s)</span>
                      {action && action.status !== 'VERIFY' && (
                        <button
                          onClick={() => handleStatus(ord.id, action.status)}
                          className={`px-3 py-2 rounded-xl text-[10px] font-bold shadow-xs ${actionClass(action.tone)}`}
                        >
                          {action.label}
                        </button>
                      )}
                      {action?.status === 'VERIFY' && (
                        <button
                          onClick={() => setActiveTab('STAFF_BOPIS')}
                          className="px-3 py-2 rounded-xl text-[10px] font-bold shadow-xs bg-[#4A5D4E] hover:bg-[#263D2B] text-white flex items-center gap-1.5"
                        >
                          <QrCode size={13} /> QR Verification
                        </button>
                      )}
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-[#D8D5C9] text-[10px] text-[#667064]">
                        <p><span className="font-bold text-[#263D2B]">Workflow:</span> {ord.fulfillmentType === 'BOPIS' ? 'PROCESSING → PICKING → PACKED → READY_FOR_PICKUP → QR Verification → COMPLETED' : 'PROCESSING/PENDING → PICKING → PACKED → SHIPPED → COMPLETED'}</p>
                        {ord.fulfillmentType === 'BOPIS' && ord.orderStatus === 'READY_FOR_PICKUP' && (
                          <p className="mt-1 font-semibold text-[#4A5D4E]">Customer QR is ready for counter verification.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {storeOrders.filter(o => !['COMPLETED','CANCELLED','REFUNDED'].includes(o.orderStatus)).length === 0 && (
                <div className="p-4 rounded-2xl bg-[#F6F1E8] text-center text-xs text-[#667064]">No active fulfillment actions for this store.</div>
              )}
            </div>
          </div>

        </div>

        {/* Right 1 Col: Low Stock Alerts & Quick Action Navigation */}
        <div className="space-y-6">
          
          {/* Quick Action Station Navigation */}
          <div className="bg-white p-6 rounded-3xl border border-[#D8D5C9] shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#4A5D4E]">Staff Operational Modules</h3>
            <p className="text-xs text-[#667064]">Direct shortcuts to active store terminals and execution workflows.</p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => setActiveTab('STAFF_ORDERS')}
                className="w-full bg-[#DDEAD2] hover:bg-[#C8D8BE] text-[#4A5D4E] p-3 rounded-2xl border border-[#C8D8BE] flex items-center justify-between text-xs font-bold transition-all group shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <PackageCheck size={16} className="text-[#4A5D4E]" />
                  <span>Orders Management (OMS)</span>
                </div>
                <ArrowRight size={14} className="text-[#4A5D4E] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('STAFF_BOPIS')}
                className="w-full bg-[#DDEAD2] hover:bg-[#C8D8BE] text-[#4A5D4E] p-3 rounded-2xl border border-[#C8D8BE] flex items-center justify-between text-xs font-bold transition-all group shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <QrCode size={16} className="text-[#4A5D4E]" />
                  <span>BOPIS Counter Verification</span>
                </div>
                <ArrowRight size={14} className="text-[#4A5D4E] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('STAFF_INVENTORY')}
                className="w-full bg-[#DDEAD2] hover:bg-[#C8D8BE] text-[#4A5D4E] p-3 rounded-2xl border border-[#C8D8BE] flex items-center justify-between text-xs font-bold transition-all group shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <Layers size={16} className="text-[#4A5D4E]" />
                  <span>Inventory Control (WMS)</span>
                </div>
                <ArrowRight size={14} className="text-[#4A5D4E] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Low Stock WMS Alerts */}
          <div className="bg-white p-6 rounded-3xl border border-[#D8D5C9] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8D5C9] pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-[#B45309]" />
                <h3 className="font-serif text-base font-bold text-[#263D2B]">Low Stock WMS Alerts</h3>
              </div>
              <span className="bg-[#FEF3D6] text-[#B45309] text-[10px] font-bold px-2 py-0.5 rounded-full font-mono border border-[#FDE68A]">
                {lowStockProducts.length} Items
              </span>
            </div>

            <div className="space-y-3">
              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-[#667064] py-4 text-center">All product stock levels healthy at {currentStore.name}.</p>
              ) : (
                lowStockProducts.slice(0, 4).map(prod => {
                  const locStock = prod.stockByLocation?.find(l => l.locationId === currentStaffStoreId)?.quantity ?? prod.stockQuantity;

                  return (
                    <div key={prod.id} className="p-3 bg-[#EAF2E3]/50 rounded-2xl border border-[#D8D5C9] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={getAVOLABProductImageFor(prod)} alt={prod.name} className="w-9 h-9 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-[#263D2B] line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-[#667064] font-mono">SKU: {prod.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#B45309] bg-[#FEF3D6] px-2 py-0.5 rounded border border-[#FDE68A] text-[11px]">
                          {locStock} left
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setActiveTab('STAFF_INVENTORY')}
              className="w-full bg-[#4A5D4E] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#263D2B] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              Adjust Stock in Inventory WMS
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

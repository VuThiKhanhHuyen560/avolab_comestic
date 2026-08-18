import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { Order } from '../../types';
import { QRCodeGenerator } from '../common/QRCodeGenerator';

export const StaffQRVerification: React.FC = () => {
  const { orders, verifyQrCode, currentStaffStoreId, stores, showToast } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifiedOrder, setVerifiedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentStore = stores.find(s => s.id === currentStaffStoreId) || stores[0];

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setVerifying(true);
    setErrorMessage(null);
    setVerifiedOrder(null);

    try {
      const res = await verifyQrCode(inputCode.trim());
      if (res.success && res.order) {
        // The backend atomically moved READY_FOR_PICKUP -> COMPLETED.
        setVerifiedOrder(res.order);
        showToast(`BOPIS order ${res.order.orderNumber} verified and completed.`);
      } else {
        setErrorMessage(res.message || "Invalid or unverified QR Code.");
      }
    } catch (err) {
      setErrorMessage("System error verifying QR code.");
    } finally {
      setVerifying(false);
    }
  };

  const handleQuickSelectOrder = (ord: Order) => {
    const qrCodeToUse = ord.qrCodeData || `AVOLAB-BOPIS-${ord.id}-${ord.storeId || 'STORE1'}-VERIFIED`;
    setInputCode(qrCodeToUse);
  };

  const readyOrders = orders.filter(o =>
    o.fulfillmentType === 'BOPIS' &&
    o.storeId === currentStaffStoreId &&
    o.orderStatus === 'READY_FOR_PICKUP'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Banner */}
      <div className="bg-[#4A5D4E] text-white p-6 rounded-3xl shadow-md flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#DDEAD2]" />
            <span className="text-xs font-mono font-bold uppercase bg-[#DDEAD2] text-[#4A5D4E] px-2.5 py-0.5 rounded">COUNTER SCANNER STATION</span>
          </div>
          <h1 className="font-serif text-2xl font-bold mt-2 text-white">BOPIS Customer QR Verification</h1>
          <p className="text-xs text-[#EAF2E3]">Scan or enter customer QR code pass to authorize order handover at {currentStore.name}.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: Quick Pick Queue for Testing */}
        <div className="space-y-3">
          <h3 className="font-bold text-[#263D2B] text-xs uppercase tracking-wider">Ready for Counter Pickup ({readyOrders.length})</h3>
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {readyOrders.length === 0 ? (
              <div className="bg-white p-4 rounded-2xl border border-[#D8D5C9] text-xs text-[#667064] text-center">
                No active orders awaiting pickup.
              </div>
            ) : (
              readyOrders.map(ord => (
                <div
                  key={ord.id}
                  onClick={() => handleQuickSelectOrder(ord)}
                  className="bg-white p-3 rounded-2xl border border-[#D8D5C9] hover:border-[#4A5D4E] cursor-pointer text-xs space-y-1 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <QRCodeGenerator
                      value={ord.qrCodeData || `AVOLAB-BOPIS-${ord.id}-${ord.storeId || 'STORE1'}-VERIFIED`}
                      size={64}
                      showLabel={false}
                      className="shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono font-bold text-[#263D2B] truncate">{ord.orderNumber}</span>
                        <span className="bg-[#DDEAD2] text-[#4A5D4E] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {ord.orderStatus}
                        </span>
                      </div>
                      <p className="text-[#263D2B] font-medium truncate">{ord.customerName}</p>
                      <p className="text-[10px] text-[#667064]">Customer QR ready • click to autofill</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Verification Form & Result */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleVerify} className="bg-white p-6 rounded-3xl border border-[#D8D5C9] shadow-xs space-y-4">
            <h3 className="font-bold text-[#263D2B] text-sm">Enter or Scan QR Code String</h3>
            
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. AVOLAB-BOPIS-ord-101-STORE1-VERIFIED"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full bg-white border border-[#D8D5C9] rounded-2xl pl-10 pr-3 py-3 text-xs font-mono text-[#263D2B] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                />
                <QrCode size={18} className="absolute left-3.5 top-3.5 text-[#667064]" />
              </div>

              <button
                type="submit"
                disabled={verifying || !inputCode.trim()}
                className="bg-[#4A5D4E] text-white px-5 py-3 rounded-2xl text-xs font-bold hover:bg-[#263D2B] transition-colors disabled:opacity-50 shadow-xs"
              >
                {verifying ? 'Verifying...' : 'Verify Pass'}
              </button>
            </div>
          </form>

          {/* Result Card */}
          {errorMessage && (
            <div className="bg-rose-50 text-rose-900 p-4 rounded-2xl border border-rose-200 text-xs flex items-center gap-2">
              <AlertCircle size={18} className="text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {verifiedOrder && (
            <div className="bg-white p-6 rounded-3xl border-2 border-[#4A5D4E] shadow-md space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-[#D8D5C9] pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={24} className="text-[#4A5D4E]" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#263D2B]">QR Code Authenticated!</h3>
                    <p className="text-xs text-[#4A5D4E] font-semibold">Valid pickup pass for {verifiedOrder.customerName}</p>
                  </div>
                </div>
                <span className="bg-[#DDEAD2] text-[#263D2B] text-xs font-bold px-3 py-1 rounded-full">
                  Authorized
                </span>
              </div>

              <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#D8D5C9] flex flex-col items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">Customer Pickup QR</p>
                <QRCodeGenerator
                  value={verifiedOrder.qrCodeData || `AVOLAB-BOPIS-${verifiedOrder.id}-${verifiedOrder.storeId || 'STORE1'}-VERIFIED`}
                  size={150}
                  showLabel={false}
                />
                <p className="text-[9px] text-[#667064] font-mono text-center break-all">{verifiedOrder.qrCodeData}</p>
              </div>

              <div className="bg-[#EAF2E3]/50 p-4 rounded-2xl border border-[#D8D5C9] text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#667064]">Order Number</span>
                  <span className="font-mono font-bold text-[#263D2B]">{verifiedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667064]">Customer Name</span>
                  <span className="font-semibold text-[#263D2B]">{verifiedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#667064]">Items Count</span>
                  <span className="font-bold text-[#263D2B]">{verifiedOrder.items.length} items</span>
                </div>
                <div className="flex justify-between font-bold text-[#263D2B] pt-1 border-t border-[#D8D5C9]">
                  <span>Order Total</span>
                  <span>${verifiedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-4 bg-[#DDEAD2] text-[#263D2B] rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                <span>Order Handover Completed & Audit Logged — Order is now COMPLETED.</span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

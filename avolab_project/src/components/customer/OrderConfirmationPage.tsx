import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { QRCodeGenerator } from '../common/QRCodeGenerator';
import { InvoiceModal } from '../common/InvoiceModal';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  Store, 
  QrCode, 
  FileText, 
  ArrowRight, 
  Truck, 
  Calendar, 
  Clock, 
  ShoppingBag 
} from 'lucide-react';
import { getAVOLABProductImageFor, normalizeAVOLABImage } from '../../utils/productImages';

interface OrderConfirmationPageProps {
  order?: Order | null;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ order: propOrder }) => {
  const { orders, setActiveTab, setQrModalOrder, setIsQrModalOpen, customer } = useApp();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  // Pick the most recent order or prop order
  const latestOrder = propOrder || orders[0];

  if (!latestOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#1C2E20]">No recent order found</h2>
        <p className="text-xs text-[#5A5A5A]">You haven't placed an order in this session yet.</p>
        <button
          onClick={() => setActiveTab('SHOP')}
          className="bg-[#4A5D4E] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#3A493D]"
        >
          Explore Skincare
        </button>
      </div>
    );
  }

  const isBopis = latestOrder.fulfillmentType === 'BOPIS';
  const qrString = latestOrder.qrCodeData || `AVOLAB-BOPIS-${latestOrder.orderNumber}-${latestOrder.storeId || 'STORE1'}-VERIFIED`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 selection:bg-[#D9E3D0] selection:text-[#4A5D4E]">
      
      {/* Success Hero Header */}
      <div className="bg-white border border-[#E6E1D6] rounded-3xl p-8 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#D9E3D0] text-[#4A5D4E] flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 size={36} />
        </div>

        <div>
          <span className="bg-[#D9E3D0] text-[#4A5D4E] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Payment Confirmed & Order Created
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1C2E20] mt-2">Thank you for your order!</h1>
          <p className="text-xs text-[#5A5A5A] mt-1">
            Order Reference: <span className="font-mono font-bold text-[#1A1A1A]">{latestOrder.orderNumber}</span> • Placed on {new Date(latestOrder.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Status Badge Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs max-w-xl mx-auto">
          <div className="bg-[#F9F7F2] p-3 rounded-2xl border border-[#E6E1D6] text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#888] font-bold block">Payment Status</span>
            <span className="font-bold text-emerald-800 uppercase">{latestOrder.paymentStatus}</span>
          </div>

          <div className="bg-[#F9F7F2] p-3 rounded-2xl border border-[#E6E1D6] text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#888] font-bold block">Fulfillment Method</span>
            <span className="font-bold text-[#4A5D4E] uppercase">{latestOrder.fulfillmentType}</span>
          </div>

          <div className="bg-[#F9F7F2] p-3 rounded-2xl border border-[#E6E1D6] text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#888] font-bold block">Total Paid</span>
            <span className="font-extrabold text-[#1C2E20]">${latestOrder.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Items */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Items Summary */}
          <div className="bg-white border border-[#E6E1D6] rounded-3xl p-6 space-y-4 shadow-2xs">
            <h2 className="font-serif text-lg font-bold text-[#1C2E20] border-b border-[#E6E1D6] pb-3">
              Order Items Breakdown
            </h2>

            <div className="divide-y divide-[#E6E1D6] text-xs">
              {latestOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={normalizeAVOLABImage(item.productImage)}
                      alt={item.productName}
                      className="w-12 h-12 rounded-xl object-cover bg-[#F9F7F2] border border-[#E6E1D6]"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#1A1A1A] truncate">{item.productName}</p>
                      <p className="text-[10px] text-[#888]">SKU: {item.sku} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-[#1C2E20]">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E6E1D6] pt-3 space-y-1.5 text-xs text-[#5A5A5A]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2D2D2D]">${latestOrder.subtotal.toFixed(2)}</span>
              </div>
              {latestOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Coupon Discount</span>
                  <span>-${latestOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-[#2D2D2D]">{latestOrder.shippingFee === 0 ? 'FREE' : `$${latestOrder.shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between border-t border-[#E6E1D6] pt-2 text-base font-extrabold text-[#1C2E20]">
                <span>Total Amount</span>
                <span>${latestOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Fulfillment Info */}
          <div className="bg-white border border-[#E6E1D6] rounded-3xl p-6 space-y-3 shadow-2xs text-xs">
            <h3 className="font-bold text-sm text-[#1C2E20] flex items-center gap-2">
              {isBopis ? <Store size={18} className="text-[#4A5D4E]" /> : <Truck size={18} className="text-[#4A5D4E]" />}
              <span>{isBopis ? 'Pickup Store Location' : 'Delivery Address'}</span>
            </h3>

            {isBopis ? (
              <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E6E1D6] space-y-1">
                <p className="font-bold text-[#1A1A1A] text-sm">{latestOrder.storeName || 'Avolab Flagship Store'}</p>
                <p className="text-[#5A5A5A]">Hours: Mon - Sun (10:00 AM - 9:00 PM)</p>
                <p className="text-emerald-800 font-bold text-[11px] pt-1 flex items-center gap-1">
                  <Clock size={13} /> Estimated ready for pickup within 2 hours
                </p>
              </div>
            ) : (
              <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E6E1D6] space-y-1">
                <p className="font-bold text-[#1A1A1A]">{latestOrder.customerName}</p>
                <p className="text-[#5A5A5A]">{latestOrder.shippingAddress?.street}</p>
                <p className="text-[#5A5A5A]">
                  {latestOrder.shippingAddress?.city}, {latestOrder.shippingAddress?.state} {latestOrder.shippingAddress?.zipCode}
                </p>
                <p className="text-emerald-800 font-bold text-[11px] pt-1 flex items-center gap-1">
                  <Truck size={13} /> Estimated delivery: 2-3 business days
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: QR Pass & Actions */}
        <div className="space-y-6">
          
          {/* BOPIS QR Pass Preview */}
          {isBopis && (
            <div className="bg-white border border-[#E6E1D6] rounded-3xl p-6 text-center space-y-3 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">Store Pickup Verification</span>
              <QRCodeGenerator value={qrString} size={150} showLabel={false} />
              <button
                type="button"
                onClick={() => {
                  setQrModalOrder(latestOrder);
                  setIsQrModalOpen(true);
                }}
                className="w-full bg-[#D9E3D0] text-[#4A5D4E] py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#4A5D4E] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <QrCode size={16} /> Open Full QR Pass
              </button>
            </div>
          )}

          {/* Quick Action Navigation */}
          <div className="bg-white border border-[#E6E1D6] rounded-3xl p-6 space-y-3 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A5D4E] border-b border-[#E6E1D6] pb-2">
              Next Steps
            </h3>

            <button
              onClick={() => setActiveTab('ORDERS')}
              className="w-full bg-[#4A5D4E] text-white py-3 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#3A493D] transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Package size={16} /> Track Order Progress
            </button>

            <button
              onClick={() => setIsInvoiceOpen(true)}
              className="w-full bg-white border border-[#E6E1D6] text-[#2D2D2D] py-3 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#F9F7F2] transition-colors flex items-center justify-center gap-2"
            >
              <FileText size={16} /> View & Print Invoice
            </button>

            <button
              onClick={() => setActiveTab('SHOP')}
              className="w-full bg-[#F0EBE1] text-[#4A5D4E] py-3 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#E6E1D6] transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> Continue Shopping
            </button>
          </div>

        </div>

      </div>

      {/* Invoice Modal Overlay */}
      <InvoiceModal
        order={latestOrder}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />

    </div>
  );
};

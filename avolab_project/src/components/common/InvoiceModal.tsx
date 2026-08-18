import React from 'react';
import { Order } from '../../types';
import { AvolabLogo } from './AvolabLogo';
import { X, Printer, CheckCircle, Download, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 text-stone-800 relative my-8 print:shadow-none print:border-none print:m-0 print:p-0">
        
        {/* Screen Action Bar (Hidden when printing) */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-200 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#4A5D4E]" />
            <h3 className="font-serif text-lg font-bold text-[#1C2E20]">Tax Invoice & Receipt</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#4A5D4E] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#3A493D] transition-colors shadow-sm"
            >
              <Printer size={15} /> Print Invoice
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Content Body */}
        <div className="space-y-6 pt-4 print:pt-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-stone-200 pb-6">
            <div>
              <AvolabLogo variant="primary" />
              <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                AVOLAB COSMETICS INC.<br />
                120 Botanical Way, Suite 400<br />
                San Francisco, CA 94107 • USA<br />
                support@avolab.cosmetics
              </p>
            </div>

            <div className="text-right sm:text-right space-y-1">
              <span className="inline-block bg-[#D9E3D0] text-[#4A5D4E] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                {order.paymentStatus === 'PAID' ? 'PAID RECEIPT' : order.paymentStatus}
              </span>
              <h2 className="font-mono text-xl font-extrabold text-[#1C2E20]">{order.orderNumber}</h2>
              <p className="text-xs text-stone-500">
                Date: <span className="font-semibold text-stone-800">{new Date(order.createdAt).toLocaleDateString()}</span>
              </p>
              <p className="text-xs text-stone-500">
                Payment: <span className="font-semibold text-stone-800 uppercase">{order.paymentMethod}</span>
              </p>
            </div>
          </div>

          {/* Customer & Fulfillment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#F9F7F2] p-4 rounded-2xl border border-stone-200 text-xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A5D4E] mb-1">Customer Details</p>
              <p className="font-bold text-stone-900">{order.customerName}</p>
              <p className="text-stone-600">{order.customerEmail}</p>
              <p className="text-stone-600">{order.customerPhone}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#4A5D4E] mb-1">
                Fulfillment Method ({order.fulfillmentType})
              </p>
              {order.fulfillmentType === 'BOPIS' ? (
                <div>
                  <p className="font-bold text-stone-900">{order.storeName || 'Store Pickup Counter'}</p>
                  <p className="text-stone-600 text-[11px]">In-store collection & QR pass verification</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-stone-900">{order.shippingAddress?.street}</p>
                  <p className="text-stone-600">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-stone-200 text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">SKU</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50/50">
                    <td className="py-3 font-semibold text-stone-900 pr-2">
                      {item.productName}
                    </td>
                    <td className="py-3 font-mono text-stone-500 text-[11px]">
                      {item.sku}
                    </td>
                    <td className="py-3 text-right font-medium text-stone-800">
                      ${item.price.toFixed(2)}
                    </td>
                    <td className="py-3 text-center font-bold text-stone-800">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right font-bold text-stone-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="border-t-2 border-stone-200 pt-4 flex justify-end">
            <div className="w-full sm:w-64 space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Promo Discount</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="font-semibold text-stone-900">
                  {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 text-sm font-extrabold text-[#1C2E20]">
                <span>Total Amount</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="border-t border-stone-200 pt-4 text-center text-[10px] text-stone-400 space-y-1">
            <p>Thank you for choosing AVOLAB COSMETICS. All ingredients are 100% vegan, cruelty-free, and dermatologically approved.</p>
            <p className="font-mono">AVOLAB Digital Platform • Document Generated {new Date().toLocaleTimeString()}</p>
          </div>

        </div>

      </div>
    </div>
  );
};

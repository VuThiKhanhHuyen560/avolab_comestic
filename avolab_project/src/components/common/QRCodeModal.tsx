import React from 'react';
import { useApp } from '../../context/AppContext';
import { QRCodeGenerator } from './QRCodeGenerator';
import { X, CheckCircle2, Store, Printer, Download } from 'lucide-react';

export const QRCodeModal: React.FC = () => {
  const { isQrModalOpen, setIsQrModalOpen, qrModalOrder } = useApp();

  if (!isQrModalOpen || !qrModalOrder) return null;

  const qrString = qrModalOrder.qrCodeData || `AVOLAB-BOPIS-${qrModalOrder.orderNumber}-${qrModalOrder.storeId || 'STORE1'}-VERIFIED`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-stone-800 relative">
        <button
          onClick={() => setIsQrModalOpen(false)}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-200/60 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-[#D9E3D0] text-[#4A5D4E] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Store size={24} />
          </div>

          <div>
            <h3 className="font-serif text-lg font-bold text-[#1C2E20]">BOPIS Store Pickup Pass</h3>
            <p className="text-xs text-[#849673] font-mono font-bold mt-0.5">
              Order #{qrModalOrder.orderNumber}
            </p>
          </div>

          <div className="my-4 py-2 flex flex-col items-center justify-center">
            <QRCodeGenerator value={qrString} size={180} showLabel={false} />
            <p className="text-[10px] text-stone-500 font-mono mt-3">
              Present this scannable QR pass to store staff at counter
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-left text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
              <span className="text-stone-500 text-[10px] uppercase tracking-wider font-bold">Pickup Store</span>
              <span className="font-bold text-[#1C2E20] truncate max-w-[180px]">{qrModalOrder.storeName || 'Avolab Flagship Store'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
              <span className="text-stone-500 text-[10px] uppercase tracking-wider font-bold">Customer</span>
              <span className="font-bold text-stone-900">{qrModalOrder.customerName}</span>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-stone-500 text-[10px] uppercase tracking-wider font-bold">Status</span>
              <span className="bg-[#D9E3D0] text-[#4A5D4E] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={11} /> {qrModalOrder.orderStatus}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 bg-white border border-[#E6E1D6] hover:bg-[#F0EBE1] text-[#2D2D2D] py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer size={15} /> Print Pass
            </button>
            <button
              onClick={() => setIsQrModalOpen(false)}
              className="flex-1 bg-[#4A5D4E] text-white py-2.5 rounded-xl font-bold text-xs hover:bg-[#3A493D] transition-colors shadow-sm"
            >
              Close Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

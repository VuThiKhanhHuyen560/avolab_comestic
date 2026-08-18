import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InvoiceModal } from '../common/InvoiceModal';
import { Order } from '../../types';
import { 
  QrCode, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Store, 
  MapPin, 
  FileText, 
  RotateCcw,
  ShoppingBag,
  ExternalLink,
  Star,
  Send
} from 'lucide-react';
import { getAVOLABProductImageFor, normalizeAVOLABImage } from '../../utils/productImages';

export const OrderTrackingView: React.FC = () => {
  const { 
    orders, 
    setQrModalOrder, 
    setIsQrModalOpen, 
    customer, 
    currentUser, 
    products, 
    addToCart, 
    setActiveTab, 
    showToast,
    orderReviews,
    createOrderReview,
    getOrderReview
  } = useApp();

  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [reviewRatings, setReviewRatings] = useState<Record<string, number>>({});
  const [reviewComments, setReviewComments] = useState<Record<string, string>>({});
  const [submittingReview, setSubmittingReview] = useState<string | null>(null);

  // Match customer orders
  const customerOrders = orders.filter(o => 
    o.customerId === customer.id || 
    o.customerEmail === customer.email || 
    (currentUser && o.customerEmail === currentUser.email)
  );

  const getDeliveryStep = (status: string) => {
    switch (status) {
      case 'PENDING': return 1;
      case 'PICKING': return 2;
      case 'PACKED': return 3;
      case 'SHIPPED': return 4;
      case 'COMPLETED': return 5;
      default: return 1;
    }
  };

  const getBopisStep = (status: string) => {
    switch (status) {
      case 'PROCESSING': return 1;
      case 'PICKING': return 2;
      case 'PACKED': return 3;
      case 'READY_FOR_PICKUP': return 4;
      case 'COMPLETED': return 6;
      default: return 1;
    }
  };

  const handleReorder = (ord: Order) => {
    let reorderedCount = 0;
    let outOfStockCount = 0;

    ord.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId || p.sku === item.sku);
      if (prod && prod.stockQuantity > 0) {
        addToCart(prod, Math.min(item.quantity, prod.stockQuantity));
        reorderedCount++;
      } else {
        outOfStockCount++;
      }
    });

    if (reorderedCount > 0) {
      showToast(`Added ${reorderedCount} item(s) back to cart!`);
      if (outOfStockCount > 0) {
        showToast(`${outOfStockCount} item(s) were unavailable due to stock limits.`);
      }
      setActiveTab('CART');
    } else {
      showToast('Items in this order are currently out of stock.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 selection:bg-[#D9E3D0] selection:text-[#4A5D4E]">
      
      {/* Page Header */}
      <div className="border-b border-[#E6E1D6] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2E20]">Order History & Track QR Pass</h1>
          <p className="text-xs text-[#5A5A5A] mt-1">
            Real-time status updates, delivery tracking timeline, and BOPIS store pickup verification QR passes
          </p>
        </div>

        <button
          onClick={() => setActiveTab('SHOP')}
          className="bg-[#4A5D4E] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#3A493D] transition-colors shadow-2xs self-start sm:self-auto"
        >
          Explore Skincare
        </button>
      </div>

      {customerOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E6E1D6] space-y-4 shadow-2xs">
          <div className="w-16 h-16 bg-[#D9E3D0] text-[#4A5D4E] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Package size={32} />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#1C2E20]">No active or historic orders found</h3>
          <p className="text-xs text-[#5A5A5A]">You haven't placed any skincare orders yet.</p>
          <button
            onClick={() => setActiveTab('SHOP')}
            className="bg-[#4A5D4E] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#3A493D]"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {customerOrders.map(ord => {
            const isBopis = ord.fulfillmentType === 'BOPIS';
            const currentStep = isBopis ? getBopisStep(ord.orderStatus) : getDeliveryStep(ord.orderStatus);

            return (
              <div key={ord.id} className="bg-white rounded-3xl border border-[#E6E1D6] p-6 shadow-2xs space-y-6">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E1D6] pb-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-base text-[#1C2E20]">{ord.orderNumber}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.orderStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                        ord.orderStatus === 'READY_FOR_PICKUP' || ord.orderStatus === 'SHIPPED' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                        'bg-sky-100 text-sky-800'
                      }`}>
                        {ord.orderStatus}
                      </span>
                      <span className="bg-[#D9E3D0]/60 text-[#4A5D4E] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {ord.fulfillmentType}
                      </span>
                    </div>
                    <p className="text-[#888] text-[11px] mt-0.5">
                      Placed on {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} item(s) • Total: ${ord.total.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {isBopis && (
                      <button
                        type="button"
                        onClick={() => {
                          setQrModalOrder(ord);
                          setIsQrModalOpen(true);
                        }}
                        className="bg-[#4A5D4E] text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#3A493D] transition-colors flex items-center gap-1.5 shadow-2xs"
                      >
                        <QrCode size={15} /> Show Pickup QR Pass
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceOrder(ord)}
                      className="bg-[#F9F7F2] border border-[#E6E1D6] text-[#2D2D2D] hover:bg-[#F0EBE1] px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                    >
                      <FileText size={15} /> Tax Invoice
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReorder(ord)}
                      className="bg-[#D9E3D0] text-[#4A5D4E] hover:bg-[#4A5D4E] hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-2xs"
                    >
                      <RotateCcw size={15} /> Buy Again
                    </button>
                  </div>
                </div>

                {/* Real-time Order Visual Timeline */}
                <div className="space-y-2 bg-[#F9F7F2] p-4 rounded-2xl border border-[#E6E1D6]">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1C2E20]">
                    <span className="flex items-center gap-1.5">
                      {isBopis ? <Store size={15} className="text-[#4A5D4E]" /> : <Truck size={15} className="text-[#4A5D4E]" />}
                      <span>Fulfillment Status Progress ({isBopis ? 'In-Store BOPIS' : 'Home Delivery'})</span>
                    </span>
                    <span className="text-[10px] text-[#849673] font-mono">
                      Ref: {ord.id}
                    </span>
                  </div>

                  {isBopis ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 text-[10px] text-center font-bold gap-1.5 pt-1">
                      <div className={`p-2 rounded-xl border ${currentStep >= 1 ? 'bg-[#D9E3D0] text-[#4A5D4E] border-[#849673]' : 'bg-white text-stone-400 border-stone-200'}`}>1. Processing</div>
                      <div className={`p-2 rounded-xl border ${currentStep >= 2 ? 'bg-[#D9E3D0] text-[#4A5D4E] border-[#849673]' : 'bg-white text-stone-400 border-stone-200'}`}>2. Picking</div>
                      <div className={`p-2 rounded-xl border ${currentStep >= 3 ? 'bg-[#D9E3D0] text-[#4A5D4E] border-[#849673]' : 'bg-white text-stone-400 border-stone-200'}`}>3. Packed</div>
                      <div className={`p-2 rounded-xl border ${currentStep >= 4 ? 'bg-[#D9E3D0] text-[#4A5D4E] border-[#849673]' : 'bg-white text-stone-400 border-stone-200'}`}>4. Ready for Pickup</div>
                      <div className={`p-2 rounded-xl border ${currentStep >= 5 ? 'bg-[#D9E3D0] text-[#4A5D4E] border-[#849673]' : 'bg-white text-stone-400 border-stone-200'}`}>5. QR Verification</div>
                      <div className={`p-2 rounded-xl border ${currentStep >= 6 ? 'bg-[#D9E3D0] text-[#4A5D4E] border-[#849673]' : 'bg-white text-stone-400 border-stone-200'}`}>6. Completed</div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-5 text-[10px] text-center font-bold gap-1.5 pt-1">
                      <div className={`p-2 rounded-xl border ${currentStep >= 1 ? 'bg-[#D9E3D0] text-[#4A5D4E] border-[#849673]' : 'bg-white text-stone-400 border-stone-200'}`}>1. Order Received</div>
                      <div className={`p-2 rounded-xl border ${currentStep >= 2 ? 'bg-[#D9E3D0] text-[#4A5D4E] border-[#849673]' : 'bg-white text-stone-400 border-stone-200'}`}>2. Picking</div>
                      <div className={`p-2 rounded-xl border ${currentStep >= 3 ? 'bg-[#D9E3D0] text-[#4A5D4E] border-[#849673]' : 'bg-white text-stone-400 border-stone-200'}`}>3. Packed</div>
                      <div className={`p-2 rounded-xl border ${currentStep >= 4 ? 'bg-[#D9E3D0] text-[#4A5D4E] border-[#849673]' : 'bg-white text-stone-400 border-stone-200'}`}>4. Out for Shipping</div>
                      <div className={`p-2 rounded-xl border ${currentStep >= 5 ? 'bg-[#D9E3D0] text-[#4A5D4E] border-[#849673]' : 'bg-white text-stone-400 border-stone-200'}`}>5. Completed</div>
                    </div>
                  )}
                </div>

                {/* Order Review — available only after successful completion */}
                {ord.orderStatus === 'COMPLETED' && (() => {
                  const savedReview = getOrderReview(ord.id);
                  const selectedRating = reviewRatings[ord.id] || 5;
                  return <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F3F7EF] rounded-2xl border border-[#DDE4D5] p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-600"/>
                          <h3 className="font-bold text-sm text-[#1C2E20]">How was your order?</h3>
                        </div>
                        <p className="text-[10px] text-stone-500 mt-1">Your feedback helps AVOLAB improve every fulfillment experience.</p>
                      </div>
                      {savedReview && <span className="text-[9px] font-bold uppercase tracking-wider bg-[#D9E3D0] text-[#2E4A32] px-2.5 py-1.5 rounded-full">Reviewed</span>}
                    </div>

                    {savedReview ? (
                      <div className="bg-white rounded-xl border border-stone-200 p-4">
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map(star => <Star key={star} size={16} className={star <= savedReview.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'} />)}
                          <span className="ml-1 text-xs font-bold text-stone-700">{savedReview.rating}/5</span>
                        </div>
                        <p className="text-xs text-stone-600 mt-2">“{savedReview.comment}”</p>
                        <div className="mt-3 pt-3 border-t border-stone-100">
                          <span className="text-[10px] text-stone-400">Your review has been saved. You can review this order only once.</span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={async e => {
                        e.preventDefault();
                        if (submittingReview) return;
                        setSubmittingReview(ord.id);
                        const saved = await createOrderReview(
                          ord.id,
                          selectedRating,
                          reviewComments[ord.id] || 'Great AVOLAB order experience.'
                        );
                        setSubmittingReview(null);
                        if (saved) {
                          setReviewRatings(prev => ({ ...prev, [ord.id]: saved.rating }));
                          setReviewComments(prev => ({ ...prev, [ord.id]: saved.comment }));
                        }
                      }} className="space-y-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">Your rating</p>
                          <div className="flex items-center gap-1">
                            {[1,2,3,4,5].map(star => <button type="button" key={star} onClick={()=>setReviewRatings(prev=>({...prev,[ord.id]:star}))} className="p-1 rounded-lg hover:bg-white transition-colors"><Star size={22} className={star <= selectedRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'} /></button>)}
                            <span className="ml-2 text-xs font-bold text-[#2E4A32]">{selectedRating}/5</span>
                          </div>
                        </div>
                        <textarea value={reviewComments[ord.id] || ''} onChange={e=>setReviewComments(prev=>({...prev,[ord.id]:e.target.value}))} rows={2} placeholder="Tell us about your order…" className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-xs outline-none resize-none focus:ring-1 focus:ring-[#2E4A32]"/>
                        <button disabled={submittingReview===ord.id} className="bg-[#4A5D4E] text-white rounded-xl px-4 py-2.5 text-xs font-bold flex items-center gap-2 disabled:opacity-50"><Send size={13}/>{submittingReview===ord.id?'Saving…':'Submit Review'}</button>
                      </form>
                    )}
                  </div>;
                })()}

                {/* Items Breakdown */}
                <div className="divide-y divide-[#E6E1D6] text-xs">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={normalizeAVOLABImage(item.productImage)} alt={item.productName} className="w-10 h-10 rounded-xl object-cover bg-[#F9F7F2]" />
                        <div>
                          <p className="font-bold text-[#1A1A1A]">{item.productName}</p>
                          <p className="text-[10px] text-[#888]">SKU: {item.sku} • Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-extrabold text-[#1C2E20]">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal Overlay */}
      <InvoiceModal
        order={selectedInvoiceOrder}
        isOpen={!!selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />

    </div>
  );
};

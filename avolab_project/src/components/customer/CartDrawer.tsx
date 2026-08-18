import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Trash2, ShoppingBag, ArrowRight, Store, Truck, Tag, ShieldCheck } from 'lucide-react';
import { getAVOLABProductImage, getAVOLABProductImageFor } from '../../utils/productImages';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, updateCartQty, removeFromCart, stores, setActiveTab, campaigns } = useApp();
  const [fulfillment, setFulfillment] = useState<'DELIVERY' | 'BOPIS'>('DELIVERY');
  const [selectedStoreId, setSelectedStoreId] = useState<string>(stores[0]?.id || 'store-1');
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = fulfillment === 'BOPIS' ? 0 : subtotal > 50 ? 0 : 5;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const found = campaigns.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.status === 'ACTIVE');
    if (found) {
      setDiscountPercent(found.discountPercentage);
      alert(`Applied campaign coupon "${found.title}" for ${found.discountPercentage}% OFF!`);
    } else {
      alert("Invalid or expired coupon code. Try 'SUMMERGLOW20'");
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setActiveTab('CHECKOUT');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsCartOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl border-l border-stone-200 flex flex-col justify-between text-stone-800">
          
          {/* Cart Header */}
          <div className="p-5 bg-white border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#2E4A32]" />
              <h2 className="font-serif text-lg font-bold text-[#1C2E20]">Your Botanical Cart</h2>
              <span className="bg-emerald-100 text-[#2E4A32] text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Fulfillment Selector */}
            <div className="bg-white p-3 rounded-2xl border border-stone-200 space-y-3">
              <span className="text-xs font-semibold text-stone-800 block">Fulfillment Method:</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setFulfillment('DELIVERY')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    fulfillment === 'DELIVERY'
                      ? 'bg-[#2E4A32] text-amber-100 border-[#2E4A32] shadow-sm font-bold'
                      : 'bg-[#FAF8F5] text-stone-700 border-stone-200'
                  }`}
                >
                  <Truck size={15} /> Standard Delivery
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillment('BOPIS')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    fulfillment === 'BOPIS'
                      ? 'bg-[#2E4A32] text-amber-100 border-[#2E4A32] shadow-sm font-bold'
                      : 'bg-[#FAF8F5] text-stone-700 border-stone-200'
                  }`}
                >
                  <Store size={15} /> BOPIS Pickup
                </button>
              </div>

              {fulfillment === 'BOPIS' && (
                <div className="pt-2">
                  <label className="text-[11px] font-medium text-stone-500 block mb-1">Select Pickup Store Counter:</label>
                  <select
                    value={selectedStoreId}
                    onChange={(e) => setSelectedStoreId(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl p-2 text-xs text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#2E4A32]"
                  >
                    {stores.map(st => (
                      <option key={st.id} value={st.id}>{st.name} — {st.city}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="py-12 text-center text-stone-500 space-y-3">
                <p className="text-sm">Your cart is empty right now.</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveTab('SHOP');
                  }}
                  className="bg-[#2E4A32] text-amber-100 px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#1C2E20]"
                >
                  Browse Vegan Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div
                    key={item.product.id}
                    className="bg-white p-3 rounded-2xl border border-stone-200/80 flex gap-3 items-center shadow-xs"
                  >
                    <div className="w-16 h-16 rounded-xl bg-[#F3EEE6] p-1 flex items-center justify-center border border-[#E2DAD0] overflow-hidden flex-shrink-0">
                      <img
                        src={getAVOLABProductImageFor(item.product)}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLImageElement).src = getAVOLABProductImage(item.product.id, item.product.category, item.product.name); }}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs text-stone-900 truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">${item.product.discountPrice || item.product.price} each</p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-stone-100 border border-stone-200 rounded-lg px-2 py-0.5 text-xs font-medium">
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                            className="text-stone-500 hover:text-stone-900 px-1 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 font-bold text-stone-800">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                            className="text-stone-500 hover:text-stone-900 px-1 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-bold text-xs text-[#1C2E20]">
                          ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-300 hover:text-rose-600 p-1 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Coupon Code Input */}
            {cart.length > 0 && (
              <form onSubmit={handleApplyCoupon} className="bg-white p-3 rounded-2xl border border-stone-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. SUMMERGLOW20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#2E4A32]"
                />
                <button
                  type="submit"
                  className="bg-[#2E4A32] text-amber-100 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#1C2E20]"
                >
                  Apply
                </button>
              </form>
            )}

          </div>

          {/* Cart Footer Summary */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-stone-200 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-semibold">
                    <span>Campaign Discount ({discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Fulfillment ({fulfillment === 'BOPIS' ? 'Store Pickup' : 'Shipping'})</span>
                  <span className="font-semibold text-stone-900">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-stone-200 text-sm font-bold text-[#1C2E20]">
                  <span>Total Due</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedCheckout}
                className="w-full bg-[#2E4A32] text-amber-100 py-3 rounded-2xl font-bold text-xs sm:text-sm hover:bg-[#1C2E20] transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

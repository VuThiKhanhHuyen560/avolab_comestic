import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getAVOLABProductImage, getAVOLABProductImageFor } from '../../utils/productImages';
import { 
  ShoppingBag, 
  Trash2, 
  Heart, 
  ArrowRight, 
  ArrowLeft, 
  Tag, 
  Check, 
  AlertCircle, 
  Truck, 
  Store, 
  ShieldCheck, 
  X,
  Sparkles,
  Plus
} from 'lucide-react';
import { calculateAIMatchScore, getPersonalizedRecommendations } from '../../utils/aiRecommendationEngine';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    updateCartQty, 
    removeFromCart, 
    toggleWishlist, 
    wishlist, 
    campaigns, 
    setActiveTab, 
    currentUser, 
    setRedirectAfterLogin,
    showToast,
    products,
    customer,
    systemSettings,
    addToCart
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    title: string;
  } | null>({
    code: 'WELCOME10',
    type: 'PERCENTAGE',
    value: 10,
    title: 'Welcome 10% Off'
  });

  const [stockWarnings, setStockWarnings] = useState<Record<string, string>>({});

  // AI Recommended Add-ons that aren't already in the cart
  const cartProductIds = new Set(cart.map(i => i.product.id));
  const availableProducts = products.filter(p => !cartProductIds.has(p.id));
  const recommendedAddons = getPersonalizedRecommendations(
    availableProducts,
    { skinType: customer?.skinType, skinConcerns: customer?.skinConcerns },
    systemSettings,
    3
  );

  // Calculations
  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.discountPrice || item.product.price;
    return sum + price * item.quantity;
  }, 0);

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'PERCENTAGE') {
      couponDiscount = (subtotal * appliedCoupon.value) / 100;
    } else {
      couponDiscount = Math.min(subtotal, appliedCoupon.value);
    }
  }

  const shippingFee = subtotal > 50 || subtotal === 0 ? 0 : 5.95;
  const total = Math.max(0, subtotal - couponDiscount + shippingFee);

  // Validate stock on quantity change
  const handleQtyChange = (productId: string, newQty: number, maxAvailable: number) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      setStockWarnings(prev => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
      return;
    }

    if (newQty > maxAvailable) {
      setStockWarnings(prev => ({
        ...prev,
        [productId]: `Only ${maxAvailable} items are currently available.`
      }));
      updateCartQty(productId, maxAvailable);
      showToast(`Quantity limited to maximum stock (${maxAvailable} available)`);
    } else {
      setStockWarnings(prev => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
      updateCartQty(productId, newQty);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponInput.trim().toUpperCase();

    if (!cleanCode) return;

    if (cleanCode === 'WELCOME10') {
      setAppliedCoupon({ code: 'WELCOME10', type: 'PERCENTAGE', value: 10, title: 'Welcome 10% Off' });
      showToast('Applied coupon WELCOME10 (10% discount)');
      setCouponInput('');
      return;
    }
    if (cleanCode === 'AVOLAB20') {
      setAppliedCoupon({ code: 'AVOLAB20', type: 'PERCENTAGE', value: 20, title: 'AVOLAB 20% Off' });
      showToast('Applied coupon AVOLAB20 (20% discount)');
      setCouponInput('');
      return;
    }
    if (cleanCode === 'GLOW15') {
      setAppliedCoupon({ code: 'GLOW15', type: 'FIXED', value: 15, title: 'Glow $15 Off' });
      showToast('Applied coupon GLOW15 ($15 discount)');
      setCouponInput('');
      return;
    }

    // Check campaigns from state
    const found = campaigns.find(c => c.code.toUpperCase() === cleanCode && c.status === 'ACTIVE');
    if (found) {
      setAppliedCoupon({
        code: found.code,
        type: 'PERCENTAGE',
        value: found.discountPercentage,
        title: found.title
      });
      showToast(`Applied promo code ${found.code}`);
      setCouponInput('');
    } else {
      showToast('Invalid or expired coupon code. Try WELCOME10 or AVOLAB20');
    }
  };

  const handleProceedToCheckout = () => {
    // Check if any stock issues remain
    const invalidItem = cart.find(i => i.quantity > i.product.stockQuantity);
    if (invalidItem) {
      showToast(`Please adjust quantity for ${invalidItem.product.name} (${invalidItem.product.stockQuantity} in stock)`);
      return;
    }

    if (!currentUser) {
      showToast('Please sign in to complete secure checkout.');
      setRedirectAfterLogin('CHECKOUT');
      setActiveTab('CUSTOMER_LOGIN');
    } else {
      setActiveTab('CHECKOUT');
    }
  };

  const handleMoveToWishlist = (productId: string) => {
    toggleWishlist(productId);
    removeFromCart(productId);
    showToast('Moved product to wishlist!');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-[#D9E3D0] text-[#4A5D4E] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag size={36} />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#1C2E20]">Your cart is waiting for something beautiful</h1>
          <p className="text-xs text-[#5A5A5A] max-w-md mx-auto">
            Explore our clinically backed, 100% vegan skincare formulations tailored for your skin profile.
          </p>
        </div>
        <div>
          <button
            onClick={() => setActiveTab('SHOP')}
            className="bg-[#4A5D4E] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#3A493D] transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 selection:bg-[#D9E3D0] selection:text-[#4A5D4E]">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E1D6] pb-5">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('SHOP')}
              className="p-2 text-[#5A5A5A] hover:text-[#2D2D2D] rounded-full bg-[#F0EBE1] hover:bg-[#E6E1D6] transition-colors"
              title="Return to Catalog"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2E20]">Shopping Cart</h1>
          </div>
          <p className="text-xs text-[#5A5A5A] mt-1 ml-11">
            {cart.reduce((s, i) => s + i.quantity, 0)} botanical skincare formulation(s) in your bag
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#849673] font-bold flex items-center gap-1.5 bg-[#D9E3D0]/60 px-3 py-1.5 rounded-full">
            <ShieldCheck size={16} /> Free Shipping over $50
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-[#E6E1D6] rounded-3xl p-6 space-y-6 shadow-2xs">
            
            <div className="divide-y divide-[#E6E1D6]">
              {cart.map(item => {
                const isSavedInWishlist = wishlist.includes(item.product.id);
                const hasWarning = stockWarnings[item.product.id];
                const availableStock = item.product.stockQuantity;

                return (
                  <div key={item.product.id} className="py-5 first:pt-0 last:pb-0 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 rounded-2xl bg-[#F3EEE6] border border-[#E2DAD0] p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img
                          src={getAVOLABProductImageFor(item.product)}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => { (e.target as HTMLImageElement).src = getAVOLABProductImage(item.product.id, item.product.category, item.product.name); }}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-sm text-[#1A1A1A] hover:text-[#4A5D4E] cursor-pointer"
                              onClick={() => setActiveTab('SHOP')}>
                            {item.product.name}
                          </h3>
                          <span className="font-extrabold text-sm text-[#1C2E20]">
                            ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>

                        <p className="text-[11px] text-[#888] flex items-center gap-2">
                          <span>SKU: {item.product.sku}</span>
                          <span>•</span>
                          <span>Size: {item.product.size}</span>
                        </p>

                        <div className="flex items-center gap-2 text-[10px] font-bold pt-1">
                          {availableStock > 5 ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                              In Stock ({availableStock} available)
                            </span>
                          ) : availableStock > 0 ? (
                            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                              Only {availableStock} left in stock!
                            </span>
                          ) : (
                            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stock Exceeded Alert Banner */}
                    {hasWarning && (
                      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-2.5 rounded-xl flex items-center gap-2">
                        <AlertCircle size={15} className="flex-shrink-0 text-amber-600" />
                        <span className="font-medium">{hasWarning}</span>
                      </div>
                    )}

                    {/* Actions & Quantity Controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        {/* Quantity Counter */}
                        <div className="flex items-center bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-2 py-1 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.product.id, item.quantity - 1, availableStock)}
                            className="w-6 h-6 flex items-center justify-center text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors"
                          >
                            -
                          </button>

                          <input
                            type="number"
                            min={1}
                            max={availableStock}
                            value={item.quantity}
                            onChange={(e) => handleQtyChange(item.product.id, parseInt(e.target.value) || 1, availableStock)}
                            className="w-10 text-center bg-transparent border-none focus:outline-none font-extrabold text-xs text-[#2D2D2D]"
                          />

                          <button
                            type="button"
                            onClick={() => handleQtyChange(item.product.id, item.quantity + 1, availableStock)}
                            className="w-6 h-6 flex items-center justify-center text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs text-[#888]">
                          @ ${item.product.discountPrice || item.product.price} each
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <button
                          type="button"
                          onClick={() => handleMoveToWishlist(item.product.id)}
                          className="text-[#4A5D4E] hover:underline font-semibold flex items-center gap-1"
                        >
                          <Heart size={14} className={isSavedInWishlist ? 'fill-[#4A5D4E]' : ''} />
                          <span className="hidden sm:inline">Save for Later</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#E6E1D6] flex justify-between items-center">
              <button
                type="button"
                onClick={() => setActiveTab('SHOP')}
                className="text-xs font-bold uppercase tracking-wider text-[#4A5D4E] hover:underline flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> Continue Shopping
              </button>
            </div>

          </div>

          {/* AI Recommended Add-ons Section */}
          {recommendedAddons.length > 0 && (
            <div className="bg-[#FAF8F5] border border-[#E6E1D6] rounded-3xl p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-[#E6E1D6] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#4A5D4E] text-amber-300 flex items-center justify-center">
                    <Sparkles size={14} />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-[#1C2E20]">Complete Your Routine</h3>
                    <p className="text-[10px] text-stone-500">AI Personalization match for your {customer?.skinType || 'Sensitive'} skin</p>
                  </div>
                </div>
                <span className="text-[10px] bg-[#D9E3D0] text-[#4A5D4E] font-bold px-2.5 py-0.5 rounded-full">
                  AI Match Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendedAddons.map(rec => {
                  const product = rec.product;

                  return (
                    <div key={product.id} className="bg-white p-3 rounded-2xl border border-[#E6E1D6] space-y-2 flex flex-col justify-between shadow-2xs">
                      <div className="space-y-1.5">
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-stone-100">
                          <img src={getAVOLABProductImageFor(product)} alt={product.name} className="w-full h-full object-cover" />
                          <span className="absolute top-1.5 left-1.5 bg-[#4A5D4E] text-white font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Sparkles size={10} className="text-amber-300" />
                            {rec.aiMatchScore}%
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-[#1A1A1A] line-clamp-1">{product.name}</h4>
                        <p className="text-[10px] text-stone-500">${product.discountPrice || product.price}</p>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(product, 1);
                          showToast(`Added ${product.name} to cart!`);
                        }}
                        className="w-full bg-[#4A5D4E] text-white py-1.5 rounded-xl text-[10px] font-bold hover:bg-[#3A493D] transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus size={12} /> Add to Cart
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Summary & Coupons */}
        <div className="space-y-6">
          
          {/* Coupon Code Card */}
          <div className="bg-white border border-[#E6E1D6] rounded-3xl p-6 space-y-4 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A5D4E] flex items-center gap-1.5">
              <Tag size={15} /> Promo & Coupon Code
            </h3>

            {appliedCoupon ? (
              <div className="bg-[#D9E3D0]/50 border border-[#849673]/40 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#4A5D4E] block">{appliedCoupon.title}</span>
                  <span className="text-[10px] text-[#5A5A5A] font-mono font-bold">Code: {appliedCoupon.code}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAppliedCoupon(null);
                    showToast('Coupon removed');
                  }}
                  className="text-stone-400 hover:text-rose-600 p-1"
                  title="Remove Coupon"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter WELCOME10 or AVOLAB20"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                />
                <button
                  type="submit"
                  className="bg-[#4A5D4E] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#3A493D] transition-colors"
                >
                  Apply
                </button>
              </form>
            )}

            <div className="text-[10px] text-[#888] space-y-1 pt-1">
              <p className="font-semibold text-[#5A5A5A]">Available Demo Coupons:</p>
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setAppliedCoupon({ code: 'WELCOME10', type: 'PERCENTAGE', value: 10, title: 'Welcome 10% Off' });
                    showToast('Applied WELCOME10!');
                  }}
                  className="bg-[#F0EBE1] text-[#4A5D4E] px-2 py-0.5 rounded font-mono font-bold hover:bg-[#D9E3D0]"
                >
                  WELCOME10 (10% OFF)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAppliedCoupon({ code: 'AVOLAB20', type: 'PERCENTAGE', value: 20, title: 'AVOLAB 20% Off' });
                    showToast('Applied AVOLAB20!');
                  }}
                  className="bg-[#F0EBE1] text-[#4A5D4E] px-2 py-0.5 rounded font-mono font-bold hover:bg-[#D9E3D0]"
                >
                  AVOLAB20 (20% OFF)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAppliedCoupon({ code: 'GLOW15', type: 'FIXED', value: 15, title: 'Glow $15 Off' });
                    showToast('Applied GLOW15!');
                  }}
                  className="bg-[#F0EBE1] text-[#4A5D4E] px-2 py-0.5 rounded font-mono font-bold hover:bg-[#D9E3D0]"
                >
                  GLOW15 ($15 OFF)
                </button>
              </div>
            </div>
          </div>

          {/* Cart Totals Summary */}
          <div className="bg-white border border-[#E6E1D6] rounded-3xl p-6 space-y-5 shadow-2xs">
            <h3 className="font-serif text-lg font-bold text-[#1C2E20] border-b border-[#E6E1D6] pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-[#5A5A5A]">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-semibold text-[#2D2D2D]">${subtotal.toFixed(2)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-[#2D2D2D]">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-[#E6E1D6] text-base font-extrabold text-[#1C2E20]">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full bg-[#4A5D4E] text-white py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#3A493D] transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <p className="text-[10px] text-[#888] text-center">
              🔒 256-Bit SSL Encrypted Checkout • Free 30-Day Returns
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

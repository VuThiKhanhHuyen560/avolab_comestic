import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Star, ShoppingBag, Heart, Store, ShieldCheck, CheckCircle2, MessageSquare, Info } from 'lucide-react';
import { calculateAIMatchScore } from '../../utils/aiRecommendationEngine';
import { getAVOLABProductImage, getAVOLABProductImageFor } from '../../utils/productImages';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, toggleWishlist, wishlist, customer, stores, setIsCartOpen, systemSettings } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'DETAILS' | 'COMPATIBILITY' | 'STORES' | 'REVIEWS'>('DETAILS');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.includes(selectedProduct.id);

  const matchResult = calculateAIMatchScore(
    selectedProduct,
    { skinType: customer?.skinType, skinConcerns: customer?.skinConcerns },
    systemSettings
  );

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    if (!selectedProduct.reviews) selectedProduct.reviews = [];
    selectedProduct.reviews.unshift({
      id: `rev-${Date.now()}`,
      author: customer.name || 'Chloe Bennett',
      rating: newReviewRating,
      comment: newReviewComment,
      date: new Date().toISOString().split('T')[0],
      verified: true
    });
    selectedProduct.reviewsCount += 1;
    setNewReviewComment('');
    alert('Thank you! Your verified review has been published.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative text-stone-800">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-stone-700 p-2 rounded-full shadow transition-colors"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F3EEE6] border border-[#E2DAD0] shadow-sm flex items-center justify-center p-6">
              <img
                src={getAVOLABProductImageFor(selectedProduct)}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getAVOLABProductImage(selectedProduct.id, selectedProduct.category, selectedProduct.name);
                }}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 rounded-2xl"
              />
              <div className="absolute top-4 left-4 bg-[#2D3B2D] text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                <Sparkles size={13} className="text-[#D3E0D3]" />
                <span>{matchResult.aiMatchScore}% AI Match</span>
              </div>
            </div>

            {/* Micro badges */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-stone-700">
              <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-700 flex-shrink-0" />
                <span>100% Vegan & Gentle</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center gap-2">
                <Store size={16} className="text-emerald-700 flex-shrink-0" />
                <span>Same-Day BOPIS Eligible</span>
              </div>
            </div>
          </div>

          {/* Product Details & Actions */}
          <div className="space-y-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold uppercase tracking-wider text-emerald-800">{selectedProduct.category}</span>
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star size={14} className="fill-amber-500" /> {selectedProduct.rating} ({selectedProduct.reviewsCount} reviews)
                </span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-[#1C2E20] mt-1">{selectedProduct.name}</h2>
              <p className="text-xs text-stone-500 mt-0.5">Size: {selectedProduct.size} • SKU: {selectedProduct.sku}</p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-2xl font-bold text-[#1C2E20]">
                  ${selectedProduct.discountPrice || selectedProduct.price}
                </span>
                {selectedProduct.discountPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    ${selectedProduct.price}
                  </span>
                )}
              </div>

              {/* Navigation Tabs inside modal */}
              <div className="flex border-b border-stone-200 mt-4 text-xs font-semibold gap-4 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('DETAILS')}
                  className={`pb-2 transition-colors ${activeTab === 'DETAILS' ? 'text-[#2E4A32] border-b-2 border-[#2E4A32]' : 'text-stone-400'}`}
                >
                  Formula & Benefits
                </button>
                <button
                  onClick={() => setActiveTab('COMPATIBILITY')}
                  className={`pb-2 transition-colors flex items-center gap-1 ${activeTab === 'COMPATIBILITY' ? 'text-[#2E4A32] border-b-2 border-[#2E4A32] font-bold' : 'text-stone-400'}`}
                >
                  <Sparkles size={13} className="text-amber-600" />
                  AI Match Analysis ({matchResult.aiMatchScore}%)
                </button>
                <button
                  onClick={() => setActiveTab('STORES')}
                  className={`pb-2 transition-colors ${activeTab === 'STORES' ? 'text-[#2E4A32] border-b-2 border-[#2E4A32]' : 'text-stone-400'}`}
                >
                  Store Stock (BOPIS)
                </button>
                <button
                  onClick={() => setActiveTab('REVIEWS')}
                  className={`pb-2 transition-colors ${activeTab === 'REVIEWS' ? 'text-[#2E4A32] border-b-2 border-[#2E4A32]' : 'text-stone-400'}`}
                >
                  Reviews ({selectedProduct.reviewsCount})
                </button>
              </div>

              {/* Tab Content */}
              <div className="py-3 text-xs leading-relaxed text-stone-600 space-y-3">
                {activeTab === 'COMPATIBILITY' && (
                  <div className="space-y-3 bg-[#F0F4EE] p-4 rounded-2xl border border-emerald-200">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                      <span className="font-bold text-[#1C2E20] uppercase text-[10px]">AI Compatibility Score</span>
                      <span className="bg-[#4A5D4E] text-white font-mono font-bold px-2.5 py-0.5 rounded-full text-xs">
                        {matchResult.aiMatchScore}% Score
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#1C2E20] mb-1">Why this fits your skin:</h4>
                      <ul className="space-y-1 text-stone-700">
                        {matchResult.matchReasons.map((reason, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-700 flex-shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-emerald-200/80 grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-stone-500">Skin Type Vector:</span>
                        <p className="font-bold text-stone-800">{matchResult.matchBreakdown.skinTypeScore}% Match</p>
                      </div>
                      <div>
                        <span className="text-stone-500">Skin Concern Vector:</span>
                        <p className="font-bold text-stone-800">{matchResult.matchBreakdown.concernScore}% Match</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'DETAILS' && (
                  <>
                    <p>{selectedProduct.description}</p>

                    <div>
                      <h4 className="font-semibold text-stone-900 mb-1">Key Botanical Benefits:</h4>
                      <ul className="list-disc list-inside space-y-1 text-stone-600">
                        {selectedProduct.benefits.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-stone-900 mb-1">Active Ingredients:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedProduct.ingredients.map((ing, i) => (
                          <span key={i} className="bg-stone-200/60 text-stone-700 px-2 py-0.5 rounded text-[10px]">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'STORES' && (
                  <div className="space-y-2">
                    <p className="text-[11px] text-stone-500">Real-time store pickup availability:</p>
                    {selectedProduct.stockByLocation.map(loc => (
                      <div key={loc.locationId} className="bg-white p-2.5 rounded-xl border border-stone-200 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-stone-800">{loc.locationName}</p>
                          <p className="text-[10px] text-stone-400">{loc.locationType === 'STORE' ? 'Physical Store Pickup' : 'Warehouse'}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          loc.quantity > 10 ? 'bg-emerald-100 text-emerald-800' : loc.quantity > 0 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {loc.quantity > 0 ? `${loc.quantity} Units In Stock` : 'Out of Stock'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'REVIEWS' && (
                  <div className="space-y-3">
                    <form onSubmit={handleAddReview} className="bg-white p-3 rounded-xl border border-stone-200 space-y-2">
                      <p className="font-semibold text-stone-900">Write a Verified Review:</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-stone-500">Rating:</span>
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="text-amber-500"
                          >
                            <Star size={14} className={star <= newReviewRating ? 'fill-amber-500' : ''} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Share your experience with this formulation..."
                        value={newReviewComment}
                        onChange={(e) => setNewReviewComment(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-lg p-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#2E4A32]"
                      />
                      <button
                        type="submit"
                        className="bg-[#2E4A32] text-amber-100 px-3 py-1 rounded-lg text-xs font-semibold hover:bg-[#1C2E20]"
                      >
                        Submit Review
                      </button>
                    </form>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {(selectedProduct.reviews || []).map(rev => (
                        <div key={rev.id} className="bg-white p-2.5 rounded-xl border border-stone-200 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-stone-900">{rev.author}</span>
                            <span className="text-stone-400">{rev.date}</span>
                          </div>
                          <div className="flex text-amber-500 gap-0.5">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star size={10} key={i} className="fill-amber-500" />
                            ))}
                          </div>
                          <p className="text-stone-600 text-[11px]">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white border border-stone-300 rounded-xl px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 font-semibold text-xs text-stone-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addToCart(selectedProduct, quantity)}
                  className="flex-1 bg-white border border-[#2E4A32] text-[#2E4A32] py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={15} /> Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#2E4A32] text-amber-100 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1C2E20] transition-colors shadow-sm"
                >
                  Buy Now
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

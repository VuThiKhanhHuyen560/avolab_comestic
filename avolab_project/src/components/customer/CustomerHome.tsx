import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, ShoppingBag, MapPin, Star, Heart, CheckCircle2, ChevronLeft, ChevronRight, Zap, Instagram, Mail, Eye } from 'lucide-react';
import { calculateAIMatchScore, getPersonalizedRecommendations } from '../../utils/aiRecommendationEngine';
import { ProductCard } from './ProductCard';
import {
  INITIAL_MARKETING_BANNERS,
  INITIAL_FEATURED_COLLECTIONS,
  INGREDIENT_SPOTLIGHTS,
  CUSTOMER_REVIEWS,
  INSTAGRAM_GALLERY
} from '../../data/marketingData';

export const CustomerHome: React.FC = () => {
  const { products, setActiveTab, addToCart, toggleWishlist, wishlist, setSelectedProduct, setIsAiBotOpen, customer, systemSettings } = useApp();

  // State for banner carousel
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const currentBanner = INITIAL_MARKETING_BANNERS[currentBannerIndex];

  // Get personalized AI recommended products
  const aiRecommendations = getPersonalizedRecommendations(
    products, 
    { skinType: customer?.skinType, skinConcerns: customer?.skinConcerns }, 
    systemSettings, 
    8
  );

  const handleNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % INITIAL_MARKETING_BANNERS.length);
  };

  const handlePrevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + INITIAL_MARKETING_BANNERS.length) % INITIAL_MARKETING_BANNERS.length);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="bg-[#F6F1E8] space-y-12 pb-16 min-h-screen">
      
      {/* Home Hero Banner — Strictly Matching Reference */}
      <section className="pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#4C5D4B]/15 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center min-h-[440px]">
          
          {/* Hero Left Column (Content) */}
          <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDEAD2] text-[#4A5D4E] text-[10px] font-bold tracking-widest uppercase border border-[#4C5D4B]/15">
                <Leaf size={12} className="text-[#4A5D4E]" />
                <span>100% VEGAN • CLEAN SCIENCE • BOTANICAL POWER</span>
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-bold text-[#1C2E20] leading-[1.15]">
                {currentBanner.title}
              </h1>

              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-md">
                {currentBanner.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setActiveTab('SHOP')}
                className="bg-[#4A5D4E] text-[#FFFFFF] px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#3A493D] transition-all flex items-center gap-2 shadow-xs group"
              >
                <span>SHOP BESTSELLERS</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('AI_BEAUTY_ASSISTANT')}
                className="bg-[#DDEAD2] text-[#4A5D4E] px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#c9dabf] transition-all flex items-center gap-2 border border-[#4C5D4B]/15"
              >
                <Sparkles size={15} className="text-[#4A5D4E]" />
                <span>TAKE AI BEAUTY QUIZ</span>
              </button>
            </div>

            {/* Navigation Dots & Arrows */}
            <div className="flex items-center justify-between pt-4 border-t border-[#4C5D4B]/10">
              <div className="flex items-center gap-2">
                {INITIAL_MARKETING_BANNERS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBannerIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentBannerIndex ? 'w-6 bg-[#4A5D4E]' : 'w-2 bg-[#DDEAD2]'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevBanner}
                  className="p-1.5 rounded-full border border-[#4C5D4B]/20 text-[#4A5D4E] bg-white hover:bg-[#F6F1E8] transition-colors"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextBanner}
                  className="p-1.5 rounded-full border border-[#4C5D4B]/20 text-[#4A5D4E] bg-white hover:bg-[#F6F1E8] transition-colors"
                  aria-label="Next slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Hero Right Column (Studio Composition Image) */}
          <div className="lg:col-span-7 relative h-80 sm:h-96 lg:h-full min-h-[380px] bg-[#EAE3D2]/50 overflow-hidden">
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Floating AI Match Overlay Card on Bottom Right */}
            <div className="absolute bottom-4 right-4 left-4 sm:left-auto sm:max-w-sm bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#4C5D4B]/15 shadow-lg flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#DDEAD2] text-[#4A5D4E] flex items-center justify-center font-bold text-xs flex-shrink-0">
                  98%
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C2E20]">Personalized AI Skin Match</p>
                  <p className="text-[10px] text-stone-500">Matched to your {customer?.skinType || 'Sensitive'} Skin Profile</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiBotOpen(true)}
                className="text-[11px] text-[#4A5D4E] font-bold uppercase tracking-wider underline hover:text-[#1C2E20] flex items-center gap-1 flex-shrink-0"
              >
                <span>CONSULT AI</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Botanical Power Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#4C5D4B]/15 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left sm:text-center shadow-xs">
          <div className="flex items-start sm:flex-col sm:items-center gap-3 space-y-0 sm:space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#DDEAD2] flex items-center justify-center text-[#4A5D4E] flex-shrink-0">
              <Leaf size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C2E20]">100% VEGAN & CLEAN</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">Zero harsh sulfates, parabens, or synthetic fragrance</p>
            </div>
          </div>

          <div className="flex items-start sm:flex-col sm:items-center gap-3 space-y-0 sm:space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#DDEAD2] flex items-center justify-center text-[#4A5D4E] flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C2E20]">DERMATOLOGIST APPROVED</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">Formulated for sensitive & compromised skin barriers</p>
            </div>
          </div>

          <div className="flex items-start sm:flex-col sm:items-center gap-3 space-y-0 sm:space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#DDEAD2] flex items-center justify-center text-[#4A5D4E] flex-shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C2E20]">EXPRESS BOPIS PICKUP</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">Order online & pick up in store within 90 mins</p>
            </div>
          </div>

          <div className="flex items-start sm:flex-col sm:items-center gap-3 space-y-0 sm:space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#DDEAD2] flex items-center justify-center text-[#4A5D4E] flex-shrink-0">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#1C2E20]">COLD-PRESSED PHYTOSTEROLS</h3>
              <p className="text-[11px] text-stone-500 mt-0.5">Bio-active organic avocado seed extraction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collections Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#4C5D4B]/15 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#4A5D4E] font-bold">CURATED FORMULATIONS</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C2E20] mt-1">Explore Featured Collections</h2>
          </div>
          <button
            onClick={() => setActiveTab('SHOP')}
            className="text-xs font-bold uppercase tracking-widest text-[#4A5D4E] hover:underline flex items-center gap-1.5"
          >
            <span>VIEW ALL COLLECTIONS</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIAL_FEATURED_COLLECTIONS.map((col) => (
            <div
              key={col.id}
              onClick={() => setActiveTab('SHOP')}
              className="bg-[#FFFFFF] rounded-2xl border border-[#4C5D4B]/15 overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-48 bg-[#EAE3D2]/40 overflow-hidden">
                <img
                  src={col.imageUrl}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1C2E20]">{col.title}</h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#4C5D4B]/10 flex items-center justify-between text-xs font-bold text-[#4A5D4E]">
                  <span className="uppercase tracking-wider">SHOP NOW</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Personalization Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#4A5D4E] rounded-3xl p-6 sm:p-8 text-[#FFFFFF] shadow-sm border border-[#3A493D] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="bg-[#DDEAD2] text-[#4A5D4E] text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                AI Engine Active
              </span>
              <span className="text-xs text-[#DDEAD2]">Customer 360 Personalization</span>
            </div>
            <h2 className="font-serif font-bold text-2xl text-[#FFFFFF]">Recommended for <span className="italic text-[#DDEAD2]">{customer?.name || 'Valued Customer'}</span></h2>
            <p className="text-xs text-[#F6F1E8]/90 leading-relaxed">
              Based on your <span className="underline font-semibold">{customer?.skinType || 'Sensitive'} Skin Profile</span> and concerns ({customer?.skinConcerns?.join(', ') || 'hydration'}), these formulations offer maximum barrier support.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setActiveTab('SHOP')}
              className="bg-[#DDEAD2] text-[#4A5D4E] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
            >
              View Full Match Catalog
            </button>
          </div>
        </div>
      </section>

      {/* Best Sellers Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#4C5D4B]/15 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#4A5D4E] font-bold">FEATURED FORMULATIONS</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C2E20] mt-1">Best Selling Clean Skincare</h2>
          </div>
          <button
            onClick={() => setActiveTab('SHOP')}
            className="text-xs font-bold uppercase tracking-widest text-[#4A5D4E] hover:underline flex items-center gap-1.5"
          >
            <span>EXPLORE ALL ({products.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiRecommendations.slice(0, 8).map(item => {
            const product = item.product;
            const matchScore = item.aiMatchScore;
            const isWishlisted = wishlist.includes(product.id);

            return (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={setSelectedProduct}
                onAddToCart={addToCart}
                isWishlisted={isWishlisted}
                onToggleWishlist={toggleWishlist}
                matchScore={matchScore}
              />
            );
          })}
        </div>
      </section>

      {/* Botanical Science Spotlight */}
      <section className="bg-[#FFFFFF] py-12 border-y border-[#4C5D4B]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#4A5D4E] font-bold">BOTANIC SCIENCE</span>
            <h2 className="font-serif font-bold text-3xl text-[#1C2E20]">Key Hero Ingredients</h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We isolate high-potency bio-active compounds from sustainable botanical sources to repair, protect, and illuminate your skin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INGREDIENT_SPOTLIGHTS.map((ing) => (
              <div key={ing.id} className="bg-[#F6F1E8] p-6 rounded-2xl border border-[#4C5D4B]/15 space-y-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#DDEAD2] text-[#4A5D4E] flex items-center justify-center font-serif text-lg font-bold">
                    {ing.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#4A5D4E] font-bold">{ing.botanicalName}</span>
                    <h3 className="font-serif font-bold text-base text-[#1C2E20] mt-0.5">{ing.name}</h3>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{ing.description}</p>
                </div>

                <div className="pt-3 border-t border-[#4C5D4B]/15">
                  <span className="inline-block bg-[#FFFFFF] text-[#4A5D4E] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#4C5D4B]/15">
                    Key Benefit: {ing.benefits.join(', ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#4A5D4E] font-bold">REAL RESULTS</span>
          <h2 className="font-serif font-bold text-3xl text-[#1C2E20]">Loved by 10,000+ Clean Beauty Enthusiasts</h2>
          <p className="text-xs text-stone-600">Verified customer feedback on barrier repair and gentle formulation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div key={rev.id} className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#4C5D4B]/15 space-y-4 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs text-[#1C2E20] leading-relaxed italic">"{rev.comment}"</p>
              </div>

              <div className="pt-4 border-t border-[#4C5D4B]/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#1C2E20]">{rev.author}</p>
                  <p className="text-[10px] text-[#4A5D4E]">Verified Buyer ({rev.skinType || 'Sensitive'} Skin)</p>
                </div>
                <span className="text-[10px] text-stone-400 font-medium">{rev.productName}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram / Community Wall */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#4C5D4B]/15 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#4A5D4E] font-bold">COMMUNITY</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C2E20] mt-1">#AvolabGlow on Instagram</h2>
          </div>
          <span className="text-xs font-bold text-[#4A5D4E] flex items-center gap-1.5">
            <Instagram size={16} /> @avolab.cosmetics
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {INSTAGRAM_GALLERY.map((item) => (
            <div key={item.id} className="relative group rounded-2xl overflow-hidden aspect-square bg-[#EAE3D2]/40 border border-[#4C5D4B]/15">
              <img
                src={item.imageUrl}
                alt={`Instagram post by ${item.handle}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold p-4 text-center">
                <span>{item.handle}<br/><span className="text-[10px] font-normal text-white/80">❤️ {item.likes}</span></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Incentive Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#4A5D4E] rounded-3xl p-8 md:p-12 text-[#FFFFFF] text-center space-y-6 max-w-4xl mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#DDEAD2] text-[#4A5D4E] mx-auto flex items-center justify-center">
            <Mail size={22} />
          </div>

          <div className="space-y-2">
            <span className="bg-[#DDEAD2] text-[#4A5D4E] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Exclusive Welcome Offer
            </span>
            <h2 className="text-3xl font-serif font-bold">Join the AVOLAB Clean Beauty Club</h2>
            <p className="text-xs sm:text-sm text-[#DDEAD2] max-w-lg mx-auto leading-relaxed">
              Subscribe to receive 15% OFF your first order, early access to new botanical drops, and personalized AI skin maintenance tips.
            </p>
          </div>

          {subscribed ? (
            <div className="p-4 bg-[#DDEAD2] text-[#4A5D4E] rounded-2xl max-w-md mx-auto font-bold text-xs flex items-center justify-center gap-2">
              <CheckCircle2 size={18} />
              <span>Thank you! Your 15% promo code is: AVOLAB15</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3 rounded-xl text-xs text-[#1C2E20] bg-white border border-transparent focus:outline-none placeholder-stone-400"
              />
              <button
                type="submit"
                className="bg-[#DDEAD2] text-[#4A5D4E] px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors"
              >
                Claim 15% OFF
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};

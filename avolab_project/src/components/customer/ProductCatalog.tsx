import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Search, SlidersHorizontal, Heart, ShoppingBag, Star, Check, RefreshCcw } from 'lucide-react';
import { SkinType, SkinConcern, Product } from '../../types';
import { calculateAIMatchScore } from '../../utils/aiRecommendationEngine';
import { ProductCard } from './ProductCard';

export const ProductCatalog: React.FC = () => {
  const { products, addToCart, toggleWishlist, wishlist, toggleCompare, compareList, setSelectedProduct, customer, systemSettings } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType | 'All'>('All');
  const [selectedConcern, setSelectedConcern] = useState<SkinConcern | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'MATCH' | 'PRICE_LOW' | 'PRICE_HIGH' | 'RATING'>('MATCH');
  const [onlyVegan, setOnlyVegan] = useState<boolean>(false);

  const categories = useMemo(() => {
    const set = new Set(products.map(p => p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  const getAiMatchScore = (p: Product) => {
    return calculateAIMatchScore(p, { skinType: customer?.skinType, skinConcerns: customer?.skinConcerns }, systemSettings).aiMatchScore;
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedSkinType !== 'All' && p.skinTypes && !p.skinTypes.includes(selectedSkinType) && !p.skinTypes.includes('All')) return false;
      if (selectedConcern !== 'All' && p.skinConcerns && !p.skinConcerns.includes(selectedConcern)) return false;
      if (onlyVegan && !p.isVegan) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchIng = p.ingredients.some(i => i.toLowerCase().includes(q));
        if (!matchName && !matchCat && !matchIng) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'MATCH') return getAiMatchScore(b) - getAiMatchScore(a);
      if (sortBy === 'PRICE_LOW') return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      if (sortBy === 'PRICE_HIGH') return (b.discountPrice || b.price) - (a.discountPrice || a.price);
      if (sortBy === 'RATING') return b.rating - a.rating;
      return 0;
    });
  }, [products, selectedCategory, selectedSkinType, selectedConcern, onlyVegan, searchQuery, sortBy, customer]);

  return (
    <div className="bg-[#F6F1E8] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#4C5D4B]/15 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#DDEAD2] text-[#4A5D4E] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#4C5D4B]/15">
              AVOLAB Botanicals
            </span>
            <span className="text-xs text-stone-500 font-medium">Showing {filteredProducts.length} Formulations</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1C2E20]">Vegan Skincare Catalog</h1>
          <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
            Formulated with nutrient-dense botanical actives, avocado phytosterols, and clean ingredients. Sorted by AI skin match compatibility for <span className="font-semibold underline">{customer?.name || 'Guest'} ({customer?.skinType || 'Sensitive'} skin)</span>.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#4C5D4B]/15 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            
            {/* Search */}
            <div className="relative md:col-span-1">
              <input
                type="text"
                placeholder="Search by product or ingredient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F6F1E8] border border-[#4C5D4B]/20 rounded-xl pl-9 pr-3 py-2 text-xs text-[#1C2E20] focus:outline-none focus:border-[#4A5D4E]"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-[#4A5D4E]" />
            </div>

            {/* Skin Type Filter */}
            <div>
              <select
                value={selectedSkinType}
                onChange={(e) => setSelectedSkinType(e.target.value as any)}
                className="w-full bg-[#F6F1E8] border border-[#4C5D4B]/20 rounded-xl px-3 py-2 text-xs text-[#1C2E20] focus:outline-none focus:border-[#4A5D4E]"
              >
                <option value="All">Filter: All Skin Types</option>
                <option value="Sensitive">Sensitive</option>
                <option value="Dry">Dry</option>
                <option value="Oily">Oily</option>
                <option value="Combination">Combination</option>
                <option value="Normal">Normal</option>
              </select>
            </div>

            {/* Skin Concern Filter */}
            <div>
              <select
                value={selectedConcern}
                onChange={(e) => setSelectedConcern(e.target.value as any)}
                className="w-full bg-[#F6F1E8] border border-[#4C5D4B]/20 rounded-xl px-3 py-2 text-xs text-[#1C2E20] focus:outline-none focus:border-[#4A5D4E]"
              >
                <option value="All">Filter: All Skin Concerns</option>
                <option value="Redness & Irritation">Redness & Irritation</option>
                <option value="Dryness & Dehydration">Dryness & Dehydration</option>
                <option value="Acne & Blemishes">Acne & Blemishes</option>
                <option value="Dullness & Uneven Tone">Dullness & Uneven Tone</option>
                <option value="Aging & Fine Lines">Aging & Fine Lines</option>
                <option value="Dark Circles">Dark Circles</option>
              </select>
            </div>

            {/* Sorting */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#F6F1E8] border border-[#4C5D4B]/20 rounded-xl px-3 py-2 text-xs text-[#1C2E20] font-medium focus:outline-none focus:border-[#4A5D4E]"
              >
                <option value="MATCH">Sort: Highest AI Match %</option>
                <option value="PRICE_LOW">Price: Low to High</option>
                <option value="PRICE_HIGH">Price: High to Low</option>
                <option value="RATING">Highest Customer Rating</option>
              </select>
            </div>

          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[#4A5D4E] font-bold flex-shrink-0 uppercase text-[10px] tracking-wider">Categories:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full border transition-all flex-shrink-0 font-medium ${
                  selectedCategory === cat
                    ? 'bg-[#4A5D4E] text-[#FFFFFF] border-[#4A5D4E] font-bold'
                    : 'bg-[#F6F1E8] text-[#1C2E20] border-[#4C5D4B]/20 hover:bg-[#DDEAD2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#FFFFFF] rounded-2xl p-12 text-center border border-[#4C5D4B]/15 space-y-3 shadow-xs">
            <p className="text-sm text-stone-600 font-medium">No products match your active filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedSkinType('All');
                setSelectedConcern('All');
                setSearchQuery('');
              }}
              className="text-xs text-[#4A5D4E] font-bold underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => {
              const matchScore = getAiMatchScore(product);
              const isWishlisted = wishlist.includes(product.id);
              const isCompared = compareList.includes(product.id);

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setSelectedProduct}
                  onAddToCart={addToCart}
                  isWishlisted={isWishlisted}
                  onToggleWishlist={toggleWishlist}
                  isCompared={isCompared}
                  onToggleCompare={toggleCompare}
                  matchScore={matchScore}
                />
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

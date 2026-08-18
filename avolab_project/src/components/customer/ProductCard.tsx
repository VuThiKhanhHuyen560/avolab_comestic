import React, { useState } from 'react';
import { Product } from '../../types';
import { Heart, Sparkles, Star, ShoppingBag, Eye, RefreshCw } from 'lucide-react';
import { getAVOLABProductImage, getAVOLABProductImageFor } from '../../utils/productImages';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (id: string) => void;
  matchScore?: number;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
  isCompared = false,
  onToggleCompare,
  matchScore = 95,
  className = '',
}) => {
  const primaryImg = getAVOLABProductImageFor(product);
  const secondaryImg = product.secondaryImages && product.secondaryImages.length > 0
    ? getAVOLABProductImage(product.id, product.category, product.name, product.secondaryImages[0])
    : primaryImg;

  const [currentImg, setCurrentImg] = useState<string>(primaryImg);

  React.useEffect(() => {
    setCurrentImg(primaryImg);
  }, [primaryImg]);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleImageError = () => {
    // If the image fails to load, fallback to guaranteed local AVOLAB image asset
    const fallback = getAVOLABProductImage(product.id, product.category, product.name);
    setCurrentImg(fallback);
  };

  return (
    <div
      className={`bg-white rounded-3xl border border-[#E2DAD0] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group ${className}`}
      onMouseEnter={() => {
        setIsHovered(true);
        if (secondaryImg !== primaryImg) setCurrentImg(secondaryImg);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImg(primaryImg);
      }}
    >
      {/* Product Image Area */}
      <div
        className="relative bg-[#F3EEE6] aspect-square overflow-hidden cursor-pointer flex items-center justify-center p-3"
        onClick={() => onSelect(product)}
      >
        <img
          src={currentImg}
          alt={product.name}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-xl"
        />

        {/* AI Match % Badge */}
        {matchScore !== undefined && (
          <div className="absolute top-3 left-3 bg-[#2D3B2D] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 z-10">
            <Sparkles size={11} className="text-[#D3E0D3]" />
            <span>{matchScore}% MATCH</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          {onToggleWishlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product.id);
              }}
              className="p-2 bg-white/90 hover:bg-white text-[#2D3B2D] rounded-full shadow-xs transition-transform active:scale-90"
              title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
            >
              <Heart size={15} className={isWishlisted ? "fill-rose-500 text-rose-500" : ""} />
            </button>
          )}

          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(product.id);
              }}
              className={`p-2 rounded-full shadow-xs transition-transform active:scale-90 text-[10px] font-bold ${
                isCompared ? 'bg-[#2D3B2D] text-white' : 'bg-white/90 hover:bg-white text-[#2D3B2D]'
              }`}
              title="Toggle Compare"
            >
              VS
            </button>
          )}
        </div>

        {/* Quick View overlay */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="w-full py-2 bg-white/95 backdrop-blur-md text-[#2D3B2D] font-bold text-xs rounded-full shadow-xs flex items-center justify-center gap-1.5 hover:bg-white active:scale-95 transition-all"
          >
            <Eye size={14} /> Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
            <span>{product.category}</span>
            <span className="flex items-center text-amber-600 font-bold gap-0.5">
              <Star size={11} className="fill-amber-500 text-amber-500" /> {product.rating} ({product.reviewsCount})
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelect(product)}
            className="font-bold text-sm text-[#2D3B2D] line-clamp-1 hover:text-[#4C5D4B] transition-colors cursor-pointer mt-1"
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>

          {/* Skin Type Tags */}
          {product.skinTypes && product.skinTypes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {product.skinTypes.slice(0, 2).map((st) => (
                <span
                  key={st}
                  className="bg-[#EAF0EA] text-[#2D3B2D] text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-[#2D3B2D]/10"
                >
                  {st}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-3 border-t border-[#E2DAD0]/60 flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-base text-[#2D3B2D]">
              ${product.discountPrice || product.price}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-stone-400 line-through font-normal">
                ${product.price}
              </span>
            )}
          </div>

          {onAddToCart && (
            <button
              onClick={() => onAddToCart(product)}
              className="bg-[#2D3B2D] hover:bg-[#3E4F3E] text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
            >
              <ShoppingBag size={13} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

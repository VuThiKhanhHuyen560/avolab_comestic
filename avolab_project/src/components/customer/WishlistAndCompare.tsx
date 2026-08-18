import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, SlidersHorizontal, ShoppingBag, Trash2, Check, Star } from 'lucide-react';
import { getAVOLABProductImage } from '../../utils/productImages';

export const WishlistAndCompare: React.FC = () => {
  const { wishlist, compareList, products, toggleWishlist, toggleCompare, addToCart, setSelectedProduct } = useApp();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));
  const comparedProducts = products.filter(p => compareList.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Product Comparison Matrix */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-[#2E4A32]" />
              <h2 className="font-serif text-2xl font-bold text-[#1C2E20]">Product Comparison Matrix</h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">Compare formulas, skin compatibility, active ingredients, and pricing side-by-side</p>
          </div>
          <span className="text-xs text-stone-500 font-medium">{comparedProducts.length}/3 Selected</span>
        </div>

        {comparedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-xs text-stone-500">
            No products selected for comparison. Click "VS" on any product card in the catalog to add.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200 overflow-x-auto shadow-sm">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-[#FAF8F5]">
                  <th className="p-4 font-bold text-stone-700 w-48">Feature</th>
                  {comparedProducts.map(p => (
                    <th key={p.id} className="p-4 min-w-[200px]">
                      <div className="space-y-2">
                        <div className="w-20 h-20 rounded-2xl bg-[#F3EEE6] p-2 border border-[#E2DAD0] mx-auto flex items-center justify-center overflow-hidden">
                          <img
                            src={getAVOLABProductImage(p.id, p.category, p.name, p.image)}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => { (e.target as HTMLImageElement).src = getAVOLABProductImage(p.id, p.category, p.name); }}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h4 className="font-bold text-stone-900 text-center line-clamp-1">{p.name}</h4>
                        <button
                          onClick={() => toggleCompare(p.id)}
                          className="text-[10px] text-rose-600 font-semibold mx-auto block hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/50">Price</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="p-4 font-bold text-[#1C2E20] text-center">
                      ${p.discountPrice || p.price}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/50">Category</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="p-4 text-stone-600 text-center">{p.category}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/50">Skin Types</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="p-4 text-stone-600 text-center">{p.skinTypes?.join(', ') || 'All'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/50">Skin Concerns</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="p-4 text-stone-600 text-center">{p.skinConcerns?.join(', ') || 'General Skincare'}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/50">Active Ingredients</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="p-4 text-stone-600 text-center leading-relaxed">
                      {p.ingredients?.slice(0, 4)?.join(', ') || 'Botanical extracts'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/50">Rating</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="p-4 text-amber-600 font-bold text-center">
                      ★ {p.rating} ({p.reviewsCount})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-stone-800 bg-stone-50/50">Action</td>
                  {comparedProducts.map(p => (
                    <td key={p.id} className="p-4 text-center">
                      <button
                        onClick={() => addToCart(p)}
                        className="bg-[#2E4A32] text-amber-100 px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#1C2E20]"
                      >
                        Add to Cart
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Saved Wishlist Grid */}
      <section className="space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-rose-600 fill-rose-600" />
            <h2 className="font-serif text-2xl font-bold text-[#1C2E20]">Saved Wishlist ({wishlistedProducts.length})</h2>
          </div>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-xs text-stone-500">
            Your saved wishlist is empty. Click the heart icon on any product to save.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map(product => (
              <div key={product.id} className="bg-white rounded-3xl border border-[#E2DAD0] p-4 space-y-3 shadow-xs flex flex-col justify-between">
                <div className="aspect-square bg-[#F3EEE6] rounded-2xl p-4 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <img
                    src={getAVOLABProductImage(product.id, product.category, product.name, product.image)}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.target as HTMLImageElement).src = getAVOLABProductImage(product.id, product.category, product.name); }}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-stone-900">{product.name}</h4>
                  <p className="text-xs font-bold text-[#1C2E20] mt-1">${product.discountPrice || product.price}</p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-[#2E4A32] text-amber-100 py-1.5 rounded-xl text-xs font-bold hover:bg-[#1C2E20]"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

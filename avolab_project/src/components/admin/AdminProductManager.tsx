import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, SkinType, SkinConcern } from '../../types';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Copy, 
  Image as ImageIcon, 
  Check, 
  X, 
  Filter, 
  Archive, 
  Sparkles,
  Layers
} from 'lucide-react';
import { getAVOLABProductImageFor } from '../../utils/productImages';

export const AdminProductManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useApp();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'FEATURED' | 'LOW_STOCK'>('ALL');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: 'Serums',
    price: 35,
    discountPrice: undefined,
    size: '50ml / 1.7 fl. oz.',
    stockQuantity: 100,
    description: '',
    benefits: ['Deep hydration', 'Barrier fortification'],
    ingredients: ['Water', 'Glycerin', 'Avocado Extract', 'Ceramide NP'],
    skinTypes: ['Sensitive', 'Dry', 'Combination'],
    skinConcerns: ['Dryness & Dehydration', 'Redness & Irritation'],
    image: '/images/avolab_serum_dropper_1786632330474.jpg',
    secondaryImages: [
      '/images/avolab_cream_jar_1786632340049.jpg'
    ],
    isVegan: true,
    isFeatured: false,
    tags: ['Best Seller', 'Clean Beauty']
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'FEATURED' ? p.isFeatured :
      statusFilter === 'LOW_STOCK' ? p.stockQuantity < 20 : true;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      sku: `AVO-PROD-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Serums & Treatments',
      price: 38,
      discountPrice: undefined,
      size: '50ml / 1.7 fl. oz.',
      stockQuantity: 85,
      description: 'Bio-active nutrient formula crafted to restore lipid balance and nourish sensitive skin.',
      benefits: ['Hydrates skin barrier', 'Smooths fine lines', 'Soothes redness'],
      ingredients: ['Avocado Oil', 'Phytosterols', 'Hyaluronic Acid', 'Niacinamide'],
      skinTypes: ['Sensitive', 'Dry', 'Combination'],
      skinConcerns: ['Redness & Irritation', 'Dryness & Dehydration'],
      image: '/images/avolab_serum_dropper_1786632330474.jpg',
      secondaryImages: [
        '/images/avolab_cream_jar_1786632340049.jpg'
      ],
      isVegan: true,
      isFeatured: true,
      tags: ['New Arrival', 'Clean Skincare']
    });
    setEditingProduct(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setIsCreateModalOpen(true);
  };

  const handleDuplicate = (p: Product) => {
    const duplicated: Omit<Product, 'id'> = {
      ...p,
      sku: `${p.sku}-COPY`,
      name: `${p.name} (Copy)`,
      isFeatured: false
    };
    addProduct(duplicated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.price) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct({
        sku: formData.sku || `AVO-${Date.now()}`,
        name: formData.name || 'New Cosmetic Product',
        category: formData.category || 'Serums & Treatments',
        price: Number(formData.price) || 20,
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        image: formData.image || '/images/avolab_serum_dropper_1786632330474.jpg',
        secondaryImages: formData.secondaryImages || [],
        description: formData.description || '',
        benefits: formData.benefits || [],
        ingredients: formData.ingredients || [],
        skinTypes: (formData.skinTypes as SkinType[]) || ['All'],
        skinConcerns: (formData.skinConcerns as SkinConcern[]) || ['Dryness & Dehydration'],
        size: formData.size || '50ml',
        stockQuantity: Number(formData.stockQuantity) || 50,
        totalStock: Number(formData.stockQuantity) || 50,
        stockByLocation: [
          { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: Math.floor((formData.stockQuantity || 50) * 0.4) },
          { locationId: 'store-2', locationName: 'Avolab Green Beauty Mall', locationType: 'STORE', quantity: Math.floor((formData.stockQuantity || 50) * 0.3) },
          { locationId: 'wh-1', locationName: 'Avolab Central Logistics Warehouse', locationType: 'WAREHOUSE', quantity: Math.floor((formData.stockQuantity || 50) * 0.3) }
        ],
        rating: 4.9,
        reviewsCount: 1,
        reviews: [],
        isVegan: formData.isVegan ?? true,
        isFeatured: formData.isFeatured ?? false,
        tags: formData.tags || ['Clean Beauty']
      });
    }

    setIsCreateModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1C2E20]">Product Catalog Management</h1>
          <p className="text-xs text-stone-500">Create, edit, price, and synchronize cosmetics with live customer storefront.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#2E4A32] text-amber-100 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1C2E20] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-700 focus:outline-none"
          >
            <option value="ALL">All Stock Statuses</option>
            <option value="FEATURED">Featured Hero Products</option>
            <option value="LOW_STOCK">Low Stock (&lt; 20 units)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-600 text-[11px] font-bold uppercase tracking-wider border-b border-stone-200">
                <th className="p-4">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={getAVOLABProductImageFor(p)} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-stone-200" />
                    <div>
                      <p className="font-bold text-stone-900">{p.name}</p>
                      <p className="text-[10px] text-stone-500">{p.size} {p.isVegan ? '• 100% Vegan' : ''}</p>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[11px] font-bold text-stone-600">{p.sku}</td>
                  <td className="p-4">
                    <span className="bg-stone-100 text-stone-700 text-[11px] font-medium px-2 py-1 rounded-md">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-stone-900">${p.price}</span>
                    {p.discountPrice && <span className="text-[10px] text-red-600 ml-1.5 line-through">${p.discountPrice}</span>}
                  </td>
                  <td className="p-4">
                    <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${p.stockQuantity < 20 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
                      {p.stockQuantity} units
                    </span>
                  </td>
                  <td className="p-4">
                    {p.isFeatured ? (
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 w-max">
                        <Sparkles size={10} /> Featured Hero
                      </span>
                    ) : (
                      <span className="bg-stone-100 text-stone-600 text-[10px] px-2 py-0.5 rounded">Active Catalog</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      title="Edit Product"
                      className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDuplicate(p)}
                      title="Duplicate Product"
                      className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      title="Archive Product"
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-500 italic">
                    No products matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full p-6 rounded-3xl space-y-4 text-center shadow-2xl">
            <Archive size={32} className="mx-auto text-amber-600" />
            <h3 className="font-serif text-lg font-bold text-stone-900">Archive Product?</h3>
            <p className="text-xs text-stone-600">
              This product will be archived and hidden from the Customer storefront while preserving historical order logs.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-stone-200 text-stone-700 rounded-xl text-xs font-bold hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700"
              >
                Archive Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Product Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full my-8 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="font-serif text-xl font-bold text-[#1C2E20]">
                {editingProduct ? 'Edit Product Details' : 'Create New Product'}
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku || ''}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={formData.category || 'Serums & Treatments'}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price || ''}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stockQuantity || 0}
                    onChange={e => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Size / Net Wt.</label>
                  <input
                    type="text"
                    value={formData.size || ''}
                    onChange={e => setFormData({ ...formData, size: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Main Image URL</label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-600"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured || false}
                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>Feature on Hero Carousel</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.isVegan ?? true}
                    onChange={e => setFormData({ ...formData, isVegan: e.target.checked })}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>100% Vegan & Cruelty-Free</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 border border-stone-200 text-stone-700 rounded-xl font-bold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2E4A32] text-amber-100 rounded-xl font-bold hover:bg-[#1C2E20] shadow-md"
                >
                  Save Product Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

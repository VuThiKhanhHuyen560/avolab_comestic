import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Edit2, Trash2, Search, CheckCircle2, Sparkles, X } from 'lucide-react';
import { Product, SkinType, SkinConcern } from '../../types';
import { getAVOLABProductImageFor } from '../../utils/productImages';

export const AdminCatalogManager: React.FC = () => {
  const { products, addProduct, updateProduct, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: '',
    category: 'Cleanser',
    price: 32,
    discountPrice: 28,
    sku: 'AVO-NEW-101',
    size: '150ml',
    description: 'Nourishing vegan formulation rich in avocado lipids and botanical extracts.',
    isFeatured: true,
    isVegan: true,
    totalStock: 150
  });

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category: 'Cleanser',
      price: 32,
      discountPrice: 28,
      sku: `AVO-SKU-${Date.now().toString().slice(-4)}`,
      size: '150ml',
      description: 'Nourishing vegan formulation rich in avocado lipids and botanical extracts.',
      isFeatured: true,
      isVegan: true,
      totalStock: 150
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      discountPrice: p.discountPrice || p.price,
      sku: p.sku,
      size: p.size,
      description: p.description,
      isFeatured: p.isFeatured,
      isVegan: p.isVegan,
      totalStock: p.totalStock ?? p.stockQuantity
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        size: form.size,
        description: form.description,
        isFeatured: form.isFeatured,
        isVegan: form.isVegan,
        stockQuantity: Number(form.totalStock),
        totalStock: Number(form.totalStock)
      });
      showToast(`Updated catalog product ${form.name}`);
    } else {
      addProduct({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600',
        rating: 4.9,
        reviewsCount: 12,
        sku: form.sku,
        size: form.size,
        description: form.description,
        skinTypes: ['Sensitive', 'Dry', 'Combination'],
        skinConcerns: ['Redness & Irritation', 'Dryness & Dehydration'],
        ingredients: ['Cold-Pressed Avocado Oil', 'Hyaluronic Acid', 'Centella Asiatica'],
        benefits: ['Moisturizes barrier', 'Calms redness'],
        isFeatured: form.isFeatured,
        isVegan: form.isVegan,
        stockQuantity: Number(form.totalStock),
        totalStock: Number(form.totalStock),
        stockByLocation: [
          { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 50 },
          { locationId: 'store-2', locationName: 'Avolab Galleria Center', locationType: 'STORE', quantity: 40 },
          { locationId: 'wh-1', locationName: 'Central Fulfillment Hub', locationType: 'WAREHOUSE', quantity: 60 }
        ]
      });
      showToast(`Added new product ${form.name} to catalog`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="border-b border-stone-200 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1C2E20]">Master Catalog & Formulation Manager</h1>
          <p className="text-xs text-stone-500 mt-0.5">Manage products, pricing tiers, vegan attributes, and total warehouse inventory allocations.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#2E4A32] text-amber-100 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#1C2E20] flex items-center gap-2 shadow"
        >
          <Plus size={16} /> Add New Formulation
        </button>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search product catalog..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#2E4A32]"
        />
        <Search size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <table className="w-full text-xs text-left">
          <thead className="bg-[#FAF8F5] border-b border-stone-200 text-stone-600 font-semibold">
            <tr>
              <th className="p-4">Product Formulation</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price / Discount</th>
              <th className="p-4">Total Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-stone-50/80">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={getAVOLABProductImageFor(p)} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-stone-900">{p.name}</p>
                      <p className="text-[10px] text-stone-400">{p.size} • {p.isVegan ? '100% Vegan' : ''}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-mono text-stone-600">{p.sku}</td>
                <td className="p-4 text-stone-600">{p.category}</td>
                <td className="p-4 font-bold text-[#1C2E20]">
                  ${p.discountPrice || p.price}
                  {p.discountPrice && <span className="text-stone-400 line-through text-[10px] ml-1.5">${p.price}</span>}
                </td>
                <td className="p-4 font-bold text-stone-800">{p.totalStock ?? p.stockQuantity} Units</td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-2 text-stone-600 hover:text-[#2E4A32] rounded-lg hover:bg-stone-100"
                  >
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative text-stone-800">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X size={18} />
            </button>

            <h3 className="font-serif text-xl font-bold text-[#1C2E20] mb-4">
              {editingProduct ? 'Edit Product Formulation' : 'Create New Product Formulation'}
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-500 font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-500 font-medium mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                  >
                    <option value="Cleanser">Cleanser</option>
                    <option value="Serum">Serum</option>
                    <option value="Moisturizer">Moisturizer</option>
                    <option value="Mask">Mask</option>
                    <option value="Sunscreen">Sunscreen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-500 font-medium mb-1">Size</label>
                  <input
                    type="text"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-500 font-medium mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-stone-500 font-medium mb-1">Promo Discount Price ($)</label>
                  <input
                    type="number"
                    value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-500 font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-white border border-stone-200 rounded-xl p-2 text-stone-800"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2E4A32] text-amber-100 px-6 py-2 rounded-xl font-bold hover:bg-[#1C2E20]"
                >
                  Save Formulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, Tags, Image as ImageIcon, Check, X, Search } from 'lucide-react';
import { normalizeAVOLABImage } from '../../utils/productImages';

export const AdminCategoryManager: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    displayOrder: 1,
    status: 'ACTIVE'
  });

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '/images/avolab_barrier_care_1786551116568.jpg',
      displayOrder: categories.length + 1,
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setFormData({ ...c });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');

    if (editingCategory) {
      updateCategory(editingCategory.id, { ...formData, slug });
    } else {
      addCategory({
        name: formData.name,
        slug,
        description: formData.description || '',
        image: formData.image || '/images/avolab_cleanser_tube_1786632315682.jpg',
        displayOrder: Number(formData.displayOrder) || categories.length + 1,
        status: (formData.status as any) || 'ACTIVE'
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1C2E20]">Category Taxonomy Management</h1>
          <p className="text-xs text-stone-500">Organize skincare categories, image banners, and storefront navigation structures.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="bg-[#2E4A32] text-amber-100 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1C2E20] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Create New Category
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-700"
          />
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map(cat => {
          const count = products.filter(p => p.category.toLowerCase().includes(cat.name.toLowerCase())).length;
          return (
            <div key={cat.id} className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="relative h-36 bg-stone-100 overflow-hidden">
                  <img src={normalizeAVOLABImage(cat.image)} alt={cat.name} className="w-full h-full object-cover" />
                  <span className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${cat.status === 'ACTIVE' ? 'bg-emerald-800 text-amber-100' : 'bg-stone-300 text-stone-700'}`}>
                    {cat.status}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-[#1C2E20]">{cat.name}</h3>
                    <span className="bg-amber-100 text-amber-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      {count} items
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 line-clamp-2">{cat.description}</p>
                  <p className="text-[10px] font-mono text-stone-400">Slug: /{cat.slug} • Order #{cat.displayOrder}</p>
                </div>
              </div>

              <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="text-xs text-stone-700 font-bold hover:text-emerald-800 flex items-center gap-1"
                >
                  <Edit2 size={14} /> Edit Category
                </button>

                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-xs text-red-600 font-bold hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 size={14} /> Archive
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-serif text-xl font-bold text-[#1C2E20]">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Slug URL</label>
                <input
                  type="text"
                  placeholder="auto-generated-slug"
                  value={formData.slug || ''}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Image URL</label>
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
                  rows={2}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Display Order #</label>
                  <input
                    type="number"
                    value={formData.displayOrder || 1}
                    onChange={e => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Status</label>
                  <select
                    value={formData.status || 'ACTIVE'}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#2E4A32] text-amber-100 rounded-xl font-bold hover:bg-[#1C2E20]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

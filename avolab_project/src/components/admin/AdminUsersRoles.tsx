import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import { ShieldCheck, Plus, Edit2, Check, X, Search, Lock, UserCheck } from 'lucide-react';

export const AdminUsersRoles: React.FC = () => {
  const { users, addUser, updateUser, toggleUserStatus } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    password: 'password123',
    role: 'STAFF',
    phone: '+1 (555) 019-2831'
  });

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    addUser({
      name: formData.name,
      email: formData.email.toLowerCase(),
      password: formData.password || 'password123',
      role: (formData.role as UserRole) || 'STAFF',
      phone: formData.phone || '+1 (555) 012-3456',
      skinType: 'Sensitive',
      skinConcerns: ['General Skincare'],
      loyaltyPoints: 100,
      loyaltyTier: 'Seedling',
      joinedDate: new Date().toISOString().split('T')[0]
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1C2E20]">Users & Access Permissions Matrix</h1>
          <p className="text-xs text-stone-500">Manage internal staff accounts, role governance (Customer, Staff, Admin), and operational privileges.</p>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: '',
              email: '',
              password: 'password123',
              role: 'STAFF',
              phone: '+1 (555) 019-2831'
            });
            setIsModalOpen(true);
          }}
          className="bg-[#2E4A32] text-amber-100 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1C2E20] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Create Staff / Admin User
        </button>
      </div>

      {/* Users Directory Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-4 border-b border-stone-200 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search user account by name or email..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700 border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-600 font-bold uppercase text-[10px]">
                <th className="p-4">User Account</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role Badge</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Role Governance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-stone-50">
                  <td className="p-4 font-bold text-stone-900 flex items-center gap-3">
                    <img
                      src={u.avatar || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231C2E20'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23E2DAD0' font-family='sans-serif' font-size='36' font-weight='bold'>AV</text></svg>"}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{u.name}</span>
                  </td>
                  <td className="p-4 text-stone-600">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      u.role === 'ADMIN' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      u.role === 'STAFF' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                      'bg-stone-100 text-stone-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-stone-600">{u.phone || 'N/A'}</td>
                  <td className="p-4">
                    <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => updateUser(u.id, { role: u.role === 'STAFF' ? 'ADMIN' : 'STAFF' })}
                      className="text-stone-700 hover:text-emerald-800 font-bold text-xs"
                    >
                      Toggle Role ({u.role === 'STAFF' ? 'Promote to Admin' : 'Demote to Staff'})
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#1C2E20]">System Role Permissions Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100 font-bold text-stone-600 uppercase text-[10px]">
                <th className="p-3">Module Privilege</th>
                <th className="p-3 text-center">Customer</th>
                <th className="p-3 text-center">Staff Associate</th>
                <th className="p-3 text-center">System Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              <tr>
                <td className="p-3 font-bold">Storefront Shopping & Checkout</td>
                <td className="p-3 text-center text-emerald-700"><Check size={16} className="mx-auto" /></td>
                <td className="p-3 text-center text-emerald-700"><Check size={16} className="mx-auto" /></td>
                <td className="p-3 text-center text-emerald-700"><Check size={16} className="mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-3 font-bold">BOPIS Store Order Pickup Verification</td>
                <td className="p-3 text-center text-stone-300"><X size={16} className="mx-auto" /></td>
                <td className="p-3 text-center text-emerald-700"><Check size={16} className="mx-auto" /></td>
                <td className="p-3 text-center text-emerald-700"><Check size={16} className="mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-3 font-bold">Catalog & Price Override</td>
                <td className="p-3 text-center text-stone-300"><X size={16} className="mx-auto" /></td>
                <td className="p-3 text-center text-stone-300"><X size={16} className="mx-auto" /></td>
                <td className="p-3 text-center text-emerald-700"><Check size={16} className="mx-auto" /></td>
              </tr>
              <tr>
                <td className="p-3 font-bold">Global System Settings & Audit Logs</td>
                <td className="p-3 text-center text-stone-300"><X size={16} className="mx-auto" /></td>
                <td className="p-3 text-center text-stone-300"><X size={16} className="mx-auto" /></td>
                <td className="p-3 text-center text-emerald-700"><Check size={16} className="mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* User Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="font-serif text-xl font-bold text-[#1C2E20]">Create User Account</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Initial Password</label>
                <input
                  type="text"
                  value={formData.password || 'password123'}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Role Permission</label>
                <select
                  value={formData.role || 'STAFF'}
                  onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2"
                >
                  <option value="STAFF">STAFF (Store Associate / Fulfillment)</option>
                  <option value="ADMIN">ADMINISTRATOR (Full Access)</option>
                  <option value="CUSTOMER">CUSTOMER</option>
                </select>
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
                  Save User Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

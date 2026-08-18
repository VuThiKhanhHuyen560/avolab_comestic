import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Download, Printer, Calendar, Filter, DollarSign, ShoppingBag, Users, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { getAVOLABProductImageFor } from '../../utils/productImages';

export const AdminReportsBI: React.FC = () => {
  const { orders, products, users, showToast } = useApp();
  const [reportType, setReportType] = useState<'SALES' | 'PRODUCTS' | 'CUSTOMERS' | 'INVENTORY'>('SALES');
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | 'YTD'>('30D');

  const categoryPieData = [
    { name: 'Serums & Oils', value: 42, color: '#2E4A32' },
    { name: 'Cleansers', value: 25, color: '#4E7A54' },
    { name: 'Moisturizers', value: 20, color: '#D97706' },
    { name: 'Eye & Sun', value: 13, color: '#A3B18A' },
  ];

  const handleExportCSV = () => {
    showToast(`Exported ${reportType} report CSV file to downloads.`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1C2E20]">Business Intelligence & Financial Reports</h1>
          <p className="text-xs text-stone-500">Omnichannel sales reports, product performance metrics, customer cohorts, and inventory valuation.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="bg-stone-100 text-stone-800 hover:bg-stone-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="bg-[#2E4A32] text-amber-100 hover:bg-[#1C2E20] px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer size={14} /> Print Report
          </button>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setReportType('SALES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${reportType === 'SALES' ? 'bg-[#2E4A32] text-amber-100 shadow-sm' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'}`}
        >
          Sales & Revenue BI
        </button>
        <button
          onClick={() => setReportType('PRODUCTS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${reportType === 'PRODUCTS' ? 'bg-[#2E4A32] text-amber-100 shadow-sm' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'}`}
        >
          Product Performance
        </button>
        <button
          onClick={() => setReportType('CUSTOMERS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${reportType === 'CUSTOMERS' ? 'bg-[#2E4A32] text-amber-100 shadow-sm' : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'}`}
        >
          Customer Retention
        </button>
      </div>

      {/* Main Report Workspace */}
      {reportType === 'SALES' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#1C2E20]">Sales Revenue by Product Category</h3>
              <div className="h-64 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryPieData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFECE6" />
                    <XAxis dataKey="name" stroke="#888" tickLine={false} />
                    <YAxis stroke="#888" tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2E4A32" radius={[8, 8, 0, 0]} name="Share %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
              <h3 className="font-serif text-lg font-bold text-[#1C2E20]">Category Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70}>
                      {categoryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1 text-xs">
                {categoryPieData.map(c => (
                  <div key={c.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-stone-700">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} /> {c.name}
                    </span>
                    <span className="font-bold text-stone-900">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'PRODUCTS' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-200 font-serif text-lg font-bold text-[#1C2E20]">
            Product Catalog Performance Ranking
          </div>
          <table className="w-full text-left text-xs text-stone-700 border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-600 font-bold uppercase text-[10px]">
                <th className="p-4">Rank</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Stock Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((p, idx) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="p-4 font-mono font-bold text-stone-500">#{idx + 1}</td>
                  <td className="p-4 font-bold text-stone-900 flex items-center gap-2">
                    <img src={getAVOLABProductImageFor(p)} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                    <span>{p.name}</span>
                  </td>
                  <td className="p-4">{p.category}</td>
                  <td className="p-4 font-bold">${p.price}</td>
                  <td className="p-4 font-bold text-amber-800">★ {p.rating}</td>
                  <td className="p-4 font-mono font-bold">{p.stockQuantity} units</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reportType === 'CUSTOMERS' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#1C2E20]">Customer Loyalty & Retention Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
              <p className="text-stone-500 font-bold">Repeat Purchase Rate</p>
              <p className="font-serif text-2xl font-bold text-emerald-800">48.2%</p>
              <p className="text-[10px] text-stone-400">Target: &gt; 40%</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
              <p className="text-stone-500 font-bold">Active Loyalty Members</p>
              <p className="font-serif text-2xl font-bold text-[#1C2E20]">1,240</p>
              <p className="text-[10px] text-stone-400">Seedling, Bloom & Radiance</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
              <p className="text-stone-500 font-bold">Customer Acquisition Cost (CAC)</p>
              <p className="font-serif text-2xl font-bold text-[#1C2E20]">$12.40</p>
              <p className="text-[10px] text-emerald-700 font-semibold">LTV:CAC Ratio = 12.8x</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContentBanner, FAQItem, BeautyArticle } from '../../types';
import { FileText, Image as ImageIcon, HelpCircle, BookOpen, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

export const AdminContentManager: React.FC = () => {
  const { banners, faqs, articles, addBanner, updateBanner, deleteBanner, addFAQ, deleteFAQ, addArticle, deleteArticle } = useApp();
  const [activeTab, setActiveTab] = useState<'BANNERS' | 'FAQS' | 'ARTICLES'>('BANNERS');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#1C2E20]">CMS & Content Marketing Manager</h1>
          <p className="text-xs text-stone-500">Manage hero carousel banners, customer FAQ knowledgebase, and editorial beauty journal articles.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('BANNERS')}
          className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'BANNERS' ? 'border-[#2E4A32] text-[#1C2E20]' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Homepage Banners ({banners.length})
        </button>
        <button
          onClick={() => setActiveTab('FAQS')}
          className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'FAQS' ? 'border-[#2E4A32] text-[#1C2E20]' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Knowledgebase FAQs ({faqs.length})
        </button>
        <button
          onClick={() => setActiveTab('ARTICLES')}
          className={`pb-3 px-2 border-b-2 transition-colors ${activeTab === 'ARTICLES' ? 'border-[#2E4A32] text-[#1C2E20]' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
        >
          Beauty Journal Articles ({articles.length})
        </button>
      </div>

      {/* Banners */}
      {activeTab === 'BANNERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map(b => (
            <div key={b.id} className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <img src={b.imageUrl} alt={b.title} className="w-full h-44 object-cover" />
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
                      {b.position}
                    </span>
                    <button
                      onClick={() => updateBanner(b.id, { isActive: !b.isActive })}
                      className="text-xs font-bold"
                    >
                      {b.isActive ? <span className="text-emerald-700 font-bold">● Active</span> : <span className="text-stone-400">● Hidden</span>}
                    </button>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1C2E20]">{b.title}</h3>
                  <p className="text-xs text-stone-600">{b.subtitle}</p>
                  <p className="text-[10px] font-mono text-stone-400">Target Link: {b.targetUrl}</p>
                </div>
              </div>

              <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end">
                <button
                  onClick={() => deleteBanner(b.id)}
                  className="text-xs text-red-600 font-bold hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 size={14} /> Remove Banner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQs */}
      {activeTab === 'FAQS' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 space-y-4">
          <div className="space-y-4 divide-y divide-stone-100">
            {faqs.map(faq => (
              <div key={faq.id} className="pt-4 first:pt-0 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="bg-stone-100 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{faq.category}</span>
                  <h4 className="font-bold text-stone-900 text-sm">{faq.question}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{faq.answer}</p>
                </div>
                <button
                  onClick={() => deleteFAQ(faq.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Articles */}
      {activeTab === 'ARTICLES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(art => (
            <div key={art.id} className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div>
                <img src={art.coverImage} alt={art.title} className="w-full h-40 object-cover" />
                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold text-stone-400">
                    <span>{art.category}</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#1C2E20] line-clamp-1">{art.title}</h3>
                  <p className="text-xs text-stone-600 line-clamp-2">{art.excerpt}</p>
                </div>
              </div>

              <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-xs">
                <span className="text-stone-500 italic">By {art.author}</span>
                <button
                  onClick={() => deleteArticle(art.id)}
                  className="text-red-600 font-bold hover:text-red-800"
                >
                  Delete Article
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

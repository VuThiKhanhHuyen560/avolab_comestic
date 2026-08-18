import React from 'react';
import { useApp } from '../../context/AppContext';
import { RefreshCw, CheckCircle2, PauseCircle, Trash2, Calendar, ShieldCheck } from 'lucide-react';
import { getAVOLABProductImageFor, normalizeAVOLABImage } from '../../utils/productImages';

export const SubscriptionManager: React.FC = () => {
  const { subscriptions, products, cancelSubscription, updateSubscriptionInterval, showToast } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-stone-200 pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#1C2E20]">Auto-Refill Skincare Subscriptions</h1>
        <p className="text-xs text-stone-500 mt-1">Never run out of your essential vegan barrier formulas. Save 10% on recurring automated deliveries.</p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-3">
          <RefreshCw size={36} className="text-stone-300 mx-auto" />
          <p className="text-sm font-semibold text-stone-800">You have no active auto-refill subscriptions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subscriptions.map(sub => {
            const product = products.find(p => p.id === sub.productId);

            return (
              <div key={sub.id} className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
                
                <div className="flex items-center gap-3">
                  <img src={getAVOLABProductImageFor(product || { name: sub.productName, image: sub.productImage })} alt={sub.productName} className="w-16 h-16 rounded-2xl object-cover bg-stone-100" />
                  <div className="flex-1 min-w-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sub.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {sub.status}
                    </span>
                    <h3 className="font-bold text-sm text-stone-900 truncate mt-1">{sub.productName}</h3>
                    <p className="text-xs text-[#2E4A32] font-semibold">${sub.price.toFixed(2)} / delivery</p>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200/80 text-xs space-y-2">
                  <div className="flex justify-between items-center text-stone-600">
                    <span className="flex items-center gap-1"><Calendar size={14} /> Next Delivery Date:</span>
                    <span className="font-bold text-stone-900">{sub.nextDeliveryDate}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-stone-600">Refill Interval:</span>
                    <select
                      value={sub.intervalDays}
                      onChange={(e) => {
                        updateSubscriptionInterval(sub.id, parseInt(e.target.value));
                        showToast(`Updated refill frequency to every ${e.target.value} days`);
                      }}
                      className="bg-white border border-stone-200 rounded-lg p-1 text-xs font-semibold text-stone-800"
                    >
                      <option value={30}>Every 30 Days</option>
                      <option value={60}>Every 60 Days</option>
                      <option value={90}>Every 90 Days</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      cancelSubscription(sub.id);
                      showToast('Subscription cancelled.');
                    }}
                    className="w-full bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={14} /> Cancel Subscription
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

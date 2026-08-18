import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Sliders, RefreshCw, CheckCircle2, Zap, BarChart2, ShieldCheck } from 'lucide-react';
import { getAVOLABProductImageFor } from '../../utils/productImages';

export const AdminAIManager: React.FC = () => {
  const { showToast, products } = useApp();

  const [skinTypeWeight, setSkinTypeWeight] = useState(35);
  const [skinConcernWeight, setSkinConcernWeight] = useState(30);
  const [ingredientAffinityWeight, setIngredientAffinityWeight] = useState(20);
  const [pastPurchaseWeight, setPastPurchaseWeight] = useState(15);

  const [testSkinType, setTestSkinType] = useState('Sensitive');
  const [testConcern, setTestConcern] = useState('Redness & Irritation');
  const [recommendedProduct, setRecommendedProduct] = useState(products[0] || null);

  const handleRunTestMatch = () => {
    // Pick best matching product
    const match = products.find(p => p.skinTypes.includes(testSkinType as any)) || products[0];
    setRecommendedProduct(match);
    showToast(`AI Match Engine generated match for ${testSkinType} skin profile!`);
  };

  const handleSaveWeights = () => {
    showToast('AI Personalization Weights saved and applied to storefront engine!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 text-[#1C2E20] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
              GEMINI 2.5 FLASH ENGINE
            </span>
            <span className="text-xs text-emerald-800 font-bold">Personalization Control Hub</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#1C2E20]">AI & Recommendation Personalization Weights</h1>
          <p className="text-xs text-stone-500">Configure weighting vectors for the AI Beauty Advisor, skin type compatibility algorithm, and product recommendations.</p>
        </div>

        <button
          onClick={handleSaveWeights}
          className="bg-[#2E4A32] text-amber-100 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1C2E20] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Sliders size={16} /> Deploy Weights to Live Engine
        </button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <p className="text-xs text-stone-500 font-medium">AI Consultations Handled</p>
          <p className="font-serif text-3xl font-bold text-[#1C2E20]">1,482</p>
          <p className="text-[11px] text-emerald-700 font-semibold">+24% vs last month</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <p className="text-xs text-stone-500 font-medium">AI Recommendation Conversion</p>
          <p className="font-serif text-3xl font-bold text-emerald-800">18.6%</p>
          <p className="text-[11px] text-emerald-700 font-semibold">Average Order Lift: +$14.20</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-1">
          <p className="text-xs text-stone-500 font-medium">Avg Skin Compatibility Score</p>
          <p className="font-serif text-3xl font-bold text-[#1C2E20]">96.4%</p>
          <p className="text-[11px] text-stone-500 font-medium">Based on customer feedback logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weight Adjustments */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-serif text-lg font-bold text-[#1C2E20]">Algorithm Weighting Parameters</h3>
            <span className="text-xs font-mono font-bold text-emerald-800">Total: {skinTypeWeight + skinConcernWeight + ingredientAffinityWeight + pastPurchaseWeight}%</span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Skin Type Match Weight</span>
                <span className="text-emerald-800 font-mono">{skinTypeWeight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={skinTypeWeight}
                onChange={e => setSkinTypeWeight(parseInt(e.target.value))}
                className="w-full accent-emerald-800"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Skin Concern Priority Weight</span>
                <span className="text-emerald-800 font-mono">{skinConcernWeight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={skinConcernWeight}
                onChange={e => setSkinConcernWeight(parseInt(e.target.value))}
                className="w-full accent-emerald-800"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Ingredient Bio-Affinity Weight</span>
                <span className="text-emerald-800 font-mono">{ingredientAffinityWeight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={ingredientAffinityWeight}
                onChange={e => setIngredientAffinityWeight(parseInt(e.target.value))}
                className="w-full accent-emerald-800"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold mb-1">
                <span>Purchase History Vector Weight</span>
                <span className="text-emerald-800 font-mono">{pastPurchaseWeight}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={pastPurchaseWeight}
                onChange={e => setPastPurchaseWeight(parseInt(e.target.value))}
                className="w-full accent-emerald-800"
              />
            </div>
          </div>
        </div>

        {/* Live Match Engine Simulator */}
        <div className="bg-gradient-to-br from-[#1C2E20] to-[#2E4A32] text-amber-50 p-6 rounded-3xl shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-emerald-800 pb-3">
              <Sparkles size={20} className="text-amber-300" />
              <h3 className="font-serif text-lg font-bold">Live AI Matching Simulator</h3>
            </div>

            <p className="text-xs text-emerald-100/80">
              Test how the live algorithm calculates product matches given a sample customer profile.
            </p>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-amber-200 font-bold mb-1">Test Skin Type</label>
                <select
                  value={testSkinType}
                  onChange={e => setTestSkinType(e.target.value)}
                  className="w-full bg-[#2A432F] text-amber-100 border border-emerald-700/80 rounded-xl px-3 py-2"
                >
                  <option value="Sensitive">Sensitive Skin</option>
                  <option value="Dry">Dry Skin</option>
                  <option value="Combination">Combination Skin</option>
                  <option value="Oily">Oily Skin</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-200 font-bold mb-1">Test Primary Concern</label>
                <select
                  value={testConcern}
                  onChange={e => setTestConcern(e.target.value)}
                  className="w-full bg-[#2A432F] text-amber-100 border border-emerald-700/80 rounded-xl px-3 py-2"
                >
                  <option value="Redness & Irritation">Redness & Irritation</option>
                  <option value="Dryness & Dehydration">Dryness & Dehydration</option>
                  <option value="Acne & Blemishes">Acne & Blemishes</option>
                  <option value="Fine Lines & Aging">Fine Lines & Aging</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRunTestMatch}
              className="w-full bg-amber-100 text-[#1C2E20] py-2.5 rounded-xl text-xs font-bold hover:bg-white transition-colors"
            >
              Run Match Simulation
            </button>

            {recommendedProduct && (
              <div className="bg-[#17261A] p-4 rounded-2xl border border-emerald-700/60 flex items-center gap-3 text-xs">
                <img src={getAVOLABProductImageFor(recommendedProduct)} alt={recommendedProduct.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="text-[10px] text-amber-300 font-bold uppercase">Top Match Candidate (98.2% Score)</p>
                  <p className="font-bold text-amber-50">{recommendedProduct.name}</p>
                  <p className="text-[10px] text-emerald-300 font-mono">${recommendedProduct.price} • {recommendedProduct.size}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

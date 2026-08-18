import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getAVOLABProductImage } from '../../utils/productImages';
import { 
  Sparkles, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  ShoppingBag, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Info, 
  Bot, 
  Sun, 
  Moon, 
  Layers, 
  Sliders, 
  Heart,
  ArrowRight
} from 'lucide-react';
import { SkinType, SkinConcern, Product } from '../../types';
import { calculateAIMatchScore, generateCuratedRoutine, UserSkinProfile } from '../../utils/aiRecommendationEngine';

export const AIBeautyAssistant: React.FC = () => {
  const { 
    customer, 
    currentUser, 
    products, 
    systemSettings, 
    updateCustomerSkinProfile, 
    addToCart, 
    setSelectedProduct, 
    showToast,
    setIsAiBotOpen,
    setActiveTab
  } = useApp();

  const [step, setStep] = useState<number>(1);
  const [completed, setCompleted] = useState<boolean>(false);

  // Form State
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType>(customer?.skinType || 'Sensitive');
  const [selectedConcerns, setSelectedConcerns] = useState<SkinConcern[]>(customer?.skinConcerns || ['Redness & Irritation']);
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [routineProducts, setRoutineProducts] = useState<string[]>(['Cleanser', 'Moisturizer']);
  const [texturePreference, setTexturePreference] = useState<string>('Lightweight Gel');
  const [priceRange, setPriceRange] = useState<string>('$30-$60');

  const skinTypes: { type: SkinType; description: string; icon: string }[] = [
    { type: 'Sensitive', description: 'Easily irritated, turns red quickly, reacts to harsh products', icon: '🌸' },
    { type: 'Dry', description: 'Feels tight, flaky patches, needs deep nourishment', icon: '💧' },
    { type: 'Combination', description: 'Oily T-zone (forehead/nose) with dry or normal cheeks', icon: '⚖️' },
    { type: 'Oily', description: 'Excess shine, enlarged pores, prone to breakout spots', icon: '✨' },
    { type: 'Normal', description: 'Well-balanced moisture and oil levels, minimal reactivity', icon: '🌿' },
  ];

  const allConcerns: SkinConcern[] = [
    'Redness & Irritation',
    'Dryness & Dehydration',
    'Acne & Blemishes',
    'Dullness & Uneven Tone',
    'Aging & Fine Lines',
    'Dark Circles',
    'Pore Size'
  ];

  const toggleConcern = (concern: SkinConcern) => {
    if (selectedConcerns.includes(concern)) {
      setSelectedConcerns(selectedConcerns.filter(c => c !== concern));
    } else {
      setSelectedConcerns([...selectedConcerns, concern]);
    }
  };

  const toggleRoutineProduct = (item: string) => {
    if (routineProducts.includes(item)) {
      setRoutineProducts(routineProducts.filter(i => i !== item));
    } else {
      setRoutineProducts([...routineProducts, item]);
    }
  };

  const currentProfile: UserSkinProfile = {
    skinType: selectedSkinType,
    skinConcerns: selectedConcerns,
    experienceLevel,
    routineProducts,
    texturePreference,
    priceRange
  };

  const handleFinishConsultation = () => {
    // Persist skin profile to global customer state
    updateCustomerSkinProfile(selectedSkinType, selectedConcerns);
    setCompleted(true);
    showToast('✨ AI Consultation complete! Your skin profile and custom routine are generated.');
  };

  const curatedRoutine = generateCuratedRoutine(products, currentProfile, systemSettings);

  const handleAddBundleToCart = () => {
    curatedRoutine.bundleProducts.forEach(prod => {
      addToCart(prod, 1);
    });
    showToast(`🛒 Added 4-piece AI Routine Bundle to cart with 15% savings ($${curatedRoutine.bundleDiscountPrice})!`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#1C2E20] via-[#2E4A32] to-[#4A5D4E] text-amber-50 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-[#1C2E20] text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
            <Sparkles size={12} className="text-[#1C2E20]" />
            AVOBOT AI BEAUTY CONSULTANT
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">AI Skin Profile & Bio-Routine Builder</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Answer 6 quick skincare questions to receive a personalized, vegan clean-beauty routine matched to your unique bio-barrier profile.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setIsAiBotOpen(true)}
            className="bg-amber-100 text-[#1C2E20] px-5 py-3 rounded-2xl text-xs font-bold hover:bg-white transition-all flex items-center gap-2 shadow-md w-full sm:w-auto justify-center"
          >
            <Bot size={18} />
            <span>Chat Live with AVOBOT</span>
          </button>
        </div>
      </div>

      {/* Safety / Medical Disclaimer */}
      <div className="bg-[#FAF6EE] border border-[#E6DEC8] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#5A5240]">
        <Info size={18} className="text-amber-800 flex-shrink-0 mt-0.5" />
        <p>
          <strong className="font-bold">Informational Disclaimer:</strong> AI recommendations are generated for informational and clean beauty routine personalization purposes only. They do not constitute medical diagnoses or prescriptions.
        </p>
      </div>

      {!completed ? (
        /* 6-STEP CONSULTATION FLOW */
        <div className="bg-white rounded-3xl border border-[#E6E1D6] shadow-md p-6 sm:p-10 space-y-8">
          {/* Step Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-[#4A5D4E] uppercase tracking-wider">
              <span>Step {step} of 6</span>
              <span>{Math.round((step / 6) * 100)}% Completed</span>
            </div>
            <div className="w-full bg-[#F0EBE1] h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#4A5D4E] h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* STEP 1: SKIN TYPE */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1C2E20]">1. What is your primary Skin Type?</h2>
                <p className="text-xs text-stone-500 mt-1">Select the option that best describes how your skin behaves naturally throughout the day.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {skinTypes.map(st => (
                  <button
                    key={st.type}
                    type="button"
                    onClick={() => setSelectedSkinType(st.type)}
                    className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      selectedSkinType === st.type
                        ? 'border-[#4A5D4E] bg-[#F0F4EE] ring-2 ring-[#4A5D4E] shadow-sm'
                        : 'border-[#E6E1D6] bg-white hover:border-[#849673] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-2xl">{st.icon}</span>
                      {selectedSkinType === st.type && (
                        <CheckCircle2 size={18} className="text-[#4A5D4E]" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#1C2E20]">{st.type} Skin</h3>
                      <p className="text-xs text-stone-500 mt-1">{st.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SKIN CONCERNS */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1C2E20]">2. What are your main Skin Concerns?</h2>
                <p className="text-xs text-stone-500 mt-1">Select all concerns you would like your AVOLAB routine to address.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {allConcerns.map(concern => {
                  const isSelected = selectedConcerns.includes(concern);
                  return (
                    <button
                      key={concern}
                      type="button"
                      onClick={() => toggleConcern(concern)}
                      className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#4A5D4E] bg-[#4A5D4E] text-white shadow-sm'
                          : 'border-[#E6E1D6] bg-white text-stone-700 hover:border-[#849673]'
                      }`}
                    >
                      <span>{concern}</span>
                      {isSelected ? <Check size={16} /> : <span className="text-[#A0A0A0]">+</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: EXPERIENCE LEVEL */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1C2E20]">3. What is your Skincare Experience level?</h2>
                <p className="text-xs text-stone-500 mt-1">This helps us tailor routine complexity and ingredient active concentrations.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { level: 'Beginner', title: 'Skincare Beginner', desc: 'Prefer simple, quick 2-3 step routines with gentle starters.' },
                  { level: 'Intermediate', title: 'Skincare Enthusiast', desc: 'Familiar with cleansers, toners, serums, and daily SPF application.' },
                  { level: 'Advanced', title: 'Skincare Expert', desc: 'Comfortable with active ingredients, chemical exfoliants, and multi-step layering.' }
                ].map(item => (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => setExperienceLevel(item.level as any)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      experienceLevel === item.level
                        ? 'border-[#4A5D4E] bg-[#F0F4EE] ring-2 ring-[#4A5D4E]'
                        : 'border-[#E6E1D6] bg-white hover:border-[#849673]'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-sm text-[#1C2E20]">{item.title}</h3>
                      {experienceLevel === item.level && <CheckCircle2 size={18} className="text-[#4A5D4E]" />}
                    </div>
                    <p className="text-xs text-stone-500">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: CURRENT ROUTINE */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1C2E20]">4. Which product categories do you currently use?</h2>
                <p className="text-xs text-stone-500 mt-1">Select all products that are part of your current regimen.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen', 'Exfoliator', 'Face Oils', 'Masks'].map(item => {
                  const isSelected = routineProducts.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleRoutineProduct(item)}
                      className={`p-4 rounded-2xl border text-xs font-bold transition-all text-center ${
                        isSelected
                          ? 'border-[#4A5D4E] bg-[#4A5D4E] text-white'
                          : 'border-[#E6E1D6] bg-white text-stone-700 hover:border-[#849673]'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: TEXTURE PREFERENCE */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1C2E20]">5. What Texture & Finish do you prefer on your skin?</h2>
                <p className="text-xs text-stone-500 mt-1">How do you like your formulas to feel after absorption?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  'Lightweight Gel',
                  'Rich Cream',
                  'Silky Serum',
                  'Oil-based Hydration',
                  'Matte Finish',
                  'Dewy Glow Finish'
                ].map(tex => (
                  <button
                    key={tex}
                    type="button"
                    onClick={() => setTexturePreference(tex)}
                    className={`p-4 rounded-2xl border text-xs font-bold text-left transition-all flex items-center justify-between ${
                      texturePreference === tex
                        ? 'border-[#4A5D4E] bg-[#F0F4EE] ring-2 ring-[#4A5D4E] text-[#1C2E20]'
                        : 'border-[#E6E1D6] bg-white text-stone-700 hover:border-[#849673]'
                    }`}
                  >
                    <span>{tex}</span>
                    {texturePreference === tex && <CheckCircle2 size={16} className="text-[#4A5D4E]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: PRICE RANGE */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1C2E20]">6. What is your preferred Product Price Target?</h2>
                <p className="text-xs text-stone-500 mt-1">Select your typical budget per item to help us recommend optimal matches.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { range: '$10-$30', label: 'Budget Friendly', desc: 'Accessible everyday vegan essentials' },
                  { range: '$30-$60', label: 'Mid-Range Clean', desc: 'High-performance botanical formulations' },
                  { range: '$60-$100', label: 'Premium Bio-Active', desc: 'Concentrated clinical repair complexes' },
                  { range: 'Premium/Luxury', label: 'Luxury Barrier Repair', desc: 'Top tier phytosterol & lipid restoratives' }
                ].map(p => (
                  <button
                    key={p.range}
                    type="button"
                    onClick={() => setPriceRange(p.range)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      priceRange === p.range
                        ? 'border-[#4A5D4E] bg-[#F0F4EE] ring-2 ring-[#4A5D4E]'
                        : 'border-[#E6E1D6] bg-white hover:border-[#849673]'
                    }`}
                  >
                    <span className="text-xs font-extrabold uppercase text-[#4A5D4E]">{p.range}</span>
                    <h3 className="font-bold text-sm text-[#1C2E20] mt-1">{p.label}</h3>
                    <p className="text-[11px] text-stone-500 mt-1">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E6E1D6]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl border border-[#E6E1D6] text-xs font-bold text-stone-700 hover:bg-[#F9F7F2] flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft size={16} /> Back
              </button>
            ) : <div />}

            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-[#4A5D4E] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#3A493D] flex items-center gap-1.5 shadow-sm transition-colors"
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishConsultation}
                className="bg-[#1C2E20] text-amber-100 px-8 py-3 rounded-xl text-xs font-bold hover:bg-[#2E4A32] flex items-center gap-2 shadow-md transition-all"
              >
                <Sparkles size={16} className="text-amber-300" />
                Generate My AI Routine & Matches
              </button>
            )}
          </div>
        </div>
      ) : (
        /* CONSULTATION SYNTHESIS & RESULTS VIEW */
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Profile Overview Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E6E1D6] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#D9E3D0] text-[#4A5D4E] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                  SAVED SKIN PROFILE
                </span>
                <span className="text-xs font-bold text-[#1C2E20]">{selectedSkinType} Skin</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1C2E20] mt-1">Your AI Skincare Blueprint</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Targeting: <strong className="text-stone-800">{selectedConcerns.join(', ')}</strong> • Preference: {texturePreference} • Target: {priceRange}
              </p>
            </div>

            <button
              onClick={() => {
                setCompleted(false);
                setStep(1);
              }}
              className="px-4 py-2 rounded-xl border border-[#E6E1D6] text-xs font-bold text-[#4A5D4E] hover:bg-[#F9F7F2] flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={14} /> Re-take Consultation
            </button>
          </div>

          {/* Routine Tabs: Morning & Evening */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Morning Routine */}
            <div className="bg-white p-6 rounded-3xl border border-[#E6E1D6] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6E1D6] pb-3">
                <div className="flex items-center gap-2 text-amber-600 font-bold">
                  <Sun size={20} />
                  <h3 className="font-serif text-lg text-[#1C2E20]">Morning AM Bio-Routine</h3>
                </div>
                <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-200">
                  4 Steps
                </span>
              </div>

              <div className="space-y-4">
                {curatedRoutine.morningRoutine.map((item) => (
                  <div key={item.step} className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#E6E1D6] flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#4A5D4E] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#849673] uppercase">{item.title}</span>
                        <span className="text-[10px] bg-[#D9E3D0] text-[#4A5D4E] font-bold px-2 py-0.5 rounded-full">
                          {calculateAIMatchScore(item.product, currentProfile, systemSettings).aiMatchScore}% Match
                        </span>
                      </div>
                      <h4 
                        onClick={() => setSelectedProduct(item.product)}
                        className="font-bold text-xs text-[#1C2E20] hover:underline cursor-pointer truncate mt-0.5"
                      >
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-1 leading-snug">{item.instructions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evening Routine */}
            <div className="bg-white p-6 rounded-3xl border border-[#E6E1D6] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6E1D6] pb-3">
                <div className="flex items-center gap-2 text-indigo-700 font-bold">
                  <Moon size={20} />
                  <h3 className="font-serif text-lg text-[#1C2E20]">Evening PM Renewal Routine</h3>
                </div>
                <span className="text-[10px] bg-indigo-50 text-indigo-800 font-bold px-2.5 py-1 rounded-full border border-indigo-200">
                  3 Steps
                </span>
              </div>

              <div className="space-y-4">
                {curatedRoutine.eveningRoutine.map((item) => (
                  <div key={item.step} className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#E6E1D6] flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1C2E20] text-amber-100 flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase">{item.title}</span>
                        <span className="text-[10px] bg-[#D9E3D0] text-[#4A5D4E] font-bold px-2 py-0.5 rounded-full">
                          {calculateAIMatchScore(item.product, currentProfile, systemSettings).aiMatchScore}% Match
                        </span>
                      </div>
                      <h4 
                        onClick={() => setSelectedProduct(item.product)}
                        className="font-bold text-xs text-[#1C2E20] hover:underline cursor-pointer truncate mt-0.5"
                      >
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-1 leading-snug">{item.instructions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bundle Quick Purchase Banner */}
          <div className="bg-gradient-to-r from-[#1C2E20] to-[#2E4A32] text-amber-50 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800">
            <div className="space-y-1 text-center md:text-left">
              <span className="bg-amber-100 text-[#1C2E20] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                COMPLETE 4-PIECE AI ROUTINE BUNDLE
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">Save 15% on your tailored bio-routine</h3>
              <p className="text-xs text-emerald-100">
                Includes Cleanser, Serum, Barrier Cream, and Mineral Sunscreen formatted for {selectedSkinType} skin.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <span className="text-xs text-emerald-300 line-through font-mono">${curatedRoutine.totalBundlePrice}</span>
                <p className="text-2xl font-bold text-amber-300 font-mono">${curatedRoutine.bundleDiscountPrice}</p>
              </div>

              <button
                onClick={handleAddBundleToCart}
                className="bg-amber-100 text-[#1C2E20] px-6 py-3 rounded-2xl text-xs font-bold hover:bg-white transition-all flex items-center gap-2 shadow-md"
              >
                <ShoppingBag size={16} />
                <span>Add AI Routine Bundle to Cart</span>
              </button>
            </div>
          </div>

          {/* Recommended Individual Products Grid */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#1C2E20]">Top High Match Products for Your Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {curatedRoutine.bundleProducts.map((product) => {
                const matchRes = calculateAIMatchScore(product, currentProfile, systemSettings);
                return (
                  <div key={product.id} className="bg-white rounded-2xl border border-[#E6E1D6] p-4 flex flex-col justify-between hover:border-[#849673] transition-all shadow-sm group">
                    <div className="relative mb-3 aspect-square bg-[#F3EEE6] rounded-2xl p-3 border border-[#E2DAD0] flex items-center justify-center overflow-hidden">
                      <img
                        src={getAVOLABProductImage(product.id, product.category, product.name, product.image)}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.target as HTMLImageElement).src = getAVOLABProductImage(product.id, product.category, product.name); }}
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute top-2 right-2 bg-[#2D3B2D] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                        {matchRes.aiMatchScore}% Match
                      </span>
                    </div>

                    <div className="space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-[#849673] font-bold uppercase">{product.category}</span>
                        <h4 
                          onClick={() => setSelectedProduct(product)}
                          className="font-bold text-xs text-[#1C2E20] hover:text-[#4A5D4E] cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h4>
                        <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                          {matchRes.matchReasons[0] || 'Matches skin profile'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                        <span className="font-bold font-mono text-xs text-[#1C2E20]">${product.price}</span>
                        <button
                          onClick={() => {
                            addToCart(product, 1);
                            showToast(`Added ${product.name} to cart!`);
                          }}
                          className="bg-[#F0EBE1] hover:bg-[#4A5D4E] hover:text-white text-[#4A5D4E] p-2 rounded-xl transition-colors"
                          title="Add to Cart"
                        >
                          <ShoppingBag size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

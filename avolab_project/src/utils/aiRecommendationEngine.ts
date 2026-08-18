import { Product, SkinType, SkinConcern, SystemSettings } from '../types';

export interface UserSkinProfile {
  skinType?: SkinType;
  skinConcerns?: SkinConcern[];
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  routineProducts?: string[];
  texturePreference?: string;
  priceRange?: string;
}

export interface RecommendationResult {
  product: Product;
  aiMatchScore: number;
  matchReasons: string[];
  matchBreakdown: {
    skinTypeScore: number;
    concernScore: number;
    attributeScore: number;
    textureScore: number;
    priceScore: number;
    behavioralScore: number;
  };
}

/**
 * Calculates AI Match Score (0-100%) for a product based on customer skin profile and configured algorithm weights.
 */
export function calculateAIMatchScore(
  product?: Product | null,
  profile?: UserSkinProfile | null,
  settings?: SystemSettings
): RecommendationResult {
  if (!product) {
    return {
      product: {} as Product,
      aiMatchScore: 50,
      matchReasons: [],
      matchBreakdown: {
        skinTypeScore: 50,
        concernScore: 50,
        attributeScore: 50,
        textureScore: 50,
        priceScore: 50,
        behavioralScore: 50
      }
    };
  }

  // Default system weights (normalized to sum to 100)
  const stWeight = settings?.recommendationWeights?.skinType ?? settings?.skinTypeWeight ?? 30;
  const scWeight = settings?.recommendationWeights?.concerns ?? settings?.concernWeight ?? 25;
  const attrWeight = settings?.recommendationWeights?.attributes ?? settings?.ingredientWeight ?? 15;
  const texWeight = settings?.recommendationWeights?.texture ?? 10;
  const priceWeight = settings?.recommendationWeights?.price ?? 10;
  const behWeight = settings?.recommendationWeights?.behavioral ?? settings?.purchaseHistoryWeight ?? 10;

  const totalWeights = stWeight + scWeight + attrWeight + texWeight + priceWeight + behWeight;

  const userSkinType = profile?.skinType;
  const userConcerns = profile?.skinConcerns || [];

  if (!profile || (!userSkinType && userConcerns.length === 0)) {
    // Generic fallback baseline match based on product rating and popularity
    const baseScore = Math.min(98, Math.round(75 + ((product.rating || 4.5) / 5) * 20));
    return {
      product: { ...product, aiMatchScore: baseScore },
      aiMatchScore: baseScore,
      matchReasons: ['Popular customer choice', 'High customer satisfaction rating'],
      matchBreakdown: {
        skinTypeScore: 80,
        concernScore: 80,
        attributeScore: 75,
        textureScore: 80,
        priceScore: 85,
        behavioralScore: 80
      }
    };
  }

  const reasons: string[] = [];

  // 1. Skin Type Match (0-100)
  let skinTypeScore = 50;
  const productSkinTypes = product.skinTypes || [];
  if (userSkinType) {
    if (productSkinTypes.includes(userSkinType) || productSkinTypes.includes('All')) {
      skinTypeScore = 100;
      reasons.push(`Formulated specifically for ${userSkinType} Skin`);
    } else {
      skinTypeScore = 30;
    }
  } else {
    skinTypeScore = 75;
  }

  // 2. Skin Concern Match (0-100)
  let concernScore = 50;
  const productConcerns = product.skinConcerns || [];
  if (userConcerns.length > 0) {
    const matchedConcerns = productConcerns.filter(c => userConcerns.includes(c));
    if (matchedConcerns.length > 0) {
      concernScore = Math.min(100, Math.round((matchedConcerns.length / Math.min(3, userConcerns.length)) * 100));
      reasons.push(`Addresses ${matchedConcerns.join(' & ')}`);
    } else {
      concernScore = 20;
    }
  } else {
    concernScore = 70;
  }

  // 3. Attribute & Clean Ingredient Bio-Affinity (0-100)
  let attributeScore = 70;
  if (product.isVegan) {
    attributeScore += 15;
    reasons.push('100% Clean Vegan & Cruelty-Free');
  }
  if (product.ingredients && product.ingredients.length > 0) {
    attributeScore += 15;
    reasons.push(`Key active ingredient: ${product.ingredients[0]}`);
  }
  attributeScore = Math.min(100, attributeScore);

  // 4. Texture / Finish Match (0-100)
  let textureScore = 70;
  if (profile.texturePreference) {
    const pref = profile.texturePreference.toLowerCase();
    const nameDesc = (product.name + ' ' + product.description + ' ' + (product.tags || []).join(' ')).toLowerCase();
    if (nameDesc.includes(pref) || (pref.includes('cream') && nameDesc.includes('cream')) || (pref.includes('gel') && nameDesc.includes('gel')) || (pref.includes('serum') && nameDesc.includes('serum'))) {
      textureScore = 100;
      reasons.push(`Matches your ${profile.texturePreference} texture preference`);
    } else {
      textureScore = 60;
    }
  }

  // 5. Price Range Match (0-100)
  let priceScore = 80;
  if (profile.priceRange) {
    const p = product.price;
    if (profile.priceRange === '$10-$30' && p <= 30) {
      priceScore = 100;
      reasons.push('Fits your $10-$30 budget target');
    } else if (profile.priceRange === '$30-$60' && p >= 25 && p <= 65) {
      priceScore = 100;
      reasons.push('Fits your $30-$60 budget target');
    } else if (profile.priceRange === '$60-$100' && p >= 55 && p <= 110) {
      priceScore = 100;
      reasons.push('Fits your premium budget target');
    } else {
      priceScore = 70;
    }
  }

  // 6. Behavioral / Rating Match (0-100)
  const behavioralScore = Math.min(100, Math.round((product.rating / 5) * 100));

  // Weighted total score calculation
  const rawScore = 
    (skinTypeScore * stWeight +
     concernScore * scWeight +
     attributeScore * attrWeight +
     textureScore * texWeight +
     priceScore * priceWeight +
     behavioralScore * behWeight) / totalWeights;

  const finalScore = Math.min(99, Math.max(60, Math.round(rawScore)));

  // Ensure reasons list isn't empty
  if (reasons.length === 0) {
    reasons.push('Complements clean barrier skincare routine');
  }

  return {
    product: {
      ...product,
      aiMatchScore: finalScore
    },
    aiMatchScore: finalScore,
    matchReasons: reasons,
    matchBreakdown: {
      skinTypeScore,
      concernScore,
      attributeScore,
      textureScore,
      priceScore,
      behavioralScore
    }
  };
}

/**
 * Ranks all catalog products by AI match score for a user profile
 */
export function getPersonalizedRecommendations(
  products: Product[],
  profile?: UserSkinProfile | null,
  settings?: SystemSettings,
  limit: number = 8
): RecommendationResult[] {
  const results = products.map(p => calculateAIMatchScore(p, profile, settings));
  results.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
  return results.slice(0, limit);
}

/**
 * Builds a curated 3-step Morning & Evening routine from the catalog based on skin profile
 */
export function generateCuratedRoutine(
  products: Product[],
  profile?: UserSkinProfile | null,
  settings?: SystemSettings
) {
  const ranked = getPersonalizedRecommendations(products, profile, settings, 20);

  // Find cleanser
  const cleanser = ranked.find(r => 
    r.product.category.toLowerCase().includes('cleanser') || 
    r.product.name.toLowerCase().includes('cleanser')
  )?.product || products[0];

  // Find serum / treatment
  const serum = ranked.find(r => 
    (r.product.category.toLowerCase().includes('serum') || r.product.name.toLowerCase().includes('serum')) &&
    r.product.id !== cleanser.id
  )?.product || products[1];

  // Find moisturizer / barrier cream
  const moisturizer = ranked.find(r => 
    (r.product.category.toLowerCase().includes('cream') || r.product.name.toLowerCase().includes('cream') || r.product.category.toLowerCase().includes('moisturizer')) &&
    r.product.id !== cleanser.id && r.product.id !== serum.id
  )?.product || products[2];

  // Find sunscreen / protective daytime finish
  const sunscreen = ranked.find(r => 
    (r.product.name.toLowerCase().includes('sunscreen') || r.product.category.toLowerCase().includes('sun')) &&
    r.product.id !== cleanser.id && r.product.id !== serum.id && r.product.id !== moisturizer.id
  )?.product || products[3] || moisturizer;

  const totalBundlePrice = cleanser.price + serum.price + moisturizer.price + (sunscreen ? sunscreen.price : 0);
  const bundleDiscountPrice = Math.round(totalBundlePrice * 0.85); // 15% bundle savings

  return {
    morningRoutine: [
      { step: 1, title: 'Gentle Cleansing', product: cleanser, instructions: 'Massaged gently onto damp skin with lukewarm water to refresh barrier without stripping.' },
      { step: 2, title: 'Targeted Bio-Active Serum', product: serum, instructions: 'Apply 2-3 drops to face and neck to target primary concerns.' },
      { step: 3, title: 'Moisture Barrier Locks', product: moisturizer, instructions: 'Smooth cream evenly to lock in deep lipid hydration.' },
      { step: 4, title: 'Clean SPF Protection', product: sunscreen, instructions: 'Finish with lightweight mineral protection before daylight exposure.' }
    ],
    eveningRoutine: [
      { step: 1, title: 'Purifying Cleanser', product: cleanser, instructions: 'Double cleanse away impurities, sunscreens, and urban pollutants.' },
      { step: 2, title: 'Night Renewal Serum', product: serum, instructions: 'Pat serum into skin to promote nocturnal cellular recovery.' },
      { step: 3, title: 'Barrier Repair Overnight Cream', product: moisturizer, instructions: 'Apply generous layer to repair barrier lipids while you sleep.' }
    ],
    bundleProducts: [cleanser, serum, moisturizer, sunscreen].filter(Boolean),
    totalBundlePrice,
    bundleDiscountPrice,
    bundleSavings: totalBundlePrice - bundleDiscountPrice
  };
}

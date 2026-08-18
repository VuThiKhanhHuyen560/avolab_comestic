const heroBannerImg = '/images/avolab_hero_banner_1786551086361.jpg';
const dailyEssentialsImg = '/images/avolab_daily_essentials_1786551102511.jpg';
const barrierCareImg = '/images/avolab_barrier_care_1786551116568.jpg';
const brighteningRitualImg = '/images/avolab_brightening_ritual_1786551131752.jpg';
const hydrationBoostersImg = '/images/avolab_hydration_boosters_1786551147171.jpg';

export interface MarketingBanner {
  id: string;
  type: 'HERO' | 'CAMPAIGN' | 'CATEGORY' | 'COLLECTION' | 'POSTER';
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  badgeText?: string;
  discountTag?: string;
  startDate?: string;
  endDate?: string;
}

export interface FeaturedCollection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  categoryFilter?: string;
  tagFilter?: string;
  itemCount: number;
}

export interface IngredientSpotlight {
  id: string;
  name: string;
  botanicalName: string;
  description: string;
  benefits: string[];
  imageUrl: string;
  relatedCategory: string;
}

export interface CustomerReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  comment: string;
  productName: string;
  skinType: string;
  verified: boolean;
  avatar: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  handle: string;
  caption: string;
  likes: number;
  productTagged?: string;
}

export const INITIAL_MARKETING_BANNERS: MarketingBanner[] = [
  {
    id: 'ban-1',
    type: 'HERO',
    title: 'Skincare, Made Personal.',
    subtitle: '100% VEGAN • CLEAN SCIENCE • BOTANICAL POWER',
    description: 'Advanced vegan skincare powered by cold-pressed botanical nutrients and intelligent AI skin matching.',
    imageUrl: heroBannerImg,
    ctaText: 'SHOP BESTSELLERS',
    ctaLink: 'SHOP',
    badgeText: 'SUMMER SKIN RESET 2026'
  },
  {
    id: 'ban-2',
    type: 'CAMPAIGN',
    title: 'Barrier Care Edit',
    subtitle: '3:1:1 BIOMIMETIC CERAMIDE LIPID REPAIR',
    description: 'Intensive soothing care for rosacea, redness, and micro-cracked skin barriers with cold-pressed avocado phytosterols.',
    imageUrl: barrierCareImg,
    ctaText: 'EXPLORE BARRIER EDIT',
    ctaLink: 'SHOP',
    badgeText: 'CLINICALLY TESTED',
    discountTag: 'BARRIER15'
  },
  {
    id: 'ban-3',
    type: 'CAMPAIGN',
    title: 'Brightening Ritual',
    subtitle: 'STABILIZED VITAMIN C & GLOW BOTANICALS',
    description: 'Illuminating serum rituals designed to balance uneven skin tone and restore natural luminosity.',
    imageUrl: brighteningRitualImg,
    ctaText: 'SHOP BRIGHTENING RITUAL',
    ctaLink: 'SHOP',
    badgeText: 'SAVE 20%',
    discountTag: 'GLOW20'
  }
];

export const INITIAL_FEATURED_COLLECTIONS: FeaturedCollection[] = [
  {
    id: 'col-1',
    title: 'The Daily Essentials',
    subtitle: 'Core 3-Step Clean Skincare Routine',
    description: 'Simple. Effective. Everyday.',
    imageUrl: dailyEssentialsImg,
    tagFilter: 'BESTSELLER',
    itemCount: 8
  },
  {
    id: 'col-2',
    title: 'Barrier Care Collection',
    subtitle: 'Intensive Soothing & Lipid Protection',
    description: 'Strengthen. Protect. Rebalance.',
    imageUrl: barrierCareImg,
    tagFilter: 'BARRIER_CARE',
    itemCount: 10
  },
  {
    id: 'col-3',
    title: 'Brightening Ritual',
    subtitle: 'Brightening & Texture Resurfacing',
    description: 'Brighten. Even. Glow Naturally.',
    imageUrl: brighteningRitualImg,
    tagFilter: 'GLOW',
    itemCount: 9
  },
  {
    id: 'col-4',
    title: 'Hydration Boosters',
    subtitle: 'Deep Dehydration & Moisture Surge',
    description: 'Deep Hydration. Lasting Radiance.',
    imageUrl: hydrationBoostersImg,
    categoryFilter: 'Serums',
    itemCount: 12
  }
];

const cleanserTube = '/images/avolab_cleanser_tube_1786632315682.jpg';
const serumDropper = '/images/avolab_serum_dropper_1786632330474.jpg';
const vitCSerum = '/images/avolab_vit_c_serum_1786632388901.jpg';
const creamJar = '/images/avolab_cream_jar_1786632340049.jpg';
const sunscreenTube = '/images/avolab_sunscreen_tube_1786632350384.jpg';
const faceMask = '/images/avolab_face_mask_1786632463938.jpg';

export const INGREDIENT_SPOTLIGHTS: IngredientSpotlight[] = [
  {
    id: 'ing-1',
    name: 'Avocado Phytosterols',
    botanicalName: 'Persea Gratissima Sterols',
    description: 'Bio-identical plant sterols derived from organic cold-pressed avocados that mimic natural skin barrier lipids, accelerating cell recovery and soothing chronic sensitivity.',
    benefits: ['Restores moisture barrier', 'Reduces inflammation', 'Supples dry texture'],
    imageUrl: serumDropper,
    relatedCategory: 'Serums'
  },
  {
    id: 'ing-2',
    name: 'Ceramide 5-Complex',
    botanicalName: 'Sphingolipids Matrix',
    description: 'A multi-ceramide blend (NP, AP, EOP, Phytosphingosine) engineered to lock in moisture and shield skin against environmental pollutants and harsh weather.',
    benefits: ['Prevents transepidermal water loss', 'Smooths micro-cracks', 'Protects against urban dust'],
    imageUrl: barrierCareImg,
    relatedCategory: 'Moisturizers'
  },
  {
    id: 'ing-3',
    name: 'Stabilized Vitamin C 15%',
    botanicalName: 'L-Ascorbic Acid + Ferulic',
    description: 'Pure antioxidant power that neutralizes free radicals, brightens hyperpigmentation dark spots, and boosts collagen elasticity for youthful vibrancy.',
    benefits: ['Fades dark spots', 'Protects against UV stress', 'Evens skin tone'],
    imageUrl: vitCSerum,
    relatedCategory: 'Serums'
  },
  {
    id: 'ing-4',
    name: 'Centella Asiatica (Cica)',
    botanicalName: 'Gotu Kola Extract',
    description: 'Ancient medicinal herb famed for its intense wound-healing and anti-inflammatory properties, calming active breakouts and rosacea flushes.',
    benefits: ['Reduces facial redness', 'Soothes active blemishes', 'Speeds repair'],
    imageUrl: cleanserTube,
    relatedCategory: 'Cleansers'
  }
];

export const CUSTOMER_REVIEWS: CustomerReviewItem[] = [
  {
    id: 'cr-1',
    author: 'Hannah M.',
    location: 'San Francisco, CA',
    rating: 5,
    comment: 'The Avocado Barrier Serum saved my skin after I over-exfoliated with strong glycolic acid. Within two days, the burning red tightness completely disappeared!',
    productName: 'Cold-Pressed Avocado Phytosterol Barrier Repair Serum',
    skinType: 'Sensitive & Reactive',
    verified: true,
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%232D3B2D'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23D3E0D3' font-family='sans-serif' font-size='36' font-weight='bold'>HM</text></svg>"
  },
  {
    id: 'cr-2',
    author: 'David L.',
    location: 'Seattle, WA',
    rating: 5,
    comment: 'Finally a mineral sunscreen that does NOT leave a ghost white cast on dark beard stubble! Lightweight, zero greasy shine, and feels like silk.',
    productName: 'Daily Invisible Mineral Sunscreen SPF 50+',
    skinType: 'Combination',
    verified: true,
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%233E4F3E'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23FFFFFF' font-family='sans-serif' font-size='36' font-weight='bold'>DL</text></svg>"
  },
  {
    id: 'cr-3',
    author: 'Maya P.',
    location: 'Austin, TX',
    rating: 5,
    comment: 'The 1-hour BOPIS in-store pickup at Flagship Downtown was seamless. Walked in, scanned my QR code, and got a free travel tote mini gift!',
    productName: 'The Daily Botanical Barrier Trio Set',
    skinType: 'Dry Skin',
    verified: true,
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231C2E20'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23E2DAD0' font-family='sans-serif' font-size='36' font-weight='bold'>MP</text></svg>"
  }
];

export const INSTAGRAM_GALLERY: InstagramPost[] = [
  {
    id: 'ig-1',
    imageUrl: serumDropper,
    handle: '@avolab.skincare',
    caption: 'Morning sun & cold-pressed avocado barrier dew ✨ #AvolabRitual',
    likes: 1240,
    productTagged: 'Barrier Repair Serum'
  },
  {
    id: 'ig-2',
    imageUrl: barrierCareImg,
    handle: '@chloe.glow',
    caption: 'Current skincare shelfie! 🥑 Clean, vegan, and so comforting.',
    likes: 2890,
    productTagged: 'Ultra-Barrier Cream'
  },
  {
    id: 'ig-3',
    imageUrl: cleanserTube,
    handle: '@cleanbeauty_daily',
    caption: 'The texture of this foaming cleanser is pure cloud bliss ☁️',
    likes: 950,
    productTagged: 'Avocado Foaming Cleanser'
  },
  {
    id: 'ig-4',
    imageUrl: sunscreenTube,
    handle: '@urban.dermatology',
    caption: 'Daily SPF 50+ mineral protection without white cast. Essential!',
    likes: 3120,
    productTagged: 'Invisible Mineral Sunscreen'
  }
];

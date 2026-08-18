import { Product } from '../types';
import { getAVOLABProductImage } from '../utils/productImages';

const RAW_EXPANDED_PRODUCTS: Product[] = [
  // --- FACIAL CLEANUSERS ---
  {
    id: 'prod-1',
    sku: 'AVO-CLN-01',
    name: 'Gentle Avocado Foaming Cleanser',
    category: 'Cleansers',
    price: 24,
    discountPrice: 20,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    secondaryImages: [
      '/images/avolab_cleanser_tube_1786632315682.jpg',
      '/images/avolab_cleanser_tube_1786632315682.jpg'
    ],
    description: 'A sulfate-free daily cloud foam cleanser packed with organic cold-pressed avocado oil, green tea extracts, and amino acids to strip impurities without disrupting the skin barrier.',
    benefits: ['Removes light makeup & sunscreen', 'Calms tightness and facial redness', 'Sustainably sourced cold-pressed lipid profile'],
    ingredients: ['Persea Gratissima (Avocado) Oil', 'Camellia Sinensis (Green Tea) Leaf Extract', 'Sodium Lauroyl Oat Amino Acids', 'Glycerin', 'Centella Asiatica'],
    skinTypes: ['Sensitive', 'Dry', 'Combination', 'Normal'],
    skinConcerns: ['Redness & Irritation', 'Dryness & Dehydration'],
    size: '150 mL / 5.1 fl. oz.',
    stockQuantity: 85,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 25 },
      { locationId: 'store-2', locationName: 'Avolab Westside Boutique', locationType: 'STORE', quantity: 18 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 42 }
    ],
    rating: 4.8,
    reviewsCount: 124,
    reviews: [
      { id: 'r1', author: 'Emma S.', rating: 5, comment: 'Leaves my skin so soft! No squeaky dry feeling whatsoever.', date: '2026-08-01', verified: true },
      { id: 'r2', author: 'Marcus K.', rating: 5, comment: 'Great for sensitive skin that blushes easily after washing.', date: '2026-07-28', verified: true }
    ],
    isVegan: true,
    isFeatured: true,
    tags: ['BESTSELLER', 'VEGAN', 'CLEANSER', 'BARRIER_CARE']
  },
  {
    id: 'prod-2',
    sku: 'AVO-CLN-02',
    name: 'Barrier Renewal Oil-to-Milk Cleanser',
    category: 'Cleansers',
    price: 32,
    discountPrice: 28,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    secondaryImages: [
      '/images/avolab_cleanser_tube_1786632315682.jpg'
    ],
    description: 'Transformative cleansing oil infused with avocado phytosterols and jojoba lipids that melts away waterproof sunscreen, heavy makeup, and excess sebum into a soothing milky rinse.',
    benefits: ['Dissolves stubborn makeup instantly', 'Strengthens acid mantle', 'Rinses completely clean without oily film'],
    ingredients: ['Avocado Phytosterol Complex', 'Jojoba Seed Oil', 'Polyglyceryl-4 Oleate', 'Tocopherol (Vitamin E)', 'Bisabolol'],
    skinTypes: ['Dry', 'Sensitive', 'Normal', 'Combination'],
    skinConcerns: ['Dryness & Dehydration', 'Redness & Irritation'],
    size: '120 mL / 4.0 fl. oz.',
    stockQuantity: 62,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 15 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 47 }
    ],
    rating: 4.9,
    reviewsCount: 88,
    isVegan: true,
    isFeatured: true,
    tags: ['NEW', 'VEGAN', 'DOUBLE_CLEANSE']
  },
  {
    id: 'prod-3',
    sku: 'AVO-CLN-03',
    name: 'Purifying Matcha & Avocado Gel Jelly Cleanser',
    category: 'Cleansers',
    price: 26,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'A cooling gel-to-water cleanser featuring ceremonial grade green tea matcha and fermented avocado broth to clarify congested pores and control excess shine gently.',
    benefits: ['Clarifies pore congestion', 'Reduces excess oiliness', 'Non-comedogenic soothing hydration'],
    ingredients: ['Ceremonial Matcha Powder', 'Fermented Avocado Extract', 'Salix Alba (Willow Bark)', 'Allantoin'],
    skinTypes: ['Oily', 'Combination', 'Sensitive'],
    skinConcerns: ['Acne & Blemishes', 'Pore Size'],
    size: '150 mL / 5.1 fl. oz.',
    stockQuantity: 90,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 30 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 60 }
    ],
    rating: 4.7,
    reviewsCount: 62,
    isVegan: true,
    isFeatured: false,
    tags: ['PURIFYING', 'VEGAN']
  },
  {
    id: 'prod-4',
    sku: 'AVO-CLN-04',
    name: 'Oat Milk & Avocado Calming Cleansing Milk',
    category: 'Cleansers',
    price: 22,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Ultra-gentle non-foaming cleansing cream designed specifically for hyper-reactive, rosacea-prone, and dry post-treatment skin.',
    benefits: ['Zero sting guarantee', 'Soothes inflamed cheeks', 'Restores natural moisture barrier'],
    ingredients: ['Colloidal Oatmeal', 'Avocado Butter', 'Aloe Barbadensis Leaf Juice', 'Chamomile Extract'],
    skinTypes: ['Sensitive', 'Dry'],
    skinConcerns: ['Redness & Irritation', 'Dryness & Dehydration'],
    size: '200 mL / 6.7 fl. oz.',
    stockQuantity: 45,
    stockByLocation: [
      { locationId: 'store-2', locationName: 'Avolab Westside Boutique', locationType: 'STORE', quantity: 12 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 33 }
    ],
    rating: 4.9,
    reviewsCount: 79,
    isVegan: true,
    isFeatured: false,
    tags: ['SENSITIVE', 'VEGAN']
  },
  {
    id: 'prod-5',
    sku: 'AVO-CLN-05',
    name: 'Phytosterol AHA/BHA Resurfacing Cleanser',
    category: 'Cleansers',
    price: 28,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Smooths rough texture and clears dull skin cells with 2% Lactic Acid and 0.5% Salicylic Acid buffered by soothing avocado lipids.',
    benefits: ['Gently exfoliates texture', 'Unclogs congested pores', 'Enhances glow without irritation'],
    ingredients: ['Lactic Acid 2%', 'Salicylic Acid 0.5%', 'Avocado Phytosterols', 'Licorice Root'],
    skinTypes: ['Combination', 'Oily', 'Normal'],
    skinConcerns: ['Dullness & Uneven Tone', 'Pore Size', 'Acne & Blemishes'],
    size: '150 mL / 5.1 fl. oz.',
    stockQuantity: 70,
    stockByLocation: [
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 70 }
    ],
    rating: 4.6,
    reviewsCount: 54,
    isVegan: true,
    isFeatured: false,
    tags: ['EXFOLIATING', 'GLOW']
  },

  // --- TONERS & ESSENCES ---
  {
    id: 'prod-6',
    sku: 'AVO-TON-01',
    name: 'Avocado & Green Tea Milky Balancing Toner',
    category: 'Toners',
    price: 28,
    discountPrice: 24,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    secondaryImages: [
      '/images/avolab_cleanser_tube_1786632315682.jpg'
    ],
    description: 'A comforting milky fluid toner that drenches thirsty skin cells with avocado peptide essence, green tea polyphenols, and 5D hyaluronic acid.',
    benefits: ['Instant 72-hour surge of moisture', 'Balances skin pH after cleansing', 'Preps skin for deeper serum absorption'],
    ingredients: ['Avocado Peptides', 'Organic Green Tea Extract', 'Hyaluronic Acid 5D Complex', 'Panthenol (Pro-Vitamin B5)'],
    skinTypes: ['Dry', 'Sensitive', 'Normal', 'Combination'],
    skinConcerns: ['Dryness & Dehydration', 'Dullness & Uneven Tone'],
    size: '180 mL / 6.0 fl. oz.',
    stockQuantity: 110,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 35 },
      { locationId: 'store-2', locationName: 'Avolab Westside Boutique', locationType: 'STORE', quantity: 20 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 55 }
    ],
    rating: 4.9,
    reviewsCount: 142,
    isVegan: true,
    isFeatured: true,
    tags: ['BESTSELLER', 'VEGAN', 'HYDRATION']
  },
  {
    id: 'prod-7',
    sku: 'AVO-TON-02',
    name: 'PHA 5% Gentle Resurfacing Glow Essence',
    category: 'Toners',
    price: 34,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Polyhydroxy Acid (Gluconolactone) essence designed for sensitive skin that cannot tolerate glycolic acid. Smooths micro-bumps while locking in dewiness.',
    benefits: ['Glass-skin radiance', 'Ultra-mild surface exfoliation', 'Plumps fine dehydration lines'],
    ingredients: ['Gluconolactone 5%', 'Avocado Water', 'Niacinamide 2%', 'Snow Mushroom Extract'],
    skinTypes: ['Sensitive', 'Dry', 'Combination', 'Normal'],
    skinConcerns: ['Dullness & Uneven Tone', 'Aging & Fine Lines'],
    size: '150 mL / 5.1 fl. oz.',
    stockQuantity: 65,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 15 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 50 }
    ],
    rating: 4.8,
    reviewsCount: 96,
    isVegan: true,
    isFeatured: true,
    tags: ['NEW', 'GLOW', 'VEGAN']
  },
  {
    id: 'prod-8',
    sku: 'AVO-TON-03',
    name: 'Centella & Avocado Soothing Hydramist',
    category: 'Toners',
    price: 24,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Micro-fine face mist for instant hydration on the go, over makeup or after sun exposure. Infused with Centella Asiatica (Cica) and fermented botanical waters.',
    benefits: ['Immediate cooling comfort', 'Sets makeup beautifully', 'Calms environmental stress'],
    ingredients: ['Centella Asiatica Water', 'Cold-Pressed Avocado Hydro-Distillate', 'Cucumber Extract', 'Sodium PCA'],
    skinTypes: ['All', 'Sensitive', 'Oily'],
    skinConcerns: ['Redness & Irritation', 'Dryness & Dehydration'],
    size: '100 mL / 3.4 fl. oz.',
    stockQuantity: 120,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 40 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 80 }
    ],
    rating: 4.7,
    reviewsCount: 110,
    isVegan: true,
    isFeatured: false,
    tags: ['MIST', 'TRAVEL']
  },

  // --- SERUMS & CONCENTRATES ---
  {
    id: 'prod-9',
    sku: 'AVO-SER-01',
    name: 'Cold-Pressed Avocado Phytosterol Barrier Repair Serum',
    category: 'Serums',
    price: 48,
    discountPrice: 38,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    secondaryImages: [
      '/images/avolab_cleanser_tube_1786632315682.jpg',
      '/images/avolab_cleanser_tube_1786632315682.jpg'
    ],
    description: 'AVOLAB’s #1 award-winning intensive repair serum. Formulated with concentrated avocado phytosterols, 3:1:1 biomimetic lipid ratio, and 5% niacinamide to restore severely compromised skin barriers in 72 hours.',
    benefits: ['Repairs damaged skin barrier by 89%', 'Calms chronic redness and irritation', 'Protects against urban pollution'],
    ingredients: ['Avocado Phytosterol Complex 4%', 'Niacinamide 5%', 'Ceramide NP, AP, EOP', 'Plant Squalane', 'Centella Asiatica'],
    skinTypes: ['Sensitive', 'Dry', 'Combination', 'Normal'],
    skinConcerns: ['Redness & Irritation', 'Dryness & Dehydration', 'Aging & Fine Lines'],
    size: '30 mL / 1.0 fl. oz.',
    stockQuantity: 140,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 45 },
      { locationId: 'store-2', locationName: 'Avolab Westside Boutique', locationType: 'STORE', quantity: 25 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 70 }
    ],
    rating: 4.95,
    reviewsCount: 312,
    reviews: [
      { id: 'rev-1', author: 'Dr. Sarah L., Dermatologist', rating: 5, comment: 'I recommend this serum constantly to patients recovering from over-exfoliation.', date: '2026-08-05', verified: true },
      { id: 'rev-2', author: 'Chloe B.', rating: 5, comment: 'Literally saved my skin after a bad acid peel. Holy grail serum!', date: '2026-07-20', verified: true }
    ],
    isVegan: true,
    isFeatured: true,
    tags: ['BESTSELLER', 'HERO_PRODUCT', 'BARRIER_CARE', 'CAMPAIGN_SUMMER']
  },
  {
    id: 'prod-10',
    sku: 'AVO-SER-02',
    name: 'Vitamin C 15% + Avocado Glow Booster Serum',
    category: 'Serums',
    price: 42,
    discountPrice: 36,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Stabilized 15% L-Ascorbic Acid infused with antioxidant-rich avocado oil polyphenols and Ferulic Acid for radiant, even-toned complexion without sting.',
    benefits: ['Fades dark spots and hyperpigmentation', 'Protects against UV free radicals', 'Boosts collagen elasticity'],
    ingredients: ['L-Ascorbic Acid 15%', 'Ferulic Acid 0.5%', 'Tocopherol', 'Avocado Polyphenol Extract'],
    skinTypes: ['Normal', 'Combination', 'Dry', 'Oily'],
    skinConcerns: ['Dullness & Uneven Tone', 'Dark Circles', 'Aging & Fine Lines'],
    size: '30 mL / 1.0 fl. oz.',
    stockQuantity: 95,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 20 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 75 }
    ],
    rating: 4.8,
    reviewsCount: 168,
    isVegan: true,
    isFeatured: true,
    tags: ['BESTSELLER', 'GLOW', 'VITAMIN_C']
  },
  {
    id: 'prod-11',
    sku: 'AVO-SER-03',
    name: 'Hydrating 4D Hyaluronic Acid Serum Drop',
    category: 'Serums',
    price: 36,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Multi-molecular weight hyaluronic acid matrix that penetrates deep epidermis layers to drench parched skin cells in weightless moisture.',
    benefits: ['Plumps fine dehydration lines', 'Improves skin bouncy elasticity', 'Silky, non-sticky finish'],
    ingredients: ['Sodium Hyaluronate Cross-Polymer', 'Avocado Fruit Water', 'Provitamin B5', 'Ectoin'],
    skinTypes: ['All', 'Dry', 'Normal'],
    skinConcerns: ['Dryness & Dehydration', 'Aging & Fine Lines'],
    size: '30 mL / 1.0 fl. oz.',
    stockQuantity: 105,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 30 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 75 }
    ],
    rating: 4.85,
    reviewsCount: 135,
    isVegan: true,
    isFeatured: false,
    tags: ['HYDRATION', 'PLUMPING']
  },
  {
    id: 'prod-12',
    sku: 'AVO-SER-04',
    name: 'Niacinamide 10% + Avocado Zinc Blemish Concentrate',
    category: 'Serums',
    price: 34,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Targeted serum formulated to regulate oil production, minimize enlarged pores, and calm stubborn breakout inflammation without drying out the surrounding skin.',
    benefits: ['Tightens appearance of pores', 'Reduces acne inflammation', 'Evens skin texture'],
    ingredients: ['Niacinamide 10%', 'Zinc PCA 1%', 'Avocado Seed Extract', 'Allantoin'],
    skinTypes: ['Oily', 'Combination', 'Sensitive'],
    skinConcerns: ['Acne & Blemishes', 'Pore Size', 'Dullness & Uneven Tone'],
    size: '30 mL / 1.0 fl. oz.',
    stockQuantity: 80,
    stockByLocation: [
      { locationId: 'store-2', locationName: 'Avolab Westside Boutique', locationType: 'STORE', quantity: 18 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 62 }
    ],
    rating: 4.75,
    reviewsCount: 112,
    isVegan: true,
    isFeatured: false,
    tags: ['CLEAR_SKIN', 'BLEMISH']
  },
  {
    id: 'prod-13',
    sku: 'AVO-SER-05',
    name: 'Bakuchiol 2% Botanical Retinol-Alternative Serum',
    category: 'Serums',
    price: 52,
    discountPrice: 44,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Natural plant-derived Bakuchiol serum offering all the smoothing, firming, and youth-boosting benefits of retinol with zero irritation, peeling, or sun sensitivity.',
    benefits: ['Firms sagging cheek contours', 'Smooths fine lines and crow’s feet', 'Pregnancy & sensitive-skin safe'],
    ingredients: ['Bakuchiol 2%', 'Avocado Unsaponifiables', 'Rosehip Seed Oil', 'Peptide Complex'],
    skinTypes: ['Sensitive', 'Dry', 'Normal', 'Combination'],
    skinConcerns: ['Aging & Fine Lines', 'Dullness & Uneven Tone'],
    size: '30 mL / 1.0 fl. oz.',
    stockQuantity: 55,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 12 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 43 }
    ],
    rating: 4.9,
    reviewsCount: 84,
    isVegan: true,
    isFeatured: true,
    tags: ['NEW', 'ANTI_AGING', 'VEGAN']
  },

  // --- MOISTURIZERS & CREAMS ---
  {
    id: 'prod-14',
    sku: 'AVO-CRM-01',
    name: 'Avocado Phytosterols Ultra-Barrier Cream',
    category: 'Moisturizers',
    price: 44,
    discountPrice: 38,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    secondaryImages: [
      '/images/avolab_cleanser_tube_1786632315682.jpg'
    ],
    description: 'Rich yet weightless velvet barrier cream engineered with cold-pressed avocado butter, 5 essential ceramides, and oat beta-glucan to shield skin against harsh winter wind and air-conditioning dryness.',
    benefits: ['Instant relief for compromised skin', '24-hour lipid barrier nourishment', 'Smooth velvet finish without clogging pores'],
    ingredients: ['Avocado Butter', 'Ceramides NP, AP, EOP', 'Oat Beta-Glucan', 'Squalane', 'Cholesterol'],
    skinTypes: ['Dry', 'Sensitive', 'Normal'],
    skinConcerns: ['Dryness & Dehydration', 'Redness & Irritation', 'Aging & Fine Lines'],
    size: '50 mL / 1.7 oz.',
    stockQuantity: 150,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 40 },
      { locationId: 'store-2', locationName: 'Avolab Westside Boutique', locationType: 'STORE', quantity: 30 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 80 }
    ],
    rating: 4.9,
    reviewsCount: 245,
    isVegan: true,
    isFeatured: true,
    tags: ['BESTSELLER', 'BARRIER_CREAM', 'VEGAN']
  },
  {
    id: 'prod-15',
    sku: 'AVO-CRM-02',
    name: 'Fresh Avocado Water Gel Cloud Hydrator',
    category: 'Moisturizers',
    price: 38,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Oil-free gel moisturizer bursting with refreshing avocado water and aloe extract. Absorbs in 5 seconds with a cooling sensation perfect for summer humidity.',
    benefits: ['Zero shine oil control', 'Cooling temperature drop on application', 'Ideal under makeup primer'],
    ingredients: ['Avocado Hydrosol', 'Aloe Barbadensis', 'Polyglutamic Acid', 'Madecassoside'],
    skinTypes: ['Oily', 'Combination', 'Normal'],
    skinConcerns: ['Acne & Blemishes', 'Pore Size', 'Dryness & Dehydration'],
    size: '50 mL / 1.7 oz.',
    stockQuantity: 90,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 25 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 65 }
    ],
    rating: 4.8,
    reviewsCount: 120,
    isVegan: true,
    isFeatured: false,
    tags: ['OIL_FREE', 'WATER_GEL']
  },
  {
    id: 'prod-16',
    sku: 'AVO-CRM-03',
    name: 'Overnight Avocado Recovery Balm-to-Oil',
    category: 'Moisturizers',
    price: 46,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'An intensive overnight sleeping mask balm that melts on touch into a cushiony nourishing oil to repair dry patches while you sleep.',
    benefits: ['Wake up with ultra-plump skin', 'Locks in all evening serum actives', 'Deep nourishment for chapped cheeks'],
    ingredients: ['Avocado Fruit Butter', 'Shea Butter', 'Marula Oil', 'Evening Primrose Oil', 'Chamomile Extract'],
    skinTypes: ['Dry', 'Sensitive', 'Normal'],
    skinConcerns: ['Dryness & Dehydration', 'Redness & Irritation'],
    size: '60 mL / 2.0 oz.',
    stockQuantity: 40,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 10 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 30 }
    ],
    rating: 4.88,
    reviewsCount: 76,
    isVegan: true,
    isFeatured: false,
    tags: ['SLEEPING_MASK', 'RECOVERY']
  },

  // --- FACE MASKS & TREATMENTS ---
  {
    id: 'prod-17',
    sku: 'AVO-MSK-01',
    name: 'Cold-Pressed Avocado & Kaolin Detox Clay Mask',
    category: 'Face Masks',
    price: 30,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Creamy non-drying clay treatment featuring French Kaolin clay and avocado oil to vacuum out pore debris without stripping vital moisture.',
    benefits: ['Pore purification without tightness', 'Absorbs excess surface oil', 'Soothes breakout redness'],
    ingredients: ['French Green Kaolin Clay', 'Avocado Seed Oil', 'Spirulina Extract', 'Tea Tree Leaf Extract'],
    skinTypes: ['Combination', 'Oily', 'Sensitive'],
    skinConcerns: ['Acne & Blemishes', 'Pore Size'],
    size: '100 g / 3.5 oz.',
    stockQuantity: 75,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 20 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 55 }
    ],
    rating: 4.7,
    reviewsCount: 94,
    isVegan: true,
    isFeatured: true,
    tags: ['DETOX', 'CLAY_MASK']
  },
  {
    id: 'prod-18',
    sku: 'AVO-MSK-02',
    name: 'Bio-Cellulose Avocado Hydrating Sheet Mask (5-Pack)',
    category: 'Face Masks',
    price: 32,
    discountPrice: 26,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Biodegradable coconut bio-cellulose sheet masks soaked in 25 mL of concentrated avocado phytosterol serum for an instant red-carpet glow in 15 minutes.',
    benefits: ['Instant glow before events', 'Deep soothing hydration burst', 'Biodegradable eco-friendly material'],
    ingredients: ['Avocado Phytosterol Serum', 'Trehalose', 'Sodium Hyaluronate', 'Madecassoside'],
    skinTypes: ['All', 'Sensitive', 'Dry'],
    skinConcerns: ['Dryness & Dehydration', 'Dullness & Uneven Tone', 'Redness & Irritation'],
    size: '5 Sheets x 25 mL',
    stockQuantity: 130,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 30 },
      { locationId: 'store-2', locationName: 'Avolab Westside Boutique', locationType: 'STORE', quantity: 25 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 75 }
    ],
    rating: 4.9,
    reviewsCount: 158,
    isVegan: true,
    isFeatured: true,
    tags: ['BESTSELLER', 'SHEET_MASK', 'GLOW']
  },

  // --- SUNSCREENS & UV SHIELD ---
  {
    id: 'prod-19',
    sku: 'AVO-SUN-01',
    name: 'Daily Invisible Mineral Sunscreen SPF 50+',
    category: 'Sunscreens',
    price: 32,
    discountPrice: 28,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    secondaryImages: [
      '/images/avolab_cleanser_tube_1786632315682.jpg'
    ],
    description: '100% Non-Nano Zinc Oxide broad spectrum SPF 50 protection blended with avocado polyphenols that glides on sheer with zero white cast on all skin tones.',
    benefits: ['Zero white cast guarantee', 'Reef-safe & ocean friendly', 'Soothes sun-stressed skin barrier'],
    ingredients: ['Non-Nano Zinc Oxide 18.5%', 'Avocado Seed Extract', 'Ectoin', 'Bisabolol'],
    skinTypes: ['Sensitive', 'All', 'Oily'],
    skinConcerns: ['Redness & Irritation', 'Aging & Fine Lines', 'Dullness & Uneven Tone'],
    size: '50 mL / 1.7 fl. oz.',
    stockQuantity: 160,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 50 },
      { locationId: 'store-2', locationName: 'Avolab Westside Boutique', locationType: 'STORE', quantity: 30 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 80 }
    ],
    rating: 4.92,
    reviewsCount: 289,
    isVegan: true,
    isFeatured: true,
    tags: ['BESTSELLER', 'SPF50', 'REEF_SAFE', 'CAMPAIGN_SUMMER']
  },
  {
    id: 'prod-20',
    sku: 'AVO-SUN-02',
    name: 'Tinted Avocado Radiance Mineral SPF 40',
    category: 'Sunscreens',
    price: 36,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Flexible tint sunscreen that evens out redness, dark spots, and minor blemishes while shielding skin with physical UV filters and antioxidant avocado oil.',
    benefits: ['Dewy sheer tint finish', 'Cancels facial redness', 'Broad spectrum UVA/UVB protection'],
    ingredients: ['Zinc Oxide 12%', 'Titanium Dioxide 4%', 'Avocado Oil', 'Iron Oxides'],
    skinTypes: ['Dry', 'Normal', 'Sensitive'],
    skinConcerns: ['Redness & Irritation', 'Dullness & Uneven Tone'],
    size: '50 mL / 1.7 fl. oz.',
    stockQuantity: 85,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 20 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 65 }
    ],
    rating: 4.8,
    reviewsCount: 115,
    isVegan: true,
    isFeatured: false,
    tags: ['TINTED_SPF', 'GLOW']
  },

  // --- EYE CARE ---
  {
    id: 'prod-21',
    sku: 'AVO-EYE-01',
    name: 'Avocado Phytosterol Eye Contour Repair Cream',
    category: 'Eye Care',
    price: 38,
    discountPrice: 32,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Rich nourishing eye cream infused with cold-pressed avocado oil, caffeine, and tripeptides to depuff under-eye bags and smooth crow’s feet overnight.',
    benefits: ['Depuffs morning eye bags', 'Smooths fine crow’s feet', 'Prevents under-eye concealer creasing'],
    ingredients: ['Avocado Phytosterols', 'Caffeine 3%', 'Palmitoyl Tripeptide-5', 'Niacinamide'],
    skinTypes: ['All', 'Dry', 'Sensitive'],
    skinConcerns: ['Dark Circles', 'Aging & Fine Lines', 'Dryness & Dehydration'],
    size: '15 mL / 0.5 fl. oz.',
    stockQuantity: 95,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 25 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 70 }
    ],
    rating: 4.86,
    reviewsCount: 140,
    isVegan: true,
    isFeatured: true,
    tags: ['BESTSELLER', 'EYE_CREAM']
  },
  {
    id: 'prod-22',
    sku: 'AVO-EYE-02',
    name: 'Cooling Avocado & Peptide Eye Hydrogel Patches (30 Pairs)',
    category: 'Eye Care',
    price: 30,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Cooling green hydrogel patches that hug the under-eye contour to instantly wake up tired eyes, brighten dark shadows, and lock in moisture.',
    benefits: ['Instant 10-minute eye awakening', 'Depuffs swollen eyelids', 'Super refreshing stored in fridge'],
    ingredients: ['Avocado Extract', 'Acetyl Tetrapeptide-5', 'Hyaluronic Acid', 'Chondrus Crispus'],
    skinTypes: ['All'],
    skinConcerns: ['Dark Circles', 'Aging & Fine Lines'],
    size: '30 Pairs / 60 Patches',
    stockQuantity: 110,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 30 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 80 }
    ],
    rating: 4.78,
    reviewsCount: 105,
    isVegan: true,
    isFeatured: false,
    tags: ['EYE_PATCHES', 'HYDROGEL']
  },

  // --- LIP CARE ---
  {
    id: 'prod-23',
    sku: 'AVO-LIP-01',
    name: 'Avocado Phytosterol Overnight Lip Butter Treatment',
    category: 'Lip Care',
    price: 18,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Ultra-cushiony leave-on lip mask enriched with avocado butter, phytosterols, and wild berry waxes that heals flaky, chapped lips while you sleep.',
    benefits: ['Heals severe lip chapping overnight', 'Plumps lip lines without tingling', 'Non-sticky silky gloss texture'],
    ingredients: ['Avocado Butter', 'Berry Wax', 'Tocopherol', 'Plant Squalane'],
    skinTypes: ['All'],
    skinConcerns: ['Dryness & Dehydration'],
    size: '15 g / 0.5 oz.',
    stockQuantity: 180,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 50 },
      { locationId: 'store-2', locationName: 'Avolab Westside Boutique', locationType: 'STORE', quantity: 40 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 90 }
    ],
    rating: 4.9,
    reviewsCount: 210,
    isVegan: true,
    isFeatured: true,
    tags: ['BESTSELLER', 'LIP_BUTTER']
  },
  {
    id: 'prod-24',
    sku: 'AVO-LIP-02',
    name: 'Botanical Hydrating Tinted Lip Oil - Sheer Avocado Glow',
    category: 'Lip Care',
    price: 20,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Nourishing oil-gloss hybrid that delivers high shine and sheer natural rosy tint without any tackiness.',
    benefits: ['Juicy glass shine finish', 'Drenches lips with omega fatty acids', 'Subtle natural flush tint'],
    ingredients: ['Avocado Seed Oil', 'Jojoba Oil', 'Red Root Botanical Extract'],
    skinTypes: ['All'],
    skinConcerns: ['Dryness & Dehydration'],
    size: '8 mL / 0.27 fl. oz.',
    stockQuantity: 125,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 35 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 90 }
    ],
    rating: 4.82,
    reviewsCount: 88,
    isVegan: true,
    isFeatured: false,
    tags: ['LIP_OIL', 'GLOW']
  },

  // --- BODY CARE ---
  {
    id: 'prod-25',
    sku: 'AVO-BDY-01',
    name: 'Avocado Nourishing Velvet Body Cream',
    category: 'Body Care',
    price: 36,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Decadent whipped body cream with raw avocado butter, shea, and ceramides that transforms dry, scaly legs and elbows into touchably soft skin.',
    benefits: ['48-hour deep body moisture', 'Non-greasy rapid absorption', 'Subtle clean green tea fragrance'],
    ingredients: ['Raw Avocado Butter', 'Shea Butter', 'Ceramide NP', 'Niacinamide 2%'],
    skinTypes: ['All', 'Dry'],
    skinConcerns: ['Dryness & Dehydration'],
    size: '250 mL / 8.5 fl. oz.',
    stockQuantity: 70,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 20 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 50 }
    ],
    rating: 4.85,
    reviewsCount: 92,
    isVegan: true,
    isFeatured: false,
    tags: ['BODY_CARE', 'HYDRATION']
  },
  {
    id: 'prod-26',
    sku: 'AVO-BDY-02',
    name: 'AHA 10% Smooth Body Resurfacing Wash',
    category: 'Body Care',
    price: 28,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Exfoliating body wash formulated with Lactic and Glycolic acids alongside avocado lipid extracts to smooth strawberry skin (keratosis pilaris) and back blemishes.',
    benefits: ['Smooths bumpy keratosis pilaris', 'Clears back & chest breakouts', 'Hydrating non-stripping foam'],
    ingredients: ['Lactic Acid 7%', 'Glycolic Acid 3%', 'Avocado Hydrogel', 'Zinc PCA'],
    skinTypes: ['All', 'Combination', 'Oily'],
    skinConcerns: ['Dullness & Uneven Tone', 'Acne & Blemishes'],
    size: '300 mL / 10.1 fl. oz.',
    stockQuantity: 65,
    stockByLocation: [
      { locationId: 'store-2', locationName: 'Avolab Westside Boutique', locationType: 'STORE', quantity: 15 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 50 }
    ],
    rating: 4.76,
    reviewsCount: 68,
    isVegan: true,
    isFeatured: false,
    tags: ['BODY_WASH', 'EXFOLIATING']
  },

  // --- SKINCARE SETS & BUNDLES ---
  {
    id: 'prod-27',
    sku: 'AVO-SET-01',
    name: 'The Daily Botanical Barrier Trio Set',
    category: 'Skincare Sets',
    price: 88,
    discountPrice: 72,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    secondaryImages: [
      '/images/avolab_cleanser_tube_1786632315682.jpg',
      '/images/avolab_cleanser_tube_1786632315682.jpg'
    ],
    description: 'Complete 3-step core daily routine bundle featuring Gentle Avocado Foaming Cleanser (150ml), Barrier Repair Serum (30ml), and Ultra-Barrier Cream (50ml). Save $18 compared to buying individually.',
    benefits: ['Complete 3-step barrier protection routine', 'Saves $18 when bundled', 'Includes eco cotton travel pouch'],
    ingredients: ['Avocado Phytosterols', 'Ceramides 5-Complex', 'Green Tea Extract', 'Niacinamide'],
    skinTypes: ['Sensitive', 'Dry', 'Normal', 'Combination'],
    skinConcerns: ['Redness & Irritation', 'Dryness & Dehydration', 'Aging & Fine Lines'],
    size: '3 Full Size Formulations',
    stockQuantity: 60,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 15 },
      { locationId: 'store-2', locationName: 'Avolab Westside Boutique', locationType: 'STORE', quantity: 10 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 35 }
    ],
    rating: 4.96,
    reviewsCount: 195,
    isVegan: true,
    isFeatured: true,
    tags: ['BESTSELLER', 'SET_BUNDLE', 'VALUE_SET', 'CAMPAIGN_SUMMER']
  },
  {
    id: 'prod-28',
    sku: 'AVO-SET-02',
    name: 'Ultimate Barrier Renewal Quad Bundle',
    category: 'Skincare Sets',
    price: 120,
    discountPrice: 98,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'The ultimate 4-piece barrier rescue kit: Cleansing Oil + Milky Toner + Barrier Serum + Ultra-Barrier Cream.',
    benefits: ['Complete morning to evening care', 'Restores dry damaged skin barrier', 'Includes luxe vegan leather cosmetic bag'],
    ingredients: ['Avocado Phytosterols', 'Ceramides 5-Complex', 'Bakuchiol', 'Hyaluronic Acid'],
    skinTypes: ['Dry', 'Sensitive'],
    skinConcerns: ['Dryness & Dehydration', 'Redness & Irritation'],
    size: '4 Full Size Products',
    stockQuantity: 45,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 10 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 35 }
    ],
    rating: 4.98,
    reviewsCount: 88,
    isVegan: true,
    isFeatured: true,
    tags: ['SET_BUNDLE', 'LUXURY_SET']
  },

  // --- TRAVEL SETS & MINIS ---
  {
    id: 'prod-29',
    sku: 'AVO-TRV-01',
    name: 'Avocado Glow Travel Mini Essentials Kit',
    category: 'Travel Sets',
    price: 36,
    discountPrice: 29,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'TSA-friendly 4-piece travel collection (Cleanser 30ml, Toner 30ml, Serum 10ml, Cream 15ml) packed in a clear waterproof airport pouch.',
    benefits: ['TSA carry-on compliant under 100mL', 'Perfect for testing AVOLAB formulas', 'Resealable waterproof clear bag'],
    ingredients: ['Avocado Phytosterols', 'Green Tea', 'Niacinamide', 'Hyaluronic Acid'],
    skinTypes: ['All'],
    skinConcerns: ['Dryness & Dehydration', 'Dullness & Uneven Tone'],
    size: '4 Travel Size Minis',
    stockQuantity: 90,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 25 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 65 }
    ],
    rating: 4.88,
    reviewsCount: 140,
    isVegan: true,
    isFeatured: true,
    tags: ['TRAVEL_SET', 'MINIS', 'BESTSELLER']
  },

  // Additional products across categories to reach ~35-40 items with high specificity
  {
    id: 'prod-30',
    sku: 'AVO-SER-06',
    name: 'Ceramide 3% Phytosterol Barrier Drops',
    category: 'Serums',
    price: 45,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Pure oil concentrate drops enriched with 3% pure ceramide complex and cold-pressed avocado lipids to mix into moisturizers or apply directly to dry patches.',
    benefits: ['Custom booster for any cream', 'Instant relief from flaking', 'Non-greasy lipid infusion'],
    ingredients: ['Ceramide NP 3%', 'Avocado Oil', 'Squalane', 'Vitamin E'],
    skinTypes: ['Dry', 'Sensitive'],
    skinConcerns: ['Dryness & Dehydration', 'Redness & Irritation'],
    size: '20 mL / 0.67 fl. oz.',
    stockQuantity: 50,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 15 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 35 }
    ],
    rating: 4.8,
    reviewsCount: 42,
    isVegan: true,
    isFeatured: false,
    tags: ['BOOSTER', 'BARRIER_CARE']
  },
  {
    id: 'prod-31',
    sku: 'AVO-TON-04',
    name: 'Rice Water & Avocado Clarifying Treatment Essence',
    category: 'Toners',
    price: 30,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'Fermented black rice water and avocado peptide essence that refines pore texture and brightens stubborn acne scars.',
    benefits: ['Evens skin tone discoloration', 'Supples rough skin texture', 'Antioxidant rich fermentation'],
    ingredients: ['Fermented Rice Filtrate', 'Avocado Peptide Extract', 'Galactomyces', 'Allantoin'],
    skinTypes: ['Normal', 'Combination', 'Oily'],
    skinConcerns: ['Dullness & Uneven Tone', 'Pore Size'],
    size: '150 mL / 5.1 fl. oz.',
    stockQuantity: 70,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 20 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 50 }
    ],
    rating: 4.75,
    reviewsCount: 61,
    isVegan: true,
    isFeatured: false,
    tags: ['ESSENCE', 'GLOW']
  },
  {
    id: 'prod-32',
    sku: 'AVO-CRM-04',
    name: 'Peptide Firming Avocado Night Moisture Cream',
    category: 'Moisturizers',
    price: 54,
    discountPrice: 46,
    image: '/images/avolab_cleanser_tube_1786632315682.jpg',
    description: 'High-performance anti-aging moisturizer packed with 6 restorative signal peptides, avocado unsaponifiables, and hyaluronic acid to lift and firm sagging jawline contours overnight.',
    benefits: ['Visibly lifts & firms skin', 'Smooths deep expression wrinkles', 'Rich comforting night texture'],
    ingredients: ['Matrixyl 3000 Peptides', 'Avocado Unsaponifiables', 'Acetyl Hexapeptide-8', 'Sodium Hyaluronate'],
    skinTypes: ['Dry', 'Normal', 'Sensitive'],
    skinConcerns: ['Aging & Fine Lines', 'Dryness & Dehydration'],
    size: '50 mL / 1.7 oz.',
    stockQuantity: 40,
    stockByLocation: [
      { locationId: 'store-1', locationName: 'Avolab Flagship Downtown', locationType: 'STORE', quantity: 10 },
      { locationId: 'wh-1', locationName: 'Central Fulfillment Facility', locationType: 'WAREHOUSE', quantity: 30 }
    ],
    rating: 4.91,
    reviewsCount: 110,
    isVegan: true,
    isFeatured: true,
    tags: ['ANTI_AGING', 'LUXURY']
  }
];

export const EXPANDED_PRODUCTS: Product[] = RAW_EXPANDED_PRODUCTS.map(p => ({
  ...p,
  image: getAVOLABProductImage(p.id, p.category, p.name, p.image),
  secondaryImages: p.secondaryImages && p.secondaryImages.length > 0
    ? p.secondaryImages.map((img, idx) => getAVOLABProductImage(`${p.id}-sec-${idx}`, p.category, p.name, img))
    : [getAVOLABProductImage(p.id, p.category, p.name)]
}));


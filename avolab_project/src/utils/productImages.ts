// Centralized AVOLAB image registry.
// Every product image used by the UI resolves to /images/<file> so it is
// served by the Express static image route in server.ts.

const IMAGE = (filename: string) => `/images/${filename}`;

const canonical = {
  cleanserTube: IMAGE('avolab_cleanser_tube_1786632315682.jpg'),
  matchaCleanser: IMAGE('avolab_matcha_cleanser_1786632377686.jpg'),
  oilCleanser: IMAGE('avolab_oil_cleanser_1786632401017.jpg'),
  tonerBottle: IMAGE('avolab_toner_bottle_1786632362142.jpg'),
  hydrationBoosters: IMAGE('avolab_hydration_boosters_1786551147171.jpg'),
  serumDropper: IMAGE('avolab_serum_dropper_1786632330474.jpg'),
  vitCSerum: IMAGE('avolab_vit_c_serum_1786632388901.jpg'),
  brighteningRitual: IMAGE('avolab_brightening_ritual_1786551131752.jpg'),
  creamJar: IMAGE('avolab_cream_jar_1786632340049.jpg'),
  barrierCare: IMAGE('avolab_barrier_care_1786551116568.jpg'),
  sunscreenTube: IMAGE('avolab_sunscreen_tube_1786632350384.jpg'),
  eyeCare: IMAGE('avolab_eye_care_1786632428875.jpg'),
  lipCare: IMAGE('avolab_lip_care_1786632442025.jpg'),
  bodyCare: IMAGE('avolab_body_care_1786632454024.jpg'),
  faceMask: IMAGE('avolab_face_mask_1786632463938.jpg'),
  skincareSet: IMAGE('avolab_skincare_set_1786632411626.jpg'),
  dailyEssentials: IMAGE('avolab_daily_essentials_1786551102511.jpg'),
  heroBanner: IMAGE('avolab_hero_banner_1786551086361.jpg'),
};

export const AVOLAB_IMAGES = canonical;

// Canonical image for every seeded product. This intentionally does not rely
// on product.image from localStorage/MySQL, because older demo data contained
// duplicated or stale image paths.
const PRODUCT_IMAGE_MAP: Record<string, string> = {
  'prod-1': canonical.cleanserTube,
  'prod-2': canonical.oilCleanser,
  'prod-3': canonical.matchaCleanser,
  'prod-4': canonical.cleanserTube,
  'prod-5': canonical.cleanserTube,
  'prod-6': canonical.tonerBottle,
  'prod-7': canonical.serumDropper,
  'prod-8': canonical.tonerBottle,
  'prod-9': canonical.serumDropper,
  'prod-10': canonical.vitCSerum,
  'prod-11': canonical.serumDropper,
  'prod-12': canonical.brighteningRitual,
  'prod-13': canonical.serumDropper,
  'prod-14': canonical.creamJar,
  'prod-15': canonical.creamJar,
  'prod-16': canonical.creamJar,
  'prod-17': canonical.faceMask,
  'prod-18': canonical.faceMask,
  'prod-19': canonical.sunscreenTube,
  'prod-20': canonical.sunscreenTube,
  'prod-21': canonical.eyeCare,
  'prod-22': canonical.eyeCare,
  'prod-23': canonical.lipCare,
  'prod-24': canonical.lipCare,
  'prod-25': canonical.bodyCare,
  'prod-26': canonical.bodyCare,
  'prod-27': canonical.skincareSet,
  'prod-28': canonical.skincareSet,
  'prod-29': canonical.skincareSet,
  'prod-30': canonical.serumDropper,
  'prod-31': canonical.tonerBottle,
  'prod-32': canonical.creamJar,
};

// Older names that exist in the project are normalized to the canonical
// timestamped files. This keeps old localStorage/order records working.
const LEGACY_FILENAME_MAP: Record<string, string> = {
  'avolab_cleanser.jpg': canonical.cleanserTube,
  'avolab_barrier_cleanser.jpg': canonical.cleanserTube,
  'avolab_matcha_cleanser.jpg': canonical.matchaCleanser,
  'avolab_oil_cleanser.jpg': canonical.oilCleanser,
  'avolab_balancing_toner.jpg': canonical.tonerBottle,
  'avolab_toner_bottle.jpg': canonical.tonerBottle,
  'avolab_botanical_glow_serum.jpg': canonical.serumDropper,
  'avolab_serum_dropper.jpg': canonical.serumDropper,
  'avolab_vitamin_c_serum.jpg': canonical.vitCSerum,
  'avolab_cream_jar.jpg': canonical.creamJar,
  'avolab_green_balance_cream.jpg': canonical.creamJar,
  'avolab_barrier_care.jpg': canonical.barrierCare,
  'avolab_sunscreen.jpg': canonical.sunscreenTube,
  'avolab_eye_care.jpg': canonical.eyeCare,
  'avolab_lip_care.jpg': canonical.lipCare,
  'avolab_body_care.jpg': canonical.bodyCare,
  'avolab_face_mask.jpg': canonical.faceMask,
  'avolab_skincare_set.jpg': canonical.skincareSet,
  'avolab_daily_essentials.jpg': canonical.dailyEssentials,
  'avolab_hero_banner.jpg': canonical.heroBanner,
  'avolab_brightening_ritual.jpg': canonical.brighteningRitual,
  'avolab_hydration_boosters.jpg': canonical.hydrationBoosters,
};

function basename(value: string): string {
  return value.split(/[\\/]/).pop() || value;
}

/** Normalize any image value stored by older versions of the app. */
export function normalizeAVOLABImage(value?: string | null, fallback = canonical.cleanserTube): string {
  if (!value) return fallback;
  const raw = String(value).trim();
  if (!raw) return fallback;

  // Keep external avatars/CDN images intact.
  if (/^https?:\/\//i.test(raw) && !raw.includes('/images/')) return raw;

  const file = basename(raw.split('?')[0]);
  if (LEGACY_FILENAME_MAP[file]) return LEGACY_FILENAME_MAP[file];

  // Convert old absolute Windows paths and /src/assets paths to the public URL.
  if (raw.includes('public\\images') || raw.includes('public/images') || raw.includes('src\\assets\\images') || raw.includes('src/assets/images')) {
    return IMAGE(file);
  }

  if (raw.startsWith('/images/')) return raw;
  if (raw.startsWith('images/')) return `/${raw}`;

  // A bare local filename is treated as a public image filename.
  if (/\.(jpe?g|png|webp|gif|svg)$/i.test(file)) return IMAGE(file);

  return fallback;
}

export function getAVOLABProductImage(
  id?: string,
  category?: string,
  name?: string,
  rawImage?: string
): string {
  if (id && PRODUCT_IMAGE_MAP[id]) return PRODUCT_IMAGE_MAP[id];

  const lowerName = (name || '').toLowerCase();
  if (lowerName.includes('oil-to-milk') || lowerName.includes('oil cleanser') || lowerName.includes('balm')) return canonical.oilCleanser;
  if (lowerName.includes('matcha') || lowerName.includes('jelly cleanser') || lowerName.includes('gel cleanser')) return canonical.matchaCleanser;
  if (lowerName.includes('cleanser') || lowerName.includes('cleansing') || lowerName.includes('foam')) return canonical.cleanserTube;
  if (lowerName.includes('toner') || lowerName.includes('mist') || lowerName.includes('essence')) return canonical.tonerBottle;
  if (lowerName.includes('vitamin c')) return canonical.vitCSerum;
  if (lowerName.includes('serum') || lowerName.includes('concentrate') || lowerName.includes('barrier drops')) return canonical.serumDropper;
  if (lowerName.includes('cream') || lowerName.includes('hydrator') || lowerName.includes('moisture') || lowerName.includes('balm')) return canonical.creamJar;
  if (lowerName.includes('sunscreen') || lowerName.includes('spf')) return canonical.sunscreenTube;
  if (lowerName.includes('eye')) return canonical.eyeCare;
  if (lowerName.includes('lip')) return canonical.lipCare;
  if (lowerName.includes('body') || lowerName.includes('wash')) return canonical.bodyCare;
  if (lowerName.includes('mask') || lowerName.includes('clay') || lowerName.includes('sheet')) return canonical.faceMask;
  if (lowerName.includes('set') || lowerName.includes('trio') || lowerName.includes('bundle') || lowerName.includes('kit')) return canonical.skincareSet;

  const lowerCat = (category || '').toLowerCase();
  if (lowerCat.includes('clean')) return canonical.cleanserTube;
  if (lowerCat.includes('toner')) return canonical.tonerBottle;
  if (lowerCat.includes('serum')) return canonical.serumDropper;
  if (lowerCat.includes('moistur') || lowerCat.includes('cream')) return canonical.creamJar;
  if (lowerCat.includes('sun')) return canonical.sunscreenTube;
  if (lowerCat.includes('eye')) return canonical.eyeCare;
  if (lowerCat.includes('lip')) return canonical.lipCare;
  if (lowerCat.includes('body')) return canonical.bodyCare;
  if (lowerCat.includes('mask')) return canonical.faceMask;
  if (lowerCat.includes('set') || lowerCat.includes('travel')) return canonical.skincareSet;

  return normalizeAVOLABImage(rawImage, canonical.cleanserTube);
}

export function getAVOLABProductImageFor(product?: { id?: string; category?: string; name?: string; image?: string | null }): string {
  if (!product) return canonical.cleanserTube;
  return getAVOLABProductImage(product.id, product.category, product.name, product.image || undefined);
}

export function getAVOLABImageWithFallback(value?: string | null, fallback = canonical.cleanserTube): string {
  return normalizeAVOLABImage(value, fallback);
}

import { EXPANDED_PRODUCTS } from './productsData';
import { 
  User,
  Product, 
  StoreLocation, 
  WarehouseLocation, 
  Order, 
  CustomerProfile, 
  Campaign, 
  AuditLog, 
  Subscription,
  NotificationItem
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'cust-00125',
    name: 'Nguyen Anh',
    email: 'customer@email.com',
    password: 'password123',
    role: 'CUSTOMER',
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%232D3B2D'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23D3E0D3' font-family='sans-serif' font-size='36' font-weight='bold'>NA</text></svg>",
    phone: '+84 908 123 456',
    skinType: 'Sensitive',
    skinConcerns: ['Dryness & Dehydration', 'Redness & Irritation'],
    loyaltyPoints: 580,
    loyaltyTier: 'Bloom',
    joinedDate: '2026-01-12'
  },
  {
    id: 'cust-101',
    name: 'Chloe Bennett',
    email: 'customer@avolab.demo',
    password: 'password123',
    role: 'CUSTOMER',
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%232D3B2D'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23D3E0D3' font-family='sans-serif' font-size='36' font-weight='bold'>CB</text></svg>",
    phone: '+1 (555) 234-5678',
    skinType: 'Combination',
    skinConcerns: ['Redness & Irritation', 'Dryness & Dehydration'],
    loyaltyPoints: 420,
    loyaltyTier: 'Sprout',
    joinedDate: '2025-11-14'
  },
  {
    id: 'cust-102',
    name: 'Ethan Wright',
    email: 'ethan.w@example.com',
    password: 'password123',
    role: 'CUSTOMER',
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%233B4A3B'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23FFFFFF' font-family='sans-serif' font-size='36' font-weight='bold'>EW</text></svg>",
    phone: '+1 (555) 987-6543',
    skinType: 'Oily',
    skinConcerns: ['Acne & Blemishes', 'Pore Size'],
    loyaltyPoints: 210,
    loyaltyTier: 'Seed',
    joinedDate: '2026-03-20'
  },
  {
    id: 'cust-103',
    name: 'Linh Tran',
    email: 'linh.tran@avolab.demo',
    password: 'password123',
    role: 'CUSTOMER',
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231C2E20'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23F4EAD4' font-family='sans-serif' font-size='36' font-weight='bold'>LT</text></svg>",
    phone: '+84 912 345 678',
    skinType: 'Sensitive',
    skinConcerns: ['Dullness & Uneven Tone', 'Dryness & Dehydration'],
    loyaltyPoints: 350,
    loyaltyTier: 'Sprout',
    joinedDate: '2026-04-15'
  },
  {
    id: 'cust-104',
    name: 'Minh Duc',
    email: 'minh.duc@example.com',
    password: 'password123',
    role: 'CUSTOMER',
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%232E4A32'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23FFFFFF' font-family='sans-serif' font-size='36' font-weight='bold'>MD</text></svg>",
    phone: '+84 933 555 777',
    skinType: 'Normal',
    skinConcerns: ['Aging & Fine Lines'],
    loyaltyPoints: 180,
    loyaltyTier: 'Seed',
    joinedDate: '2026-05-10'
  },
  {
    id: 'cust-105',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    password: 'password123',
    role: 'CUSTOMER',
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%234A5D4E'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23FFFFFF' font-family='sans-serif' font-size='36' font-weight='bold'>SJ</text></svg>",
    phone: '+1 (555) 345-6789',
    skinType: 'Dry',
    skinConcerns: ['Dryness & Dehydration', 'Aging & Fine Lines'],
    loyaltyPoints: 290,
    loyaltyTier: 'Seed',
    joinedDate: '2026-06-01'
  },
  {
    id: 'cust-106',
    name: 'Jessica Taylor',
    email: 'jessica.t@example.com',
    password: 'password123',
    role: 'CUSTOMER',
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23364938'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23FFFFFF' font-family='sans-serif' font-size='36' font-weight='bold'>JT</text></svg>",
    phone: '+1 (555) 678-1234',
    skinType: 'Combination',
    skinConcerns: ['Pore Size'],
    loyaltyPoints: 120,
    loyaltyTier: 'Seed',
    joinedDate: '2026-07-18'
  },
  {
    id: 'cust-107',
    name: 'Bao Long',
    email: 'long.bao@example.com',
    password: 'password123',
    role: 'CUSTOMER',
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23223824'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23D3E0D3' font-family='sans-serif' font-size='36' font-weight='bold'>BL</text></svg>",
    phone: '+84 977 888 999',
    skinType: 'Oily',
    skinConcerns: ['Acne & Blemishes'],
    loyaltyPoints: 460,
    loyaltyTier: 'Sprout',
    joinedDate: '2026-02-28'
  },
  {
    id: 'staff-01',
    name: 'Alex Rivers',
    email: 'staff@avolab.demo',
    password: 'password123',
    role: 'STAFF',
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%233E4F3E'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23FFFFFF' font-family='sans-serif' font-size='36' font-weight='bold'>AR</text></svg>",
    phone: '+1 (555) 876-5432',
    joinedDate: '2025-05-10'
  },
  {
    id: 'admin-01',
    name: 'Elena Vance (System Admin)',
    email: 'admin@avolab.demo',
    password: 'password123',
    role: 'ADMIN',
    avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231C2E20'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23E2DAD0' font-family='sans-serif' font-size='36' font-weight='bold'>EV</text></svg>",
    phone: '+1 (555) 999-0000',
    joinedDate: '2024-01-01'
  }
];

export const INITIAL_PRODUCTS: Product[] = EXPANDED_PRODUCTS;

export const INITIAL_STORES: StoreLocation[] = [
  {
    id: 'store-1',
    name: 'Avolab Flagship Nguyễn Huệ',
    city: 'Ho Chi Minh City',
    address: '92-94 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    phone: '(028) 3822 1092',
    hours: '09:00 - 22:00',
    latitude: 10.7743,
    longitude: 106.7032,
    isBopisAvailable: true
  },
  {
    id: 'store-2',
    name: 'Avolab Vincom Đồng Khởi',
    city: 'Ho Chi Minh City',
    address: '72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    phone: '(028) 3827 5588',
    hours: '09:30 - 22:00',
    latitude: 10.7779,
    longitude: 106.7018,
    isBopisAvailable: true
  },
  {
    id: 'store-3',
    name: 'Avolab Crescent Mall',
    city: 'Ho Chi Minh City',
    address: '101 Tôn Dật Tiên, Phường Tân Phú, Quận 7, TP. Hồ Chí Minh',
    phone: '(028) 5413 7788',
    hours: '10:00 - 22:00',
    latitude: 10.7291,
    longitude: 106.7188,
    isBopisAvailable: true
  },
  {
    id: 'store-4',
    name: 'Avolab Landmark 81',
    city: 'Ho Chi Minh City',
    address: '720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
    phone: '(028) 3636 8181',
    hours: '09:30 - 22:00',
    latitude: 10.7951,
    longitude: 106.7218,
    isBopisAvailable: true
  },
  {
    id: 'store-5',
    name: 'Avolab Tràng Tiền Plaza',
    city: 'Hanoi',
    address: '24 Tràng Tiền, Phường Tràng Tiền, Quận Hoàn Kiếm, Hà Nội',
    phone: '(024) 3936 3388',
    hours: '09:00 - 21:30',
    latitude: 21.0252,
    longitude: 105.8524,
    isBopisAvailable: true
  },
  {
    id: 'store-6',
    name: 'Avolab Vincom Royal City',
    city: 'Hanoi',
    address: '72A Nguyễn Trãi, Phường Thượng Đình, Quận Thanh Xuân, Hà Nội',
    phone: '(024) 6664 9988',
    hours: '09:30 - 22:00',
    latitude: 21.0031,
    longitude: 105.8152,
    isBopisAvailable: true
  },
  {
    id: 'store-7',
    name: 'Avolab Lotte Center Hanoi',
    city: 'Hanoi',
    address: '54 Liễu Giai, Phường Cống Vị, Quận Ba Đình, Hà Nội',
    phone: '(024) 3333 1000',
    hours: '09:30 - 22:00',
    latitude: 21.0319,
    longitude: 105.8122,
    isBopisAvailable: true
  },
  {
    id: 'store-8',
    name: 'Avolab Dragon Bridge Boutique',
    city: 'Da Nang',
    address: '188 Nguyễn Văn Linh, Phường Nam Dương, Quận Hải Châu, Đà Nẵng',
    phone: '(0236) 388 9188',
    hours: '08:30 - 21:30',
    latitude: 16.0611,
    longitude: 108.2163,
    isBopisAvailable: true
  },
  {
    id: 'store-9',
    name: 'Avolab Vincom Plaza Đà Nẵng',
    city: 'Da Nang',
    address: '910A Ngô Quyền, Phường An Hải Bắc, Quận Sơn Trà, Đà Nẵng',
    phone: '(0236) 399 6688',
    hours: '09:30 - 22:00',
    latitude: 16.0712,
    longitude: 108.2291,
    isBopisAvailable: true
  },
  {
    id: 'store-10',
    name: 'Avolab Cần Thơ Central',
    city: 'Can Tho',
    address: '209-30 Tháng 4, Phường Xuân Khánh, Quận Ninh Kiều, Cần Thơ',
    phone: '(0292) 373 8899',
    hours: '08:30 - 21:30',
    latitude: 10.0298,
    longitude: 105.7725,
    isBopisAvailable: true
  },
  {
    id: 'store-11',
    name: 'Avolab Hải Phòng Imperial',
    city: 'Hai Phong',
    address: '01 Lê Hồng Phong, Phường Đông Khê, Quận Ngô Quyền, Hải Phòng',
    phone: '(0225) 385 9988',
    hours: '09:00 - 21:30',
    latitude: 20.8561,
    longitude: 106.6994,
    isBopisAvailable: true
  },
  {
    id: 'store-12',
    name: 'Avolab Nha Trang Beachfront',
    city: 'Nha Trang',
    address: '78 Trần Phú, Phường Lộc Thọ, TP. Nha Trang, Khánh Hòa',
    phone: '(0258) 352 8899',
    hours: '08:30 - 22:00',
    latitude: 12.2388,
    longitude: 109.1961,
    isBopisAvailable: true
  }
];

export const INITIAL_WAREHOUSES: WarehouseLocation[] = [
  {
    id: 'wh-1',
    name: 'Avolab Central Logistics Warehouse',
    code: 'WH-WEST-01',
    address: '880 Fulfillment Way, Hayward, CA 94545',
    capacity: 50000,
    currentStock: 12450
  }
];

export const INITIAL_CUSTOMER: CustomerProfile = {
  id: 'cust-101',
  name: 'Chloe Bennett',
  email: 'chloe.bennett@example.com',
  phone: '+1 (555) 234-5678',
  skinType: 'Combination',
  skinConcerns: ['Redness & Irritation', 'Dryness & Dehydration', 'Dullness & Uneven Tone'],
  loyaltyPoints: 340,
  loyaltyTier: 'Sprout',
  joinedDate: '2025-11-12',
  totalSpent: 428,
  orderCount: 5,
  avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%232D3B2D'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23D3E0D3' font-family='sans-serif' font-size='36' font-weight='bold'>CB</text></svg>"
};

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    customerId: 'cust-101',
    productId: 'prod-1',
    productName: 'Gentle Avocado Foaming Cleanser',
    productImage: '/images/avolab_cleanser_tube_1786632315682.jpg',
    price: 20,
    intervalDays: 60,
    nextRefillDate: '2026-09-01',
    status: 'ACTIVE',
    quantity: 1
  },
  {
    id: 'sub-2',
    customerId: 'cust-101',
    productId: 'prod-3',
    productName: 'Vitamin C Brightening Glow Serum',
    productImage: '/images/avolab_vit_c_serum_1786632388901.jpg',
    price: 36,
    intervalDays: 30,
    nextRefillDate: '2026-08-25',
    status: 'ACTIVE',
    quantity: 1
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    title: 'Summer Glow 2026 Promo',
    code: 'SUMMERGLOW20',
    discountPercentage: 20,
    startDate: '2026-08-01',
    endDate: '2026-08-31',
    status: 'ACTIVE',
    usageCount: 142
  },
  {
    id: 'camp-2',
    title: 'Vegan Beauty Week',
    code: 'VEGAN15',
    discountPercentage: 15,
    startDate: '2026-08-10',
    endDate: '2026-08-20',
    status: 'ACTIVE',
    usageCount: 89
  }
];

export const INITIAL_ORDERS: Order[] = [
  // --- NGUYEN ANH (Unified across Website, Shopee, TikTok Shop) ---
  {
    id: 'ord-na-01',
    orderNumber: '#WEB-10025',
    customerId: 'cust-00125',
    customerName: 'Nguyen Anh',
    customerEmail: 'customer@email.com',
    customerPhone: '+84 908 123 456',
    channel: 'Website',
    salesChannel: 'Website',
    fulfillmentType: 'DELIVERY',
    shippingAddress: {
      street: '45 Lê Duẩn, Bến Nghé',
      city: 'Ho Chi Minh City',
      state: 'HCMC',
      zipCode: '700000'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Gentle Avocado Foaming Cleanser',
        productImage: '/images/avolab_cleanser_tube_1786632315682.jpg',
        sku: 'AVO-CLEAN-01',
        category: 'Cleansers',
        price: 20,
        quantity: 1
      },
      {
        productId: 'prod-4',
        productName: 'Hyaluronic Barrier Repair Serum',
        productImage: '/images/avolab_serum_dropper_1786632330474.jpg',
        sku: 'AVO-SERUM-04',
        category: 'Serums & Treatments',
        price: 38,
        quantity: 1
      }
    ],
    subtotal: 58,
    discount: 0,
    shippingFee: 0,
    total: 58,
    paymentMethod: 'CREDIT_CARD',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-08-15T10:15:00Z',
    updatedAt: '2026-08-15T14:30:00Z',
    notes: 'Official Website checkout with express delivery'
  },
  {
    id: 'ord-na-02',
    orderNumber: '#SHP-20381',
    customerId: 'cust-00125',
    customerName: 'Nguyen Anh',
    customerEmail: 'customer@email.com',
    customerPhone: '+84 908 123 456',
    channel: 'Shopee',
    salesChannel: 'Shopee',
    fulfillmentType: 'DELIVERY',
    shippingAddress: {
      street: '45 Lê Duẩn, Bến Nghé',
      city: 'Ho Chi Minh City',
      state: 'HCMC',
      zipCode: '700000'
    },
    items: [
      {
        productId: 'prod-2',
        productName: 'Hydrating Botanical Essence Toner',
        productImage: '/images/avolab_toner_bottle_1786632362142.jpg',
        sku: 'AVO-TONER-02',
        category: 'Toners & Essences',
        price: 24,
        quantity: 1
      },
      {
        productId: 'prod-1',
        productName: 'Gentle Avocado Foaming Cleanser',
        productImage: '/images/avolab_cleanser_tube_1786632315682.jpg',
        sku: 'AVO-CLEAN-01',
        category: 'Cleansers',
        price: 18,
        quantity: 1
      }
    ],
    subtotal: 42,
    discount: 0,
    shippingFee: 0,
    total: 42,
    paymentMethod: 'E_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-08-12T08:30:00Z',
    updatedAt: '2026-08-13T16:00:00Z',
    notes: 'Shopee Mall Flash Sale order synced to CRM'
  },
  {
    id: 'ord-na-03',
    orderNumber: '#TT-78123',
    customerId: 'cust-00125',
    customerName: 'Nguyen Anh',
    customerEmail: 'customer@email.com',
    customerPhone: '+84 908 123 456',
    channel: 'TikTok Shop',
    salesChannel: 'TikTok Shop',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-7',
        productName: 'Daily Invisible Mineral Sunscreen SPF 50+',
        productImage: '/images/avolab_sunscreen_tube_1786632350384.jpg',
        sku: 'AVO-SUN-07',
        category: 'Sunscreen',
        price: 35,
        quantity: 1
      }
    ],
    subtotal: 35,
    discount: 0,
    shippingFee: 0,
    total: 35,
    paymentMethod: 'E_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-08-08T19:45:00Z',
    updatedAt: '2026-08-09T11:20:00Z',
    notes: 'Purchased during TikTok LIVE Creator Showcase'
  },
  {
    id: 'ord-na-04',
    orderNumber: '#WEB-10018',
    customerId: 'cust-00125',
    customerName: 'Nguyen Anh',
    customerEmail: 'customer@email.com',
    customerPhone: '+84 908 123 456',
    channel: 'Website',
    salesChannel: 'Website',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-5',
        productName: 'Avocado Phytosterols Barrier Cream',
        productImage: '/images/avolab_cream_jar_1786632340049.jpg',
        sku: 'AVO-CREAM-05',
        category: 'Moisturizers',
        price: 42,
        quantity: 1
      },
      {
        productId: 'prod-8',
        productName: 'Peptide Firming Eye & Lip Care',
        productImage: '/images/avolab_eye_care_1786632428875.jpg',
        sku: 'AVO-EYE-08',
        category: 'Eye & Lip Care',
        price: 28,
        quantity: 1
      }
    ],
    subtotal: 70,
    discount: 0,
    shippingFee: 0,
    total: 70,
    paymentMethod: 'CREDIT_CARD',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-07-28T14:20:00Z',
    updatedAt: '2026-07-29T17:00:00Z'
  },
  {
    id: 'ord-na-05',
    orderNumber: '#SHP-20290',
    customerId: 'cust-00125',
    customerName: 'Nguyen Anh',
    customerEmail: 'customer@email.com',
    customerPhone: '+84 908 123 456',
    channel: 'Shopee',
    salesChannel: 'Shopee',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-1',
        productName: 'Gentle Avocado Foaming Cleanser',
        productImage: '/images/avolab_cleanser_tube_1786632315682.jpg',
        sku: 'AVO-CLEAN-01',
        category: 'Cleansers',
        price: 20,
        quantity: 1
      },
      {
        productId: 'prod-6',
        productName: 'Detoxifying Matcha Clay Face Mask',
        productImage: '/images/avolab_face_mask_1786632463938.jpg',
        sku: 'AVO-MASK-06',
        category: 'Masks & Exfoliants',
        price: 24,
        quantity: 1
      }
    ],
    subtotal: 44,
    discount: 0,
    shippingFee: 0,
    total: 44,
    paymentMethod: 'E_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-07-14T09:10:00Z',
    updatedAt: '2026-07-15T12:00:00Z'
  },
  {
    id: 'ord-na-06',
    orderNumber: '#TT-78044',
    customerId: 'cust-00125',
    customerName: 'Nguyen Anh',
    customerEmail: 'customer@email.com',
    customerPhone: '+84 908 123 456',
    channel: 'TikTok Shop',
    salesChannel: 'TikTok Shop',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-3',
        productName: 'Vitamin C Brightening Glow Serum',
        productImage: '/images/avolab_vit_c_serum_1786632388901.jpg',
        sku: 'AVO-SERUM-03',
        category: 'Serums & Treatments',
        price: 36,
        quantity: 1
      },
      {
        productId: 'prod-12',
        productName: 'Bio-Lipid Soothing Lip Oil',
        productImage: '/images/avolab_eye_care_1786632428875.jpg',
        sku: 'AVO-LIP-12',
        category: 'Eye & Lip Care',
        price: 9,
        quantity: 1
      }
    ],
    subtotal: 45,
    discount: 0,
    shippingFee: 0,
    total: 45,
    paymentMethod: 'E_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-06-30T21:15:00Z',
    updatedAt: '2026-07-01T15:30:00Z'
  },
  {
    id: 'ord-na-07',
    orderNumber: '#WEB-09852',
    customerId: 'cust-00125',
    customerName: 'Nguyen Anh',
    customerEmail: 'customer@email.com',
    customerPhone: '+84 908 123 456',
    channel: 'Website',
    salesChannel: 'Website',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-9',
        productName: 'Bio-Active Cleansing Oil & Melt',
        productImage: '/images/avolab_cleanser_tube_1786632315682.jpg',
        sku: 'AVO-CLEAN-09',
        category: 'Cleansers',
        price: 26,
        quantity: 1
      },
      {
        productId: 'prod-1',
        productName: 'Gentle Avocado Foaming Cleanser',
        productImage: '/images/avolab_cleanser_tube_1786632315682.jpg',
        sku: 'AVO-CLEAN-01',
        category: 'Cleansers',
        price: 20,
        quantity: 1
      }
    ],
    subtotal: 46,
    discount: 0,
    shippingFee: 0,
    total: 46,
    paymentMethod: 'CREDIT_CARD',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-06-15T11:40:00Z',
    updatedAt: '2026-06-16T16:20:00Z'
  },
  {
    id: 'ord-na-08',
    orderNumber: '#SHP-20155',
    customerId: 'cust-00125',
    customerName: 'Nguyen Anh',
    customerEmail: 'customer@email.com',
    customerPhone: '+84 908 123 456',
    channel: 'Shopee',
    salesChannel: 'Shopee',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-4',
        productName: 'Hyaluronic Barrier Repair Serum',
        productImage: '/images/avolab_serum_dropper_1786632330474.jpg',
        sku: 'AVO-SERUM-04',
        category: 'Serums & Treatments',
        price: 38,
        quantity: 1
      }
    ],
    subtotal: 38,
    discount: 0,
    shippingFee: 0,
    total: 38,
    paymentMethod: 'COD',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-05-22T13:00:00Z',
    updatedAt: '2026-05-24T10:00:00Z'
  },
  {
    id: 'ord-na-09',
    orderNumber: '#WEB-09710',
    customerId: 'cust-00125',
    customerName: 'Nguyen Anh',
    customerEmail: 'customer@email.com',
    customerPhone: '+84 908 123 456',
    channel: 'Website',
    salesChannel: 'Website',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-10',
        productName: 'Avocado Barrier Care Trio Discovery Set',
        productImage: '/images/avolab_skincare_set_1786632411626.jpg',
        sku: 'AVO-SET-10',
        category: 'Skincare Sets',
        price: 62,
        quantity: 1
      }
    ],
    subtotal: 62,
    discount: 0,
    shippingFee: 0,
    total: 62,
    paymentMethod: 'CREDIT_CARD',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-05-02T16:20:00Z',
    updatedAt: '2026-05-03T18:00:00Z'
  },
  {
    id: 'ord-na-10',
    orderNumber: '#WEB-09550',
    customerId: 'cust-00125',
    customerName: 'Nguyen Anh',
    customerEmail: 'customer@email.com',
    customerPhone: '+84 908 123 456',
    channel: 'Website',
    salesChannel: 'Website',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-1',
        productName: 'Gentle Avocado Foaming Cleanser',
        productImage: '/images/avolab_cleanser_tube_1786632315682.jpg',
        sku: 'AVO-CLEAN-01',
        category: 'Cleansers',
        price: 20,
        quantity: 1
      },
      {
        productId: 'prod-11',
        productName: 'Centella Soothing Face Mist',
        productImage: '/images/avolab_toner_bottle_1786632362142.jpg',
        sku: 'AVO-MIST-11',
        category: 'Toners & Essences',
        price: 16,
        quantity: 1
      }
    ],
    subtotal: 36,
    discount: 0,
    shippingFee: 0,
    total: 36,
    paymentMethod: 'CREDIT_CARD',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-04-10T10:00:00Z',
    updatedAt: '2026-04-11T12:00:00Z'
  },
  {
    id: 'ord-na-11',
    orderNumber: '#SHP-19940',
    customerId: 'cust-00125',
    customerName: 'Nguyen Anh',
    customerEmail: 'customer@email.com',
    customerPhone: '+84 908 123 456',
    channel: 'Shopee',
    salesChannel: 'Shopee',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-14',
        productName: 'Calming Centella Barrier Serum',
        productImage: '/images/avolab_serum_dropper_1786632330474.jpg',
        sku: 'AVO-SERUM-14',
        category: 'Serums & Treatments',
        price: 30,
        quantity: 1
      }
    ],
    subtotal: 30,
    discount: 0,
    shippingFee: 0,
    total: 30,
    paymentMethod: 'E_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-03-01T15:40:00Z',
    updatedAt: '2026-03-03T11:00:00Z'
  },
  {
    id: 'ord-na-12',
    orderNumber: '#WEB-09312',
    customerId: 'cust-00125',
    customerName: 'Nguyen Anh',
    customerEmail: 'customer@email.com',
    customerPhone: '+84 908 123 456',
    channel: 'Website',
    salesChannel: 'Website',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-1',
        productName: 'Gentle Avocado Foaming Cleanser',
        productImage: '/images/avolab_cleanser_tube_1786632315682.jpg',
        sku: 'AVO-CLEAN-01',
        category: 'Cleansers',
        price: 20,
        quantity: 1
      }
    ],
    subtotal: 20,
    discount: 0,
    shippingFee: 0,
    total: 20,
    paymentMethod: 'CREDIT_CARD',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-01-12T09:00:00Z',
    updatedAt: '2026-01-13T14:00:00Z',
    notes: 'First purchase on AVOLAB official website'
  },

  // --- CHLOE BENNETT (Website + Shopee + TikTok Shop) ---
  {
    id: 'ord-1001',
    orderNumber: '#WEB-10088',
    customerId: 'cust-101',
    customerName: 'Chloe Bennett',
    customerEmail: 'customer@avolab.demo',
    customerPhone: '+1 (555) 234-5678',
    channel: 'Website',
    salesChannel: 'Website',
    fulfillmentType: 'BOPIS',
    storeId: 'store-1',
    storeName: 'Avolab Flagship Nguyễn Huệ',
    items: [
      {
        productId: 'prod-1',
        productName: 'Gentle Avocado Foaming Cleanser',
        productImage: '/images/avolab_cleanser_tube_1786632315682.jpg',
        sku: 'AVO-CLEAN-01',
        category: 'Cleansers',
        price: 20,
        quantity: 1
      },
      {
        productId: 'prod-4',
        productName: 'Hyaluronic Barrier Repair Serum',
        productImage: '/images/avolab_serum_dropper_1786632330474.jpg',
        sku: 'AVO-SERUM-04',
        category: 'Serums & Treatments',
        price: 38,
        quantity: 1
      }
    ],
    subtotal: 58,
    discount: 5.8,
    shippingFee: 0,
    total: 52.2,
    paymentMethod: 'CREDIT_CARD',
    paymentStatus: 'PAID',
    orderStatus: 'READY_FOR_PICKUP',
    qrCodeData: 'AVOLAB-BOPIS-ord-1001-STORE1-VERIFIED',
    createdAt: '2026-08-10T14:30:00Z',
    updatedAt: '2026-08-10T15:10:00Z',
    pickedByStaff: 'Alex Rivers',
    notes: 'BOPIS Store Pickup at Flagship'
  },
  {
    id: 'ord-cb-02',
    orderNumber: '#SHP-20412',
    customerId: 'cust-101',
    customerName: 'Chloe Bennett',
    customerEmail: 'customer@avolab.demo',
    customerPhone: '+1 (555) 234-5678',
    channel: 'Shopee',
    salesChannel: 'Shopee',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-3',
        productName: 'Vitamin C Brightening Glow Serum',
        productImage: '/images/avolab_vit_c_serum_1786632388901.jpg',
        sku: 'AVO-SERUM-03',
        category: 'Serums & Treatments',
        price: 36,
        quantity: 1
      }
    ],
    subtotal: 36,
    discount: 0,
    shippingFee: 0,
    total: 36,
    paymentMethod: 'E_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-07-20T11:00:00Z',
    updatedAt: '2026-07-22T14:00:00Z'
  },
  {
    id: 'ord-cb-03',
    orderNumber: '#TT-78099',
    customerId: 'cust-101',
    customerName: 'Chloe Bennett',
    customerEmail: 'customer@avolab.demo',
    customerPhone: '+1 (555) 234-5678',
    channel: 'TikTok Shop',
    salesChannel: 'TikTok Shop',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-5',
        productName: 'Avocado Phytosterols Barrier Cream',
        productImage: '/images/avolab_cream_jar_1786632340049.jpg',
        sku: 'AVO-CREAM-05',
        category: 'Moisturizers',
        price: 42,
        quantity: 1
      }
    ],
    subtotal: 42,
    discount: 0,
    shippingFee: 0,
    total: 42,
    paymentMethod: 'E_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-06-18T18:40:00Z',
    updatedAt: '2026-06-20T10:15:00Z'
  },

  // --- ETHAN WRIGHT (Website + Shopee) ---
  {
    id: 'ord-1002',
    orderNumber: '#WEB-10044',
    customerId: 'cust-102',
    customerName: 'Ethan Wright',
    customerEmail: 'ethan.w@example.com',
    customerPhone: '+1 (555) 987-6543',
    channel: 'Website',
    salesChannel: 'Website',
    fulfillmentType: 'DELIVERY',
    shippingAddress: {
      street: '72 Lê Thánh Tôn, Bến Nghé',
      city: 'Ho Chi Minh City',
      state: 'HCMC',
      zipCode: '700000'
    },
    items: [
      {
        productId: 'prod-3',
        productName: 'Vitamin C Brightening Glow Serum',
        productImage: '/images/avolab_vit_c_serum_1786632388901.jpg',
        sku: 'AVO-SERUM-03',
        category: 'Serums & Treatments',
        price: 36,
        quantity: 1
      },
      {
        productId: 'prod-7',
        productName: 'Daily Invisible Mineral Sunscreen SPF 50+',
        productImage: '/images/avolab_sunscreen_tube_1786632350384.jpg',
        sku: 'AVO-SUN-07',
        category: 'Sunscreen',
        price: 32,
        quantity: 2
      }
    ],
    subtotal: 100,
    discount: 10,
    shippingFee: 5,
    total: 95,
    paymentMethod: 'E_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'SHIPPED',
    createdAt: '2026-08-09T09:15:00Z',
    updatedAt: '2026-08-09T16:20:00Z',
    pickedByStaff: 'Alex Rivers'
  },
  {
    id: 'ord-ew-02',
    orderNumber: '#SHP-20350',
    customerId: 'cust-102',
    customerName: 'Ethan Wright',
    customerEmail: 'ethan.w@example.com',
    customerPhone: '+1 (555) 987-6543',
    channel: 'Shopee',
    salesChannel: 'Shopee',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-5',
        productName: 'Avocado Phytosterols Barrier Cream',
        productImage: '/images/avolab_cream_jar_1786632340049.jpg',
        sku: 'AVO-CREAM-05',
        category: 'Moisturizers',
        price: 42,
        quantity: 1
      }
    ],
    subtotal: 42,
    discount: 0,
    shippingFee: 0,
    total: 42,
    paymentMethod: 'CREDIT_CARD',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-07-05T10:30:00Z',
    updatedAt: '2026-07-07T12:00:00Z'
  },

  // --- LINH TRAN (TikTok Shop + Shopee) ---
  {
    id: 'ord-lt-01',
    orderNumber: '#TT-78150',
    customerId: 'cust-103',
    customerName: 'Linh Tran',
    customerEmail: 'linh.tran@avolab.demo',
    customerPhone: '+84 912 345 678',
    channel: 'TikTok Shop',
    salesChannel: 'TikTok Shop',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-1',
        productName: 'Gentle Avocado Foaming Cleanser',
        productImage: '/images/avolab_cleanser_tube_1786632315682.jpg',
        sku: 'AVO-CLEAN-01',
        category: 'Cleansers',
        price: 20,
        quantity: 2
      }
    ],
    subtotal: 40,
    discount: 0,
    shippingFee: 0,
    total: 40,
    paymentMethod: 'E_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-08-11T20:30:00Z',
    updatedAt: '2026-08-13T15:00:00Z'
  },
  {
    id: 'ord-lt-02',
    orderNumber: '#SHP-20377',
    customerId: 'cust-103',
    customerName: 'Linh Tran',
    customerEmail: 'linh.tran@avolab.demo',
    customerPhone: '+84 912 345 678',
    channel: 'Shopee',
    salesChannel: 'Shopee',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-2',
        productName: 'Hydrating Botanical Essence Toner',
        productImage: '/images/avolab_toner_bottle_1786632362142.jpg',
        sku: 'AVO-TONER-02',
        category: 'Toners & Essences',
        price: 24,
        quantity: 1
      },
      {
        productId: 'prod-8',
        productName: 'Peptide Firming Eye & Lip Care',
        productImage: '/images/avolab_eye_care_1786632428875.jpg',
        sku: 'AVO-EYE-08',
        category: 'Eye & Lip Care',
        price: 28,
        quantity: 1
      }
    ],
    subtotal: 52,
    discount: 5,
    shippingFee: 0,
    total: 47,
    paymentMethod: 'E_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-07-18T14:15:00Z',
    updatedAt: '2026-07-20T09:30:00Z'
  },
  {
    id: 'ord-lt-03',
    orderNumber: '#TT-78110',
    customerId: 'cust-103',
    customerName: 'Linh Tran',
    customerEmail: 'linh.tran@avolab.demo',
    customerPhone: '+84 912 345 678',
    channel: 'TikTok Shop',
    salesChannel: 'TikTok Shop',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-7',
        productName: 'Daily Invisible Mineral Sunscreen SPF 50+',
        productImage: '/images/avolab_sunscreen_tube_1786632350384.jpg',
        sku: 'AVO-SUN-07',
        category: 'Sunscreen',
        price: 32,
        quantity: 1
      }
    ],
    subtotal: 32,
    discount: 0,
    shippingFee: 0,
    total: 32,
    paymentMethod: 'E_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'SHIPPED',
    createdAt: '2026-08-13T19:00:00Z',
    updatedAt: '2026-08-14T11:00:00Z'
  },

  // --- MINH DUC (Shopee) ---
  {
    id: 'ord-md-01',
    orderNumber: '#SHP-20399',
    customerId: 'cust-104',
    customerName: 'Minh Duc',
    customerEmail: 'minh.duc@example.com',
    customerPhone: '+84 933 555 777',
    channel: 'Shopee',
    salesChannel: 'Shopee',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-1',
        productName: 'Gentle Avocado Foaming Cleanser',
        productImage: '/images/avolab_cleanser_tube_1786632315682.jpg',
        sku: 'AVO-CLEAN-01',
        category: 'Cleansers',
        price: 20,
        quantity: 1
      }
    ],
    subtotal: 20,
    discount: 0,
    shippingFee: 0,
    total: 20,
    paymentMethod: 'COD',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-08-05T12:00:00Z',
    updatedAt: '2026-08-07T10:00:00Z'
  },
  {
    id: 'ord-md-02',
    orderNumber: '#SHP-20210',
    customerId: 'cust-104',
    customerName: 'Minh Duc',
    customerEmail: 'minh.duc@example.com',
    customerPhone: '+84 933 555 777',
    channel: 'Shopee',
    salesChannel: 'Shopee',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-4',
        productName: 'Hyaluronic Barrier Repair Serum',
        productImage: '/images/avolab_serum_dropper_1786632330474.jpg',
        sku: 'AVO-SERUM-04',
        category: 'Serums & Treatments',
        price: 38,
        quantity: 1
      }
    ],
    subtotal: 38,
    discount: 0,
    shippingFee: 0,
    total: 38,
    paymentMethod: 'COD',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-06-10T16:30:00Z',
    updatedAt: '2026-06-12T14:00:00Z'
  },

  // --- SARAH JENKINS (Website) ---
  {
    id: 'ord-sj-01',
    orderNumber: '#WEB-10062',
    customerId: 'cust-105',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '+1 (555) 345-6789',
    channel: 'Website',
    salesChannel: 'Website',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-15',
        productName: 'Phyto-Retinol Night Renewal Oil',
        productImage: '/images/avolab_serum_dropper_1786632330474.jpg',
        sku: 'AVO-OIL-15',
        category: 'Serums & Treatments',
        price: 54,
        quantity: 1
      }
    ],
    subtotal: 54,
    discount: 0,
    shippingFee: 0,
    total: 54,
    paymentMethod: 'CREDIT_CARD',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-08-01T15:00:00Z',
    updatedAt: '2026-08-02T18:00:00Z'
  },

  // --- JESSICA TAYLOR (TikTok Shop) ---
  {
    id: 'ord-jt-01',
    orderNumber: '#TT-78180',
    customerId: 'cust-106',
    customerName: 'Jessica Taylor',
    customerEmail: 'jessica.t@example.com',
    customerPhone: '+1 (555) 678-1234',
    channel: 'TikTok Shop',
    salesChannel: 'TikTok Shop',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-12',
        productName: 'Bio-Lipid Soothing Lip Oil',
        productImage: '/images/avolab_eye_care_1786632428875.jpg',
        sku: 'AVO-LIP-12',
        category: 'Eye & Lip Care',
        price: 14,
        quantity: 1
      },
      {
        productId: 'prod-6',
        productName: 'Detoxifying Matcha Clay Face Mask',
        productImage: '/images/avolab_face_mask_1786632463938.jpg',
        sku: 'AVO-MASK-06',
        category: 'Masks & Exfoliants',
        price: 24,
        quantity: 1
      }
    ],
    subtotal: 38,
    discount: 0,
    shippingFee: 0,
    total: 38,
    paymentMethod: 'E_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-08-14T22:10:00Z',
    updatedAt: '2026-08-15T09:00:00Z'
  },

  // --- BAO LONG (Shopee + TikTok Shop) ---
  {
    id: 'ord-bl-01',
    orderNumber: '#SHP-20450',
    customerId: 'cust-107',
    customerName: 'Bao Long',
    customerEmail: 'long.bao@example.com',
    customerPhone: '+84 977 888 999',
    channel: 'Shopee',
    salesChannel: 'Shopee',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-10',
        productName: 'Avocado Barrier Care Trio Discovery Set',
        productImage: '/images/avolab_skincare_set_1786632411626.jpg',
        sku: 'AVO-SET-10',
        category: 'Skincare Sets',
        price: 62,
        quantity: 1
      }
    ],
    subtotal: 62,
    discount: 0,
    shippingFee: 0,
    total: 62,
    paymentMethod: 'E_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-08-04T13:20:00Z',
    updatedAt: '2026-08-06T11:00:00Z'
  },
  {
    id: 'ord-bl-02',
    orderNumber: '#TT-78165',
    customerId: 'cust-107',
    customerName: 'Bao Long',
    customerEmail: 'long.bao@example.com',
    customerPhone: '+84 977 888 999',
    channel: 'TikTok Shop',
    salesChannel: 'TikTok Shop',
    fulfillmentType: 'DELIVERY',
    items: [
      {
        productId: 'prod-7',
        productName: 'Daily Invisible Mineral Sunscreen SPF 50+',
        productImage: '/images/avolab_sunscreen_tube_1786632350384.jpg',
        sku: 'AVO-SUN-07',
        category: 'Sunscreen',
        price: 32,
        quantity: 1
      }
    ],
    subtotal: 32,
    discount: 0,
    shippingFee: 0,
    total: 32,
    paymentMethod: 'E_WALLET',
    paymentStatus: 'PAID',
    orderStatus: 'COMPLETED',
    createdAt: '2026-07-25T17:40:00Z',
    updatedAt: '2026-07-27T10:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-11T08:15:00Z',
    userId: 'admin-01',
    userName: 'System Administrator',
    userRole: 'ADMIN',
    action: 'UPDATE_CAMPAIGN',
    entity: 'Campaign',
    entityId: 'camp-1',
    details: 'Updated Summer Glow 2026 discount to 20%'
  },
  {
    id: 'log-2',
    timestamp: '2026-08-10T15:10:00Z',
    userId: 'staff-01',
    userName: 'Alex Rivers (Staff)',
    userRole: 'STAFF',
    action: 'UPDATE_ORDER_STATUS',
    entity: 'Order',
    entityId: 'ord-1001',
    details: 'Changed order AVO-2026-8801 status from PICKING to READY_FOR_PICKUP'
  },
  {
    id: 'log-3',
    timestamp: '2026-08-10T14:30:00Z',
    userId: 'cust-101',
    userName: 'Chloe Bennett',
    userRole: 'CUSTOMER',
    action: 'CREATE_ORDER',
    entity: 'Order',
    entityId: 'ord-1001',
    details: 'Placed BOPIS order AVO-2026-8801 for $52.20'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    recipientRole: 'CUSTOMER',
    recipientUserId: 'cust-101',
    title: 'Order Ready for Pickup! 🛍️',
    message: 'Your BOPIS Order #AVO-2026-8801 is ready at Avolab Flagship Downtown. Present your QR code upon arrival.',
    type: 'ORDER',
    read: false,
    createdAt: '2026-08-10T15:10:00Z',
    link: 'ORDERS'
  },
  {
    id: 'notif-2',
    recipientRole: 'STAFF',
    title: 'New BOPIS Order Received 📦',
    message: 'Order #AVO-2026-8801 requires picking at Avolab Flagship Downtown.',
    type: 'INVENTORY',
    read: true,
    createdAt: '2026-08-10T14:30:00Z',
    link: 'STAFF_BOPIS'
  },
  {
    id: 'notif-3',
    recipientRole: 'ADMIN',
    title: 'Inventory Alert: Barrier Cream Low Stock ⚠️',
    message: 'Avocado Phytosterols Cream has dropped to 8 units at Flagship store.',
    type: 'INVENTORY',
    read: false,
    createdAt: '2026-08-11T07:00:00Z',
    link: 'ADMIN_ORDERS'
  }
];

import { AVOLAB_IMAGES } from '../utils/productImages';

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Cleansers', slug: 'cleansers', description: 'Gentle, pH-balanced daily botanical cleansers', image: AVOLAB_IMAGES.cleanserTube, displayOrder: 1, status: 'ACTIVE' as const },
  { id: 'cat-2', name: 'Toners & Essences', slug: 'toners', description: 'Hydrating, skin-soothing bio-active essences', image: AVOLAB_IMAGES.tonerBottle, displayOrder: 2, status: 'ACTIVE' as const },
  { id: 'cat-3', name: 'Serums & Treatments', slug: 'serums', description: 'Targeted bioactive formulas for tone & barrier repair', image: AVOLAB_IMAGES.serumDropper, displayOrder: 3, status: 'ACTIVE' as const },
  { id: 'cat-4', name: 'Moisturizers', slug: 'moisturizers', description: 'Nourishing creams & lipid sealers for lasting dewiness', image: AVOLAB_IMAGES.creamJar, displayOrder: 4, status: 'ACTIVE' as const },
  { id: 'cat-5', name: 'Masks & Exfoliants', slug: 'masks', description: 'Overnight detoxifying & enzymatic smoothing masks', image: AVOLAB_IMAGES.faceMask, displayOrder: 5, status: 'ACTIVE' as const },
  { id: 'cat-6', name: 'Sunscreen', slug: 'sunscreen', description: 'Weightless 100% mineral daily UV protection', image: AVOLAB_IMAGES.sunscreenTube, displayOrder: 6, status: 'ACTIVE' as const },
  { id: 'cat-7', name: 'Eye & Lip Care', slug: 'eye-lip', description: 'Concentrated peptide eye creams and lip oils', image: AVOLAB_IMAGES.eyeCare, displayOrder: 7, status: 'ACTIVE' as const },
  { id: 'cat-8', name: 'Skincare Sets', slug: 'sets', description: 'Curated bio-routine regimens & travel kits', image: AVOLAB_IMAGES.skincareSet, displayOrder: 8, status: 'ACTIVE' as const }
];

export const INITIAL_PROMOTIONS = [
  { id: 'promo-1', name: 'Summer Glow 2026', code: 'SUMMERGLOW20', description: '20% off all orders above $50', discountType: 'PERCENTAGE' as const, discountValue: 20, minOrder: 50, maxDiscount: 40, startDate: '2026-08-01', endDate: '2026-08-31', usageLimit: 500, usedCount: 142, status: 'ACTIVE' as const },
  { id: 'promo-2', name: 'Vegan Beauty Week', code: 'VEGAN15', description: '15% off certified plant-powered cosmetics', discountType: 'PERCENTAGE' as const, discountValue: 15, minOrder: 30, maxDiscount: 25, startDate: '2026-08-10', endDate: '2026-08-20', usageLimit: 300, usedCount: 89, status: 'ACTIVE' as const },
  { id: 'promo-3', name: 'New Customer Welcome', code: 'WELCOME10', description: '$10 off your first Avolab order', discountType: 'FIXED' as const, discountValue: 10, minOrder: 40, maxDiscount: 10, startDate: '2026-01-01', endDate: '2026-12-31', usageLimit: 1000, usedCount: 412, status: 'ACTIVE' as const },
  { id: 'promo-4', name: 'Complimentary Express Shipping', code: 'FREESHIP50', description: 'Free shipping on orders $50+', discountType: 'FREE_SHIPPING' as const, discountValue: 100, minOrder: 50, maxDiscount: 15, startDate: '2026-01-01', endDate: '2026-12-31', usageLimit: 2000, usedCount: 850, status: 'ACTIVE' as const }
];

export const INITIAL_LOYALTY_TIERS = [
  { id: 'tier-1', name: 'Seedling', minPoints: 0, benefits: ['Standard 1x Points Earning', 'Birthday Skin Sample Gift', 'Standard Shipping'], discountPercent: 0, birthdayReward: 'Mini Cleanser (30ml)', freeShipping: false, earlyAccess: false, status: 'ACTIVE' as const },
  { id: 'tier-2', name: 'Bloom', minPoints: 500, benefits: ['1.25x Points Multiplier', '5% Off All Orders', 'Free Standard Shipping over $35', 'Seasonal Deluxe Samples'], discountPercent: 5, birthdayReward: '$15 Store Credit Voucher', freeShipping: true, earlyAccess: true, status: 'ACTIVE' as const },
  { id: 'tier-3', name: 'Radiance', minPoints: 2000, benefits: ['1.5x Points Multiplier', '10% Off All Orders', 'Free Express Shipping Always', '1-on-1 AI Masterclass Consultation', 'VIP Early Access to New Launches'], discountPercent: 10, birthdayReward: 'Full-Size Hero Serum Gift ($48 Value)', freeShipping: true, earlyAccess: true, status: 'ACTIVE' as const }
];

export const INITIAL_REWARDS = [
  { id: 'rew-1', name: '$10 Store Credit Voucher', description: 'Redeemable on any order above $30', pointsRequired: 200, discountValue: 10, expirationDays: 60, status: 'ACTIVE' as const },
  { id: 'rew-2', name: 'Deluxe Mini Barrier Serum (15ml)', description: 'Hydrating travel-size serum voucher', pointsRequired: 350, discountValue: 18, expirationDays: 90, status: 'ACTIVE' as const },
  { id: 'rew-3', name: 'Free Express Courier Shipping', description: 'Waives express delivery fee on next order', pointsRequired: 150, discountValue: 12, expirationDays: 30, status: 'ACTIVE' as const },
  { id: 'rew-4', name: '$25 Premium Beauty Voucher', description: 'Redeemable on orders $75+', pointsRequired: 500, discountValue: 25, expirationDays: 90, status: 'ACTIVE' as const }
];

export const INITIAL_STOCK_TRANSFERS = [
  { id: 'st-1', transferNumber: 'ST-2026-101', sourceLocationId: 'wh-1', sourceLocationName: 'Avolab Central Logistics Warehouse', destinationLocationId: 'store-1', destinationLocationName: 'Avolab Flagship Downtown', productId: 'prod-1', productName: 'Gentle Avocado Foaming Cleanser', sku: 'AVO-CLEAN-01', quantity: 50, reason: 'High weekend foot traffic replenishment', requestDate: '2026-08-09', status: 'IN_TRANSIT' as const },
  { id: 'st-2', transferNumber: 'ST-2026-102', sourceLocationId: 'wh-1', sourceLocationName: 'Avolab Central Logistics Warehouse', destinationLocationId: 'store-2', destinationLocationName: 'Avolab Green Beauty Mall', productId: 'prod-3', productName: 'Vitamin C Brightening Glow Serum', sku: 'AVO-SERUM-03', quantity: 30, reason: 'BOPIS campaign surge stock up', requestDate: '2026-08-10', status: 'APPROVED' as const }
];

export const INITIAL_BANNERS = [
  { id: 'ban-1', title: 'Summer Botanical Defense', subtitle: 'Phyto-active antioxidant serums for radiant UV recovery.', image: '/images/avolab_hero_banner_1786551086361.jpg', ctaText: 'Explore Summer Essentials', linkUrl: 'SHOP', startDate: '2026-08-01', endDate: '2026-08-31', status: 'ACTIVE' as const },
  { id: 'ban-2', title: 'Avocado Phytosterols Barrier Line', subtitle: 'Restores skin lipids in as little as 3 days.', image: '/images/avolab_barrier_care_1786551116568.jpg', ctaText: 'Discover Lipid Science', linkUrl: 'SHOP', startDate: '2026-08-05', endDate: '2026-09-15', status: 'ACTIVE' as const }
];

export const INITIAL_FAQS = [
  { id: 'faq-1', question: 'How does BOPIS (Buy Online, Pick Up In Store) work?', answer: 'Place your order online and select your preferred Avolab store. When staff packs your items, you will receive a QR pickup pass via SMS/Email. Visit the store, present your QR code, and pick up instantly!', category: 'BOPIS & Pickup', status: 'ACTIVE' as const },
  { id: 'faq-2', question: 'Are Avolab products 100% Vegan & Cruelty-Free?', answer: 'Yes! All Avolab formulas are 100% Leaping Bunny certified cruelty-free, vegan, and packaged in post-consumer recycled glass and paper.', category: 'Product & Ingredients', status: 'ACTIVE' as const },
  { id: 'faq-3', question: 'How does the AI Beauty Assistant determine my match score?', answer: 'Our AI analyzes your skin type, primary concerns, sensitive ingredients, and climate factors to calculate a personalized compatibility percentage (0-100%).', category: 'AI & Routine', status: 'ACTIVE' as const }
];

export const INITIAL_ARTICLES = [
  { id: 'art-1', title: 'Understanding Lipid Barrier Repair in Sensitive Skin', coverImage: '/images/avolab_barrier_care_1786551116568.jpg', author: 'Dr. Evelyn Vance, Chief Bio-Chemist', content: 'The stratum corneum relies heavily on a precise ratio of ceramides, cholesterol, and free fatty acids. Cold air, over-exfoliation, and harsh surfactants erode this protective sheath...', category: 'Skin Science', tags: ['Barrier Repair', 'Sensitive Skin', 'Ceramides'], publicationDate: '2026-08-01', status: 'PUBLISHED' as const },
  { id: 'art-2', title: 'Why Cold-Pressed Avocado Oil is a Skincare Superfood', coverImage: '/images/avolab_daily_essentials_1786551102511.jpg', author: 'Avolab Research Lab', content: 'Rich in oleic acid, vitamin E, and bioactive phytosterols, cold-pressed organic avocado oil penetrates deeply without clogging pores, offering unmatched soothing power...', category: 'Ingredients', tags: ['Botanicals', 'Avocado', 'Hydration'], publicationDate: '2026-08-05', status: 'PUBLISHED' as const }
];

export const INITIAL_SYSTEM_SETTINGS = {
  storeName: 'AVOLAB COSMETICS',
  logo: 'AVOLAB',
  contactEmail: 'support@avolabcosmetics.demo',
  phone: '+1 (800) 555-AVO-CARE',
  currency: 'USD ($)',
  taxRate: 8.5,
  shippingFee: 5.0,
  minFreeShippingOrder: 50.0,
  bopisEnabled: true,
  pickupWindowHours: 48,
  aiEnabled: true,
  skinTypeWeight: 35,
  concernWeight: 35,
  ingredientWeight: 15,
  purchaseHistoryWeight: 10,
  browsingWeight: 5,
  recommendationWeights: {
    skinType: 30,
    concerns: 25,
    attributes: 15,
    texture: 10,
    price: 10,
    behavioral: 10
  }
};

export const INITIAL_SUPPORT_TICKETS = [
  {
    id: 'tkt-101',
    ticketNumber: 'TKT-2026-801',
    customerId: 'cust-101',
    customerName: 'Chloe Bennett',
    customerEmail: 'chloe.bennett@example.com',
    subject: 'BOPIS Order Pickup Timing Question',
    status: 'IN_PROGRESS' as const,
    priority: 'MEDIUM' as const,
    createdAt: '2026-08-11T09:00:00Z',
    updatedAt: '2026-08-11T09:30:00Z',
    messages: [
      {
        id: 'msg-1',
        senderRole: 'CUSTOMER' as const,
        senderName: 'Chloe Bennett',
        message: 'Hi! I placed order AVO-2026-8801 for BOPIS pickup at Downtown Flagship. Can I pick it up after 6 PM today?',
        timestamp: '2026-08-11T09:00:00Z'
      },
      {
        id: 'msg-2',
        senderRole: 'STAFF' as const,
        senderName: 'Alex Rivers (Staff)',
        message: 'Hello Chloe! Yes, your order is packed and ready at counter #2. Downtown Flagship is open until 8 PM tonight!',
        timestamp: '2026-08-11T09:30:00Z'
      }
    ]
  }
];


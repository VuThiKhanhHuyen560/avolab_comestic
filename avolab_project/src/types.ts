export type UserRole = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  skinType?: SkinType;
  skinConcerns?: SkinConcern[];
  loyaltyPoints?: number;
  loyaltyTier?: 'Seed' | 'Sprout' | 'Bloom' | 'Flora';
  joinedDate?: string;
}

export type SkinType = 'Dry' | 'Oily' | 'Combination' | 'Sensitive' | 'Normal' | 'All';

export type SkinConcern = 
  | 'Acne & Blemishes'
  | 'Dryness & Dehydration'
  | 'Redness & Irritation'
  | 'Dullness & Uneven Tone'
  | 'Aging & Fine Lines'
  | 'Dark Circles'
  | 'Pore Size';

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface StockByLocation {
  locationId: string;
  locationName: string;
  locationType: 'STORE' | 'WAREHOUSE';
  quantity: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  image: string;
  secondaryImages?: string[];
  description: string;
  benefits: string[];
  ingredients: string[];
  skinTypes: SkinType[];
  skinConcerns: SkinConcern[];
  size: string;
  stockQuantity: number;
  totalStock?: number;
  stockByLocation: StockByLocation[];
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
  isVegan: boolean;
  isFeatured: boolean;
  tags: string[];
  aiMatchScore?: number;
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  latitude: number;
  longitude: number;
  isBopisAvailable: boolean;
}

export interface WarehouseLocation {
  id: string;
  name: string;
  code: string;
  address: string;
  capacity: number;
  currentStock: number;
}

export type OrderStatus = 
  | 'PENDING'
  | 'PROCESSING'
  | 'PICKING'
  | 'PACKED'
  | 'SHIPPED'
  | 'READY_FOR_PICKUP'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export type FulfillmentType = 'DELIVERY' | 'BOPIS';

export type SalesChannel = 'Website' | 'Shopee' | 'TikTok Shop';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface OrderReview {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  channel?: SalesChannel;
  salesChannel?: SalesChannel;
  fulfillmentType: FulfillmentType;
  storeId?: string;
  storeName?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'CREDIT_CARD' | 'E_WALLET' | 'COD' | 'PAYMENT_SIMULATION';
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED';
  orderStatus: OrderStatus;
  qrCodeData?: string;
  createdAt: string;
  updatedAt: string;
  pickedByStaff?: string;
  notes?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  skinType: SkinType;
  skinConcerns: SkinConcern[];
  loyaltyPoints: number;
  loyaltyTier: 'Seed' | 'Sprout' | 'Bloom' | 'Flora';
  joinedDate: string;
  totalSpent: number;
  orderCount: number;
  avatar: string;
}

export interface Subscription {
  id: string;
  customerId: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  intervalDays: 30 | 60 | 90;
  nextRefillDate: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  quantity: number;
}

export interface Campaign {
  id: string;
  title: string;
  code: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'SCHEDULED' | 'EXPIRED';
  usageCount: number;
}

export interface NotificationItem {
  id: string;
  recipientRole: 'CUSTOMER' | 'STAFF' | 'ADMIN' | 'ALL';
  recipientUserId?: string;
  title: string;
  message: string;
  type: 'ORDER' | 'INVENTORY' | 'PROMO' | 'SYSTEM' | 'LOYALTY';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
}

export interface SupportTicketMessage {
  id: string;
  senderRole: 'CUSTOMER' | 'STAFF' | 'ADMIN';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
  messages: SupportTicketMessage[];
}

export interface DemandForecastItem {
  productId: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  predictedDemand30Days: number;
  stockoutRisk: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendedReorderQty: number;
  salesVelocityPerDay: number;
  trend: 'UP' | 'STABLE' | 'DOWN';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentCategory?: string;
  displayOrder: number;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface Promotion {
  id: string;
  name: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING' | 'BUY_X_GET_Y';
  discountValue: number;
  minOrder: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'ACTIVE' | 'INACTIVE';
  eligibleCategories?: string[];
}

export interface LoyaltyTierInfo {
  id: string;
  name: string;
  minPoints: number;
  benefits: string[];
  discountPercent: number;
  birthdayReward: string;
  freeShipping: boolean;
  earlyAccess: boolean;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  discountValue: number;
  expirationDays: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  sourceLocationId: string;
  sourceLocationName: string;
  destinationLocationId: string;
  destinationLocationName: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  reason: string;
  requestDate: string;
  status: 'REQUESTED' | 'APPROVED' | 'IN_TRANSIT' | 'RECEIVED' | 'CANCELLED';
}

export interface ContentBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  linkUrl: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface BeautyArticle {
  id: string;
  title: string;
  coverImage: string;
  author: string;
  content: string;
  category: string;
  tags: string[];
  publicationDate: string;
  status: 'PUBLISHED' | 'DRAFT';
}

export interface SystemSettings {
  storeName: string;
  logo: string;
  contactEmail: string;
  phone: string;
  currency: string;
  taxRate: number;
  shippingFee: number;
  minFreeShippingOrder: number;
  bopisEnabled: boolean;
  pickupWindowHours: number;
  aiEnabled: boolean;
  skinTypeWeight: number;
  concernWeight: number;
  ingredientWeight: number;
  purchaseHistoryWeight: number;
  browsingWeight: number;
  recommendationWeights?: {
    skinType: number;
    concerns: number;
    attributes: number;
    texture: number;
    price: number;
    behavioral: number;
  };
}


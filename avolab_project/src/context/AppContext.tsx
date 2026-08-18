import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  UserRole,
  User, 
  Product, 
  StoreLocation, 
  WarehouseLocation, 
  Order, 
  OrderStatus,
  OrderReview, 
  CustomerProfile, 
  Campaign, 
  AuditLog, 
  Subscription, 
  NotificationItem,
  DemandForecastItem,
  SkinType,
  SkinConcern,
  Category,
  Promotion,
  LoyaltyTierInfo,
  RewardItem,
  StockTransfer,
  ContentBanner,
  FAQItem,
  BeautyArticle,
  SystemSettings,
  SupportTicket
} from '../types';
import { 
  INITIAL_USERS,
  INITIAL_PRODUCTS, 
  INITIAL_STORES, 
  INITIAL_WAREHOUSES, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMER, 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_CAMPAIGNS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_CATEGORIES,
  INITIAL_PROMOTIONS,
  INITIAL_LOYALTY_TIERS,
  INITIAL_REWARDS,
  INITIAL_STOCK_TRANSFERS,
  INITIAL_BANNERS,
  INITIAL_FAQS,
  INITIAL_ARTICLES,
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_SUPPORT_TICKETS
} from '../data/initialData';
import { getAVOLABProductImage, getAVOLABProductImageFor } from '../utils/productImages';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ActiveTab = 
  // Authentication Views
  | 'LOGIN'
  | 'CUSTOMER_LOGIN'
  | 'CUSTOMER_REGISTER'
  | 'STAFF_LOGIN'
  | 'ADMIN_LOGIN'
  | 'FORGOT_PASSWORD'
  | 'PASSWORD_RESET'
  // Customer Views
  | 'HOME'
  | 'SHOP'
  | 'AI_BEAUTY_ASSISTANT'
  | 'PRODUCT_DETAIL'
  | 'CART'
  | 'CHECKOUT'
  | 'ORDER_CONFIRMATION'
  | 'ORDERS'
  | 'NOTIFICATIONS'
  | 'WISHLIST_COMPARE'
  | 'STORE_LOCATOR'
  | 'LOYALTY'
  | 'SUBSCRIPTIONS'
  | 'SUPPORT'
  | 'ACCOUNT'
  // Staff Views
  | 'STAFF_DASHBOARD'
  | 'STAFF_ORDERS'
  | 'STAFF_BOPIS'
  | 'STAFF_INVENTORY'
  | 'STAFF_CUSTOMERS'
  | 'STAFF_SUPPORT'
  // Admin Views
  | 'ADMIN_DASHBOARD'
  | 'ADMIN_PRODUCTS'
  | 'ADMIN_CATALOG'
  | 'ADMIN_CATEGORIES'
  | 'ADMIN_PROMOTIONS'
  | 'ADMIN_CAMPAIGNS'
  | 'ADMIN_CUSTOMERS'
  | 'ADMIN_CRM'
  | 'ADMIN_INVENTORY'
  | 'ADMIN_INVENTORY_MATRIX'
  | 'ADMIN_STORES'
  | 'ADMIN_LOYALTY'
  | 'ADMIN_AI'
  | 'ADMIN_FORECASTING'
  | 'ADMIN_REPORTS'
  | 'ADMIN_BI_ANALYTICS'
  | 'ADMIN_USERS'
  | 'ADMIN_CONTENT'
  | 'ADMIN_SETTINGS'
  | 'ADMIN_AUDIT'
  | 'ADMIN_AUDIT_LOGS'
  | 'ADMIN_ORDERS';

interface AppContextType {
  // Role & View State
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  redirectAfterLogin: ActiveTab | null;
  setRedirectAfterLogin: (tab: ActiveTab | null) => void;

  // Authentication & RBAC
  users: User[];
  currentUser: User | null;
  login: (email: string, password: string) => { success: boolean; message: string; user?: User };
  registerCustomer: (data: { name: string; email: string; password: string; skinType: SkinType; phone?: string; skinConcerns?: SkinConcern[] }) => { success: boolean; message: string; user?: User };
  logout: () => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, partial: Partial<User>) => void;
  toggleUserStatus: (id: string) => void;

  // Shared Data
  products: Product[];
  categories: Category[];
  promotions: Promotion[];
  stores: StoreLocation[];
  warehouses: WarehouseLocation[];
  orders: Order[];
  customer: CustomerProfile;
  subscriptions: Subscription[];
  campaigns: Campaign[];
  loyaltyTiers: LoyaltyTierInfo[];
  rewards: RewardItem[];
  stockTransfers: StockTransfer[];
  banners: ContentBanner[];
  faqs: FAQItem[];
  articles: BeautyArticle[];
  systemSettings: SystemSettings;
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  wishlist: string[];
  compareList: string[];
  cart: CartItem[];
  
  // Cart Actions
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Modals & UI Controls
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  isAiBotOpen: boolean;
  setIsAiBotOpen: (open: boolean) => void;
  isQrModalOpen: boolean;
  setIsQrModalOpen: (open: boolean) => void;
  qrModalOrder: Order | null;
  setQrModalOrder: (order: Order | null) => void;
  
  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Staff Store Context
  currentStaffStoreId: string;
  setCurrentStaffStoreId: (storeId: string) => void;

  // Domain & Admin CRUD Actions
  toggleWishlist: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  placeOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  verifyBopisQr: (qrData: string) => Promise<{ success: boolean; message: string; order?: Order }>;
  verifyQrCode: (qrData: string) => Promise<{ success: boolean; message: string; order?: Order }>;
  completeBopisPickup: (orderId: string) => Promise<{ success: boolean; message: string; order?: Order }>;
  updateProduct: (productOrId: Product | string, partialData?: Partial<Product>) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  
  // Category Actions
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, partial: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Promotion Actions
  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  updatePromotion: (id: string, partial: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;

  // Campaign Actions
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  createCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateCampaign: (id: string, partial: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;

  // Loyalty & Rewards Actions
  addLoyaltyTier: (tier: Omit<LoyaltyTierInfo, 'id'>) => void;
  updateLoyaltyTier: (id: string, partial: Partial<LoyaltyTierInfo>) => void;
  addReward: (reward: Omit<RewardItem, 'id'>) => void;
  updateReward: (id: string, partial: Partial<RewardItem>) => void;
  deleteReward: (id: string) => void;

  // Stores & Warehouses Actions
  addStore: (store: Omit<StoreLocation, 'id'>) => void;
  updateStore: (id: string, partial: Partial<StoreLocation>) => void;
  deleteStore: (id: string) => void;
  addWarehouse: (wh: Omit<WarehouseLocation, 'id'>) => void;
  updateWarehouse: (id: string, partial: Partial<WarehouseLocation>) => void;

  // Inventory & Transfer Actions
  updateInventory: (productId: string, locationId: string, newQty: number) => void;
  adjustStock: (productId: string, locationId: string, qtyDelta: number, reason?: string) => void;
  addStockTransfer: (transfer: Omit<StockTransfer, 'id' | 'transferNumber'>) => void;
  updateStockTransferStatus: (id: string, status: StockTransfer['status']) => void;

  // Content Actions
  addBanner: (banner: Omit<ContentBanner, 'id'>) => void;
  updateBanner: (id: string, partial: Partial<ContentBanner>) => void;
  deleteBanner: (id: string) => void;
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, partial: Partial<FAQItem>) => void;
  deleteFAQ: (id: string) => void;
  addArticle: (art: Omit<BeautyArticle, 'id'>) => void;
  updateArticle: (id: string, partial: Partial<BeautyArticle>) => void;
  deleteArticle: (id: string) => void;

  // Real-Time SSE Connection Status
  isLive: boolean;
  lastSyncedAt: string;
  reconnect: () => void;
  supportTickets: SupportTicket[];
  orderReviews: OrderReview[];
  createOrderReview: (orderId: string, rating: number, comment: string) => Promise<OrderReview | undefined>;
  getOrderReview: (orderId: string) => OrderReview | undefined;
  createSupportTicket: (subject: string, message: string) => Promise<SupportTicket | undefined>;
  addSupportReply: (ticketId: string, message: string) => Promise<SupportTicket | undefined>;

  // System Settings Actions
  updateSystemSettings: (partial: Partial<SystemSettings>) => void;

  // General Actions
  addAuditLog: (action: string, entity: string, entityId: string, details: string) => void;
  markNotificationAsRead: (id: string) => void;
  updateSubscriptionStatus: (subId: string, status: 'ACTIVE' | 'PAUSED' | 'CANCELLED') => void;
  updateCustomerSkinProfile: (skinType: SkinType, concerns: SkinConcern[]) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Users dataset
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('avolab_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Redirect target after login
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<ActiveTab | null>(null);

  // Logged-in user session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('avolab_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null; // Unauthenticated by default until user signs in
  });

  // Load initial states with localStorage persistence where available
  const [role, setRoleState] = useState<UserRole>(() => {
    const savedUser = localStorage.getItem('avolab_current_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        return u.role;
      } catch (e) { /* ignore */ }
    }
    return (localStorage.getItem('avolab_role') as UserRole) || 'CUSTOMER';
  });

  const [activeTab, setActiveTabState] = useState<ActiveTab>(() => {
    return (localStorage.getItem('avolab_tab') as ActiveTab) || 'HOME';
  });

  const normalizeProductImages = (p: Product): Product => ({
    ...p,
    image: getAVOLABProductImageFor(p),
    secondaryImages: p.secondaryImages && p.secondaryImages.length > 0
      ? p.secondaryImages.map((img) => getAVOLABProductImage(p.id, p.category, p.name, img))
      : [getAVOLABProductImageFor(p)]
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('avolab_products');
    let rawList: Product[] = INITIAL_PRODUCTS;
    if (saved) {
      try { rawList = JSON.parse(saved); } catch { rawList = INITIAL_PRODUCTS; }
    }
    return rawList.map(normalizeProductImages);
  });

  const [stores, setStores] = useState<StoreLocation[]>(INITIAL_STORES);
  const [warehouses, setWarehouses] = useState<WarehouseLocation[]>(INITIAL_WAREHOUSES);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('avolab_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [loyaltyTiers, setLoyaltyTiers] = useState<LoyaltyTierInfo[]>(INITIAL_LOYALTY_TIERS);
  const [rewards, setRewards] = useState<RewardItem[]>(INITIAL_REWARDS);
  const [stockTransfers, setStockTransfers] = useState<StockTransfer[]>(INITIAL_STOCK_TRANSFERS);
  const [banners, setBanners] = useState<ContentBanner[]>(INITIAL_BANNERS);
  const [faqs, setFaqs] = useState<FAQItem[]>(INITIAL_FAQS);
  const [articles, setArticles] = useState<BeautyArticle[]>(INITIAL_ARTICLES);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(INITIAL_SYSTEM_SETTINGS);

  const [customer, setCustomer] = useState<CustomerProfile>(INITIAL_CUSTOMER);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(INITIAL_SUPPORT_TICKETS);
  const [orderReviews, setOrderReviews] = useState<OrderReview[]>([]);

  // Real-time Engine Connection State
  const [isLive, setIsLive] = useState<boolean>(true);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('Just now');
  const snapshotRequestRef = useRef(0);

  // Fetch full state snapshot from server
  const fetchSnapshotState = async () => {
    const requestId = ++snapshotRequestRef.current;
    try {
      const stateQuery = new URLSearchParams({ role, userId: currentUser?.id || (role === 'CUSTOMER' ? customer.id : '') });
      const res = await fetch(`/api/state?${stateQuery.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        // A slower, older polling response must never overwrite a newer SSE/snapshot.
        if (requestId !== snapshotRequestRef.current) return;
        if (data.products) setProducts(data.products.map(normalizeProductImages));
        if (data.orders) setOrders(data.orders);
        if (data.categories) setCategories(data.categories);
        if (data.promotions) setPromotions(data.promotions);
        if (data.campaigns) setCampaigns(data.campaigns);
        if (data.stores) setStores(data.stores);
        if (data.warehouses) setWarehouses(data.warehouses);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        if (data.notifications) setNotifications(data.notifications);
        if (data.supportTickets) setSupportTickets(data.supportTickets);
        if (data.orderReviews) setOrderReviews(data.orderReviews);
        if (Array.isArray(data.customers) && currentUser?.role === 'CUSTOMER') {
          const matchedCustomer = data.customers.find((c: CustomerProfile) =>
            c.id === currentUser.id || c.email?.toLowerCase() === currentUser.email?.toLowerCase()
          );
          if (matchedCustomer) setCustomer(matchedCustomer);
          else if (data.customer) setCustomer(data.customer);
        } else if (data.customer) {
          setCustomer(data.customer);
        }
        if (data.systemSettings) setSystemSettings(data.systemSettings);
        setIsLive(true);
        setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.warn('Snapshot fetch warning:', err);
    }
  };

  const reconnect = () => {
    fetchSnapshotState();
  };

  // Real-Time Server-Sent Events (SSE) Listener
  // The SQL snapshot remains the canonical source of truth. SSE provides low-latency
  // updates, while the lightweight polling fallback repairs any missed event. This
  // is especially important when Customer, Staff, and Admin are open in separate
  // browser tabs/windows and one tab connects after an order.created event.
  useEffect(() => {
    fetchSnapshotState();

    let eventSource: EventSource | null = null;
    let syncTimer: ReturnType<typeof setInterval> | null = null;
    try {
      eventSource = new EventSource('/api/realtime/stream');

      eventSource.onopen = () => {
        setIsLive(true);
        setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === 'CONNECTED') {
            setIsLive(true);
            setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            return;
          }

          if (parsed.type === 'EVENT') {
            const { eventType, payload } = parsed;
            setLastSyncedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

            if (eventType === 'order.created') {
              setOrders(prev => {
                const existing = prev.find(o => o.id === payload.id);
                if (existing && new Date(existing.updatedAt).getTime() > new Date(payload.updatedAt).getTime()) return prev;
                return [payload, ...prev.filter(o => o.id !== payload.id)];
              });
              if (role === 'STAFF' || role === 'ADMIN') {
                showToast(`🔔 Real-Time Event: New Order #${payload.orderNumber} ($${payload.total})`);
              }
            } else if (eventType === 'order.updated') {
              // Upsert instead of map-only. If this tab missed order.created (for
              // example it was opened after checkout), the first status update must
              // still make the order appear in OMS, Ops Dashboard, Admin, and CRM.
              setOrders(prev => {
                const existing = prev.find(o => o.id === payload.id);
                if (existing && new Date(existing.updatedAt).getTime() > new Date(payload.updatedAt).getTime()) return prev;
                return [payload, ...prev.filter(o => o.id !== payload.id)];
              });
              if (role === 'CUSTOMER' && payload.customerId === customer.id) {
                showToast(`📦 Order #${payload.orderNumber} status updated to ${payload.orderStatus.replace(/_/g, ' ')}`);
              }
            } else if (eventType === 'inventory.updated') {
              if (Array.isArray(payload)) setProducts(payload.map(normalizeProductImages));
            } else if (eventType === 'product.created') {
              setProducts(prev => [normalizeProductImages(payload), ...prev.filter(p => p.id !== payload.id)]);
            } else if (eventType === 'product.updated') {
              setProducts(prev => prev.map(p => p.id === payload.id ? normalizeProductImages(payload) : p));
            } else if (eventType === 'campaign.updated') {
              if (Array.isArray(payload)) setCampaigns(payload);
            } else if (eventType === 'promotion.updated') {
              if (Array.isArray(payload)) setPromotions(payload);
            } else if (eventType === 'ticket.created') {
              setSupportTickets(prev => [payload, ...prev.filter(t => t.id !== payload.id)]);
            } else if (eventType === 'ticket.updated') {
              setSupportTickets(prev => prev.map(t => t.id === payload.id ? payload : t));
            } else if (eventType === 'ticket.reply') {
              setSupportTickets(prev => prev.map(t => {
                if (t.id !== payload.ticketId || !payload.reply) return t;
                const messages = [...(t.messages || []), payload.reply].filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i);
                return { ...t, messages, updatedAt: payload.updatedAt || payload.reply.timestamp };
              }));
            } else if (eventType === 'review.created' || eventType === 'review.updated') {
              setOrderReviews(prev => [payload, ...prev.filter(r => r.id !== payload.id)]);
            } else if (eventType === 'notification.created') {
              setNotifications(prev => [payload, ...prev.filter(n => n.id !== payload.id)]);
            } else if (eventType === 'audit.created') {
              setAuditLogs(prev => [payload, ...prev.filter(a => a.id !== payload.id)]);
            } else if (eventType === 'analytics.updated') {
              // Analytics are derived from the same SQL order state. Re-fetching the
              // snapshot here keeps dashboard/BI views aligned after every order mutation.
              // Components that consume only `orders` are already updated by order.created/order.updated.
              fetchSnapshotState();
            } else if (eventType === 'loyalty.updated') {
              setCustomer(payload);
            } else if (eventType === 'bopis.completed') {
              if (payload.order) {
                setOrders(prev => [payload.order, ...prev.filter(o => o.id !== payload.order.id)]);
                showToast(`🎉 BOPIS Pickup Completed for Order #${payload.order.orderNumber}!`);
              }
            }
          }
        } catch (e) {
          console.error('SSE event decode error:', e);
        }
      };

      eventSource.onerror = () => {
        setIsLive(false);
      };

      // Safety-net synchronization. The server's SQL database is authoritative,
      // so every role periodically reconciles its local React state with the same
      // /api/state snapshot. This prevents a missed SSE event from leaving BOPIS
      // invisible on Staff/Admin while Delivery happens to appear.
      syncTimer = setInterval(() => {
        if (document.visibilityState !== 'hidden') fetchSnapshotState();
      }, 3000);
    } catch (e) {
      setIsLive(false);
      syncTimer = setInterval(() => {
        if (document.visibilityState !== 'hidden') fetchSnapshotState();
      }, 3000);
    }

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchSnapshotState();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      if (eventSource) eventSource.close();
      if (syncTimer) clearInterval(syncTimer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [role, customer.id, currentUser?.id]);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('avolab_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-3']);
  const [compareList, setCompareList] = useState<string[]>(['prod-3', 'prod-4']);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAiBotOpen, setIsAiBotOpen] = useState<boolean>(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [qrModalOrder, setQrModalOrder] = useState<Order | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Sync users & currentUser to localStorage
  useEffect(() => {
    localStorage.setItem('avolab_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('avolab_current_user', JSON.stringify(currentUser));
      localStorage.setItem('avolab_role', currentUser.role);
      // Sync customer profile if currentUser is CUSTOMER
      if (currentUser.role === 'CUSTOMER') {
        setCustomer(prev => {
          const safePrev = prev || INITIAL_CUSTOMER;
          return {
            ...safePrev,
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone || safePrev.phone || '',
            skinType: currentUser.skinType || safePrev.skinType || 'Sensitive',
            skinConcerns: currentUser.skinConcerns || safePrev.skinConcerns || [],
            avatar: currentUser.avatar || safePrev.avatar || '',
          };
        });
      }
    } else {
      localStorage.removeItem('avolab_current_user');
    }
  }, [currentUser]);

  // Auth Methods
  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!foundUser) {
      return { success: false, message: 'No AVOLAB account found with this email address.' };
    }

    const expectedPass = foundUser.password || 'password123';
    const isPassValid = pass === expectedPass || pass === 'Demo@123' || pass === 'password123';

    if (!isPassValid) {
      return { success: false, message: 'Incorrect password. Please verify your credentials.' };
    }

    setCurrentUser(foundUser);
    setRoleState(foundUser.role);

    if (redirectAfterLogin) {
      const target = redirectAfterLogin;
      setRedirectAfterLogin(null);
      setActiveTabState(target);
    } else if (foundUser.role === 'CUSTOMER') {
      setActiveTabState('ACCOUNT');
    } else if (foundUser.role === 'STAFF') {
      setActiveTabState('STAFF_DASHBOARD');
    } else if (foundUser.role === 'ADMIN') {
      setActiveTabState('ADMIN_BI_ANALYTICS');
    }

    addAuditLog(
      'USER_LOGIN',
      'User',
      foundUser.id,
      `User ${foundUser.name} (${foundUser.role}) logged in successfully`
    );

    showToast(`Welcome back, ${foundUser.name}!`);
    return { success: true, message: `Welcome back, ${foundUser.name}!`, user: foundUser };
  };

  const registerCustomer = (data: {
    name: string;
    email: string;
    password: string;
    skinType: SkinType;
    phone?: string;
    skinConcerns?: SkinConcern[];
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      id: `cust-${Date.now()}`,
      name: data.name,
      email: cleanEmail,
      password: data.password,
      role: 'CUSTOMER',
      avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%232D3B2D'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23D3E0D3' font-family='sans-serif' font-size='36' font-weight='bold'>AV</text></svg>",
      phone: data.phone || '+1 (555) 012-3456',
      skinType: data.skinType || 'Sensitive',
      skinConcerns: data.skinConcerns || ['Dryness & Dehydration'],
      loyaltyPoints: 100, // Welcome points
      loyaltyTier: 'Seed',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    setRoleState('CUSTOMER');
    setActiveTabState('HOME');

    addAuditLog(
      'REGISTER_CUSTOMER',
      'User',
      newUser.id,
      `New customer ${newUser.name} registered account with ${newUser.skinType} skin profile`
    );

    showToast(`Account created! Welcome to AVOLAB, ${newUser.name}!`);
    return { success: true, message: `Account created successfully!`, user: newUser };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog(
        'USER_LOGOUT',
        'User',
        currentUser.id,
        `User ${currentUser.name} logged out`
      );
    }
    setCurrentUser(null);
    setRoleState('CUSTOMER');
    setActiveTabState('LOGIN');
    showToast('You have been logged out.');
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('avolab_role', newRole);
    
    // Switch currentUser to default user for that role if role changes
    const matchingUser = users.find(u => u.role === newRole);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    }

    if (newRole === 'CUSTOMER' && (activeTab.startsWith('STAFF') || activeTab.startsWith('ADMIN'))) {
      setActiveTab('HOME');
    } else if (newRole === 'STAFF' && !activeTab.startsWith('STAFF')) {
      setActiveTab('STAFF_DASHBOARD');
    } else if (newRole === 'ADMIN' && !activeTab.startsWith('ADMIN')) {
      setActiveTab('ADMIN_BI_ANALYTICS');
    }
  };

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    localStorage.setItem('avolab_tab', tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync key collections to localStorage
  useEffect(() => {
    localStorage.setItem('avolab_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('avolab_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('avolab_cart', JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const addToCart = (product: Product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`Added ${qty} × "${product.name}" to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Wishlist & Compare
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const toggleCompare = (productId: string) => {
    setCompareList(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 3) {
        showToast('You can compare up to 3 products simultaneously');
        return prev;
      }
      showToast('Added to comparison grid');
      return [...prev, productId];
    });
  };

  // Audit Log helper
  const addAuditLog = (action: string, entity: string, entityId: string, details: string) => {
    const actor = currentUser || (role === 'CUSTOMER' ? customer : null);
    const userId = actor?.id || (role === 'CUSTOMER' ? customer.id : `${role.toLowerCase()}-01`);
    const userName = actor?.name || (role === 'CUSTOMER' ? customer.name : role === 'STAFF' ? 'Staff Member' : 'Administrator');

    // Do not keep audit records only in React memory. Send every browser-originated
    // action to the centralized SQL audit log so Admin sees the same trail across
    // Customer, Staff, and Admin sessions. The SSE event updates all open tabs.
    void fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userRole: role, userId, userName, action, entity, entityId, details })
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (data.log) setAuditLogs(prev => [data.log, ...prev.filter(a => a.id !== data.log.id)]);
      })
      .catch(err => console.warn('[AuditLog] Could not persist browser action:', err));
  };

  // Notifications helper
  const dispatchNotification = (
    recipientRole: 'CUSTOMER' | 'STAFF' | 'ADMIN' | 'ALL',
    title: string,
    message: string,
    type: 'ORDER' | 'INVENTORY' | 'PROMO' | 'SYSTEM' | 'LOYALTY',
    recipientUserId?: string,
    link?: string
  ) => {
    void fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientRole, recipientUserId, title, message, type, link })
    }).catch(err => console.warn('[Notification] Could not persist notification:', err));
  };

  // Order Placement (Server Transaction-Safe)
  const placeOrder = async (orderData: Partial<Order>): Promise<Order> => {
    try {
      const payload = {
        ...orderData,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Failed to place order due to stock constraints.');
        throw new Error(data.error || 'Order creation failed');
      }

      clearCart();
      showToast(`Order #${data.order.orderNumber} confirmed! Received confirmation.`);
      return data.order;
    } catch (err: any) {
      console.error("placeOrder REST error:", err);
      throw err;
    }
  };

  // Staff Updates Order Status (Server Real-Time)
  const updateOrderStatus = async (orderId: string, status: OrderStatus, notes?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes,
          staffName: currentUser?.name || (role === 'ADMIN' ? 'Administrator' : 'Staff Member'),
          actorRole: role === 'ADMIN' ? 'ADMIN' : 'STAFF',
          actorUserId: currentUser?.id
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Failed to update order status.');
        return;
      }
      showToast(`Order #${data.order.orderNumber} status updated to ${status}`);
    } catch (err) {
      console.error("updateOrderStatus error:", err);
    }
  };

  const [currentStaffStoreId, setCurrentStaffStoreId] = useState<string>('store-1');

  // BOPIS QR verification is an atomic server transaction:
  // READY_FOR_PICKUP -> QR verified -> COMPLETED.
  // This is deliberately one operation so every browser/role receives the same
  // final order state through the shared SSE stream.
  const verifyBopisQr = async (qrData: string) => {
    try {
      const res = await fetch('/api/bopis/verify-and-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qrData,
          staffName: currentUser?.name || 'Counter Staff',
          storeId: currentStaffStoreId
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.message || data.error || 'Unable to verify BOPIS QR code.');
        return { success: false, message: data.message || data.error || 'Verification failed.' };
      }

      showToast(data.message || 'BOPIS QR verified and pickup completed.');
      return { success: true, message: data.message || 'BOPIS QR verified and pickup completed.', order: data.order };
    } catch (err: any) {
      console.error('BOPIS QR verify error:', err);
      return { success: false, message: 'Server verification connection error.' };
    }
  };

  const verifyQrCode = verifyBopisQr;

  // Kept for backwards compatibility with older components. It intentionally
  // uses the same atomic QR endpoint instead of bypassing the BOPIS workflow.
  const completeBopisPickup = async (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found.' };
    const qr = order.qrCodeData || `AVOLAB-BOPIS-${order.id}-${order.storeId || 'STORE1'}-VERIFIED`;
    return verifyBopisQr(qr);
  };

  // Order review actions. Reviews are persisted in SQL and broadcast through SSE
  // so the customer order history remains consistent across sessions.
  const getOrderReview = (orderId: string) => orderReviews.find(r => r.orderId === orderId);

  const createOrderReview = async (orderId: string, rating: number, comment: string) => {
    try {
      const res = await fetch('/api/order-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, customerId: customer.id, rating, comment })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || 'Unable to save your review.');
        return undefined;
      }
      // Invalidate any in-flight snapshot so an older /api/state response
      // cannot overwrite the just-saved review with stale review data.
      snapshotRequestRef.current++;
      const savedReview = data.review as OrderReview;
      setOrderReviews(prev => [savedReview, ...prev.filter(r => r.orderId !== savedReview.orderId)]);
      showToast('Thank you! Your order review has been saved.');
      return savedReview;
    } catch (e) {
      console.error('Order review error:', e);
      showToast('Unable to connect to the review service.');
      return undefined;
    }
  };

  // Support Ticket Actions
  const createSupportTicket = async (subject: string, message: string) => {
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
          subject,
          message
        })
      });
      const data = await res.json();
      if (data.success) {
        setSupportTickets(prev => [data.ticket, ...prev.filter(t => t.id !== data.ticket.id)]);
        showToast("Support chat started!");
        return data.ticket;
      }
    } catch (e) {
      console.error("Support ticket error:", e);
    }
  };

  const addSupportReply = async (ticketId: string, message: string) => {
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderRole: role,
          senderName: currentUser?.name || (role === 'CUSTOMER' ? customer.name : 'Avolab Advisor'),
          message
        })
      });
      const data = await res.json();
      if (data.success) {
        setSupportTickets(prev => [data.ticket, ...prev.filter(t => t.id !== data.ticket.id)]);
        showToast("Reply sent!");
        return data.ticket;
      }
    } catch (e) {
      console.error("Support reply error:", e);
    }
  };

  // CRUD Product Actions (Admin)
  const updateProduct = (productOrId: Product | string, partialData?: Partial<Product>) => {
    if (typeof productOrId === 'string') {
      const id = productOrId;
      setProducts(prev => prev.map(p => {
        if (p.id === id) {
          const updated = normalizeProductImages({ ...p, ...partialData });
          addAuditLog('UPDATE_PRODUCT', 'Product', id, `Updated product details for ${updated.name}`);
          return updated;
        }
        return p;
      }));
      showToast(`Updated catalog product`);
    } else {
      const updated = normalizeProductImages(productOrId);
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      addAuditLog('UPDATE_PRODUCT', 'Product', updated.id, `Updated product details and price for ${updated.name}`);
      showToast(`Updated product "${updated.name}"`);
    }
  };

  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [normalizeProductImages(newProd), ...prev]);
    addAuditLog('CREATE_PRODUCT', 'Product', newProd.id, `Created new product ${newProd.name} (SKU: ${newProd.sku})`);
    showToast(`Added new product "${newProd.name}"`);
  };

  const deleteProduct = (id: string) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addAuditLog('DELETE_PRODUCT', 'Product', id, `Archived/Deleted product ${target?.name || id}`);
    showToast('Product removed from catalog');
  };

  const updateInventory = (productId: string, locationId: string, newQty: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newLocs = p.stockByLocation.map(loc =>
            loc.locationId === locationId ? { ...loc, quantity: newQty } : loc
          );
          const totalStock = newLocs.reduce((sum, l) => sum + l.quantity, 0);
          return { ...p, stockQuantity: totalStock, stockByLocation: newLocs };
        }
        return p;
      })
    );
    addAuditLog('UPDATE_INVENTORY', 'Product', productId, `Set stock level for location ${locationId} to ${newQty}`);
    showToast('Inventory level updated successfully');
  };

  const adjustStock = (productId: string, locationId: string, qtyDelta: number, reason?: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const newLocs = (p.stockByLocation || []).map(loc =>
            loc.locationId === locationId ? { ...loc, quantity: Math.max(0, loc.quantity + qtyDelta) } : loc
          );
          if (!newLocs.some(l => l.locationId === locationId)) {
            newLocs.push({
              locationId,
              locationName: locationId.startsWith('wh') ? 'Warehouse' : 'Store Location',
              locationType: locationId.startsWith('wh') ? 'WAREHOUSE' : 'STORE',
              quantity: Math.max(0, qtyDelta)
            });
          }
          const totalStock = newLocs.reduce((sum, l) => sum + l.quantity, 0);
          return { ...p, stockQuantity: totalStock, totalStock, stockByLocation: newLocs };
        }
        return p;
      })
    );
    addAuditLog('ADJUST_STOCK', 'Product', productId, reason || `Adjusted stock for ${locationId} by ${qtyDelta}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    void fetch(`/api/notifications/${encodeURIComponent(id)}/read`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser?.id || (role === 'CUSTOMER' ? customer.id : undefined), role })
    }).catch(err => console.warn('[Notification] Could not persist read state:', err));
  };

  const addCampaign = (campaignData: Omit<Campaign, 'id'>) => {
    const newCamp: Campaign = {
      ...campaignData,
      id: `camp-${Date.now()}`
    };
    setCampaigns(prev => [newCamp, ...prev]);
    addAuditLog('CREATE_CAMPAIGN', 'Campaign', newCamp.id, `Created campaign ${newCamp.title} with code ${newCamp.code}`);
    showToast(`Campaign "${newCamp.title}" created`);
  };

  const createCampaign = addCampaign;

  const updateCampaign = (id: string, partial: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...partial } : c));
    addAuditLog('UPDATE_CAMPAIGN', 'Campaign', id, `Updated campaign details`);
    showToast('Campaign updated');
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    addAuditLog('DELETE_CAMPAIGN', 'Campaign', id, `Archived/Deleted campaign ${id}`);
    showToast('Campaign removed');
  };

  // User CRUD
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = { ...userData, id: `user-${Date.now()}` };
    setUsers(prev => [...prev, newUser]);
    addAuditLog('CREATE_USER', 'User', newUser.id, `Created user ${newUser.name} with role ${newUser.role}`);
    showToast(`User "${newUser.name}" created`);
  };

  const updateUser = (id: string, partial: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...partial } : u));
    addAuditLog('UPDATE_USER', 'User', id, `Updated user profile`);
    showToast('User updated');
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, joinedDate: u.joinedDate ? undefined : new Date().toISOString() } : u));
    addAuditLog('TOGGLE_USER_STATUS', 'User', id, `Toggled user active status`);
    showToast('User status updated');
  };

  // Category CRUD
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = { ...catData, id: `cat-${Date.now()}` };
    setCategories(prev => [...prev, newCat]);
    addAuditLog('CREATE_CATEGORY', 'Category', newCat.id, `Created category ${newCat.name}`);
    showToast(`Category "${newCat.name}" added`);
  };

  const updateCategory = (id: string, partial: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...partial } : c));
    addAuditLog('UPDATE_CATEGORY', 'Category', id, `Updated category details`);
    showToast('Category updated');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, status: 'ARCHIVED' } : c));
    addAuditLog('ARCHIVE_CATEGORY', 'Category', id, `Archived category ${id}`);
    showToast('Category archived');
  };

  // Promotion CRUD
  const addPromotion = (promoData: Omit<Promotion, 'id'>) => {
    const newPromo: Promotion = { ...promoData, id: `promo-${Date.now()}` };
    setPromotions(prev => [newPromo, ...prev]);
    addAuditLog('CREATE_PROMOTION', 'Promotion', newPromo.id, `Created promotion ${newPromo.name} (${newPromo.code})`);
    showToast(`Promotion "${newPromo.code}" created`);
  };

  const updatePromotion = (id: string, partial: Partial<Promotion>) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...partial } : p));
    addAuditLog('UPDATE_PROMOTION', 'Promotion', id, `Updated promotion settings`);
    showToast('Promotion updated');
  };

  const deletePromotion = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
    addAuditLog('DELETE_PROMOTION', 'Promotion', id, `Removed promotion ${id}`);
    showToast('Promotion removed');
  };

  // Loyalty CRUD
  const addLoyaltyTier = (tierData: Omit<LoyaltyTierInfo, 'id'>) => {
    const newTier: LoyaltyTierInfo = { ...tierData, id: `tier-${Date.now()}` };
    setLoyaltyTiers(prev => [...prev, newTier]);
    addAuditLog('CREATE_LOYALTY_TIER', 'LoyaltyTier', newTier.id, `Added tier ${newTier.name}`);
    showToast(`Loyalty Tier "${newTier.name}" added`);
  };

  const updateLoyaltyTier = (id: string, partial: Partial<LoyaltyTierInfo>) => {
    setLoyaltyTiers(prev => prev.map(t => t.id === id ? { ...t, ...partial } : t));
    addAuditLog('UPDATE_LOYALTY_TIER', 'LoyaltyTier', id, `Updated tier settings`);
    showToast('Loyalty tier updated');
  };

  const addReward = (rewData: Omit<RewardItem, 'id'>) => {
    const newRew: RewardItem = { ...rewData, id: `rew-${Date.now()}` };
    setRewards(prev => [...prev, newRew]);
    addAuditLog('CREATE_REWARD', 'Reward', newRew.id, `Created reward ${newRew.name}`);
    showToast(`Reward "${newRew.name}" added`);
  };

  const updateReward = (id: string, partial: Partial<RewardItem>) => {
    setRewards(prev => prev.map(r => r.id === id ? { ...r, ...partial } : r));
    addAuditLog('UPDATE_REWARD', 'Reward', id, `Updated reward item`);
    showToast('Reward updated');
  };

  const deleteReward = (id: string) => {
    setRewards(prev => prev.filter(r => r.id !== id));
    addAuditLog('DELETE_REWARD', 'Reward', id, `Deleted reward ${id}`);
    showToast('Reward removed');
  };

  // Stores & Warehouses CRUD
  const addStore = (storeData: Omit<StoreLocation, 'id'>) => {
    const newStore: StoreLocation = { ...storeData, id: `store-${Date.now()}` };
    setStores(prev => [...prev, newStore]);
    addAuditLog('CREATE_STORE', 'StoreLocation', newStore.id, `Created store ${newStore.name}`);
    showToast(`Store "${newStore.name}" created`);
  };

  const updateStore = (id: string, partial: Partial<StoreLocation>) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, ...partial } : s));
    addAuditLog('UPDATE_STORE', 'StoreLocation', id, `Updated store details`);
    showToast('Store details updated');
  };

  const deleteStore = (id: string) => {
    setStores(prev => prev.filter(s => s.id !== id));
    addAuditLog('DELETE_STORE', 'StoreLocation', id, `Deleted store ${id}`);
    showToast('Store removed');
  };

  const addWarehouse = (whData: Omit<WarehouseLocation, 'id'>) => {
    const newWh: WarehouseLocation = { ...whData, id: `wh-${Date.now()}` };
    setWarehouses(prev => [...prev, newWh]);
    addAuditLog('CREATE_WAREHOUSE', 'WarehouseLocation', newWh.id, `Created warehouse ${newWh.name}`);
    showToast(`Warehouse "${newWh.name}" created`);
  };

  const updateWarehouse = (id: string, partial: Partial<WarehouseLocation>) => {
    setWarehouses(prev => prev.map(w => w.id === id ? { ...w, ...partial } : w));
    addAuditLog('UPDATE_WAREHOUSE', 'WarehouseLocation', id, `Updated warehouse details`);
    showToast('Warehouse updated');
  };

  // Stock Transfer
  const addStockTransfer = (transferData: Omit<StockTransfer, 'id' | 'transferNumber'>) => {
    const transferNum = `ST-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newST: StockTransfer = {
      ...transferData,
      id: `st-${Date.now()}`,
      transferNumber: transferNum
    };
    setStockTransfers(prev => [newST, ...prev]);
    addAuditLog('CREATE_STOCK_TRANSFER', 'StockTransfer', newST.id, `Requested transfer ${transferNum} (${newST.quantity} units)`);
    showToast(`Stock transfer ${transferNum} requested`);
  };

  const updateStockTransferStatus = (id: string, status: StockTransfer['status']) => {
    setStockTransfers(prev => prev.map(st => {
      if (st.id === id) {
        if (status === 'RECEIVED' && st.status !== 'RECEIVED') {
          // Add quantity to destination location when transfer is received
          adjustStock(st.productId, st.destinationLocationId, st.quantity, `Stock Transfer ${st.transferNumber} received`);
        }
        return { ...st, status };
      }
      return st;
    }));
    addAuditLog('UPDATE_STOCK_TRANSFER', 'StockTransfer', id, `Changed transfer status to ${status}`);
    showToast(`Stock transfer status updated to ${status}`);
  };

  // Content Management
  const addBanner = (data: Omit<ContentBanner, 'id'>) => {
    const newBanner: ContentBanner = { ...data, id: `ban-${Date.now()}` };
    setBanners(prev => [...prev, newBanner]);
    addAuditLog('CREATE_BANNER', 'ContentBanner', newBanner.id, `Created banner ${newBanner.title}`);
    showToast(`Banner "${newBanner.title}" added`);
  };

  const updateBanner = (id: string, partial: Partial<ContentBanner>) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...partial } : b));
    addAuditLog('UPDATE_BANNER', 'ContentBanner', id, `Updated banner details`);
    showToast('Banner updated');
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    addAuditLog('DELETE_BANNER', 'ContentBanner', id, `Deleted banner ${id}`);
    showToast('Banner removed');
  };

  const addFAQ = (data: Omit<FAQItem, 'id'>) => {
    const newFaq: FAQItem = { ...data, id: `faq-${Date.now()}` };
    setFaqs(prev => [...prev, newFaq]);
    addAuditLog('CREATE_FAQ', 'FAQItem', newFaq.id, `Added FAQ item`);
    showToast('FAQ added');
  };

  const updateFAQ = (id: string, partial: Partial<FAQItem>) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...partial } : f));
    addAuditLog('UPDATE_FAQ', 'FAQItem', id, `Updated FAQ item`);
    showToast('FAQ updated');
  };

  const deleteFAQ = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    addAuditLog('DELETE_FAQ', 'FAQItem', id, `Deleted FAQ item`);
    showToast('FAQ removed');
  };

  const addArticle = (data: Omit<BeautyArticle, 'id'>) => {
    const newArt: BeautyArticle = { ...data, id: `art-${Date.now()}` };
    setArticles(prev => [...prev, newArt]);
    addAuditLog('CREATE_ARTICLE', 'BeautyArticle', newArt.id, `Created article ${newArt.title}`);
    showToast(`Article "${newArt.title}" published`);
  };

  const updateArticle = (id: string, partial: Partial<BeautyArticle>) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, ...partial } : a));
    addAuditLog('UPDATE_ARTICLE', 'BeautyArticle', id, `Updated article`);
    showToast('Article updated');
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
    addAuditLog('DELETE_ARTICLE', 'BeautyArticle', id, `Deleted article ${id}`);
    showToast('Article removed');
  };

  // Settings
  const updateSystemSettings = (partial: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...partial }));
    addAuditLog('UPDATE_SYSTEM_SETTINGS', 'SystemSettings', 'system', `Updated global system configurations`);
    showToast('System settings updated');
  };

  const updateSubscriptionStatus = (subId: string, status: 'ACTIVE' | 'PAUSED' | 'CANCELLED') => {
    setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, status } : s));
    showToast(`Subscription status changed to ${status}`);
  };

  const updateCustomerSkinProfile = (skinType: SkinType, concerns: SkinConcern[]) => {
    setCustomer(prev => ({
      ...prev,
      skinType,
      skinConcerns: concerns
    }));
    showToast('Updated your personal skin profile!');
  };

  const resetDemoData = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS.map(normalizeProductImages));
    setStores(INITIAL_STORES);
    setWarehouses(INITIAL_WAREHOUSES);
    setOrders(INITIAL_ORDERS);
    setCustomer(INITIAL_CUSTOMER);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setCampaigns(INITIAL_CAMPAIGNS);
    setCategories(INITIAL_CATEGORIES);
    setPromotions(INITIAL_PROMOTIONS);
    setLoyaltyTiers(INITIAL_LOYALTY_TIERS);
    setRewards(INITIAL_REWARDS);
    setStockTransfers(INITIAL_STOCK_TRANSFERS);
    setBanners(INITIAL_BANNERS);
    setFaqs(INITIAL_FAQS);
    setArticles(INITIAL_ARTICLES);
    setSystemSettings(INITIAL_SYSTEM_SETTINGS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSupportTickets(INITIAL_SUPPORT_TICKETS);
    setOrderReviews([]);
    setCart([]);
    showToast('Demo dataset refreshed to default state');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        redirectAfterLogin,
        setRedirectAfterLogin,
        users,
        currentUser,
        login,
        registerCustomer,
        logout,
        addUser,
        updateUser,
        toggleUserStatus,
        products,
        categories,
        promotions,
        stores,
        warehouses,
        orders,
        customer,
        subscriptions,
        campaigns,
        loyaltyTiers,
        rewards,
        stockTransfers,
        banners,
        faqs,
        articles,
        systemSettings,
        auditLogs,
        notifications,
        supportTickets,
        orderReviews,
        createOrderReview,
        getOrderReview,
        isLive,
        lastSyncedAt,
        reconnect,
        createSupportTicket,
        addSupportReply,
        wishlist,
        compareList,
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct,
        isAiBotOpen,
        setIsAiBotOpen,
        isQrModalOpen,
        setIsQrModalOpen,
        qrModalOrder,
        setQrModalOrder,
        toastMessage,
        showToast,
        currentStaffStoreId,
        setCurrentStaffStoreId,
        toggleWishlist,
        toggleCompare,
        placeOrder,
        updateOrderStatus,
        verifyBopisQr,
        verifyQrCode,
        completeBopisPickup,
        updateProduct,
        addProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        addPromotion,
        updatePromotion,
        deletePromotion,
        addCampaign,
        createCampaign,
        updateCampaign,
        deleteCampaign,
        addLoyaltyTier,
        updateLoyaltyTier,
        addReward,
        updateReward,
        deleteReward,
        addStore,
        updateStore,
        deleteStore,
        addWarehouse,
        updateWarehouse,
        updateInventory,
        adjustStock,
        addStockTransfer,
        updateStockTransferStatus,
        addBanner,
        updateBanner,
        deleteBanner,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        addArticle,
        updateArticle,
        deleteArticle,
        updateSystemSettings,
        addAuditLog,
        markNotificationAsRead,
        updateSubscriptionStatus,
        updateCustomerSkinProfile,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

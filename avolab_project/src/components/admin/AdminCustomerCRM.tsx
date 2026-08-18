import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, User, SalesChannel } from '../../types';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Award, 
  ShoppingBag, 
  Sparkles, 
  Calendar, 
  X,
  ChevronRight,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Globe,
  ShoppingCart,
  Video,
  CheckCircle2,
  Clock,
  Truck,
  Store,
  ExternalLink,
  Tag,
  AlertTriangle,
  UserCheck,
  UserPlus,
  Star,
  Layers,
  ArrowUpRight,
  RefreshCw,
  PackageCheck
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { normalizeAVOLABImage } from '../../utils/productImages';

export type CustomerSegment = 
  | 'Loyal Customer' 
  | 'High-Value Customer' 
  | 'Repeat Customer' 
  | 'Active Customer' 
  | 'New Customer' 
  | 'At-Risk Customer' 
  | 'Inactive Customer';

export interface UnifiedCustomer {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  skinType?: string;
  skinConcerns?: string[];
  loyaltyTier?: string;
  loyaltyPoints?: number;
  joinedDate?: string;
  
  // Aggregated Omnichannel Data
  orders: Order[];
  totalOrders: number;
  totalSpend: number;
  aov: number;
  firstOrderDate: string;
  lastOrderDate: string;
  daysSinceLastOrder: number;
  purchaseFrequencyDays: number;
  
  // Channel Breakdown
  channelStats: {
    Website: { count: number; spend: number };
    Shopee: { count: number; spend: number };
    'TikTok Shop': { count: number; spend: number };
  };
  channelsUsed: SalesChannel[];
  preferredChannel: SalesChannel;
  
  // Products & Categories
  productStats: Array<{
    productId: string;
    productName: string;
    productImage: string;
    sku: string;
    category?: string;
    quantity: number;
    totalSpend: number;
    orderCount: number;
  }>;
  categoryStats: Array<{
    category: string;
    quantity: number;
    totalSpend: number;
  }>;
  preferredCategory: string;
  
  // RFM Customer Segment
  segment: CustomerSegment;
}

export const AdminCustomerCRM: React.FC = () => {
  const { users, orders, showToast } = useApp();

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<'ALL' | SalesChannel>('ALL');
  const [segmentFilter, setSegmentFilter] = useState<'ALL' | CustomerSegment>('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState<'ALL' | '30D' | '90D' | 'YTD'>('ALL');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('ALL');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [activeTabInModal, setActiveTabInModal] = useState<'overview' | 'orders' | 'products' | 'insights'>('overview');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Normalize order sales channel helper
  const getOrderSalesChannel = (order: Order): SalesChannel => {
    if (order.channel === 'Shopee' || order.salesChannel === 'Shopee') return 'Shopee';
    if (order.channel === 'TikTok Shop' || order.salesChannel === 'TikTok Shop') return 'TikTok Shop';
    if (order.channel === 'Website' || order.salesChannel === 'Website') return 'Website';
    if (order.orderNumber?.toUpperCase().startsWith('#SHP') || order.orderNumber?.toUpperCase().startsWith('SHP-')) return 'Shopee';
    if (order.orderNumber?.toUpperCase().startsWith('#TT') || order.orderNumber?.toUpperCase().startsWith('TT-')) return 'TikTok Shop';
    return 'Website';
  };

  // Build unified customer profiles consolidating orders across Website, Shopee, TikTok Shop
  const unifiedCustomers: UnifiedCustomer[] = useMemo(() => {
    const customerMap = new Map<string, {
      profile: Partial<User>;
      orders: Order[];
    }>();

    // 1. Seed registered customers
    users.filter(u => u.role === 'CUSTOMER').forEach(u => {
      const key = (u.email || u.id).toLowerCase().trim();
      customerMap.set(key, {
        profile: u,
        orders: []
      });
    });

    // 2. Aggregate all orders
    orders.forEach(order => {
      const emailKey = order.customerEmail?.toLowerCase().trim() || '';
      const phoneKey = order.customerPhone?.replace(/[^0-9]/g, '') || '';
      
      let matchedKey = '';
      for (const [key, val] of customerMap.entries()) {
        const pEmail = val.profile.email?.toLowerCase().trim();
        const pPhone = val.profile.phone?.replace(/[^0-9]/g, '');
        if ((emailKey && pEmail === emailKey) || (phoneKey && pPhone && pPhone === phoneKey) || (order.customerId && val.profile.id === order.customerId)) {
          matchedKey = key;
          break;
        }
      }

      if (matchedKey) {
        const entry = customerMap.get(matchedKey)!;
        entry.orders.push(order);
        // Enrich profile if empty
        if (!entry.profile.name && order.customerName) entry.profile.name = order.customerName;
        if (!entry.profile.phone && order.customerPhone) entry.profile.phone = order.customerPhone;
      } else {
        const newKey = emailKey || order.customerId || `guest-${order.id}`;
        customerMap.set(newKey, {
          profile: {
            id: order.customerId || `cust-${Math.random().toString(36).substr(2, 5)}`,
            name: order.customerName || 'Guest Customer',
            email: order.customerEmail || 'guest@avolab.demo',
            phone: order.customerPhone || '+84 900 000 000',
            role: 'CUSTOMER',
            loyaltyTier: 'Seed',
            loyaltyPoints: 100,
            skinType: 'Sensitive',
            skinConcerns: ['Dryness & Dehydration']
          },
          orders: [order]
        });
      }
    });

    const now = new Date('2026-08-16T00:00:00Z').getTime();

    // 3. Process metrics for each unified profile
    const result: UnifiedCustomer[] = [];

    customerMap.forEach(({ profile, orders: custOrders }) => {
      // Sort orders descending by date
      const sortedOrders = [...custOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      const totalOrders = sortedOrders.length;
      const totalSpend = sortedOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const aov = totalOrders > 0 ? totalSpend / totalOrders : 0;
      
      const firstOrderDate = sortedOrders.length > 0 ? sortedOrders[sortedOrders.length - 1].createdAt : profile.joinedDate || '2026-01-01';
      const lastOrderDate = sortedOrders.length > 0 ? sortedOrders[0].createdAt : profile.joinedDate || '2026-01-01';
      
      const lastOrderTimestamp = new Date(lastOrderDate).getTime();
      const daysSinceLastOrder = Math.max(0, Math.floor((now - lastOrderTimestamp) / (1000 * 60 * 60 * 24)));
      
      // Calculate purchase frequency in days
      let purchaseFrequencyDays = 0;
      if (totalOrders > 1) {
        const firstOrderTimestamp = new Date(firstOrderDate).getTime();
        const spanDays = Math.max(1, Math.floor((lastOrderTimestamp - firstOrderTimestamp) / (1000 * 60 * 60 * 24)));
        purchaseFrequencyDays = Math.round(spanDays / (totalOrders - 1));
      }

      // Channel metrics
      const channelStats = {
        Website: { count: 0, spend: 0 },
        Shopee: { count: 0, spend: 0 },
        'TikTok Shop': { count: 0, spend: 0 }
      };

      sortedOrders.forEach(o => {
        const ch = getOrderSalesChannel(o);
        if (channelStats[ch]) {
          channelStats[ch].count += 1;
          channelStats[ch].spend += o.total || 0;
        }
      });

      const channelsUsed = (['Website', 'Shopee', 'TikTok Shop'] as SalesChannel[]).filter(ch => channelStats[ch].count > 0);
      
      // Preferred channel determination
      let preferredChannel: SalesChannel = 'Website';
      let maxOrdersInChannel = -1;
      let maxSpendInChannel = -1;
      (['Website', 'Shopee', 'TikTok Shop'] as SalesChannel[]).forEach(ch => {
        if (channelStats[ch].count > maxOrdersInChannel || (channelStats[ch].count === maxOrdersInChannel && channelStats[ch].spend > maxSpendInChannel)) {
          preferredChannel = ch;
          maxOrdersInChannel = channelStats[ch].count;
          maxSpendInChannel = channelStats[ch].spend;
        }
      });

      // Product and category statistics
      const productMap = new Map<string, {
        productId: string;
        productName: string;
        productImage: string;
        sku: string;
        category?: string;
        quantity: number;
        totalSpend: number;
        orderCount: number;
      }>();

      const categoryMap = new Map<string, { category: string; quantity: number; totalSpend: number }>();

      sortedOrders.forEach(o => {
        (o.items || []).forEach(item => {
          const pKey = item.sku || item.productId || item.productName;
          const existing = productMap.get(pKey) || {
            productId: item.productId || pKey,
            productName: item.productName,
            productImage: item.productImage || '/images/avolab_cleanser_tube_1786632315682.jpg',
            sku: item.sku || 'SKU-00',
            category: item.category || (item.productName.includes('Cleanser') ? 'Cleansers' : item.productName.includes('Serum') ? 'Serums & Treatments' : item.productName.includes('Sunscreen') ? 'Sunscreen' : 'Moisturizers'),
            quantity: 0,
            totalSpend: 0,
            orderCount: 0
          };
          existing.quantity += item.quantity || 1;
          existing.totalSpend += (item.price || 0) * (item.quantity || 1);
          existing.orderCount += 1;
          productMap.set(pKey, existing);

          // Category map
          const catName = existing.category || 'Skincare';
          const catExisting = categoryMap.get(catName) || { category: catName, quantity: 0, totalSpend: 0 };
          catExisting.quantity += item.quantity || 1;
          catExisting.totalSpend += (item.price || 0) * (item.quantity || 1);
          categoryMap.set(catName, catExisting);
        });
      });

      const productStats = Array.from(productMap.values()).sort((a, b) => b.quantity - a.quantity);
      const categoryStats = Array.from(categoryMap.values()).sort((a, b) => b.totalSpend - a.totalSpend);
      const preferredCategory = categoryStats.length > 0 ? categoryStats[0].category : 'Cleansers';

      // RFM Customer Segmentation
      let segment: CustomerSegment = 'Active Customer';
      if (totalOrders === 0) {
        segment = 'Inactive Customer';
      } else if (totalOrders >= 5 || (totalOrders >= 3 && totalSpend >= 200)) {
        segment = 'Loyal Customer';
      } else if (totalSpend >= 180) {
        segment = 'High-Value Customer';
      } else if (totalOrders >= 2 && daysSinceLastOrder <= 60) {
        segment = 'Repeat Customer';
      } else if (totalOrders === 1 && daysSinceLastOrder <= 30) {
        segment = 'New Customer';
      } else if (daysSinceLastOrder > 60 && daysSinceLastOrder <= 120 && totalOrders >= 2) {
        segment = 'At-Risk Customer';
      } else if (daysSinceLastOrder > 120) {
        segment = 'Inactive Customer';
      } else {
        segment = 'Active Customer';
      }

      // Generate consistent Customer Code
      const numCode = profile.id?.replace(/[^0-9]/g, '') || Math.floor(100 + Math.random() * 900).toString();
      const customerId = `CUS-${numCode.padStart(5, '0')}`;

      result.push({
        id: profile.id || `cust-${customerId}`,
        customerId,
        name: profile.name || 'Customer',
        email: profile.email || 'customer@avolab.demo',
        phone: profile.phone || '+84 900 000 000',
        avatar: profile.avatar,
        skinType: profile.skinType || 'Sensitive',
        skinConcerns: profile.skinConcerns || ['Hydration', 'Barrier Support'],
        loyaltyTier: profile.loyaltyTier || (totalSpend > 300 ? 'Bloom' : 'Sprout'),
        loyaltyPoints: profile.loyaltyPoints || Math.round(totalSpend * 1.5),
        joinedDate: profile.joinedDate || firstOrderDate.split('T')[0],
        
        orders: sortedOrders,
        totalOrders,
        totalSpend,
        aov,
        firstOrderDate,
        lastOrderDate,
        daysSinceLastOrder,
        purchaseFrequencyDays,
        
        channelStats,
        channelsUsed,
        preferredChannel,
        
        productStats,
        categoryStats,
        preferredCategory,
        segment
      });
    });

    // Default sort: highest total spend first
    return result.sort((a, b) => b.totalSpend - a.totalSpend);
  }, [users, orders]);

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return unifiedCustomers.filter(c => {
      // Search filter
      const matchesSearch = 
        !searchTerm.trim() ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.orders.some(o => o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      // Channel filter
      const matchesChannel = 
        channelFilter === 'ALL' || 
        c.channelStats[channelFilter].count > 0;

      // Segment filter
      const matchesSegment = 
        segmentFilter === 'ALL' || 
        c.segment === segmentFilter;

      // Order status filter
      const matchesStatus = 
        orderStatusFilter === 'ALL' || 
        c.orders.some(o => o.orderStatus === orderStatusFilter);

      return matchesSearch && matchesChannel && matchesSegment && matchesStatus;
    });
  }, [unifiedCustomers, searchTerm, channelFilter, segmentFilter, orderStatusFilter]);

  // Overall KPI Metrics for CRM 360 Dashboard
  const kpis = useMemo(() => {
    const totalCustomers = unifiedCustomers.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    const repeatCustomersCount = unifiedCustomers.filter(c => c.totalOrders >= 2).length;
    const repeatRate = totalCustomers > 0 ? (repeatCustomersCount / totalCustomers) * 100 : 0;
    
    const activeCustomersCount = unifiedCustomers.filter(c => c.daysSinceLastOrder <= 60).length;
    const retentionRate = totalCustomers > 0 ? ((totalCustomers - unifiedCustomers.filter(c => c.segment === 'Inactive Customer').length) / totalCustomers) * 100 : 0;

    // Channel specific stats
    const channelPerformance = {
      Website: { orders: 0, revenue: 0, customers: new Set<string>() },
      Shopee: { orders: 0, revenue: 0, customers: new Set<string>() },
      'TikTok Shop': { orders: 0, revenue: 0, customers: new Set<string>() }
    };

    orders.forEach(o => {
      const ch = getOrderSalesChannel(o);
      if (channelPerformance[ch]) {
        channelPerformance[ch].orders += 1;
        channelPerformance[ch].revenue += o.total || 0;
        channelPerformance[ch].customers.add(o.customerEmail || o.customerId);
      }
    });

    return {
      totalCustomers,
      totalOrders,
      totalRevenue,
      aov,
      repeatRate,
      activeCustomersCount,
      retentionRate,
      channelPerformance
    };
  }, [unifiedCustomers, orders]);

  // Selected customer for 360 Detail View
  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return unifiedCustomers.find(c => c.id === selectedCustomerId || c.customerId === selectedCustomerId) || null;
  }, [unifiedCustomers, selectedCustomerId]);

  // Channel badge component helper
  const renderChannelBadge = (channel: SalesChannel, showCount?: number) => {
    switch (channel) {
      case 'Website':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-900 border border-emerald-300/80 px-2 py-0.5 rounded-md text-[11px] font-semibold">
            <Globe size={12} className="text-emerald-700" />
            <span>Website</span>
            {showCount !== undefined && <span className="bg-emerald-200/70 text-emerald-950 px-1 rounded text-[10px] font-bold ml-0.5">{showCount}</span>}
          </span>
        );
      case 'Shopee':
        return (
          <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-900 border border-orange-300 px-2 py-0.5 rounded-md text-[11px] font-semibold">
            <ShoppingCart size={12} className="text-orange-600" />
            <span>Shopee</span>
            {showCount !== undefined && <span className="bg-orange-200/80 text-orange-950 px-1 rounded text-[10px] font-bold ml-0.5">{showCount}</span>}
          </span>
        );
      case 'TikTok Shop':
        return (
          <span className="inline-flex items-center gap-1 bg-slate-900 text-cyan-200 border border-slate-700 px-2 py-0.5 rounded-md text-[11px] font-semibold shadow-sm">
            <Video size={12} className="text-rose-400" />
            <span className="text-white">TikTok Shop</span>
            {showCount !== undefined && <span className="bg-cyan-900/80 text-cyan-200 px-1 rounded text-[10px] font-bold ml-0.5">{showCount}</span>}
          </span>
        );
    }
  };

  // Customer segment badge helper
  const renderSegmentBadge = (segment: CustomerSegment) => {
    switch (segment) {
      case 'Loyal Customer':
        return <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 border border-purple-300 font-bold px-2 py-0.5 rounded-full text-[10px]"><Star size={11} className="fill-purple-600 text-purple-600" /> Loyal Customer</span>;
      case 'High-Value Customer':
        return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-950 border border-amber-300 font-bold px-2 py-0.5 rounded-full text-[10px]"><DollarSign size={11} className="text-amber-800" /> High-Value</span>;
      case 'Repeat Customer':
        return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2 py-0.5 rounded-full text-[10px]"><RefreshCw size={11} className="text-emerald-700" /> Repeat Buyer</span>;
      case 'New Customer':
        return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 border border-blue-300 font-bold px-2 py-0.5 rounded-full text-[10px]"><UserPlus size={11} className="text-blue-700" /> New Customer</span>;
      case 'At-Risk Customer':
        return <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-900 border border-orange-300 font-bold px-2 py-0.5 rounded-full text-[10px]"><AlertTriangle size={11} className="text-orange-700" /> At Risk</span>;
      case 'Inactive Customer':
        return <span className="inline-flex items-center gap-1 bg-stone-100 text-stone-600 border border-stone-300 font-medium px-2 py-0.5 rounded-full text-[10px]">Inactive</span>;
      default:
        return <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-900 border border-teal-300 font-bold px-2 py-0.5 rounded-full text-[10px]"><UserCheck size={11} className="text-teal-700" /> Active</span>;
    }
  };

  return (
    <div id="admin-crm-360-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Banner */}
      <div className="bg-[#1C2E20] text-amber-50 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-950">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-[#1C2E20] text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              OMNICHANNEL CRM 360 & ANALYTICS
            </span>
            <span className="text-xs text-emerald-300 font-medium">Consolidated Customer Intelligence</span>
          </div>
          <h1 className="font-serif text-3xl font-bold mt-1.5 text-white">Omnichannel Customer Data Platform</h1>
          <p className="text-xs text-emerald-100/80 max-w-2xl mt-1">
            Consolidates transactions and behavioral data from <strong>Website</strong>, <strong>Shopee</strong>, and <strong>TikTok Shop</strong> into unified 360° customer profiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-emerald-900/60 border border-emerald-700/60 px-4 py-2.5 rounded-2xl text-xs text-emerald-100">
            <span className="text-[10px] block uppercase text-emerald-300 font-bold">Connected Channels</span>
            <div className="flex items-center gap-2 mt-0.5 font-bold">
              <span className="flex items-center gap-1"><Globe size={12} className="text-emerald-400" /> Website</span>
              <span className="text-emerald-600">•</span>
              <span className="flex items-center gap-1"><ShoppingCart size={12} className="text-orange-400" /> Shopee</span>
              <span className="text-emerald-600">•</span>
              <span className="flex items-center gap-1"><Video size={12} className="text-rose-400" /> TikTok Shop</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top-Level Omnichannel KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Total Customers</span>
            <Users size={16} className="text-[#263D2B]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1C2E20]">{kpis.totalCustomers}</p>
          <p className="text-[10px] text-emerald-700 font-semibold">Unified Profiles</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Total Orders</span>
            <ShoppingBag size={16} className="text-[#263D2B]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1C2E20]">{kpis.totalOrders}</p>
          <p className="text-[10px] text-stone-500">Across 3 Channels</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Gross Revenue</span>
            <DollarSign size={16} className="text-[#263D2B]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1C2E20]">${kpis.totalRevenue.toFixed(2)}</p>
          <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
            <TrendingUp size={10} /> +19.2% MoM
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Average Order Value</span>
            <Layers size={16} className="text-[#263D2B]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1C2E20]">${kpis.aov.toFixed(2)}</p>
          <p className="text-[10px] text-stone-500">Per Omnichannel Order</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Repeat Customer Rate</span>
            <RefreshCw size={16} className="text-[#263D2B]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1C2E20]">{kpis.repeatRate.toFixed(1)}%</p>
          <p className="text-[10px] text-emerald-700 font-semibold">{unifiedCustomers.filter(c => c.totalOrders >= 2).length} Repeat Buyers</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-stone-500 text-xs">
            <span>Retention Rate</span>
            <UserCheck size={16} className="text-[#263D2B]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1C2E20]">{kpis.retentionRate.toFixed(1)}%</p>
          <p className="text-[10px] text-stone-500">Active within 90d</p>
        </div>
      </div>

      {/* 3. Sales Channel Performance Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Official Website Channel */}
        <div 
          onClick={() => setChannelFilter(channelFilter === 'Website' ? 'ALL' : 'Website')}
          className={`cursor-pointer transition-all bg-white p-5 rounded-3xl border ${channelFilter === 'Website' ? 'ring-2 ring-emerald-700 border-emerald-700 shadow-md' : 'border-stone-200 shadow-sm hover:border-emerald-500'}`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                <Globe size={18} />
              </div>
              <div>
                <h3 className="font-bold text-xs text-stone-900">Official Website</h3>
                <span className="text-[10px] text-emerald-700 font-semibold">Direct DTC & BOPIS</span>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
              {kpis.totalRevenue > 0 ? ((kpis.channelPerformance.Website.revenue / kpis.totalRevenue) * 100).toFixed(1) : 0}% Share
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 text-center">
            <div className="bg-stone-50 p-2 rounded-xl">
              <p className="text-[10px] text-stone-500">Orders</p>
              <p className="font-bold text-stone-900 text-sm">{kpis.channelPerformance.Website.orders}</p>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl">
              <p className="text-[10px] text-stone-500">Revenue</p>
              <p className="font-bold text-emerald-800 text-sm">${kpis.channelPerformance.Website.revenue.toFixed(0)}</p>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl">
              <p className="text-[10px] text-stone-500">Buyers</p>
              <p className="font-bold text-stone-900 text-sm">{kpis.channelPerformance.Website.customers.size}</p>
            </div>
          </div>
        </div>

        {/* Shopee Channel */}
        <div 
          onClick={() => setChannelFilter(channelFilter === 'Shopee' ? 'ALL' : 'Shopee')}
          className={`cursor-pointer transition-all bg-white p-5 rounded-3xl border ${channelFilter === 'Shopee' ? 'ring-2 ring-orange-500 border-orange-500 shadow-md' : 'border-stone-200 shadow-sm hover:border-orange-400'}`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700">
                <ShoppingCart size={18} />
              </div>
              <div>
                <h3 className="font-bold text-xs text-stone-900">Shopee Mall</h3>
                <span className="text-[10px] text-orange-700 font-semibold">Marketplace Orders</span>
              </div>
            </div>
            <span className="text-[10px] bg-orange-50 text-orange-900 border border-orange-200 px-2 py-0.5 rounded-full font-bold">
              {kpis.totalRevenue > 0 ? ((kpis.channelPerformance.Shopee.revenue / kpis.totalRevenue) * 100).toFixed(1) : 0}% Share
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 text-center">
            <div className="bg-stone-50 p-2 rounded-xl">
              <p className="text-[10px] text-stone-500">Orders</p>
              <p className="font-bold text-stone-900 text-sm">{kpis.channelPerformance.Shopee.orders}</p>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl">
              <p className="text-[10px] text-stone-500">Revenue</p>
              <p className="font-bold text-orange-800 text-sm">${kpis.channelPerformance.Shopee.revenue.toFixed(0)}</p>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl">
              <p className="text-[10px] text-stone-500">Buyers</p>
              <p className="font-bold text-stone-900 text-sm">{kpis.channelPerformance.Shopee.customers.size}</p>
            </div>
          </div>
        </div>

        {/* TikTok Shop Channel */}
        <div 
          onClick={() => setChannelFilter(channelFilter === 'TikTok Shop' ? 'ALL' : 'TikTok Shop')}
          className={`cursor-pointer transition-all bg-white p-5 rounded-3xl border ${channelFilter === 'TikTok Shop' ? 'ring-2 ring-slate-900 border-slate-900 shadow-md' : 'border-stone-200 shadow-sm hover:border-slate-400'}`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-rose-400">
                <Video size={18} />
              </div>
              <div>
                <h3 className="font-bold text-xs text-stone-900">TikTok Shop</h3>
                <span className="text-[10px] text-slate-600 font-semibold">Social Commerce & LIVE</span>
              </div>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-900 border border-slate-300 px-2 py-0.5 rounded-full font-bold">
              {kpis.totalRevenue > 0 ? ((kpis.channelPerformance['TikTok Shop'].revenue / kpis.totalRevenue) * 100).toFixed(1) : 0}% Share
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 text-center">
            <div className="bg-stone-50 p-2 rounded-xl">
              <p className="text-[10px] text-stone-500">Orders</p>
              <p className="font-bold text-stone-900 text-sm">{kpis.channelPerformance['TikTok Shop'].orders}</p>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl">
              <p className="text-[10px] text-stone-500">Revenue</p>
              <p className="font-bold text-slate-900 text-sm">${kpis.channelPerformance['TikTok Shop'].revenue.toFixed(0)}</p>
            </div>
            <div className="bg-stone-50 p-2 rounded-xl">
              <p className="text-[10px] text-stone-500">Buyers</p>
              <p className="font-bold text-stone-900 text-sm">{kpis.channelPerformance['TikTok Shop'].customers.size}</p>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Filter & Search Toolbar */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          
          {/* Search bar */}
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, email, phone, Customer ID (e.g. CUS-00125), or Order Ref..."
              className="w-full bg-[#FAF8F5] border border-stone-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            
            {/* Channel filter */}
            <div className="flex items-center gap-1 bg-[#FAF8F5] border border-stone-200 rounded-2xl px-3 py-1.5">
              <Filter size={13} className="text-stone-400" />
              <select
                value={channelFilter}
                onChange={e => setChannelFilter(e.target.value as any)}
                className="bg-transparent text-stone-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Sales Channels</option>
                <option value="Website">Website Only</option>
                <option value="Shopee">Shopee Only</option>
                <option value="TikTok Shop">TikTok Shop Only</option>
              </select>
            </div>

            {/* Segment filter */}
            <div className="flex items-center gap-1 bg-[#FAF8F5] border border-stone-200 rounded-2xl px-3 py-1.5">
              <Star size={13} className="text-stone-400" />
              <select
                value={segmentFilter}
                onChange={e => setSegmentFilter(e.target.value as any)}
                className="bg-transparent text-stone-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Customer Segments</option>
                <option value="Loyal Customer">Loyal Customer</option>
                <option value="High-Value Customer">High-Value Customer</option>
                <option value="Repeat Customer">Repeat Buyer</option>
                <option value="Active Customer">Active Customer</option>
                <option value="New Customer">New Customer</option>
                <option value="At-Risk Customer">At Risk</option>
                <option value="Inactive Customer">Inactive</option>
              </select>
            </div>

            {/* Order status filter */}
            <div className="flex items-center gap-1 bg-[#FAF8F5] border border-stone-200 rounded-2xl px-3 py-1.5">
              <Tag size={13} className="text-stone-400" />
              <select
                value={orderStatusFilter}
                onChange={e => setOrderStatusFilter(e.target.value)}
                className="bg-transparent text-stone-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Order Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="SHIPPED">Shipped</option>
                <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>

            {(channelFilter !== 'ALL' || segmentFilter !== 'ALL' || orderStatusFilter !== 'ALL' || searchTerm) && (
              <button
                onClick={() => {
                  setChannelFilter('ALL');
                  setSegmentFilter('ALL');
                  setOrderStatusFilter('ALL');
                  setSearchTerm('');
                }}
                className="px-3 py-2 text-[11px] font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Reset
              </button>
            )}

          </div>

        </div>

        {/* Quick segment pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-stone-100 text-[11px]">
          <span className="text-stone-400 font-medium self-center mr-1">Quick Filter:</span>
          {[
            { label: 'All', value: 'ALL', count: unifiedCustomers.length },
            { label: 'Loyal', value: 'Loyal Customer', count: unifiedCustomers.filter(c => c.segment === 'Loyal Customer').length },
            { label: 'High Value', value: 'High-Value Customer', count: unifiedCustomers.filter(c => c.segment === 'High-Value Customer').length },
            { label: 'Repeat', value: 'Repeat Customer', count: unifiedCustomers.filter(c => c.segment === 'Repeat Customer').length },
            { label: 'New', value: 'New Customer', count: unifiedCustomers.filter(c => c.segment === 'New Customer').length },
            { label: 'At Risk', value: 'At-Risk Customer', count: unifiedCustomers.filter(c => c.segment === 'At-Risk Customer').length },
          ].map(p => (
            <button
              key={p.value}
              onClick={() => setSegmentFilter(p.value as any)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${segmentFilter === p.value ? 'bg-[#2E4A32] text-amber-50 shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
            >
              <span>{p.label}</span>
              <span className={`text-[10px] px-1 rounded ${segmentFilter === p.value ? 'bg-emerald-900/60 text-emerald-200' : 'bg-stone-200 text-stone-700 font-bold'}`}>{p.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Master Omnichannel Customers Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#FAF8F5]">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#1C2E20]">Unified Customer Directory ({filteredCustomers.length})</h2>
            <p className="text-xs text-stone-500">Cross-channel customer identities with consolidated purchasing history</p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full">
            Real-Time Omnichannel Traceability
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-100/75 text-stone-600 text-[11px] font-bold uppercase tracking-wider border-b border-stone-200">
                <th className="p-4">Customer Profile</th>
                <th className="p-4">Sales Channels Used</th>
                <th className="p-4">Customer Segment</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Omnichannel Spend (LTV)</th>
                <th className="p-4">Last Order</th>
                <th className="p-4">Preferred Category</th>
                <th className="p-4 text-right">360 View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredCustomers.map(c => {
                return (
                  <tr 
                    key={c.id} 
                    onClick={() => setSelectedCustomerId(c.id)}
                    className="hover:bg-emerald-50/40 transition-colors cursor-pointer group"
                  >
                    {/* Customer Profile info */}
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={c.avatar || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%232D3B2D'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23D3E0D3' font-family='sans-serif' font-size='36' font-weight='bold'>AV</text></svg>"}
                          alt={c.name}
                          className="w-11 h-11 rounded-full object-cover border-2 border-stone-200 group-hover:border-emerald-700 transition-colors"
                        />
                        {c.channelsUsed.length >= 2 && (
                          <span className="absolute -bottom-1 -right-1 bg-[#1C2E20] text-amber-100 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white" title="Multi-channel shopper">
                            {c.channelsUsed.length}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-stone-900 group-hover:text-emerald-900">{c.name}</p>
                          <span className="font-mono text-[10px] text-stone-400 font-semibold">{c.customerId}</span>
                        </div>
                        <p className="text-[11px] text-stone-500">{c.email}</p>
                        <p className="text-[10px] text-stone-400 font-mono">{c.phone}</p>
                      </div>
                    </td>

                    {/* Sales Channels Used */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[190px]">
                        {c.channelStats.Website.count > 0 && renderChannelBadge('Website', c.channelStats.Website.count)}
                        {c.channelStats.Shopee.count > 0 && renderChannelBadge('Shopee', c.channelStats.Shopee.count)}
                        {c.channelStats['TikTok Shop'].count > 0 && renderChannelBadge('TikTok Shop', c.channelStats['TikTok Shop'].count)}
                      </div>
                      <p className="text-[10px] text-stone-400 mt-1 font-medium">
                        Preferred: <span className="font-bold text-stone-700">{c.preferredChannel}</span>
                      </p>
                    </td>

                    {/* Segment */}
                    <td className="p-4">
                      {renderSegmentBadge(c.segment)}
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        Tier: <span className="font-semibold text-stone-600">{c.loyaltyTier}</span> ({c.loyaltyPoints} pts)
                      </p>
                    </td>

                    {/* Orders count & frequency */}
                    <td className="p-4">
                      <p className="font-bold text-stone-900">{c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}</p>
                      {c.purchaseFrequencyDays > 0 ? (
                        <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> Every ~{c.purchaseFrequencyDays}d
                        </p>
                      ) : (
                        <p className="text-[10px] text-stone-400 mt-0.5">Single order</p>
                      )}
                    </td>

                    {/* Omnichannel Lifetime Spend (LTV) */}
                    <td className="p-4">
                      <p className="font-serif font-bold text-base text-[#1C2E20]">${c.totalSpend.toFixed(2)}</p>
                      <p className="text-[10px] text-stone-500 font-medium">AOV: ${c.aov.toFixed(2)}</p>
                    </td>

                    {/* Last Order Date */}
                    <td className="p-4">
                      <p className="font-medium text-stone-800">{c.lastOrderDate.split('T')[0]}</p>
                      <span className={`text-[10px] font-semibold ${c.daysSinceLastOrder <= 7 ? 'text-emerald-700' : c.daysSinceLastOrder <= 30 ? 'text-blue-700' : 'text-stone-400'}`}>
                        {c.daysSinceLastOrder === 0 ? 'Today' : `${c.daysSinceLastOrder} days ago`}
                      </span>
                    </td>

                    {/* Preferred Category */}
                    <td className="p-4">
                      <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded text-[11px] font-medium">
                        {c.preferredCategory}
                      </span>
                      {c.productStats.length > 0 && (
                        <p className="text-[10px] text-stone-400 mt-0.5 truncate max-w-[130px]">
                          {c.productStats[0].productName}
                        </p>
                      )}
                    </td>

                    {/* 360 Action */}
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomerId(c.id);
                        }}
                        className="bg-stone-100 group-hover:bg-[#2E4A32] group-hover:text-amber-100 text-stone-800 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                      >
                        <span>CRM 360</span>
                        <ChevronRight size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-stone-500 italic">
                    <Users size={32} className="mx-auto text-stone-300 mb-2" />
                    <p className="font-semibold text-stone-700">No customer records matching your filters</p>
                    <p className="text-xs text-stone-400 mt-1">Try broadening your search term or sales channel selection.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Comprehensive Customer 360 Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white max-w-5xl w-full my-auto rounded-3xl shadow-2xl overflow-hidden border border-stone-300 max-h-[92vh] flex flex-col">
            
            {/* Modal Top Header */}
            <div className="bg-[#1C2E20] text-amber-50 p-6 flex items-start justify-between gap-4 border-b border-emerald-900">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedCustomer.avatar || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%232D3B2D'/><text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle' fill='%23D3E0D3' font-family='sans-serif' font-size='36' font-weight='bold'>AV</text></svg>"}
                    alt={selectedCustomer.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-200 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-amber-100 text-[#1C2E20] text-[9px] font-black px-1.5 py-0.5 rounded-full border border-emerald-900">
                    {selectedCustomer.loyaltyTier}
                  </span>
                </div>
                
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif text-2xl font-bold text-white">{selectedCustomer.name}</h2>
                    <span className="bg-emerald-800 text-emerald-200 font-mono text-xs font-bold px-2 py-0.5 rounded">
                      {selectedCustomer.customerId}
                    </span>
                    {renderSegmentBadge(selectedCustomer.segment)}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-100/80 mt-1">
                    <span className="flex items-center gap-1"><Mail size={12} /> {selectedCustomer.email}</span>
                    <span className="flex items-center gap-1"><Phone size={12} /> {selectedCustomer.phone}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> First Seen: {selectedCustomer.firstOrderDate.split('T')[0]}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomerId(null)}
                className="text-stone-300 hover:text-white bg-emerald-900/60 p-2 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="bg-[#FAF8F5] px-6 border-b border-stone-200 flex gap-6 text-xs font-bold">
              {[
                { id: 'overview', label: '360 Overview & Channels' },
                { id: 'orders', label: `Omnichannel Orders (${selectedCustomer.orders.length})` },
                { id: 'products', label: `Purchased Products (${selectedCustomer.productStats.length})` },
                { id: 'insights', label: 'AI Diagnostic & Behavior' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabInModal(tab.id as any)}
                  className={`py-3.5 border-b-2 transition-colors ${activeTabInModal === tab.id ? 'border-[#1C2E20] text-[#1C2E20]' : 'border-transparent text-stone-500 hover:text-stone-800'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              
              {/* TAB 1: OVERVIEW & CHANNEL BREAKDOWN */}
              {activeTabInModal === 'overview' && (
                <div className="space-y-6">
                  
                  {/* Key Financial KPIs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Lifetime Spend (LTV)</p>
                      <p className="font-serif text-2xl font-bold text-emerald-900 mt-1">${selectedCustomer.totalSpend.toFixed(2)}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Across all 3 sales channels</p>
                    </div>

                    <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total Transactions</p>
                      <p className="font-serif text-2xl font-bold text-[#1C2E20] mt-1">{selectedCustomer.totalOrders} Orders</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Avg ~{selectedCustomer.purchaseFrequencyDays > 0 ? `${selectedCustomer.purchaseFrequencyDays} days/order` : '1st order'}</p>
                    </div>

                    <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Average Order Value (AOV)</p>
                      <p className="font-serif text-2xl font-bold text-[#1C2E20] mt-1">${selectedCustomer.aov.toFixed(2)}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">Basket value</p>
                    </div>

                    <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200">
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Loyalty & Skin Match</p>
                      <p className="font-serif text-2xl font-bold text-amber-900 mt-1">{selectedCustomer.loyaltyTier}</p>
                      <p className="text-[10px] text-stone-500 mt-0.5">{selectedCustomer.skinType} skin • {selectedCustomer.loyaltyPoints} pts</p>
                    </div>
                  </div>

                  {/* Channel Breakdown Visualization */}
                  <div className="bg-white p-5 rounded-3xl border border-stone-200 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#1C2E20]">Sales Channel Performance Comparison</h3>
                        <p className="text-[11px] text-stone-500">Order count and gross revenue distribution across sales channels</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        Preferred Channel: {selectedCustomer.preferredChannel}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      
                      {/* Website */}
                      <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-emerald-900">
                            <Globe size={14} className="text-emerald-700" /> Official Website
                          </span>
                          <span className="font-bold text-xs">
                            {selectedCustomer.totalSpend > 0 ? ((selectedCustomer.channelStats.Website.spend / selectedCustomer.totalSpend) * 100).toFixed(0) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-700 h-full rounded-full" 
                            style={{ width: `${selectedCustomer.totalSpend > 0 ? (selectedCustomer.channelStats.Website.spend / selectedCustomer.totalSpend) * 100 : 0}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] pt-1">
                          <span className="text-stone-500">{selectedCustomer.channelStats.Website.count} Orders</span>
                          <span className="font-bold text-stone-900">${selectedCustomer.channelStats.Website.spend.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Shopee */}
                      <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-orange-900">
                            <ShoppingCart size={14} className="text-orange-600" /> Shopee Mall
                          </span>
                          <span className="font-bold text-xs">
                            {selectedCustomer.totalSpend > 0 ? ((selectedCustomer.channelStats.Shopee.spend / selectedCustomer.totalSpend) * 100).toFixed(0) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-orange-500 h-full rounded-full" 
                            style={{ width: `${selectedCustomer.totalSpend > 0 ? (selectedCustomer.channelStats.Shopee.spend / selectedCustomer.totalSpend) * 100 : 0}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] pt-1">
                          <span className="text-stone-500">{selectedCustomer.channelStats.Shopee.count} Orders</span>
                          <span className="font-bold text-stone-900">${selectedCustomer.channelStats.Shopee.spend.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* TikTok Shop */}
                      <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-slate-900">
                            <Video size={14} className="text-rose-500" /> TikTok Shop
                          </span>
                          <span className="font-bold text-xs">
                            {selectedCustomer.totalSpend > 0 ? ((selectedCustomer.channelStats['TikTok Shop'].spend / selectedCustomer.totalSpend) * 100).toFixed(0) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-slate-900 h-full rounded-full" 
                            style={{ width: `${selectedCustomer.totalSpend > 0 ? (selectedCustomer.channelStats['TikTok Shop'].spend / selectedCustomer.totalSpend) * 100 : 0}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] pt-1">
                          <span className="text-stone-500">{selectedCustomer.channelStats['TikTok Shop'].count} Orders</span>
                          <span className="font-bold text-stone-900">${selectedCustomer.channelStats['TikTok Shop'].spend.toFixed(2)}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Top Purchased Products Preview */}
                  <div className="bg-white p-5 rounded-3xl border border-stone-200 space-y-3">
                    <h3 className="font-serif text-base font-bold text-[#1C2E20]">Top Purchased Skincare Products</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedCustomer.productStats.slice(0, 3).map((p, idx) => (
                        <div key={p.productId + idx} className="flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-2xl border border-stone-200">
                          <img src={normalizeAVOLABImage(p.productImage)} alt={p.productName} className="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-stone-900 truncate">{p.productName}</p>
                            <p className="text-[10px] text-stone-500 font-mono">{p.sku} • {p.category}</p>
                            <div className="flex items-center justify-between mt-1 text-[11px]">
                              <span className="font-bold text-emerald-800">{p.quantity} units</span>
                              <span className="font-bold text-stone-700">${p.totalSpend.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: COMPLETE OMNICHANNEL ORDERS LOG */}
              {activeTabInModal === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#1C2E20]">Consolidated Omnichannel Transaction History</h3>
                      <p className="text-[11px] text-stone-500">Every order synced across Website, Shopee, and TikTok Shop</p>
                    </div>
                    <span className="text-xs text-stone-600 bg-stone-100 px-3 py-1 rounded-full font-bold">
                      {selectedCustomer.orders.length} Total Records
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-wider border-b border-stone-200">
                          <th className="p-3.5">Order Ref</th>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Sales Channel</th>
                          <th className="p-3.5">Purchased Items</th>
                          <th className="p-3.5">Fulfillment</th>
                          <th className="p-3.5">Total ($)</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-xs">
                        {selectedCustomer.orders.map(o => {
                          const ch = getOrderSalesChannel(o);
                          const isExpanded = expandedOrderId === o.id;
                          return (
                            <React.Fragment key={o.id}>
                              <tr 
                                onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                                className="hover:bg-stone-50/90 transition-colors cursor-pointer"
                              >
                                <td className="p-3.5 font-mono font-bold text-stone-900">{o.orderNumber}</td>
                                <td className="p-3.5 text-stone-600 whitespace-nowrap">{o.createdAt.split('T')[0]}</td>
                                <td className="p-3.5">{renderChannelBadge(ch)}</td>
                                <td className="p-3.5 max-w-[220px]">
                                  <p className="font-semibold text-stone-900 truncate">
                                    {(o.items || []).map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                                  </p>
                                  <p className="text-[10px] text-stone-400">{(o.items || []).length} unique SKU(s)</p>
                                </td>
                                <td className="p-3.5">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${o.fulfillmentType === 'BOPIS' ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-700'}`}>
                                    {o.fulfillmentType === 'BOPIS' ? 'Store Pickup' : 'Courier Delivery'}
                                  </span>
                                </td>
                                <td className="p-3.5 font-serif font-bold text-stone-900">${o.total.toFixed(2)}</td>
                                <td className="p-3.5">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${o.orderStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-900' : o.orderStatus === 'READY_FOR_PICKUP' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'}`}>
                                    {o.orderStatus}
                                  </span>
                                </td>
                                <td className="p-3.5 text-right">
                                  <button className="text-stone-400 hover:text-stone-700 p-1">
                                    <ChevronDown size={14} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                  </button>
                                </td>
                              </tr>

                              {/* Expanded Order Item Details for Traceability */}
                              {isExpanded && (
                                <tr className="bg-emerald-50/30">
                                  <td colSpan={8} className="p-4 border-b border-emerald-100">
                                    <div className="space-y-3 bg-white p-4 rounded-2xl border border-stone-200">
                                      <div className="flex items-center justify-between border-b pb-2">
                                        <h4 className="font-bold text-stone-900 text-xs">Itemized Line Items & Fulfillment Traceability</h4>
                                        <span className="text-[10px] text-stone-500 font-mono">Payment: {o.paymentMethod} ({o.paymentStatus})</span>
                                      </div>

                                      <div className="space-y-2">
                                        {(o.items || []).map((item, idx) => (
                                          <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-0">
                                            <div className="flex items-center gap-2.5">
                                              <img src={normalizeAVOLABImage(item.productImage)} alt={item.productName} className="w-8 h-8 rounded-lg object-cover border" />
                                              <div>
                                                <p className="font-bold text-stone-800">{item.productName}</p>
                                                <p className="text-[10px] text-stone-400 font-mono">SKU: {item.sku}</p>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <p className="font-bold text-stone-900">${(item.price * item.quantity).toFixed(2)}</p>
                                              <p className="text-[10px] text-stone-500">${item.price} × {item.quantity}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      {o.notes && (
                                        <div className="text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                                          <strong>Order Notes / Channel Metadata:</strong> {o.notes}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: PRODUCT & CATEGORY PREFERENCES */}
              {activeTabInModal === 'products' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#1C2E20]">Customer Product Affinity & Reorder Frequency</h3>
                    <p className="text-[11px] text-stone-500">Analysis of repeated purchases and category engagement</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedCustomer.productStats.map((p, idx) => (
                      <div key={p.productId + idx} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
                        <img src={normalizeAVOLABImage(p.productImage)} alt={p.productName} className="w-16 h-16 rounded-2xl object-cover border border-stone-200 flex-shrink-0" />
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">{p.category}</span>
                            {p.orderCount > 1 && (
                              <span className="bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                                <RefreshCw size={9} /> Repeat x{p.orderCount}
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-stone-900 text-xs truncate">{p.productName}</h4>
                          <p className="text-[10px] text-stone-400 font-mono">SKU: {p.sku}</p>
                          <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-xs">
                            <span className="text-stone-500 font-medium">{p.quantity} Total Units</span>
                            <span className="font-serif font-bold text-emerald-800">${p.totalSpend.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: AI DIAGNOSTIC & BEHAVIOR INSIGHTS */}
              {activeTabInModal === 'insights' && (
                <div className="space-y-6">
                  {/* Skin Diagnosis Summary */}
                  <div className="bg-[#FAF8F5] p-5 rounded-3xl border border-stone-200 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold">
                      <Sparkles size={16} className="text-amber-500" />
                      <h4 className="font-serif text-base">Skin Diagnostic & Ingredient Matching Profile</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
                        <span className="text-[10px] text-stone-400 uppercase font-bold">Skin Classification</span>
                        <p className="font-serif text-base font-bold text-[#1C2E20] mt-0.5">{selectedCustomer.skinType}</p>
                      </div>
                      <div className="bg-white p-3.5 rounded-2xl border border-stone-200 col-span-2">
                        <span className="text-[10px] text-stone-400 uppercase font-bold">Diagnosed Skin Concerns</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {selectedCustomer.skinConcerns?.map((c, i) => (
                            <span key={i} className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Generated Recommendation Engine */}
                  <div className="bg-gradient-to-br from-[#1C2E20] to-[#2E4A32] text-amber-50 p-6 rounded-3xl space-y-3 shadow-lg border border-emerald-800">
                    <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-amber-300" />
                        <h4 className="font-serif text-base font-bold">AVOLAB AI Omnichannel Personalization Engine</h4>
                      </div>
                      <span className="bg-emerald-800/80 text-emerald-200 text-[10px] font-mono px-2 py-0.5 rounded">Real-Time Scoring</span>
                    </div>

                    <p className="text-xs leading-relaxed text-emerald-100/90">
                      Customer shows strong multi-channel loyalty with highest order velocity on <strong>{selectedCustomer.preferredChannel}</strong>. With a current replenishment cycle of <strong>~{selectedCustomer.purchaseFrequencyDays || 30} days</strong>, the customer is primed for automated replenishment notifications for <strong>{selectedCustomer.preferredCategory}</strong> products.
                    </p>

                    <div className="pt-2 flex flex-wrap gap-2 text-[11px]">
                      <span className="bg-emerald-900/80 text-amber-200 px-3 py-1 rounded-xl border border-emerald-700/60 font-semibold">
                        Suggested Offer: 15% VIP Refill Bundle
                      </span>
                      <span className="bg-emerald-900/80 text-emerald-200 px-3 py-1 rounded-xl border border-emerald-700/60 font-semibold">
                        Channel Push: {selectedCustomer.preferredChannel} Notification
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Bottom Actions Footer */}
            <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-stone-500 text-xs">
                <span>Customer ID: <strong className="font-mono text-stone-800">{selectedCustomer.customerId}</strong></span>
                <span>•</span>
                <span>Tier: <strong className="text-stone-800">{selectedCustomer.loyaltyTier}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    showToast(`Dispatched personalized omnichannel voucher to ${selectedCustomer.email}`);
                    setSelectedCustomerId(null);
                  }}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Mail size={14} /> Send VIP Promo
                </button>
                <button
                  onClick={() => setSelectedCustomerId(null)}
                  className="px-6 py-2 bg-[#2E4A32] text-amber-50 hover:bg-[#1C2E20] rounded-xl font-bold text-xs transition-colors shadow-sm"
                >
                  Close 360 View
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

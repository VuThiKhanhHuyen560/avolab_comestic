import React, { useState } from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import { AvolabLogo } from '../common/AvolabLogo';
import { NotificationCenter } from '../common/NotificationCenter';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Percent, 
  Megaphone, 
  Users, 
  Boxes, 
  Store, 
  Award, 
  Sparkles, 
  TrendingUp, 
  BarChart3, 
  ShieldCheck, 
  FileText, 
  Settings, 
  ScrollText, 
  LogOut, 
  Search, 
  Bell, 
  Menu, 
  X,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { 
    activeTab, 
    setActiveTab, 
    currentUser, 
    logout, 
    products, 
    orders, 
    users,
    notifications 
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'ADMIN_DASHBOARD', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { tab: 'ADMIN_PRODUCTS', label: 'Products', icon: <Package size={18} /> },
    { tab: 'ADMIN_CATEGORIES', label: 'Categories', icon: <Tags size={18} /> },
    { tab: 'ADMIN_PROMOTIONS', label: 'Promotions', icon: <Percent size={18} /> },
    { tab: 'ADMIN_CAMPAIGNS', label: 'Campaigns', icon: <Megaphone size={18} /> },
    { tab: 'ADMIN_CUSTOMERS', label: 'Customers / CRM', icon: <Users size={18} /> },
    { tab: 'ADMIN_INVENTORY', label: 'Inventory', icon: <Boxes size={18} /> },
    { tab: 'ADMIN_STORES', label: 'Stores & Warehouses', icon: <Store size={18} /> },
    { tab: 'ADMIN_LOYALTY', label: 'Loyalty Management', icon: <Award size={18} /> },
    { tab: 'ADMIN_AI', label: 'AI & Personalization', icon: <Sparkles size={18} /> },
    { tab: 'ADMIN_FORECASTING', label: 'Demand Forecasting', icon: <TrendingUp size={18} /> },
    { tab: 'ADMIN_REPORTS', label: 'Reports & BI', icon: <BarChart3 size={18} /> },
    { tab: 'ADMIN_USERS', label: 'Users & Roles', icon: <ShieldCheck size={18} /> },
    { tab: 'ADMIN_CONTENT', label: 'Content Management', icon: <FileText size={18} /> },
    { tab: 'ADMIN_SETTINGS', label: 'System Settings', icon: <Settings size={18} /> },
    { tab: 'ADMIN_AUDIT', label: 'Audit Logs', icon: <ScrollText size={18} /> },
  ];

  // Quick Global Search Results
  const matchingProducts = globalQuery.trim().length > 1
    ? products.filter(p => p.name.toLowerCase().includes(globalQuery.toLowerCase()) || p.sku.toLowerCase().includes(globalQuery.toLowerCase())).slice(0, 3)
    : [];

  const matchingOrders = globalQuery.trim().length > 1
    ? orders.filter(o => o.orderNumber.toLowerCase().includes(globalQuery.toLowerCase()) || o.customerName.toLowerCase().includes(globalQuery.toLowerCase())).slice(0, 3)
    : [];

  const matchingCustomers = globalQuery.trim().length > 1
    ? users.filter(u => u.role === 'CUSTOMER' && (u.name.toLowerCase().includes(globalQuery.toLowerCase()) || u.email.toLowerCase().includes(globalQuery.toLowerCase()))).slice(0, 3)
    : [];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#2D2D2D] flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-[#1C2E20] text-amber-50 sticky top-0 z-40 shadow-md border-b border-[#2E4A32]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg text-amber-100 hover:bg-[#2E4A32] transition-colors"
              aria-label="Toggle Navigation"
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="cursor-pointer flex items-center gap-2" onClick={() => setActiveTab('ADMIN_DASHBOARD')}>
              <AvolabLogo className="h-7 w-auto fill-amber-100" />
              <span className="bg-amber-400 text-stone-900 font-bold text-[10px] px-2 py-0.5 rounded tracking-wider uppercase ml-1">
                Admin Console
              </span>
            </div>
          </div>

          {/* Global Search */}
          <div className="relative flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
              <input
                type="text"
                value={globalQuery}
                onChange={e => {
                  setGlobalQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Global search across products, orders, customers..."
                className="w-full bg-[#2A432F] text-amber-50 placeholder-stone-400 pl-9 pr-4 py-1.5 rounded-lg text-xs border border-emerald-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Global Search Dropdown */}
            {isSearchOpen && globalQuery.trim().length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white text-stone-900 rounded-xl shadow-2xl border border-stone-200 z-50 p-3 max-h-96 overflow-y-auto space-y-3">
                <div className="flex items-center justify-between border-b pb-1">
                  <span className="text-[11px] font-bold text-stone-500 uppercase">Search Results</span>
                  <button onClick={() => setIsSearchOpen(false)} className="text-stone-400 hover:text-stone-600 text-xs">Close</button>
                </div>

                {matchingProducts.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold text-stone-400 mb-1">Products</h5>
                    {matchingProducts.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setActiveTab('ADMIN_PRODUCTS');
                          setIsSearchOpen(false);
                        }}
                        className="p-1.5 hover:bg-stone-100 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-stone-800">{p.name} ({p.sku})</span>
                        <span className="text-emerald-700 font-bold">${p.price}</span>
                      </div>
                    ))}
                  </div>
                )}

                {matchingOrders.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold text-stone-400 mb-1">Orders</h5>
                    {matchingOrders.map(o => (
                      <div
                        key={o.id}
                        onClick={() => {
                          setActiveTab('ADMIN_ORDERS');
                          setIsSearchOpen(false);
                        }}
                        className="p-1.5 hover:bg-stone-100 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-stone-800">{o.orderNumber} - {o.customerName}</span>
                        <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded font-mono">{o.orderStatus}</span>
                      </div>
                    ))}
                  </div>
                )}

                {matchingCustomers.length > 0 && (
                  <div>
                    <h5 className="text-[11px] font-bold text-stone-400 mb-1">Customers</h5>
                    {matchingCustomers.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setActiveTab('ADMIN_CUSTOMERS');
                          setIsSearchOpen(false);
                        }}
                        className="p-1.5 hover:bg-stone-100 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-stone-800">{c.name}</span>
                        <span className="text-stone-500 text-[11px]">{c.email}</span>
                      </div>
                    ))}
                  </div>
                )}

                {matchingProducts.length === 0 && matchingOrders.length === 0 && matchingCustomers.length === 0 && (
                  <p className="text-xs text-stone-500 italic text-center py-2">No matching records found for "{globalQuery}"</p>
                )}
              </div>
            )}
          </div>

          {/* Right Admin Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('HOME')}
              className="hidden md:flex items-center gap-1.5 text-xs text-amber-200/80 hover:text-amber-100 hover:underline"
            >
              <ExternalLink size={14} /> Storefront Preview
            </button>

            <NotificationCenter />

            <div className="flex items-center gap-2 border-l border-[#2E4A32] pl-3">
              <img
                src={currentUser?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"}
                alt="Admin Avatar"
                className="w-8 h-8 rounded-full border border-amber-400 object-cover"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-amber-100 leading-tight">{currentUser?.name || 'Admin User'}</p>
                <p className="text-[10px] text-amber-300/70 font-mono">System Administrator</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout System"
              className="p-1.5 text-red-300 hover:text-red-100 hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + View */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#1C2E20] text-stone-200 flex flex-col justify-between transition-transform duration-300 border-r border-[#2E4A32]
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:min-h-[calc(100vh-4rem)] top-16
        `}>
          <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)] scrollbar-thin">
            <p className="text-[10px] font-bold tracking-widest text-emerald-400/80 uppercase px-3 py-1">Governance & Modules</p>
            {navItems.map(item => {
              const isActive = activeTab === item.tab || (item.tab === 'ADMIN_PRODUCTS' && activeTab === 'ADMIN_CATALOG') || (item.tab === 'ADMIN_CUSTOMERS' && activeTab === 'ADMIN_CRM') || (item.tab === 'ADMIN_INVENTORY' && activeTab === 'ADMIN_INVENTORY_MATRIX') || (item.tab === 'ADMIN_REPORTS' && activeTab === 'ADMIN_BI_ANALYTICS');
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    setActiveTab(item.tab);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group
                    ${isActive
                      ? 'bg-[#2E4A32] text-amber-300 font-bold shadow-inner border border-emerald-600/50' 
                      : 'text-stone-300 hover:bg-[#2A432F] hover:text-amber-100'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-amber-400' : 'text-emerald-400 group-hover:text-amber-300'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-amber-400" />}
                </button>
              );
            })}
          </div>

          <div className="p-4 border-t border-[#2E4A32] bg-[#17261A]">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-950/40 text-red-300 border border-red-800/40 hover:bg-red-900/60 hover:text-red-100 rounded-xl text-xs font-bold transition-all"
            >
              <LogOut size={16} /> Exit Administrator Session
            </button>
          </div>
        </aside>

        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          />
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};

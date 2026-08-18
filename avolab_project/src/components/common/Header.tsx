import React, { useState, useRef, useEffect } from 'react';
import { useApp, ActiveTab } from '../../context/AppContext';
import { AvolabLogo } from './AvolabLogo';
import { 
  ShoppingBag, 
  Heart, 
  Sparkles, 
  Search, 
  Bell, 
  MapPin, 
  Gift, 
  RefreshCw, 
  PackageCheck, 
  BarChart3, 
  Layers, 
  Users, 
  TrendingUp, 
  FileText,
  User,
  QrCode,
  SlidersHorizontal,
  ChevronDown,
  LogIn,
  LogOut,
  UserPlus,
  HelpCircle,
  Package,
  Headphones
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export const Header: React.FC = () => {
  const { 
    role, 
    activeTab, 
    setActiveTab, 
    cart, 
    wishlist, 
    compareList, 
    setIsCartOpen, 
    notifications,
    setIsAiBotOpen,
    customer,
    currentUser,
    logout,
    isLive,
    lastSyncedAt,
    orders,
    currentStaffStoreId
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifs = notifications.filter(n => !n.read && (n.recipientRole === role || n.recipientRole === 'ALL') && (!n.recipientUserId || n.recipientUserId === currentUser?.id)).length;
  const hasReadyBopis = orders.some(o => o.fulfillmentType === 'BOPIS' && o.storeId === currentStaffStoreId && o.orderStatus === 'READY_FOR_PICKUP');
  const showBopisVerification = role === 'STAFF' && (hasReadyBopis || activeTab === 'STAFF_BOPIS');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('SHOP');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] shadow-2xs border-b border-[#4C5D4B]/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
          
          {/* Brand Logo & Desktop Nav */}
          <div className="flex items-center gap-4 lg:gap-8 flex-shrink-0 min-w-0">
            <div className="flex-shrink-0">
              <AvolabLogo
                variant="primary"
                onClick={() => setActiveTab(role === 'CUSTOMER' ? 'HOME' : role === 'STAFF' ? 'STAFF_DASHBOARD' : 'ADMIN_BI_ANALYTICS')}
              />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[11px] uppercase tracking-widest font-semibold text-[#4C5D4B]">
              {role === 'CUSTOMER' && (
                <>
                  <button
                    onClick={() => setActiveTab('HOME')}
                    className={`hover:text-[#4A5D4E] transition-colors whitespace-nowrap ${activeTab === 'HOME' ? 'text-[#4A5D4E] font-bold border-b-2 border-[#4A5D4E] pb-0.5' : ''}`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => setActiveTab('SHOP')}
                    className={`hover:text-[#4A5D4E] transition-colors whitespace-nowrap ${activeTab === 'SHOP' ? 'text-[#4A5D4E] font-bold border-b-2 border-[#4A5D4E] pb-0.5' : ''}`}
                  >
                    Shop All
                  </button>
                  <button
                    onClick={() => setActiveTab('AI_BEAUTY_ASSISTANT')}
                    className={`hover:text-[#4A5D4E] transition-colors font-bold flex items-center gap-1.5 bg-[#4A5D4E] text-[#FFFFFF] px-3 py-1 rounded-full text-[10px] uppercase tracking-wider shadow-2xs hover:bg-[#4C5D4B] whitespace-nowrap ${activeTab === 'AI_BEAUTY_ASSISTANT' ? 'ring-2 ring-[#DDEAD2]' : ''}`}
                  >
                    <Sparkles size={13} className="text-[#DDEAD2] animate-pulse" />
                    AI Routine Quiz
                  </button>
                  <button
                    onClick={() => setActiveTab('STORE_LOCATOR')}
                    className={`hover:text-[#4A5D4E] transition-colors flex items-center gap-1 whitespace-nowrap ${activeTab === 'STORE_LOCATOR' ? 'text-[#4A5D4E] font-bold border-b-2 border-[#4A5D4E] pb-0.5' : ''}`}
                  >
                    <MapPin size={14} />
                    Flagship Stores
                  </button>
                  <button
                    onClick={() => setActiveTab('LOYALTY')}
                    className={`hover:text-[#4A5D4E] transition-colors flex items-center gap-1 whitespace-nowrap ${activeTab === 'LOYALTY' ? 'text-[#4A5D4E] font-bold' : ''}`}
                  >
                    <Gift size={14} />
                    Loyalty
                  </button>
                  <button
                    onClick={() => setActiveTab('SUBSCRIPTIONS')}
                    className={`hover:text-[#4A5D4E] transition-colors flex items-center gap-1 whitespace-nowrap ${activeTab === 'SUBSCRIPTIONS' ? 'text-[#4A5D4E] font-bold' : ''}`}
                  >
                    <RefreshCw size={14} />
                    Refills
                  </button>
                </>
              )}

              {role === 'STAFF' && (
                <>
                  <button
                    onClick={() => setActiveTab('STAFF_DASHBOARD')}
                    className={`hover:text-[#263D2B] transition-colors whitespace-nowrap text-[#4A5D4E] ${activeTab === 'STAFF_DASHBOARD' ? 'text-[#263D2B] font-bold border-b-2 border-[#DDEAD2] pb-0.5' : ''}`}
                  >
                    Ops Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('STAFF_ORDERS')}
                    className={`hover:text-[#263D2B] transition-colors flex items-center gap-1.5 whitespace-nowrap text-[#4A5D4E] ${activeTab === 'STAFF_ORDERS' ? 'text-[#263D2B] font-bold border-b-2 border-[#DDEAD2] pb-0.5' : ''}`}
                  >
                    <PackageCheck size={15} className="text-[#4A5D4E]" />
                    Orders (OMS)
                  </button>
                  {showBopisVerification && (
                    <button
                      onClick={() => setActiveTab('STAFF_BOPIS')}
                      className={`hover:text-[#263D2B] transition-colors flex items-center gap-1.5 whitespace-nowrap text-[#4A5D4E] ${activeTab === 'STAFF_BOPIS' ? 'text-[#263D2B] font-bold border-b-2 border-[#DDEAD2] pb-0.5' : ''}`}
                    >
                      <QrCode size={15} className="text-[#4A5D4E]" />
                      BOPIS Verification
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('STAFF_SUPPORT')}
                    className={`hover:text-[#263D2B] transition-colors flex items-center gap-1.5 whitespace-nowrap text-[#4A5D4E] ${activeTab === 'STAFF_SUPPORT' ? 'text-[#263D2B] font-bold border-b-2 border-[#DDEAD2] pb-0.5' : ''}`}
                  >
                    <Headphones size={15} className="text-[#4A5D4E]" />
                    Support Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('STAFF_INVENTORY')}
                    className={`hover:text-[#263D2B] transition-colors flex items-center gap-1.5 whitespace-nowrap text-[#4A5D4E] ${activeTab === 'STAFF_INVENTORY' ? 'text-[#263D2B] font-bold border-b-2 border-[#DDEAD2] pb-0.5' : ''}`}
                  >
                    <Layers size={15} className="text-[#4A5D4E]" />
                    Inventory (WMS)
                  </button>
                </>
              )}

              {role === 'ADMIN' && (
                <>
                  <button
                    onClick={() => setActiveTab('ADMIN_BI_ANALYTICS')}
                    className={`hover:text-[#4A5D4E] transition-colors flex items-center gap-1 whitespace-nowrap ${activeTab === 'ADMIN_BI_ANALYTICS' || activeTab === 'ADMIN_DASHBOARD' ? 'text-[#4A5D4E] font-bold border-b-2 border-[#4A5D4E] pb-0.5' : ''}`}
                  >
                    <BarChart3 size={15} />
                    BI Analytics
                  </button>
                  <button
                    onClick={() => setActiveTab('ADMIN_PRODUCTS')}
                    className={`hover:text-[#4A5D4E] transition-colors whitespace-nowrap ${activeTab === 'ADMIN_PRODUCTS' || activeTab === 'ADMIN_CATALOG' ? 'text-[#4A5D4E] font-bold border-b-2 border-[#4A5D4E] pb-0.5' : ''}`}
                  >
                    Products
                  </button>
                  <button
                    onClick={() => setActiveTab('ADMIN_FORECASTING')}
                    className={`hover:text-[#4A5D4E] transition-colors flex items-center gap-1 whitespace-nowrap ${activeTab === 'ADMIN_FORECASTING' || activeTab === 'ADMIN_AI' ? 'text-[#4A5D4E] font-bold border-b-2 border-[#4A5D4E] pb-0.5' : ''}`}
                  >
                    <TrendingUp size={15} />
                    AI Forecasting
                  </button>
                  <button
                    onClick={() => setActiveTab('ADMIN_CRM')}
                    className={`hover:text-[#4A5D4E] transition-colors flex items-center gap-1 whitespace-nowrap ${activeTab === 'ADMIN_CRM' || activeTab === 'ADMIN_CUSTOMERS' ? 'text-[#4A5D4E] font-bold border-b-2 border-[#4A5D4E] pb-0.5' : ''}`}
                  >
                    <Users size={15} />
                    CRM 360
                  </button>
                  <button
                    onClick={() => setActiveTab('ADMIN_AUDIT_LOGS')}
                    className={`hover:text-[#4A5D4E] transition-colors flex items-center gap-1 whitespace-nowrap ${activeTab === 'ADMIN_AUDIT_LOGS' || activeTab === 'ADMIN_AUDIT' ? 'text-[#4A5D4E] font-bold border-b-2 border-[#4A5D4E] pb-0.5' : ''}`}
                  >
                    <FileText size={15} />
                    Audit Logs
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Search & Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Search Icon ONLY */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-[#FFFFFF] border border-[#4C5D4B]/30 rounded-full px-3 py-1.5 shadow-lg w-64 sm:w-80 z-50">
                  <Search size={16} className="text-[#4A5D4E] mr-2 flex-shrink-0" />
                  <form onSubmit={handleSearchSubmit} className="w-full">
                    <input
                      type="text"
                      placeholder="Search clean products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full bg-transparent text-xs text-[#4A5D4E] placeholder-[#4C5D4B]/60 focus:outline-none"
                    />
                  </form>
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-[#4C5D4B] hover:text-[#4A5D4E] ml-1 font-bold text-sm"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-[#4A5D4E] hover:bg-[#DDEAD2]/40 rounded-full transition-colors flex items-center justify-center"
                  title="Search clean products"
                  aria-label="Search"
                >
                  <Search size={22} className="text-[#4A5D4E]" />
                </button>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 text-[#4A5D4E] hover:bg-[#DDEAD2]/40 rounded-full transition-colors relative"
                title="Notifications Center"
              >
                <Bell size={20} className="text-[#4A5D4E]" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 bg-[#4A5D4E] text-[#FFFFFF] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <NotificationCenter onClose={() => setIsNotifOpen(false)} />
              )}
            </div>

            {role === 'CUSTOMER' && (
              <>
                {/* Wishlist & Compare */}
                <button
                  onClick={() => setActiveTab('WISHLIST_COMPARE')}
                  className="p-2 text-[#4A5D4E] hover:bg-[#DDEAD2]/40 rounded-full transition-colors relative hidden sm:block"
                  title="Wishlist & Compare"
                >
                  <Heart size={20} className="text-[#4A5D4E]" />
                  {wishlist.length > 0 && (
                    <span className="absolute top-1 right-1 bg-[#4A5D4E] text-[#FFFFFF] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* Compare shortcut */}
                <button
                  onClick={() => setActiveTab('WISHLIST_COMPARE')}
                  className="p-2 text-[#4A5D4E] hover:bg-[#DDEAD2]/40 rounded-full transition-colors relative hidden sm:block"
                  title="Product Compare Matrix"
                >
                  <SlidersHorizontal size={20} className="text-[#4A5D4E]" />
                  {compareList.length > 0 && (
                    <span className="absolute top-1 right-1 bg-[#4A5D4E] text-[#FFFFFF] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {compareList.length}
                    </span>
                  )}
                </button>

                {/* Shopping Cart Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="bg-[#4A5D4E] text-[#FFFFFF] px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#4C5D4B] transition-colors shadow-2xs"
                >
                  <ShoppingBag size={16} />
                  <span className="hidden sm:inline">Cart</span>
                  <span className="bg-[#DDEAD2] text-[#4A5D4E] font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                    {cartCount}
                  </span>
                </button>
              </>
            )}

            {/* User Session & Account Navigation Dropdown */}
            <div className="relative">
              {currentUser ? (
                <div className="flex items-center gap-2 pl-2 border-l border-[#E6E1D6]">
                  <button
                    onClick={() => setActiveTab(role === 'CUSTOMER' ? 'ACCOUNT' : role === 'STAFF' ? 'STAFF_DASHBOARD' : 'ADMIN_BI_ANALYTICS')}
                    className="flex items-center gap-2 p-1 text-left rounded-full hover:bg-[#F0EBE1] transition-colors"
                    title={`${currentUser.name} (${currentUser.role})`}
                  >
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#4A5D4E]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#4A5D4E] text-white flex items-center justify-center text-xs font-bold">
                        {currentUser.name.charAt(0)}
                      </div>
                    )}
                    <div className="hidden xl:block">
                      <p className="text-[11px] font-bold text-[#2D2D2D] leading-tight truncate max-w-[100px]">{currentUser.name}</p>
                      <p className="text-[9px] uppercase tracking-widest text-[#849673] font-bold">{currentUser.role}</p>
                    </div>
                  </button>

                  <button
                    onClick={logout}
                    className="p-2 text-[#888] hover:text-rose-700 hover:bg-rose-50 rounded-full transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('CUSTOMER_LOGIN')}
                    className="bg-[#4A5D4E] text-white px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 hover:bg-[#3A493D] transition-all shadow-2xs"
                  >
                    <LogIn size={14} />
                    <span>Sign In</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('CUSTOMER_REGISTER')}
                    className="bg-[#D9E3D0] text-[#4A5D4E] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest hidden sm:flex items-center gap-1.5 hover:bg-[#4A5D4E] hover:text-white transition-all shadow-2xs"
                  >
                    <UserPlus size={14} />
                    <span>Create Account</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-[#4C5D4B]/15 text-xs font-medium gap-4 no-scrollbar">
          {role === 'CUSTOMER' && (
            <>
              <button onClick={() => setActiveTab('HOME')} className={activeTab === 'HOME' ? 'font-bold text-[#4A5D4E]' : 'text-[#4C5D4B]'}>Home</button>
              <button onClick={() => setActiveTab('SHOP')} className={activeTab === 'SHOP' ? 'font-bold text-[#4A5D4E]' : 'text-[#4C5D4B]'}>Shop</button>
              <button onClick={() => setActiveTab('STORE_LOCATOR')} className={activeTab === 'STORE_LOCATOR' ? 'font-bold text-[#4A5D4E]' : 'text-[#4C5D4B]'}>Flagship Stores</button>
              <button onClick={() => setActiveTab('ORDERS')} className={activeTab === 'ORDERS' ? 'font-bold text-[#4A5D4E]' : 'text-[#4C5D4B]'}>Track Orders</button>
              <button onClick={() => setActiveTab('LOYALTY')} className={activeTab === 'LOYALTY' ? 'font-bold text-[#4A5D4E]' : 'text-[#4C5D4B]'}>Loyalty</button>
              <button onClick={() => setActiveTab('SUBSCRIPTIONS')} className={activeTab === 'SUBSCRIPTIONS' ? 'font-bold text-[#4A5D4E]' : 'text-[#4C5D4B]'}>Refills</button>
            </>
          )}
          {role === 'STAFF' && (
            <>
              <button onClick={() => setActiveTab('STAFF_DASHBOARD')} className={activeTab === 'STAFF_DASHBOARD' ? 'font-bold text-[#2E4A32]' : 'text-stone-600'}>Ops Dashboard</button>
              <button onClick={() => setActiveTab('STAFF_ORDERS')} className={activeTab === 'STAFF_ORDERS' ? 'font-bold text-[#2E4A32]' : 'text-stone-600'}>OMS Orders</button>
              {showBopisVerification && <button onClick={() => setActiveTab('STAFF_BOPIS')} className={activeTab === 'STAFF_BOPIS' ? 'font-bold text-[#2E4A32]' : 'text-stone-600'}>BOPIS QR Verify</button>}
              <button onClick={() => setActiveTab('STAFF_INVENTORY')} className={activeTab === 'STAFF_INVENTORY' ? 'font-bold text-[#2E4A32]' : 'text-stone-600'}>Inventory WMS</button>
            </>
          )}
          {role === 'ADMIN' && (
            <>
              <button onClick={() => setActiveTab('ADMIN_BI_ANALYTICS')} className={activeTab === 'ADMIN_BI_ANALYTICS' || activeTab === 'ADMIN_DASHBOARD' ? 'font-bold text-[#2E4A32]' : 'text-stone-600'}>BI Analytics</button>
              <button onClick={() => setActiveTab('ADMIN_PRODUCTS')} className={activeTab === 'ADMIN_PRODUCTS' || activeTab === 'ADMIN_CATALOG' ? 'font-bold text-[#2E4A32]' : 'text-stone-600'}>Products</button>
              <button onClick={() => setActiveTab('ADMIN_FORECASTING')} className={activeTab === 'ADMIN_FORECASTING' || activeTab === 'ADMIN_AI' ? 'font-bold text-[#2E4A32]' : 'text-stone-600'}>AI Forecasting</button>
              <button onClick={() => setActiveTab('ADMIN_CRM')} className={activeTab === 'ADMIN_CRM' || activeTab === 'ADMIN_CUSTOMERS' ? 'font-bold text-[#2E4A32]' : 'text-stone-600'}>CRM 360</button>
              <button onClick={() => setActiveTab('ADMIN_AUDIT_LOGS')} className={activeTab === 'ADMIN_AUDIT_LOGS' || activeTab === 'ADMIN_AUDIT' ? 'font-bold text-[#2E4A32]' : 'text-stone-600'}>Audit Logs</button>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

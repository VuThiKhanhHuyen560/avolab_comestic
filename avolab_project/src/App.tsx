import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AIChatbotModal } from './components/common/AIChatbotModal';
import { QRCodeModal } from './components/common/QRCodeModal';
import { ProductDetailModal } from './components/customer/ProductDetailModal';
import { CartDrawer } from './components/customer/CartDrawer';
import { Toast } from './components/common/Toast';

// Customer Page Views
import { CustomerHome } from './components/customer/CustomerHome';
import { ProductCatalog } from './components/customer/ProductCatalog';
import { AIBeautyAssistant } from './components/customer/AIBeautyAssistant';
import { OrderTrackingView } from './components/customer/OrderTrackingView';
import { WishlistAndCompare } from './components/customer/WishlistAndCompare';
import { StoreLocator } from './components/customer/StoreLocator';
import { LoyaltyCenter } from './components/customer/LoyaltyCenter';
import { SubscriptionManager } from './components/customer/SubscriptionManager';
import { CustomerSupport } from './components/customer/CustomerSupport';
import { CustomerStaffChatBubble } from './components/customer/CustomerStaffChatBubble';
import { CheckoutPage } from './components/customer/CheckoutPage';
import { CustomerAccountPage } from './components/customer/CustomerAccountPage';
import { CartPage } from './components/customer/CartPage';
import { NotificationsPage } from './components/customer/NotificationsPage';
import { OrderConfirmationPage } from './components/customer/OrderConfirmationPage';

// Staff Page Views
import { StaffOpsDashboard, StaffOrdersOMS } from './components/staff/StaffDashboard';
import { StaffQRVerification } from './components/staff/StaffQRVerification';
import { StaffInventoryControl } from './components/staff/StaffInventoryControl';
import { StaffCustomerLookup } from './components/staff/StaffCustomerLookup';
import { StaffSupportChat } from './components/staff/StaffSupportChat';

// Admin Page Views & Layout
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProductManager } from './components/admin/AdminProductManager';
import { AdminCategoryManager } from './components/admin/AdminCategoryManager';
import { AdminPromotionManager } from './components/admin/AdminPromotionManager';
import { AdminCampaignManager } from './components/admin/AdminCampaignManager';
import { AdminCustomerCRM } from './components/admin/AdminCustomerCRM';
import { AdminInventoryManager } from './components/admin/AdminInventoryManager';
import { AdminStoresManager } from './components/admin/AdminStoresManager';
import { AdminLoyaltyManager } from './components/admin/AdminLoyaltyManager';
import { AdminAIManager } from './components/admin/AdminAIManager';
import { AdminForecasting } from './components/admin/AdminForecasting';
import { AdminReportsBI } from './components/admin/AdminReportsBI';
import { AdminUsersRoles } from './components/admin/AdminUsersRoles';
import { AdminContentManager } from './components/admin/AdminContentManager';
import { AdminSystemSettings } from './components/admin/AdminSystemSettings';
import { AdminAuditLogs } from './components/admin/AdminAuditLogs';
import { AdminOrderManager } from './components/admin/AdminOrderManager';

// Auth Views
import { CustomerLoginPage } from './components/auth/CustomerLoginPage';
import { CustomerRegisterPage } from './components/auth/CustomerRegisterPage';
import { StaffLoginPage } from './components/auth/StaffLoginPage';
import { AdminLoginPage } from './components/auth/AdminLoginPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { PasswordResetPage } from './components/auth/PasswordResetPage';

const AppContent: React.FC = () => {
  const { activeTab, role, currentUser, setRedirectAfterLogin } = useApp();

  React.useEffect(() => {
    const protectedCustomerTabs = ['ACCOUNT', 'ORDERS', 'CHECKOUT', 'WISHLIST_COMPARE'];
    if (protectedCustomerTabs.includes(activeTab) && !currentUser) {
      setRedirectAfterLogin(activeTab as any);
    }
  }, [activeTab, currentUser, setRedirectAfterLogin]);

  const isAuthPage = [
    'LOGIN',
    'CUSTOMER_LOGIN',
    'CUSTOMER_REGISTER',
    'STAFF_LOGIN',
    'ADMIN_LOGIN',
    'FORGOT_PASSWORD',
    'PASSWORD_RESET'
  ].includes(activeTab);

  const isStaffTab = activeTab.startsWith('STAFF');
  const isAdminTab = activeTab.startsWith('ADMIN');

  const showHeader = !isAuthPage;
  const showFooter = !isAuthPage && !isStaffTab && !isAdminTab;

  const renderActiveView = () => {
    // Exact Auth Pages
    switch (activeTab) {
      case 'LOGIN':
      case 'CUSTOMER_LOGIN':
        return <CustomerLoginPage />;
      case 'CUSTOMER_REGISTER':
        return <CustomerRegisterPage />;
      case 'STAFF_LOGIN':
        return <StaffLoginPage />;
      case 'ADMIN_LOGIN':
        return <AdminLoginPage />;
      case 'FORGOT_PASSWORD':
        return <ForgotPasswordPage />;
      case 'PASSWORD_RESET':
        return <PasswordResetPage />;
    }

    // Role Protection & Unauthenticated Guards
    if (isStaffTab && role !== 'STAFF') {
      return <StaffLoginPage />;
    }

    if (isAdminTab && role !== 'ADMIN') {
      return <AdminLoginPage />;
    }

    // Protected Customer Routes
    const protectedCustomerTabs = ['ACCOUNT', 'ORDERS', 'CHECKOUT', 'WISHLIST_COMPARE'];
    if (protectedCustomerTabs.includes(activeTab) && !currentUser) {
      return <CustomerLoginPage />;
    }

    // Customer Views
    switch (activeTab) {
      case 'HOME': return <CustomerHome />;
      case 'SHOP': return <ProductCatalog />;
      case 'AI_BEAUTY_ASSISTANT': return <AIBeautyAssistant />;
      case 'ACCOUNT': return <CustomerAccountPage />;
      case 'CART': return <CartPage />;
      case 'NOTIFICATIONS': return <NotificationsPage />;
      case 'ORDER_CONFIRMATION': return <OrderConfirmationPage />;
      case 'ORDERS': return <OrderTrackingView />;
      case 'WISHLIST_COMPARE': return <WishlistAndCompare />;
      case 'STORE_LOCATOR': return <StoreLocator />;
      case 'LOYALTY': return <LoyaltyCenter />;
      case 'SUBSCRIPTIONS': return <SubscriptionManager />;
      // Customer support is now a persistent floating chat bubble. Keep the legacy
      // page component in the project for compatibility, but do not route users
      // to a separate support page.
      case 'SUPPORT': return <CustomerHome />;
      case 'CHECKOUT': return <CheckoutPage />;

      // Staff Views
      case 'STAFF_DASHBOARD': return <StaffOpsDashboard />;
      case 'STAFF_ORDERS': return <StaffOrdersOMS />;
      case 'STAFF_BOPIS': return <StaffQRVerification />;
      case 'STAFF_INVENTORY': return <StaffInventoryControl />;
      case 'STAFF_CUSTOMERS': return <StaffCustomerLookup />;
      case 'STAFF_SUPPORT': return <StaffSupportChat />;

      // Admin Views
      case 'ADMIN_DASHBOARD':
      case 'ADMIN_BI_ANALYTICS':
        return <AdminDashboard />;
      case 'ADMIN_PRODUCTS':
      case 'ADMIN_CATALOG':
        return <AdminProductManager />;
      case 'ADMIN_FORECASTING':
        return <AdminForecasting />;
      case 'ADMIN_AI':
        return <AdminAIManager />;
      case 'ADMIN_CRM':
      case 'ADMIN_CUSTOMERS':
        return <AdminCustomerCRM />;
      case 'ADMIN_AUDIT_LOGS':
      case 'ADMIN_AUDIT':
        return <AdminAuditLogs />;
      case 'ADMIN_REPORTS':
        return <AdminReportsBI />;
      case 'ADMIN_CATEGORIES':
        return <AdminCategoryManager />;
      case 'ADMIN_PROMOTIONS':
        return <AdminPromotionManager />;
      case 'ADMIN_CAMPAIGNS':
        return <AdminCampaignManager />;
      case 'ADMIN_INVENTORY':
      case 'ADMIN_INVENTORY_MATRIX':
        return <AdminInventoryManager />;
      case 'ADMIN_STORES':
        return <AdminStoresManager />;
      case 'ADMIN_LOYALTY':
        return <AdminLoyaltyManager />;
      case 'ADMIN_USERS':
        return <AdminUsersRoles />;
      case 'ADMIN_CONTENT':
        return <AdminContentManager />;
      case 'ADMIN_SETTINGS':
        return <AdminSystemSettings />;
      case 'ADMIN_ORDERS':
        return <AdminOrderManager />;

      default: return <CustomerHome />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E8] flex flex-col justify-between font-sans text-[#4A5D4E] antialiased selection:bg-[#DDEAD2] selection:text-[#4A5D4E]">
      <div>
        {showHeader && <Header />}
        <main>
          {renderActiveView()}
        </main>
      </div>

      {showFooter && <Footer />}

      {/* Global Overlays & Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <QRCodeModal />
      <AIChatbotModal />
      <Toast />
      {role === 'CUSTOMER' && currentUser && <CustomerStaffChatBubble />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

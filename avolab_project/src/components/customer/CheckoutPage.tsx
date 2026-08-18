import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QRCodeGenerator } from '../common/QRCodeGenerator';
import { OrderConfirmationPage } from './OrderConfirmationPage';
import { 
  CreditCard, 
  Store, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  ArrowLeft, 
  Lock, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Smartphone, 
  Banknote, 
  PlusCircle,
  Building2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Order } from '../../types';
import { getAVOLABProductImageFor } from '../../utils/productImages';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    customer, 
    currentUser, 
    stores, 
    placeOrder, 
    setActiveTab, 
    showToast 
  } = useApp();

  const [fulfillmentType, setFulfillmentType] = useState<'DELIVERY' | 'BOPIS'>('BOPIS');
  const [selectedStoreId, setSelectedStoreId] = useState<string>(stores[0]?.id || 'store-1');
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'E_WALLET' | 'COD' | 'BANK_QR'>('BANK_QR');
  
  // Payment simulation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Mobile Order Summary Toggle
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);

  // Customer Contact State
  const [fullName, setFullName] = useState(currentUser?.name || customer.name || 'Sophia Martinez');
  const [email, setEmail] = useState(currentUser?.email || customer.email || 'sophia.martinez@avolab.demo');
  const [phone, setPhone] = useState(currentUser?.phone || customer.phone || '+1 (555) 012-3456');

  // Address Book State
  const [savedAddresses] = useState([
    {
      id: 'addr-1',
      label: 'Home Address',
      recipient: 'Sophia Martinez',
      phone: '+1 (555) 012-3456',
      street: '124 Botanical Drive, Apt 4B',
      district: 'SoMa District',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      isDefault: true
    },
    {
      id: 'addr-[#addr-2]',
      label: 'Office Headquarters',
      recipient: 'Sophia Martinez',
      phone: '+1 (555) 987-6543',
      street: '500 Market Street, Floor 12',
      district: 'Financial District',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      isDefault: false
    }
  ]);
  const [selectedAddrId, setSelectedAddrId] = useState('addr-1');
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    recipient: fullName,
    phone: phone,
    street: '124 Botanical Drive, Apt 4B',
    district: 'SoMa',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    deliveryNote: 'Leave with front desk concierge if unattended.'
  });

  // Credit Card Demo Form State
  const [cardDetails, setCardDetails] = useState({
    cardholder: 'SOPHIA MARTINEZ',
    cardNumber: '4532 •••• •••• 8892',
    expiry: '08/28',
    cvv: '382'
  });

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity, 0);
  const shippingFee = fulfillmentType === 'BOPIS' ? 0 : subtotal > 50 ? 0 : 5.95;
  const total = subtotal + shippingFee;

  // Check store stock eligibility for BOPIS
  const getStoreStockStatus = (storeId: string) => {
    // Check if store has stock for all items in cart
    for (const item of cart) {
      const locStock = item.product.stockByLocation?.find(l => l.locationId === storeId);
      const availableInStore = locStock ? locStock.quantity : item.product.stockQuantity;
      if (availableInStore < item.quantity) {
        return { isEligible: false, availableQty: availableInStore, failingProduct: item.product.name };
      }
    }
    return { isEligible: true, availableQty: 12 };
  };

  const selectedStore = stores.find(s => s.id === selectedStoreId);
  const tempOrderNumber = `AVB-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(100 + Math.random() * 900)}`;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setPaymentError(null);
    setIsSubmitting(true);

    // Simulate Payment Processing delay
    await new Promise(res => setTimeout(res, 1200));

    if (simulateFailure) {
      setIsSubmitting(false);
      setPaymentError("Payment could not be completed. Please try another payment method or verify card details.");
      showToast("Payment failed simulation. Please try again.");
      return;
    }

    try {
      const created = await placeOrder({
        fulfillmentType,
        storeId: fulfillmentType === 'BOPIS' ? selectedStoreId : undefined,
        storeName: fulfillmentType === 'BOPIS' ? selectedStore?.name : undefined,
        shippingAddress: fulfillmentType === 'DELIVERY' ? {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode
        } : undefined,
        items: cart.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          productImage: getAVOLABProductImageFor(i.product),
          sku: i.product.sku,
          price: i.product.discountPrice || i.product.price,
          quantity: i.quantity
        })),
        subtotal,
        shippingFee,
        total,
        paymentMethod: paymentMethod === 'BANK_QR' ? 'PAYMENT_SIMULATION' : paymentMethod === 'CREDIT_CARD' ? 'CREDIT_CARD' : paymentMethod === 'E_WALLET' ? 'E_WALLET' : 'COD'
      });

      setConfirmedOrder(created);
    } catch (err) {
      setPaymentError("An error occurred creating the order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return <OrderConfirmationPage order={confirmedOrder} />;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#1C2E20]">Your Cart is Empty</h2>
        <p className="text-xs text-[#5A5A5A]">Please add skincare items to your cart before checking out.</p>
        <button
          onClick={() => setActiveTab('SHOP')}
          className="bg-[#4A5D4E] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#3A493D]"
        >
          Explore Skincare Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 selection:bg-[#D9E3D0] selection:text-[#4A5D4E]">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#E6E1D6] pb-5">
        <button
          onClick={() => setActiveTab('SHOP')}
          className="p-2 text-[#5A5A5A] hover:text-[#1A1A1A] rounded-full bg-[#F0EBE1] hover:bg-[#E6E1D6] transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C2E20]">Secure Express Checkout</h1>
          <p className="text-xs text-[#5A5A5A]">Omnichannel delivery & BOPIS store pickup verification</p>
        </div>
      </div>

      {/* Mobile Collapsible Summary Header */}
      <div className="lg:hidden bg-white border border-[#E6E1D6] rounded-2xl p-4 space-y-2">
        <div 
          onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[#1C2E20]">
            <span>Order Summary ({cart.reduce((s,i)=>s+i.quantity,0)} items)</span>
            {isMobileSummaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          <span className="font-extrabold text-sm text-[#1C2E20]">${total.toFixed(2)}</span>
        </div>

        {isMobileSummaryOpen && (
          <div className="pt-3 border-t border-[#E6E1D6] space-y-2 text-xs divide-y divide-[#E6E1D6]">
            {cart.map(item => (
              <div key={item.product.id} className="pt-2 first:pt-0 flex justify-between items-center">
                <span className="font-medium text-[#1A1A1A]">{item.product.name} (×{item.quantity})</span>
                <span className="font-bold">${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Form Layout */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Customer, Delivery/BOPIS, Payment */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Customer Contact Information */}
          <div className="bg-white border border-[#E6E1D6] rounded-3xl p-6 space-y-4 shadow-2xs">
            <h3 className="font-serif text-base font-bold text-[#1C2E20] flex items-center gap-2 border-b border-[#E6E1D6] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#D9E3D0] text-[#4A5D4E] flex items-center justify-center text-xs font-bold">1</span>
              Customer Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-[#2D2D2D] font-medium focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-[#2D2D2D] font-medium focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-[#2D2D2D] font-medium focus:outline-none focus:ring-1 focus:ring-[#4A5D4E]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Fulfillment Method (Home Delivery vs BOPIS) */}
          <div className="bg-white border border-[#E6E1D6] rounded-3xl p-6 space-y-5 shadow-2xs">
            <h3 className="font-serif text-base font-bold text-[#1C2E20] flex items-center gap-2 border-b border-[#E6E1D6] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#D9E3D0] text-[#4A5D4E] flex items-center justify-center text-xs font-bold">2</span>
              Delivery Method
            </h3>

            {/* Switcher Buttons */}
            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFulfillmentType('BOPIS')}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-1.5 transition-all ${
                  fulfillmentType === 'BOPIS'
                    ? 'bg-[#4A5D4E] text-white border-[#4A5D4E] shadow-sm'
                    : 'bg-[#F9F7F2] text-[#5A5A5A] border-[#E6E1D6] hover:bg-[#F0EBE1]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Store size={22} />
                  <span className="text-[10px] bg-[#D9E3D0] text-[#4A5D4E] px-2 py-0.5 rounded-full font-bold">FREE</span>
                </div>
                <span>BOPIS — Store Pickup</span>
                <span className="text-[10px] opacity-80 font-normal">Pick up in store • Ready within 2 hours</span>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('DELIVERY')}
                className={`p-4 rounded-2xl border text-left flex flex-col gap-1.5 transition-all ${
                  fulfillmentType === 'DELIVERY'
                    ? 'bg-[#4A5D4E] text-white border-[#4A5D4E] shadow-sm'
                    : 'bg-[#F9F7F2] text-[#5A5A5A] border-[#E6E1D6] hover:bg-[#F0EBE1]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Truck size={22} />
                  <span className="text-[10px] bg-[#D9E3D0] text-[#4A5D4E] px-2 py-0.5 rounded-full font-bold">ECO-COURIER</span>
                </div>
                <span>Home Delivery</span>
                <span className="text-[10px] opacity-80 font-normal">Dispatched in eco-packaging • 2-3 Days</span>
              </button>
            </div>

            {/* BOPIS Store Locator & Stock Check */}
            {fulfillmentType === 'BOPIS' && (
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A5D4E] block">
                  Select Store Location & Verify Inventory Availability:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stores.map(st => {
                    const { isEligible, availableQty, failingProduct } = getStoreStockStatus(st.id);
                    const isSelected = selectedStoreId === st.id;

                    return (
                      <div
                        key={st.id}
                        onClick={() => {
                          if (isEligible) setSelectedStoreId(st.id);
                        }}
                        className={`p-4 rounded-2xl border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#D9E3D0]/30 border-[#4A5D4E] ring-1 ring-[#4A5D4E]'
                            : !isEligible
                            ? 'bg-stone-50 border-stone-200 opacity-60 cursor-not-allowed'
                            : 'bg-[#F9F7F2] border-[#E6E1D6] hover:border-[#849673]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-[#1A1A1A]">{st.name}</h4>
                          <input
                            type="radio"
                            name="storeSelect"
                            disabled={!isEligible}
                            checked={isSelected}
                            onChange={() => setSelectedStoreId(st.id)}
                            className="accent-[#4A5D4E]"
                          />
                        </div>

                        <p className="text-[11px] text-[#5A5A5A] mt-1">{st.address}, {st.city}</p>
                        <p className="text-[10px] text-[#888] flex items-center gap-1 mt-1">
                          <Clock size={11} /> Hours: {st.hours}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-[#E6E1D6]/60 flex items-center justify-between text-[10px]">
                          {isEligible ? (
                            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 size={11} /> Stock Available ({availableQty} units)
                            </span>
                          ) : (
                            <span className="font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <AlertCircle size={11} /> Low Stock for {failingProduct}
                            </span>
                          )}

                          <span className="text-[#849673] font-bold">Ready in &lt; 2 hrs</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Home Delivery Address Book */}
            {fulfillmentType === 'DELIVERY' && (
              <div className="space-y-4 pt-2 text-xs">
                <div className="space-y-2">
                  <span className="font-bold text-[#4A5D4E] block uppercase tracking-wider text-[10px]">
                    Saved Shipping Addresses:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map(addr => (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddrId(addr.id);
                          setIsNewAddress(false);
                          setShippingAddress({
                            recipient: addr.recipient,
                            phone: addr.phone,
                            street: addr.street,
                            district: addr.district,
                            city: addr.city,
                            state: addr.state,
                            zipCode: addr.zipCode,
                            deliveryNote: 'Leave at front porch.'
                          });
                        }}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                          selectedAddrId === addr.id && !isNewAddress
                            ? 'bg-[#D9E3D0]/30 border-[#4A5D4E] ring-1 ring-[#4A5D4E]'
                            : 'bg-[#F9F7F2] border-[#E6E1D6]'
                        }`}
                      >
                        <p className="font-bold text-[#1A1A1A]">{addr.label}</p>
                        <p className="text-[11px] text-[#5A5A5A] mt-0.5">{addr.street}</p>
                        <p className="text-[11px] text-[#5A5A5A]">{addr.city}, {addr.state} {addr.zipCode}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-[#E6E1D6]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E]">Delivery Details</p>
                  
                  <div className="space-y-1">
                    <label className="block text-[10px] text-[#5A5A5A]">Street Address</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-[#2D2D2D]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[10px] text-[#5A5A5A]">City</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-[#2D2D2D]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] text-[#5A5A5A]">State / Province</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-[#2D2D2D]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] text-[#5A5A5A]">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                        className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-[#2D2D2D]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] text-[#5A5A5A]">Delivery Note / Instructions</label>
                    <input
                      type="text"
                      value={shippingAddress.deliveryNote}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, deliveryNote: e.target.value })}
                      placeholder="e.g. Ring doorbell, gate code #401"
                      className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-3 py-2 text-[#2D2D2D]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Payment Options & Simulation */}
          <div className="bg-white border border-[#E6E1D6] rounded-3xl p-6 space-y-5 shadow-2xs">
            <h3 className="font-serif text-base font-bold text-[#1C2E20] flex items-center gap-2 border-b border-[#E6E1D6] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#D9E3D0] text-[#4A5D4E] flex items-center justify-center text-xs font-bold">3</span>
              Payment Selection
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Option 1: Bank Transfer / QR */}
              <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'BANK_QR' ? 'bg-[#D9E3D0]/30 border-[#4A5D4E] ring-1 ring-[#4A5D4E]' : 'bg-[#F9F7F2] border-[#E6E1D6]'
              }`}>
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'BANK_QR'}
                  onChange={() => setPaymentMethod('BANK_QR')}
                  className="accent-[#4A5D4E] mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <QrCode size={18} className="text-[#4A5D4E]" /> Bank Transfer / Instant QR Payment
                    </span>
                    <span className="bg-[#4A5D4E] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full">Recommended</span>
                  </div>
                  <p className="text-[11px] text-[#5A5A5A]">Scan dynamic QR code directly from your mobile banking app</p>

                  {paymentMethod === 'BANK_QR' && (
                    <div className="mt-3 bg-white p-4 rounded-2xl border border-[#E6E1D6] flex flex-col sm:flex-row items-center gap-4">
                      <QRCodeGenerator value={`AVOLAB | Order: #${tempOrderNumber} | Amount: $${total.toFixed(2)} | Bank: Vietcombank`} size={130} showLabel={false} />
                      <div className="space-y-1 text-[11px] text-[#2D2D2D]">
                        <p className="font-bold text-[#4A5D4E]">Bank Transfer Details:</p>
                        <p>Bank: <span className="font-semibold">AVOLAB COSMETICS TREASURY</span></p>
                        <p>Account No: <span className="font-mono font-bold">9988-7766-5544</span></p>
                        <p>Amount: <span className="font-extrabold text-[#1C2E20]">${total.toFixed(2)}</span></p>
                        <p>Reference: <span className="font-mono bg-[#F9F7F2] px-1.5 py-0.5 rounded border border-[#E6E1D6]">{tempOrderNumber}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 2: Credit Card */}
              <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'CREDIT_CARD' ? 'bg-[#D9E3D0]/30 border-[#4A5D4E] ring-1 ring-[#4A5D4E]' : 'bg-[#F9F7F2] border-[#E6E1D6]'
              }`}>
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'CREDIT_CARD'}
                  onChange={() => setPaymentMethod('CREDIT_CARD')}
                  className="accent-[#4A5D4E] mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                      <CreditCard size={18} className="text-[#4A5D4E]" /> Credit / Debit Card (Simulated)
                    </span>
                  </div>

                  {paymentMethod === 'CREDIT_CARD' && (
                    <div className="mt-3 grid grid-cols-2 gap-2 bg-white p-3 rounded-2xl border border-[#E6E1D6] text-[11px]">
                      <div className="col-span-2 space-y-0.5">
                        <label className="text-[10px] text-[#888]">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardDetails.cardholder}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardholder: e.target.value })}
                          className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-2.5 py-1.5 text-[#2D2D2D]"
                        />
                      </div>
                      <div className="col-span-2 space-y-0.5">
                        <label className="text-[10px] text-[#888]">Card Number</label>
                        <input
                          type="text"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                          className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-2.5 py-1.5 font-mono text-[#2D2D2D]"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[10px] text-[#888]">Expiry Date</label>
                        <input
                          type="text"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-2.5 py-1.5 text-[#2D2D2D]"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[10px] text-[#888]">CVV Security Code</label>
                        <input
                          type="text"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          className="w-full bg-[#F9F7F2] border border-[#E6E1D6] rounded-xl px-2.5 py-1.5 text-[#2D2D2D]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 3: E-Wallet */}
              <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'E_WALLET' ? 'bg-[#D9E3D0]/30 border-[#4A5D4E] ring-1 ring-[#4A5D4E]' : 'bg-[#F9F7F2] border-[#E6E1D6]'
              }`}>
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'E_WALLET'}
                  onChange={() => setPaymentMethod('E_WALLET')}
                  className="accent-[#4A5D4E] mt-1"
                />
                <div>
                  <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <Smartphone size={18} className="text-[#4A5D4E]" /> Digital Wallet (Apple Pay / Google Pay)
                  </span>
                  <p className="text-[11px] text-[#5A5A5A]">Instant biometric touch authorization</p>
                </div>
              </label>

              {/* Option 4: COD */}
              <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                paymentMethod === 'COD' ? 'bg-[#D9E3D0]/30 border-[#4A5D4E] ring-1 ring-[#4A5D4E]' : 'bg-[#F9F7F2] border-[#E6E1D6]'
              }`}>
                <input
                  type="radio"
                  name="pm"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="accent-[#4A5D4E] mt-1"
                />
                <div>
                  <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                    <Banknote size={18} className="text-[#4A5D4E]" /> Cash on Delivery (COD)
                  </span>
                  <p className="text-[11px] text-[#5A5A5A]">Pay cash to courier upon physical arrival</p>
                </div>
              </label>
            </div>

            {/* Test Simulation Mode Controls */}
            <div className="bg-[#F0EBE1]/60 p-3.5 rounded-2xl border border-[#E6E1D6] text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4A5D4E] block">
                Academic Test Helper Mode:
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-[#2D2D2D] font-medium">
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="accent-rose-600 rounded"
                />
                <span>Simulate Payment Gateway Failure (Scenario C Test)</span>
              </label>
            </div>

            {/* Payment Error Alert */}
            {paymentError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3.5 rounded-2xl flex items-start gap-2.5">
                <AlertCircle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Payment Failure</p>
                  <p className="mt-0.5">{paymentError}</p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Sticky Desktop Order Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E6E1D6] rounded-3xl p-6 space-y-5 shadow-2xs sticky top-24">
            <h3 className="font-serif text-lg font-bold text-[#1C2E20] border-b border-[#E6E1D6] pb-3">
              Order Summary
            </h3>

            {/* Items List */}
            <div className="divide-y divide-[#E6E1D6] text-xs max-h-60 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.product.id} className="py-2.5 first:pt-0 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={getAVOLABProductImageFor(item.product)} alt={item.product.name} className="w-10 h-10 rounded-xl object-cover bg-[#F9F7F2]" />
                    <div className="min-w-0">
                      <p className="font-bold text-[#1A1A1A] truncate">{item.product.name}</p>
                      <p className="text-[10px] text-[#888]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-[#1C2E20]">
                    ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#E6E1D6] pt-3 space-y-2 text-xs text-[#5A5A5A]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#2D2D2D]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fulfillment ({fulfillmentType})</span>
                <span className="font-semibold text-[#2D2D2D]">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E6E1D6] text-base font-extrabold text-[#1C2E20]">
                <span>Total Due</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4A5D4E] text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-[#3A493D] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Lock size={16} />
              <span>{isSubmitting ? 'Processing Payment...' : `Place Order ($${total.toFixed(2)})`}</span>
            </button>

            <p className="text-[10px] text-[#888] text-center">
              🔒 Encrypted SSL Payment Transaction • Instant Confirmation
            </p>
          </div>
        </div>

      </form>
    </div>
  );
};

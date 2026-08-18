import React from 'react';
import { useApp } from '../../context/AppContext';
import { AvolabLogo } from './AvolabLogo';
import { Leaf, ShieldCheck, Instagram, Facebook, Video, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="bg-[#4A5D4E] pt-16 pb-12 text-[#F6F1E8] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#DDEAD2]/20">
          
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-4">
            <AvolabLogo variant="primary" lightMode={true} onClick={() => setActiveTab('HOME')} />
            <p className="text-xs text-[#F6F1E8]/90 leading-relaxed">
              AVOLAB COSMETICS combines cold-pressed botanical nutrients with intelligent AI skin matching for pure, gentle, vegan skincare solutions.
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="bg-[#4C5D4B] text-[#DDEAD2] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#DDEAD2]/20">
                <Leaf size={12} className="text-[#DDEAD2]" /> 100% Vegan Certified
              </span>
              <span className="bg-[#4C5D4B] text-[#DDEAD2] text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#DDEAD2]/20">
                <ShieldCheck size={12} className="text-[#DDEAD2]" /> Clean & Gentle
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.25em] text-[#FFFFFF]">Explore</h4>
            <ul className="space-y-2 text-xs text-[#DDEAD2]">
              <li><button onClick={() => setActiveTab('SHOP')} className="hover:text-[#FFFFFF] transition-colors font-medium text-left">Shop All Products</button></li>
              <li><button onClick={() => setActiveTab('STORE_LOCATOR')} className="hover:text-[#FFFFFF] transition-colors font-medium text-left">Flagship Stores</button></li>
              <li><button onClick={() => setActiveTab('LOYALTY')} className="hover:text-[#FFFFFF] transition-colors font-medium text-left">Loyalty Rewards Program</button></li>
              <li><button onClick={() => setActiveTab('SUBSCRIPTIONS')} className="hover:text-[#FFFFFF] transition-colors font-medium text-left">Auto-Refill Subscriptions</button></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.25em] text-[#FFFFFF]">Customer Care</h4>
            <ul className="space-y-2 text-xs text-[#DDEAD2]">
              <li><button onClick={() => setActiveTab('ORDERS')} className="hover:text-[#FFFFFF] transition-colors font-medium text-left">Track Order & QR Code</button></li>
              <li><button onClick={() => setActiveTab('SUPPORT')} className="hover:text-[#FFFFFF] transition-colors font-medium text-left">Help Center & FAQ</button></li>
              <li><button onClick={() => setActiveTab('WISHLIST_COMPARE')} className="hover:text-[#FFFFFF] transition-colors font-medium text-left">Compare Formulations</button></li>
              <li><button onClick={() => setActiveTab('ACCOUNT')} className="hover:text-[#FFFFFF] transition-colors font-medium text-left">My Skin Profile</button></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.25em] text-[#FFFFFF]">Botanical Insider</h4>
            <p className="text-xs text-[#DDEAD2]">Subscribe for early access to releases & 15% off your first order.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed to AVOLAB Botanical Insider!"); }} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-[#4C5D4B] border border-[#DDEAD2]/30 rounded-xl px-3 py-2 text-xs text-[#FFFFFF] focus:outline-none focus:border-[#DDEAD2] placeholder-[#DDEAD2]/60"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#DDEAD2] text-[#4A5D4E] py-2 text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-[#FFFFFF] transition-colors"
              >
                Join Insider Club
              </button>
            </form>
          </div>

          {/* Follow Us */}
          <div className="space-y-3">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.25em] text-[#FFFFFF]">Follow Us</h4>
            <div className="flex items-center gap-3 text-[#DDEAD2]">
              <a href="#instagram" className="p-2 bg-[#4C5D4B] rounded-full hover:text-[#FFFFFF] hover:bg-[#DDEAD2]/20 transition-colors" title="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#facebook" className="p-2 bg-[#4C5D4B] rounded-full hover:text-[#FFFFFF] hover:bg-[#DDEAD2]/20 transition-colors" title="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#tiktok" className="p-2 bg-[#4C5D4B] rounded-full hover:text-[#FFFFFF] hover:bg-[#DDEAD2]/20 transition-colors" title="TikTok">
                <Video size={18} />
              </a>
              <a href="#youtube" className="p-2 bg-[#4C5D4B] rounded-full hover:text-[#FFFFFF] hover:bg-[#DDEAD2]/20 transition-colors" title="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-[#DDEAD2] font-medium gap-4">
          <p>© 2026 AVOLAB COSMETICS. Digital Transformation Academic Project.</p>
          <div className="flex space-x-6 sm:space-x-8">
            <span>Centralized OMS</span>
            <span>Global CRM 360</span>
            <span>BOPIS Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { NAV_ITEMS, BRAND_NAME, WHATSAPP_LINK, PHONE_NUMBER, CONTACT_EMAIL } from '../constants';
import { NavItem } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activePath, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative">
      {/* 1. Promotional Banner */}
      {showBanner && (
        <div className="bg-accent text-primary px-4 py-2 text-sm font-medium text-center relative z-50">
          <p className="flex items-center justify-center gap-2">
            <span>🎉 Limited Offer: Flat 50% OFF for the first 20 Customers!</span>
            <button 
              onClick={() => onNavigate('/contact')}
              className="underline hover:text-white transition-colors"
            >
              Claim Your Spot
            </button>
          </p>
          <button 
            onClick={() => setShowBanner(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* 2. Sticky Navbar */}
      <nav className="sticky top-0 z-40 bg-primary/95 backdrop-blur-md text-white border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex-shrink-0 cursor-pointer flex items-center gap-2"
              onClick={() => onNavigate('/')}
            >
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-primary font-bold font-serif text-xl">
                K
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight">
                {BRAND_NAME}<span className="text-accent">.</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {NAV_ITEMS.map((item: NavItem) => (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`text-sm font-medium transition-colors hover:text-accent ${
                    activePath === item.path ? 'text-accent' : 'text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button 
                onClick={() => onNavigate('/contact')}
                className="bg-accent text-primary px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-amber-400 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-300 hover:text-white p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {NAV_ITEMS.map((item: NavItem) => (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-4 rounded-md text-base font-medium ${
                    activePath === item.path ? 'bg-slate-800 text-accent' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="px-3 py-4">
                 <button 
                  onClick={() => {
                    onNavigate('/contact');
                    setIsMenuOpen(false);
                  }}
                  className="w-full bg-accent text-primary px-5 py-3 rounded-lg font-bold"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* 4. Footer */}
      <footer className="bg-primary text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <span className="font-serif text-2xl font-bold text-white tracking-tight">
              {BRAND_NAME}<span className="text-accent">.</span>
            </span>
            <p className="mt-4 max-w-sm leading-relaxed">
              Transforming local businesses into digital brands. We build high-performance websites that look great and sell even better.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map(item => (
                <li key={item.path}>
                   <button onClick={() => onNavigate(item.path)} className="hover:text-accent transition-colors">
                     {item.label}
                   </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-accent" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">{CONTACT_EMAIL}</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-accent" />
                <a href={`tel:${PHONE_NUMBER}`} className="hover:text-white">{PHONE_NUMBER}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          © {new Date().getFullYear()} {BRAND_NAME} Web Studio. All rights reserved.
        </div>
      </footer>

      {/* 4. WhatsApp Floating Action Button */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
        <div className="relative bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:bg-[#20b858] transition-colors flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="32" 
              height="32" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className="w-8 h-8"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.355-5.033c0-5.42 4.409-9.85 9.85-9.85 2.63 0 5.108 1.025 6.967 2.885a9.832 9.832 0 012.884 6.963c0 5.424-4.406 9.854-9.845 9.854M20.52 3.449C18.24 1.169 15.207-.085 12.046-.085 5.405-.085 0 5.319 0 11.96c0 2.122.553 4.108 1.597 5.842L0 24l6.335-1.661a11.936 11.936 0 005.711 1.446h.005c6.64 0 12.045-5.404 12.045-12.043 0-3.218-1.254-6.248-3.535-8.528z" />
            </svg>
        </div>
      </a>
    </div>
  );
};

export default Layout;

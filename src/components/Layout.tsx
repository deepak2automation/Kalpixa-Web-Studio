import React, { useEffect, useState } from "react";
import { Menu, X, Phone, Mail, ArrowRight, Sparkles } from "lucide-react";
import {
  NAV_ITEMS,
  BRAND_NAME,
  WHATSAPP_LINK,
  PHONE_NUMBER,
  CONTACT_EMAIL,
} from "../constants";
import { NavItem } from "../types";

interface LayoutProps {
  children: React.ReactNode;
  activePath: string;
  onNavigate: (path: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activePath,
  onNavigate,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [activePath]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white relative overflow-x-hidden selection:bg-accent selection:text-primary">
      <style>{`
        @keyframes bannerShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes bannerShine {
          0% { transform: translateX(-140%); }
          100% { transform: translateX(220%); }
        }
      `}</style>

      {/* Global background atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.10),_transparent_32%),radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.12),_transparent_28%),radial-gradient(circle_at_50%_100%,_rgba(168,85,247,0.10),_transparent_26%)]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/30 to-slate-950" />
      </div>

      {/* Promo banner */}
      {showBanner && (
        <div className="relative z-50 overflow-hidden border-b border-amber-300/20 bg-[linear-gradient(90deg,#f59e0b_0%,#fbbf24_18%,#fde68a_32%,#f59e0b_48%,#fbbf24_64%,#fde68a_82%,#f59e0b_100%)] bg-[length:200%_100%] animate-[bannerShift_8s_linear_infinite] text-primary shadow-[0_10px_30px_rgba(245,158,11,0.25)]">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.75)_18%,transparent_36%)] animate-[bannerShine_3.2s_linear_infinite]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="min-h-[54px] py-2 flex items-center justify-center pr-10 relative">
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
                <span className="inline-flex items-center gap-2 text-sm sm:text-[15px] font-extrabold tracking-tight">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/10 ring-1 ring-black/10">
                    ✦
                  </span>
                  Premium website upgrade slots open this month
                </span>

                <span className="hidden sm:inline text-primary/50 text-sm">
                  •
                </span>

                <button
                  onClick={() => onNavigate("/contact")}
                  className="group inline-flex items-center gap-2 text-sm sm:text-[15px] font-extrabold underline underline-offset-4 decoration-2 hover:text-white transition-colors"
                >
                  Claim Your Free Strategy Call
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>

              <button
                onClick={() => setShowBanner(false)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/10 transition-colors"
                aria-label="Close banner"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "border-b border-white/10 bg-slate-950/78 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between gap-6">
            {/* Brand */}
            <button
              onClick={() => onNavigate("/")}
              className="flex items-center gap-3 group text-left"
              aria-label={`${BRAND_NAME} home`}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-accent/30 blur-xl opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-11 h-11 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                  <span className="font-serif text-xl font-bold text-accent">
                    K
                  </span>
                </div>
              </div>

              <div className="flex flex-col leading-none">
                <span className="font-serif text-2xl sm:text-[30px] font-bold tracking-tight text-white">
                  {BRAND_NAME}
                  <span className="text-accent">.</span>
                </span>
                <span className="text-[11px] uppercase tracking-[0.28em] text-slate-400 mt-1">
                  Web Studio
                </span>
              </div>
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-3 py-2 shadow-[0_12px_32px_rgba(0,0,0,0.22)]">
              {NAV_ITEMS.map((item: NavItem) => {
                const isActive = activePath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => onNavigate(item.path)}
                    className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-white text-slate-950 shadow-[0_8px_24px_rgba(255,255,255,0.15)]"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white transition-all"
              >
                <Phone size={16} />
                <span className="text-sm font-medium">Call Now</span>
              </a>

              <button
                onClick={() => onNavigate("/contact")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-primary font-bold text-sm shadow-[0_12px_30px_rgba(245,158,11,0.28)] hover:bg-amber-400 hover:shadow-[0_16px_36px_rgba(245,158,11,0.36)] transition-all active:scale-[0.98]"
              >
                Get Started
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-2xl border border-white/10 bg-white/5 text-slate-200 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
                <div className="space-y-2">
                  {NAV_ITEMS.map((item: NavItem) => {
                    const isActive = activePath === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => onNavigate(item.path)}
                        className={`w-full flex items-center justify-between rounded-2xl px-4 py-3.5 text-left text-base font-semibold transition-all ${
                          isActive
                            ? "bg-accent text-primary"
                            : "text-slate-200 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ArrowRight size={18} />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3">
                  <button
                    onClick={() => onNavigate("/contact")}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-slate-950 font-bold shadow-[0_10px_24px_rgba(255,255,255,0.12)]"
                  >
                    Get Started
                    <ArrowRight size={18} />
                  </button>

                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-white/10 bg-white/5 text-white font-semibold"
                  >
                    <Phone size={18} />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-grow">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 mt-8 border-t border-white/10 bg-black/30 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid lg:grid-cols-[1.3fr_0.7fr_0.9fr] gap-10">
            <div>
              <div className="inline-flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                  <span className="font-serif text-xl font-bold text-accent">
                    K
                  </span>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold tracking-tight text-white">
                    {BRAND_NAME}
                    <span className="text-accent">.</span>
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.26em] text-slate-500">
                    Web Studio
                  </div>
                </div>
              </div>

              <p className="max-w-xl text-slate-400 leading-7">
                We design premium, conversion-focused websites for ambitious
                local businesses. Fast, elegant, mobile-first, and built to turn
                attention into enquiries.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate("/contact")}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-primary font-bold hover:bg-amber-400 transition-all"
                >
                  Start Your Project
                  <ArrowRight size={16} />
                </button>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all"
                >
                  <Mail size={16} />
                  Email Us
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-300 mb-5">
                Navigation
              </h3>
              <ul className="space-y-3">
                {NAV_ITEMS.map((item: NavItem) => (
                  <li key={item.path}>
                    <button
                      onClick={() => onNavigate(item.path)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.22em] text-slate-300 mb-5">
                Contact
              </h3>

              <div className="space-y-4">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all"
                >
                  <Mail size={18} className="text-accent mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-500">Email</div>
                    <div className="text-slate-200 break-all">
                      {CONTACT_EMAIL}
                    </div>
                  </div>
                </a>

                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-all"
                >
                  <Phone size={18} className="text-accent mt-0.5" />
                  <div>
                    <div className="text-sm text-slate-500">Phone</div>
                    <div className="text-slate-200">{PHONE_NUMBER}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
            <p>
              © {new Date().getFullYear()} {BRAND_NAME} Web Studio. All rights
              reserved.
            </p>
            <p>Premium websites for serious business growth.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp CTA */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 group"
      >
        <span className="absolute inset-0 rounded-full bg-green-500/50 blur-md group-hover:bg-green-500/70 transition-all" />
        <span className="absolute inset-0 rounded-full animate-ping bg-green-500/30" />
        <div className="relative w-16 h-16 rounded-full bg-[#25D366] text-white shadow-[0_20px_45px_rgba(37,211,102,0.35)] flex items-center justify-center group-hover:-translate-y-1 transition-transform duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
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

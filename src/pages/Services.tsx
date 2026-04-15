import React from "react";
import SeoHead from "../components/SeoHead";
import { SERVICES } from "../constants";

// Safe Price Interceptor Logic - Applies your exact custom pricing rules
const getUpdatedPrice = (title: string, oldPrice: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("web design")) return "From ₹5,000";
  if (lowerTitle.includes("seo")) return "From ₹10,000/mo";
  if (lowerTitle.includes("hosting")) return "₹5,000/yr";
  if (lowerTitle.includes("e-commerce")) return "From ₹25,000";
  return oldPrice; // Fallback for Cyber Security and App Dev
};

const ServicesPage: React.FC = () => (
  <div className="relative overflow-hidden py-14 sm:py-16 lg:py-20">
    <SeoHead
      title="Web Design & SEO Services"
      description="From custom web design to advanced SEO and mobile apps. See our affordable pricing packages for local business growth."
      path="/services"
    />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-14 lg:mb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300 backdrop-blur-xl">
          What We Offer
        </div>

        <h1 className="mt-5 font-serif text-[2.35rem] sm:text-[3.1rem] lg:text-[4rem] font-bold tracking-tight text-white leading-[0.96]">
          Our{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-400">
            Services
          </span>
        </h1>

        <p className="mt-5 text-slate-400 max-w-2xl mx-auto text-[1.02rem] sm:text-[1.08rem] leading-7 sm:leading-8">
          High-performance solutions designed to strengthen your digital
          presence, improve user experience, and help your business scale with
          confidence.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {SERVICES.map((service) => (
          <div
            key={service.id}
            className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-7 sm:p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.07] hover:border-accent/35 hover:shadow-[0_18px_50px_rgba(0,0,0,0.34)]"
          >
            {/* Soft accent glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.10),transparent_34%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-accent transition-all duration-300 group-hover:scale-105 group-hover:bg-accent group-hover:text-primary group-hover:shadow-[0_0_18px_rgba(251,191,36,0.22)]">
                  <service.icon size={28} />
                </div>

                <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Service
                </div>
              </div>

              <h3 className="mt-7 text-[1.55rem] sm:text-[1.7rem] font-bold tracking-tight text-white">
                {service.title}
              </h3>

              <p className="mt-4 text-slate-400 leading-7 min-h-[84px]">
                {service.description}
              </p>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-end justify-between gap-4">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                    Starting at
                  </div>
                  <div className="mt-2 text-[1.35rem] sm:text-[1.5rem] font-bold text-accent drop-shadow-[0_0_8px_rgba(251,191,36,0.22)]">
                    {getUpdatedPrice(service.title, service.price)}
                  </div>
                </div>

                <div className="text-sm font-semibold text-slate-400 transition-colors duration-300 group-hover:text-white">
                  Learn More
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ServicesPage;

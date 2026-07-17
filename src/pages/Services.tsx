import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import SeoHead from "../components/SeoHead";
import { SERVICES } from "../constants";
import { PageProps } from "../types";

const FEATURES: Record<string, string[]> = {
  "Custom Web Design": [
    "Bespoke UI/UX design",
    "Responsive on all devices",
    "Brand-aligned visuals",
    "Conversion-optimized layout",
  ],
  "SEO & Visibility": [
    "Technical SEO audit",
    "On-page optimization",
    "Local search dominance",
    "Monthly performance reports",
  ],
  "High-Speed Hosting": [
    "Sub-second load times",
    "Free SSL certificate",
    "Daily backups",
    "99.9% uptime guarantee",
  ],
  "Mobile App Development": [
    "Native iOS & Android",
    "Backend API integration",
    "App store deployment",
    "Ongoing maintenance",
  ],
  "Cyber Security": [
    "Enterprise-grade firewall",
    "Regular security audits",
    "DDoS protection",
    "Data encryption",
  ],
  "E-Commerce Solutions": [
    "Payment gateway integration",
    "Inventory management",
    "Automated logistics",
    "Secure checkout flow",
  ],
};

const ServicesPage: React.FC<PageProps> = ({ navigate }) => (
  <div className="relative overflow-hidden py-14 sm:py-16 lg:py-20">
    <SeoHead
      title="Web Design & SEO Services"
      description="From custom web design to advanced SEO and mobile apps. See our affordable pricing packages for local business growth."
      path="/services"
    />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
        {SERVICES.map((service) => {
          const features = FEATURES[service.title] || [];
          return (
            <div
              key={service.id}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-7 sm:p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1.5 hover:bg-white/[0.07] hover:border-accent/35 hover:shadow-[0_18px_50px_rgba(0,0,0,0.34)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.10),transparent_34%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-accent transition-all duration-300 group-hover:scale-105 group-hover:bg-accent group-hover:text-primary group-hover:shadow-[0_0_18px_rgba(251,191,36,0.22)]">
                    <service.icon size={28} />
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Service</div>
                </div>

                <h3 className="mt-7 text-[1.55rem] sm:text-[1.7rem] font-bold tracking-tight text-white">
                  {service.title}
                </h3>

                <p className="mt-4 text-slate-400 leading-7 min-h-[84px]">
                  {service.description}
                </p>

                {features.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle2 size={15} className="text-accent shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-8 pt-6 border-t border-white/10 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
                      Starting at
                    </div>
                    <div className="mt-2 text-[1.35rem] sm:text-[1.5rem] font-bold text-accent drop-shadow-[0_0_8px_rgba(251,191,36,0.22)]">
                      {service.price}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/contact")}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition-colors duration-300 group-hover:text-white"
                  >
                    Get Quote
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-14 rounded-[30px] border border-accent/20 bg-gradient-to-br from-accent/10 via-white/[0.04] to-transparent px-6 py-10 sm:px-10 sm:py-14 text-center backdrop-blur-xl">
        <h2 className="font-serif text-[2rem] sm:text-[2.6rem] font-bold tracking-tight text-white leading-tight">
          Not sure which service you need?
        </h2>
        <p className="mt-4 text-slate-300 max-w-xl mx-auto leading-7">
          Tell us about your business and we&apos;ll recommend the right
          combination of services to hit your goals.
        </p>
        <button
          onClick={() => navigate("/contact")}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-bold text-primary shadow-[0_18px_44px_rgba(245,158,11,0.26)] hover:bg-amber-400 hover:-translate-y-0.5 transition-all duration-300"
        >
          Get a Free Quote
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  </div>
);

export default ServicesPage;

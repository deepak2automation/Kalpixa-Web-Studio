import React from "react";
import SeoHead from "../components/SeoHead";
import { SERVICES } from "../constants";
import { PageProps } from "../types";
import { ArrowRight, CheckCircle2, Star, TrendingUp, Gauge, ShieldCheck } from "lucide-react";

const STATS = [
  { icon: Gauge, value: "1.4s", label: "Avg. load time" },
  { icon: TrendingUp, value: "3.2x", label: "More enquiries" },
  { icon: Star, value: "99.9%", label: "Uptime" },
  { icon: ShieldCheck, value: "A+", label: "Security grade" },
];

const PROCESS = [
  { step: "01", title: "Discovery", desc: "We learn your business, audience, and goals to define the right digital strategy." },
  { step: "02", title: "Design", desc: "Premium, conversion-focused mockups tailored to your brand identity." },
  { step: "03", title: "Build", desc: "Fast, responsive, SEO-optimized development with modern tooling." },
  { step: "04", title: "Launch", desc: "We deploy, monitor, and optimize for performance and growth." },
];

const Home: React.FC<PageProps> = ({ navigate }) => (
  <>
    <SeoHead
      title="Digital Transformation Agency"
      description="Kalpixa Web Studio builds high-performance websites, SEO strategies, and mobile apps for local businesses. Get a free quote today."
      path="/"
    />

    <div className="relative overflow-hidden bg-[#07111f]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.10),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(59,130,246,0.06),transparent_22%),radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.05),transparent_18%)]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:60px_60px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-14">
          <div className="grid lg:grid-cols-[0.94fr_1.06fr] gap-10 lg:gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent backdrop-blur-xl">
                Premium Web Studio
              </div>

              <h1 className="mt-4 sm:mt-5 font-serif text-[2.55rem] sm:text-[3.5rem] lg:text-[4.4rem] xl:text-[5rem] font-bold tracking-tight text-white leading-[0.95]">
                Transforming Local
                <span className="block">Business</span>
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-accent via-amber-200 to-white">
                  Into Digital Brands
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-[1.02rem] sm:text-[1.08rem] text-slate-300 leading-7 sm:leading-8">
                We build stunning, high-performance websites that don&apos;t
                just look good—they bring you customers. Web Design, SEO, and
                Hosting, all in one place.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/seo-tools")}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-[0.98rem] font-bold text-primary shadow-[0_18px_44px_rgba(245,158,11,0.26)] hover:bg-amber-400 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Free SEO Audit
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigate("/services")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-7 py-3.5 text-[0.98rem] font-semibold text-white backdrop-blur-xl hover:bg-white/[0.09] hover:border-white/20 transition-all duration-300"
                >
                  View Services
                </button>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-accent" />
                  Premium design
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-accent" />
                  Better conversions
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-accent" />
                  Mobile-first experience
                </span>
              </div>
            </div>

            {/* Right showcase */}
            <div className="relative lg:pl-4">
              <div className="absolute inset-0 bg-accent/10 blur-[100px] opacity-60 pointer-events-none" />

              <div className="relative rounded-[30px] border border-white/10 bg-white/[0.05] p-3 sm:p-4 backdrop-blur-2xl shadow-[0_30px_90px_rgba(0,0,0,0.38)]">
                <div className="overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/80">
                  <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                    </div>
                    <div className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-slate-500">
                      Kalpixa Showcase
                    </div>
                  </div>

                  <img
                    src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Kalpixa featured website showcase"
                    loading="eager"
                    className="w-full h-[250px] sm:h-[360px] lg:h-[500px] object-cover"
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Design</div>
                    <div className="mt-1 text-white font-semibold text-[0.98rem]">Premium visual identity</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Performance</div>
                    <div className="mt-1 text-white font-semibold text-[0.98rem]">Fast, modern user experience</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Outcome</div>
                    <div className="mt-1 text-white font-semibold text-[0.98rem]">More trust and enquiries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-10 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-5 backdrop-blur-xl">
                <stat.icon size={22} className="text-accent" />
                <div className="mt-3 text-[1.5rem] font-bold text-white">{stat.value}</div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand statement */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.04] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 backdrop-blur-xl">
            <div className="grid lg:grid-cols-[0.88fr_1.12fr] gap-8 lg:gap-12 items-start">
              <div>
                <div className="text-[11px] uppercase tracking-[0.26em] text-slate-500">Why Kalpixa</div>
                <h2 className="mt-4 font-serif text-[2.1rem] sm:text-[2.7rem] lg:text-[3.4rem] font-bold tracking-tight text-white leading-[0.98]">
                  A website should not
                  <span className="block">just exist online.</span>
                  <span className="block mt-2">It should elevate the business behind it.</span>
                </h2>
              </div>

              <div className="space-y-5 text-slate-300 text-[1.02rem] sm:text-[1.08rem] leading-7 sm:leading-8 pt-1">
                <p>
                  We help local businesses look more established, feel more
                  premium, and convert more visitors through stronger design,
                  better structure, and modern digital execution.
                </p>
                <p>
                  The goal is not more noise. The goal is a cleaner, sharper,
                  more credible online presence that makes customers trust you
                  faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-18 lg:pb-20">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.035] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 backdrop-blur-xl">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 sm:mb-12">
              <div className="max-w-3xl">
                <div className="text-[11px] uppercase tracking-[0.26em] text-slate-500">What We Offer</div>
                <h2 className="mt-4 font-serif text-[2.1rem] sm:text-[2.7rem] lg:text-[3.15rem] font-bold tracking-tight text-white leading-tight">
                  Everything You Need To Grow
                </h2>
                <p className="mt-4 text-[1.02rem] sm:text-[1.08rem] text-slate-300 leading-7 sm:leading-8">
                  Strategic digital services designed to make your business look
                  stronger, perform better, and convert more visitors into
                  customers.
                </p>
              </div>

              <button
                onClick={() => navigate("/services")}
                className="inline-flex items-center gap-2 self-start rounded-full border border-white/12 bg-white/[0.06] px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/[0.09] hover:border-white/20 transition-colors"
              >
                View All Solutions
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
              {SERVICES.slice(0, 3).map((service) => (
                <div
                  key={service.id}
                  onClick={() => navigate("/services")}
                  className="group cursor-pointer rounded-[26px] border border-white/10 bg-white/[0.05] p-8 hover:-translate-y-1 hover:bg-white/[0.07] hover:shadow-[0_24px_60px_rgba(0,0,0,0.18)] transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-300">
                      <service.icon size={28} />
                    </div>
                    <div className="text-sm font-bold text-accent">{service.price}</div>
                  </div>

                  <h3 className="mt-8 text-[1.55rem] font-bold text-white">{service.title}</h3>
                  <p className="mt-4 text-slate-300 leading-7">{service.description}</p>

                  <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 group-hover:text-white transition-colors">
                    Learn More
                    <ArrowRight size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-18 lg:pb-20">
          <div className="text-center mb-10 sm:mb-12">
            <div className="text-[11px] uppercase tracking-[0.26em] text-slate-500">How We Work</div>
            <h2 className="mt-4 font-serif text-[2.1rem] sm:text-[2.7rem] lg:text-[3.15rem] font-bold tracking-tight text-white">
              A Clear Path to Launch
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((p) => (
              <div key={p.step} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-xl">
                <div className="font-serif text-[2.5rem] font-bold text-accent/30">{p.step}</div>
                <h3 className="mt-2 text-xl font-bold text-white">{p.title}</h3>
                <p className="mt-3 text-slate-400 leading-7 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
          <div className="rounded-[30px] border border-accent/20 bg-gradient-to-br from-accent/10 via-white/[0.04] to-transparent px-6 py-10 sm:px-10 sm:py-14 text-center backdrop-blur-xl">
            <h2 className="font-serif text-[2rem] sm:text-[2.6rem] lg:text-[3rem] font-bold tracking-tight text-white leading-tight">
              Ready to elevate your business?
            </h2>
            <p className="mt-4 text-slate-300 max-w-xl mx-auto leading-7">
              Get a free strategy call and a custom quote. No pressure, no spam.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-bold text-primary shadow-[0_18px_44px_rgba(245,158,11,0.26)] hover:bg-amber-400 hover:-translate-y-0.5 transition-all duration-300"
            >
              Start Your Project
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default Home;

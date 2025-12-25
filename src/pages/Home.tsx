import React from 'react';
import { ArrowRight, CheckCircle, Code, Star } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import { SERVICES } from '../constants';
import { PageProps } from '../types';

const Home: React.FC<PageProps> = ({ navigate }) => (
  <>
    <SeoHead
      title="Digital Transformation Agency"
      description="Kalpixa Web Studio builds high-performance websites, SEO strategies, and mobile apps for local businesses. Get a free quote today."
      path="/"
    />
    {/* Hero Section */}
    <section className="relative bg-primary overflow-hidden">
      {/* Abstract Background Mesh */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-6">
          Transforming Local Business <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-200">
            Into Digital Brands
          </span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
          We build stunning, high-performance websites that don't just look good—they bring you customers. Web Design, SEO, and Hosting, all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/seo-tools')}
            className="bg-accent text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            Free SEO Audit <ArrowRight size={20} />
          </button>
          <button
            onClick={() => navigate('/services')}
            className="px-8 py-4 rounded-lg font-bold text-lg text-white border border-slate-600 hover:bg-white/5 transition-all"
          >
            View Services
          </button>
        </div>
      </div>
    </section>

    {/* Trust Badges */}
    <div className="bg-slate-900 border-b border-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all">
        <span className="text-white font-bold text-xl flex items-center gap-2"><Code /> Next.js Expert</span>
        <span className="text-white font-bold text-xl flex items-center gap-2"><Star /> Google Partner</span>
        <span className="text-white font-bold text-xl flex items-center gap-2"><CheckCircle /> 99.9% Uptime</span>
      </div>
    </div>

    {/* Services Preview */}
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary font-serif text-3xl md:text-4xl font-bold mb-4">Everything You Need To Grow</h2>
          <div className="h-1 w-20 bg-accent mx-auto rounded"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.slice(0, 3).map((service) => (
            <div
              key={service.id}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-primary transition-colors text-accent">
                <service.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">{service.description}</p>
              <div className="text-sm font-semibold text-accent">{service.price}</div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/services')}
            className="text-primary font-bold border-b-2 border-accent pb-1 hover:text-accent transition-colors"
          >
            View All Solutions
          </button>
        </div>
      </div>
    </section>
  </>
);

export default Home;

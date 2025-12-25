import React from 'react';
import SeoHead from '../components/SeoHead';
import { SERVICES } from '../constants';

const ServicesPage: React.FC = () => (
  <div className="py-20 bg-slate-50">
    <SeoHead
      title="Web Design & SEO Services"
      description="From custom web design to advanced SEO and mobile apps. See our affordable pricing packages for local business growth."
      path="/services"
    />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-serif font-bold text-primary mb-12 text-center">Our Services</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((service) => (
          <div
            key={service.id}
            className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-6 text-primary">
              <service.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">{service.title}</h3>
            <p className="text-slate-600 mb-6">{service.description}</p>
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-400">Starting at</span>
              <span className="font-bold text-accent">{service.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ServicesPage;

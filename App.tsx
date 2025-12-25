import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import SeoAnalyzer from './components/SeoAnalyzer';
import SeoHead from './components/SeoHead';
import { SERVICES, CONTACT_EMAIL, PHONE_NUMBER } from './constants';
import { ArrowRight, CheckCircle, Code, Star, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // SEO Upgrade: Use History API (clean URLs) instead of Hash
  const [currentPath, setCurrentPath] = useState(window.location.pathname === '/index.html' || window.location.pathname === '' ? '/' : window.location.pathname);

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // --- Page Components ---

  const Home = () => (
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
           {/* Mock Logos for "Trust" */}
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
              <div key={service.id} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group hover:-translate-y-1 cursor-pointer">
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

  const ServicesPage = () => (
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
              <div key={service.id} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all">
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

  const ContactPage = () => {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    // Netlify Form Submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus('submitting');
      
      const form = e.currentTarget;
      const formData = new FormData(form);

      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData as any).toString(),
        });
        setStatus('success');
        navigate('/thank-you');
      } catch (error) {
        console.error("Form submission error:", error);
        setStatus('error');
      }
    };

    return (
      <div className="py-20 bg-white">
        <SeoHead 
          title="Contact Us" 
          description="Ready to start your project? Contact Kalpixa Web Studio for a free consultation and quote."
          path="/contact"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">Start Your Project</h1>
            <p className="text-lg text-slate-600">Fill out the form below or reach us directly.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Info */}
            <div className="bg-slate-50 p-8 rounded-2xl">
              <h3 className="font-bold text-xl mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Phone</label>
                  <p className="text-lg font-medium">{PHONE_NUMBER}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Email</label>
                  <p className="text-lg font-medium">{CONTACT_EMAIL}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Office Hours</label>
                  <p className="text-lg font-medium">Mon - Sat: 10:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>

            {/* Netlify Form */}
            <form 
              className="space-y-4" 
              name="contact" 
              method="post" 
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
            >
              {/* Mandatory Hidden Inputs for Netlify */}
              <input type="hidden" name="form-name" value="contact" />
              <div hidden>
                <label>
                  Don’t fill this out if you’re human: <input name="bot-field" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Name" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-accent outline-none" required />
                <input type="tel" name="phone" placeholder="Phone" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-accent outline-none" />
              </div>
              <input type="email" name="email" placeholder="Email Address" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-accent outline-none" required />
              <select name="service" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-accent outline-none">
                <option value="Website">I need a Website</option>
                <option value="SEO">I need SEO</option>
                <option value="Ecommerce">I need E-Commerce</option>
                <option value="Other">Other</option>
              </select>
              <textarea name="message" placeholder="Tell us about your project..." rows={4} className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-accent outline-none" required></textarea>
              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="animate-spin" /> Sending...
                  </>
                ) : (
                  'Send Request'
                )}
              </button>
              {status === 'error' && (
                <p className="text-red-500 text-center text-sm">Something went wrong. Please try again or call us directly.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }

  const ThankYouPage = () => (
    <div className="py-24 bg-white text-center">
       <SeoHead 
          title="Thank You" 
          description="Thank you for contacting Kalpixa Web Studio."
          path="/thank-you"
        />
       <div className="max-w-2xl mx-auto px-4">
         <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
         </div>
         <h1 className="text-4xl font-serif font-bold text-primary mb-4">Message Received!</h1>
         <p className="text-lg text-slate-600 mb-8">
           Thank you for reaching out. We will review your requirements and get back to you within 24 hours.
         </p>
         <button 
            onClick={() => navigate('/')}
            className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-colors"
          >
            Back to Home
          </button>
       </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPath) {
      case '/': return <Home />;
      case '/services': return <ServicesPage />;
      case '/seo-tools': 
        return (
          <>
            <SeoHead 
              title="Free SEO Analyzer Tool" 
              description="Analyze your website SEO score instantly. Identify technical issues, speed problems, and meta tag errors."
              path="/seo-tools"
            />
            <SeoAnalyzer />
          </>
        );
      case '/contact': return <ContactPage />;
      case '/thank-you': return <ThankYouPage />;
      default: return <Home />;
    }
  };

  return (
    <HelmetProvider>
      <Layout activePath={currentPath} onNavigate={navigate}>
        {renderContent()}
      </Layout>
    </HelmetProvider>
  );
};

export default App;
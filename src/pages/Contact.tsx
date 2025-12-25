import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import { CONTACT_EMAIL, PHONE_NUMBER } from '../constants';
import { PageProps } from '../types';
import { encode } from '../utils/form';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const ContactPage: React.FC<PageProps> = ({ navigate }) => {
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload: Record<string, string> = {};
    formData.forEach((value, key) => {
      payload[key] = String(value);
    });

    payload['form-name'] = 'contact';

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode(payload),
      });

      if (!res.ok) throw new Error(`Form POST failed: ${res.status}`);

      setStatus('success');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (typeof w.gtag === 'function') {
        w.gtag('event', 'generate_lead', { method: 'Netlify Form' });
      }

      form.reset();
      navigate('/thank-you');
    } catch (error) {
      console.error('Form submission error:', error);
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
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="form-name" value="contact" />
            <p className="hidden">
              <label>
                Don’t fill this out if you’re human: <input name="bot-field" />
              </label>
            </p>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-accent outline-none"
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-accent outline-none"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-accent outline-none"
              required
            />

            <select
              name="service"
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-accent outline-none"
              defaultValue="Website"
            >
              <option value="Website">I need a Website</option>
              <option value="SEO">I need SEO</option>
              <option value="Ecommerce">I need E-Commerce</option>
              <option value="Other">Other</option>
            </select>

            <textarea
              name="message"
              placeholder="Tell us about your project..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-accent outline-none"
              required
            />

            <div data-netlify-recaptcha="true"></div>

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
              <p className="text-red-500 text-center text-sm">
                Something went wrong. Please try again or call us directly.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

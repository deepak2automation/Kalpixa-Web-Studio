import React from 'react';
import { CheckCircle } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import { PageProps } from '../types';

const ThankYouPage: React.FC<PageProps> = ({ navigate }) => (
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

export default ThankYouPage;

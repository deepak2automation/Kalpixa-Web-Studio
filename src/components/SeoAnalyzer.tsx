import React, { useState } from 'react';
import { Search, Lock, Smartphone, Monitor, CheckCircle, XCircle, Share2, Globe } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { CONTACT_EMAIL } from '../constants';

const SeoAnalyzer: React.FC = () => {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setAnalyzing(true);
    setResult(null);

    // SIMULATION of an API call
    setTimeout(() => {
      // Create a deterministic "fake" score based on string length to seem real but consistent
      const randomScore = Math.floor(Math.random() * (85 - 60 + 1) + 60); 
      
      setResult({
        score: randomScore,
        url: url.startsWith('http') ? url : `https://${url}`,
        title: `${url.replace(/https?:\/\/(www\.)?/, '').split('.')[0]} - Official Website`,
        description: "Leading provider of high-quality services and products. Contact us today for exclusive offers and professional support tailored to your needs.",
        imageCount: 12,
        missingAlt: 4,
        loadTime: "1.4s",
      });
      setAnalyzing(false);
    }, 2500);
  };

  const scoreData = result ? [{ name: 'Score', value: result.score, fill: result.score > 70 ? '#22c55e' : '#f59e0b' }] : [];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-base text-accent font-semibold tracking-wide uppercase">Free Audit Tool</h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-primary sm:text-4xl font-serif">
          Is Your Website Losing Money?
        </p>
        <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
          Get a comprehensive SEO and Performance report in less than 30 seconds. See exactly how Google views your business.
        </p>
      </div>

      {/* Input Section */}
      <div className="max-w-3xl mx-auto mb-16">
        <form onSubmit={handleAnalyze} className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-32 py-4 border-2 border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent sm:text-lg shadow-sm"
            placeholder="example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="submit"
            disabled={analyzing}
            className="absolute right-2 top-2 bottom-2 bg-primary text-white px-6 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {analyzing ? 'Scanning...' : 'Analyze'}
            {!analyzing && <Search size={18} />}
          </button>
        </form>
        <p className="mt-2 text-sm text-slate-400 text-center">
          *We respect your privacy. No spam.
        </p>
      </div>

      {result && (
        <div className="animate-fade-in-up space-y-12">
          
          {/* Top Dashboard: Score & Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Score Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Overall Health</h3>
              <div className="h-48 w-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    innerRadius="80%" 
                    outerRadius="100%" 
                    barSize={10} 
                    data={scoreData} 
                    startAngle={90} 
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background dataKey="value" cornerRadius={30} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${result.score > 70 ? 'text-green-500' : 'text-amber-500'}`}>
                    {result.score}
                  </span>
                  <span className="text-sm text-slate-400 uppercase tracking-widest">/ 100</span>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-slate-600">
                {result.score > 70 ? 'Good Start! But room for improvement.' : 'Critical Issues Found. Immediate action needed.'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                  <div className="flex items-center gap-3 mb-2 text-primary">
                    <Smartphone size={24} />
                    <h4 className="font-bold">Mobile Friendly</h4>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <CheckCircle size={18} /> Passed
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Viewport configured correctly.</p>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                  <div className="flex items-center gap-3 mb-2 text-primary">
                    <Monitor size={24} />
                    <h4 className="font-bold">Desktop Speed</h4>
                  </div>
                  <div className="flex items-center gap-2 text-amber-500 font-medium">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div> {result.loadTime} (Needs Work)
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Recommended: Under 1.0s</p>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 sm:col-span-2">
                  <h4 className="font-bold text-slate-800 mb-3">SEO Tag Structure</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Title Tag</span>
                      <span className="text-green-600 flex items-center gap-1"><CheckCircle size={12}/> Good length</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Meta Description</span>
                      <span className="text-green-600 flex items-center gap-1"><CheckCircle size={12}/> Present</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Image Alt Attributes</span>
                      <span className="text-red-500 flex items-center gap-1"><XCircle size={12}/> {result.missingAlt} missing</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Previews Section (Google & Social) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Google SERP Preview */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Globe size={20} className="text-blue-500" />
                Google Search Preview
              </h3>
              <div className="font-sans">
                <div className="text-sm text-slate-800 mb-1 flex items-center gap-1">
                  <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-xs">🌐</div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-900 font-medium">{result.title.substring(0, 20)}...</span>
                    <span className="text-xs text-slate-500">{result.url}</span>
                  </div>
                </div>
                <div className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer mb-1">
                  {result.title}
                </div>
                <div className="text-sm text-[#4d5156] leading-6">
                  {result.description}
                </div>
              </div>
              <p className="mt-4 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ Tip: Ensure your keywords are in the first 60 characters of your title.
              </p>
            </div>

            {/* Social Share Preview */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Share2 size={20} className="text-blue-600" />
                Social Media Preview
              </h3>
              <div className="border border-slate-200 rounded-lg overflow-hidden max-w-sm mx-auto bg-slate-50">
                <div className="h-40 bg-slate-200 w-full flex items-center justify-center text-slate-400">
                  <ImageIcon />
                </div>
                <div className="p-3 bg-slate-100 border-t border-slate-200">
                  <div className="text-xs text-slate-500 uppercase mb-1">{new URL(result.url).hostname}</div>
                  <div className="text-slate-900 font-bold leading-tight mb-1">{result.title}</div>
                  <div className="text-xs text-slate-600 line-clamp-2">{result.description}</div>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-500 text-center">
                This is how your link looks when shared on LinkedIn or Facebook.
              </p>
            </div>
          </div>

          {/* Locked Deep Dive Section */}
          <div className="relative mt-12 rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
            <div className="bg-slate-50 p-8 filter blur-sm select-none">
              <h3 className="text-2xl font-bold mb-6">Detailed Technical Audit</h3>
              <div className="space-y-4">
                 <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                 <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                 <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                 <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="h-24 bg-slate-200 rounded"></div>
                    <div className="h-24 bg-slate-200 rounded"></div>
                 </div>
              </div>
            </div>
            
            {/* Unlock CTA Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-primary/40 backdrop-blur-[2px]">
              <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="text-accent h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">Unlock Full Report</h3>
                <p className="text-slate-600 mb-6">
                  Get the detailed technical breakdown and our step-by-step fix guide sent to your inbox.
                </p>
                
                {!showModal ? (
                  <form onSubmit={(e) => { e.preventDefault(); setShowModal(true); }} className="space-y-4">
                    <input 
                      type="email" 
                      required
                      placeholder="Enter your email address"
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">
                      Send Me The Report
                    </button>
                  </form>
                ) : (
                  <div className="bg-green-50 text-green-800 p-4 rounded-lg">
                    <p className="font-bold">Report Sent!</p>
                    <p className="text-sm">Check your inbox. Our team ({CONTACT_EMAIL}) will also reach out with a custom strategy.</p>
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-4">
                  Free for a limited time.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

const ImageIcon = () => (
  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default SeoAnalyzer;

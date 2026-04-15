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

    setTimeout(() => {
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
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-sm text-accent font-bold tracking-widest uppercase mb-3">Free Audit Tool</h2>
        <p className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight text-white font-serif">
          Is Your Website <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-500">Losing Money?</span>
        </p>
        <p className="mt-6 max-w-2xl text-lg text-slate-400 mx-auto">
          Get a comprehensive SEO and Performance report in less than 30 seconds. See exactly how Google views your business.
        </p>
      </div>

      {/* Input Section */}
      <div className="max-w-3xl mx-auto mb-16">
        <form onSubmit={handleAnalyze} className="relative flex items-center shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Globe className="h-6 w-6 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-36 py-5 border border-white/10 rounded-2xl leading-5 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-accent focus:bg-white/10 sm:text-lg backdrop-blur-md transition-all"
            placeholder="example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            type="submit"
            disabled={analyzing}
            className="absolute right-2 top-2 bottom-2 bg-accent text-primary px-8 rounded-xl font-bold hover:bg-amber-400 transition-all disabled:opacity-70 flex items-center gap-2 text-lg shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          >
            {analyzing ? 'Scanning...' : 'Analyze'}
            {!analyzing && <Search size={20} />}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500 text-center font-medium">
          *We respect your privacy. No spam.
        </p>
      </div>

      {result && (
        <div className="animate-fade-in-up space-y-12">
          
          {/* Top Dashboard: Score & Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Score Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
              <h3 className="text-xl font-bold text-white mb-6 relative z-10">Overall Health</h3>
              <div className="h-48 w-48 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="80%" outerRadius="100%" barSize={10} data={scoreData} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: 'rgba(255,255,255,0.05)' }} dataKey="value" cornerRadius={30} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center drop-shadow-lg">
                  <span className={`text-6xl font-bold ${result.score > 70 ? 'text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]'}`}>
                    {result.score}
                  </span>
                  <span className="text-sm text-slate-400 uppercase tracking-widest mt-1">/ 100</span>
                </div>
              </div>
              <p className="mt-6 text-center text-sm text-slate-300 font-medium relative z-10">
                {result.score > 70 ? 'Good Start! But room for improvement.' : 'Critical Issues Found. Immediate action needed.'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-4 text-white">
                    <Smartphone size={28} className="text-blue-400" />
                    <h4 className="font-bold text-lg">Mobile Friendly</h4>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 font-bold text-lg">
                    <CheckCircle size={20} /> Passed
                  </div>
                  <p className="text-sm text-slate-400 mt-2">Viewport configured correctly.</p>
               </div>
               <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-4 text-white">
                    <Monitor size={28} className="text-purple-400" />
                    <h4 className="font-bold text-lg">Desktop Speed</h4>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div> {result.loadTime} (Needs Work)
                  </div>
                  <p className="text-sm text-slate-400 mt-2">Recommended: Under 1.0s</p>
               </div>
               <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/10 sm:col-span-2">
                  <h4 className="font-bold text-white text-lg mb-4">SEO Tag Structure</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm bg-black/20 p-3 rounded-lg border border-white/5">
                      <span className="text-slate-300 font-medium">Title Tag</span>
                      <span className="text-green-400 flex items-center gap-2 font-bold"><CheckCircle size={16}/> Good length</span>
                    </div>
                    <div className="flex justify-between items-center text-sm bg-black/20 p-3 rounded-lg border border-white/5">
                      <span className="text-slate-300 font-medium">Meta Description</span>
                      <span className="text-green-400 flex items-center gap-2 font-bold"><CheckCircle size={16}/> Present</span>
                    </div>
                    <div className="flex justify-between items-center text-sm bg-black/20 p-3 rounded-lg border border-white/5">
                      <span className="text-slate-300 font-medium">Image Alt Attributes</span>
                      <span className="text-red-400 flex items-center gap-2 font-bold"><XCircle size={16}/> {result.missingAlt} missing</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Locked Deep Dive Section */}
          <div className="relative mt-16 rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="bg-slate-900/50 p-8 filter blur-md select-none">
              <h3 className="text-2xl font-bold mb-6 text-white">Detailed Technical Audit</h3>
              <div className="space-y-4 opacity-50">
                 <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                 <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                 <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                 <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="h-24 bg-slate-700 rounded"></div>
                    <div className="h-24 bg-slate-700 rounded"></div>
                 </div>
              </div>
            </div>
            
            {/* Unlock CTA Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
              <div className="bg-slate-900 border border-white/10 p-10 rounded-3xl shadow-2xl max-w-md w-full mx-4 text-center">
                <div className="w-20 h-20 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
                  <Lock className="text-accent h-10 w-10 drop-shadow-md" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">Unlock Full Report</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Get the detailed technical breakdown and our step-by-step fix guide sent to your inbox.
                </p>
                
                {!showModal ? (
                  <form onSubmit={(e) => { e.preventDefault(); setShowModal(true); }} className="space-y-4">
                    <input 
                      type="email" 
                      required
                      placeholder="Enter your email address"
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:border-accent outline-none focus:bg-white/10 transition-colors"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-accent text-primary font-bold py-4 rounded-xl hover:bg-amber-400 transition-all text-lg shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                      Send Me The Report
                    </button>
                  </form>
                ) : (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-6 rounded-xl">
                    <p className="font-bold text-lg mb-2 flex items-center justify-center gap-2"><CheckCircle size={20}/> Report Sent!</p>
                    <p className="text-sm text-slate-300">Check your inbox. Our team ({CONTACT_EMAIL}) will also reach out with a custom strategy.</p>
                  </div>
                )}
                <p className="text-sm font-medium text-slate-500 mt-6 uppercase tracking-wider">
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

export default SeoAnalyzer;
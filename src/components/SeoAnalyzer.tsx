import React, { useState } from "react";
import {
  Search,
  Lock,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  FileText,
  Code2,
  Share2,
  Zap,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import SeoHead from "./SeoHead";
import { runSeoAudit } from "../lib/seoApi";
import { SeoAuditResponse, SeoCheck } from "../types";
import { supabase } from "../lib/supabaseClient";
import { validateEmail, validateUrl } from "../utils/validation";

const CATEGORY_META = {
  content: { label: "Content", icon: FileText, color: "text-blue-400" },
  technical: { label: "Technical", icon: Code2, color: "text-emerald-400" },
  social: { label: "Social", icon: Share2, color: "text-pink-400" },
  performance: { label: "Performance", icon: Zap, color: "text-amber-400" },
} as const;

const STATUS_META = {
  pass: { icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30" },
  warn: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  fail: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
} as const;

const SeoAnalyzer: React.FC = () => {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<SeoAuditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [submittingEmail, setSubmittingEmail] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();

    const urlErr = validateUrl(url);
    if (urlErr) {
      setUrlError(urlErr);
      return;
    }
    setUrlError(null);

    setAnalyzing(true);
    setError(null);
    setResult(null);
    setUnlocked(false);
    setEmail("");
    setEmailError(null);

    try {
      const data = await runSeoAudit(url);
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze the URL.";
      setError(message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !result) return;

    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }

    setSubmittingEmail(true);
    setEmailError(null);

    try {
      const { error: dbError } = await supabase.from("seo_audits").insert({
        url: result.url,
        email: email.trim(),
        score: result.score,
        report: { checks: result.checks, summary: result.summary } as unknown as Record<string, unknown>,
      });

      if (dbError) throw new Error(dbError.message);

      setUnlocked(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save your email.";
      setEmailError(message);
    } finally {
      setSubmittingEmail(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setUrl("");
    setUrlError(null);
    setUnlocked(false);
    setEmail("");
    setEmailError(null);
  };

  const scoreData = result
    ? [{ name: "Score", value: result.score, fill: result.score >= 80 ? "#22c55e" : result.score >= 50 ? "#f59e0b" : "#ef4444" }]
    : [];

  const passed = result?.checks.filter((c) => c.status === "pass").length ?? 0;
  const warnings = result?.checks.filter((c) => c.status === "warn").length ?? 0;
  const failed = result?.checks.filter((c) => c.status === "fail").length ?? 0;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
      <SeoHead
        title="Free SEO Analyzer Tool"
        description="Run a real-time SEO audit on any website. Checks title tags, meta descriptions, headings, image alt text, SSL, mobile viewport, Open Graph, structured data, load time, and more."
        path="/seo-tools"
      />

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent backdrop-blur-xl mb-5">
          Live Audit Tool
        </div>
        <h2 className="font-serif text-[2.35rem] sm:text-[3.1rem] lg:text-[4rem] font-bold tracking-tight text-white leading-[0.96]">
          Is Your Website{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-500">
            Losing Money?
          </span>
        </h2>
        <p className="mt-5 max-w-2xl mx-auto text-slate-400 text-[1.02rem] sm:text-[1.08rem] leading-7 sm:leading-8">
          Get a real, comprehensive SEO and performance report in under 30
          seconds. We fetch your page and analyze the actual HTML — no fake
          scores.
        </p>
      </div>

      {/* Input */}
      <div className="max-w-2xl mx-auto mb-10">
        <form onSubmit={handleAnalyze} className="relative flex items-center shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Globe className="h-6 w-6 text-slate-400" />
          </div>
          <input
            type="text"
            className={`block w-full pl-12 pr-36 py-5 border rounded-2xl leading-5 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:bg-white/10 sm:text-lg backdrop-blur-md transition-all ${
              urlError
                ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                : "border-white/10 focus:border-accent focus:ring-1 focus:ring-accent"
            }`}
            placeholder="example.com"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (urlError) setUrlError(null);
            }}
            disabled={analyzing}
          />
          <button
            type="submit"
            disabled={analyzing || !url.trim()}
            className="absolute right-2 top-2 bottom-2 bg-accent text-primary px-6 sm:px-8 rounded-xl font-bold hover:bg-amber-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 text-base sm:text-lg shadow-[0_0_15px_rgba(251,191,36,0.3)]"
          >
            {analyzing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span className="hidden sm:inline">Scanning...</span>
              </>
            ) : (
              <>
                Analyze
                <Search size={20} />
              </>
            )}
          </button>
        </form>
        {urlError && (
          <p className="mt-3 text-sm text-red-400 text-center font-medium">
            {urlError}
          </p>
        )}
        <p className="mt-4 text-sm text-slate-500 text-center font-medium">
          Real-time HTML analysis. No sign-up required to view your score.
        </p>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300">
              <AlertTriangle size={20} className="mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold mb-1">Couldn&apos;t complete the audit</div>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading skeleton */}
      {analyzing && !result && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
            <div className="md:col-span-2 space-y-4">
              <div className="h-28 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
              <div className="h-28 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
            </div>
          </div>
          <div className="text-center text-slate-400 text-sm">
            Fetching <span className="text-accent font-semibold">{url}</span> and analyzing HTML...
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 flex flex-col items-center justify-center border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              <h3 className="text-xl font-bold text-white mb-6 relative z-10">Overall Health</h3>
              <div className="h-44 w-44 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="78%" outerRadius="100%" barSize={11} data={scoreData} startAngle={90} endAngle={-270}>
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar background={{ fill: "rgba(255,255,255,0.05)" }} dataKey="value" cornerRadius={30} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold ${
                    result.score >= 80 ? "text-green-400" : result.score >= 50 ? "text-amber-400" : "text-red-400"
                  }`}>
                    {result.score}
                  </span>
                  <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">/ 100</span>
                </div>
              </div>
              <p className="mt-5 text-center text-sm text-slate-300 font-medium relative z-10">
                {result.score >= 80
                  ? "Strong foundation. Minor tweaks can push you higher."
                  : result.score >= 50
                  ? "Decent start, but several issues need attention."
                  : "Critical issues found. Immediate action needed."}
              </p>
            </div>

            {/* Stats */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-green-500/20 flex flex-col items-center justify-center">
                <CheckCircle size={28} className="text-green-400 mb-2" />
                <span className="text-3xl font-bold text-white">{passed}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Passed</span>
              </div>
              <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-amber-500/20 flex flex-col items-center justify-center">
                <AlertTriangle size={28} className="text-amber-400 mb-2" />
                <span className="text-3xl font-bold text-white">{warnings}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Warnings</span>
              </div>
              <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-red-500/20 flex flex-col items-center justify-center">
                <XCircle size={28} className="text-red-400 mb-2" />
                <span className="text-3xl font-bold text-white">{failed}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Failed</span>
              </div>
              <div className="sm:col-span-3 bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <Globe size={18} className="text-accent" />
                  <span className="text-sm text-slate-400 uppercase tracking-wider">Audited URL</span>
                </div>
                <div className="text-white text-sm font-mono break-all">{result.summary.finalUrl}</div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Load time</span>
                    <div className="text-white font-semibold">{result.summary.loadTime}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">HTML size</span>
                    <div className="text-white font-semibold">{result.summary.htmlSizeKb} KB</div>
                  </div>
                  <div>
                    <span className="text-slate-500">HTTPS</span>
                    <div className={result.summary.https ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
                      {result.summary.https ? "Yes" : "No"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Word count</span>
                    <div className="text-white font-semibold">{result.summary.wordCount}</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-xs pt-3 border-t border-white/10">
                  <div>
                    <span className="text-slate-500">Favicon</span>
                    <div className={result.summary.favicon ? "text-green-400 font-semibold" : "text-amber-400 font-semibold"}>
                      {result.summary.favicon ? "Found" : "Missing"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Structured data</span>
                    <div className={result.summary.structuredData ? "text-green-400 font-semibold" : "text-amber-400 font-semibold"}>
                      {result.summary.structuredData ? "Found" : "None"}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">URL depth</span>
                    <div className="text-white font-semibold">
                      {result.summary.urlDepth} {result.summary.urlDepth === 1 ? "level" : "levels"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checks by category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(Object.keys(CATEGORY_META) as Array<keyof typeof CATEGORY_META>).map((cat) => {
              const meta = CATEGORY_META[cat];
              const catChecks = result.checks.filter((c) => c.category === cat);
              if (catChecks.length === 0) return null;
              const Icon = meta.icon;
              return (
                <div key={cat} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                      <Icon size={20} className={meta.color} />
                    </div>
                    <h4 className="font-bold text-white text-lg">{meta.label}</h4>
                  </div>
                  <div className="space-y-3">
                    {catChecks.map((check) => (
                      <CheckRow key={check.label} check={check} dimmed={!unlocked && check.status !== "fail"} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Locked deep-dive / email unlock */}
          {!unlocked ? (
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="bg-slate-900/50 p-8 filter blur-md select-none pointer-events-none">
                <h3 className="text-2xl font-bold mb-6 text-white">Step-by-Step Fix Guide</h3>
                <div className="space-y-4 opacity-50">
                  <div className="h-4 bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-700 rounded w-1/2" />
                  <div className="h-4 bg-slate-700 rounded w-5/6" />
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="h-24 bg-slate-700 rounded" />
                    <div className="h-24 bg-slate-700 rounded" />
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm p-4">
                <div className="bg-slate-900 border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl max-w-md w-full text-center">
                  <div className="w-20 h-20 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(251,191,36,0.15)]">
                    <Lock className="text-accent h-9 w-9" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Unlock the Full Report</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed text-sm sm:text-base">
                    Get the detailed breakdown with a step-by-step fix guide sent to your inbox.
                  </p>
                  <form onSubmit={handleEmailSubmit} className="space-y-3">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      className={`w-full px-5 py-4 rounded-xl bg-white/5 border text-white placeholder-slate-500 focus:outline-none transition-colors ${
                        emailError
                          ? "border-red-500 focus:ring-1 focus:ring-red-500"
                          : "border-white/10 focus:border-accent focus:ring-1 focus:ring-accent focus:bg-white/10"
                      }`}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      disabled={submittingEmail}
                    />
                    {emailError && (
                      <p className="text-red-400 text-sm text-left -mt-1">{emailError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={submittingEmail}
                      className="w-full bg-accent text-primary font-bold py-4 rounded-xl hover:bg-amber-400 transition-all text-lg shadow-[0_0_15px_rgba(251,191,36,0.3)] disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {submittingEmail ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Me The Report
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                  <p className="text-xs font-medium text-slate-500 mt-5 uppercase tracking-wider">
                    Free. No spam.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center"
            >
              <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Full Report Unlocked</h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                All check details are now visible above. Your personalized fix
                guide and strategy are on the way to your inbox.
              </p>
            </motion.div>
          )}

          {/* Reset */}
          <div className="text-center">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white transition-all"
            >
              <RefreshCw size={16} />
              Analyze another site
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const CheckRow: React.FC<{ check: SeoCheck; dimmed: boolean }> = ({ check, dimmed }) => {
  const meta = STATUS_META[check.status];
  const Icon = meta.icon;
  return (
    <div className={`flex items-start gap-3 rounded-xl border ${meta.border} ${meta.bg} px-4 py-3 ${dimmed ? "opacity-60" : ""}`}>
      <Icon size={18} className={`mt-0.5 shrink-0 ${meta.color}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-white">{check.label}</span>
          <span className="text-xs text-slate-500 shrink-0">{check.earned}/{check.points} pts</span>
        </div>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{check.detail}</p>
      </div>
    </div>
  );
};

export default SeoAnalyzer;

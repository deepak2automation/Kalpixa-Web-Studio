'use client';

import { FormEvent, useState } from 'react';

type Check = { label: string; category: string; points: number; earned: number; status: 'pass' | 'warn' | 'fail'; detail: string };
type Report = { score: number; checks: Check[]; summary: { finalUrl: string; title: string | null; responseTimeMs: number; htmlSizeBytes: number; wordCount: number; images: number; imagesMissingAlt: number; https: boolean; structuredData: boolean }; auditedAt: string };

const categories = ['Content', 'Technical', 'Social', 'Performance'];

export function SeoAnalyzer() {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    setReport(null);
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await fetch('/.netlify/functions/seo-audit', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ url: url.trim() }), signal: controller.signal });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(typeof payload.error === 'string' ? payload.error : 'The audit could not be completed.');
      setReport(payload as Report);
    } catch (reason) {
      setError(controller.signal.aborted ? 'The audit request timed out. Please try again.' : reason instanceof Error ? reason.message : 'The audit could not be completed.');
    } finally { window.clearTimeout(timer); setLoading(false); }
  }

  return <section className="seo-analyzer shell" aria-label="Real-time SEO analyzer">
    <form className="seo-search" onSubmit={analyze}><label htmlFor="audit-url">Website URL</label><div><span aria-hidden="true">◎</span><input id="audit-url" name="url" type="text" inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="example.com" value={url} onChange={(event) => setUrl(event.target.value)} disabled={loading} required/><button className="button" type="submit" disabled={loading || !url.trim()}>{loading ? 'Scanning live page…' : 'Analyze'} <span aria-hidden="true">→</span></button></div><p>Real-time HTML analysis. No sign-up required. Public HTTP and HTTPS pages only.</p></form>
    <div className="audit-live" aria-live="polite">{loading && <div className="audit-loading" role="status"><span aria-hidden="true"/><strong>Fetching the live page and checking its SEO foundations…</strong><p>This normally completes in a few seconds.</p></div>}{error && <div className="audit-error" role="alert"><strong>Couldn&apos;t complete the audit</strong><p>{error}</p></div>}</div>
    {report && <div className="audit-report">
      <header className="audit-overview"><div className="score-ring" style={{ background: `conic-gradient(#d6a84d ${report.score * 3.6}deg, rgba(255,255,255,.1) 0deg)` }}><span><strong>{report.score}</strong><small>/ 100</small></span></div><div><p className="eyebrow">Live result</p><h2>{report.score >= 80 ? 'Strong foundation' : report.score >= 50 ? 'Important opportunities found' : 'Critical foundations need attention'}</h2><a href={report.summary.finalUrl} target="_blank" rel="noreferrer">{report.summary.finalUrl}</a><p>Audited {new Date(report.auditedAt).toLocaleString()}</p></div></header>
      <dl className="audit-stats"><div><dt>Response</dt><dd>{(report.summary.responseTimeMs / 1000).toFixed(2)}s</dd></div><div><dt>HTML size</dt><dd>{(report.summary.htmlSizeBytes / 1024).toFixed(1)} KB</dd></div><div><dt>Words</dt><dd>{report.summary.wordCount}</dd></div><div><dt>Images</dt><dd>{report.summary.images}</dd></div><div><dt>HTTPS</dt><dd>{report.summary.https ? 'Yes' : 'No'}</dd></div><div><dt>Schema</dt><dd>{report.summary.structuredData ? 'Found' : 'Not found'}</dd></div></dl>
      <div className="audit-categories">{categories.map((category) => { const checks = report.checks.filter((check) => check.category === category); return checks.length ? <section key={category}><h3>{category}</h3><div>{checks.map((check) => <article className={`audit-check ${check.status}`} key={check.label}><span aria-label={check.status}>{check.status === 'pass' ? '✓' : check.status === 'warn' ? '!' : '×'}</span><div><h4>{check.label}<small>{check.earned}/{check.points} pts</small></h4><p>{check.detail}</p></div></article>)}</div></section> : null; })}</div>
      <aside className="audit-disclaimer"><strong>What this report means</strong><p>This is a point-in-time analysis of the fetched HTML and server response. It does not claim to measure Google rankings, field Core Web Vitals, backlinks, JavaScript-rendered content or business results. Use it as a prioritized technical starting point.</p><a className="button" href="/contact/">Get help with the findings →</a></aside>
      <button className="text-link audit-reset" type="button" onClick={() => { setReport(null); setUrl(''); document.getElementById('audit-url')?.focus(); }}>Analyze another site</button>
    </div>}
  </section>;
}

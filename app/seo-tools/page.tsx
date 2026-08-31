import type { Metadata } from 'next';
import { SeoAnalyzer } from './SeoAnalyzer';

export const metadata: Metadata = {
  title: 'Free SEO Analyzer Tool',
  description: 'Run a real-time SEO audit on any public website. Check title tags, descriptions, headings, image alt text, HTTPS, mobile viewport, structured data, response time and more.',
  alternates: { canonical: '/seo-tools' },
};

export default function SeoToolsPage() {
  return <main id="main-content" className="seo-page"><section className="seo-intro shell"><p className="eyebrow">Live Audit Tool</p><h1>Is Your Website <em>Losing Money?</em></h1><p className="page-lead">Get a real, comprehensive SEO and performance report in under 30 seconds. We fetch your page and analyze the actual HTML—no fake scores.</p></section><SeoAnalyzer/></main>;
}

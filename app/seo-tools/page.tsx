import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { SeoAnalyzer } from './SeoAnalyzer';

export const metadata: Metadata = {
  title: 'Free SEO Analyzer Tool',
  description: 'Run a real-time SEO audit on any public website. Check title tags, descriptions, headings, image alt text, HTTPS, mobile viewport, structured data, response time and more.',
  alternates: { canonical: '/seo-tools' },
};

export default function SeoToolsPage() {
  return <main id="main-content" className="seo-page"><PageHero eyebrow="Live SEO analyzer · 21 checks" title="See what a public page actually exposes." lead="Enter a public HTTP or HTTPS URL. The analyzer fetches the live response and evaluates the returned HTML, metadata, headings, links, images, structured data, security signals and response characteristics." image="analytics"/><SeoAnalyzer/></main>;
}

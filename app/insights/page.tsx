import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = { title: 'Insights', description: 'Practical thinking on website strategy, content, accessibility, SEO and digital operations.', alternates: { canonical: '/insights' } };

export default function InsightsPage() {
  return <main id="main-content"><PageHero eyebrow="Kalpixa intelligence" title="Useful thinking for consequential digital decisions." lead="Practical guidance for leaders responsible for websites, demand, customer experience and digital operations." image="insights"/><section className="insight-grid insight-grid-single shell"><article className="featured-insight"><p className="eyebrow">Planning · 8 min read</p><h2>How to write a website brief that prevents expensive ambiguity</h2><p>A practical structure for aligning business goals, audience needs, content, technical constraints and acceptance criteria before design begins.</p><a className="text-link" href="/insights/website-brief/">Read the guide →</a></article></section></main>;
}

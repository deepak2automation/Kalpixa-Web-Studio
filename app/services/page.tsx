import type { Metadata } from 'next';
import Link from 'next/link';
import { CtaBand } from '@/components/CtaBand';
import { PageHero } from '@/components/PageHero';
import { services } from '@/lib/site';

export const metadata: Metadata = { title: 'Digital Strategy, Web Design, SEO & Care', description: 'Explore Kalpixa services: conversion websites, durable search foundations and continuous website care.', alternates: { canonical: '/services' } };
export default function ServicesPage() { return <main id="main-content"><PageHero eyebrow="Capabilities" title="Connected expertise for your most important digital touchpoint." lead="Choose a focused engagement or combine strategy, content, design, engineering and optimization into one accountable program."/><section className="cards-section shell">{services.map((service) => <article className="service-card" key={service.slug}><span>{service.number}</span><h2>{service.title}</h2><p>{service.short}</p><strong>{service.outcome}</strong><Link className="text-link" href={`/services/${service.slug}`}>Explore the service →</Link></article>)}</section><section className="principles-band shell"><div><span>01</span><h3>Useful before impressive</h3><p>Every decision must help a real person understand, trust or act.</p></div><div><span>02</span><h3>Measurable before launch</h3><p>Success criteria and instrumentation belong in the brief, not the retrospective.</p></div><div><span>03</span><h3>Maintainable by design</h3><p>Clear ownership, accessible systems and documentation prevent launch-day decay.</p></div></section><CtaBand/></main>; }

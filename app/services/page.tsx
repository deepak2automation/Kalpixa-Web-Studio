import type { Metadata } from 'next';
import Script from 'next/script';
import { PageHero } from '@/components/PageHero';
import { services, site } from '@/lib/site';

export const metadata: Metadata = { title: 'Web Design & SEO Services', description: 'From custom web design to advanced SEO and mobile apps. See our affordable pricing packages for local business growth.', alternates: { canonical: '/services' } };

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: services.map((service, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'Service', name: service.title, description: service.short, provider: { '@type': 'Organization', name: site.name, url: site.url } } })),
};

export default function ServicesPage() {
  return <main id="main-content" className="original-services-page">
    <PageHero eyebrow="What We Offer" title="Our Services" lead="High-performance solutions designed to strengthen your digital presence, improve user experience, and help your business scale with confidence."/>
    <section className="service-catalog shell" aria-label="Kalpixa services">{services.map((service) => <article className="catalog-card" id={service.slug} key={service.slug}><div className="catalog-card-top"><span>{service.number}</span><strong>{service.price}</strong></div><h2>{service.title}</h2><p>{service.short}</p><ul>{service.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><a className="text-link" href="/contact/">Get Started →</a></article>)}</section>
    <section className="service-assurance shell"><div><p className="eyebrow">Built around your business</p><h2>Not sure which service you need?</h2></div><div><p>Tell us where you are now and what outcome matters. We will help you choose the right starting point without pressure or unnecessary scope.</p><a className="button" href="/contact/">Start Your Project →</a></div></section>
    <Script id="services-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}/>
  </main>;
}

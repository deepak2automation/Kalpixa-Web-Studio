/* eslint-disable @next/next/no-img-element -- Self-hosted, pre-sized WebP editorial asset avoids a runtime image service. */
import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';
import { services, site } from '@/lib/site';
import { capabilityCount, capabilityGroups } from '@/lib/capabilities';

export const metadata: Metadata = { title: 'Digital Growth & Commerce Services', description: 'Explore Kalpixa Web Studio capabilities across websites, SEO, content, digital marketing, analytics, e-commerce, marketplaces and security.', alternates: { canonical: '/services' } };

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  numberOfItems: capabilityCount,
  itemListElement: capabilityGroups.flatMap((group) => group.capabilities).map((capability, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'Service', name: capability.name, description: capability.description, provider: { '@type': 'Organization', name: site.name, url: site.url } } })),
};
const serviceJsonLdText = JSON.stringify(serviceJsonLd).replace(/</g, '\\u003c');

export default function ServicesPage() {
  return <main id="main-content" className="original-services-page">
    <PageHero eyebrow="Capabilities · 29 specialties" title="Services built as connected growth systems." lead="Choose a focused engagement or combine the capabilities needed to plan, build, launch, measure and improve your digital presence." image="analytics"/>
    <nav className="services-navigator shell" aria-label="Service capability groups"><p>Explore capabilities</p><div>{capabilityGroups.map((group) => <a href={`#${group.slug}`} key={group.slug}><span>{group.number}</span>{group.title}</a>)}</div></nav>
    <section className="service-catalog shell" aria-labelledby="delivery-services-heading">
      <div className="catalog-intro"><p className="eyebrow">Core delivery services</p><h2 id="delivery-services-heading">Practical starting points.</h2><p>Starting prices are directional, not fixed offers. Final scope, dependencies, delivery plan and commercial terms are confirmed in writing before work begins.</p></div>
      {services.map((service) => <article className="catalog-card" id={service.slug} key={service.slug}><div className="catalog-card-top"><span>{service.number}</span><strong>{service.price}</strong></div><h3>{service.title}</h3><p>{service.short}</p><ul>{service.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><a className="text-link" href="/contact/">Discuss this service →</a></article>)}
    </section>
    <section className="capability-program" aria-labelledby="specialties-heading">
      <div className="capability-program-intro shell"><p className="eyebrow">Specialty directory</p><h2 id="specialties-heading">Every requested capability, organized around the work it enables.</h2><p>Industry names have been updated where platforms have changed. The original term remains visible as an alias so the page is both current and easy to find.</p></div>
      {capabilityGroups.map((group, groupIndex) => <section className="capability-group shell" id={group.slug} key={group.slug} aria-labelledby={`${group.slug}-heading`}><header><span>{group.number}</span><div><h2 id={`${group.slug}-heading`}>{group.title}</h2><p>{group.summary}</p></div></header><div className="capability-list">{group.capabilities.map((capability, index) => <article key={capability.name}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{capability.name}</h3>{capability.alias && <small>Also searched as: {capability.alias}</small>}<p>{capability.description}</p></div></article>)}</div>{groupIndex === 4 && <figure className="capability-editorial"><img src="/studio/commerce.webp" alt="Two small-business operators packing customer orders" loading="lazy"/><figcaption>Commerce operations · editorial image by Pavel Danilyuk / Pexels. <a href="/image-credits/">Image credits</a></figcaption></figure>}<footer><strong>Intended outcome</strong><p>{group.outcome}</p></footer></section>)}
    </section>
    <aside className="platform-reality shell"><p className="eyebrow">No false guarantees</p><h2>We can improve readiness and execution. Platforms make their own decisions.</h2><p>Search ranking, advertising results, marketplace or payment approval, AdSense acceptance, Instagram commerce eligibility and revenue are never guaranteed. They depend on the client’s accounts, content, product data, policies, market, budget, infrastructure and ongoing operations.</p></aside>
    <section className="service-assurance shell"><div><p className="eyebrow">Built around your business</p><h2>Not sure which service you need?</h2></div><div><p>Tell us where you are now and what outcome matters. We will help you choose the right starting point without pressure or unnecessary scope.</p><a className="button" href="/contact/">Start Your Project →</a></div></section>
    <script id="services-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: serviceJsonLdText }}/>
  </main>;
}

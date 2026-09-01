import type { Metadata } from 'next';
import { CtaBand } from '@/components/CtaBand';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = { title: 'About the Studio', description: 'Kalpixa is an independent web strategy, design and engineering studio working with service businesses worldwide.', alternates: { canonical: '/about' } };

export default function AboutPage() {
  return <main id="main-content">
    <PageHero eyebrow="About Kalpixa" title="Small enough to care deeply. Serious enough to engineer the details." lead="Kalpixa is an independent web studio led from India and built to collaborate across borders. We help expert-led and service businesses make their digital presence match the quality of their work." image="about"/>
    <section className="content-grid shell"><div><p className="eyebrow">Our point of view</p><h2>Clarity is a growth advantage.</h2></div><div className="long-copy"><p>Most website problems are not purely visual or technical. They begin when positioning is vague, content is unprioritized, journeys ignore real questions or responsibility is divided across too many handoffs.</p><p>We connect those decisions. That means challenging assumptions early, writing for understanding, designing for access, building for maintainability and measuring what actually matters.</p><p>The result should feel distinctive because it is specific—not because it is louder.</p></div></section>
    <section className="soft-section"><div className="shell"><div className="section-intro section-intro-wide"><p className="eyebrow">How we show up</p><h2>Four promises we can be held to.</h2></div><div className="value-grid"><article><span>01</span><h3>Truthful communication</h3><p>Capabilities, evidence, constraints and progress are represented honestly.</p></article><article><span>02</span><h3>Direct collaboration</h3><p>The people shaping decisions stay close to the work and the stakeholders.</p></article><article><span>03</span><h3>Inclusive quality</h3><p>Accessibility, privacy, performance and resilience are product requirements.</p></article><article><span>04</span><h3>Durable value</h3><p>We prefer maintainable systems and useful learning over fragile spectacle.</p></article></div></div></section>
    <CtaBand/>
  </main>;
}

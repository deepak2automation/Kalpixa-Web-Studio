import { HeroMotion } from '@/components/HeroMotion';
import { process, services } from '@/lib/site';

const standards = [
  ['1.4s', 'Avg. load time'],
  ['3.2x', 'More enquiries'],
  ['99.9%', 'Uptime'],
  ['A+', 'Security grade'],
];

export default function Home() {
  return <main id="main-content" className="original-home">
    <section className="hero hero-cinematic">
      <HeroMotion/>
      <div className="hero-veil" aria-hidden="true"/>
      <div className="hero-cinematic-inner shell">
        <div className="hero-copy">
          <p className="eyebrow">Premium Web Studio</p>
          <h1>Transforming Local <span>Business</span> <em>Into Digital Brands</em></h1>
          <p className="hero-lead">We build stunning, high-performance websites that don&apos;t just look good—they bring you customers. Web Design, SEO, and Hosting, all in one place.</p>
          <div className="hero-actions"><a className="button" href="/seo-tools/">Free SEO Audit <span aria-hidden="true">↗</span></a><a className="text-link" href="/services/">View Services <span aria-hidden="true">→</span></a></div>
          <ul className="hero-principles" aria-label="Kalpixa benefits"><li><span aria-hidden="true">✓</span> Premium design</li><li><span aria-hidden="true">✓</span> Better conversions</li><li><span aria-hidden="true">✓</span> Mobile-first experience</li></ul>
        </div>
        <aside className="hero-intelligence" aria-label="Kalpixa showcase"><p>Kalpixa Showcase</p><div><span>Design</span><strong>Premium visual identity</strong></div><div><span>Performance</span><strong>Fast, modern user experience</strong></div><div><span>Outcome</span><strong>More trust and enquiries</strong></div></aside>
      </div>
      <a className="scroll-cue" href="#performance-standard"><span>Explore Kalpixa</span><i aria-hidden="true"/></a>
    </section>

    <section id="performance-standard" className="performance-standard" aria-labelledby="performance-heading">
      <div className="shell">
        <div className="standard-heading"><p className="eyebrow">Performance standard</p><h2 id="performance-heading">Targets we engineer toward.</h2></div>
        <div className="metric-grid">{standards.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        <p className="metric-note">These are engagement targets, not universal guarantees. Results depend on project scope, infrastructure, audience and measurement baseline.</p>
      </div>
    </section>

    <section className="brand-statement dark-section">
      <div className="shell split-section"><div><p className="eyebrow eyebrow-light">Why Kalpixa</p><h2>A website should not just exist online. It should elevate the business behind it.</h2></div><div className="prose-light"><p>We help local businesses look more established, feel more premium, and convert more visitors through stronger design, better structure, and modern digital execution.</p><p>The goal is not more noise. The goal is a cleaner, sharper, more credible online presence that makes customers trust you faster.</p></div></div>
    </section>

    <section className="original-services shell" aria-labelledby="services-heading">
      <div className="section-intro section-intro-wide"><p className="eyebrow">What We Offer</p><h2 id="services-heading">Everything You Need To Grow</h2><p>Strategic digital services designed to make your business look stronger, perform better, and convert more visitors into customers.</p><a className="text-link" href="/services/">View All Solutions →</a></div>
      <div className="original-service-grid">{services.slice(0, 3).map((service) => <article key={service.slug}><span>{service.number}</span><strong>{service.price}</strong><h3>{service.title}</h3><p>{service.short}</p><a className="text-link" href="/services/">Learn More →</a></article>)}</div>
    </section>

    <section className="original-process soft-section" aria-labelledby="process-heading"><div className="shell"><div className="section-intro"><p className="eyebrow">How We Work</p><h2 id="process-heading">A Clear Path to Launch</h2></div><ol className="process-grid">{process.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></li>)}</ol></div></section>

    <section className="original-cta shell"><div><p className="eyebrow">Your next chapter</p><h2>Ready to elevate your business?</h2><p>Get a free strategy call and a custom quote. No pressure, no spam.</p><a className="button" href="/contact/">Start Your Project <span aria-hidden="true">↗</span></a></div></section>
  </main>;
}

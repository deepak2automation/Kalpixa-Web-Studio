export const site = { name: 'Kalpixa', url: 'https://kalpixa.com', email: 'deepak@kalpixa.com', phoneDisplay: '+91 79000 71164', phoneHref: '+917900071164', whatsapp: 'https://wa.me/917900071164' };

export const organizationJsonLd = { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: site.name, url: site.url, email: site.email, telephone: site.phoneHref, description: 'Web strategy, experience design, engineering and responsible digital growth for service businesses.', areaServed: 'Worldwide', knowsAbout: ['Web strategy', 'UX design', 'Web engineering', 'Technical SEO', 'Accessibility', 'Conversion optimization'] };

export const services = [
  { number: '01', slug: 'websites', title: 'Conversion websites', short: 'Positioning, UX, copy, design and engineering in one accountable engagement.', outcome: 'A fast, accessible platform that explains your value and makes the next step obvious.' },
  { number: '02', slug: 'seo', title: 'Search foundations', short: 'Technical SEO, information architecture, structured data and useful content systems.', outcome: 'A search-ready foundation designed for durable discovery—not loopholes or vanity traffic.' },
  { number: '03', slug: 'care', title: 'Care and optimization', short: 'Monitoring, maintenance, accessibility and evidence-led conversion improvement.', outcome: 'A dependable website that gets healthier after launch instead of quietly degrading.' },
];

export const process = [
  ['Discover', 'Business goals, audiences, evidence, constraints and current performance.'],
  ['Define', 'Positioning, message hierarchy, journey maps and a measurable delivery brief.'],
  ['Design', 'Accessible content-first interfaces with intentional states and responsive behavior.'],
  ['Build', 'Maintainable engineering, secure integrations, structured data and quality gates.'],
  ['Improve', 'Launch verification, monitoring and prioritized learning from real behavior.'],
];

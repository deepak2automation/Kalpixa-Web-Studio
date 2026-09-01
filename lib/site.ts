export const site = {
  name: 'Kalpixa Web Studio',
  shortName: 'Kalpixa',
  url: 'https://kalpixa.com',
  email: 'deepak@kalpixa.com',
  phoneDisplay: '+91 79000 71164',
  phoneHref: '+917900071164',
  whatsapp: 'https://wa.me/917900071164?text=Hello%20Kalpixa%20Web%20Studio%2C%20I%20would%20like%20to%20discuss%20a%20project.',
  emailEnquiry: 'mailto:deepak@kalpixa.com?subject=Project%20enquiry%20for%20Kalpixa%20Web%20Studio&body=Hello%20Kalpixa%20Web%20Studio%2C%0A%0AI%20would%20like%20to%20discuss%20a%20project.%0A%0ABusiness%20or%20website%3A%0AWhat%20I%20need%20help%20with%3A%0ATimeline%3A%0A%0AThank%20you.',
};

export const organizationJsonLd = { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: site.name, alternateName: site.shortName, url: site.url, email: site.email, telephone: site.phoneHref, description: 'Kalpixa Web Studio plans, designs and builds websites, search systems, digital campaigns, analytics and e-commerce experiences for growing businesses.', areaServed: 'Worldwide', knowsAbout: ['Website strategy and development', 'Search engine optimization', 'Content strategy', 'Digital marketing', 'Web analytics', 'E-commerce development', 'Marketplace operations', 'Website security'] };

export const services = [
  { number: '01', slug: 'custom-web-design', title: 'Custom Web Design', short: 'Strategy, content, interface design and production engineering shaped around your brand and customer journey.', price: 'From ₹25,000', features: ['Audience and journey planning', 'Responsive UI system', 'Accessible interaction design', 'Launch verification'] },
  { number: '02', slug: 'seo-visibility', title: 'SEO & Visibility', short: 'Technical and content improvements that strengthen discoverability without shortcuts or ranking guarantees.', price: 'From ₹10,000/mo', features: ['Technical SEO review', 'Search-intent mapping', 'Local search foundations', 'Evidence-based reporting'] },
  { number: '03', slug: 'high-speed-hosting', title: 'Managed Hosting', short: 'Hosting configuration, deployment hygiene and operational monitoring matched to the chosen platform and traffic profile.', price: 'From ₹5,000/yr', features: ['SSL and domain support', 'Backup expectations', 'Availability monitoring', 'Performance review'] },
  { number: '04', slug: 'mobile-app-development', title: 'Mobile Product Development', short: 'Mobile product planning and application delivery aligned with the required platforms, integrations and store policies.', price: 'Custom quote', features: ['Product and platform planning', 'API integration', 'Release preparation', 'Maintenance planning'] },
  { number: '05', slug: 'cyber-security', title: 'Security Optimization', short: 'Practical controls and release checks prioritized around platform risk, data sensitivity and operational ownership.', price: 'Scoped to project', features: ['Security-header review', 'Access-control hygiene', 'Dependency and form protection', 'Recovery expectations'] },
  { number: '06', slug: 'e-commerce-solutions', title: 'E-Commerce Solutions', short: 'Commerce planning and implementation across catalogue, checkout, payments, fulfilment and analytics.', price: 'From ₹45,000', features: ['Payment-gateway integration', 'Catalogue and inventory flows', 'Shipping configuration', 'Commerce measurement'] },
];

export const process = [
  ['Discovery', 'We learn your business, audience, and goals to define the right digital strategy.'],
  ['Design', 'Premium, conversion-focused mockups tailored to your brand identity.'],
  ['Build', 'Fast, responsive, SEO-optimized development with modern tooling.'],
  ['Launch', 'We deploy, monitor, and optimize for performance and growth.'],
];

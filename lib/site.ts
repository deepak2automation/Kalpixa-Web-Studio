export const site = { name: 'Kalpixa', url: 'https://kalpixa.com', email: 'deepak@kalpixa.com', phoneDisplay: '+91 79000 71164', phoneHref: '+917900071164', whatsapp: 'https://wa.me/917900071164' };

export const organizationJsonLd = { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: site.name, url: site.url, email: site.email, telephone: site.phoneHref, description: 'Kalpixa Web Studio builds high-performance websites, SEO strategies, hosting, mobile apps, e-commerce systems and security solutions for growing businesses.', areaServed: 'Worldwide', knowsAbout: ['Custom web design', 'Search engine optimization', 'Managed hosting', 'Mobile app development', 'Cyber security', 'E-commerce development'] };

export const services = [
  { number: '01', slug: 'custom-web-design', title: 'Custom Web Design', short: 'Bespoke, high-performance websites tailored to your brand identity. We build digital experiences, not just pages.', price: 'From ₹25,000', features: ['Bespoke UI/UX design', 'Responsive on all devices', 'Brand-aligned visuals', 'Conversion-optimized layout'] },
  { number: '02', slug: 'seo-visibility', title: 'SEO & Visibility', short: 'Dominate local search results. We optimize your structure and content to get you to the top of Google.', price: 'From ₹10,000/mo', features: ['Technical SEO audit', 'On-page optimization', 'Local search dominance', 'Monthly performance reports'] },
  { number: '03', slug: 'high-speed-hosting', title: 'High-Speed Hosting', short: 'Lightning fast load times with our managed hosting solutions. Security and SSL included standard.', price: '₹5,000/yr', features: ['Sub-second load times', 'Free SSL certificate', 'Daily backups', '99.9% uptime guarantee'] },
  { number: '04', slug: 'mobile-app-development', title: 'Mobile App Development', short: 'Extend your reach with native iOS and Android applications connected seamlessly to your backend.', price: 'Custom Quote', features: ['Native iOS & Android', 'Backend API integration', 'App store deployment', 'Ongoing maintenance'] },
  { number: '05', slug: 'cyber-security', title: 'Cyber Security', short: 'Protect your customer data with enterprise-grade firewalls and regular security audits.', price: 'included', features: ['Enterprise-grade firewall', 'Regular security audits', 'DDoS protection', 'Data encryption'] },
  { number: '06', slug: 'e-commerce-solutions', title: 'E-Commerce Solutions', short: 'Full-featured online stores with payment gateways, inventory management, and automated logistics.', price: 'From ₹45,000', features: ['Payment gateway integration', 'Inventory management', 'Automated logistics', 'Secure checkout flow'] },
];

export const process = [
  ['Discovery', 'We learn your business, audience, and goals to define the right digital strategy.'],
  ['Design', 'Premium, conversion-focused mockups tailored to your brand identity.'],
  ['Build', 'Fast, responsive, SEO-optimized development with modern tooling.'],
  ['Launch', 'We deploy, monitor, and optimize for performance and growth.'],
];

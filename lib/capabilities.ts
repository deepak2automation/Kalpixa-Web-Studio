export type Capability = {
  name: string;
  description: string;
  alias?: string;
};

export type CapabilityGroup = {
  number: string;
  slug: string;
  title: string;
  summary: string;
  outcome: string;
  capabilities: Capability[];
};

export const capabilityGroups: CapabilityGroup[] = [
  {
    number: '01',
    slug: 'web-platforms',
    title: 'Website & Commerce Platforms',
    summary: 'Plan and build maintainable websites and commerce systems around a real operating model—not a generic template.',
    outcome: 'A clear platform plan, an accessible customer journey and a release that can be tested, operated and improved.',
    capabilities: [
      { name: 'Website Planning', description: 'Audience, goals, content ownership, information architecture, requirements and acceptance criteria aligned before build.' },
      { name: 'Website Creation', description: 'Responsive interface design and production engineering with performance, accessibility and search foundations built in.' },
      { name: 'E-Commerce Website Planning', description: 'Catalogue, customer journey, tax, fulfilment, returns, permissions, measurement and integration requirements mapped before implementation.' },
      { name: 'E-Commerce Website Design & Development', alias: 'E-Commerce Website Making', description: 'Product discovery, cart and checkout experiences configured for the selected commerce platform and business rules.' },
      { name: 'Multivendor Marketplace Planning', alias: 'Multivendor Website', description: 'Vendor roles, onboarding, catalogue governance, commissions, payouts and moderation flows specified for marketplace builds.' },
      { name: 'Payment Gateway Integration', description: 'Gateway integration, test-mode verification, failure states and operational handoff; approval remains subject to the payment provider.' },
    ],
  },
  {
    number: '02',
    slug: 'search-content',
    title: 'Search, Content & Discoverability',
    summary: 'Connect search intent, useful writing and technical quality so people and search systems can understand the same story.',
    outcome: 'A people-first content system with stronger discoverability, clearer journeys and measurable maintenance priorities.',
    capabilities: [
      { name: 'Content Writing', description: 'Clear, original website copy shaped around audience questions, evidence, brand voice and conversion intent.' },
      { name: 'Keyword Research', description: 'Demand, intent and competitive-language research translated into topics, page roles and realistic priorities.' },
      { name: 'Search Engine Optimization', description: 'Technical, on-page and content improvements based on crawlability, usefulness, internal linking and measurable search data.' },
      { name: 'Local SEO', description: 'Location and service-page structure, consistent business information, review workflows and local search measurement.' },
      { name: 'E-Commerce SEO', description: 'Category, product, faceted navigation, structured data and internal-linking strategy designed for large catalogues.' },
      { name: 'E-Commerce Content Writing', alias: 'Content Writing for E-commerce', description: 'Distinct category and product copy that explains value, specifications, delivery expectations and purchase considerations.' },
      { name: 'Video Optimization', description: 'Titles, descriptions, thumbnails, transcripts, chapters, embeds and page context prepared for accessibility and discovery.' },
    ],
  },
  {
    number: '03',
    slug: 'campaigns-community',
    title: 'Campaigns, Social & Lifecycle',
    summary: 'Create coordinated acquisition and retention programmes with a defined audience, offer, channel role and measurement plan.',
    outcome: 'Campaigns that can be traced from message and creative through to qualified action—without vanity-metric theatre.',
    capabilities: [
      { name: 'Digital Marketing', description: 'Channel strategy, campaign planning, landing experiences and measurement aligned to a defined commercial objective.' },
      { name: 'Social Media Marketing', description: 'Channel roles, editorial themes, creative requirements and campaign operations designed around the audience and brand.' },
      { name: 'Email Marketing', description: 'Permission-based list strategy, responsive email design, automation journeys, testing and reporting for lifecycle communication.' },
      { name: 'Affiliate Marketing', description: 'Programme structure, partner criteria, tracking, content rules and reporting designed around transparent attribution.' },
      { name: 'Instagram Optimization', description: 'Profile, content system, link journeys and measurement improved for clarity, consistency and discoverability.' },
      { name: 'Instagram Product Tagging', description: 'Catalogue and commerce-account readiness, product mapping and tagging support subject to Meta eligibility and review.' },
    ],
  },
  {
    number: '04',
    slug: 'measurement-webmaster',
    title: 'Measurement & Webmaster Operations',
    summary: 'Build a trustworthy measurement layer and the webmaster workflows needed to see how the site is discovered and used.',
    outcome: 'Documented events, useful reporting and verified search-management accounts your team can continue to operate.',
    capabilities: [
      { name: 'Google Search Console', alias: 'Google Webmaster', description: 'Property verification, sitemap submission, indexation review, performance analysis and issue-monitoring workflows.' },
      { name: 'Bing Webmaster Tools', alias: 'Bing Webmaster', description: 'Site verification, sitemap and URL discovery setup, crawl diagnostics and search-performance review.' },
      { name: 'Google Analytics 4', alias: 'Google Analytics', description: 'Consent-aware measurement planning, key events, channel hygiene and reporting aligned with business questions.' },
      { name: 'E-Commerce Analytics', description: 'Product-list, product-view, cart, checkout, purchase and refund measurement with transaction-quality checks.' },
    ],
  },
  {
    number: '05',
    slug: 'commerce-marketplaces',
    title: 'Commerce Operations & Marketplaces',
    summary: 'Prepare reliable catalogue, campaign and fulfilment operations across owned stores and major marketplaces.',
    outcome: 'Cleaner product data, clearer responsibilities and channel reporting that supports better operating decisions.',
    capabilities: [
      { name: 'Google Merchant Center & Shopping', alias: 'Google Shopping Market', description: 'Feed readiness, product-data quality, diagnostics and listing support subject to Google policies and account eligibility.' },
      { name: 'Product Shipping Management', description: 'Shipping zones, rates, packaging rules, delivery messaging, tracking handoffs and exception flows configured with operational owners.' },
      { name: 'Amazon Marketplace Marketing', alias: 'Amazon Marketing', description: 'Listing quality, brand-consistent creative, campaign structure and reporting support within the client’s seller and advertising accounts.' },
      { name: 'Flipkart Marketplace Marketing', alias: 'Flipkart Marketing', description: 'Catalogue quality, merchandising, campaign support and marketplace reporting within the client’s approved seller account.' },
    ],
  },
  {
    number: '06',
    slug: 'trust-monetization',
    title: 'Trust, Security & Monetization Readiness',
    summary: 'Reduce avoidable risk and prepare responsible monetization foundations without overstating certification or approval.',
    outcome: 'A prioritized control plan, clearer ownership and platform-ready implementation evidence.',
    capabilities: [
      { name: 'Security Optimization', description: 'Security headers, dependency hygiene, access controls, form protection, backup expectations and release checks prioritized by risk.' },
      { name: 'Google AdSense Readiness', alias: 'Google Adsense', description: 'Content, navigation, policy-page and implementation readiness; account approval and revenue are determined by Google.' },
    ],
  },
];

export const capabilityCount = capabilityGroups.reduce((total, group) => total + group.capabilities.length, 0);

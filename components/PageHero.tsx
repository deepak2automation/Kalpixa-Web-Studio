/* eslint-disable @next/next/no-img-element -- Self-hosted, pre-sized WebP hero assets avoid runtime image optimization in the static export. */
const images = {
  about: { src: '/studio/about.webp', position: 'center 48%' },
  services: { src: '/studio/services.webp', position: 'center 38%' },
  websites: { src: '/studio/websites.webp', position: 'center 45%' },
  seo: { src: '/studio/seo.webp', position: 'center 48%' },
  care: { src: '/studio/care.webp', position: 'center 48%' },
  seoAnalyzer: { src: '/studio/seo-analyzer.webp', position: 'center 48%' },
  work: { src: '/studio/work.webp', position: 'center 42%' },
  insights: { src: '/studio/insights.webp', position: 'center 50%' },
  websiteBrief: { src: '/studio/website-brief.webp', position: 'center 52%' },
  contact: { src: '/studio/contact.webp', position: 'center 42%' },
  visualPolicy: { src: '/studio/visual-policy.webp', position: 'center 48%' },
  notFound: { src: '/studio/not-found.webp', position: 'center 48%' },
} as const;

export type PageVisual = keyof typeof images;

export function PageHero({ eyebrow, title, lead, image }: { eyebrow: string; title: string; lead: string; image: PageVisual }) {
  const visual = images[image];
  return <section className="page-hero">
    <img className="page-hero-image" src={visual.src} alt="" aria-hidden="true" fetchPriority="high" decoding="async" style={{ objectPosition: visual.position }}/>
    <div className="page-hero-overlay" aria-hidden="true"/>
    <div className="page-hero-inner shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-lead">{lead}</p></div>
  </section>;
}

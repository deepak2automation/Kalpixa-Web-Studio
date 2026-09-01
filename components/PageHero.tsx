/* eslint-disable @next/next/no-img-element -- Self-hosted, pre-sized WebP hero assets avoid runtime image optimization in the static export. */
const images = {
  strategy: { src: '/studio/strategy.webp', author: 'Tima Miroshnichenko', href: 'https://www.pexels.com/photo/a-people-working-in-the-office-together-6914641/' },
  analytics: { src: '/studio/analytics.webp', author: 'Yan Krukau', href: 'https://www.pexels.com/photo/a-person-using-a-laptop-while-in-a-meeting-7693733/' },
  commerce: { src: '/studio/commerce.webp', author: 'Pavel Danilyuk', href: 'https://www.pexels.com/photo/women-packing-orders-into-cardboard-boxes-7674983/' },
  contact: { src: '/studio/contact.webp', author: 'Mikhail Nilov', href: 'https://www.pexels.com/photo/colleagues-having-a-discussion-in-the-office-9301828/' },
};

export function PageHero({ eyebrow, title, lead, image = 'strategy' }: { eyebrow: string; title: string; lead: string; image?: keyof typeof images }) {
  const visual = images[image];
  return <section className="page-hero">
    <img className="page-hero-image" src={visual.src} alt="" aria-hidden="true"/>
    <div className="page-hero-overlay" aria-hidden="true"/>
    <div className="page-hero-inner shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-lead">{lead}</p><a className="photo-credit" href={visual.href} target="_blank" rel="noreferrer">Editorial photography · {visual.author} / Pexels</a></div>
  </section>;
}

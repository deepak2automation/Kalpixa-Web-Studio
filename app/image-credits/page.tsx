import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = { title: 'Image Credits', description: 'Editorial photography credits for Kalpixa Web Studio.', alternates: { canonical: '/image-credits' } };

const credits = [
  ['Strategy and planning', 'Tima Miroshnichenko', 'https://www.pexels.com/photo/a-people-working-in-the-office-together-6914641/'],
  ['Analytics and measurement', 'Yan Krukau', 'https://www.pexels.com/photo/a-person-using-a-laptop-while-in-a-meeting-7693733/'],
  ['Commerce operations', 'Pavel Danilyuk', 'https://www.pexels.com/photo/women-packing-orders-into-cardboard-boxes-7674983/'],
  ['Contact and collaboration', 'Mikhail Nilov', 'https://www.pexels.com/photo/colleagues-having-a-discussion-in-the-office-9301828/'],
];

export default function ImageCreditsPage() {
  return <main id="main-content"><PageHero eyebrow="Editorial transparency" title="Real photography, clearly credited." lead="These licensed editorial photographs illustrate working contexts. They are not presented as Kalpixa employees, clients or offices." image="analytics"/><section className="credits-list shell"><div><p>Photography is sourced from Pexels and used under the <a href="https://www.pexels.com/license/" target="_blank" rel="noreferrer">Pexels licence</a>.</p></div><ol>{credits.map(([use, author, href]) => <li key={use}><span>{use}</span><a href={href} target="_blank" rel="noreferrer">Photo by {author} / Pexels ↗</a></li>)}</ol></section></main>;
}

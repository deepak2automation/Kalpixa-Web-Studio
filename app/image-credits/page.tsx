import type { Metadata } from 'next';
import { PageHero } from '@/components/PageHero';

export const metadata: Metadata = { title: 'Visual Usage Notice', description: 'How editorial imagery is used on the Kalpixa Web Studio website.', alternates: { canonical: '/image-credits' } };

export default function ImageCreditsPage() {
  return <main id="main-content"><PageHero eyebrow="Visual usage" title="Photography that supports the story without pretending to be proof." lead="The website uses licensed editorial imagery to represent working contexts. People and locations shown are illustrative unless a page explicitly states otherwise." image="visualPolicy"/><section className="visual-policy shell"><div><p className="eyebrow">Representation standard</p><h2>Images provide context—not endorsement.</h2></div><div><p>Editorial photographs are selected for relevance, quality and inclusive representation. They are not presented as Kalpixa employees, clients, offices or completed client projects.</p><p>No person or visible third-party brand in an editorial image should be understood to endorse Kalpixa Web Studio.</p></div></section></main>;
}

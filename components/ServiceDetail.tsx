import { CtaBand } from './CtaBand';
import { PageHero, type PageVisual } from './PageHero';

export function ServiceDetail({ eyebrow, title, lead, image, includes, outcomes, fit }: { eyebrow: string; title: string; lead: string; image: PageVisual; includes: string[]; outcomes: string[]; fit: string }) {
  return <main id="main-content"><PageHero eyebrow={eyebrow} title={title} lead={lead} image={image}/><section className="content-grid shell"><div><p className="eyebrow">What is included</p><h2>A complete working system.</h2></div><ul className="check-list">{includes.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="soft-section"><div className="shell split-section"><div><p className="eyebrow">Designed outcomes</p><h2>What the work should change.</h2></div><ol className="number-list">{outcomes.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></div></section><section className="fit-band shell"><p className="eyebrow">Best fit</p><p>{fit}</p><a className="text-link" href="/contact/">Discuss your situation →</a></section><CtaBand/></main>;
}

import Link from 'next/link';

export function CtaBand({ title = 'Ready for a website that earns its place in your business?' }: { title?: string }) {
  return <section className="cta-band shell"><div><p className="eyebrow">A useful first conversation</p><h2>{title}</h2></div><Link className="button" href="/contact">Tell us what needs to change <span aria-hidden="true">→</span></Link></section>;
}

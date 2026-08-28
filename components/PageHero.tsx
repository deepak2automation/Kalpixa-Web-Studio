export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return <section className="page-hero shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-lead">{lead}</p></section>;
}

export function LegalPage({ eyebrow, title, intro, updated = '28 August 2026', children }: { eyebrow: string; title: string; intro: string; updated?: string; children: React.ReactNode }) {
  return <main id="main-content"><article className="legal shell"><header><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-lead">{intro}</p><p className="updated">Last updated: {updated}</p></header><div className="legal-body">{children}</div></article></main>;
}

/* eslint-disable @next/next/no-img-element -- Self-hosted, pre-sized WebP hero asset is appropriate for this static export. */
export function LegalPage({ eyebrow, title, intro, updated = '28 August 2026', children }: { eyebrow: string; title: string; intro: string; updated?: string; children: React.ReactNode }) {
  return <main id="main-content"><article className="legal"><header className="legal-hero"><img src="/studio/analytics.webp" alt="" aria-hidden="true"/><div className="shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-lead">{intro}</p><p className="updated">Last updated: {updated}</p></div></header><div className="legal-body shell">{children}</div></article></main>;
}

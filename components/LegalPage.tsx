/* eslint-disable @next/next/no-img-element -- Self-hosted, pre-sized WebP hero asset is appropriate for this static export. */
const legalVisuals = {
  privacy: '/studio/privacy.webp',
  terms: '/studio/terms.webp',
  cookies: '/studio/cookies.webp',
  accessibility: '/studio/accessibility.webp',
  security: '/studio/security.webp',
} as const;
const legalVisualByTitle: Record<string, keyof typeof legalVisuals> = {
  'Privacy notice': 'privacy',
  'Website terms': 'terms',
  'Cookie notice': 'cookies',
  'Accessibility statement': 'accessibility',
  'Security and responsible disclosure': 'security',
};

export function LegalPage({ eyebrow, title, intro, updated = '1 September 2026', children }: { eyebrow: string; title: string; intro: string; updated?: string; children: React.ReactNode }) {
  const visual = legalVisuals[legalVisualByTitle[title] ?? 'privacy'];
  return <main id="main-content"><article className="legal"><header className="legal-hero"><img src={visual} alt="" aria-hidden="true" fetchPriority="high" decoding="async"/><div className="shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-lead">{intro}</p><p className="updated">Last updated: {updated}</p></div></header><div className="legal-body shell">{children}</div></article></main>;
}

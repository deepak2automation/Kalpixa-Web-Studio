import type { Metadata, Viewport } from 'next';
import './globals.css';
import './responsive-fixes.css';
import './premium.css';
import './elite-upgrade.css';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { ExperienceEnhancements } from '@/components/ExperienceEnhancements';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { organizationJsonLd } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://kalpixa.com'),
  title: { default: 'Kalpixa Web Studio — Websites, Search & Digital Growth', template: '%s | Kalpixa Web Studio' },
  description: 'Kalpixa Web Studio plans and builds websites, search systems, digital campaigns, analytics and e-commerce experiences for growing businesses.',
  applicationName: 'Kalpixa Web Studio', authors: [{ name: 'Kalpixa Web Studio' }], creator: 'Kalpixa Web Studio', publisher: 'Kalpixa Web Studio',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'en_IN', url: '/', siteName: 'Kalpixa Web Studio', title: 'Kalpixa Web Studio — Transforming Local Business Into Digital Brands', description: 'Website strategy, design, search, digital growth and commerce systems for growing businesses.', images: [{ url: '/og-kalpixa.png', width: 1200, height: 630, alt: 'Kalpixa Web Studio — Transforming Local Business Into Digital Brands.' }] },
  twitter: { card: 'summary_large_image', title: 'Kalpixa Web Studio — Transforming Local Business Into Digital Brands', description: 'Website strategy, design, search, digital growth and commerce systems for growing businesses.', images: ['/og-kalpixa.png'] },
  robots: { index: true, follow: true }, icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f7f8fb' }, { media: '(prefers-color-scheme: dark)', color: '#06131d' }], colorScheme: 'light dark' };

const themeBootstrap = `(() => { try { const saved = localStorage.getItem('kalpixa:theme'); const theme = saved === 'light' || saved === 'dark' ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme; } catch { document.documentElement.dataset.theme = 'light'; } })();`;
const organizationJsonLdText = JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c');

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script id="theme-bootstrap" dangerouslySetInnerHTML={{ __html: themeBootstrap }}/><script id="organization-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: organizationJsonLdText }}/></head><body><ExperienceEnhancements/><a className="skip-link" href="#main-content">Skip to main content</a><SiteHeader />{children}<SiteFooter /><FloatingWhatsApp/></body></html>;
}

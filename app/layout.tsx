import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import './responsive-fixes.css';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { organizationJsonLd } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://kalpixa.com'),
  title: { default: 'Kalpixa — Web Strategy, Design & Engineering', template: '%s | Kalpixa' },
  description: 'Kalpixa builds fast, accessible, conversion-focused websites and digital growth systems for ambitious service businesses.',
  applicationName: 'Kalpixa', authors: [{ name: 'Kalpixa' }], creator: 'Kalpixa', publisher: 'Kalpixa',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'en_IN', url: '/', siteName: 'Kalpixa', title: 'Kalpixa — Digital clarity. Measurable growth.', description: 'Strategy, design, engineering and growth systems for ambitious service businesses.', images: [{ url: '/og-kalpixa.png', width: 1733, height: 907, alt: 'Kalpixa — Digital clarity. Measurable growth.' }] },
  twitter: { card: 'summary_large_image', title: 'Kalpixa — Digital clarity. Measurable growth.', description: 'Strategy, design, engineering and growth systems for ambitious service businesses.', images: ['/og-kalpixa.png'] },
  robots: { index: true, follow: true }, icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#07111f', colorScheme: 'light' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to main content</a><SiteHeader />{children}<SiteFooter /><Script id="organization-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} /></body></html>;
}

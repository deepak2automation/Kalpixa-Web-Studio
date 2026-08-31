import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import './responsive-fixes.css';
import './premium.css';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { ExperienceEnhancements } from '@/components/ExperienceEnhancements';
import { organizationJsonLd } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://kalpixa.com'),
  title: { default: 'Kalpixa — Digital Transformation Agency', template: '%s | Kalpixa' },
  description: 'Kalpixa Web Studio builds high-performance websites, SEO strategies, and mobile apps for local businesses. Get a free quote today.',
  applicationName: 'Kalpixa', authors: [{ name: 'Kalpixa' }], creator: 'Kalpixa', publisher: 'Kalpixa',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'en_IN', url: '/', siteName: 'Kalpixa', title: 'Kalpixa — Transforming Local Business Into Digital Brands', description: 'High-performance web design, SEO, hosting and digital solutions for growing businesses.', images: [{ url: '/og-kalpixa.png', width: 1200, height: 630, alt: 'Kalpixa — Transforming Local Business Into Digital Brands.' }] },
  twitter: { card: 'summary_large_image', title: 'Kalpixa — Transforming Local Business Into Digital Brands', description: 'High-performance web design, SEO, hosting and digital solutions for growing businesses.', images: ['/og-kalpixa.png'] },
  robots: { index: true, follow: true }, icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#07111f', colorScheme: 'light' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><ExperienceEnhancements/><a className="skip-link" href="#main-content">Skip to main content</a><SiteHeader />{children}<SiteFooter /><Script id="organization-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} /></body></html>;
}

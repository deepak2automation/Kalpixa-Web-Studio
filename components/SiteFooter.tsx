import Link from 'next/link';
import { Brand } from './Brand';
import { site } from '@/lib/site';

export function SiteFooter() {
  return <footer className="site-footer"><div className="shell footer-cta"><div><p className="eyebrow eyebrow-light">Have a meaningful problem?</p><h2>Let’s make the next version count.</h2></div><Link className="button button-gold" href="/contact">Request a strategy review <span aria-hidden="true">↗</span></Link></div><div className="shell footer-grid"><div><Brand/><p className="footer-note">Independent digital strategy, design and engineering. Working with ambitious service businesses in India and worldwide.</p></div><div><h3>Explore</h3><Link href="/services">Services</Link><Link href="/work">Approach</Link><Link href="/about">About</Link><Link href="/insights">Insights</Link></div><div><h3>Contact</h3><a href={`mailto:${site.email}`}>{site.email}</a><a href={`tel:${site.phoneHref}`}>{site.phoneDisplay}</a><a href={site.whatsapp}>WhatsApp</a></div><div><h3>Standards</h3><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookies</Link><Link href="/accessibility">Accessibility</Link><Link href="/security">Security</Link></div></div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} Kalpixa.</span><span>Designed with intent. Built for people.</span></div></footer>;
}

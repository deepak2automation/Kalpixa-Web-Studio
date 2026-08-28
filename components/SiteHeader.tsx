import Link from 'next/link';
import { Brand } from './Brand';

export function SiteHeader() {
  return <header className="site-header"><Brand/><nav className="primary-nav" aria-label="Primary navigation"><Link href="/services">Services</Link><Link href="/work">Approach</Link><Link href="/about">About</Link><Link href="/insights">Insights</Link></nav><Link className="button button-small" href="/contact">Start a project</Link></header>;
}

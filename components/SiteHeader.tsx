import { Brand } from './Brand';

export function SiteHeader() {
  return <header className="site-header"><Brand/><nav className="primary-nav" aria-label="Primary navigation"><a href="/">Home</a><a href="/services/">Services</a><a href="/seo-tools/">SEO Analyzer</a><a href="/contact/">Contact</a></nav><a className="button button-small" href="/contact/">Start a project</a></header>;
}

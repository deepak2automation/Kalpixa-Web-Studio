import { Brand } from './Brand';

export function SiteHeader() {
  return <header className="site-header"><Brand/><nav className="primary-nav" aria-label="Primary navigation"><a href="/services/">Services</a><a href="/work/">Approach</a><a href="/about/">About</a><a href="/insights/">Insights</a></nav><a className="button button-small" href="/contact/">Start a project</a></header>;
}

'use client';

import { useEffect, useState } from 'react';
import { Brand } from './Brand';
import { ThemeToggle } from './ThemeToggle';

const links = [['/', 'Home'], ['/services/', 'Services'], ['/seo-tools/', 'SEO Analyzer'], ['/contact/', 'Contact']];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.body.classList.add('menu-open');
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.classList.remove('menu-open'); window.removeEventListener('keydown', onKeyDown); };
  }, [menuOpen]);

  return <header className="site-header">
    <Brand/>
    <nav className="primary-nav" aria-label="Primary navigation">{links.map(([href, label]) => <a href={href} key={href}>{label}</a>)}</nav>
    <div className="header-actions"><ThemeToggle/><a className="button button-small" href="/contact/">Start a project</a><button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen((value) => !value)}><span/><span/><span/></button></div>
    <div className="mobile-navigation" id="mobile-navigation" data-open={menuOpen} aria-hidden={!menuOpen}><nav aria-label="Mobile navigation">{links.map(([href, label]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}<span aria-hidden="true">↗</span></a>)}</nav><a className="button" href="/contact/" onClick={() => setMenuOpen(false)}>Start your project</a></div>
  </header>;
}

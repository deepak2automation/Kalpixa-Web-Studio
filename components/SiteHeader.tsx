'use client';

import { useEffect, useRef, useState } from 'react';
import { Brand } from './Brand';
import { ThemeToggle } from './ThemeToggle';

const links = [['/', 'Home'], ['/services/', 'Services'], ['/seo-tools/', 'SEO Analyzer'], ['/contact/', 'Contact']];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') { setMenuOpen(false); headerRef.current?.querySelector<HTMLButtonElement>('.menu-toggle')?.focus(); } };
    const outside = (event: Event) => { if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false); };
    const desktop = window.matchMedia('(min-width: 861px)');
    const resize = () => setMenuOpen(false);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    desktop.addEventListener('change', resize);
    window.addEventListener('resize', resize);
    window.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('focusin', outside); desktop.removeEventListener('change', resize); window.removeEventListener('resize', resize); window.removeEventListener('keydown', onKeyDown); };
  }, [menuOpen]);

  return <header className="site-header" ref={headerRef}>
    <noscript><style>{'@media(max-width:860px){.site-header .primary-nav{display:flex;grid-column:1/-1;grid-row:2;flex-wrap:wrap;justify-content:flex-start;padding-top:1rem;gap:1rem}.site-header .header-actions{display:none}}'}</style></noscript>
    <Brand/>
    <nav className="primary-nav" aria-label="Primary navigation">{links.map(([href, label]) => <a href={href} key={href}>{label}</a>)}</nav>
    <div className="header-actions"><ThemeToggle/><a className="button button-small" href="/contact/">Start a project</a><button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen((value) => !value)}><span/><span/><span/></button></div>
    <div className="mobile-navigation" id="mobile-navigation" data-open={menuOpen} aria-hidden={!menuOpen}><nav aria-label="Mobile navigation">{links.map(([href, label]) => <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}<span aria-hidden="true">↗</span></a>)}</nav><a className="button" href="/contact/" onClick={() => setMenuOpen(false)}>Start your project</a></div>
  </header>;
}

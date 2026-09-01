'use client';

import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    (onStoreChange) => { window.addEventListener('kalpixa:theme-change', onStoreChange); return () => window.removeEventListener('kalpixa:theme-change', onStoreChange); },
    currentTheme,
    () => 'light' as Theme,
  );

  function toggleTheme() {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    window.localStorage.setItem('kalpixa:theme', next);
    window.dispatchEvent(new Event('kalpixa:theme-change'));
  }

  const isDark = theme === 'dark';
  return <button className="theme-toggle" type="button" role="switch" aria-checked={isDark} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>
    <span className="theme-toggle-track" aria-hidden="true">
      <svg className="theme-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      <svg className="theme-moon" viewBox="0 0 24 24"><path d="M20.2 14.5A8.6 8.6 0 0 1 9.5 3.8a8.6 8.6 0 1 0 10.7 10.7Z"/></svg>
      <span className="theme-toggle-thumb"/>
    </span>
  </button>;
}

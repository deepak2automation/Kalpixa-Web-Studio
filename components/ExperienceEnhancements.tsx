'use client';

import { useEffect } from 'react';

export function ExperienceEnhancements() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>('.site-header');
    const progress = document.querySelector<HTMLElement>('.scroll-progress span');
    const targets = Array.from(document.querySelectorAll<HTMLElement>('main > section:not(.hero-cinematic), .service-card, .insight-grid article, .timeline li'));
    const observer = typeof IntersectionObserver === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer?.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 }) : null;
    if (observer) {
      root.classList.add('motion-ready');
      targets.forEach((target) => { target.classList.add('reveal-target'); observer.observe(target); });
    }

    const path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll<HTMLAnchorElement>('.primary-nav a, .mobile-navigation nav a').forEach((link) => {
      const linkPath = new URL(link.href).pathname.replace(/\/$/, '') || '/';
      if (path === linkPath || (linkPath !== '/' && path.startsWith(`${linkPath}/`))) link.setAttribute('aria-current', 'page');
    });

    let frame = 0;
    const update = () => {
      frame = 0;
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const value = maximum > 0 ? Math.min(1, window.scrollY / maximum) : 0;
      if (progress) progress.style.transform = `scaleX(${value})`;
      header?.classList.toggle('is-scrolled', window.scrollY > 18);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      observer?.disconnect();
      targets.forEach((target) => target.classList.remove('reveal-target', 'is-visible'));
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      root.classList.remove('motion-ready');
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true"><span/></div>;
}

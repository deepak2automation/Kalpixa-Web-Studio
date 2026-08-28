'use client';

import { useEffect } from 'react';

export function ExperienceEnhancements() {
  useEffect(() => {
    const root = document.documentElement;
    const header = document.querySelector<HTMLElement>('.site-header');
    const progress = document.querySelector<HTMLElement>('.scroll-progress span');
    const targets = Array.from(document.querySelectorAll<HTMLElement>('main > section:not(.hero-cinematic), .service-card, .insight-grid article, .timeline li'));
    root.classList.add('motion-ready');
    targets.forEach((target) => target.classList.add('reveal-target'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach((target) => observer.observe(target));

    const path = window.location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll<HTMLAnchorElement>('.primary-nav a').forEach((link) => {
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
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      root.classList.remove('motion-ready');
    };
  }, []);

  return <div className="scroll-progress" aria-hidden="true"><span/></div>;
}

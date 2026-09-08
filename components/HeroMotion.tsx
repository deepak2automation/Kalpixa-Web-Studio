'use client';

import { useEffect, useRef, useState } from 'react';

const motionSource = (media: HTMLVideoElement) => media.canPlayType('video/mp4') ? '/hero-motion.mp4' : '/hero-motion.webm';

export function HeroMotion() {
  const video = useRef<HTMLVideoElement>(null);
  const preference = useRef<boolean | null>(null);
  const [paused, setPaused] = useState(true);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const media = video.current;
    if (!media) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => {
      if (document.hidden || reduced.matches || preference.current === false || (connection?.saveData && preference.current !== true)) { media.pause(); return; }
      if (!media.getAttribute('src')) media.src = motionSource(media);
      void media.play().catch((error) => { if (error.name === 'NotSupportedError') setUnavailable(true); });
    };
    update();
    reduced.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    return () => { media.pause(); reduced.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); };
  }, []);

  function toggle() {
    const media = video.current;
    if (!media) return;
    preference.current = media.paused;
    if (media.paused) { if (!media.getAttribute('src')) media.src = motionSource(media); void media.play().catch((error) => { if (error.name === 'NotSupportedError') setUnavailable(true); }); }
    else media.pause();
  }

  return <>
    <video ref={video} className="hero-motion-source" data-unavailable={unavailable} muted loop playsInline preload="none" poster="/hero-motion-poster.webp" aria-hidden="true" tabIndex={-1} disablePictureInPicture onError={() => setUnavailable(true)} onPlay={() => setPaused(false)} onPause={() => setPaused(true)}/>
    {!unavailable && <button type="button" className="hero-motion-control" onClick={toggle} aria-label={paused ? 'Play background animation' : 'Pause background animation'}><span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span> {paused ? 'Play motion' : 'Pause motion'}</button>}
  </>;
}

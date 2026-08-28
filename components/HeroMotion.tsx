'use client';

import { useEffect, useRef } from 'react';

type FrameVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: () => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

export function HeroMotion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<FrameVideo>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas?.getContext('2d', { alpha: false });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!canvas || !video || !context || reducedMotion.matches) return;

    let frame = 0;
    let videoFrame = 0;
    let active = true;
    let animated = false;
    let lastDraw = 0;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const density = Math.min(window.devicePixelRatio || 1, bounds.width <= 600 ? 0.75 : 1.25);
      canvas.width = Math.max(1, Math.round(bounds.width * density));
      canvas.height = Math.max(1, Math.round(bounds.height * density));
    };

    const draw = (now = performance.now()) => {
      if (!active || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      const interval = canvas.clientWidth <= 600 ? 1000 / 12 : 1000 / 20;
      if (now - lastDraw < interval) {
        schedule();
        return;
      }
      lastDraw = now;
      const sourceRatio = video.videoWidth / video.videoHeight;
      const canvasRatio = canvas.width / canvas.height;
      let width = canvas.width;
      let height = canvas.height;
      let x = 0;
      let y = 0;
      if (sourceRatio > canvasRatio) {
        width = canvas.height * sourceRatio;
        x = (canvas.width - width) / 2;
      } else {
        height = canvas.width / sourceRatio;
        y = (canvas.height - height) / 2;
      }
      context.drawImage(video, x, y, width, height);
      canvas.dataset.playing = 'true';
      if (animated) schedule();
    };

    const schedule = () => {
      if (video.requestVideoFrameCallback) videoFrame = video.requestVideoFrameCallback(draw);
      else frame = window.requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (animated) void video.play().then(schedule).catch(() => undefined);
    };
    const activate = () => {
      if (animated) return;
      animated = true;
      document.documentElement.classList.add('motion-engaged');
      interactionEvents.forEach((event) => window.removeEventListener(event, activate));
      void video.play().then(schedule).catch(() => undefined);
    };
    const interactionEvents = ['pointerdown', 'touchstart', 'wheel', 'keydown'] as const;
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    document.addEventListener('visibilitychange', onVisibility);
    interactionEvents.forEach((event) => window.addEventListener(event, activate, { passive: true, once: true }));

    return () => {
      active = false;
      document.documentElement.classList.remove('motion-engaged');
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      interactionEvents.forEach((event) => window.removeEventListener(event, activate));
      if (frame) window.cancelAnimationFrame(frame);
      if (videoFrame && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(videoFrame);
    };
  }, []);

  return <>
    <canvas ref={canvasRef} className="hero-motion-canvas" aria-hidden="true"/>
    <video ref={videoRef} className="hero-motion-source" muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1} disablePictureInPicture>
      <source src="/hero-motion.webm" type="video/webm"/>
    </video>
  </>;
}

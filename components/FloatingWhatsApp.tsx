'use client';

import { KeyboardEvent, PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react';
import { site } from '@/lib/site';

type Position = { x: number; y: number };
const edge = 14;

function controlSize() {
  return window.matchMedia('(max-width: 680px)').matches ? 58 : 64;
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

function defaultPosition(): Position {
  const size = controlSize();
  return { x: window.innerWidth - size - 24, y: window.innerHeight - size - 28 };
}

export function FloatingWhatsApp() {
  const [position, setPosition] = useState<Position | null>(null);
  const [dragging, setDragging] = useState(false);
  const positionRef = useRef<Position | null>(null);
  const activePointer = useRef<number | null>(null);
  const start = useRef({ pointerX: 0, pointerY: 0, x: 0, y: 0 });
  const moved = useRef(false);
  const suppressClick = useRef(false);

  function fit(next: Position): Position {
    const size = controlSize();
    return {
      x: clamp(next.x, edge, window.innerWidth - size - edge),
      y: clamp(next.y, 84, window.innerHeight - size - edge),
    };
  }

  function save(next: Position) {
    const size = controlSize();
    const width = Math.max(1, window.innerWidth - size);
    const height = Math.max(1, window.innerHeight - size);
    window.localStorage.setItem('kalpixa:whatsapp-position', JSON.stringify({ x: next.x / width, y: next.y / height }));
  }

  useEffect(() => {
    const size = controlSize();
    let initial = defaultPosition();
    try {
      const saved = JSON.parse(window.localStorage.getItem('kalpixa:whatsapp-position') || 'null') as { x?: number; y?: number } | null;
      if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
        initial = { x: Number(saved.x) * (window.innerWidth - size), y: Number(saved.y) * (window.innerHeight - size) };
      }
    } catch { /* Use the unobtrusive default position. */ }
    const frame = window.requestAnimationFrame(() => {
      const next = fit(initial);
      positionRef.current = next;
      setPosition(next);
    });

    const resize = () => setPosition((value) => {
      const next = fit(value ?? defaultPosition());
      positionRef.current = next;
      return next;
    });
    window.addEventListener('resize', resize, { passive: true });
    window.visualViewport?.addEventListener('resize', resize, { passive: true });
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.visualViewport?.removeEventListener('resize', resize); };
  }, []);

  function updatePosition(next: Position) {
    const fitted = fit(next);
    positionRef.current = fitted;
    setPosition(fitted);
  }

  function pointerDown(event: ReactPointerEvent<HTMLAnchorElement>) {
    if (event.button !== 0) return;
    const current = positionRef.current ?? position ?? defaultPosition();
    start.current = { pointerX: event.clientX, pointerY: event.clientY, x: current.x, y: current.y };
    moved.current = false;
    suppressClick.current = false;
    activePointer.current = event.pointerId;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function pointerMove(event: ReactPointerEvent<HTMLAnchorElement>) {
    if (activePointer.current !== event.pointerId) return;
    const deltaX = event.clientX - start.current.pointerX;
    const deltaY = event.clientY - start.current.pointerY;
    if (Math.hypot(deltaX, deltaY) > 6) moved.current = true;
    updatePosition({ x: start.current.x + deltaX, y: start.current.y + deltaY });
  }

  function pointerUp(event: ReactPointerEvent<HTMLAnchorElement>) {
    if (activePointer.current !== event.pointerId) return;
    activePointer.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (positionRef.current) save(positionRef.current);
    suppressClick.current = moved.current;
  }

  function keyboardMove(event: KeyboardEvent<HTMLAnchorElement>) {
    const changes: Record<string, Position> = {
      ArrowLeft: { x: -18, y: 0 }, ArrowRight: { x: 18, y: 0 }, ArrowUp: { x: 0, y: -18 }, ArrowDown: { x: 0, y: 18 },
    };
    if (event.key === 'Home') {
      event.preventDefault();
      const next = fit(defaultPosition());
      updatePosition(next);
      save(next);
      return;
    }
    const change = changes[event.key];
    if (!change) return;
    event.preventDefault();
    const current = positionRef.current ?? position ?? defaultPosition();
    const next = fit({ x: current.x + change.x, y: current.y + change.y });
    updatePosition(next);
    save(next);
  }

  return <a className="floating-whatsapp" data-dragging={dragging} href={site.whatsapp} target="_blank" rel="noreferrer" aria-label="Open WhatsApp chat. Drag to reposition, or use the arrow keys. Press Home to reset its position." style={position ? { left: position.x, top: position.y } : undefined} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onKeyDown={keyboardMove} draggable={false} onDragStart={(event) => event.preventDefault()} onClick={(event) => { if (suppressClick.current) { event.preventDefault(); suppressClick.current = false; } }}>
    <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3a12.5 12.5 0 0 0-10.8 18.8L3.5 28.5l6.9-1.8A12.5 12.5 0 1 0 16 3Zm0 22.8a10.3 10.3 0 0 1-5.2-1.4l-.4-.2-4.1 1.1 1.1-4-.2-.4A10.3 10.3 0 1 1 16 25.8Zm5.7-7.7c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2l-.9 1.1c-.2.2-.4.2-.7.1-1.8-.9-3-1.7-4.2-3.8-.3-.5.3-.5.9-1.7.1-.2.1-.5 0-.7l-1-2.5c-.3-.6-.6-.5-.9-.5h-.7c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.8c.2.3 2.6 4 6.4 5.6 2.4 1 3.4 1.1 4.6.9 1.4-.2 1.8-.9 2-1.7.2-.8.2-1.4.1-1.6-.2-.2-.5-.3-.8-.4Z"/></svg>
    <span className="whatsapp-grip" aria-hidden="true">⠿</span>
  </a>;
}

export function HeroMotion() {
  return <video className="hero-motion-source" autoPlay muted loop playsInline preload="metadata" poster="/hero-motion-poster.webp" aria-hidden="true" tabIndex={-1} disablePictureInPicture>
      <source src="/hero-motion.webm" type="video/webm"/>
    </video>;
}

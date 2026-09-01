export function Brand() {
  return <a className="brand" href="/" aria-label="Kalpixa Web Studio — home">
    <svg className="brand-symbol" viewBox="0 0 72 72" aria-hidden="true">
      <rect className="brand-emblem-core" x="2" y="2" width="68" height="68" rx="20"/>
      <rect className="brand-emblem-frame" x="4" y="4" width="64" height="64" rx="18"/>
      <path className="brand-emblem-violet" d="M5 29V21C5 12 12 5 21 5h22"/>
      <path className="brand-emblem-gold" d="M49 5h2c9 0 16 7 16 16v7"/>
      <path className="brand-emblem-aqua" d="M67 34v17c0 9-7 16-16 16H22"/>
      <path className="brand-emblem-k" d="M16 14h12v16l21-16h16L41 34l24 24H49L28 41v17H16Z"/>
      <path className="brand-emblem-cut" d="m34 34 16-12-8 12 9 10Z"/>
      <path className="brand-circuit brand-circuit-violet" d="M22 20v30"/>
      <path className="brand-circuit brand-circuit-aqua" d="m29 33 18-13"/>
      <path className="brand-circuit brand-circuit-gold" d="m29 39 18 14"/>
      <circle className="brand-node brand-node-gold" cx="22" cy="20" r="2.1"/>
      <circle className="brand-node brand-node-aqua" cx="22" cy="35" r="2.3"/>
      <circle className="brand-node brand-node-violet" cx="22" cy="50" r="2.1"/>
      <circle className="brand-node brand-node-aqua" cx="47" cy="20" r="2.1"/>
      <circle className="brand-node brand-node-gold" cx="47" cy="53" r="2.1"/>
    </svg>
    <span><strong>Kalpixa</strong><small>Web Studio</small></span>
  </a>;
}

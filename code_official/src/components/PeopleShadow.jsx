function PeopleShadow({ className = '', variant = 'default' }) {
  const tone = variant === 'soft' ? 'opacity-10' : 'opacity-15'

  return (
    <div className={`pointer-events-none absolute ${className} ${tone}`} aria-hidden="true">
      <svg viewBox="0 0 240 320" className="h-full w-full">
        <ellipse cx="120" cy="282" rx="80" ry="24" fill="rgba(255,255,255,0.18)" />
        <ellipse cx="120" cy="146" rx="54" ry="78" fill="rgba(255,255,255,0.14)" />
        <rect x="70" y="90" width="100" height="120" rx="42" fill="rgba(255,255,255,0.10)" />
        <rect x="56" y="152" width="36" height="88" rx="14" fill="rgba(255,255,255,0.10)" />
        <rect x="148" y="152" width="36" height="88" rx="14" fill="rgba(255,255,255,0.10)" />
        <rect x="84" y="44" width="72" height="70" rx="24" fill="rgba(255,255,255,0.14)" />
        <circle cx="120" cy="102" r="24" fill="rgba(255,255,255,0.12)" />
      </svg>
    </div>
  )
}

export default PeopleShadow

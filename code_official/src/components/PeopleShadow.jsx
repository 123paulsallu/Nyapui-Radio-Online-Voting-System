function PeopleShadow({ className = '', variant = 'default' }) {
  const tone = variant === 'soft' ? 'opacity-10' : 'opacity-15'

  return (
    <div className={`pointer-events-none absolute ${className} ${tone}`} aria-hidden="true">
      <svg viewBox="0 0 260 320" className="h-full w-full">
        <ellipse cx="130" cy="286" rx="92" ry="24" fill="rgba(255,255,255,0.18)" />
        <path
          d="M110 82c0-24 18-44 40-44s40 20 40 44c0 16-8 30-20 38l-10 6-10-6c-12-8-20-22-20-38Z"
          fill="rgba(255,255,255,0.16)"
        />
        <path
          d="M98 114c-10 10-16 24-16 40v38l18 10 14-18 10 38h28l10-46 12 18 20-10v-36c0-15-6-29-16-40l-22-16-22 16Z"
          fill="rgba(255,255,255,0.16)"
        />
        <path
          d="M90 168c-8 8-13 18-13 28v42l18 10 8-34 8 22 12-12 8 28h24l6-36 12 18 18-12v-32c0-10-5-20-13-28l-14-10-20 14-20-14-14 10Z"
          fill="rgba(255,255,255,0.12)"
        />
        <path d="M112 120h36l8 42h-52l8-42Z" fill="rgba(255,255,255,0.14)" />
        <path d="M88 202h16l10 48H78l10-48Z" fill="rgba(255,255,255,0.12)" />
        <path d="M156 202h16l10 48h-36l10-48Z" fill="rgba(255,255,255,0.12)" />
      </svg>
    </div>
  )
}

export default PeopleShadow

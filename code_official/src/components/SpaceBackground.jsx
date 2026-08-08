import { motion, useReducedMotion } from 'framer-motion'

const stars = [
  { id: 1, top: '12%', left: '12%', size: '2px', delay: 0 },
  { id: 2, top: '20%', left: '72%', size: '1px', delay: 0.6 },
  { id: 3, top: '33%', left: '34%', size: '2px', delay: 1.3 },
  { id: 4, top: '58%', left: '22%', size: '1px', delay: 0.4 },
  { id: 5, top: '70%', left: '84%', size: '2px', delay: 1.7 },
  { id: 6, top: '82%', left: '48%', size: '1px', delay: 0.9 },
]

const orbitals = [
  { id: 1, className: 'absolute inset-8 rounded-full border border-white/10' },
  { id: 2, className: 'absolute inset-16 rounded-full border border-white/[0.08]' },
  { id: 3, className: 'absolute inset-24 rounded-full border border-white/[0.06]' },
]

function SpaceBackground() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(84,100,255,0.16),transparent_24%),radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.08),transparent_20%),linear-gradient(180deg,rgba(3,5,10,0.3),rgba(3,5,10,0.9))]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:90px_90px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.95),rgba(0,0,0,0.25))]" />

      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.span
            key={star.id}
            className="absolute rounded-full bg-white/80"
            style={{ top: star.top, left: star.left, width: star.size, height: star.size }}
            animate={shouldReduceMotion ? undefined : { opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 4 + star.delay, repeat: Infinity, ease: 'easeInOut', delay: star.delay }}
          />
        ))}
      </div>

      <div className="absolute inset-0">
        {orbitals.map((orbital) => (
          <motion.div
            key={orbital.id}
            className={orbital.className}
            animate={shouldReduceMotion ? undefined : { rotate: 360 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 24 + orbital.id * 6, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      <motion.div
        className="absolute left-[10%] top-[20%] h-24 w-24 rounded-full border border-white/10"
        animate={shouldReduceMotion ? undefined : { y: [0, -8, 0], x: [0, 6, 0], opacity: [0.5, 0.85, 0.5] }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[14%] right-[12%] h-16 w-16 rounded-full border border-white/10"
        animate={shouldReduceMotion ? undefined : { y: [0, 10, 0], x: [0, -5, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

export default SpaceBackground

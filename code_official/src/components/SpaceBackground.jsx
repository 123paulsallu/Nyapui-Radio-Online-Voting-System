import { motion, useReducedMotion } from 'framer-motion'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import figmaLogo from '../assets/Figma.jpg'
import dockerLogo from '../assets/Docker Logo [Software].jpg'
import vscodeLogo from '../assets/Visual Studio Code logo in vector format - Brandlogos_net.jpg'

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

const toolDroplets = [
  { id: 'react', src: reactLogo, alt: 'React', top: '14%', left: '10%', size: 78, rotate: -18, opacity: 0.7 },
  { id: 'vite', src: viteLogo, alt: 'Vite', top: '72%', left: '16%', size: 64, rotate: 16, opacity: 0.7 },
  { id: 'docker', src: dockerLogo, alt: 'Docker', top: '18%', left: '82%', size: 70, rotate: 20, opacity: 0.75 },
  { id: 'figma', src: figmaLogo, alt: 'Figma', top: '60%', left: '79%', size: 72, rotate: -16, opacity: 0.72 },
  { id: 'vscode', src: vscodeLogo, alt: 'VS Code', top: '42%', left: '86%', size: 58, rotate: 12, opacity: 0.66 },
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

      <div className="absolute inset-0">
        {toolDroplets.map((droplet) => (
          <motion.img
            key={droplet.id}
            src={droplet.src}
            alt={droplet.alt}
            className="absolute object-contain opacity-80 mix-blend-screen"
            style={{
              top: droplet.top,
              left: droplet.left,
              width: `${droplet.size}px`,
              height: `${droplet.size}px`,
              opacity: droplet.opacity,
              rotate: `${droplet.rotate}deg`,
              borderRadius: '42% 58% 59% 41% / 40% 41% 59% 60%',
              filter: 'drop-shadow(0 20px 26px rgba(16, 24, 40, 0.45))',
              background: 'transparent',
            }}
            animate={shouldReduceMotion ? undefined : { y: [0, -12, 0], x: [0, 4, 0], rotate: [droplet.rotate, droplet.rotate + 5, droplet.rotate] }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 9 + droplet.size / 18, repeat: Infinity, ease: 'easeInOut' }}
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

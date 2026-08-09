import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import MagneticButton from '../MagneticButton'
import SpaceBackground from '../SpaceBackground'

function ServicesHero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <SpaceBackground />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">Our Services</p>
          <h1 className="text-[clamp(3.1rem,7vw,7rem)] font-semibold uppercase leading-[0.86] tracking-[-0.06em] text-white">
            WE TURN
            <br />
            IDEAS INTO
            <br />
            EXPERIENCES.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
            From software and digital products to brand identities and visual storytelling, CODE combines technology and creativity to help organizations move forward.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <MagneticButton className="justify-center px-6 py-3.5 text-[11px] uppercase tracking-[0.3em]">
              Start a project
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton className="justify-center px-6 py-3.5 text-[11px] uppercase tracking-[0.3em]">
              View our work
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: 0.1 }}
          className="relative"
        >
          <div className="relative mx-auto aspect-square w-full max-w-[520px] rounded-[2.2rem] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-[0_0_120px_rgba(98,110,255,0.12)]">
            <div className="absolute inset-4 rounded-[1.7rem] border border-white/10" />
            <div className="absolute inset-12 rounded-full border border-white/10" />
            <div className="absolute inset-20 rounded-full border border-white/[0.08]" />

            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-[0_0_28px_rgba(255,255,255,0.8)]" />

            <motion.div
              className="absolute left-1/2 top-1/2 h-[64%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
              animate={shouldReduceMotion ? undefined : { rotate: 360 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 26, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08]"
              animate={shouldReduceMotion ? undefined : { rotate: -360 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 18, repeat: Infinity, ease: 'linear' }}
            />

            {[...Array(8)].map((_, index) => {
              const angle = (index / 8) * Math.PI * 2
              const radius = 150
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius
              return (
                <motion.div
                  key={index}
                  className="absolute h-3 w-3 rounded-full border border-white/20 bg-white/10"
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  animate={shouldReduceMotion ? undefined : { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 2.8 + index * 0.3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
                />
              )
            })}

            <div className="absolute left-[14%] top-[18%] h-20 w-20 rounded-[1.5rem] border border-white/15 bg-white/[0.02]" />
            <div className="absolute bottom-[18%] right-[12%] h-24 w-24 rounded-[2rem] border border-white/15 bg-white/[0.02]" />
            <div className="absolute left-[22%] top-[32%] h-1 w-24 bg-gradient-to-r from-white/20 via-white/60 to-transparent" />
            <div className="absolute bottom-[30%] right-[18%] h-1 w-24 bg-gradient-to-r from-transparent via-white/55 to-white/20" />

            <div className="absolute left-[16%] top-[22%] rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[0.56rem] uppercase tracking-[0.32em] text-white/60">
              SOFTWARE
            </div>
            <div className="absolute right-[14%] top-[24%] rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[0.56rem] uppercase tracking-[0.32em] text-white/60">
              DESIGN
            </div>
            <div className="absolute bottom-[18%] left-[18%] rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[0.56rem] uppercase tracking-[0.32em] text-white/60">
              MEDIA
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesHero

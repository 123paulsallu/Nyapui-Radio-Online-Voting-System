import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import MagneticButton from './MagneticButton'
import SpaceBackground from './SpaceBackground'

function Hero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <SpaceBackground />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
        <motion.div
          className="max-w-3xl"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={shouldReduceMotion ? { duration: 0.2 } : { duration: 0.8, ease: 'easeOut' }}
        >
          <motion.p
            className="mb-5 text-sm uppercase tracking-[0.42em] text-white/55"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Technology • Design • Strategy
          </motion.p>

          <motion.h1
            className="text-[clamp(3.1rem,8vw,7.4rem)] font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-white"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
          >
            CRAFTING OUR
            <br />
            DIGITAL EXPERIENCE.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.7 }}
          >
            Technology and creativity engineered into digital experiences that help businesses, startups, and institutions move forward.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.7 }}
          >
            <MagneticButton className="w-full justify-center px-6 py-3.5 text-[11px] uppercase tracking-[0.3em] sm:w-auto">
              Start a project
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>

            <MagneticButton className="w-full justify-center px-6 py-3.5 text-[11px] uppercase tracking-[0.3em] sm:w-auto">
              Explore our work
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative mx-auto flex w-full max-w-[430px] items-center justify-center"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle,rgba(132,145,255,0.2),transparent_72%)] blur-3xl" />

          <motion.div
            className="relative flex h-[300px] w-[300px] items-center justify-center rounded-full border border-white/10 bg-white/[0.03] shadow-[0_0_120px_rgba(255,255,255,0.04)] sm:h-[360px] sm:w-[360px]"
            animate={shouldReduceMotion ? undefined : { rotate: [0, 360] }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-6 rounded-full border border-white/15" />
            <div className="absolute inset-12 rounded-full border border-white/[0.1]" />
            <div className="absolute inset-20 rounded-full border border-white/[0.08]" />

            <motion.div
              className="absolute left-[15%] top-[18%] h-2.5 w-2.5 rounded-full bg-white/90 shadow-[0_0_18px_rgba(255,255,255,0.8)]"
              animate={shouldReduceMotion ? undefined : { y: [0, -10, 0], x: [0, 8, 0] }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-[18%] right-[15%] h-2 w-2 rounded-full bg-white/70"
              animate={shouldReduceMotion ? undefined : { y: [0, 10, 0], x: [0, -6, 0] }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/[0.05] text-xs font-semibold uppercase tracking-[0.38em] text-white/90 backdrop-blur">
              CODE
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

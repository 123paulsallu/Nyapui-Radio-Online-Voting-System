import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import MagneticButton from '../MagneticButton'
import SpaceBackground from '../SpaceBackground'

function AboutHero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative isolate flex min-h-[85vh] items-center overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <SpaceBackground />

      <div className="relative mx-auto w-full max-w-7xl py-10">
        <motion.div
          className="max-w-4xl"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.p
            className="mb-5 text-[0.72rem] uppercase tracking-[0.42em] text-white/55"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6 }}
          >
            About CODE
          </motion.p>

          <motion.h1
            className="max-w-5xl text-[clamp(3rem,7vw,6.6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.05em] text-white"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.8 }}
          >
            WE BUILD
            <br />
            WHAT&apos;S NEXT.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7 }}
          >
            CODE is a technology and creative digital solutions company helping businesses, startups and institutions turn ambitious ideas into meaningful digital experiences.
          </motion.p>

          <motion.p
            className="mt-4 max-w-2xl text-base leading-8 text-white/60"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.7 }}
          >
            From software engineering and digital products to branding, photography and visual storytelling, we bring technology and creativity together.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-4 sm:flex-row"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <MagneticButton className="w-full justify-center px-6 py-3.5 text-[11px] uppercase tracking-[0.3em] sm:w-auto">
              Start a project
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-2"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.7 }}
        >
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <p className="text-4xl font-semibold tracking-[-0.04em] text-white">10+</p>
            <p className="mt-2 text-sm uppercase tracking-[0.28em] text-white/55">Projects</p>
          </div>
          <div className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <p className="text-4xl font-semibold tracking-[-0.04em] text-white">8</p>
            <p className="mt-2 text-sm uppercase tracking-[0.28em] text-white/55">Capabilities</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutHero

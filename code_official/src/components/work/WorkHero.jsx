import { motion, useReducedMotion } from 'framer-motion'
import SpaceBackground from '../SpaceBackground'

function WorkHero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative isolate flex min-h-[76vh] items-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <SpaceBackground />

      <div className="relative mx-auto w-full max-w-7xl py-12">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">Selected Work</p>
          <h1 className="text-[clamp(3rem,7vw,6.6rem)] font-semibold uppercase leading-[0.88] tracking-[-0.06em] text-white">
            IDEAS
            <br />
            WE&apos;VE TURNED
            <br />
            INTO EXPERIENCES.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
            A selection of digital products, platforms, brands and creative projects we&apos;ve helped bring to life.
          </p>

          <motion.div
            className="mt-8 flex items-center gap-3 text-[0.62rem] font-medium uppercase tracking-[0.38em] text-white/55"
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.5 }}
          >
            <span className="inline-flex h-px w-10 bg-white/25" />
            TECHNOLOGY × DESIGN × MEDIA
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default WorkHero

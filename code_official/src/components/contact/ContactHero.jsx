import { motion, useReducedMotion } from 'framer-motion'
import SpaceBackground from '../SpaceBackground'

function ContactHero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative isolate flex min-h-[76vh] items-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <SpaceBackground />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">Start a Project</p>
          <h1 className="text-[clamp(3rem,7vw,6.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.06em] text-white">
            LET&apos;S BUILD
            <br />
            SOMETHING
            <br />
            MEANINGFUL.
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
            Have an idea, a challenge or a project in mind? Tell us what you&apos;re building and let&apos;s explore what CODE can create with you.
          </p>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.12 }}
          className="relative mx-auto w-full max-w-[480px]"
        >
          <div className="relative aspect-square rounded-[2.2rem] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-[0_0_120px_rgba(98,110,255,0.12)]">
            <div className="absolute inset-4 rounded-[1.7rem] border border-white/10" />
            <div className="absolute inset-12 rounded-full border border-white/10" />
            <div className="absolute inset-20 rounded-full border border-white/[0.08]" />

            {[...Array(9)].map((_, index) => {
              const angle = (index / 9) * Math.PI * 2
              const radius = 130
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius
              return (
                <motion.div
                  key={index}
                  className="absolute h-3 w-3 rounded-full border border-white/15 bg-white/20"
                  style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
                  animate={shouldReduceMotion ? undefined : { scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 2.8 + index * 0.25, repeat: Infinity, ease: 'easeInOut', delay: index * 0.18 }}
                />
              )
            })}

            <div className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.03]" />
            <div className="absolute left-[16%] top-[22%] h-16 w-16 rounded-full border border-white/10" />
            <div className="absolute bottom-[18%] right-[18%] h-20 w-20 rounded-full border border-white/10" />
            <div className="absolute left-[22%] top-[34%] h-px w-20 bg-gradient-to-r from-white/15 via-white/60 to-transparent" />
            <div className="absolute bottom-[28%] right-[18%] h-px w-20 bg-gradient-to-r from-transparent via-white/60 to-white/15" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactHero

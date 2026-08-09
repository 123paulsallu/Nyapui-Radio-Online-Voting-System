import { motion, useReducedMotion } from 'framer-motion'
import SpaceBackground from '../SpaceBackground'

function ContactHero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <SpaceBackground />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 py-10 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">Start a Project</p>
          <h1 className="text-[clamp(3rem,7vw,6.8rem)] font-semibold uppercase leading-[0.88] tracking-[-0.06em] text-white">
            LET&apos;S BUILD
            <br />
            SOMETHING
            <br />
            MEANINGFUL.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
            Have an idea, a challenge or a project in mind? Tell us what you&apos;re building and let&apos;s explore what CODE can create with you.
          </p>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.08 }}
          className="relative mx-auto w-full max-w-[500px]"
        >
          <div className="relative aspect-square rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl shadow-[0_0_120px_rgba(98,110,255,0.12)]">
            <div className="absolute inset-5 rounded-[1.5rem] border border-white/10" />
            <div className="absolute inset-12 rounded-full border border-white/10" />
            <div className="absolute inset-20 rounded-full border border-white/[0.08]" />

            <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_28px_rgba(255,255,255,0.65)]" />

            <div className="absolute left-[18%] top-[20%] h-16 w-16 rounded-full border border-white/10" />
            <div className="absolute right-[18%] top-[28%] h-20 w-20 rounded-full border border-white/10" />
            <div className="absolute bottom-[18%] left-[18%] h-20 w-20 rounded-[1.5rem] border border-white/10" />
            <div className="absolute bottom-[24%] right-[16%] h-12 w-12 rounded-full border border-white/10" />

            <div className="absolute left-[14%] top-[30%] h-px w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <div className="absolute bottom-[34%] right-[12%] h-px w-24 bg-gradient-to-r from-transparent via-white/60 to-transparent" />

            <div className="absolute left-[22%] top-[18%] rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[0.56rem] uppercase tracking-[0.32em] text-white/60">
              IDEATE
            </div>
            <div className="absolute right-[20%] bottom-[22%] rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[0.56rem] uppercase tracking-[0.32em] text-white/60">
              BUILD
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactHero

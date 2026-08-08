import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import MagneticButton from './MagneticButton'

function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,135,255,0.14),transparent_45%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:70px_70px]" />

      <motion.div
        className="relative mx-auto flex max-w-7xl flex-col items-start rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-12 backdrop-blur-xl sm:px-10 lg:px-16 lg:py-16"
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.7 }}
      >
        <div className="absolute inset-0 rounded-[2rem] border border-white/10" />
        <div className="absolute inset-8 rounded-[1.5rem] border border-white/[0.06]" />

        <motion.p
          className="text-[0.7rem] font-medium uppercase tracking-[0.42em] text-white/55"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ delay: 0.08, duration: 0.6 }}
        >
          Launch with CODE
        </motion.p>

        <motion.h2
          className="mt-5 max-w-4xl text-[clamp(2.2rem,4.4vw,3.8rem)] font-semibold uppercase leading-[0.92] tracking-[-0.03em] text-white"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: 0.12, duration: 0.7 }}
        >
          HAVE AN IDEA?
          <br />
          LET&apos;S BUILD IT.
        </motion.h2>

        <motion.p
          className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ delay: 0.16, duration: 0.7 }}
        >
          From the first idea to the final experience, CODE turns ambitious ideas into digital reality.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <MagneticButton className="justify-center px-6 py-3.5 text-[11px] uppercase tracking-[0.3em]">
            Start a project
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton className="justify-center px-6 py-3.5 text-[11px] uppercase tracking-[0.3em]">
            Talk to us
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default CTA

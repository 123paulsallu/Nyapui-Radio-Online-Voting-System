import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import MagneticButton from '../MagneticButton'

function WorkCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.25 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(120,135,255,0.12),transparent_38%)]" />

      <motion.div
        className="relative mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl sm:p-10 lg:p-14"
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-4xl">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">Let&apos;s create together</p>
          <h2 className="mt-5 text-[clamp(2.2rem,4vw,4rem)] font-semibold uppercase leading-[0.94] tracking-[-0.04em] text-white">
            YOUR PROJECT
            <br />
            COULD BE NEXT.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
            Have an idea that deserves to exist? Let&apos;s build the experience around it.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MagneticButton className="justify-center px-6 py-3.5 text-[11px] uppercase tracking-[0.3em]">
            Start a project
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton className="justify-center px-6 py-3.5 text-[11px] uppercase tracking-[0.3em]">
            Talk to CODE
            <ArrowUpRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  )
}

export default WorkCTA

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import MagneticButton from '../MagneticButton'

function AboutCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,135,255,0.12),transparent_40%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />

      <motion.div
        className="relative mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl sm:p-10 lg:p-14"
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-4xl">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">Let&apos;s build together</p>
          <h2 className="mt-5 text-[clamp(2.1rem,4vw,3.8rem)] font-semibold uppercase leading-[0.94] tracking-[-0.04em] text-white">
            READY TO BUILD
            <br />
            SOMETHING?
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
            Tell us what you&apos;re imagining. We&apos;ll help turn it into something real.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <MagneticButton className="justify-center px-6 py-3.5 text-[11px] uppercase tracking-[0.3em]">
            Start a project
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
          <MagneticButton className="justify-center px-6 py-3.5 text-[11px] uppercase tracking-[0.3em]">
            Explore our work
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  )
}

export default AboutCTA

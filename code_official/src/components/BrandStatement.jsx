import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

function BrandStatement() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.35 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:70px_70px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(102,122,255,0.08),transparent_60%)]" />

      <motion.div
        className="relative mx-auto flex max-w-7xl flex-col gap-10"
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.div
          className="flex flex-wrap items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.42em] text-white/55"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ delay: 0.08, duration: 0.6 }}
        >
          <span>Technology</span>
          <span className="text-white/30">×</span>
          <span>Creativity</span>
          <span className="text-white/30">×</span>
          <span>Impact</span>
        </motion.div>

        <motion.h2
          className="max-w-5xl text-[clamp(2rem,4vw,3.5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-white sm:text-[clamp(2.4rem,5.5vw,4.2rem)]"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.12, duration: 0.7 }}
        >
          We combine engineering, design and visual storytelling to create digital experiences that are built to perform and designed to matter.
        </motion.h2>

        <motion.p
          className="max-w-3xl text-base leading-8 text-white/65 sm:text-lg"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          CODE shapes thoughtful digital environments for ambitious organisations, blending strategy, product thinking and elegant execution into experiences that feel precise and lasting.
        </motion.p>
      </motion.div>
    </section>
  )
}

export default BrandStatement

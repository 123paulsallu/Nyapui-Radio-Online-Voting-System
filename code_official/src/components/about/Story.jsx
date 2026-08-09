import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import PeopleShadow from '../PeopleShadow'

function Story() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.25 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute right-[-3%] top-[18%] hidden h-[300px] w-[240px] lg:block">
        <PeopleShadow className="h-full w-full" variant="soft" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">Our Story</p>
          <h2 className="max-w-lg text-[clamp(2.2rem,4vw,3.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em] text-white">
            IDEAS DESERVE
            <br />
            TO BECOME REAL.
          </h2>
        </motion.div>

        <motion.div
          className="space-y-6 text-base leading-8 text-white/68 sm:text-lg"
          initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
          transition={{ duration: 0.8 }}
        >
          <p>
            CODE was created around a simple belief: technology should not only work — it should create meaningful experiences.
          </p>
          <p>
            Businesses and organizations often have powerful ideas but need the right combination of technology, design and creativity to bring those ideas to life.
          </p>
          <p>
            That&apos;s where CODE comes in. We combine software engineering, product thinking, design and visual storytelling to create digital solutions that are useful, distinctive and built for real people.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default Story

import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const steps = [
  {
    number: '01',
    title: 'Discover',
    text: 'We understand your goals, audience and challenges.',
  },
  {
    number: '02',
    title: 'Plan',
    text: 'We define the right strategy, scope and direction.',
  },
  {
    number: '03',
    title: 'Create',
    text: 'Our technology and creative teams design and build the experience.',
  },
  {
    number: '04',
    title: 'Deliver',
    text: 'We launch, refine and help you move forward.',
  },
]

function EngagementProcess() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent lg:block" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">How we deliver</p>
          <h2 className="text-[clamp(2.4rem,4vw,3.8rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em] text-white">
            FROM BRIEF
            <br />
            TO LAUNCH.
          </h2>
        </motion.div>

        <div className="relative mt-12 grid gap-5 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              transition={{ delay: index * 0.08, duration: 0.6 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.68rem] font-medium uppercase tracking-[0.38em] text-white/45">{step.number}</span>
                <span className="h-2 w-2 rounded-full bg-white/70" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold uppercase tracking-[-0.03em] text-white">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/65">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default EngagementProcess

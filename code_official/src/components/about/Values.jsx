import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const values = [
  { number: '01', title: 'Creativity', text: 'We approach problems with curiosity and imagination.' },
  { number: '02', title: 'Innovation', text: 'We continuously explore better ways to build and create.' },
  { number: '03', title: 'Quality', text: 'We care about the details that make experiences exceptional.' },
  { number: '04', title: 'Collaboration', text: 'Great digital experiences are built by great teams.' },
  { number: '05', title: 'Impact', text: 'We build with real people, problems and outcomes in mind.' },
  { number: '06', title: 'Integrity', text: 'We believe trust is the foundation of meaningful partnerships.' },
]

function Values() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,135,255,0.06),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">What drives us</p>
          <h2 className="text-[clamp(2.1rem,3.8vw,2.9rem)] font-semibold uppercase leading-[0.94] tracking-[-0.04em] text-white">
            WHAT DRIVES US
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {values.map((value, index) => (
            <motion.div
              key={value.number}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ delay: 0.06 * index, duration: 0.6 }}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.38em] text-white/45">{value.number}</p>
                <div className="h-px flex-1 bg-white/10 ml-4" />
              </div>
              <h3 className="mt-5 text-xl font-semibold uppercase tracking-[-0.03em] text-white">{value.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">{value.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Values

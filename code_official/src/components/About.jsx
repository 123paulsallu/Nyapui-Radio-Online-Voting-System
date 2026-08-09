import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const stats = [
  { value: '10+', label: 'Projects' },
  { value: '8', label: 'Creative & Technology Services' },
  { value: '∞', label: 'Ideas We Can Build' },
]

function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(120,135,255,0.08),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.04),transparent_20%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        <motion.div
          className="max-w-2xl"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.42em] text-white/55">About CODE® Official</p>
          <h2 className="text-[clamp(2.1rem,4vw,3.3rem)] font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-white">
            WE BUILD
            <br />
            WHAT&apos;S NEXT.
          </h2>
          <p className="mt-6 text-base leading-8 text-white/65 sm:text-lg">
            CODE® Official is a technology and creative digital solutions company helping businesses, startups and institutions transform ideas into meaningful digital experiences.
          </p>
          <p className="mt-5 text-base leading-8 text-white/65 sm:text-lg">
            From software and digital platforms to visual identities, photography and video, we bring engineering and creativity together to solve problems, tell stories and create experiences that move people.
          </p>
        </motion.div>

        <motion.div
          className="relative mx-auto flex w-full max-w-[480px] items-center justify-center"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ delay: 0.1, duration: 0.7 }}
        >
          <div className="absolute inset-4 rounded-full border border-white/10" />
          <div className="absolute inset-12 rounded-full border border-white/[0.08]" />
          <div className="absolute inset-24 rounded-full border border-white/[0.06]" />
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(120,135,255,0.14),transparent_72%)] blur-3xl" />

          <motion.div
            className="relative flex h-[300px] w-[300px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl sm:h-[360px] sm:w-[360px]"
            animate={shouldReduceMotion ? undefined : { rotate: [0, 6, -4, 0] }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="absolute inset-8 rounded-[1.5rem] border border-white/10" />
            <div className="absolute inset-16 rounded-full border border-white/10" />
            <div className="absolute left-[22%] top-[18%] h-2.5 w-2.5 rounded-full bg-white/80" />
            <div className="absolute bottom-[26%] right-[22%] h-2.5 w-2.5 rounded-full bg-white/70" />
            <div className="absolute inset-x-6 bottom-8 h-1 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute inset-y-6 left-8 w-1 rounded-full bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            <div className="text-center text-[0.7rem] font-medium uppercase tracking-[0.42em] text-white/70">
              Digital Object
              <br />
              In Motion
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-7xl gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] px-6 py-6 backdrop-blur-xl"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: 0.08 * index, duration: 0.6 }}
          >
            <p className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{stat.value}</p>
            <p className="mt-2 text-sm leading-7 text-white/60">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default About

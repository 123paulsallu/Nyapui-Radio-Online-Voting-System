import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Compass, PenTool, Rocket, Sparkles } from 'lucide-react'

const stages = [
  { number: '01', title: 'Discover', description: 'Understand the idea, challenge and opportunity.', icon: Compass },
  { number: '02', title: 'Design', description: 'Turn ideas into intuitive, engaging experiences.', icon: PenTool },
  { number: '03', title: 'Build', description: 'Engineer reliable digital products with purpose.', icon: Rocket },
  { number: '04', title: 'Launch', description: 'Deliver, refine and help your experience grow.', icon: Sparkles },
]

function Process() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,135,255,0.07),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="max-w-3xl"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.65 }}
        >
          <p className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.42em] text-white/55">How we work</p>
          <h2 className="text-[clamp(2rem,3.6vw,2.8rem)] font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-white">
            FROM IDEA
            <br />
            TO IMPACT.
          </h2>
        </motion.div>

        <div className="mt-12 hidden lg:grid lg:grid-cols-4 lg:gap-6">
          {stages.map((stage, index) => {
            const Icon = stage.icon
            return (
              <motion.div
                key={stage.title}
                className="relative"
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.08 * index, duration: 0.6 }}
              >
                <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
                <div className="relative rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-[0.7rem] font-medium uppercase tracking-[0.4em] text-white/45">{stage.number}</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{stage.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/64">{stage.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-10 flex flex-col gap-4 lg:hidden">
          {stages.map((stage, index) => {
            const Icon = stage.icon
            return (
              <motion.div
                key={stage.title}
                className="rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.05 * index, duration: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[0.7rem] font-medium uppercase tracking-[0.4em] text-white/45">{stage.number}</p>
                    <h3 className="text-lg font-semibold text-white">{stage.title}</h3>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/64">{stage.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Process

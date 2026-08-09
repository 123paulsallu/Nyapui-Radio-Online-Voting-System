import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const categories = [
  {
    title: 'Technology',
    items: ['Software', 'Web', 'Mobile'],
    accent: 'from-white/15 via-violet-400/30 to-transparent',
  },
  {
    title: 'Experience',
    items: ['UI/UX', 'Product Design'],
    accent: 'from-white/15 via-cyan-400/30 to-transparent',
  },
  {
    title: 'Brand',
    items: ['Identity', 'Graphic Design'],
    accent: 'from-white/15 via-pink-400/30 to-transparent',
  },
  {
    title: 'Media',
    items: ['Photography', 'Videography', 'Digital Content'],
    accent: 'from-white/15 via-blue-400/30 to-transparent',
  },
]

function ServiceDetail() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(120,135,255,0.08),transparent_38%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <p className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">Capability matrix</p>
          <h2 className="text-[clamp(2.4rem,4vw,3.8rem)] font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-white">
            WE BUILD ACROSS
            <br />
            THE DIGITAL SPECTRUM.
          </h2>
        </motion.div>

        <div className="relative mt-12 rounded-[2rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl lg:p-8">
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:42px_42px]" />

          <div className="relative grid gap-4 lg:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                className="relative min-h-[220px] rounded-[1.5rem] border border-white/10 bg-black/20 p-5"
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                transition={{ delay: index * 0.08, duration: 0.7 }}
              >
                <div className={`absolute inset-x-4 top-0 h-px bg-gradient-to-r ${category.accent}`} />
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.38em] text-white/55">{category.title}</p>
                <div className="mt-8 space-y-3">
                  {category.items.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-white/80" />
                      <span className="text-base text-white/75">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServiceDetail

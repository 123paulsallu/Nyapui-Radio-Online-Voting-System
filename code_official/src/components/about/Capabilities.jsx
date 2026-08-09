import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const groups = [
  {
    title: 'Technology',
    items: ['Software Development', 'Web Development', 'Mobile Development', 'Digital Platforms'],
  },
  {
    title: 'Experience',
    items: ['UI/UX Design', 'Product Design', 'User Research', 'Interaction Design'],
  },
  {
    title: 'Brand',
    items: ['Brand Identity', 'Graphic Design', 'Visual Systems', 'Creative Direction'],
  },
  {
    title: 'Media',
    items: ['Photography', 'Videography', 'Digital Media', 'Visual Storytelling'],
  },
]

function Capabilities() {
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
          <p className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">Our capabilities</p>
          <h2 className="text-[clamp(2.1rem,3.8vw,2.9rem)] font-semibold uppercase leading-[0.94] tracking-[-0.04em] text-white">
            TECHNOLOGY
            <br />
            MEETS CREATIVITY.
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {groups.map((group, index) => (
            <motion.div
              key={group.title}
              className="relative rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ delay: 0.08 * index, duration: 0.7 }}
            >
              <div className="mb-5 h-px w-full bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.38em] text-white/55">{group.title}</p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-white/65">
                {group.items.map((item) => (
                  <li key={item} className="border-b border-white/8 pb-2 last:border-b-0 last:pb-0">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Capabilities

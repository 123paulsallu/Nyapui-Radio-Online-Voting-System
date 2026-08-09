import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Compass, Eye } from 'lucide-react'

const panels = [
  {
    title: 'Mission',
    icon: Compass,
    text: 'To empower businesses, startups and institutions with technology and creative solutions that solve problems, improve experiences and create lasting value.',
  },
  {
    title: 'Vision',
    icon: Eye,
    text: 'To become a leading African technology and creative company shaping how people, businesses and organizations experience the digital world.',
  },
]

function MissionVision() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,135,255,0.06),transparent_60%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        {panels.map((panel, index) => {
          const Icon = panel.icon
          return (
            <motion.article
              key={panel.title}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8"
              whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              whileInView={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'linear-gradient(135deg, rgba(120,135,255,0.12), rgba(255,255,255,0.02))' }} />
              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-white/55 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">{panel.title}</p>
                <p className="mt-6 text-[clamp(1.2rem,2vw,1.9rem)] leading-[1.2] text-white/90">
                  {panel.text}
                </p>
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

export default MissionVision

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Camera, Code2, Globe2, MonitorPlay, Palette, PenTool, Smartphone, Video } from 'lucide-react'
import { useState } from 'react'

const services = [
  {
    number: '01',
    title: 'Software Development',
    description: 'Build reliable custom software tailored to real business and organizational needs.',
    capabilities: ['Custom Software', 'Business Applications', 'Management Systems', 'APIs & Integrations', 'Automation'],
    icon: Code2,
  },
  {
    number: '02',
    title: 'Web Development',
    description: 'Create fast, responsive and modern websites that represent organizations professionally.',
    capabilities: ['Corporate Websites', 'Organization Websites', 'Landing Pages', 'Web Applications', 'E-commerce'],
    icon: Globe2,
  },
  {
    number: '03',
    title: 'Mobile Development',
    description: 'Build intuitive mobile experiences that connect organizations with their audiences.',
    capabilities: ['Android Applications', 'iOS Applications', 'Cross-platform Applications', 'Mobile UI', 'App Prototyping'],
    icon: Smartphone,
  },
  {
    number: '04',
    title: 'UI/UX Design',
    description: 'Design experiences that are intuitive, accessible and visually compelling.',
    capabilities: ['User Research', 'Wireframes', 'Prototyping', 'Interface Design', 'Design Systems'],
    icon: PenTool,
  },
  {
    number: '05',
    title: 'Branding & Graphic Design',
    description: 'Build distinctive identities that help organizations communicate with confidence.',
    capabilities: ['Brand Strategy', 'Logo Design', 'Visual Identity', 'Marketing Materials', 'Social Media Design'],
    icon: Palette,
  },
  {
    number: '06',
    title: 'Photography',
    description: 'Capture people, products, events and stories through professional photography.',
    capabilities: ['Corporate Photography', 'Event Photography', 'Product Photography', 'Portraits', 'Documentary Photography'],
    icon: Camera,
  },
  {
    number: '07',
    title: 'Videography',
    description: 'Create compelling visual stories for brands, organizations and campaigns.',
    capabilities: ['Corporate Videos', 'Event Coverage', 'Interviews', 'Promotional Videos', 'Social Media Content'],
    icon: Video,
  },
  {
    number: '08',
    title: 'Digital Media',
    description: 'Help organizations communicate and grow through digital content and media.',
    capabilities: ['Digital Campaigns', 'Social Media Content', 'Content Strategy', 'Creative Production', 'Digital Storytelling'],
    icon: MonitorPlay,
  },
]

function ServiceOverview() {
  const shouldReduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,135,255,0.06),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="mb-10 max-w-3xl"
        >
          <p className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">What we do</p>
          <h2 className="text-[clamp(2.3rem,4vw,3.8rem)] font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-white">
            ONE TEAM.
            <br />
            MULTIPLE
            <br />
            DISCIPLINES.
          </h2>
        </motion.div>

        <div className="space-y-4">
          {services.map((service, index) => {
            const Icon = service.icon
            const isActive = activeIndex === index

            return (
              <motion.article
                key={service.title}
                className={`group relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl transition-all duration-300 md:p-7 ${
                  isActive ? 'border-white/20 bg-white/[0.04]' : 'hover:border-white/15 hover:bg-white/[0.03]'
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: index * 0.04 }}
                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
              >
                <div
                  className={`absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-white/80 to-transparent transition-all duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <div className="grid gap-5 md:grid-cols-[90px_1fr_1.2fr] md:items-center">
                  <div className="flex items-center justify-between md:block">
                    <div className="text-[0.68rem] font-medium uppercase tracking-[0.38em] text-white/45">{service.number}</div>
                    <div className="mt-0 md:mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/75 transition-transform duration-300 group-hover:scale-110 md:h-12 md:w-12">
                      <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[clamp(1.2rem,2.4vw,2.4rem)] font-semibold uppercase leading-[0.96] tracking-[-0.04em] text-white">
                      {service.title}
                    </h3>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-sm leading-7 text-white/68 md:text-base">{service.description}</p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {service.capabilities.map((capability) => (
                          <span
                            key={capability}
                            className={`rounded-full border px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.18em] transition-all duration-300 ${
                              isActive
                                ? 'border-white/20 bg-white/8 text-white/80'
                                : 'border-white/10 bg-transparent text-white/45'
                            }`}
                          >
                            {capability}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 md:flex">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ServiceOverview

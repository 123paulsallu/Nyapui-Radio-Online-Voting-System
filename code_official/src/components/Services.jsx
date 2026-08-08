import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Camera, Code2, Globe2, MonitorPlay, Palette, PenTool, Smartphone, Video } from 'lucide-react'
import ServiceCard from './ServiceCard'

const services = [
  { number: '01', title: 'Software Development', description: 'Build reliable digital products and custom software designed around real business needs.', icon: Code2 },
  { number: '02', title: 'Web Development', description: 'Modern, responsive websites that turn ideas into powerful digital experiences.', icon: Globe2 },
  { number: '03', title: 'Mobile Applications', description: 'User-focused mobile experiences designed for today’s connected world.', icon: Smartphone },
  { number: '04', title: 'UI/UX Design', description: 'Interfaces that are intuitive, beautiful and built around the people who use them.', icon: PenTool },
  { number: '05', title: 'Branding & Graphic Design', description: 'Visual identities that give organizations a distinctive and memorable presence.', icon: Palette },
  { number: '06', title: 'Photography', description: 'Professional visual storytelling that captures people, products and moments.', icon: Camera },
  { number: '07', title: 'Videography', description: 'Cinematic visual content for brands, organizations and digital campaigns.', icon: Video },
  { number: '08', title: 'Digital Media', description: 'Creative digital content that helps organizations communicate and connect.', icon: MonitorPlay },
]

function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:70px_70px]" />
      <div className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-white/10 lg:block" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-12">
        <motion.div
          className="max-w-3xl"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.42em] text-white/55">What we create</p>
          <h2 className="text-[clamp(2rem,3.6vw,2.8rem)] font-semibold tracking-[-0.03em] text-white">Technology meets creativity.</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            From software and digital products to visual identities and media, CODE brings technology and creativity together under one roof.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.05 * index, duration: 0.6 }}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services

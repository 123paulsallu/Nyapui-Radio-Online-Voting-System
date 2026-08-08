import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import ProjectCard from './ProjectCard'

const projects = [
  {
    number: '01',
    category: 'Digital Platform / Software',
    title: 'MEAL Platform',
    description: 'An intelligent monitoring, evaluation, accountability and learning platform designed for modern organizations.',
    image: '/images/meal-platform.jpg',
    alt: 'Abstract platform interface preview',
  },
  {
    number: '02',
    category: 'Digital Media / Mobile',
    title: 'Nyapui Radio',
    description: 'A modern digital radio experience connecting audiences with programs, stories and community voices.',
    image: '/images/nyapui-radio.jpg',
    alt: 'Abstract audio and media experience preview',
  },
  {
    number: '03',
    category: 'Education / Digital Platform',
    title: 'ETU eLibrary',
    description: 'A digital learning and resource platform designed to make educational materials easier to access.',
    image: '/images/etu-elibrary.jpg',
    alt: 'Educational platform preview',
  },
  {
    number: '04',
    category: 'Branding / Creative',
    title: 'CODE Brand System',
    description: 'The visual identity and digital experience behind CODE.',
    image: '/images/code-brand.jpg',
    alt: 'Brand identity system preview',
  },
]

function FeaturedWork() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(102,122,255,0.08),transparent_55%)]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-12">
        <motion.div
          className="max-w-3xl"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-[0.7rem] font-medium uppercase tracking-[0.42em] text-white/55">Selected work</p>
          <h2 className="text-[clamp(2rem,3.5vw,2.8rem)] font-semibold tracking-[-0.03em] text-white">Ideas we&apos;ve turned into experiences.</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            A selection of digital products, platforms, brands and creative projects we&apos;ve helped bring to life.
          </p>
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ delay: 0.08 * index, duration: 0.7 }}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedWork

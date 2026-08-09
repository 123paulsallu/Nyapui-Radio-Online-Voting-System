import { motion, useReducedMotion } from 'framer-motion'
import AboutCTA from '../components/about/AboutCTA'
import AboutHero from '../components/about/AboutHero'
import Capabilities from '../components/about/Capabilities'
import MissionVision from '../components/about/MissionVision'
import Story from '../components/about/Story'
import Values from '../components/about/Values'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function Philosophy() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,135,255,0.07),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          className="max-w-4xl"
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">How we think</p>
          <h2 className="text-[clamp(2.2rem,4vw,3.5rem)] font-semibold uppercase leading-[0.93] tracking-[-0.04em] text-white">
            WE DON&apos;T JUST
            <br />
            BUILD THINGS.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {['UNDERSTAND', 'DESIGN', 'BUILD'].map((stage, index) => (
            <motion.div
              key={stage}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              whileInView={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08, duration: 0.6 }}
            >
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/45">0{index + 1}</p>
              <p className="mt-5 text-2xl font-semibold uppercase tracking-[-0.03em] text-white">{stage}</p>
              <p className="mt-4 text-sm leading-7 text-white/65">
                {index === 0 && 'We understand the problem first.'}
                {index === 1 && 'Then we design the experience.'}
                {index === 2 && 'Then we build the technology.'}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04070b] text-white">
      <Navbar />
      <AboutHero />
      <Story />
      <MissionVision />
      <Values />
      <Capabilities />
      <Philosophy />
      <AboutCTA />
      <Footer />
    </div>
  )
}

export default AboutPage

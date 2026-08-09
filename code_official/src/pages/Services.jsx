import { motion, useReducedMotion } from 'framer-motion'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import EngagementProcess from '../components/services/EngagementProcess'
import ServiceDetail from '../components/services/ServiceDetail'
import ServiceOverview from '../components/services/ServiceOverview'
import ServicesCTA from '../components/services/ServicesCTA'
import ServicesHero from '../components/services/ServicesHero'

const combinations = [
  {
    title: 'Technology + Design',
    text: 'Build products that work beautifully.',
  },
  {
    title: 'Design + Brand',
    text: 'Create identities people remember.',
  },
  {
    title: 'Technology + Media',
    text: 'Turn digital platforms into engaging experiences.',
  },
]

function ServicesPage() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04070b] text-white">
      <Navbar />
      <ServicesHero />
      <ServiceOverview />
      <ServiceDetail />
      <EngagementProcess />

      <section className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(120,135,255,0.07),transparent_32%)]" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <p className="mb-4 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">The power is in the combination</p>
            <h2 className="text-[clamp(2.4rem,4vw,4rem)] font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-white">
              THE POWER IS
              <br />
              IN THE COMBINATION.
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-white/68 sm:text-lg">
              Sometimes a great website needs a brand identity. A digital product needs thoughtful UX. A campaign needs photography and video. CODE brings these disciplines together so your digital presence feels connected from the first impression to the final interaction.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {combinations.map((item, index) => (
              <motion.article
                key={item.title}
                className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                whileInView={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.6 }}
                whileHover={shouldReduceMotion ? undefined : { y: -6 }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.38em] text-white/55">0{index + 1}</p>
                <h3 className="mt-5 text-[clamp(1.4rem,2vw,2rem)] font-semibold uppercase leading-[1] tracking-[-0.04em] text-white">
                  {item.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-white/65">{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <ServicesCTA />
      <Footer />
    </div>
  )
}

export default ServicesPage

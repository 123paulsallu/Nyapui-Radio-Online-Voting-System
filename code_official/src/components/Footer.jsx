import { motion, useReducedMotion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import PeopleShadow from './PeopleShadow'

const exploreLinks = ['Home', 'About', 'Services', 'Work', 'Contact']
const serviceLinks = ['Software Development', 'Web Development', 'Mobile Applications', 'UI/UX Design', 'Branding', 'Photography', 'Videography', 'Digital Media']
const connectLinks = [{ label: 'Email', href: 'mailto:hello@code.studio' }, { label: 'WhatsApp', href: 'https://wa.me/1234567890' }, { label: 'LinkedIn', href: 'https://linkedin.com' }, { label: 'Instagram', href: 'https://instagram.com' }, { label: 'Facebook', href: 'https://facebook.com' }]

function Footer() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const shouldReduceMotion = useReducedMotion()

  return (
    <footer ref={ref} className="relative isolate overflow-hidden border-t border-white/10 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(120,135,255,0.08),transparent_45%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:70px_70px]" />
      <div className="absolute bottom-[-10%] left-[-2%] hidden h-[260px] w-[220px] lg:block">
        <PeopleShadow className="h-full w-full" variant="soft" />
      </div>

      <motion.div
        className="relative mx-auto flex max-w-7xl flex-col gap-12"
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.7 }}
      >
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.42em] text-white/95">CODE® Official</p>
            <p className="mt-4 text-[clamp(1.4rem,3vw,2rem)] font-semibold uppercase leading-[1.02] tracking-[-0.03em] text-white">
              Crafting Our Digital Experience.
            </p>
            <p className="mt-5 max-w-md text-base leading-8 text-white/65">
              Technology, creativity and digital experiences built to move ideas forward.
            </p>
          </div>

          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.42em] text-white/55">Explore</p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {exploreLinks.map((link) => (
                <li key={link}><a href="#" className="transition-colors hover:text-white">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.42em] text-white/55">Services</p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {serviceLinks.map((link) => (
                <li key={link}><a href="#" className="transition-colors hover:text-white">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.42em] text-white/55">Connect</p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {connectLinks.map((link) => (
                <li key={link.label}><a href={link.href} className="transition-colors hover:text-white">{link.label}</a></li>
              ))}
            </ul>
          </div>

          <div className="max-w-2xl">
            <p className="text-[clamp(2rem,4vw,3rem)] font-semibold uppercase leading-[0.95] tracking-[-0.03em] text-white">
              LET&apos;S CREATE
              <br />
              SOMETHING
              <br />
              MEANINGFUL.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 CODE® Official — Crafting Our Digital Experience.</p>
          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-white">Privacy</a>
            <a href="#" className="transition-colors hover:text-white">Terms</a>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer

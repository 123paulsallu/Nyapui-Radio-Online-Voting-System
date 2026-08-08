import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import MagneticButton from './MagneticButton'

const links = ['Work', 'Services', 'About', 'Contact']

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8"
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0.2 } : { duration: 0.7, ease: 'easeOut' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-black/45 px-3 py-3 backdrop-blur-xl sm:px-6">
        <a href="#" className="text-sm font-semibold uppercase tracking-[0.42em] text-white/95">
          CODE
        </a>

        <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
          {links.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="transition-colors duration-300 hover:text-white">
              {link}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex">
          <MagneticButton className="px-4 py-2.5 text-[11px] uppercase tracking-[0.28em]">
            Let&apos;s Talk
            <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition-colors hover:bg-white/10 md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/95 px-6 py-24 backdrop-blur-xl md:hidden"
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.nav
              className="mx-auto flex max-w-sm flex-col gap-4 text-left"
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
            >
              {links.map((link, index) => (
                <motion.a
                  key={link}
                  href={`#${link.toLowerCase()}`}
                  className="border-b border-white/10 pb-3 text-2xl font-medium text-white/80"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => setIsOpen(false)}
                >
                  {link}
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logoImage from '../assets/logo.png'
import MagneticButton from './MagneticButton'

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Contact', href: '/contact' },
]

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
        <Link to="/" className="flex items-center gap-3 text-white/95">
          <img src={logoImage} alt="CODE Official logo" className="h-9 w-auto" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.34em] sm:text-xs">CODE®</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.href}
              className={({ isActive }) => `transition-colors duration-300 ${isActive ? 'text-white' : 'hover:text-white'}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Link to="/contact">
            <MagneticButton className="px-4 py-2.5 text-[11px] uppercase tracking-[0.28em]">
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </Link>
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
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Link
                    to={link.href}
                    className="block border-b border-white/10 pb-3 text-2xl font-medium text-white/80"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <Link
                to="/contact"
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-[0.62rem] uppercase tracking-[0.28em] text-white"
                onClick={() => setIsOpen(false)}
              >
                Start a Project
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar

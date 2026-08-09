import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

function Button({ children, variant = 'primary', href, onClick, className = '', type = 'button' }) {
  const baseClass = 'inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-[0.65rem] font-medium uppercase tracking-[0.28em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20'

  const variants = {
    primary: 'border-white/15 bg-white/10 text-white hover:border-white/30 hover:bg-white/15',
    secondary: 'border-white/10 bg-transparent text-white/80 hover:border-white/20 hover:text-white',
    text: 'border-transparent bg-transparent px-0 py-0 text-white/75 hover:text-white',
  }

  const icon = variant === 'secondary' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />

  const content = (
    <>
      {children}
      {variant !== 'text' && icon}
    </>
  )

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className={`${baseClass} ${variants[variant]} ${className}`}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={type}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${baseClass} ${variants[variant]} ${className}`}
    >
      {content}
    </motion.button>
  )
}

export default Button

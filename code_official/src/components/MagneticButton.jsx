import { motion, useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'

function MagneticButton({ children, className = '', ...props }) {
  const buttonRef = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const shouldReduceMotion = useReducedMotion()

  const handleMove = (event) => {
    if (shouldReduceMotion || window.innerWidth < 768 || !buttonRef.current) {
      return
    }

    const rect = buttonRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    setOffset({
      x: (x / rect.width - 0.5) * 8,
      y: (y / rect.height - 0.5) * 8,
    })
  }

  const handleLeave = () => {
    setOffset({ x: 0, y: 0 })
  }

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onTouchStart={handleLeave}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      animate={shouldReduceMotion ? undefined : { x: offset.x, y: offset.y }}
      transition={shouldReduceMotion ? { duration: 0.2 } : { type: 'spring', stiffness: 200, damping: 18, mass: 0.9 }}
      className={`group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium tracking-[0.24em] text-white/90 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/15 ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default MagneticButton

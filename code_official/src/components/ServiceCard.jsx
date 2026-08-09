import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

function ServiceCard({ number, title, description, icon: Icon }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.article
      whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}
      transition={{ duration: 0.24, ease: 'easeOut' }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_70px_rgba(255,255,255,0.025)] backdrop-blur-xl sm:p-8"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'linear-gradient(135deg, rgba(120,135,255,0.16), rgba(255,255,255,0.025))' }} />
      <div className="relative flex h-full flex-col gap-6">
        <div className="flex items-start justify-between">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.38em] text-white/45">{number}</p>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80">
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-[1.12rem] font-semibold tracking-[-0.02em] text-white sm:text-xl">{title}</h3>
          <p className="text-[0.95rem] leading-7 text-white/65">{description}</p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 text-sm text-white/60">
          <span>Engage</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
    </motion.article>
  )
}

export default ServiceCard

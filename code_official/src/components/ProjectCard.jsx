import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

function ProjectCard({ number, category, title, description, image, alt }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.article
      whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.01 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#05070b]"
    >
      <div className="overflow-hidden border-b border-white/10">
        <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(120,135,255,0.18),transparent_70%)]">
          <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_45%,rgba(255,255,255,0.04))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_24%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.08),transparent_22%)]" />
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />
          {image ? (
            <img src={image} alt={alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[0.7rem] uppercase tracking-[0.42em] text-white/50">
              Visual Placeholder
            </div>
          )}
        </div>
      </div>

      <div className="space-y-5 p-6 sm:p-8">
        <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.38em] text-white/45">
          <span>{number}</span>
          <span>{category}</span>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-semibold tracking-[-0.02em] text-white">{title}</h3>
          <p className="text-sm leading-7 text-white/65">{description}</p>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm text-white/70">
          <span>View project</span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
      </div>
    </motion.article>
  )
}

export default ProjectCard

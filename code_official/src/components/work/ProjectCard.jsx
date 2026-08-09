import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function ProjectCard({ project, index }) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.article
      layout
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.45, delay: index * 0.04 }}
      className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.02]"
    >
      <Link to={`/work/${project.id}`} className="block h-full">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-70" />
          <div className="absolute inset-0 z-10 flex items-end justify-between p-5">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.32em] text-white/55">{project.category}</p>
              <h3 className="mt-3 text-xl font-semibold uppercase tracking-[-0.03em] text-white">{project.title}</h3>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(90,102,255,0.18),transparent_28%),linear-gradient(180deg,#071018,#0d1219)]" />
            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="absolute -left-6 top-10 h-32 w-32 rounded-full border border-white/12" />
            <div className="absolute bottom-8 right-8 h-24 w-24 rounded-[1.8rem] border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-full border border-white/15 bg-black/20 px-3 py-2 text-[0.6rem] uppercase tracking-[0.36em] text-white/70">
                {project.type}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.6rem] uppercase tracking-[0.32em] text-white/45">Project {String(project.id).padStart(2, '0')}</span>
            <span className="text-[0.6rem] uppercase tracking-[0.32em] text-white/45">{project.year}</span>
          </div>

          <p className="text-sm leading-7 text-white/65">{project.description}</p>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="rounded-full border border-white/10 px-2 py-1 text-[0.52rem] uppercase tracking-[0.22em] text-white/60">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default ProjectCard

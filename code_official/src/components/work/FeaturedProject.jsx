import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

function FeaturedProject({ project }) {
  const shouldReduceMotion = useReducedMotion()

  if (!project) return null

  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,135,255,0.08),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="mb-8 max-w-3xl"
        >
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">Featured project</p>
        </motion.div>

        <motion.article
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02]"
        >
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="relative overflow-hidden">
              <div className="relative aspect-[16/11] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(90,102,255,0.2),transparent_26%),linear-gradient(180deg,#09131a,#0c1720)]" />
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:38px_38px]" />
                <div className="absolute -left-12 top-10 h-44 w-44 rounded-full border border-white/10" />
                <div className="absolute right-20 top-12 h-28 w-28 rounded-full border border-white/10" />
                <div className="absolute bottom-16 left-16 h-24 w-24 rounded-[1.5rem] border border-white/10" />
                <div className="absolute left-1/2 top-1/2 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="rounded-full border border-white/15 bg-black/20 px-4 py-2 text-[0.64rem] uppercase tracking-[0.38em] text-white/70">
                    {project.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div>
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.38em] text-white/55">{project.category}</p>
                <h3 className="mt-5 text-[clamp(2.1rem,3.6vw,3.8rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em] text-white">
                  {project.title}
                </h3>
              </div>

              <div className="mt-8 space-y-6 text-white/70">
                <div className="flex gap-6 border-y border-white/10 py-4 text-[0.62rem] uppercase tracking-[0.35em] text-white/55">
                  <span>{project.type}</span>
                  <span>{project.year}</span>
                </div>

                <p className="max-w-lg text-base leading-8 text-white/68">{project.description}</p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="rounded-full border border-white/10 px-2.5 py-1 text-[0.52rem] uppercase tracking-[0.2em] text-white/60">
                      {tech}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/work/${project.id}`}
                  className="mt-4 inline-flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.32em] text-white/80 transition-colors hover:text-white"
                >
                  View case study
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  )
}

export default FeaturedProject

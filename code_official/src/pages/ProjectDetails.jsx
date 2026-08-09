import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import MagneticButton from '../components/MagneticButton'
import { projects } from '../data/projects'

function ProjectDetailsPage() {
  const { projectId } = useParams()
  const shouldReduceMotion = useReducedMotion()
  const project = projects.find((item) => String(item.id) === String(projectId)) || projects[0]
  const currentIndex = projects.findIndex((item) => item.id === project.id)
  const previousProject = projects[(currentIndex - 1 + projects.length) % projects.length]
  const nextProject = projects[(currentIndex + 1) % projects.length]

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04070b] text-white">
      <Navbar />

      <main className="pt-28">
        <section className="relative isolate overflow-hidden px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,135,255,0.08),transparent_36%)]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="mb-8 flex items-center justify-between gap-4">
              <Link to="/work" className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.36em] text-white/60 transition-colors hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Back to work
              </Link>
              <span className="text-[0.65rem] uppercase tracking-[0.38em] text-white/45">Project {String(project.id).padStart(2, '0')}</span>
            </div>

            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end"
            >
              <div>
                <p className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">{project.category}</p>
                <h1 className="mt-5 text-[clamp(2.8rem,6vw,6rem)] font-semibold uppercase leading-[0.9] tracking-[-0.06em] text-white">
                  {project.title}
                </h1>
              </div>

              <div className="flex flex-col gap-4 border-l border-white/10 pl-0 lg:pl-8">
                <div className="flex items-center justify-between gap-5 border-b border-white/10 pb-4 text-[0.62rem] uppercase tracking-[0.38em] text-white/55">
                  <span>{project.type}</span>
                  <span>{project.year}</span>
                </div>
                <p className="text-base leading-8 text-white/68">{project.description}</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02]">
            <div className="relative aspect-[16/10] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(90,102,255,0.18),transparent_28%),linear-gradient(180deg,#071018,#0d1219)]" />
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
              <div className="absolute left-10 top-10 h-28 w-28 rounded-full border border-white/10" />
              <div className="absolute right-16 top-20 h-36 w-36 rounded-full border border-white/10" />
              <div className="absolute bottom-12 left-1/2 h-40 w-40 -translate-x-1/2 rounded-[2rem] border border-white/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-full border border-white/15 bg-black/20 px-4 py-3 text-[0.68rem] uppercase tracking-[0.42em] text-white/75">
                  {project.type}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.02] p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.38em] text-white/55">The challenge</p>
              <p className="mt-5 text-base leading-8 text-white/68">{project.challenge}</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.02] p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.38em] text-white/55">The approach</p>
              <p className="mt-5 text-base leading-8 text-white/68">{project.approach}</p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.02] p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.38em] text-white/55">The solution</p>
              <p className="mt-5 text-base leading-8 text-white/68">{project.solution}</p>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="mb-8 flex items-center justify-between gap-3">
              <p className="text-[0.68rem] uppercase tracking-[0.38em] text-white/55">Technology</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="rounded-full border border-white/10 px-3 py-2 text-[0.56rem] uppercase tracking-[0.28em] text-white/65">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            {project.gallery.map((image, index) => (
              <div key={`${project.id}-${index}`} className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.02]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(90,102,255,0.18),transparent_26%),linear-gradient(180deg,#071018,#0d1219)]" />
                  <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-full border border-white/15 bg-black/20 px-3 py-2 text-[0.54rem] uppercase tracking-[0.28em] text-white/70">
                      {project.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.02] p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.38em] text-white/55">Next project</p>
                <h2 className="mt-4 text-[clamp(1.8rem,3vw,3rem)] font-semibold uppercase leading-[0.96] tracking-[-0.04em] text-white">
                  {nextProject.title}
                </h2>
              </div>

              <div className="flex gap-3">
                <Link to={`/work/${previousProject.id}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-3 text-[0.62rem] uppercase tracking-[0.32em] text-white/75">
                  <ArrowLeft className="h-4 w-4" />
                  Prev
                </Link>
                <Link to={`/work/${nextProject.id}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-3 text-[0.62rem] uppercase tracking-[0.32em] text-white/75">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-7xl">
            <MagneticButton className="px-6 py-3.5 text-[11px] uppercase tracking-[0.3em]">
              Start a project
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ProjectDetailsPage

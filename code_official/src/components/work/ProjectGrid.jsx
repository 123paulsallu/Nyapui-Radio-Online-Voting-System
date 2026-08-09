import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'

function ProjectGrid({ projects }) {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.04 }}
              className={index % 4 === 0 || index % 4 === 3 ? 'xl:col-span-2' : ''}
            >
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectGrid

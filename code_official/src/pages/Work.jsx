import { useEffect, useMemo, useState } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import FeaturedProject from '../components/work/FeaturedProject'
import ProjectFilter from '../components/work/ProjectFilter'
import ProjectGrid from '../components/work/ProjectGrid'
import WorkCTA from '../components/work/WorkCTA'
import WorkHero from '../components/work/WorkHero'
import { categories, projects } from '../data/projects'

function WorkPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    document.title = 'CODE — Our Work | Digital Products & Creative Projects'

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        "Explore selected software, websites, mobile applications, digital platforms, branding and creative projects built by CODE."
      )
    }
  }, [])

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects

    const matchesCategory = (project) => {
      if (activeCategory === 'Design') {
        return project.category === 'Branding' || project.category === 'Software'
      }

      if (activeCategory === 'Media') {
        return project.category === 'Mobile' || project.category === 'Software'
      }

      return project.category === activeCategory
    }

    return projects.filter(matchesCategory)
  }, [activeCategory])

  const featuredProject = filteredProjects.find((project) => project.featured) || filteredProjects[0]
  const remainingProjects = filteredProjects.filter((project) => project.id !== (featuredProject?.id ?? 0))

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04070b] text-white">
      <Navbar />
      <WorkHero />
      <ProjectFilter categories={categories} activeCategory={activeCategory} onChange={setActiveCategory} />
      <FeaturedProject project={featuredProject} />
      <ProjectGrid projects={remainingProjects.length ? remainingProjects : filteredProjects} />
      <WorkCTA />
      <Footer />
    </div>
  )
}

export default WorkPage

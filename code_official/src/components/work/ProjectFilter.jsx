import { motion } from 'framer-motion'

function ProjectFilter({ categories, activeCategory, onChange }) {
  return (
    <div className="relative overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max gap-3">
          {categories.map((category) => {
            const isActive = activeCategory === category

            return (
              <motion.button
                key={category}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange(category)}
                className={`rounded-full border px-4 py-2.5 text-[0.62rem] font-medium uppercase tracking-[0.28em] transition-all duration-300 ${
                  isActive
                    ? 'border-white/20 bg-white/10 text-white shadow-[0_0_24px_rgba(148,163,184,0.15)]'
                    : 'border-white/10 bg-transparent text-white/50 hover:border-white/20 hover:text-white/80'
                }`}
              >
                {category}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProjectFilter

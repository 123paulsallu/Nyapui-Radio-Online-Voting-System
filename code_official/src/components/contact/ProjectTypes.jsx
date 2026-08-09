import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

const projectOptions = [
  'Website',
  'Web Application',
  'Mobile Application',
  'Software / System',
  'UI/UX Design',
  'Branding',
  'Photography',
  'Videography',
  'Digital Media',
  'Other',
]

function ProjectTypes({ selectedTypes, onToggle }) {
  return (
    <section className="rounded-[1.8rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl sm:p-6">
      <p className="text-[0.68rem] font-medium uppercase tracking-[0.38em] text-white/55">What are you looking to build?</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {projectOptions.map((option) => {
          const isSelected = selectedTypes.includes(option)

          return (
            <motion.button
              key={option}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggle(option)}
              className={`relative flex items-center justify-between rounded-[1rem] border px-3.5 py-3.5 text-left transition-all duration-300 ${
                isSelected
                  ? 'border-white/25 bg-white/7 text-white shadow-[0_0_28px_rgba(148,163,184,0.12)]'
                  : 'border-white/10 bg-black/15 text-white/70 hover:border-white/20 hover:text-white/90'
              }`}
            >
              <span className="text-[0.62rem] font-medium uppercase tracking-[0.28em]">{option}</span>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                  isSelected
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-white/15 bg-transparent text-transparent'
                }`}
              >
                <Check className="h-3 w-3" />
              </span>
            </motion.button>
          )
        })}
      </div>
    </section>
  )
}

export default ProjectTypes

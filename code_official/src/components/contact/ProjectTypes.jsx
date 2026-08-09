import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const options = [
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

function ProjectTypes({ selectedTypes, onToggleType }) {
  return (
    <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl sm:p-6">
      <p className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">What are you looking to build?</p>
      <h2 className="mt-5 text-[clamp(1.8rem,3vw,2.8rem)] font-semibold uppercase leading-[0.96] tracking-[-0.04em] text-white">
        WHAT ARE YOU
        <br />
        LOOKING TO BUILD?
      </h2>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selectedTypes.includes(option)

          return (
            <motion.button
              key={option}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleType(option)}
              className={`group relative flex items-center justify-between rounded-[1rem] border px-3 py-3 text-left text-[0.66rem] font-medium uppercase tracking-[0.22em] transition-all duration-300 ${
                isSelected
                  ? 'border-white/20 bg-white/10 text-white shadow-[0_0_24px_rgba(148,163,184,0.12)]'
                  : 'border-white/10 bg-transparent text-white/60 hover:border-white/20 hover:text-white/80'
              }`}
            >
              <span>{option}</span>
              <span className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 ${isSelected ? 'border-white/30 bg-white/10 text-white' : 'border-white/15 text-transparent'}`}>
                <Check className="h-3 w-3" />
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default ProjectTypes

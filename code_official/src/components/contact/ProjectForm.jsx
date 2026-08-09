import { useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

const CODE_EMAIL = 'codeofficial.sl@proton.me'

const initialState = {
  fullName: '',
  email: '',
  phone: '',
  organization: '',
  projectType: '',
  description: '',
  budget: "Let's discuss",
  timeline: 'As soon as possible',
}

const budgetOptions = ["Let's discuss", 'Under $500', '$500 – $1,500', '$1,500 – $5,000', '$5,000+']
const timelineOptions = ['As soon as possible', '1–3 months', '3–6 months', '6+ months', 'No fixed timeline']

function ProjectForm({ selectedTypes, onProjectSubmit }) {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')

  const projectTypeText = useMemo(() => {
    if (!selectedTypes.length) return 'Not selected yet'
    return selectedTypes.join(', ')
  }, [selectedTypes])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
  }

  const validate = () => {
    const nextErrors = {}

    if (!formData.fullName.trim()) nextErrors.fullName = 'Please enter your full name.'
    if (!formData.email.trim()) nextErrors.email = 'Please enter your email address.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = 'Please enter a valid email address.'
    if (!formData.description.trim()) nextErrors.description = 'Please tell us a bit about your project.'
    else if (formData.description.trim().length < 20) nextErrors.description = 'Please share a little more detail so we can understand your project.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!validate()) return

    const body = [
      'Name: ' + formData.fullName,
      'Email: ' + formData.email,
      'Phone: ' + (formData.phone || 'Not provided'),
      'Organization: ' + (formData.organization || 'Not provided'),
      'Project Type: ' + projectTypeText,
      'Budget: ' + formData.budget,
      'Timeline: ' + formData.timeline,
      '',
      'Project Description:',
      formData.description,
    ].join('\n')

    const subject = 'New Project Inquiry — CODE'
    const mailtoLink = `mailto:${CODE_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    window.location.href = mailtoLink
    setNotice('Your email client should open with your project request prepared.')
    onProjectSubmit?.({ ...formData, selectedTypes })
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="rounded-[1.8rem] border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl sm:p-6"
    >
      <div className="mb-6">
        <p className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">Tell us about your project</p>
        <h2 className="mt-5 text-[clamp(1.8rem,3vw,2.9rem)] font-semibold uppercase leading-[0.96] tracking-[-0.04em] text-white">
          TELL US ABOUT
          <br />
          YOUR PROJECT.
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-1">
          <label htmlFor="fullName" className="text-[0.64rem] uppercase tracking-[0.3em] text-white/55">Full Name</label>
          <input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full rounded-[0.9rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10" placeholder="Your name" aria-invalid={Boolean(errors.fullName)} />
          {errors.fullName && <p className="flex items-center gap-2 text-xs text-red-300"><AlertCircle className="h-3.5 w-3.5" /> {errors.fullName}</p>}
        </div>

        <div className="space-y-2 md:col-span-1">
          <label htmlFor="email" className="text-[0.64rem] uppercase tracking-[0.3em] text-white/55">Email Address</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full rounded-[0.9rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10" placeholder="name@email.com" aria-invalid={Boolean(errors.email)} />
          {errors.email && <p className="flex items-center gap-2 text-xs text-red-300"><AlertCircle className="h-3.5 w-3.5" /> {errors.email}</p>}
        </div>

        <div className="space-y-2 md:col-span-1">
          <label htmlFor="phone" className="text-[0.64rem] uppercase tracking-[0.3em] text-white/55">Phone / WhatsApp</label>
          <input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-[0.9rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10" placeholder="+000 000 0000" />
        </div>

        <div className="space-y-2 md:col-span-1">
          <label htmlFor="organization" className="text-[0.64rem] uppercase tracking-[0.3em] text-white/55">Organization</label>
          <input id="organization" name="organization" value={formData.organization} onChange={handleChange} className="w-full rounded-[0.9rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10" placeholder="Your organization" />
        </div>

        <div className="space-y-2 md:col-span-1">
          <label htmlFor="projectType" className="text-[0.64rem] uppercase tracking-[0.3em] text-white/55">Project Type</label>
          <input id="projectType" name="projectType" value={projectTypeText} readOnly className="w-full rounded-[0.9rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/80 focus:outline-none" />
        </div>

        <div className="space-y-2 md:col-span-1">
          <label htmlFor="budget" className="text-[0.64rem] uppercase tracking-[0.3em] text-white/55">Budget Range</label>
          <select id="budget" name="budget" value={formData.budget} onChange={handleChange} className="w-full rounded-[0.9rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10">
            {budgetOptions.map((option) => (
              <option key={option} value={option} className="bg-[#0b1016] text-white">{option}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="description" className="text-[0.64rem] uppercase tracking-[0.3em] text-white/55">Project Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="6" className="w-full rounded-[0.9rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10" placeholder="Tell us about your idea, what you want to achieve, and what you need help building." aria-invalid={Boolean(errors.description)} />
          {errors.description && <p className="flex items-center gap-2 text-xs text-red-300"><AlertCircle className="h-3.5 w-3.5" /> {errors.description}</p>}
        </div>

        <div className="space-y-2 md:col-span-1">
          <label htmlFor="timeline" className="text-[0.64rem] uppercase tracking-[0.3em] text-white/55">Timeline</label>
          <select id="timeline" name="timeline" value={formData.timeline} onChange={handleChange} className="w-full rounded-[0.9rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10">
            {timelineOptions.map((option) => (
              <option key={option} value={option} className="bg-[#0b1016] text-white">{option}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-[0.66rem] uppercase tracking-[0.28em] text-white transition-all duration-300 hover:border-white/30 hover:bg-white/15">
            Send Project Request →
          </button>

          <a href="https://wa.me/?text=Hi%20CODE%2C%20I%27d%20like%20to%20start%20a%20project." target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-5 py-3 text-[0.66rem] uppercase tracking-[0.28em] text-white/80 transition-all duration-300 hover:border-white/25 hover:text-white">
            Contact us on WhatsApp →
          </a>
        </div>
      </div>

      {notice && (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 flex items-center gap-2 rounded-[0.9rem] border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          <CheckCircle2 className="h-4 w-4" />
          {notice}
        </motion.p>
      )}
    </motion.form>
  )
}

export default ProjectForm

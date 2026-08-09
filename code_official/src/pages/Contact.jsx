import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import ContactCTA from '../components/contact/ContactCTA'
import ContactHero from '../components/contact/ContactHero'
import ContactMethods from '../components/contact/ContactMethods'
import ProjectForm from '../components/contact/ProjectForm'
import ProjectTypes from '../components/contact/ProjectTypes'

function ContactPage() {
  const [selectedTypes, setSelectedTypes] = useState([])

  useEffect(() => {
    document.title = 'CODE — Start a Project | Crafting Our Digital Experience'

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Start a project with CODE. Tell us about your software, website, mobile application, design, branding or media project.'
      )
    }
  }, [])

  const toggleType = (type) => {
    setSelectedTypes((previous) =>
      previous.includes(type) ? previous.filter((item) => item !== type) : [...previous, type]
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04070b] text-white">
      <Navbar />
      <ContactHero />

      <section className="relative isolate overflow-hidden px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-8">
            <ProjectTypes selectedTypes={selectedTypes} onToggleType={toggleType} />
            <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.02] p-6">
              <p className="text-[0.68rem] uppercase tracking-[0.38em] text-white/55">Why CODE?</p>
              <h3 className="mt-5 text-[clamp(2rem,3vw,3rem)] font-semibold uppercase leading-[0.94] tracking-[-0.04em] text-white">
                MORE THAN
                <br />
                A SERVICE PROVIDER.
              </h3>

              <div className="mt-8 space-y-6">
                {[
                  { number: '01', title: 'ONE MULTIDISCIPLINARY TEAM', text: 'Technology, design, branding and media working together.' },
                  { number: '02', title: 'BUILT AROUND YOUR GOALS', text: 'We start with your problem and work toward the right solution.' },
                  { number: '03', title: 'DESIGNED TO LAST', text: 'We create digital experiences that can evolve with your organization.' },
                ].map((item) => (
                  <div key={item.number} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <span className="text-[0.64rem] uppercase tracking-[0.36em] text-white/45">{item.number}</span>
                      <h4 className="text-base font-medium uppercase tracking-[0.18em] text-white/80">{item.title}</h4>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-white/65">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ProjectForm selectedTypes={selectedTypes} />
        </div>
      </section>

      <ContactMethods />
      <ContactCTA />
      <Footer />
    </div>
  )
}

export default ContactPage

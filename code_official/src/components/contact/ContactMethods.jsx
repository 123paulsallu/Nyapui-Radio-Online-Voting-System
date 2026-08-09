import { ArrowUpRight, Mail, MessageSquareText, Share2 } from 'lucide-react'

const methods = [
  {
    label: 'Email',
    description: 'Start a conversation',
    href: 'mailto:codeofficial.sl@proton.me',
    icon: Mail,
  },
  {
    label: 'WhatsApp',
    description: 'Chat with CODE',
    href: 'https://wa.me/?text=Hi%20CODE%2C%20I%27d%20like%20to%20start%20a%20project.',
    icon: MessageSquareText,
  },
  {
    label: 'Social',
    description: 'Connect with us',
    href: '#',
    icon: Share2,
  },
]

function ContactMethods() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/10 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(120,135,255,0.06),transparent_36%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">Direct contact</p>
          <h2 className="mt-5 text-[clamp(2.1rem,4vw,3.5rem)] font-semibold uppercase leading-[0.92] tracking-[-0.04em] text-white">
            CONTACT CODE
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {methods.map((method) => {
            const Icon = method.icon

            return (
              <a
                key={method.label}
                href={method.href}
                className="group rounded-[1.7rem] border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/75">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-white/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>

                <p className="mt-6 text-[0.68rem] uppercase tracking-[0.38em] text-white/55">{method.label}</p>
                <p className="mt-4 text-xl font-semibold uppercase tracking-[-0.03em] text-white">{method.description}</p>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ContactMethods

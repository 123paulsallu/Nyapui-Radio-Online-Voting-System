import { motion, useReducedMotion } from 'framer-motion'
import afterEffectsLogo from '../../assets/Download Adobe After Effects Icon.jpg'
import dockerLogo from '../../assets/Docker Logo [Software].jpg'
import figmaLogo from '../../assets/Figma.jpg'
import gitLogo from '../../assets/Introduction to Git.jpg'
import nextLogo from '../../assets/Next_js Icon Logo PNG Vector (SVG) Free Download.jpg'
import nginxLogo from '../../assets/Nginx free icons designed by Magnific.jpg'
import photoshopLogo from '../../assets/photoshop-logo.jpg'
import prismaLogo from '../../assets/Prisma Logo.jpg'
import reactLogo from '../../assets/react.svg'
import premiereLogo from '../../assets/Download Adobe Premiere Pro icon.jpg'
import viteLogo from '../../assets/vite.svg'
import vscodeLogo from '../../assets/Visual Studio Code logo in vector format - Brandlogos_net.jpg'
import vercelLogo from '../../assets/Vercel Logo PNG Vector (SVG) Free Download.jpg'
import SpaceBackground from '../SpaceBackground'

const toolLogos = [
  { name: 'React', src: reactLogo },
  { name: 'Vite', src: viteLogo },
  { name: 'Figma', src: figmaLogo },
  { name: 'Docker', src: dockerLogo },
  { name: 'VS Code', src: vscodeLogo },
  { name: 'Git', src: gitLogo },
  { name: 'Next.js', src: nextLogo },
  { name: 'Nginx', src: nginxLogo },
  { name: 'Vercel', src: vercelLogo },
  { name: 'Photoshop', src: photoshopLogo },
  { name: 'Premiere Pro', src: premiereLogo },
  { name: 'After Effects', src: afterEffectsLogo },
  { name: 'Prisma', src: prismaLogo },
]

function WorkHero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative isolate flex min-h-[76vh] items-center overflow-hidden px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <SpaceBackground />

      <div className="relative mx-auto w-full max-w-7xl py-12">
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="max-w-4xl"
        >
          <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">Selected Work</p>
          <h1 className="text-[clamp(3rem,7vw,6.6rem)] font-semibold uppercase leading-[0.88] tracking-[-0.06em] text-white">
            IDEAS WE
            <br />
            HAVE TURNED
            <br />
            INTO EXPERIENCES.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
            A selection of digital products, platforms, brands and creative projects we&apos;ve helped bring to life.
          </p>

          <motion.div
            className="mt-8 flex items-center gap-3 text-[0.62rem] font-medium uppercase tracking-[0.38em] text-white/55"
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12, duration: 0.5 }}
          >
            <span className="inline-flex h-px w-10 bg-white/25" />
            TECHNOLOGY × DESIGN × MEDIA
          </motion.div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {toolLogos.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 shadow-[0_0_30px_rgba(255,255,255,0.04)] backdrop-blur-sm"
              >
                <img src={tool.src} alt={tool.name} className="h-6 w-6 object-contain" />
                <span className="text-[0.52rem] uppercase tracking-[0.22em] text-white/70">{tool.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WorkHero

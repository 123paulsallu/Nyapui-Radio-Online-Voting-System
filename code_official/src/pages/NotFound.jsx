import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

function NotFound() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04070b] text-white">
      <Navbar />

      <main className="relative isolate flex min-h-screen items-center overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(120,135,255,0.08),transparent_35%)]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.42em] text-white/55">404</p>
          <h1 className="mt-6 text-[clamp(3rem,10vw,8rem)] font-semibold uppercase leading-[0.82] tracking-[-0.06em] text-white">
            LOST IN THE
            <br />
            DIGITAL UNIVERSE.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-[0.62rem] uppercase tracking-[0.28em] text-white transition-all duration-300 hover:border-white/30 hover:bg-white/15">
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>
            <Link to="/work" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-transparent px-5 py-3 text-[0.62rem] uppercase tracking-[0.28em] text-white/80 transition-all duration-300 hover:border-white/20 hover:text-white">
              Explore our work
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default NotFound

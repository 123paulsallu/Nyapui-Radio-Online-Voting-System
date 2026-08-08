import About from '../components/About'
import BrandStatement from '../components/BrandStatement'
import CTA from '../components/CTA'
import FeaturedWork from '../components/FeaturedWork'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Process from '../components/Process'
import Services from '../components/Services'

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04070b] text-white">
      <Navbar />
      <Hero />
      <BrandStatement />
      <Services />
      <FeaturedWork />
      <About />
      <Process />
      <CTA />
      <Footer />
    </div>
  )
}

export default Home

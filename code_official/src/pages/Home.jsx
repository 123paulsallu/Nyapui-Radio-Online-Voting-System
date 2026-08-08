import BrandStatement from '../components/BrandStatement'
import FeaturedWork from '../components/FeaturedWork'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Services from '../components/Services'

function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#04070b] text-white">
      <Navbar />
      <Hero />
      <BrandStatement />
      <Services />
      <FeaturedWork />
    </div>
  )
}

export default Home

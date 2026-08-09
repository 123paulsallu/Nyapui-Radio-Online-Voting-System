import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import AboutPage from './pages/About'
import ServicesPage from './pages/Services'
import WorkPage from './pages/Work'
import ProjectDetailsPage from './pages/ProjectDetails'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:projectId" element={<ProjectDetailsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

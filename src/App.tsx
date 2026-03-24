import { Routes, Route } from 'react-router-dom'
import AnimatedBackground from './components/AnimatedBackground'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import SearchResults from './pages/SearchResults'
import Registration from './pages/Registration'
import Success from './pages/Success'
import Dashboard from './pages/Dashboard'
import Ecosystem from './pages/Ecosystem'
import Manage from './pages/Manage'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/register/:domain" element={<Registration />} />
        <Route path="/success/:domain" element={<Success />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ecosystem" element={<Ecosystem />} />
        <Route path="/manage/:domain" element={<Manage />} />
      </Routes>
      <Footer />
    </div>
  )
}

import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import SearchResults from './pages/SearchResults'
import Registration from './pages/Registration'
import Success from './pages/Success'
import Dashboard from './pages/Dashboard'
import Ecosystem from './pages/Ecosystem'

function EcosystemLayout() {
  return (
    <div className="min-h-screen">
      {/* Ecosystem has its own nav */}
      <header className="fixed top-0 w-full z-50 bg-[#111317]/60 backdrop-blur-2xl shadow-2xl shadow-black/40">
        <nav className="flex justify-between items-center px-8 h-20 w-full max-w-[1600px] mx-auto">
          <div className="flex items-center gap-12">
            <a href="/ecosystem" className="text-2xl font-extrabold tracking-tighter text-[#e8910c] font-headline">BNS Ecosystem</a>
            <div className="hidden md:flex items-center gap-8 font-headline font-semibold tracking-tight text-sm">
              <a className="text-primary border-b-2 border-primary pb-1" href="/ecosystem">Auctions</a>
              <a className="text-slate-400 hover:text-slate-200 transition-colors" href="#">Marketplace</a>
              <a className="text-slate-400 hover:text-slate-200 transition-colors" href="/dashboard">My Domains</a>
              <a className="text-slate-400 hover:text-slate-200 transition-colors" href="#">Governance</a>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4 items-center">
              <button className="p-2 text-slate-400 hover:bg-surface-container rounded-full transition-all duration-300">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="p-2 text-slate-400 hover:bg-surface-container rounded-full transition-all duration-300">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </button>
            </div>
            <button className="primary-gradient text-[#2b1700] px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-transform">
              Connect Wallet
            </button>
          </div>
        </nav>
      </header>
      <Ecosystem />
      <footer className="xl:ml-64 bg-[#111317] w-full py-12 border-t border-white/5 mt-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-[#e8910c] font-extrabold tracking-tighter text-xl mb-2 font-headline">BNS Ecosystem</span>
            <p className="text-xs uppercase tracking-widest text-slate-600">© 2024 BNS Ecosystem. Secured by Bitcoin.</p>
          </div>
          <div className="flex gap-8">
            <a className="text-xs uppercase tracking-widest text-slate-600 hover:text-primary transition-colors" href="#">Documentation</a>
            <a className="text-xs uppercase tracking-widest text-slate-600 hover:text-primary transition-colors" href="#">Smart Contracts</a>
            <a className="text-xs uppercase tracking-widest text-slate-600 hover:text-primary transition-colors" href="#">Status</a>
            <a className="text-xs uppercase tracking-widest text-slate-600 hover:text-primary transition-colors" href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const isEcosystem = location.pathname === '/ecosystem'

  if (isEcosystem) {
    return <EcosystemLayout />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/register/:domain" element={<Registration />} />
        <Route path="/success/:domain" element={<Success />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </div>
  )
}

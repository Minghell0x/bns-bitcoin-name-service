import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWallet } from '../contexts/WalletContext'
import WalletButton from './WalletButton'

const navLinks = [
  { label: 'Domains', path: '/' },
  { label: 'Ecosystem', path: '/ecosystem' },
]

export default function Navbar() {
  const location = useLocation()
  const { isConnected } = useWallet()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Detect scroll for stronger shadow/background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 w-full z-50 ${scrolled ? 'bg-[#111317]/90 shadow-2xl shadow-black/60' : 'glass-nav shadow-2xl shadow-black/40'} transition-all duration-300`}>
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
        <Link to="/" className="text-2xl font-extrabold tracking-tighter text-[#E8910C] font-headline">
          BNS
        </Link>

        <div className="hidden md:flex items-center gap-10 font-headline font-semibold tracking-tight">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={
                location.pathname === link.path
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-gray-400 hover:text-white transition-colors'
              }
            >
              {link.label}
            </Link>
          ))}
          {isConnected && (
            <Link
              to="/dashboard"
              className={
                location.pathname === '/dashboard'
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-gray-400 hover:text-white transition-colors'
              }
            >
              My Domains
            </Link>
          )}
        </div>

        <div className="hidden md:block">
          <WalletButton />
        </div>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] focus:outline-none"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
        >
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-300 ${
              mobileOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-300 ${
              mobileOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-white transition-all duration-300 ${
              mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile slide-down panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-4 px-8 pb-6 pt-2 font-headline font-semibold tracking-tight">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={
                location.pathname === link.path
                  ? 'text-primary border-l-2 border-primary pl-4 py-2'
                  : 'text-gray-400 hover:text-white transition-colors pl-4 py-2'
              }
            >
              {link.label}
            </Link>
          ))}
          {isConnected && (
            <Link
              to="/dashboard"
              className={
                location.pathname === '/dashboard'
                  ? 'text-primary border-l-2 border-primary pl-4 py-2'
                  : 'text-gray-400 hover:text-white transition-colors pl-4 py-2'
              }
            >
              My Domains
            </Link>
          )}
          <div className="pt-2">
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  )
}

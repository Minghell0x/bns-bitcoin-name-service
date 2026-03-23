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

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-2xl shadow-black/40">
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

        <WalletButton />
      </div>
    </nav>
  )
}

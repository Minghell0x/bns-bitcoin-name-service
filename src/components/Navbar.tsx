import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { label: 'Domains', path: '/' },
  { label: 'Auction', path: '/auction' },
  { label: 'Ecosystem', path: '/ecosystem' },
]

export default function Navbar() {
  const location = useLocation()

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
        </div>

        <button className="primary-gradient text-[#2b1700] px-6 py-2.5 rounded-full font-headline font-bold active:scale-95 duration-200 transition-all hover:shadow-[0_0_20px_rgba(232,145,12,0.3)]">
          Connect Wallet
        </button>
      </div>
    </nav>
  )
}

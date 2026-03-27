import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'Documentation', href: '#', comingSoon: true },
  {
    label: 'Smart Contracts',
    href: 'https://testnet.opnet.org/address/0xc9049fb7a443ca24f371f94c6b0d5fbe3b12d5dd46e252c1eb3e2a935d4e0294',
    comingSoon: false,
  },
  { label: 'API', href: '#', comingSoon: true },
  { label: 'Status', href: '#', comingSoon: true },
  { label: 'Security', href: '#', comingSoon: true },
]

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#1a1c1f] bg-[#111317] pt-12 pb-8 mt-20">
      <div className="max-w-screen-2xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="text-[#E8910C] font-bold font-headline text-xl">BNS</Link>
          <p className="font-mono text-[11px] uppercase tracking-widest text-gray-500">
            &copy; 2024 Bitcoin Name Service. The Sovereign Curator.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-mono text-[11px] uppercase tracking-widest">
          {footerLinks.map((link) =>
            link.comingSoon ? (
              <a
                key={link.label}
                href="#"
                title="Coming Soon"
                onClick={(e) => e.preventDefault()}
                className="text-gray-600 opacity-50 cursor-default"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-primary transition-colors opacity-80 hover:opacity-100"
              >
                {link.label}
              </a>
            )
          )}
        </div>
      </div>
    </footer>
  )
}

import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { lookupDomain } from '../services/DomainService'
import { formatDate, formatAddress } from '../utils/formatting'
import { useWallet } from '../contexts/WalletContext'
// LoadingSkeleton available for future use

export default function Success() {
  const { domain = '' } = useParams()
  const { walletAddress } = useWallet()
  const [expiryDate, setExpiryDate] = useState<string>('Loading...')
  const [ownerAddr, setOwnerAddr] = useState<string>('...')

  useEffect(() => {
    lookupDomain(domain)
      .then(({ domain: info }) => {
        if (info.exists) {
          setExpiryDate(formatDate(info.expiresAt))
          setOwnerAddr(formatAddress(info.owner))
        }
      })
      .catch(() => {
        setExpiryDate('Pending confirmation')
        setOwnerAddr(walletAddress ? formatAddress(walletAddress) : '...')
      })
  }, [domain, walletAddress])

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center">
      {/* Progress Context */}
      <div className="flex items-center gap-4 mb-12 opacity-40">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Step 01</span>
        <div className="h-[1px] w-8 bg-on-surface/20" />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Step 02</span>
        <div className="h-[1px] w-8 bg-on-surface/20" />
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">Success</span>
      </div>

      {/* Domain Display */}
      <div className="mb-16 text-center">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-2">
          {domain}<span className="text-primary font-mono font-medium">.btc</span>
        </h1>
      </div>

      {/* Success Card */}
      <div className="w-full max-w-2xl bg-surface-container-low rounded-xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="relative p-12 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8">
            <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight mb-4 font-headline">Registration Complete</h2>
          <p className="text-lg text-on-surface-variant mb-12">
            <span className="font-mono text-primary">{domain}.btc</span> is now yours.
          </p>

          {/* Technical Details */}
          <div className="w-full grid grid-cols-1 gap-px bg-white/5 rounded-lg overflow-hidden mb-12">
            <div className="bg-surface-container p-6 flex flex-col items-start gap-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Registered Until</span>
              <span className="text-on-surface font-medium">{expiryDate}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
              <div className="bg-surface-container p-6 flex flex-col items-start gap-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Owner Address</span>
                <span className="text-on-surface font-mono text-sm truncate w-full">{ownerAddr}</span>
              </div>
              <div className="bg-surface-container p-6 flex flex-col items-start gap-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Network</span>
                <span className="text-on-surface font-mono text-sm">OPNet Testnet (Signet)</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <Link
              to="/dashboard"
              className="flex-1 py-4 primary-gradient text-[#2b1700] rounded-full font-bold tracking-tight text-center hover:opacity-90 transition-all active:scale-[0.98]"
            >
              Manage Domain
            </Link>
            <Link
              to="/"
              className="flex-1 py-4 bg-surface-container-highest text-on-surface rounded-full font-bold tracking-tight text-center hover:bg-surface-bright transition-all active:scale-[0.98]"
            >
              Register Another
            </Link>
          </div>

          {/* Social Sharing */}
          <div className="mt-12 pt-8 border-t border-white/5 w-full flex flex-col items-center gap-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Broadcast your ownership</span>
            <div className="flex gap-6">
              <a
                className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just registered ${domain}.btc on Bitcoin Layer 1! 🟠`)}&url=${encodeURIComponent('https://bns.btc')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-xl">share</span>
                <span className="text-xs font-semibold">Twitter</span>
              </a>
              <a
                className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
                href="https://bns.btc"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-xl">link</span>
                <span className="text-xs font-semibold">Share Link</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-lg text-center">
        <p className="text-slate-500 text-sm leading-relaxed">
          Your domain is secured on the Bitcoin blockchain via OPNet. It may take a few minutes for all
          resolvers to update across the network.
        </p>
      </div>
    </main>
  )
}

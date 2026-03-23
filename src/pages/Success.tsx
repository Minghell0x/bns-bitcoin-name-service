import { useParams, useLocation, Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { lookupDomain } from '../services/DomainService'
import { formatDate, formatAddress } from '../utils/formatting'

export default function Success() {
  const { domain = '' } = useParams()
  const location = useLocation()
  const txHash = (location.state as { txHash?: string } | null)?.txHash

  const [confirmed, setConfirmed] = useState(false)
  const [expiryDate, setExpiryDate] = useState<string>('')
  const [ownerAddr, setOwnerAddr] = useState<string>('')
  const [checking, setChecking] = useState(true)

  const checkConfirmation = useCallback(async () => {
    try {
      const { domain: info } = await lookupDomain(domain)
      if (info.exists && info.isActive) {
        setExpiryDate(formatDate(info.expiresAt))
        setOwnerAddr(formatAddress(info.owner))
        setConfirmed(true)
        setChecking(false)
        return true
      }
    } catch {
      // Not confirmed yet
    }
    return false
  }, [domain])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    let mounted = true

    async function poll() {
      const done = await checkConfirmation()
      if (!done && mounted) {
        interval = setInterval(async () => {
          const confirmed = await checkConfirmation()
          if (confirmed && mounted) {
            clearInterval(interval)
          }
        }, 15_000) // Check every 15 seconds
      }
    }

    poll()
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [checkConfirmation])

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center">
      {/* Domain Display */}
      <div className="mb-12 text-center">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-2">
          {domain}<span className="text-primary font-mono font-medium">.btc</span>
        </h1>
      </div>

      <div className="w-full max-w-2xl bg-surface-container-low rounded-xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="relative p-12 flex flex-col items-center text-center">

          {!confirmed ? (
            /* ── WAITING STATE ── */
            <>
              <div className="w-20 h-20 mb-8 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight mb-4 font-headline">
                Waiting for Confirmation
              </h2>
              <p className="text-on-surface-variant text-sm mb-8 max-w-sm">
                Your registration transaction has been submitted. Waiting for it to be confirmed on-chain.
                Signet blocks may take up to 15 minutes.
              </p>

              {/* Tx Hash */}
              {txHash && (
                <a
                  href={`https://mempool.opnet.org/it/testnet4/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-4 bg-surface-container rounded-xl border border-white/5 hover:border-primary/20 transition-colors group mb-8"
                >
                  <p className="text-[10px] font-mono text-outline uppercase tracking-widest mb-1 text-left">Transaction</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-mono text-primary break-all flex-1 text-left">{txHash}</p>
                    <span className="material-symbols-outlined text-sm text-outline group-hover:text-primary transition-colors">open_in_new</span>
                  </div>
                </a>
              )}

              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm animate-pulse">schedule</span>
                <span className="text-xs font-mono uppercase tracking-widest">
                  {checking ? 'Checking...' : 'Polling every 15s'}
                </span>
              </div>
            </>
          ) : (
            /* ── CONFIRMED STATE ── */
            <>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight mb-4 font-headline">Registration Complete</h2>
              <p className="text-lg text-on-surface-variant mb-12">
                <span className="font-mono text-primary">{domain}.btc</span> is now yours.
              </p>

              {/* Details */}
              <div className="w-full grid grid-cols-1 gap-px bg-white/5 rounded-lg overflow-hidden mb-8">
                <div className="bg-surface-container p-6 flex flex-col items-start gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Registered Until</span>
                  <span className="text-on-surface font-medium">{expiryDate}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
                  <div className="bg-surface-container p-6 flex flex-col items-start gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Owner</span>
                    <span className="text-on-surface font-mono text-sm truncate w-full">{ownerAddr}</span>
                  </div>
                  <div className="bg-surface-container p-6 flex flex-col items-start gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Network</span>
                    <span className="text-on-surface font-mono text-sm">OPNet Testnet</span>
                  </div>
                </div>
              </div>

              {/* Tx Hash */}
              {txHash && (
                <a
                  href={`https://mempool.opnet.org/it/testnet4/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-4 bg-surface-container rounded-xl border border-white/5 hover:border-primary/20 transition-colors group mb-8"
                >
                  <p className="text-[10px] font-mono text-outline uppercase tracking-widest mb-1 text-left">Transaction</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-mono text-primary break-all flex-1 text-left">{txHash}</p>
                    <span className="material-symbols-outlined text-sm text-outline group-hover:text-primary transition-colors">open_in_new</span>
                  </div>
                </a>
              )}

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

              {/* Share */}
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
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

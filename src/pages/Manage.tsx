import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import WalletGuard from '../components/WalletGuard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useWallet } from '../contexts/WalletContext'
import { lookupDomain, fetchDomainPrice, renewDomainTx, transferDomainTx } from '../services/DomainService'
import { formatDate, formatSats, daysUntilExpiry } from '../utils/formatting'
import type { Address } from '@btc-vision/transaction'
import type { DomainInfo, DomainStatus } from '../types'

export default function Manage() {
  return (
    <WalletGuard message="Connect your OP_WALLET to manage your .btc domains.">
      <ManageContent />
    </WalletGuard>
  )
}

const statusConfig: Record<DomainStatus, { badge: string; dot: string; label: string; pulse: boolean }> = {
  available: {
    badge: 'bg-zinc-500/10 text-zinc-400 border-zinc-400/20',
    dot: 'bg-zinc-400',
    label: 'Available',
    pulse: false,
  },
  taken: {
    badge: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    dot: 'bg-emerald-400',
    label: 'Active',
    pulse: false,
  },
  expiring: {
    badge: 'bg-primary/10 text-primary border-primary/20',
    dot: 'bg-primary',
    label: 'Expiring Soon',
    pulse: true,
  },
  'grace-period': {
    badge: 'bg-error/10 text-error border-error/20',
    dot: 'bg-error',
    label: 'Grace Period',
    pulse: false,
  },
}

function ManageContent() {
  const { domain: domainParam } = useParams<{ domain: string }>()
  const domainName = domainParam?.replace(/\.btc$/, '') ?? ''
  const { walletAddress, address } = useWallet()

  // Domain info state
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null)
  const [domainStatus, setDomainStatus] = useState<DomainStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Renew state
  const [renewYears, setRenewYears] = useState(1)
  const [renewPrice, setRenewPrice] = useState<bigint | null>(null)
  const [renewPriceLoading, setRenewPriceLoading] = useState(false)
  const [renewPending, setRenewPending] = useState(false)
  const [renewSuccess, setRenewSuccess] = useState<string | null>(null)
  const [renewError, setRenewError] = useState<string | null>(null)

  // Transfer state
  const [transferAddress, setTransferAddress] = useState('')
  const [transferPending, setTransferPending] = useState(false)
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null)
  const [transferError, setTransferError] = useState<string | null>(null)

  const loadDomain = useCallback(async () => {
    if (!domainName) return
    setLoading(true)
    setError(null)
    try {
      const { domain: info, status } = await lookupDomain(domainName)
      setDomainInfo(info)
      setDomainStatus(status)
    } catch {
      setError('Failed to load domain information. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [domainName])

  useEffect(() => {
    loadDomain()
  }, [loadDomain])

  // Fetch renewal price when years change
  useEffect(() => {
    if (!domainName) return
    let cancelled = false
    setRenewPriceLoading(true)
    fetchDomainPrice(domainName, renewYears)
      .then((price) => {
        if (!cancelled) {
          setRenewPrice(price.totalPriceSats)
          setRenewPriceLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setRenewPrice(null)
          setRenewPriceLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [domainName, renewYears])

  async function handleRenew() {
    if (!walletAddress || !domainName) return
    setRenewPending(true)
    setRenewError(null)
    setRenewSuccess(null)
    try {
      const { txHash } = await renewDomainTx(domainName, renewYears, walletAddress)
      setRenewSuccess(txHash)
      await loadDomain()
    } catch (err) {
      setRenewError(err instanceof Error ? err.message : 'Renewal failed. Please try again.')
    } finally {
      setRenewPending(false)
    }
  }

  async function handleTransfer() {
    if (!walletAddress || !address || !domainName || !transferAddress.trim()) return
    setTransferPending(true)
    setTransferError(null)
    setTransferSuccess(null)
    try {
      const newOwner = transferAddress.trim() as unknown as Address
      const { txHash } = await transferDomainTx(domainName, newOwner, walletAddress)
      setTransferSuccess(txHash)
      setTransferAddress('')
      await loadDomain()
    } catch (err) {
      setTransferError(err instanceof Error ? err.message : 'Transfer failed. Please try again.')
    } finally {
      setTransferPending(false)
    }
  }

  const isOwner = domainInfo && walletAddress
    ? domainInfo.owner.toLowerCase() === walletAddress.toLowerCase()
    : false

  if (loading) {
    return (
      <main className="pt-32 pb-24 px-8 max-w-5xl mx-auto">
        <LoadingSkeleton type="page" />
      </main>
    )
  }

  if (error) {
    return (
      <main className="pt-32 pb-24 px-8 max-w-5xl mx-auto">
        <div className="bg-surface-container-lowest rounded-[2rem] p-16 text-center border border-outline-variant/5">
          <span className="material-symbols-outlined text-5xl text-error mb-4">error</span>
          <h3 className="text-xl font-bold mb-2">Error Loading Domain</h3>
          <p className="text-on-surface-variant text-sm mb-6">{error}</p>
          <button
            onClick={loadDomain}
            className="px-6 py-3 rounded-full bg-primary text-[#2b1700] font-bold text-sm"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  if (!domainInfo || !domainInfo.exists) {
    return (
      <main className="pt-32 pb-24 px-8 max-w-5xl mx-auto">
        <div className="bg-surface-container-lowest rounded-[2rem] p-16 text-center border border-outline-variant/5">
          <span className="material-symbols-outlined text-5xl text-outline mb-4">domain_disabled</span>
          <h3 className="text-xl font-bold mb-2">Domain Not Found</h3>
          <p className="text-on-surface-variant text-sm mb-6">
            <span className="font-mono text-primary">{domainName}.btc</span> does not exist or has not been registered.
          </p>
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-full bg-surface-container-high hover:bg-surface-bright text-sm font-bold transition-all inline-block"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    )
  }

  const sc = statusConfig[domainStatus ?? 'taken']
  const daysLeft = daysUntilExpiry(domainInfo.expiresAt)

  return (
    <main className="pt-32 pb-24 px-8 max-w-5xl mx-auto space-y-10">
      {/* Back link */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors group"
      >
        <span className="material-symbols-outlined text-lg group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        Back to Dashboard
      </Link>

      {/* Domain header */}
      <header className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 border border-outline-variant/5">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary font-mono font-bold text-2xl shrink-0">
            {domainName[0]}.
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-none font-headline">
              {domainName}<span className="text-primary font-mono font-medium">.btc</span>
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${sc.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} mr-2 ${sc.pulse ? 'animate-pulse' : ''}`} />
                {sc.label}
              </span>
              {isOwner && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-tertiary/10 text-tertiary border border-tertiary/20">
                  You Own This
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-zinc-800/20">
          <div className="space-y-1">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">Expiration</p>
            <p className="font-mono text-on-surface text-lg">{formatDate(domainInfo.expiresAt)}</p>
            <p className={`text-xs font-mono ${daysLeft < 30 ? 'text-primary' : 'text-tertiary'}`}>
              {daysLeft} days remaining
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">Created</p>
            <p className="font-mono text-on-surface text-lg">{formatDate(domainInfo.createdAt)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">TTL</p>
            <p className="font-mono text-on-surface text-lg">{domainInfo.ttl.toString()}s</p>
          </div>
        </div>
      </header>

      {/* Renew Section */}
      {isOwner && (
        <section className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 border border-outline-variant/5 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">autorenew</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-headline tracking-tight">Renew Domain</h2>
              <p className="text-sm text-on-surface-variant">Extend your domain registration.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            {/* Year selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                Duration
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((y) => (
                  <button
                    key={y}
                    onClick={() => setRenewYears(y)}
                    className={`w-12 h-12 rounded-xl font-mono font-bold text-sm transition-all ${
                      renewYears === y
                        ? 'primary-gradient text-[#2b1700] shadow-lg shadow-primary/20'
                        : 'bg-surface-container-high hover:bg-surface-bright text-on-surface'
                    }`}
                  >
                    {y}y
                  </button>
                ))}
              </div>
            </div>

            {/* Price display */}
            <div className="space-y-2 flex-1">
              <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                Renewal Cost
              </label>
              <div className="bg-surface-container-high rounded-xl px-6 py-3 font-mono text-lg text-on-surface">
                {renewPriceLoading ? (
                  <span className="text-outline animate-pulse">Fetching...</span>
                ) : renewPrice !== null ? (
                  formatSats(renewPrice)
                ) : (
                  <span className="text-outline">--</span>
                )}
              </div>
            </div>

            {/* Renew button */}
            <button
              onClick={handleRenew}
              disabled={renewPending || renewPrice === null}
              className="px-8 py-3 rounded-full primary-gradient text-[#2b1700] font-bold text-sm whitespace-nowrap disabled:opacity-50 hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95"
            >
              {renewPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#2b1700]/30 border-t-[#2b1700] rounded-full animate-spin" />
                  Renewing...
                </span>
              ) : (
                'Renew'
              )}
            </button>
          </div>

          {renewSuccess && (
            <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-xl px-6 py-4 space-y-1">
              <p className="text-sm font-bold text-emerald-400">Renewal Successful</p>
              <p className="text-xs font-mono text-zinc-400 break-all">TX: {renewSuccess}</p>
            </div>
          )}
          {renewError && (
            <div className="bg-error/5 border border-error/20 rounded-xl px-6 py-4">
              <p className="text-sm text-error">{renewError}</p>
            </div>
          )}
        </section>
      )}

      {/* Transfer Section */}
      {isOwner && (
        <section className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 border border-outline-variant/5 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">send</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold font-headline tracking-tight">Transfer Domain</h2>
              <p className="text-sm text-on-surface-variant">Send this domain to another address.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                New Owner Address
              </label>
              <input
                type="text"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                placeholder="Enter recipient address"
                className="w-full bg-surface-container-highest rounded-xl px-6 py-4 text-sm font-mono border-none focus:ring-0 focus:outline-none text-on-surface placeholder:text-outline/50"
              />
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl px-6 py-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">warning</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Domain transfers are irreversible. Double-check the recipient address before confirming.
                The domain will be immediately transferred to the new owner.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleTransfer}
                disabled={transferPending || !transferAddress.trim()}
                className="px-8 py-3 rounded-full bg-tertiary/20 hover:bg-tertiary/30 text-tertiary font-bold text-sm whitespace-nowrap disabled:opacity-50 transition-all active:scale-95"
              >
                {transferPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-tertiary/30 border-t-tertiary rounded-full animate-spin" />
                    Transferring...
                  </span>
                ) : (
                  'Transfer'
                )}
              </button>
            </div>
          </div>

          {transferSuccess && (
            <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-xl px-6 py-4 space-y-1">
              <p className="text-sm font-bold text-emerald-400">Transfer Successful</p>
              <p className="text-xs font-mono text-zinc-400 break-all">TX: {transferSuccess}</p>
            </div>
          )}
          {transferError && (
            <div className="bg-error/5 border border-error/20 rounded-xl px-6 py-4">
              <p className="text-sm text-error">{transferError}</p>
            </div>
          )}
        </section>
      )}

      {/* Not Owner Warning */}
      {!isOwner && domainInfo.exists && (
        <section className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-12 border border-outline-variant/5 text-center">
          <span className="material-symbols-outlined text-4xl text-outline mb-4">lock</span>
          <h3 className="text-xl font-bold mb-2">Not Your Domain</h3>
          <p className="text-on-surface-variant text-sm">
            You are not the owner of this domain and cannot manage it.
          </p>
        </section>
      )}
    </main>
  )
}

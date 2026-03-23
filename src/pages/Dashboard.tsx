import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import WalletGuard from '../components/WalletGuard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import { useWallet } from '../contexts/WalletContext'
import { lookupDomain, renewDomainTx, fetchDomainPrice } from '../services/DomainService'
import { getOwnedDomainNames, addOwnedDomain } from '../utils/storage'
import { formatAddress, formatDate, formatSats, daysUntilExpiry } from '../utils/formatting'
import type { DomainInfo } from '../types'

interface EnrichedDomain {
  name: string
  info: DomainInfo
  daysLeft: number
  status: 'active' | 'expiring' | 'grace-period'
}

const statusStyles = {
  active: {
    badge: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    dot: 'bg-emerald-400',
    label: 'Active',
    pulse: false,
    remainingColor: 'text-tertiary',
    action: { label: 'Renew', style: 'bg-secondary-container/20 hover:bg-secondary-container text-secondary' },
  },
  expiring: {
    badge: 'bg-primary/10 text-primary border-primary/20',
    dot: 'bg-primary',
    label: 'Expiring',
    pulse: true,
    remainingColor: 'text-primary',
    action: { label: 'Renew Now', style: 'primary-gradient text-[#2b1700] shadow-lg shadow-primary/20' },
  },
  'grace-period': {
    badge: 'bg-error/10 text-error border-error/20',
    dot: 'bg-error',
    label: 'Grace Period',
    pulse: false,
    remainingColor: 'text-error',
    action: { label: 'Reclaim', style: 'bg-error-container text-on-error-container' },
  },
}

export default function Dashboard() {
  return (
    <WalletGuard message="Connect your OP_WALLET to manage your .btc domains.">
      <DashboardContent />
    </WalletGuard>
  )
}

function DashboardContent() {
  const { walletAddress, provider: walletProvider } = useWallet()
  const navigate = useNavigate()
  const [domains, setDomains] = useState<EnrichedDomain[]>([])
  const [loading, setLoading] = useState(true)
  const [importName, setImportName] = useState('')
  const [importError, setImportError] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)

  // Inline renewal state
  const [renewingDomain, setRenewingDomain] = useState<string | null>(null)
  const [renewYears, setRenewYears] = useState(1)
  const [renewPrice, setRenewPrice] = useState<string | null>(null)
  const [renewPending, setRenewPending] = useState(false)
  const [renewError, setRenewError] = useState<string | null>(null)

  const loadDomains = useCallback(async () => {
    if (!walletAddress) return
    setLoading(true)
    const names = getOwnedDomainNames(walletAddress)
    const results: EnrichedDomain[] = []

    for (const name of names) {
      try {
        const { domain: info } = await lookupDomain(name)
        if (info.exists && info.owner.toLowerCase() === walletAddress.toLowerCase()) {
          const days = daysUntilExpiry(info.expiresAt)
          let status: EnrichedDomain['status'] = 'active'
          if (info.inGracePeriod) status = 'grace-period'
          else if (days < 30) status = 'expiring'
          results.push({ name, info, daysLeft: days, status })
        }
      } catch {
        // Domain lookup failed, skip
      }
    }
    setDomains(results)
    setLoading(false)
  }, [walletAddress])

  useEffect(() => {
    loadDomains()
  }, [loadDomains])

  async function handleImport() {
    if (!importName || !walletAddress) return
    setImporting(true)
    setImportError(null)
    const cleaned = importName.trim().toLowerCase().replace(/\.btc$/, '')
    try {
      const { domain: info } = await lookupDomain(cleaned)
      if (!info.exists) {
        setImportError('Domain not found')
      } else if (info.owner.toLowerCase() !== walletAddress.toLowerCase()) {
        setImportError('You are not the owner of this domain')
      } else {
        addOwnedDomain(walletAddress, cleaned)
        setImportName('')
        await loadDomains()
      }
    } catch {
      setImportError('Failed to verify domain ownership')
    } finally {
      setImporting(false)
    }
  }

  async function openRenewal(domainName: string) {
    setRenewingDomain(domainName)
    setRenewYears(1)
    setRenewPrice(null)
    setRenewError(null)
    try {
      const price = await fetchDomainPrice(domainName, 1)
      setRenewPrice(formatSats(price.totalPriceSats))
    } catch {
      setRenewPrice(null)
    }
  }

  async function handleRenewYearsChange(domainName: string, years: number) {
    setRenewYears(years)
    setRenewPrice(null)
    try {
      const price = await fetchDomainPrice(domainName, years)
      setRenewPrice(formatSats(price.totalPriceSats))
    } catch {
      setRenewPrice(null)
    }
  }

  async function handleRenewConfirm() {
    if (!walletAddress || !renewingDomain) return
    setRenewPending(true)
    setRenewError(null)
    try {
      await renewDomainTx(renewingDomain, renewYears, walletAddress, walletProvider)
      setRenewingDomain(null)
      await loadDomains()
    } catch (err) {
      setRenewError(err instanceof Error ? err.message : 'Renewal failed')
    } finally {
      setRenewPending(false)
    }
  }

  return (
    <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <header className="grid lg:grid-cols-12 gap-8 items-end mb-16">
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none font-headline">
            Your <span className="text-primary italic">Sovereign</span> Domains
          </h1>
          <SearchBar size="compact" />
        </div>
        <div className="lg:col-span-5 flex flex-col items-end gap-2 text-right">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">Connected Identity</p>
          <div className="bg-surface-container-low px-6 py-4 rounded-2xl flex items-center gap-4 border border-outline-variant/10">
            <div className="space-y-1">
              <p className="font-mono text-sm text-on-surface">{walletAddress ? formatAddress(walletAddress) : '...'}</p>
              <p className="text-xs text-primary font-semibold">{domains.length} Owned Domains</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tertiary to-secondary opacity-80" />
          </div>
        </div>
      </header>

      {/* Import Domain */}
      <section className="bg-surface-container-low rounded-2xl p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <p className="text-sm font-bold mb-1">Import Existing Domain</p>
          <p className="text-xs text-on-surface-variant">Already own a .btc domain? Add it to your dashboard.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            value={importName}
            onChange={(e) => setImportName(e.target.value)}
            placeholder="mydomain.btc"
            className="bg-surface-container-highest rounded-xl px-4 py-2 text-sm font-mono border-none focus:ring-0 focus:outline-none text-on-surface placeholder:text-outline/50 w-full sm:w-48"
          />
          <button
            onClick={handleImport}
            disabled={importing || !importName}
            className="px-6 py-2 rounded-full bg-primary text-[#2b1700] font-bold text-sm whitespace-nowrap disabled:opacity-50"
          >
            {importing ? '...' : 'Import'}
          </button>
        </div>
        {importError && <p className="text-error text-xs">{importError}</p>}
      </section>

      {/* Domain Table */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold font-headline tracking-tight">Your Domains</h2>
            <p className="text-zinc-500 text-sm">Managing assets secured by Bitcoin.</p>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton type="card" />
        ) : domains.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-[2rem] p-16 text-center border border-outline-variant/5">
            <span className="material-symbols-outlined text-5xl text-outline mb-4">domain_disabled</span>
            <h3 className="text-xl font-bold mb-2">No domains yet</h3>
            <p className="text-on-surface-variant text-sm mb-6">Register your first .btc domain or import an existing one.</p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden border border-outline-variant/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-8 py-6 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-normal">Domain</th>
                    <th className="px-8 py-6 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-normal">Expiration</th>
                    <th className="px-8 py-6 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-normal">Status</th>
                    <th className="px-8 py-6 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/20">
                  {domains.map((d) => {
                    const s = statusStyles[d.status]
                    const isRenewing = renewingDomain === d.name
                    return (
                      <tr key={d.name} className="group">
                        <td className="px-8 py-8" colSpan={4}>
                          {/* Main row content */}
                          <div className="flex items-center">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-mono font-bold text-lg shrink-0">
                                {d.name[0]}.
                              </div>
                              <div>
                                <p className="text-xl font-extrabold font-headline">
                                  {d.name}<span className="text-primary font-mono font-medium">.btc</span>
                                </p>
                              </div>
                            </div>
                            <div className="hidden sm:block px-8 space-y-1">
                              <p className="font-mono text-on-surface">{formatDate(d.info.expiresAt)}</p>
                              <p className={`text-[10px] uppercase tracking-wider font-mono ${s.remainingColor}`}>
                                {d.daysLeft} days remaining
                              </p>
                            </div>
                            <div className="hidden sm:block px-8">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${s.badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${s.dot} mr-2 ${s.pulse ? 'animate-pulse' : ''}`} />
                                {s.label}
                              </span>
                            </div>
                            <div className="flex justify-end gap-3 shrink-0">
                              <button
                                onClick={() => navigate(`/manage/${d.name}`)}
                                className="px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-bright text-xs font-bold transition-all"
                              >
                                Manage
                              </button>
                              <button
                                onClick={() => isRenewing ? setRenewingDomain(null) : openRenewal(d.name)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${s.action.style}`}
                              >
                                {isRenewing ? 'Cancel' : s.action.label}
                              </button>
                            </div>
                          </div>

                          {/* Inline renewal card */}
                          {isRenewing && (
                            <div className="mt-6 bg-surface-container-low rounded-2xl p-6 space-y-4">
                              <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-lg">autorenew</span>
                                <p className="text-sm font-bold font-headline">
                                  Renew {d.name}<span className="text-primary">.btc</span>
                                </p>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                                {/* Year selector */}
                                <div className="space-y-2">
                                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Duration</label>
                                  <div className="flex gap-1.5">
                                    {[1, 2, 3, 4, 5].map((y) => (
                                      <button
                                        key={y}
                                        onClick={() => handleRenewYearsChange(d.name, y)}
                                        className={`w-10 h-10 rounded-lg font-mono font-bold text-xs transition-all ${
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
                                {/* Price */}
                                <div className="space-y-2 flex-1">
                                  <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Cost</label>
                                  <div className="bg-surface-container-highest rounded-lg px-4 py-2.5 font-mono text-sm text-on-surface">
                                    {renewPrice ?? <span className="text-outline animate-pulse">Fetching...</span>}
                                  </div>
                                </div>
                                {/* Confirm */}
                                <button
                                  onClick={handleRenewConfirm}
                                  disabled={renewPending || !renewPrice}
                                  className="px-6 py-2.5 rounded-full primary-gradient text-[#2b1700] font-bold text-xs whitespace-nowrap disabled:opacity-50 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                                >
                                  {renewPending ? (
                                    <span className="flex items-center gap-2">
                                      <span className="w-3.5 h-3.5 border-2 border-[#2b1700]/30 border-t-[#2b1700] rounded-full animate-spin" />
                                      Renewing...
                                    </span>
                                  ) : (
                                    'Confirm Renewal'
                                  )}
                                </button>
                              </div>
                              {renewError && (
                                <p className="text-error text-xs">{renewError}</p>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Infrastructure Status */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-zinc-800/30">
        <div className="space-y-4">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">Infrastructure Status</p>
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <p className="text-xs font-mono text-zinc-400">Network</p>
              <p className="text-lg font-mono font-medium text-emerald-400">Testnet</p>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="space-y-1">
              <p className="text-xs font-mono text-zinc-400">Contract</p>
              <p className="text-lg font-mono font-medium">BtcNameResolver</p>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary">security</span>
            <div>
              <p className="text-sm font-bold font-headline">Cold Storage Recommendation</p>
              <p className="text-xs text-zinc-500">Transfer high-value domains to a hardware wallet.</p>
            </div>
          </div>
          <button className="text-xs font-mono text-primary hover:underline underline-offset-4">Learn More</button>
        </div>
      </section>
    </main>
  )
}

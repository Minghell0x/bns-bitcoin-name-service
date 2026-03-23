import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useDomainLookup } from '../hooks/useDomainLookup'
import { renewDomainTx } from '../services/DomainService'
import { useWallet } from '../contexts/WalletContext'
import { formatSats, formatAddress, formatDate } from '../utils/formatting'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorState from '../components/ErrorState'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const domainName = query.toLowerCase().replace(/\.btc$/, '')
  const [years, setYears] = useState(1)

  const { domain, price, status, loading, error, refetch } = useDomainLookup(domainName, years)
  const { walletAddress, isConnected, connect, provider: walletProvider, address, addressHex } = useWallet()

  const [renewPending, setRenewPending] = useState(false)
  const [renewError, setRenewError] = useState<string | null>(null)

  const isOwnerCheck = !!(domain && (
    (domain.ownerHex && addressHex && domain.ownerHex.toLowerCase() === addressHex.toLowerCase()) ||
    (walletAddress && domain.owner.toLowerCase() === walletAddress.toLowerCase())
  ))

  async function handleRenew() {
    if (!walletAddress) {
      connect()
      return
    }
    setRenewPending(true)
    setRenewError(null)
    try {
      await renewDomainTx(domainName, years, walletAddress, walletProvider, address)
      refetch()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Renewal failed'
      setRenewError(msg)
      console.error('[BNS] Renewal failed:', err)
    } finally {
      setRenewPending(false)
    }
  }

  if (!domainName) {
    return (
      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto text-center">
        <p className="text-on-surface-variant">Enter a domain name to search.</p>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <LoadingSkeleton type="domain" />
      </main>
    )
  }

  if (error) {
    return (
      <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        <ErrorState message={error} onRetry={refetch} />
      </main>
    )
  }

  const isAvailable = status === 'available'
  const canRenew = (status === 'grace-period' || status === 'expiring') && isOwnerCheck

  return (
    <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <section className="relative">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bento-glow pointer-events-none" />

        <div className="bg-surface-container-low rounded-xl p-10 md:p-16 relative z-10 overflow-hidden outline outline-1 outline-outline-variant/15">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="space-y-2">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                isAvailable ? 'bg-primary/10 border border-primary/20' : 'bg-surface-container-highest border border-outline-variant/20'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-primary status-pulse' : 'bg-outline'}`} />
                <span className={`text-xs font-mono font-bold tracking-widest uppercase ${isAvailable ? 'text-primary' : 'text-outline'}`}>
                  {status === 'available' ? 'AVAILABLE' : status === 'grace-period' ? 'GRACE PERIOD' : status === 'expiring' ? 'EXPIRING' : 'TAKEN'}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter font-headline leading-none">
                {domainName}<span className="text-primary font-mono font-normal">.btc</span>
              </h1>

              {!isAvailable && domain && (
                <p className="text-sm text-outline font-mono">
                  Owner: {formatAddress(domain.owner)} • Expires: {formatDate(domain.expiresAt)}
                </p>
              )}
            </div>

            {price && (
              <div className="flex flex-col items-end gap-1">
                <span className="text-outline uppercase tracking-widest font-mono text-[10px]">
                  {isAvailable ? 'TOTAL TO REGISTER' : 'RENEWAL PRICE'}
                </span>
                <div className="text-4xl font-mono font-bold text-tertiary">
                  {formatSats(isAvailable ? price.totalPriceSats : price.renewalPerYear)}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Grid */}
          {price && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-surface-container rounded-lg p-6 border-l-2 border-primary/30">
                <div className="text-[10px] uppercase tracking-widest text-outline font-mono mb-2">Base Registration</div>
                <div className="text-2xl font-mono text-on-surface">{formatSats(price.totalPriceSats - price.auctionPriceSats)}</div>
              </div>
              <div className="bg-surface-container rounded-lg p-6 border-l-2 border-tertiary/30">
                <div className="text-[10px] uppercase tracking-widest text-outline font-mono mb-2">Auction Premium</div>
                <div className="text-2xl font-mono text-tertiary">{formatSats(price.auctionPriceSats)}</div>
                <div className="text-xs text-outline mt-1">Dutch auction — declines per block</div>
              </div>
              <div className="bg-surface-container rounded-lg p-6 border-l-2 border-outline/30">
                <div className="text-[10px] uppercase tracking-widest text-outline font-mono mb-2">Renewal Rate</div>
                <div className="text-2xl font-mono text-on-surface-variant">{formatSats(price.renewalPerYear)}</div>
                <div className="text-xs text-outline mt-1">Per annum</div>
              </div>
            </div>
          )}

          {/* Year selector */}
          {isAvailable && (
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm text-on-surface-variant font-mono">Registration Period:</span>
              <div className="flex gap-2">
                {[1, 2, 3, 5].map((y) => (
                  <button
                    key={y}
                    onClick={() => setYears(y)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      years === y
                        ? 'primary-gradient text-[#2b1700]'
                        : 'bg-surface-container-highest text-on-surface hover:bg-surface-bright'
                    }`}
                  >
                    {y} {y === 1 ? 'Year' : 'Years'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            {isAvailable ? (
              <Link
                to={`/register/${domainName}?years=${years}`}
                className="flex-1 py-5 px-8 rounded-full primary-gradient text-[#2b1700] font-bold text-lg text-center hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
              >
                Register {domainName}.btc
              </Link>
            ) : canRenew ? (
              <button
                onClick={handleRenew}
                disabled={renewPending}
                className="flex-1 py-5 px-8 rounded-full primary-gradient text-[#2b1700] font-bold text-lg text-center hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {renewPending ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-[#2b1700]/30 border-t-[#2b1700] rounded-full animate-spin" />
                    Renewing...
                  </span>
                ) : (
                  `Renew ${domainName}.btc`
                )}
              </button>
            ) : (status === 'grace-period' || status === 'expiring') && !isOwnerCheck && isConnected ? (
              <div className="flex-1 py-5 px-8 rounded-full bg-surface-container-highest text-outline font-bold text-lg text-center">
                Only the owner can renew this domain
              </div>
            ) : null}
          </div>

          {/* Renewal error */}
          {renewError && (
            <div className="mt-4 p-4 rounded-lg bg-error/10 border border-error/20">
              <p className="text-error text-sm font-mono">{renewError}</p>
            </div>
          )}
        </div>
      </section>

      {/* Info Cards */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container rounded-xl p-8 outline outline-1 outline-outline-variant/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">shield</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">Protocol Governance</h3>
          </div>
          <p className="text-on-surface-variant leading-relaxed text-sm mb-6">
            BNS domains are secured directly on the Bitcoin base layer via OPNet. Once registered,
            ownership is cryptographically immutable.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono py-2 border-b border-surface-variant">
              <span className="text-outline">NETWORK</span>
              <span className="text-on-surface">BITCOIN L1 (OPNET)</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono py-2 border-b border-surface-variant">
              <span className="text-outline">SECURITY</span>
              <span className="text-on-surface">ML-DSA SIGNATURES</span>
            </div>
          </div>
        </div>
        <div className="bg-surface-container rounded-xl p-8 outline outline-1 outline-outline-variant/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">history_edu</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">Ownership Lifecycle</h3>
          </div>
          <p className="text-on-surface-variant leading-relaxed text-sm mb-6">
            Renewals are available at any time before expiration. Post-expiration, names enter a 90-day
            grace period before returning to the public pool.
          </p>
          <ul className="space-y-4">
            {['Instant resolution to BTC addresses', 'Transferable on secondary markets', 'Subdomain issuance capability'].map(
              (item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-sm text-primary mt-0.5">check_circle</span>
                  <span className="text-sm text-on-surface-variant">{item}</span>
                </li>
              ),
            )}
          </ul>
        </div>
      </section>
    </main>
  )
}

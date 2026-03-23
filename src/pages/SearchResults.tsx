import { useSearchParams, Link } from 'react-router-dom'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const domainName = query.toLowerCase().replace(/\.btc$/, '')

  // Mock data — will be replaced with contract reads
  const isAvailable = true
  const totalPrice = '0.0245'
  const usdPrice = '1,420.50'
  const basePrice = '0.0050'
  const auctionPremium = '0.0185'
  const renewalRate = '0.0010'

  return (
    <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
      <section className="relative">
        {/* Decorative Backglow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bento-glow pointer-events-none" />

        {/* Main Result Card */}
        <div className="bg-surface-container-low rounded-xl p-10 md:p-16 relative z-10 overflow-hidden outline outline-1 outline-outline-variant/15">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div className="space-y-2">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary status-pulse" />
                <span className="text-xs font-mono font-bold tracking-widest text-primary uppercase">
                  {isAvailable ? 'AVAILABLE' : 'TAKEN'}
                </span>
              </div>

              {/* Domain Name */}
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter font-headline leading-none">
                {domainName}
                <span className="text-primary font-mono font-normal">.btc</span>
              </h1>
              <p className="text-sm text-outline font-mono">
                ID: {domainName.slice(0, 4)}...{domainName.slice(-4)} • Tier 1 Premium
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-outline uppercase tracking-widest font-mono text-[10px]">
                TOTAL TO REGISTER
              </span>
              <div className="text-4xl font-mono font-bold text-tertiary">{totalPrice} BTC</div>
              <span className="text-sm text-outline">≈ ${usdPrice} USD</span>
            </div>
          </div>

          {/* Technical Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-surface-container rounded-lg p-6 border-l-2 border-primary/30">
              <div className="text-[10px] uppercase tracking-widest text-outline font-mono mb-2">
                Base Registration
              </div>
              <div className="text-2xl font-mono text-on-surface">{basePrice} BTC</div>
              <div className="text-xs text-outline mt-1">Standard 5+ char rate</div>
            </div>
            <div className="bg-surface-container rounded-lg p-6 border-l-2 border-tertiary/30">
              <div className="text-[10px] uppercase tracking-widest text-outline font-mono mb-2">
                Auction Premium
              </div>
              <div className="text-2xl font-mono text-tertiary">{auctionPremium} BTC</div>
              <div className="text-xs text-outline mt-1">Sovereign rarity multiplier</div>
            </div>
            <div className="bg-surface-container rounded-lg p-6 border-l-2 border-outline/30">
              <div className="text-[10px] uppercase tracking-widest text-outline font-mono mb-2">
                Renewal Rate
              </div>
              <div className="text-2xl font-mono text-on-surface-variant">{renewalRate} BTC</div>
              <div className="text-xs text-outline mt-1">Per annum (fixed)</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={`/register/${domainName}`}
              className="flex-1 py-5 px-8 rounded-full primary-gradient text-[#2b1700] font-bold text-lg text-center hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
            >
              Register {domainName}.btc
            </Link>
            <button className="px-8 py-5 rounded-full bg-secondary-container text-on-secondary-container font-semibold hover:bg-secondary-container/80 transition-all">
              Add to Watchlist
            </button>
          </div>
        </div>
      </section>

      {/* Secondary Info Grid */}
      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Protocol Governance */}
        <div className="bg-surface-container rounded-xl p-8 outline outline-1 outline-outline-variant/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">shield</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">Protocol Governance</h3>
          </div>
          <p className="text-on-surface-variant leading-relaxed text-sm mb-6">
            BNS domains are secured directly on the Bitcoin base layer via OPNet. Once registered,
            ownership is cryptographically immutable. No central authority can revoke or censor your
            sovereign identity.
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

        {/* Ownership Lifecycle */}
        <div className="bg-surface-container rounded-xl p-8 outline outline-1 outline-outline-variant/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">history_edu</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">Ownership Lifecycle</h3>
          </div>
          <p className="text-on-surface-variant leading-relaxed text-sm mb-6">
            Your registration provides a multi-year lease of the name. Renewals are available at any
            time before expiration. Post-expiration, names enter a 90-day grace period before returning
            to the public pool.
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

      {/* On-Chain DNA */}
      <section className="mt-20 overflow-hidden rounded-xl bg-surface-container-lowest outline outline-1 outline-outline-variant/5">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-10 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4 tracking-tighter">On-Chain DNA</h2>
            <p className="text-outline text-sm mb-8 leading-relaxed">
              Every BNS name generates a unique cryptographic hash upon commitment. This signature is
              verified by miners across the network to ensure global uniqueness and prevent collisions.
            </p>
            <div className="font-mono text-[10px] space-y-2 text-on-surface-variant/60">
              <div className="truncate">CONTRACT: 0x9fbe...ee23</div>
              <div className="truncate">NETWORK: OPNET TESTNET (SIGNET)</div>
              <div className="truncate">RESOLVER: BtcNameResolver v1</div>
            </div>
          </div>
          <div className="bg-surface-container-high h-64 lg:h-auto flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-20 grayscale">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB51AUgsAdRr6f25IjGMhhXRsVcmR6OUmi0iDo7x4FqtAaZljye39gbj73ccHbBbCySbEpyo_mHVxXHe2uXrBiWMQwl5wBCMiPi23cErephnUQFZpd0XurVIU_15H8bQNpUj1tRyx1Mo0FtWNT__x-xgsD-HeUdtdFlDKUnOPZb8ERsqLzaHjlll3gHWWz9Y9vpPjIBtxFUWGlsDqSK-It364oiKXcDkfJve3hkbbUKGvq4bISLBKxhdozGUvuShLVI9ALcgP9HwOjc"
                alt="Abstract digital block pattern"
              />
            </div>
            <div className="relative z-10 p-8 border border-primary/20 backdrop-blur-md rounded-lg bg-background/40 font-mono text-primary text-xs flex flex-col gap-2">
              <span>COMMIT: 02.24.2024</span>
              <span>STATUS: PENDING_BROADCAST</span>
              <span>FEE_RATE: 24 SAT/VB</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

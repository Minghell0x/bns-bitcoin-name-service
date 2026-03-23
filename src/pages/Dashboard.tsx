import SearchBar from '../components/SearchBar'

const ownedDomains = [
  {
    name: 'satoshi',
    initial: 's.',
    id: '#9,214',
    year: 2021,
    expires: '2026.04.12',
    remaining: '2 years remaining',
    status: 'active' as const,
  },
  {
    name: 'hal',
    initial: 'h.',
    id: '#12,501',
    year: 2022,
    expires: '2024.11.28',
    remaining: '14 days remaining',
    status: 'expiring' as const,
  },
  {
    name: 'ordinals',
    initial: 'o.',
    id: '#45,102',
    year: 2023,
    expires: '2024.10.15',
    remaining: 'Overdue',
    status: 'grace-period' as const,
  },
]

const statusStyles = {
  active: {
    badge: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    dot: 'bg-emerald-400',
    label: 'Active',
    pulse: false,
    remainingColor: 'text-tertiary-fixed-dim',
    action: { label: 'Renew', style: 'bg-secondary-container/20 hover:bg-secondary-container text-secondary' },
  },
  expiring: {
    badge: 'bg-primary/10 text-primary border-primary/20',
    dot: 'bg-primary',
    label: 'Expiring',
    pulse: true,
    remainingColor: 'text-primary-fixed-dim',
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
    <main className="pt-32 pb-24 px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Search Section */}
      <header className="grid lg:grid-cols-12 gap-8 items-end mb-16">
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-none font-headline">
            Claim your <span className="text-primary italic">Sovereign</span> identity.
          </h1>
          <SearchBar size="hero" />
        </div>
        <div className="lg:col-span-5 flex flex-col items-end gap-2 text-right">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">Connected Identity</p>
          <div className="bg-surface-container-low px-6 py-4 rounded-2xl flex items-center gap-4 border border-outline-variant/10">
            <div className="space-y-1">
              <p className="font-mono text-sm text-on-surface">bc1q...x9p2</p>
              <p className="text-xs text-primary font-semibold">{ownedDomains.length} Owned Domains</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tertiary to-secondary opacity-80" />
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between min-h-[200px] group hover:bg-surface-container transition-colors duration-500">
          <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">Market Insight</p>
          <div className="space-y-2">
            <p className="text-4xl font-extrabold font-headline tracking-tight">
              2.4M <span className="text-zinc-600">Total</span>
            </p>
            <p className="text-zinc-400 max-w-xs">Global BNS registrations recorded on the Bitcoin blockchain.</p>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between group hover:bg-surface-container transition-colors duration-500">
          <span className="material-symbols-outlined text-tertiary text-3xl">query_stats</span>
          <div className="space-y-1">
            <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">Volume</p>
            <p className="text-2xl font-bold font-headline">142.8 BTC</p>
          </div>
        </div>
        <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col justify-between group hover:bg-surface-container transition-colors duration-500">
          <span className="material-symbols-outlined text-primary text-3xl">workspace_premium</span>
          <div className="space-y-1">
            <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">Premium Floor</p>
            <p className="text-2xl font-bold font-headline">0.45 BTC</p>
          </div>
        </div>
      </section>

      {/* Domain Management Table */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold font-headline tracking-tight">Your Domains</h2>
            <p className="text-zinc-500 text-sm">Managing assets secured by Bitcoin.</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span> Filter
            </button>
            <button className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">swap_vert</span> Sort
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-[2rem] overflow-hidden border border-outline-variant/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-6 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-normal">Domain Identity</th>
                  <th className="px-8 py-6 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-normal">Expiration</th>
                  <th className="px-8 py-6 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-normal">Status</th>
                  <th className="px-8 py-6 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/20">
                {ownedDomains.map((d) => {
                  const s = statusStyles[d.status]
                  return (
                    <tr key={d.name} className="group hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-mono font-bold text-lg">
                            {d.initial}
                          </div>
                          <div>
                            <p className="text-xl font-extrabold font-headline">
                              {d.name}<span className="text-primary font-mono font-medium">.btc</span>
                            </p>
                            <p className="text-xs font-mono text-zinc-500">{d.id} registered {d.year}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="space-y-1">
                          <p className="font-mono text-on-surface">{d.expires}</p>
                          <p className={`text-[10px] uppercase tracking-wider font-mono ${s.remainingColor}`}>
                            {d.remaining}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${s.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot} mr-2 ${s.pulse ? 'animate-pulse' : ''}`} />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-8 py-8 text-right">
                        <div className="flex justify-end gap-3">
                          <button className="px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-bright text-xs font-bold transition-all">
                            Manage
                          </button>
                          <button className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${s.action.style}`}>
                            {s.action.label}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Infrastructure Status */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-zinc-800/30">
        <div className="space-y-4">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-500">Infrastructure Status</p>
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <p className="text-xs font-mono text-zinc-400">Block Height</p>
              <p className="text-lg font-mono font-medium">842,912</p>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="space-y-1">
              <p className="text-xs font-mono text-zinc-400">Gas (Sats/vB)</p>
              <p className="text-lg font-mono font-medium text-tertiary">24</p>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="space-y-1">
              <p className="text-xs font-mono text-zinc-400">Network</p>
              <p className="text-lg font-mono font-medium text-emerald-400">Testnet</p>
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

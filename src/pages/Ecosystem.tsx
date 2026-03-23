import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchDomainPrice, fetchBasePrice } from '../services/DomainService'
import { formatSats } from '../utils/formatting'
import type { DomainPrice } from '../types'

const PREMIUM_DOMAINS = ['satoshi', 'bitcoin', 'hal', 'genesis', 'ordinal', 'nakamoto', 'block', 'node']

interface AuctionEntry {
  name: string
  price: DomainPrice | null
  loading: boolean
}

export default function Ecosystem() {
  const [auctions, setAuctions] = useState<AuctionEntry[]>(
    PREMIUM_DOMAINS.map((name) => ({ name, price: null, loading: true })),
  )
  const [basePrice, setBasePrice] = useState<bigint | null>(null)
  const [featured, setFeatured] = useState<AuctionEntry | null>(null)

  useEffect(() => {
    fetchBasePrice().then(setBasePrice).catch(() => {})

    PREMIUM_DOMAINS.forEach((name, i) => {
      fetchDomainPrice(name, 1)
        .then((price) => {
          setAuctions((prev) => {
            const updated = [...prev]
            updated[i] = { name, price, loading: false }
            return updated
          })
          if (i === 0) setFeatured({ name, price, loading: false })
        })
        .catch(() => {
          setAuctions((prev) => {
            const updated = [...prev]
            updated[i] = { name, price: null, loading: false }
            return updated
          })
        })
    })
  }, [])

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 pt-24 pb-8 bg-[#1a1c1f] border-r border-white/5 flex-col z-40 hidden xl:flex">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container">
            <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center border border-white/10">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-container to-tertiary opacity-80" />
            </div>
            <div className="overflow-hidden">
              <p className="text-primary font-bold text-xs font-mono truncate">Dutch Auctions</p>
              <p className="text-slate-500 text-[10px] font-mono">Premium Domains</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-1 font-mono text-sm">
          <a className="flex items-center gap-3 bg-gradient-to-r from-[#e8910c]/20 to-transparent text-primary border-l-4 border-primary-container px-6 py-3" href="#">
            <span className="material-symbols-outlined text-lg">gavel</span>
            Live Prices
          </a>
          <a className="flex items-center gap-3 text-slate-500 hover:text-slate-300 hover:bg-surface-container px-6 py-3 transition-colors" href="#">
            <span className="material-symbols-outlined text-lg">trending_down</span>
            Declining Now
          </a>
          <Link to="/dashboard" className="flex items-center gap-3 text-slate-500 hover:text-slate-300 hover:bg-surface-container px-6 py-3 transition-colors">
            <span className="material-symbols-outlined text-lg">person_pin</span>
            My Domains
          </Link>
          <Link to="/" className="flex items-center gap-3 text-slate-500 hover:text-slate-300 hover:bg-surface-container px-6 py-3 transition-colors">
            <span className="material-symbols-outlined text-lg">search</span>
            Search
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="xl:ml-64 pt-28 pb-12 px-8 flex-1">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Primary Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Featured Auction */}
            {featured?.price && (
              <section className="relative h-[500px] rounded-lg overflow-hidden bg-surface-container-low group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#111317] via-transparent to-[#e8910c]/10 z-10" />
                <div className="absolute inset-0 opacity-30 mix-blend-overlay">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1J6mJBMRGJOkHQaiehdy1ziAlfDqzi_JxGz0Snw-rFem4SsVE3wUtEYv77rIxrfFWcsEbRIdWsZNVp8GCR3ibQMcWZvZ3Spx374algqF8X7Xx92lIj6_x-U0eia86lKfu1fc76Z9UIRWneF0U2XVYg17-eO5m03h-eqU9jN03UTF5dmUgyM26U_y8ZLcl0L6EFlXnbmv1oTEOm0BdOAFM5S6Hoga8fxaf7kUI9rjXrVorDItnhqh6al2j52tG579oBrLxGbO51QLy=w2560"
                    alt="Featured Domain"
                  />
                </div>
                <div className="relative z-20 h-full p-12 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="px-4 py-1.5 rounded-full bg-primary-container/20 text-primary font-mono text-xs border border-primary/30 backdrop-blur-md">
                      DUTCH AUCTION • PRICE DECLINING
                    </span>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs font-mono mb-1 uppercase tracking-widest">Current Price</p>
                      <p className="text-tertiary font-mono text-3xl font-bold">
                        {formatSats(featured.price.totalPriceSats)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-7xl font-extrabold tracking-tighter font-headline mb-4">
                      {featured.name}<span className="text-primary font-mono">.btc</span>
                    </h1>
                    <div className="flex items-end gap-12">
                      <div>
                        <p className="text-slate-400 text-xs font-mono mb-1 uppercase tracking-widest">Auction Premium</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-on-background">
                            {formatSats(featured.price.auctionPriceSats)}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">above base</span>
                        </div>
                      </div>
                      <Link
                        to={`/register/${featured.name}?years=1`}
                        className="primary-gradient text-[#2b1700] px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 border-t border-white/5 pt-8">
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-mono mb-1">Base Price</p>
                      <p className="text-slate-300 text-xs font-mono">{basePrice ? formatSats(basePrice) : '...'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-mono mb-1">Renewal</p>
                      <p className="text-slate-300 text-xs font-mono">{formatSats(featured.price.renewalPerYear)}/yr</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-mono mb-1">Mechanism</p>
                      <p className="text-slate-300 text-xs font-mono">Price declines per block</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Auction Grid */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold font-headline">Premium Domains</h2>
                <p className="text-slate-400 text-xs font-mono">Prices decline every block until bought</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {auctions.slice(1).map((entry) => (
                  <div key={entry.name} className="bg-surface-container-low rounded-lg p-6 hover:bg-surface-container transition-all group border border-transparent hover:border-white/5">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h3 className="text-3xl font-extrabold font-headline mb-1">
                          {entry.name}<span className="text-primary font-mono text-xl">.btc</span>
                        </h3>
                        {entry.price && entry.price.auctionPriceSats > 0n && (
                          <p className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded bg-surface-container-high w-fit uppercase">
                            Premium — Dutch Auction
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-tertiary text-lg font-mono font-bold">
                          {entry.loading ? '...' : entry.price ? formatSats(entry.price.totalPriceSats) : 'N/A'}
                        </p>
                        <p className="text-[9px] text-slate-500 font-mono uppercase">Current Price</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        {entry.price && (
                          <>
                            <p className="text-slate-500 text-[10px] font-mono mb-1">AUCTION PREMIUM</p>
                            <p className="text-sm font-mono text-on-surface-variant">{formatSats(entry.price.auctionPriceSats)}</p>
                          </>
                        )}
                      </div>
                      <Link
                        to={`/register/${entry.name}?years=1`}
                        className="px-6 py-2 rounded-full border border-primary/40 text-primary text-xs font-bold hover:bg-primary/10 transition-colors"
                      >
                        Buy Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right: Stats Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-surface-container-low rounded-lg p-8">
              <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-6">Dutch Auction Mechanics</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <span className="text-slate-400 text-sm">Base Price</span>
                  <p className="text-lg font-bold font-mono">{basePrice ? formatSats(basePrice) : '...'}</p>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <span className="text-slate-400 text-sm">Mechanism</span>
                  <p className="text-sm font-mono text-on-surface-variant">Price ↓ per block</p>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-slate-400 text-sm">Network</span>
                  <p className="text-sm font-mono text-emerald-400">OPNet Testnet</p>
                </div>
              </div>
            </div>

            <div className="relative rounded-lg p-8 overflow-hidden">
              <div className="absolute inset-0 bg-primary/10 z-0" />
              <div className="relative z-10">
                <h4 className="text-xl font-bold font-headline mb-2 text-primary">How Dutch Auctions Work</h4>
                <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                  Premium domain prices start high and decline every block until they reach the base price.
                  Anyone can buy at the current price. The earlier you buy, the more you pay — but you
                  guarantee you get the name.
                </p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Renewal cost is a percentage of the purchase price, locked at the time of registration.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

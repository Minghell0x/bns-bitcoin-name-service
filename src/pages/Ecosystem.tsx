export default function Ecosystem() {
  return (
    <>
      {/* Side NavBar (Auction Specific) */}
      <aside className="h-screen w-64 fixed left-0 top-0 pt-24 pb-8 bg-[#1a1c1f] border-r border-white/5 flex-col z-40 hidden xl:flex">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-container">
            <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center border border-white/10 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-primary-container to-tertiary opacity-80" />
            </div>
            <div className="overflow-hidden">
              <p className="text-primary font-bold text-xs font-mono truncate">Sovereign Collector</p>
              <p className="text-slate-500 text-[10px] font-mono">0x71C...89B2</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-1 font-mono text-sm">
          <a className="flex items-center gap-3 bg-gradient-to-r from-[#e8910c]/20 to-transparent text-primary border-l-4 border-primary-container px-6 py-3 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-lg">gavel</span>
            Active Auctions
          </a>
          <a className="flex items-center gap-3 text-slate-500 hover:text-slate-300 hover:bg-surface-container px-6 py-3 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-lg">schedule</span>
            Ending Soon
          </a>
          <a className="flex items-center gap-3 text-slate-500 hover:text-slate-300 hover:bg-surface-container px-6 py-3 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-lg">trending_up</span>
            Top Bids
          </a>
          <a className="flex items-center gap-3 text-slate-500 hover:text-slate-300 hover:bg-surface-container px-6 py-3 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-lg">person_pin</span>
            Your Bids
          </a>
          <a className="flex items-center gap-3 text-slate-500 hover:text-slate-300 hover:bg-surface-container px-6 py-3 transition-colors duration-200" href="#">
            <span className="material-symbols-outlined text-lg">visibility</span>
            Watchlist
          </a>
        </div>

        <div className="px-6 py-6 border-t border-white/5 space-y-4">
          <button className="w-full bg-surface-container hover:bg-surface-container-high text-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Start Auction
          </button>
          <div className="space-y-1 font-mono text-[11px]">
            <a className="flex items-center gap-2 text-slate-500 hover:text-slate-300 py-2" href="#">
              <span className="material-symbols-outlined text-sm">settings</span>
              Settings
            </a>
            <a className="flex items-center gap-2 text-slate-500 hover:text-slate-300 py-2" href="#">
              <span className="material-symbols-outlined text-sm">help_outline</span>
              Support
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="xl:ml-64 pt-28 pb-12 px-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Primary Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Hero Featured Auction */}
            <section className="relative h-[500px] rounded-lg overflow-hidden bg-surface-container-low group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#111317] via-transparent to-[#e8910c]/10 z-10" />
              <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                <img
                  alt="Featured Domain BG"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1J6mJBMRGJOkHQaiehdy1ziAlfDqzi_JxGz0Snw-rFem4SsVE3wUtEYv77rIxrfFWcsEbRIdWsZNVp8GCR3ibQMcWZvZ3Spx374algqF8X7Xx92lIj6_x-U0eia86lKfu1fc76Z9UIRWneF0U2XVYg17-eO5m03h-eqU9jN03UTF5dmUgyM26U_y8ZLcl0L6EFlXnbmv1oTEOm0BdOAFM5S6Hoga8fxaf7kUI9rjXrVorDItnhqh6al2j52tG579oBrLxGbO51QLy=w2560"
                />
              </div>
              <div className="relative z-20 h-full p-12 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-4 py-1.5 rounded-full bg-primary-container/20 text-primary font-mono text-xs border border-primary/30 backdrop-blur-md">
                    LIVE AUCTION • ENDING SOON
                  </span>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs font-mono mb-1 uppercase tracking-widest">Time Remaining</p>
                    <p className="text-tertiary font-mono text-3xl font-bold">04:12:59</p>
                  </div>
                </div>
                <div>
                  <h1 className="text-7xl font-extrabold tracking-tighter font-headline mb-4">
                    satoshi<span className="text-primary font-mono">.btc</span>
                  </h1>
                  <div className="flex items-end gap-12">
                    <div>
                      <p className="text-slate-400 text-xs font-mono mb-1 uppercase tracking-widest">Current Bid</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-on-background">2.450</span>
                        <span className="text-primary font-mono text-xl">BTC</span>
                      </div>
                      <p className="text-slate-500 text-xs font-mono">≈ $164,820.00 USD</p>
                    </div>
                    <button className="primary-gradient text-[#2b1700] px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95">
                      Place Highest Bid
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 border-t border-white/5 pt-8">
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-mono mb-1">On-Chain DNA</p>
                    <p className="text-slate-300 text-xs font-mono">8f2e...d901</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-mono mb-1">Rarity Tier</p>
                    <p className="text-slate-300 text-xs font-mono">Tier 1 - Genesis</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-mono mb-1">Bid History</p>
                    <p className="text-slate-300 text-xs font-mono">142 Global Bids</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Auction Grid */}
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold font-headline">Premium Discoveries</h2>
                <div className="flex gap-4">
                  <button className="text-slate-400 text-xs font-mono hover:text-primary underline underline-offset-4">Sort: Ending Soon</button>
                  <button className="text-slate-400 text-xs font-mono hover:text-primary">Filter: 1-Letter</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {auctionCards.map((card) => (
                  <div key={card.name} className="bg-surface-container-low rounded-lg p-6 hover:bg-surface-container transition-all group border border-transparent hover:border-white/5">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <h3 className="text-3xl font-extrabold font-headline mb-1">
                          {card.name}<span className="text-primary font-mono text-xl">.btc</span>
                        </h3>
                        <p className="text-[10px] font-mono text-slate-500 px-2 py-0.5 rounded bg-surface-container-high w-fit uppercase">{card.tier}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-mono font-bold ${card.ending ? 'text-error' : 'text-tertiary'}`}>{card.time}</p>
                        <p className={`text-[9px] font-mono uppercase ${card.ending ? 'text-error' : 'text-slate-500'}`}>
                          {card.ending ? 'Ending!' : 'Ends'}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-slate-500 text-[10px] font-mono mb-1">LAST BID</p>
                        <p className="text-xl font-bold text-on-background font-mono">{card.bid} BTC</p>
                      </div>
                      <button className={`px-6 py-2 rounded-full text-xs font-bold transition-colors ${
                        card.ending
                          ? 'bg-primary text-[#2b1700] hover:brightness-110'
                          : 'border border-primary/40 text-primary hover:bg-primary/10'
                      }`}>
                        Place Bid
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar Stats */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Market Stats */}
            <div className="bg-surface-container-low rounded-lg p-8">
              <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-6">Market Metrics</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <span className="text-slate-400 text-sm">24h Volume</span>
                  <div className="text-right">
                    <p className="text-lg font-bold font-mono">12.42 BTC</p>
                    <p className="text-xs text-green-400">+12.4%</p>
                  </div>
                </div>
                <div className="flex justify-between items-end border-b border-white/5 pb-4">
                  <span className="text-slate-400 text-sm">Floor Price</span>
                  <div className="text-right">
                    <p className="text-lg font-bold font-mono">0.05 BTC</p>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-slate-400 text-sm">Active Bidders</span>
                  <div className="text-right">
                    <p className="text-lg font-bold font-mono">1,842</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Active Bids */}
            <div className="bg-surface-container rounded-lg p-8 border border-primary/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-mono text-xs text-primary uppercase tracking-widest">Your Active Bids</h3>
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-[10px] font-bold">2</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-surface-container-low border border-white/5 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold">hodl.btc</p>
                    <p className="text-[10px] font-mono text-slate-500">0.12 BTC Bid</p>
                  </div>
                  <span className="text-[10px] font-mono text-green-400 uppercase">Winning</span>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low border border-white/5 flex justify-between items-center opacity-70">
                  <div>
                    <p className="text-sm font-bold">pizza.btc</p>
                    <p className="text-[10px] font-mono text-slate-500">0.08 BTC Bid</p>
                  </div>
                  <span className="text-[10px] font-mono text-error uppercase">Outbid</span>
                </div>
              </div>
            </div>

            {/* Promotion Box */}
            <div className="relative rounded-lg p-8 overflow-hidden group">
              <div className="absolute inset-0 bg-primary/10 z-0" />
              <img
                alt="Promo"
                className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc-kpUuSDV0BQiRK21LIo5UtFrqXYID_seH6ek4osHvJe6zjD4QxWkY3vw0zTHxiwg5FSuFsBcDDtXRB50Q1HFGCcvZsfYOaNsY-HkL9yffIgTw7VZXJpOKc4oSnzAzSsXVl1aYytRHHvsc5aqTPgqDGeEUq0JeXc2vCmSTQ9zPveT6q6BF-e1pz160HlOGkyPHfRy2UpaO0BOAdkSPrHqj3nwNf0wSbLGQSoOshoeu7oWqC8tIPT6dEyXJETDbct32DBJxY59Ypuv=w2560"
              />
              <div className="relative z-10">
                <h4 className="text-xl font-bold font-headline mb-2 text-primary">Sovereign Tier Access</h4>
                <p className="text-slate-400 text-xs mb-6">Unlock exclusive access to Tier 1 domain drops and lower marketplace fees.</p>
                <button className="text-xs font-bold text-primary underline underline-offset-4 uppercase tracking-wider">Learn More</button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}

const auctionCards = [
  { name: 'bitcoin', tier: 'Tier 1 - Genesis', time: '12:45:01', bid: '0.88', ending: false },
  { name: 'hal', tier: 'Tier 2 - Historical', time: '02:11:44', bid: '0.45', ending: false },
  { name: 'genesis', tier: 'Tier 1 - Genesis', time: '18:04:22', bid: '1.12', ending: false },
  { name: 'ordinal', tier: 'Tier 3 - Rare', time: '00:45:12', bid: '0.19', ending: true },
]

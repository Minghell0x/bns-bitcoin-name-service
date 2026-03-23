import Countdown from '../components/Countdown'
import SearchBar from '../components/SearchBar'

export default function Landing() {
  return (
    <main className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 px-6 hero-gradient">
        {/* Background Visual: Geometric 3D Shard */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
          <img
            className="w-full max-w-6xl object-cover mix-blend-lighten"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5BblAPMJsxrihlMRbcDTUnM89rE_MRiEMxtRUxfrKW_8-uCRHZuSrhWYIemHUL_cSgvSRk4nYCPpTJ1tXBBh1s_80NgF7EfD5Q8N7liNe0lUD6dffeJAgb-u3qyPSNUDE0MhKHBlkZ6go7F43PlKkphWdJ8is39oTefQbvI017CKenS9GGmF-VP5cczSzi1_Asj3b2k41lEmpLz1ak5hXn8jZqhmYdrR5QXZPxoZLLQP4BTE3ME72VNlUZ4qFm_mfllYHZ3Hr9Iwr"
            alt="Abstract dark geometric 3D glass shards"
          />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
          {/* Countdown */}
          <Countdown />

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter font-headline leading-[0.9] mb-12">
            Your Identity on <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-primary">
              Bitcoin
            </span>
            <span className="font-mono text-primary font-bold">.btc</span>
          </h1>

          {/* Search Bar */}
          <div className="mb-20">
            <SearchBar size="hero" />
          </div>

          {/* Subtle Metadata */}
          <div className="font-mono text-[11px] text-outline/40 uppercase tracking-[0.4em] mt-8">
            Satoshi-Era Integrity • Layer 1 Security
          </div>
        </div>
      </section>

      {/* Value Proposition Section: Bento/Asymmetric Cards */}
      <section className="max-w-screen-2xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Own Your Identity Card */}
          <div className="md:col-span-7 bg-surface-container-low rounded-lg overflow-hidden group hover:bg-surface-container transition-colors duration-500">
            <div className="flex flex-col md:flex-row h-full">
              <div className="p-12 md:w-1/2 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-4 block">
                    Sovereignty
                  </span>
                  <h2 className="text-4xl font-extrabold font-headline leading-tight mb-6">
                    Own Your <br />Digital Identity
                  </h2>
                  <p className="text-on-surface-variant text-sm leading-relaxed max-w-xs">
                    Your .btc name is more than a handle—it's a decentralized asset secured by the most
                    robust network in history.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-primary font-headline font-bold text-sm">
                  View Identity Specs{' '}
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
              <div className="md:w-1/2 relative bg-surface-container-highest overflow-hidden">
                <img
                  className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBt4JEjHKad6EbZO1NdH2Ceoa4Nvjvnb3iOmP4XKw2VLLAO7PJc5D0jBvpj-X14hXQd_AK6ycDGfUg5e-IdM9pzch9LrKskZ5D0Jt9LcWKp6bc73jsg_Kw8sT0t9Y5q4OJozOA6WHeM4LnLEs-yZBv3qUgbSogne_qQ_-7LYvo6aP_vJO-zHz4esLoY29tHY5J49igyj2e37bH3tw8kmzWQKR_7iEVjPZT3A7lBmnHA55J5gcIm9o6dBmR89hbZ0ORxo3w9agXc0qj"
                  alt="Sleek digital identity card UI concept"
                />
              </div>
            </div>
          </div>

          {/* Stats Column */}
          <div className="md:col-span-5 grid grid-rows-2 gap-10">
            <div className="bg-surface-container-low rounded-lg p-10 flex flex-col justify-center border-l-2 border-primary/20">
              <h3 className="font-mono text-tertiary text-4xl font-bold mb-2">248.9k</h3>
              <p className="font-headline font-semibold text-outline uppercase text-[10px] tracking-widest">
                Active Registrations
              </p>
            </div>
            <div className="bg-surface-container-low rounded-lg p-10 flex flex-col justify-center border-l-2 border-primary/20">
              <h3 className="font-mono text-tertiary text-4xl font-bold mb-2">10.4 BTC</h3>
              <p className="font-headline font-semibold text-outline uppercase text-[10px] tracking-widest">
                Volume Traded (24h)
              </p>
            </div>
          </div>

          {/* Infrastructure Card */}
          <div className="md:col-span-12 bg-surface-container-low rounded-lg overflow-hidden group">
            <div className="flex flex-col md:flex-row-reverse items-stretch">
              <div className="p-12 md:w-1/2 flex flex-col justify-center">
                <span className="font-mono text-[10px] text-primary uppercase tracking-widest mb-4 block">
                  Infrastructure
                </span>
                <h2 className="text-5xl font-extrabold font-headline leading-tight mb-8">
                  The Foundation for a <br />Decentralized Web
                </h2>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-10 max-w-lg">
                  BNS provides the naming infrastructure that transforms Bitcoin from a currency into a
                  global, uncensorable settlement layer for the next internet.
                </p>
                <div className="flex gap-4">
                  <button className="bg-secondary-container text-on-secondary-container px-8 py-3 rounded-full font-headline font-bold transition-transform active:scale-95">
                    Read Whitepaper
                  </button>
                  <button className="text-on-surface px-8 py-3 rounded-full font-headline font-bold border border-outline-variant/30 hover:bg-white/5 transition-colors">
                    Developer API
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 h-80 md:h-auto relative">
                <img
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCT--CU8PkVD5zLxJ-XNqJg4-uKgIaYXUt9P6-aynmc9dwSHOzZdiPtP3HC2FKIgZIklG9OgFkgWZhEj0SnUV7QCMvXsPHJLDQd8K1WHBEF0PgCpuii1jdXJJl1C7kdgm7W65ufyZzk6d66L_44pIF11yWNctlnH2fZAg10gciFouk_Y-_kzQx40KiZahVpOoqKuNDKGwLxlIuAHOBE69Tyg5R-Xys8GoHO0ByOijkbdw8inK6Ob5tL8CA7wSKOvC6qL07mtBcWyMt2"
                  alt="Technical network infrastructure visualization"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

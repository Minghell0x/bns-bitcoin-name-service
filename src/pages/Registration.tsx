import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ProgressStepper from '../components/ProgressStepper'

const steps = [
  { number: 1, label: 'Reserve' },
  { number: 2, label: 'Payment' },
  { number: 3, label: 'Complete' },
]

export default function Registration() {
  const { domain = '' } = useParams()
  const navigate = useNavigate()
  const [currentStep] = useState(2)

  function handleComplete() {
    navigate(`/success/${domain}`)
  }

  return (
    <main className="flex-grow pt-32 pb-20 px-6 bg-mesh">
      <div className="max-w-4xl mx-auto">
        {/* Signature Domain Header */}
        <header className="mb-16 text-center">
          <div className="inline-block py-2 px-4 rounded-full bg-surface-container-low mb-4">
            <span className="text-tertiary font-mono text-xs uppercase tracking-[0.2em]">
              Registration in progress
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-extrabold font-headline tracking-tighter">
            {domain}
            <span className="text-primary font-mono">.btc</span>
          </h1>
        </header>

        {/* Main Registration Card */}
        <div className="bg-[#161820] rounded-[16px] p-8 md:p-12 shadow-2xl relative overflow-hidden outline outline-1 outline-white/5">
          <ProgressStepper steps={steps} currentStep={currentStep} />

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column: Step Details */}
            <div className="space-y-8">
              {/* Step 1: Reserve */}
              <section>
                <h2 className="text-sm font-mono text-primary uppercase tracking-widest mb-4">
                  Step 1: Reserve Name
                </h2>
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-surface-container-low border border-white/5">
                  <div className="relative w-8 h-8">
                    {currentStep > 1 ? (
                      <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
                    ) : (
                      <span className="material-symbols-outlined text-primary text-2xl animate-pulse">sync</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface">
                      {currentStep > 1 ? 'Domain reserved' : 'Locking your domain...'}
                    </p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      This step prevents others from sniping your name during the registration process.
                    </p>
                  </div>
                </div>
              </section>

              {/* Step 2: Payment */}
              <section>
                <h2 className="text-sm font-mono text-primary uppercase tracking-widest mb-4">
                  Step 2: Payment
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-on-surface-variant text-sm">Required Amount</span>
                    <span className="text-3xl font-mono font-bold text-tertiary tracking-tighter">
                      25,000 <span className="text-xs font-normal">SATS</span>
                    </span>
                  </div>
                  <div className="p-4 bg-surface-container-lowest rounded-xl font-mono text-[11px] break-all border border-white/5 text-on-surface-variant flex items-center justify-between group">
                    <span>bc1q...x7v93k8p0q2m92l0</span>
                    <button className="material-symbols-outlined text-sm cursor-pointer hover:text-primary transition-colors">
                      content_copy
                    </button>
                  </div>
                </div>
              </section>

              {/* Status */}
              <div className="pt-4 flex items-center gap-3 text-tertiary-fixed-dim">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="text-xs font-mono uppercase tracking-widest">
                  Waiting for payment confirmation...
                </span>
              </div>
            </div>

            {/* Right Column: QR Code */}
            <div className="flex flex-col items-center justify-center bg-surface-container-low p-8 rounded-2xl aspect-square border border-white/5">
              <div className="bg-white p-3 rounded-lg shadow-inner mb-6">
                <div className="w-40 h-40 bg-gray-200 rounded flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-gray-400">qr_code_2</span>
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-bold uppercase tracking-tighter text-on-surface">
                  Scan with Wallet
                </p>
                <p className="text-[10px] text-on-surface-variant font-mono">BTC Treasury Address</p>
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
            <p className="text-[10px] text-on-surface-variant leading-tight max-w-xs">
              Transaction status is monitored automatically. Your domain will be finalized once the
              network confirms your payment.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleComplete}
                className="w-full md:w-auto px-8 py-3 rounded-full primary-gradient text-[#2b1700] font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                Simulate Complete
              </button>
              <button className="w-full md:w-auto px-8 py-3 rounded-full bg-surface-container-highest text-on-surface-variant hover:text-white transition-colors text-xs font-bold uppercase tracking-widest border border-white/5">
                Need Help?
              </button>
            </div>
          </div>
        </div>

        {/* Technical Data Footer */}
        <div className="mt-12 flex justify-center gap-12 opacity-20 hover:opacity-100 transition-opacity duration-700">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono">OPNET_VER</span>
            <span className="text-[10px] font-mono">1.0.42-STABLE</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono">GAS_FEE</span>
            <span className="text-[10px] font-mono">18 SATS/VB</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono">BLOCK_HT</span>
            <span className="text-[10px] font-mono">842,912</span>
          </div>
        </div>
      </div>
    </main>
  )
}

import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import ProgressStepper from '../components/ProgressStepper'
import WalletGuard from '../components/WalletGuard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorState from '../components/ErrorState'
import { useWallet } from '../contexts/WalletContext'
import {
  fetchDomainPrice,
  fetchTreasuryAddress,
  fetchReservation,
  reserveDomainTx,
  completeRegistrationTx,
} from '../services/DomainService'
import { formatSats, formatSatsAsBtc } from '../utils/formatting'
import { addOwnedDomain } from '../utils/storage'
import type { DomainPrice } from '../types'

const steps = [
  { number: 1, label: 'Reserve' },
  { number: 2, label: 'Payment' },
  { number: 3, label: 'Complete' },
]

export default function Registration() {
  const { domain = '' } = useParams()
  const [searchParams] = useSearchParams()
  const years = Number(searchParams.get('years') || '1')
  const navigate = useNavigate()
  const { walletAddress, provider: walletProvider, address } = useWallet()

  const [currentStep, setCurrentStep] = useState(1)
  const [price, setPrice] = useState<DomainPrice | null>(null)
  const [treasuryAddr, setTreasuryAddr] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [txPending, setTxPending] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      try {
        const [priceResult, treasury, reservation] = await Promise.all([
          fetchDomainPrice(domain, years),
          fetchTreasuryAddress(),
          fetchReservation(domain),
        ])
        setPrice(priceResult)
        setTreasuryAddr(treasury)

        if (reservation.isActive && walletAddress && reservation.reserver.toLowerCase() === walletAddress.toLowerCase()) {
          setCurrentStep(2)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load registration data')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [domain, years, walletAddress])

  async function handleReserve() {
    if (!walletAddress) return
    setTxPending(true)
    setError(null)
    try {
      const result = await reserveDomainTx(domain, years, walletAddress, walletProvider, address)
      setTxHash(result.txHash)
      setCurrentStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reserve domain')
    } finally {
      setTxPending(false)
    }
  }

  async function handleComplete() {
    if (!walletAddress) return
    setTxPending(true)
    setError(null)
    try {
      const result = await completeRegistrationTx(domain, walletAddress, walletProvider, address)
      addOwnedDomain(walletAddress, domain)
      navigate(`/success/${domain}`, { state: { txHash: result.txHash } })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed. Payment may not be confirmed yet — try again in a few minutes.',
      )
    } finally {
      setTxPending(false)
    }
  }

  const btcAmount = price ? formatSatsAsBtc(price.totalPriceSats) : '0'
  const btcUri = treasuryAddr ? `bitcoin:${treasuryAddr}?amount=${btcAmount}` : ''

  return (
    <WalletGuard message="Connect your OP_WALLET to register .btc domains on Bitcoin Layer 1.">
      <main className="flex-grow pt-32 pb-20 px-6 bg-mesh">
        <div className="max-w-4xl mx-auto">
          <header className="mb-16 text-center">
            <div className="inline-block py-2 px-4 rounded-full bg-surface-container-low mb-4">
              <span className="text-tertiary font-mono text-xs uppercase tracking-[0.2em]">
                Registration in progress
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold font-headline tracking-tighter">
              {domain}<span className="text-primary font-mono">.btc</span>
            </h1>
          </header>

          {loading ? (
            <LoadingSkeleton type="card" />
          ) : error && !price ? (
            <ErrorState message={error} onRetry={() => window.location.reload()} />
          ) : (
            <div className="bg-[#161820] rounded-[16px] p-8 md:p-12 shadow-2xl relative overflow-hidden outline outline-1 outline-white/5">
              <ProgressStepper steps={steps} currentStep={currentStep} />

              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                  {/* Step 1: Reserve */}
                  <section>
                    <h2 className="text-sm font-mono text-primary uppercase tracking-widest mb-4">
                      Step 1: Reserve Name
                    </h2>
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-surface-container-low border border-white/5">
                      <span className={`material-symbols-outlined text-primary text-2xl ${currentStep === 1 ? 'animate-pulse' : ''}`}>
                        {currentStep > 1 ? 'check_circle' : 'sync'}
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface">
                          {currentStep > 1 ? 'Domain reserved' : 'Lock your domain name'}
                        </p>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          Prevents others from sniping your name during registration.
                        </p>
                      </div>
                    </div>
                    {currentStep === 1 && (
                      <button
                        onClick={handleReserve}
                        disabled={txPending}
                        className="mt-4 w-full py-4 rounded-full primary-gradient text-[#2b1700] font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        {txPending ? 'Reserving...' : `Reserve ${domain}.btc`}
                      </button>
                    )}
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
                          {price ? formatSats(price.totalPriceSats) : '...'}
                        </span>
                      </div>
                      <div className="p-4 bg-surface-container-lowest rounded-xl font-mono text-[11px] break-all border border-white/5 text-on-surface-variant flex items-center justify-between">
                        <span>{treasuryAddr || 'Loading treasury address...'}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(treasuryAddr)}
                          className="material-symbols-outlined text-sm cursor-pointer hover:text-primary transition-colors ml-2"
                        >
                          content_copy
                        </button>
                      </div>
                    </div>
                  </section>

                  {currentStep === 2 && (
                    <div className="pt-4 flex items-center gap-3 text-tertiary">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span className="text-xs font-mono uppercase tracking-widest">
                        Send BTC to treasury, then complete below
                      </span>
                    </div>
                  )}

                  {txHash && (
                    <div className="p-3 bg-surface-container-low rounded-xl">
                      <p className="text-[10px] font-mono text-outline uppercase tracking-widest mb-1">Transaction</p>
                      <p className="text-xs font-mono text-primary truncate">{txHash}</p>
                    </div>
                  )}

                  {error && <p className="text-error text-sm">{error}</p>}
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center justify-center bg-surface-container-low p-8 rounded-2xl aspect-square border border-white/5">
                  {treasuryAddr ? (
                    <>
                      <div className="bg-white p-3 rounded-lg shadow-inner mb-6">
                        <QRCodeSVG
                          value={btcUri}
                          size={160}
                          bgColor="#ffffff"
                          fgColor="#111317"
                          level="M"
                        />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs font-bold uppercase tracking-tighter text-on-surface">Scan with Wallet</p>
                        <p className="text-[10px] text-on-surface-variant font-mono">
                          {btcAmount} BTC to Treasury
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center w-40 h-40">
                      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
                <p className="text-[10px] text-on-surface-variant leading-tight max-w-xs">
                  Your domain will be finalized once the network confirms your payment.
                  Signet blocks may take up to 15 minutes.
                </p>
                {currentStep >= 2 && (
                  <button
                    onClick={handleComplete}
                    disabled={txPending}
                    className="w-full md:w-auto px-8 py-3 rounded-full primary-gradient text-[#2b1700] font-bold text-sm uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                  >
                    {txPending ? 'Completing...' : "I've Paid — Complete Registration"}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-center gap-12 opacity-20 hover:opacity-100 transition-opacity duration-700">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono">NETWORK</span>
              <span className="text-[10px] font-mono">OPNET TESTNET</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono">YEARS</span>
              <span className="text-[10px] font-mono">{years}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono">DOMAIN</span>
              <span className="text-[10px] font-mono">{domain}.btc</span>
            </div>
          </div>
        </div>
      </main>
    </WalletGuard>
  )
}

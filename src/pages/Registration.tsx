import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProgressStepper from '../components/ProgressStepper'
import WalletGuard from '../components/WalletGuard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorState from '../components/ErrorState'
import { useWallet } from '../contexts/WalletContext'
import {
  fetchDomainPrice,
  fetchReservation,
  reserveDomainTx,
  completeRegistrationTx,
} from '../services/DomainService'
import { formatSats } from '../utils/formatting'
import { addOwnedDomain } from '../utils/storage'
import type { DomainPrice } from '../types'

const steps = [
  { number: 1, label: 'Reserve & Pay' },
  { number: 2, label: 'Confirm' },
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [txPending, setTxPending] = useState(false)
  const [reserveTxHash, setReserveTxHash] = useState<string | null>(null)

  // Fetch price and check reservation on mount
  useEffect(() => {
    async function init() {
      try {
        const [priceResult, reservation] = await Promise.all([
          fetchDomainPrice(domain, years),
          fetchReservation(domain),
        ])
        setPrice(priceResult)

        // If already reserved by this user, skip to step 2
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

  // Step 1: Reserve + Pay in ONE transaction (OP_WALLET signs, BTC sent via extraOutputs)
  async function handleReserveAndPay() {
    if (!walletAddress) return
    setTxPending(true)
    setError(null)
    try {
      const result = await reserveDomainTx(domain, years, walletAddress, walletProvider, address)
      setReserveTxHash(result.txHash)
      setCurrentStep(2)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to reserve domain'
      // If already reserved, just advance to step 2
      if (msg.toLowerCase().includes('already reserved')) {
        setCurrentStep(2)
      } else {
        setError(msg)
      }
    } finally {
      setTxPending(false)
    }
  }

  // Step 2: Complete registration (OP_WALLET signs second tx)
  async function handleComplete() {
    if (!walletAddress) return
    setTxPending(true)
    setError(null)
    try {
      const result = await completeRegistrationTx(domain, walletAddress, walletProvider, address)
      addOwnedDomain(walletAddress, domain)
      setCurrentStep(3)
      navigate(`/success/${domain}`, { state: { txHash: result.txHash } })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration not yet confirmed. The reservation transaction may still be pending — wait a few minutes and try again.',
      )
    } finally {
      setTxPending(false)
    }
  }

  return (
    <WalletGuard message="Connect your OP_WALLET to register .btc domains on Bitcoin Layer 1.">
      <main className="flex-grow pt-32 pb-20 px-6 bg-mesh">
        <div className="max-w-3xl mx-auto">
          {/* Domain Header */}
          <header className="mb-16 text-center">
            <div className="inline-block py-2 px-4 rounded-full bg-surface-container-low mb-4">
              <span className="text-tertiary font-mono text-xs uppercase tracking-[0.2em]">
                Registration
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold font-headline tracking-tighter">
              {domain}<span className="text-primary font-mono">.btc</span>
            </h1>
            {price && (
              <p className="mt-4 text-2xl font-mono text-tertiary font-bold">
                {formatSats(price.totalPriceSats)}
              </p>
            )}
          </header>

          {loading ? (
            <LoadingSkeleton type="card" />
          ) : error && !price ? (
            <ErrorState message={error} onRetry={() => window.location.reload()} />
          ) : (
            <div className="bg-[#161820] rounded-[16px] p-8 md:p-12 shadow-2xl relative overflow-hidden outline outline-1 outline-white/5">
              <ProgressStepper steps={steps} currentStep={currentStep} />

              <div className="space-y-8">
                {/* Step 1: Reserve & Pay */}
                <section className="flex items-start gap-4 p-6 rounded-2xl bg-surface-container-low border border-white/5">
                  <span className={`material-symbols-outlined text-primary text-2xl mt-0.5 ${currentStep === 1 ? 'animate-pulse' : ''}`}>
                    {currentStep > 1 ? 'check_circle' : 'lock'}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-on-surface mb-1">
                      {currentStep > 1 ? 'Reserved & Paid' : 'Reserve & Pay'}
                    </p>
                    <p className="text-xs text-on-surface-variant leading-relaxed mb-1">
                      {currentStep > 1
                        ? 'Your domain is locked and payment has been sent to the treasury.'
                        : 'OP_WALLET will open to sign one transaction that reserves your name and sends payment.'}
                    </p>
                    {price && currentStep === 1 && (
                      <p className="text-xs font-mono text-tertiary">
                        Total: {formatSats(price.totalPriceSats)} for {years} {years === 1 ? 'year' : 'years'}
                      </p>
                    )}
                  </div>
                </section>

                {/* Step 2: Wait + Complete */}
                <section className={`flex items-start gap-4 p-6 rounded-2xl border border-white/5 ${currentStep >= 2 ? 'bg-surface-container-low' : 'bg-surface-container-lowest opacity-40'}`}>
                  <span className={`material-symbols-outlined text-2xl mt-0.5 ${currentStep === 2 ? 'text-primary animate-pulse' : currentStep > 2 ? 'text-primary' : 'text-outline'}`}>
                    {currentStep > 2 ? 'check_circle' : currentStep === 2 ? 'hourglass_top' : 'pending'}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-on-surface mb-1">
                      {currentStep > 2 ? 'Registration Complete' : 'Finalize Registration'}
                    </p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {currentStep >= 2
                        ? 'Once the reservation transaction is confirmed on-chain, click below to finalize. Signet blocks may take up to 15 minutes.'
                        : 'After the reservation is confirmed, you\'ll finalize your registration.'}
                    </p>
                  </div>
                </section>

                {/* Transaction Hash */}
                {reserveTxHash && (
                  <div className="p-4 bg-surface-container-lowest rounded-xl border border-white/5">
                    <p className="text-[10px] font-mono text-outline uppercase tracking-widest mb-1">Reservation Transaction</p>
                    <p className="text-xs font-mono text-primary break-all">{reserveTxHash}</p>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="p-4 bg-error-container/10 rounded-xl border border-error/20">
                    <p className="text-error text-sm">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4">
                  {currentStep === 1 && (
                    <button
                      onClick={handleReserveAndPay}
                      disabled={txPending}
                      className="w-full py-5 rounded-full primary-gradient text-[#2b1700] font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {txPending ? (
                        <span className="flex items-center justify-center gap-3">
                          <span className="w-5 h-5 border-2 border-[#2b1700]/30 border-t-[#2b1700] rounded-full animate-spin" />
                          Signing with OP_WALLET...
                        </span>
                      ) : (
                        `Register ${domain}.btc — ${price ? formatSats(price.totalPriceSats) : '...'}`
                      )}
                    </button>
                  )}

                  {currentStep === 2 && (
                    <button
                      onClick={handleComplete}
                      disabled={txPending}
                      className="w-full py-5 rounded-full primary-gradient text-[#2b1700] font-bold text-lg transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {txPending ? (
                        <span className="flex items-center justify-center gap-3">
                          <span className="w-5 h-5 border-2 border-[#2b1700]/30 border-t-[#2b1700] rounded-full animate-spin" />
                          Finalizing...
                        </span>
                      ) : (
                        'Complete Registration'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Technical Footer */}
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

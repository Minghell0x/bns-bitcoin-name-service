import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
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
  { number: 2, label: 'Confirming' },
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
  const [reservationConfirmed, setReservationConfirmed] = useState(false)
  const [polling, setPolling] = useState(false)

  // Fetch price and check reservation on mount
  useEffect(() => {
    async function init() {
      try {
        const [priceResult, reservation] = await Promise.all([
          fetchDomainPrice(domain, years),
          fetchReservation(domain),
        ])
        setPrice(priceResult)

        if (reservation.isActive && walletAddress && reservation.reserver.toLowerCase() === walletAddress.toLowerCase()) {
          setCurrentStep(3)
          setReservationConfirmed(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load registration data')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [domain, years, walletAddress])

  // Poll for reservation confirmation after reserve tx
  const pollReservation = useCallback(async () => {
    if (!domain) return false
    try {
      const reservation = await fetchReservation(domain)
      if (reservation.isActive) {
        setReservationConfirmed(true)
        setCurrentStep(3)
        return true
      }
    } catch { /* not confirmed yet */ }
    return false
  }, [domain])

  useEffect(() => {
    if (currentStep !== 2 || reservationConfirmed) return
    setPolling(true)
    let mounted = true

    const interval = setInterval(async () => {
      if (!mounted) return
      const confirmed = await pollReservation()
      if (confirmed && mounted) {
        clearInterval(interval)
        setPolling(false)
      }
    }, 10_000) // Poll every 10 seconds

    // Also check immediately
    pollReservation()

    return () => {
      mounted = false
      clearInterval(interval)
      setPolling(false)
    }
  }, [currentStep, reservationConfirmed, pollReservation])

  // Step 1: Reserve + Pay
  async function handleReserveAndPay() {
    if (!walletAddress) return
    setTxPending(true)
    setError(null)
    try {
      const result = await reserveDomainTx(domain, years, walletAddress, walletProvider, address)
      setReserveTxHash(result.txHash)
      setCurrentStep(2) // Move to "waiting for confirmation"
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to reserve domain'
      if (msg.toLowerCase().includes('already reserved')) {
        setCurrentStep(2)
        pollReservation() // Check if already confirmed
      } else {
        setError(msg)
      }
    } finally {
      setTxPending(false)
    }
  }

  // Step 3: Complete registration
  async function handleComplete() {
    if (!walletAddress) return
    setTxPending(true)
    setError(null)
    try {
      const result = await completeRegistrationTx(domain, years, walletAddress, walletProvider, address)
      addOwnedDomain(walletAddress, domain)
      navigate(`/success/${domain}`, { state: { txHash: result.txHash } })
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.toLowerCase().includes('no reservation') || msg.toLowerCase().includes('insufficient payment')) {
        setError('Reservation not yet confirmed on-chain. Please wait a moment and try again.')
        setReservationConfirmed(false)
        setCurrentStep(2)
      } else {
        setError(msg || 'Registration failed. Please try again.')
      }
    } finally {
      setTxPending(false)
    }
  }

  return (
    <WalletGuard message="Connect your OP_WALLET to register .btc domains on Bitcoin Layer 1.">
      <main className="flex-grow pt-32 pb-20 px-6 bg-mesh">
        <div className="max-w-3xl mx-auto">
          <header className="mb-16 text-center animate-fade-up">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold font-headline tracking-tighter">
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
            <div className="bg-[#161820] rounded-[16px] p-8 md:p-12 shadow-2xl relative overflow-hidden outline outline-1 outline-white/5 animate-scale-in delay-200">
              <ProgressStepper steps={steps} currentStep={currentStep} />

              {/* ── STEP 1: Reserve & Pay ── */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-surface-container-low border border-white/5">
                    <span className="material-symbols-outlined text-primary text-2xl mt-0.5">lock</span>
                    <div>
                      <p className="font-semibold text-on-surface mb-1">Reserve & Pay</p>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        OP_WALLET will open to sign one transaction that reserves your name and sends payment to the treasury.
                      </p>
                      {price && (
                        <p className="text-xs font-mono text-tertiary mt-2">
                          Total: {formatSats(price.totalPriceSats)} for {years} {years === 1 ? 'year' : 'years'}
                        </p>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-error-container/10 rounded-xl border border-error/20">
                      <p className="text-error text-sm">{error}</p>
                    </div>
                  )}

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
                </div>
              )}

              {/* ── STEP 2: Waiting for Confirmation ── */}
              {currentStep === 2 && (
                <div className="flex flex-col items-center py-8 space-y-6">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold font-headline mb-2">Waiting for Confirmation</h3>
                    <p className="text-on-surface-variant text-sm max-w-md">
                      Your reservation transaction has been submitted. Waiting for it to be confirmed on-chain.
                      Signet blocks can take up to 15 minutes.
                    </p>
                  </div>

                  {reserveTxHash && (
                    <a
                      href={`https://mempool.opnet.org/it/testnet4/tx/${reserveTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full max-w-md p-4 bg-surface-container-lowest rounded-xl border border-white/5 hover:border-primary/20 transition-colors group"
                    >
                      <p className="text-[10px] font-mono text-outline uppercase tracking-widest mb-1">Transaction</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-mono text-primary break-all flex-1">{reserveTxHash}</p>
                        <span className="material-symbols-outlined text-sm text-outline group-hover:text-primary transition-colors">open_in_new</span>
                      </div>
                    </a>
                  )}

                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm animate-pulse">schedule</span>
                    <span className="text-xs font-mono uppercase tracking-widest">
                      {polling ? 'Checking every 10s...' : 'Checking...'}
                    </span>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Complete Registration ── */}
              {currentStep === 3 && reservationConfirmed && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-surface-container-low border border-white/5">
                    <span className="material-symbols-outlined text-primary text-2xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <div>
                      <p className="font-semibold text-on-surface mb-1">Reservation Confirmed</p>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Your domain is reserved. Sign one more transaction to finalize your registration.
                      </p>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-error-container/10 rounded-xl border border-error/20">
                      <p className="text-error text-sm">{error}</p>
                    </div>
                  )}

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
                </div>
              )}
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

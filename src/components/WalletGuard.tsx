import { useWallet } from '../contexts/WalletContext'

interface WalletGuardProps {
  children: React.ReactNode
  message?: string
}

export default function WalletGuard({ children, message }: WalletGuardProps) {
  const { isConnected, connect } = useWallet()

  if (isConnected) {
    return <>{children}</>
  }

  return (
    <div className="flex-grow flex items-center justify-center px-6 pt-32 pb-20">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-surface-container-low flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-primary">account_balance_wallet</span>
        </div>
        <h2 className="text-3xl font-bold font-headline tracking-tight mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
          {message || 'Connect your OP_WALLET to access this feature and manage your .btc domains.'}
        </p>
        <button
          onClick={connect}
          className="primary-gradient text-[#2b1700] px-10 py-4 rounded-full font-headline font-bold text-lg hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95"
        >
          Connect OP_WALLET
        </button>
      </div>
    </div>
  )
}

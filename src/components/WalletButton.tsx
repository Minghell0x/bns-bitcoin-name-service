import { useWallet } from '../contexts/WalletContext'
import { formatAddress } from '../utils/formatting'

export default function WalletButton() {
  const { isConnected, address, connect, disconnect } = useWallet()

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low border border-outline-variant/10">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-xs text-on-surface">{formatAddress(address)}</span>
        </div>
        <button
          onClick={disconnect}
          className="p-2 text-slate-400 hover:text-primary hover:bg-surface-container rounded-full transition-all"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={connect}
      className="primary-gradient text-[#2b1700] px-6 py-2.5 rounded-full font-headline font-bold active:scale-95 duration-200 transition-all hover:shadow-[0_0_20px_rgba(232,145,12,0.3)]"
    >
      Connect Wallet
    </button>
  )
}

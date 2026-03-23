import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useWalletConnect } from '@btc-vision/walletconnect'
import type { AbstractRpcProvider } from 'opnet'
import type { Address } from '@btc-vision/transaction'
import type { WalletBalance } from '@btc-vision/walletconnect'
import { formatAddress } from '../utils/formatting'

export interface WalletState {
  address: Address | null
  walletAddress: string | null
  publicKey: string | null
  hashedMLDSAKey: string | null
  isConnected: boolean
  displayAddress: string
  connect: () => void
  disconnect: () => void
  provider: AbstractRpcProvider | null
  balance: WalletBalance | null
  connecting: boolean
}

const WalletContext = createContext<WalletState>({
  address: null,
  walletAddress: null,
  publicKey: null,
  hashedMLDSAKey: null,
  isConnected: false,
  displayAddress: '',
  connect: () => {},
  disconnect: () => {},
  provider: null,
  balance: null,
  connecting: false,
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const wc = useWalletConnect()

  const state = useMemo<WalletState>(() => {
    const isConnected = wc.publicKey !== null
    return {
      address: wc.address,
      walletAddress: wc.walletAddress,
      publicKey: wc.publicKey,
      hashedMLDSAKey: wc.hashedMLDSAKey,
      isConnected,
      displayAddress: wc.walletAddress ? formatAddress(wc.walletAddress) : '',
      connect: () => wc.openConnectModal(),
      disconnect: () => wc.disconnect(),
      provider: wc.provider,
      balance: wc.walletBalance,
      connecting: wc.connecting,
    }
  }, [wc])

  return (
    <WalletContext.Provider value={state}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet(): WalletState {
  return useContext(WalletContext)
}

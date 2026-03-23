import { createContext, useContext, useMemo, type ReactNode } from 'react'

interface WalletState {
  address: string | null
  isConnected: boolean
  displayAddress: string
  connect: () => void
  disconnect: () => void
}

const WalletContext = createContext<WalletState>({
  address: null,
  isConnected: false,
  displayAddress: '',
  connect: () => {},
  disconnect: () => {},
})

export function WalletProvider({ children }: { children: ReactNode }) {
  // TODO: Wire to @btc-vision/walletconnect once we verify the package API
  // For now, provide a stub that can be connected manually
  const state = useMemo<WalletState>(() => ({
    address: null,
    isConnected: false,
    displayAddress: '',
    connect: () => {
      console.log('[BNS] Wallet connect requested — OP_WALLET integration pending')
    },
    disconnect: () => {
      console.log('[BNS] Wallet disconnect requested')
    },
  }), [])

  return (
    <WalletContext.Provider value={state}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet(): WalletState {
  return useContext(WalletContext)
}

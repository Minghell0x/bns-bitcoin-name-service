import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useWalletConnect } from '@btc-vision/walletconnect'
import type { AbstractRpcProvider } from 'opnet'
import type { Address } from '@btc-vision/transaction'
import type { WalletBalance } from '@btc-vision/walletconnect'
import { formatAddress } from '../utils/formatting'
import { getProvider } from '../services/ProviderService'

export interface WalletState {
  address: Address | null
  walletAddress: string | null
  publicKey: string | null
  addressHex: string | null
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
  addressHex: null,
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
  const [addressHex, setAddressHex] = useState<string | null>(null)

  // Resolve wallet address to OPNet Address to get ML-DSA hash for ownership comparison
  useEffect(() => {
    async function resolveAddress() {
      if (wc.walletAddress && wc.publicKey) {
        try {
          // First try walletconnect's hashedMLDSAKey
          if (wc.hashedMLDSAKey) {
            setAddressHex('0x' + wc.hashedMLDSAKey.replace(/^0x/, ''))
            return
          }
          // Fallback: resolve via provider.getPublicKeyInfo
          const provider = getProvider()
          console.log('[BNS Wallet] Resolving address via getPublicKeyInfo for:', wc.walletAddress)
          const resolved = await provider.getPublicKeyInfo(wc.walletAddress, false)
          console.log('[BNS Wallet] Resolved:', resolved, 'toHex:', resolved?.toHex?.())
          if (resolved) {
            setAddressHex(resolved.toHex())
          } else {
            console.warn('[BNS Wallet] getPublicKeyInfo returned undefined')
          }
        } catch (err) {
          console.error('[BNS] Failed to resolve address hex:', err)
        }
      } else {
        setAddressHex(null)
      }
    }
    resolveAddress()
  }, [wc.walletAddress, wc.publicKey, wc.hashedMLDSAKey])

  const state = useMemo<WalletState>(() => {
    const isConnected = wc.publicKey !== null
    return {
      address: wc.address,
      walletAddress: wc.walletAddress,
      publicKey: wc.publicKey,
      addressHex,
      isConnected,
      displayAddress: wc.walletAddress ? formatAddress(wc.walletAddress) : '',
      connect: () => wc.openConnectModal(),
      disconnect: () => wc.disconnect(),
      provider: wc.provider,
      balance: wc.walletBalance,
      connecting: wc.connecting,
    }
  }, [wc, addressHex])

  return (
    <WalletContext.Provider value={state}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet(): WalletState {
  return useContext(WalletContext)
}

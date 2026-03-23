import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface ContractState {
  isReady: boolean
  error: string | null
}

const ContractContext = createContext<ContractState>({
  isReady: false,
  error: null,
})

export function ContractProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      try {
        const { getNameResolverContract } = await import('../services/ContractService')
        const { getProvider } = await import('../services/ProviderService')
        const { setCurrentBlockHeight } = await import('../utils/formatting')
        await getNameResolverContract()
        // Fetch current block height for date estimation
        try {
          const provider = getProvider()
          const height = await provider.getBlockNumber()
          setCurrentBlockHeight(Number(height))
        } catch { /* non-critical */ }
        setIsReady(true)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to connect to OPNet'
        setError(msg)
        console.error('[BNS] Contract init failed:', err)
      }
    }
    init()
  }, [])

  return (
    <ContractContext.Provider value={{ isReady, error }}>
      {children}
    </ContractContext.Provider>
  )
}

export function useContractState(): ContractState {
  return useContext(ContractContext)
}

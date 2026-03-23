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
        // Import dynamically to avoid issues if provider fails
        const { getNameResolverContract } = await import('../services/ContractService')
        await getNameResolverContract()
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

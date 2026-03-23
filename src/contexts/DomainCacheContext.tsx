import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import type { DomainInfo, DomainPrice } from '../types'

const CACHE_TTL = 60_000 // 60 seconds

interface CachedDomain {
  domain: DomainInfo
  price: DomainPrice
  fetchedAt: number
}

interface DomainCacheState {
  getCached: (name: string) => CachedDomain | null
  setCached: (name: string, domain: DomainInfo, price: DomainPrice) => void
  invalidate: (name?: string) => void
  ownedDomains: string[]
  setOwnedDomains: (domains: string[]) => void
}

const DomainCacheContext = createContext<DomainCacheState>({
  getCached: () => null,
  setCached: () => {},
  invalidate: () => {},
  ownedDomains: [],
  setOwnedDomains: () => {},
})

export function DomainCacheProvider({ children }: { children: ReactNode }) {
  const cache = useRef<Map<string, CachedDomain>>(new Map())
  const [ownedDomains, setOwnedDomains] = useState<string[]>([])

  const getCached = useCallback((name: string): CachedDomain | null => {
    const entry = cache.current.get(name.toLowerCase())
    if (!entry) return null
    if (Date.now() - entry.fetchedAt > CACHE_TTL) {
      cache.current.delete(name.toLowerCase())
      return null
    }
    return entry
  }, [])

  const setCached = useCallback((name: string, domain: DomainInfo, price: DomainPrice) => {
    cache.current.set(name.toLowerCase(), { domain, price, fetchedAt: Date.now() })
  }, [])

  const invalidate = useCallback((name?: string) => {
    if (name) {
      cache.current.delete(name.toLowerCase())
    } else {
      cache.current.clear()
    }
  }, [])

  return (
    <DomainCacheContext.Provider value={{ getCached, setCached, invalidate, ownedDomains, setOwnedDomains }}>
      {children}
    </DomainCacheContext.Provider>
  )
}

export function useDomainCache(): DomainCacheState {
  return useContext(DomainCacheContext)
}

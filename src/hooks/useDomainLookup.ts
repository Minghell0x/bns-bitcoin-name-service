import { useState, useEffect, useCallback } from 'react'
import { lookupDomain, fetchDomainPrice } from '../services/DomainService'
import { useDomainCache } from '../contexts/DomainCacheContext'
import type { DomainInfo, DomainPrice, DomainStatus } from '../types'

interface DomainLookupResult {
  domain: DomainInfo | null
  price: DomainPrice | null
  status: DomainStatus | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useDomainLookup(name: string, years = 1): DomainLookupResult {
  const [domain, setDomain] = useState<DomainInfo | null>(null)
  const [price, setPrice] = useState<DomainPrice | null>(null)
  const [status, setStatus] = useState<DomainStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { getCached, setCached } = useDomainCache()

  const fetch = useCallback(async () => {
    if (!name) return

    const cacheKey = `${name}:${years}`

    // Check cache first
    const cached = getCached(cacheKey)
    if (cached) {
      setDomain(cached.domain)
      setPrice(cached.price)
      const s = computeStatusFromDomain(cached.domain)
      setStatus(s)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [domainResult, priceResult] = await Promise.all([
        lookupDomain(name),
        fetchDomainPrice(name, years),
      ])

      setDomain(domainResult.domain)
      setStatus(domainResult.status)
      setPrice(priceResult)
      setCached(cacheKey, domainResult.domain, priceResult)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to look up domain'
      setError(msg)
      console.error('[BNS] Domain lookup failed:', err)
    } finally {
      setLoading(false)
    }
  }, [name, years, getCached, setCached])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { domain, price, status, loading, error, refetch: fetch }
}

function computeStatusFromDomain(domain: DomainInfo): DomainStatus {
  if (!domain.exists) return 'available'
  if (domain.inGracePeriod) return 'grace-period'
  if (!domain.isActive) return 'available'
  const now = BigInt(Math.floor(Date.now() / 1000))
  const thirtyDays = 30n * 24n * 60n * 60n
  if (domain.expiresAt - now < thirtyDays) return 'expiring'
  return 'taken'
}

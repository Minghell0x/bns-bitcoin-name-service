import { getNameResolverContract } from './ContractService'
import type { DomainInfo, DomainPrice, DomainStatus, Reservation } from '../types'

export async function lookupDomain(name: string): Promise<{
  domain: DomainInfo
  status: DomainStatus
}> {
  const contract = await getNameResolverContract()
  const result = await contract.getDomain(name)
  const domain: DomainInfo = {
    exists: result.properties.exists,
    owner: result.properties.owner?.toString() ?? '',
    createdAt: result.properties.createdAt,
    expiresAt: result.properties.expiresAt,
    ttl: result.properties.ttl,
    isActive: result.properties.isActive,
    inGracePeriod: result.properties.inGracePeriod,
  }
  const status = computeStatus(domain)
  return { domain, status }
}

export async function fetchDomainPrice(name: string, years: number): Promise<DomainPrice> {
  const contract = await getNameResolverContract()
  const result = await contract.getDomainPrice(name, BigInt(years))
  return {
    totalPriceSats: result.properties.totalPriceSats,
    auctionPriceSats: result.properties.auctionPriceSats,
    renewalPerYear: result.properties.renewalPerYear,
  }
}

export async function fetchBasePrice(): Promise<bigint> {
  const contract = await getNameResolverContract()
  const result = await contract.getBaseDomainPrice()
  return result.properties.priceSats
}

export async function fetchTreasuryAddress(): Promise<string> {
  const contract = await getNameResolverContract()
  const result = await contract.getTreasuryAddress()
  return result.properties.treasuryAddress
}

export async function fetchReservation(name: string): Promise<Reservation> {
  const contract = await getNameResolverContract()
  const result = await contract.getReservation(name)
  return {
    reserver: result.properties.reserver?.toString() ?? '',
    reservedAt: result.properties.reservedAt,
    years: result.properties.years,
    isActive: result.properties.isActive,
  }
}

export async function resolveDomain(name: string): Promise<string> {
  const contract = await getNameResolverContract()
  const result = await contract.resolve(name)
  return result.properties.owner?.toString() ?? ''
}

function computeStatus(domain: DomainInfo): DomainStatus {
  if (!domain.exists) return 'available'
  if (domain.inGracePeriod) return 'grace-period'
  if (!domain.isActive) return 'available'
  const now = BigInt(Math.floor(Date.now() / 1000))
  const thirtyDays = 30n * 24n * 60n * 60n
  if (domain.expiresAt - now < thirtyDays) return 'expiring'
  return 'taken'
}

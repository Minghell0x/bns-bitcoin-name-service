export interface DomainInfo {
  exists: boolean
  owner: string
  ownerHex: string
  ownerP2tr: string
  createdAt: bigint
  expiresAt: bigint
  ttl: bigint
  isActive: boolean
  inGracePeriod: boolean
}

export interface DomainPrice {
  totalPriceSats: bigint
  auctionPriceSats: bigint
  renewalPerYear: bigint
}

export interface Reservation {
  reserver: string
  reservedAt: bigint
  years: bigint
  isActive: boolean
}

export interface PendingTransfer {
  pendingOwner: string
  initiatedAt: bigint
}

export type DomainStatus = 'available' | 'taken' | 'expiring' | 'grace-period'

export interface SearchResult {
  domainName: string
  status: DomainStatus
  domain?: DomainInfo
  price?: DomainPrice
}

export interface OwnedDomain {
  name: string
  registeredYear: number
  expiresAt: string
  daysRemaining: number
  status: 'active' | 'expiring' | 'grace-period'
}

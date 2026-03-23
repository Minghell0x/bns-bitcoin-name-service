const STORAGE_KEY_PREFIX = 'bns_owned_domains_'

export function getOwnedDomainNames(address: string): string[] {
  const key = STORAGE_KEY_PREFIX + address.toLowerCase()
  const stored = localStorage.getItem(key)
  if (!stored) return []
  try {
    return JSON.parse(stored) as string[]
  } catch {
    return []
  }
}

export function addOwnedDomain(address: string, domainName: string): void {
  const domains = getOwnedDomainNames(address)
  if (!domains.includes(domainName.toLowerCase())) {
    domains.push(domainName.toLowerCase())
    const key = STORAGE_KEY_PREFIX + address.toLowerCase()
    localStorage.setItem(key, JSON.stringify(domains))
  }
}

export function removeOwnedDomain(address: string, domainName: string): void {
  const domains = getOwnedDomainNames(address).filter(
    (d) => d !== domainName.toLowerCase(),
  )
  const key = STORAGE_KEY_PREFIX + address.toLowerCase()
  localStorage.setItem(key, JSON.stringify(domains))
}

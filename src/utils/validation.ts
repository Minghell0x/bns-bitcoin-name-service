const DOMAIN_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/

export function isValidDomainName(name: string): boolean {
  const cleaned = name.toLowerCase().replace(/\.btc$/, '')
  if (cleaned.length === 0 || cleaned.length > 63) return false
  return DOMAIN_REGEX.test(cleaned)
}

export function cleanDomainName(name: string): string {
  return name.trim().toLowerCase().replace(/\.btc$/, '')
}

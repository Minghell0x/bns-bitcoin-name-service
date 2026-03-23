export function formatAddress(address: string, chars = 4): string {
  if (!address) return ''
  if (address.length <= chars * 2 + 3) return address
  return `${address.slice(0, chars + 4)}...${address.slice(-chars)}`
}

export function formatSats(sats: bigint): string {
  const btc = Number(sats) / 1e8
  if (btc >= 0.01) return `${btc.toFixed(4)} BTC`
  if (btc >= 0.0001) return `${btc.toFixed(6)} BTC`
  return `${sats.toString()} sats`
}

export function formatSatsAsBtc(sats: bigint): string {
  const btc = Number(sats) / 1e8
  return btc.toFixed(8)
}

export function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function daysUntilExpiry(expiresAt: bigint): number {
  const now = Math.floor(Date.now() / 1000)
  const diff = Number(expiresAt) - now
  return Math.max(0, Math.floor(diff / 86400))
}

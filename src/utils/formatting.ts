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

// OPNet contract stores timestamps as block heights, not unix timestamps.
// Signet produces ~1 block per 10 minutes (144 blocks/day).
const BLOCKS_PER_DAY = 144

export function formatDate(blockHeight: bigint): string {
  // Estimate real date from block height
  // We estimate based on current block being "now" and project forward/backward
  const blocksFromNow = Number(blockHeight) - estimateCurrentBlock()
  const daysFromNow = blocksFromNow / BLOCKS_PER_DAY
  const date = new Date(Date.now() + daysFromNow * 86400 * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function daysUntilExpiry(expiresAtBlock: bigint): number {
  const currentBlock = estimateCurrentBlock()
  const blocksRemaining = Number(expiresAtBlock) - currentBlock
  return Math.max(0, Math.floor(blocksRemaining / BLOCKS_PER_DAY))
}

// Rough estimate of current signet block height
// Signet started ~2023, produces ~144 blocks/day
// This is approximate — for exact value we'd query the provider
let cachedBlockHeight: number | null = null
let cachedBlockTime = 0

export function setCurrentBlockHeight(height: number): void {
  cachedBlockHeight = height
  cachedBlockTime = Date.now()
}

function estimateCurrentBlock(): number {
  if (cachedBlockHeight && Date.now() - cachedBlockTime < 600_000) {
    // Use cached + elapsed time estimate
    const elapsed = (Date.now() - cachedBlockTime) / 1000
    return cachedBlockHeight + Math.floor(elapsed / 600) // ~1 block per 10 min
  }
  // Fallback: rough estimate based on OPNet testnet
  // Adjust this as needed
  return 11100
}

/**
 * Compare domain owner against connected wallet.
 * Primary: ownerHex (0x-prefixed) vs addressHex (no prefix) from walletconnect.
 * Fallback: generic string match against walletAddress.
 */
export function isOwner(
  domainOwner: string,
  domainOwnerHex: string,
  _domainOwnerP2tr: string,
  walletAddress: string | null,
  addressHex?: string | null,
): boolean {
  // Primary: compare ML-DSA hashes (contract stores 0x-prefixed, wallet gives raw hex)
  if (addressHex && domainOwnerHex) {
    const contractHash = domainOwnerHex.toLowerCase().replace(/^0x/, '')
    const walletHash = addressHex.toLowerCase().replace(/^0x/, '')
    if (contractHash === walletHash) return true
  }
  // Fallback: direct string match
  if (walletAddress && domainOwner) {
    if (domainOwner.toLowerCase() === walletAddress.toLowerCase()) return true
  }
  return false
}

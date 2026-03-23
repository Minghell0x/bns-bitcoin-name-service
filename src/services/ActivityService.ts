import { getProvider } from './ProviderService'
import { CONTRACT_ADDRESS, CONTRACT_P2OP } from '../config/constants'

export interface RecentActivity {
  type: 'registration' | 'renewal' | 'transfer' | 'reservation' | 'other'
  label: string
  txHash: string
  blockHeight: number
  timestamp: number
  events: string[]
}

const EVENT_MAP: Record<string, { type: RecentActivity['type']; label: string }> = {
  DomainRegistered: { type: 'registration', label: 'Domain Registered' },
  DomainReserved: { type: 'reservation', label: 'Domain Reserved' },
  DomainRenewed: { type: 'renewal', label: 'Domain Renewed' },
  DomainTransferCompleted: { type: 'transfer', label: 'Domain Transferred' },
  DomainTransferInitiated: { type: 'transfer', label: 'Transfer Initiated' },
  SubdomainCreated: { type: 'other', label: 'Subdomain Created' },
}

export async function fetchRecentActivity(blocksToScan = 50): Promise<RecentActivity[]> {
  const provider = getProvider()
  const currentBlock = await provider.getBlockNumber()
  const startBlock = Math.max(0, Number(currentBlock) - blocksToScan)

  const activities: RecentActivity[] = []
  const contractHex = CONTRACT_ADDRESS.toLowerCase()
  const contractP2op = CONTRACT_P2OP.toLowerCase()
  console.log('[BNS Activity] Scanning', blocksToScan, 'blocks from', Number(currentBlock))

  // Fetch blocks in batches of 10
  for (let i = Number(currentBlock); i > startBlock; i -= 10) {
    const batch: bigint[] = []
    for (let j = i; j > Math.max(startBlock, i - 10); j--) {
      batch.push(BigInt(j))
    }

    try {
      const blocks = await provider.getBlocks(batch, true)
      for (const block of blocks) {
        for (const tx of block.transactions) {
          const itx = tx as {
            contractAddress?: string
            events?: Record<string, Array<{ type: string; data: Uint8Array }>>
            revert?: string | Uint8Array
          }

          // Skip reverted txs
          if (itx.revert) continue

          // Check if transaction targets our contract (compare both hex and p2op formats)
          const txContract = itx.contractAddress?.toLowerCase() ?? ''
          const isMatch = txContract === contractHex ||
            txContract === contractP2op.toLowerCase() ||
            txContract.includes(contractHex.replace(/^0x/, '').slice(0, 20))
          if (!isMatch) continue

          // Parse events to determine activity type
          const eventNames: string[] = []
          let activityType: RecentActivity['type'] = 'other'
          let label = 'Contract Interaction'

          if (itx.events) {
            for (const eventList of Object.values(itx.events)) {
              for (const evt of eventList) {
                eventNames.push(evt.type)
                const mapped = EVENT_MAP[evt.type]
                if (mapped) {
                  activityType = mapped.type
                  label = mapped.label
                }
              }
            }
          }

          activities.push({
            type: activityType,
            label,
            txHash: tx.hash,
            blockHeight: Number(block.height),
            timestamp: block.time,
            events: eventNames,
          })
        }
      }
    } catch {
      // Block fetch failed, skip
    }
  }

  return activities.slice(0, 30)
}

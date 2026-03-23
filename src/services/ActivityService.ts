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

/**
 * Fetch recent activity by scanning a small number of recent blocks.
 * Only scans last 10 blocks to keep it fast. For deeper history,
 * we'd need an indexer backend.
 */
export async function fetchRecentActivity(blocksToScan = 10): Promise<RecentActivity[]> {
  const provider = getProvider()
  const currentBlock = await provider.getBlockNumber()

  const activities: RecentActivity[] = []
  const contractHex = CONTRACT_ADDRESS.toLowerCase().replace(/^0x/, '')
  const contractP2op = CONTRACT_P2OP.toLowerCase()

  // Fetch last N blocks in one call
  const blockNumbers: bigint[] = []
  for (let i = Number(currentBlock); i > Math.max(0, Number(currentBlock) - blocksToScan); i--) {
    blockNumbers.push(BigInt(i))
  }

  try {
    const blocks = await provider.getBlocks(blockNumbers, true)
    for (const block of blocks) {
      for (const tx of block.transactions) {
        const itx = tx as {
          contractAddress?: string
          events?: Record<string, Array<{ type: string; data: Uint8Array }>>
          revert?: string | Uint8Array
        }

        if (itx.revert) continue
        if (!itx.contractAddress) continue

        // Match by P2OP address or hex substring
        const addr = itx.contractAddress.toLowerCase()
        if (addr !== contractP2op && !addr.includes(contractHex.slice(0, 16))) continue

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
    // Block fetch failed
  }

  return activities.slice(0, 20)
}

/**
 * Fetch activity for a specific transaction hash.
 * Used to show user's own transactions.
 */
export async function fetchTxActivity(txHash: string): Promise<RecentActivity | null> {
  try {
    const provider = getProvider()
    const tx = await provider.getTransaction(txHash)
    const itx = tx as {
      contractAddress?: string
      events?: Record<string, Array<{ type: string; data: Uint8Array }>>
      revert?: string | Uint8Array
      blockNumber?: bigint
    }

    if (itx.revert) return null

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

    return {
      type: activityType,
      label,
      txHash: tx.hash,
      blockHeight: Number(itx.blockNumber ?? 0),
      timestamp: Math.floor(Date.now() / 1000),
      events: eventNames,
    }
  } catch {
    return null
  }
}

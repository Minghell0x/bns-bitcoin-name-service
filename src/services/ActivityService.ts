import { getProvider } from './ProviderService'
import { CONTRACT_ADDRESS } from '../config/constants'

export interface RecentActivity {
  type: 'registration' | 'renewal' | 'transfer'
  txHash: string
  blockHeight: number
  timestamp: number
}

/**
 * Fetch recent contract interactions from the last N blocks.
 * Scans blocks for transactions targeting the BNS contract.
 */
export async function fetchRecentActivity(blocksToScan = 50): Promise<RecentActivity[]> {
  const provider = getProvider()
  const currentBlock = await provider.getBlockNumber()
  const startBlock = Number(currentBlock) - blocksToScan

  const activities: RecentActivity[] = []
  const contractAddr = CONTRACT_ADDRESS.toLowerCase()

  // Fetch recent blocks with transactions
  const blockNumbers: number[] = []
  for (let i = Number(currentBlock); i > startBlock && i > 0; i--) {
    blockNumbers.push(i)
  }

  // Fetch blocks in batches
  const batchSize = 10
  for (let i = 0; i < blockNumbers.length; i += batchSize) {
    const batch = blockNumbers.slice(i, i + batchSize)
    try {
      const blocks = await provider.getBlocks(batch.map(BigInt), true)
      for (const block of blocks) {
        for (const tx of block.transactions) {
          // Check if this transaction interacts with our contract
          const interactionTx = tx as { contractAddress?: string; events?: Record<string, unknown[]> }
          if (interactionTx.contractAddress?.toLowerCase() === contractAddr) {
            // Determine activity type from events
            let type: RecentActivity['type'] = 'registration'
            if (interactionTx.events) {
              const eventKeys = Object.keys(interactionTx.events).join(',').toLowerCase()
              if (eventKeys.includes('renewed')) type = 'renewal'
              else if (eventKeys.includes('transfer')) type = 'transfer'
            }
            activities.push({
              type,
              txHash: tx.hash,
              blockHeight: Number(block.height),
              timestamp: block.time,
            })
          }
        }
      }
    } catch {
      // Block fetch failed, skip batch
    }
  }

  return activities.slice(0, 20) // Return max 20 items
}

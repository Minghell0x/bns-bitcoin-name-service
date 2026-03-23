import { getContract, type AbstractRpcProvider } from 'opnet'
import { networks } from '@btc-vision/bitcoin'
import type { Address } from '@btc-vision/transaction'
import { BtcNameResolverAbi } from '../../abi/BtcNameResolver.abi'
import type { IBtcNameResolver } from '../../abi/BtcNameResolver'
import { getProvider } from './ProviderService'
import { CONTRACT_ADDRESS } from '../config/constants'

let readContractInstance: IBtcNameResolver | null = null

/** Contract instance for read-only calls (uses our JSONRpcProvider) */
export async function getNameResolverContract(): Promise<IBtcNameResolver> {
  if (!readContractInstance) {
    const provider = getProvider()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readContractInstance = getContract<IBtcNameResolver>(
      CONTRACT_ADDRESS,
      BtcNameResolverAbi as any,
      provider,
      networks.opnetTestnet,
    )
  }
  return readContractInstance
}

/** Contract instance for write calls — uses wallet's provider + sender for CSV UTXO access */
export function getWriteContract(walletProvider: AbstractRpcProvider, sender: Address): IBtcNameResolver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return getContract<IBtcNameResolver>(
    CONTRACT_ADDRESS,
    BtcNameResolverAbi as any,
    walletProvider,
    networks.opnetTestnet,
    sender, // CRITICAL: needed for CSV address derivation
  )
}

export function clearContractCache(): void {
  readContractInstance = null
}

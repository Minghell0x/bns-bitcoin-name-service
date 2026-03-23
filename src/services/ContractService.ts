import { getContract } from 'opnet'
import { networks } from '@btc-vision/bitcoin'
import { BtcNameResolverAbi } from '../../abi/BtcNameResolver.abi'
import type { IBtcNameResolver } from '../../abi/BtcNameResolver'
import { getProvider } from './ProviderService'
import { CONTRACT_ADDRESS } from '../config/constants'

let contractInstance: IBtcNameResolver | null = null

export async function getNameResolverContract(): Promise<IBtcNameResolver> {
  if (!contractInstance) {
    const provider = getProvider()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contractInstance = getContract<IBtcNameResolver>(
      CONTRACT_ADDRESS,
      BtcNameResolverAbi as any,
      provider,
      networks.opnetTestnet,
    )
  }
  return contractInstance
}

export function clearContractCache(): void {
  contractInstance = null
}

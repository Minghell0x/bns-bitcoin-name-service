import { JSONRpcProvider } from 'opnet'
import { networks } from '@btc-vision/bitcoin'

const RPC_URL = 'https://testnet.opnet.org'

let provider: JSONRpcProvider | null = null

export function getProvider(): JSONRpcProvider {
  if (!provider) {
    provider = new JSONRpcProvider({ url: RPC_URL, network: networks.opnetTestnet })
  }
  return provider
}

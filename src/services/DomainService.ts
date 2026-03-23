import { networks } from '@btc-vision/bitcoin'
import type { Address } from '@btc-vision/transaction'
import type { TransactionParameters } from 'opnet'
import { getNameResolverContract } from './ContractService'
import type { DomainInfo, DomainPrice, DomainStatus, Reservation } from '../types'

// ─── READ METHODS (no wallet needed) ────────────────────────────

export async function lookupDomain(name: string): Promise<{
  domain: DomainInfo
  status: DomainStatus
}> {
  const contract = await getNameResolverContract()
  const result = await contract.getDomain(name)
  const domain: DomainInfo = {
    exists: result.properties.exists,
    owner: result.properties.owner?.toString() ?? '',
    createdAt: result.properties.createdAt,
    expiresAt: result.properties.expiresAt,
    ttl: result.properties.ttl,
    isActive: result.properties.isActive,
    inGracePeriod: result.properties.inGracePeriod,
  }
  const status = computeStatus(domain)
  return { domain, status }
}

export async function fetchDomainPrice(name: string, years: number): Promise<DomainPrice> {
  const contract = await getNameResolverContract()
  const result = await contract.getDomainPrice(name, BigInt(years))
  return {
    totalPriceSats: result.properties.totalPriceSats,
    auctionPriceSats: result.properties.auctionPriceSats,
    renewalPerYear: result.properties.renewalPerYear,
  }
}

export async function fetchBasePrice(): Promise<bigint> {
  const contract = await getNameResolverContract()
  const result = await contract.getBaseDomainPrice()
  return result.properties.priceSats
}

export async function fetchTreasuryAddress(): Promise<string> {
  const contract = await getNameResolverContract()
  const result = await contract.getTreasuryAddress()
  return result.properties.treasuryAddress
}

export async function fetchReservation(name: string): Promise<Reservation> {
  const contract = await getNameResolverContract()
  const result = await contract.getReservation(name)
  return {
    reserver: result.properties.reserver?.toString() ?? '',
    reservedAt: result.properties.reservedAt,
    years: result.properties.years,
    isActive: result.properties.isActive,
  }
}

export async function resolveDomain(name: string): Promise<string> {
  const contract = await getNameResolverContract()
  const result = await contract.resolve(name)
  return result.properties.owner?.toString() ?? ''
}

// ─── WRITE METHODS (wallet required) ────────────────────────────
// Pattern: simulate → sendTransaction with signer=null (OP_WALLET signs)
// CRITICAL: must include network in txParams (incident INC-mmuv8exw)

function buildTxParams(refundTo: string, maxSats: bigint): TransactionParameters {
  return {
    signer: null,
    mldsaSigner: null,
    refundTo,
    maximumAllowedSatToSpend: maxSats,
    network: networks.opnetTestnet,
    feeRate: 100,
  }
}

export async function reserveDomainTx(
  name: string,
  years: number,
  refundAddress: string,
): Promise<{ txHash: string }> {
  const contract = await getNameResolverContract()
  // Fetch the price to send with the reservation
  const priceResult = await contract.getDomainPrice(name, BigInt(years))
  const totalPrice = priceResult.properties.totalPriceSats
  const callResult = await contract.reserveDomain(name, BigInt(years))
  const params = buildTxParams(refundAddress, totalPrice + 50_000n) // price + buffer for fees
  const receipt = await callResult.sendTransaction(params, totalPrice)
  return { txHash: receipt.transactionId }
}

export async function completeRegistrationTx(
  name: string,
  refundAddress: string,
): Promise<{ txHash: string }> {
  const contract = await getNameResolverContract()
  const callResult = await contract.completeRegistration(name)
  const params = buildTxParams(refundAddress, 500_000n) // just gas, no payment needed
  const receipt = await callResult.sendTransaction(params)
  return { txHash: receipt.transactionId }
}

export async function renewDomainTx(
  name: string,
  years: number,
  refundAddress: string,
): Promise<{ txHash: string }> {
  const contract = await getNameResolverContract()
  // Fetch renewal price
  const priceResult = await contract.getDomainPrice(name, BigInt(years))
  const renewalCost = priceResult.properties.renewalPerYear * BigInt(years)
  const callResult = await contract.renewDomain(name, BigInt(years))
  const params = buildTxParams(refundAddress, renewalCost + 50_000n)
  const receipt = await callResult.sendTransaction(params, renewalCost)
  return { txHash: receipt.transactionId }
}

export async function transferDomainTx(
  name: string,
  newOwner: Address,
  refundAddress: string,
): Promise<{ txHash: string }> {
  const contract = await getNameResolverContract()
  const callResult = await contract.transferDomain(name, newOwner)
  const params = buildTxParams(refundAddress, 1_000_000n)
  const receipt = await callResult.sendTransaction(params)
  return { txHash: receipt.transactionId }
}

// ─── HELPERS ────────────────────────────────────────────────────

function computeStatus(domain: DomainInfo): DomainStatus {
  if (!domain.exists) return 'available'
  if (domain.inGracePeriod) return 'grace-period'
  if (!domain.isActive) return 'available'
  const now = BigInt(Math.floor(Date.now() / 1000))
  const thirtyDays = 30n * 24n * 60n * 60n
  if (domain.expiresAt - now < thirtyDays) return 'expiring'
  return 'taken'
}

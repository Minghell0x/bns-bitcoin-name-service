import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

interface PendingTx {
  id: string
  type: 'reserve' | 'complete' | 'renew' | 'transfer' | 'subdomain'
  domainName: string
  status: 'pending' | 'confirmed' | 'failed'
  txHash?: string
  error?: string
  createdAt: number
}

interface TransactionState {
  pendingTxs: PendingTx[]
  addTransaction: (tx: Omit<PendingTx, 'id' | 'createdAt'>) => string
  updateTransaction: (id: string, update: Partial<PendingTx>) => void
  clearCompleted: () => void
}

const TransactionContext = createContext<TransactionState>({
  pendingTxs: [],
  addTransaction: () => '',
  updateTransaction: () => {},
  clearCompleted: () => {},
})

let txCounter = 0

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [pendingTxs, setPendingTxs] = useState<PendingTx[]>([])

  const addTransaction = useCallback((tx: Omit<PendingTx, 'id' | 'createdAt'>): string => {
    const id = `tx_${++txCounter}_${Date.now()}`
    setPendingTxs((prev) => [...prev, { ...tx, id, createdAt: Date.now() }])
    return id
  }, [])

  const updateTransaction = useCallback((id: string, update: Partial<PendingTx>) => {
    setPendingTxs((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...update } : tx)),
    )
  }, [])

  const clearCompleted = useCallback(() => {
    setPendingTxs((prev) => prev.filter((tx) => tx.status === 'pending'))
  }, [])

  return (
    <TransactionContext.Provider value={{ pendingTxs, addTransaction, updateTransaction, clearCompleted }}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions(): TransactionState {
  return useContext(TransactionContext)
}

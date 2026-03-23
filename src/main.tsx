import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { WalletProvider } from './contexts/WalletContext'
import { ContractProvider } from './contexts/ContractContext'
import { TransactionProvider } from './contexts/TransactionContext'
import { DomainCacheProvider } from './contexts/DomainCacheContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <ContractProvider>
          <TransactionProvider>
            <DomainCacheProvider>
              <App />
            </DomainCacheProvider>
          </TransactionProvider>
        </ContractProvider>
      </WalletProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

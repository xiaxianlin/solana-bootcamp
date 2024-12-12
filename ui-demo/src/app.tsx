import '@solana/wallet-adapter-react-ui/styles.css'
import { useMemo } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { clusterApiUrl } from '@solana/web3.js'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { Course01 } from './pages/course01'
import { Main } from './pages/Main'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { Course02 } from './pages/course02'

export function App() {
  const endpoint = clusterApiUrl('devnet')
  const wallets = useMemo(() => [], [])
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect wallets={wallets}>
        <WalletModalProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Main />}>
                <Route path="course01" element={<Course01 />} />
                <Route path="course02" element={<Course02 />} />
                <Route path="*" element={<Navigate to="course01" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useEffect, useMemo } from 'react'
import { useRequest } from 'ahooks'

export const useAccount = () => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()

  const {
    loading,
    data: account,
    refresh,
  } = useRequest(() => connection.getAccountInfo(publicKey!), {
    ready: Boolean(connection && publicKey),
    refreshDeps: [connection, publicKey],
  })

  const balance = useMemo(() => (account ? account.lamports / LAMPORTS_PER_SOL : '-'), [account])

  useEffect(() => {
    if (!connection || !publicKey) return
    const listenerId = connection.onAccountChange(publicKey, refresh)
    return () => {
      connection.removeAccountChangeListener(listenerId)
    }
  }, [connection, refresh])

  return {
    publicKey,
    loading,
    balance,
    account,
    refresh,
  }
}

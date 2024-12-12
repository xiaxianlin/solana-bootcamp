import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js'
import { message } from 'antd'
import { useState } from 'react'

export const useSendSOL = () => {
  const [loading, setLoading] = useState(false)

  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  /**
   *  发送 SOL
   * @param toPublicKeyValue 接收人公钥
   * @param lamports 发送数量
   * @returns
   */
  const send = async (toPublicKeyValue: string, lamports: number, programId?: string) => {
    if (!publicKey || !connection) {
      message.error('请连接钱包')
      return
    }
    setLoading(true)
    try {
      const toPubKey = new PublicKey(toPublicKeyValue)

      const transaction = new Transaction()

      if (programId) {
        const programPubkey = new PublicKey(programId)
        const instruction = new TransactionInstruction({
          keys: [
            {
              pubkey: toPubKey,
              isSigner: false,
              isWritable: true,
            },
          ],
          programId: programPubkey,
        })
        transaction.add(instruction)
      } else {
        const instruction = SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: toPubKey,
          lamports: lamports * LAMPORTS_PER_SOL,
        })
        transaction.add(instruction)
      }

      const signature = await sendTransaction(transaction, connection)
      console.log(`Transaction signature: ${signature}`)
    } catch (error) {
      console.error('Transaction failed', error)
    }
    setLoading(false)
  }

  return { loading, send }
}

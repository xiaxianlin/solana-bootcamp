import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { useRequest } from 'ahooks'

export const useCreateTokenAccount = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const {
    data,
    loading,
    run: create,
  } = useRequest(
    async (mintPublicKey: string, ownerPublicKey: string) => {
      console.log('mintPublicKey: ', mintPublicKey)
      console.log('ownerPublicKey: ', ownerPublicKey)

      const mint = new PublicKey(mintPublicKey)
      const owner = new PublicKey(ownerPublicKey)

      const associatedToken = await getAssociatedTokenAddress(
        mint,
        owner,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      )

      console.log('associatedToken', associatedToken.toString())

      const transaction = new Transaction()
      transaction.add(
        createAssociatedTokenAccountInstruction(
          publicKey!,
          associatedToken,
          owner,
          mint,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        ),
      )
      const result = await sendTransaction(transaction, connection)

      return { account: associatedToken.toString(), result }
    },
    {
      manual: true,
      ready: Boolean(connection && publicKey),
    },
  )

  return { loading, ...data, create }
}

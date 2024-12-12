import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMintToInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { useRequest } from 'ahooks'

export const useMintTo = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const {
    data,
    loading,
    run: mintTo,
  } = useRequest(
    async (mintPubKey: string, ownerPubKey: string, amount: string) => {
      console.log('mintPubKey: ', mintPubKey)
      console.log('ownerPubKey: ', ownerPubKey)

      const mint = new PublicKey(mintPubKey)
      const owner = new PublicKey(ownerPubKey)

      const associatedToken = await getAssociatedTokenAddress(
        mint,
        owner,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      )
      console.log('associatedToken', associatedToken.toString())

      const transaction = new Transaction()
      transaction.add(createMintToInstruction(mint, associatedToken, publicKey!, Number(amount)))

      const signature = await sendTransaction(transaction, connection)

      await connection.confirmTransaction(signature, 'confirmed')

      return { account: associatedToken.toString(), signature }
    },
    {
      manual: true,
      ready: Boolean(connection && publicKey),
    },
  )

  return { loading, ...data, mintTo }
}

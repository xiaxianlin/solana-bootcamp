import {
  createInitializeMintInstruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useRequest } from 'ahooks'
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js'

export const useCreateMint = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const { data, run: create } = useRequest(
    async () => {
      const mint = Keypair.generate()

      const lamports = await getMinimumBalanceForRentExemptMint(connection)

      const transaction = new Transaction()
      transaction.add(
        SystemProgram.createAccount({
          fromPubkey: publicKey!,
          newAccountPubkey: mint.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(mint.publicKey, 0, publicKey!, publicKey, TOKEN_PROGRAM_ID),
      )

      const signuare = await sendTransaction(transaction, connection, { signers: [mint] })

      return { mint: mint.publicKey.toString(), signuare }
    },
    {
      manual: true,
      ready: Boolean(connection && publicKey),
    },
  )

  return {
    ...data,
    create,
  }
}

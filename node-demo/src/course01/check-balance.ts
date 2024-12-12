import 'dotenv/config'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { connection } from '../utils'

const suppliedPublicKey = process.env.PUBLIC_KEY
if (!suppliedPublicKey) {
  throw new Error('Provide a public key to check the balance of!')
}

export const check = async () => {
  const publicKey = new PublicKey(suppliedPublicKey)
  const balanceInLamports = await connection.getBalance(publicKey)

  const balanceInSOL = balanceInLamports / LAMPORTS_PER_SOL

  console.log(`The balance of the account at ${publicKey} is ${balanceInSOL}`)
  console.log(`✅ Finished!`)
}

check()

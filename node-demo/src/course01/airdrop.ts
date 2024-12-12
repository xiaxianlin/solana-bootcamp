import 'dotenv/config'
import {
  airdropIfRequired,
  getKeypairFromEnvironment
} from '@solana-developers/helpers'
import { connection } from '../utils'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

const keypair = getKeypairFromEnvironment('SECRET_KEY')

async function airdrop() {
  const number = await airdropIfRequired(
    connection,
    keypair.publicKey,
    1 * LAMPORTS_PER_SOL,
    20 * LAMPORTS_PER_SOL
  )

  console.log(`airdrop number is ${number}`)
}

airdrop()

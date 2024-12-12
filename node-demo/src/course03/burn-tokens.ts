import 'dotenv/config'
import {
    getExplorerLink,
    getKeypairFromEnvironment
} from '@solana-developers/helpers'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { getOrCreateAssociatedTokenAccount, burn } from '@solana/spl-token'

const DEVNET_URL = clusterApiUrl('devnet')
const TOKEN_DECIMALS = 2
const BURN_AMOUNT = 5
// Substitute your token mint address
const TOKEN_MINT_ADDRESS = '9fpHrQxJ75QwuGUhg6N7t3Fh713NA7rhVPxiDn72s1VV'

const connection = new Connection(DEVNET_URL)
const user = getKeypairFromEnvironment('SECRET_KEY')

console.log(`🔑 Loaded keypair. Public key: ${user.publicKey.toBase58()}`)

try {
    const tokenMintAccount = new PublicKey(TOKEN_MINT_ADDRESS)

    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        user,
        tokenMintAccount,
        user.publicKey
    )

    const burnAmount = BURN_AMOUNT

    console.log(`burnAmount: ${burnAmount}`)

    const transactionSignature = await burn(
        connection,
        user,
        userTokenAccount.address,
        tokenMintAccount,
        user,
        burnAmount
    )

    const explorerLink = getExplorerLink(
        'transaction',
        transactionSignature,
        'devnet'
    )

    console.log(`✅ Burn Transaction: ${explorerLink}`)
} catch (error) {
    console.error(
        `Error: ${error instanceof Error ? error.message : String(error)}`
    )
}

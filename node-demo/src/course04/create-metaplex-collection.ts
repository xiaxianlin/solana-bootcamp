import {
    createNft,
    mplTokenMetadata
} from '@metaplex-foundation/mpl-token-metadata'
import {
    createGenericFile,
    generateSigner,
    keypairIdentity,
    percentAmount
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { getExplorerLink, getKeypairFromFile } from '@solana-developers/helpers'
import { clusterApiUrl, Connection } from '@solana/web3.js'
import { promises as fs } from 'fs'
import * as path from 'path'

const connection = new Connection(clusterApiUrl('devnet'))

const user = await getKeypairFromFile()
console.log('Loaded user:', user.publicKey.toBase58())

const umi = createUmi(connection)
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey)
umi.use(keypairIdentity(umiKeypair)).use(mplTokenMetadata()).use(irysUploader())

const collectionImagePath = path.resolve(__dirname, 'collection.png')

const buffer = await fs.readFile(collectionImagePath)
let file = createGenericFile(buffer, collectionImagePath, {
    contentType: 'image/png'
})
const [image] = await umi.uploader.upload([file])
console.log('image uri:', image)

// upload offchain json to Arweave using irys
const uri = await umi.uploader.uploadJson({
    name: 'XXL-Collection',
    symbol: 'MC',
    description: 'XXL Collection Demo',
    image
})
console.log('Collection offchain metadata URI:', uri)

// generate mint keypair
const collectionMint = generateSigner(umi)

// create and mint NFT
await createNft(umi, {
    mint: collectionMint,
    name: 'XXL Collection',
    uri,
    updateAuthority: umi.identity.publicKey,
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true
}).sendAndConfirm(umi, { send: { commitment: 'finalized' } })

let explorerLink = getExplorerLink(
    'address',
    collectionMint.publicKey,
    'devnet'
)
console.log(`Collection NFT:  ${explorerLink}`)
console.log(`Collection NFT address is:`, collectionMint.publicKey)
console.log('✅ Finished successfully!')

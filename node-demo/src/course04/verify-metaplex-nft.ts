import {
    findMetadataPda,
    mplTokenMetadata,
    verifyCollectionV1
} from '@metaplex-foundation/mpl-token-metadata'
import {
    keypairIdentity,
    publicKey as UMIPublicKey
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { getExplorerLink, getKeypairFromFile } from '@solana-developers/helpers'
import { clusterApiUrl, Connection } from '@solana/web3.js'

const connection = new Connection(clusterApiUrl('devnet'))

const user = await getKeypairFromFile()
console.log('Loaded user:', user.publicKey.toBase58())

const umi = createUmi(connection)
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey)
umi.use(keypairIdentity(umiKeypair)).use(mplTokenMetadata()).use(irysUploader())

const collectionAddress = UMIPublicKey(
    '2iUWGoVeoQqiHLqoh2J6nT9Fuk45TYMuh32ZKkLro7T7'
)
const nftAddress = UMIPublicKey('EJgvKBSFV6WfWrGskCic3s7rh6HcApoTPZJDP5xtMF3M')
const metadata = findMetadataPda(umi, { mint: nftAddress })
await verifyCollectionV1(umi, {
    metadata,
    collectionMint: collectionAddress,
    authority: umi.identity
}).sendAndConfirm(umi)

let explorerLink = getExplorerLink('address', nftAddress, 'devnet')
console.log(`verified collection:  ${explorerLink}`)
console.log('✅ Finished successfully!')

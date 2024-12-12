import {
    createNft,
    fetchMetadataFromSeeds,
    updateV1,
    findMetadataPda,
    mplTokenMetadata,
    fetchDigitalAsset
} from '@metaplex-foundation/mpl-token-metadata'
import {
    createGenericFile,
    generateSigner,
    keypairIdentity,
    percentAmount,
    publicKey as UMIPublicKey
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { getExplorerLink, getKeypairFromFile } from '@solana-developers/helpers'
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { promises as fs } from 'fs'
import * as path from 'path'

const connection = new Connection(clusterApiUrl('devnet'))
const user = await getKeypairFromFile()
console.log('Loaded user:', user.publicKey.toBase58())

const umi = createUmi(connection)
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey)
umi.use(keypairIdentity(umiKeypair)).use(mplTokenMetadata()).use(irysUploader())

const NFTImagePath = path.resolve(__dirname, 'nft1.png')
const buffer = await fs.readFile(NFTImagePath)
const file = createGenericFile(buffer, NFTImagePath, {
    contentType: 'image/png'
})
const [image] = await umi.uploader.upload([file])
console.log('image uri:', image)

// upload updated offchain json using irys and get metadata uri
const uri = await umi.uploader.uploadJson({
    name: 'XXL NTF Updated',
    symbol: 'UPDATED',
    description: 'Updated Description',
    image
})
console.log('NFT offchain metadata URI:', uri)

const mint = UMIPublicKey('EJgvKBSFV6WfWrGskCic3s7rh6HcApoTPZJDP5xtMF3M')
const nft = await fetchMetadataFromSeeds(umi, { mint })

await updateV1(umi, {
    mint,
    authority: umi.identity,
    data: {
        ...nft,
        sellerFeeBasisPoints: 0,
        name: 'Updated Asset'
    },
    primarySaleHappened: true,
    isMutable: true
}).sendAndConfirm(umi)

let explorerLink = getExplorerLink('address', mint, 'devnet')
console.log(`NFT updated with new metadata URI: ${explorerLink}`)

console.log('✅ Finished successfully!')

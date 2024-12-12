import {
    createNft,
    mplTokenMetadata
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
import { clusterApiUrl, Connection } from '@solana/web3.js'
import { promises as fs } from 'fs'
import * as path from 'path'

const connection = new Connection(clusterApiUrl('devnet'))
const user = await getKeypairFromFile()
console.log('Loaded user:', user.publicKey.toBase58())

// 初始化 umi
const umi = createUmi(connection)
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(user.secretKey)
umi.use(keypairIdentity(umiKeypair)).use(mplTokenMetadata()).use(irysUploader())

// 上传文件
const NFTImagePath = path.resolve(__dirname, 'nft.png')
const buffer = await fs.readFile(NFTImagePath)
const file = createGenericFile(buffer, NFTImagePath, {
    contentType: 'image/png'
})
const [image] = await umi.uploader.upload([file])
console.log('image uri:', image)

// 上传元数据
const uri = await umi.uploader.uploadJson({
    name: 'XXL NFT',
    symbol: 'MN',
    description: 'XXL NFT Description',
    image
})
console.log('NFT offchain metadata URI:', uri)

const collectionNftAddress = UMIPublicKey(
    '2iUWGoVeoQqiHLqoh2J6nT9Fuk45TYMuh32ZKkLro7T7'
)
const mint = generateSigner(umi)

// create and mint NFT
await createNft(umi, {
    mint,
    name: 'XXL NFT',
    symbol: 'MN',
    uri,
    updateAuthority: umi.identity.publicKey,
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
        key: collectionNftAddress,
        verified: false
    }
}).sendAndConfirm(umi, { send: { commitment: 'finalized' } })

let explorerLink = getExplorerLink('address', mint.publicKey, 'devnet')
console.log(`Token Mint:  ${explorerLink}`)

import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { expect } from 'chai'
import { AnchorMovieReview } from '../target/types/anchor_movie_review'
import { getAccount, getAssociatedTokenAddress, transfer } from '@solana/spl-token'

describe('anchor-movie-review', () => {
    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider)

    const program = anchor.workspace.AnchorMovieReview as Program<AnchorMovieReview>

    const movie = {
        title: 'Just a test movie',
        description: 'Wow what a good movie it was real great',
        rating: 5
    }

    console.log('wallet address: ', provider.wallet.publicKey.toBase58())

    const [moviePda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from(movie.title), provider.wallet.publicKey.toBuffer()],
        program.programId
    )

    const [mint] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from('mint')], program.programId)

    console.log('mint address: ', mint.toBase58())

    it('Initializes the reward token', async () => {
        const tx = await program.methods.initializeTokenMint().rpc()
    })

    it('Movie review is added`', async () => {
        const tokenAccount = await getAssociatedTokenAddress(mint, provider.wallet.publicKey)

        const tx = await program.methods
            .addMovieReview(movie.title, movie.description, movie.rating)
            .accounts({ tokenAccount })
            .rpc()

        const account = await program.account.movieAccountState.fetch(moviePda)
        expect(account.title).to.equal(movie.title)
        expect(account.rating).to.equal(movie.rating)
        expect(account.description).to.equal(movie.description)
        expect(account.reviewer.toBase58()).to.equal(provider.wallet.publicKey.toBase58())

        const userAta = await getAccount(provider.connection, tokenAccount)
        expect(Number(userAta.amount)).to.equal((10 * 10) ^ 6)
    })

    it('Movie review is updated`', async () => {
        const newDescription = 'Wow this is new'
        const newRating = 4

        const _ = await program.methods.updateMovieReview(movie.title, newDescription, newRating).rpc()

        const account = await program.account.movieAccountState.fetch(moviePda)
        expect(movie.title === account.title)
        expect(newRating === account.rating)
        expect(newDescription === account.description)
        expect(account.reviewer === provider.wallet.publicKey)
    })

    it('Deletes a movie review', async () => {
        const tx = await program.methods.deleteMovieReview(movie.title).rpc()
    })
})

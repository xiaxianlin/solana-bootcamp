import { Program, BN } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'
import { Voting } from '../target/types/voting'

const IDL = require('../target/idl/voting.json')

const votingAddress = new PublicKey('7BGTxKLF327koJ6f3eQcYHTZeHzgCSe8ocCfNbDPoVzA')

describe('Voting', () => {
    let context
    let provider
    let votingProgram: Program<Voting>

    beforeAll(async () => {
        context = await startAnchor('', [{ name: 'voting', programId: votingAddress }], [])
        provider = new BankrunProvider(context)
        votingProgram = new Program<Voting>(IDL, provider)
    })

    it('initialize poll ', async () => {
        await votingProgram.methods
            .initializePoll(new BN(1), 'what is your favorite color?', new BN(0), new BN(1834097169))
            .rpc()

        const [pollAddress] = PublicKey.findProgramAddressSync([new BN(1).toArrayLike(Buffer, 'le', 8)], votingAddress)

        const poll = await votingProgram.account.poll.fetch(pollAddress)

        console.log(poll)
        expect(poll.pollId.toNumber()).toEqual(1)
        expect(poll.description).toEqual('what is your favorite color?')
        expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber())
    })

    it('initializes candidate', async () => {
        await votingProgram.methods.initializeCandidate('Tiny', new BN(1)).rpc()
        await votingProgram.methods.initializeCandidate('React', new BN(1)).rpc()

        const [tinyAddress] = PublicKey.findProgramAddressSync(
            [new BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('Tiny')],
            votingAddress
        )
        const tiny = await votingProgram.account.candidate.fetch(tinyAddress)
        console.log(tiny)

        const [reactAddress] = PublicKey.findProgramAddressSync(
            [new BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from('React')],
            votingAddress
        )

        const react = await votingProgram.account.candidate.fetch(reactAddress)
        console.log(react)
    })
    it('vote', async () => {})
})

// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VotingIDL from '../target/idl/voting.json'
import type { Voting } from '../target/types/voting'

export { Voting, VotingIDL }

export const VOTE_PROGRAM_ID = new PublicKey(VotingIDL.address)

export function getVotingProgram(provider: AnchorProvider, address?: PublicKey) {
    return new Program(
        { ...VotingIDL, address: address ? address.toBase58() : VotingIDL.address } as Voting,
        provider
    )
}

export function getVotingProgramId(cluster: Cluster) {
    switch (cluster) {
        case 'devnet':
        case 'testnet':
            return new PublicKey('7BGTxKLF327koJ6f3eQcYHTZeHzgCSe8ocCfNbDPoVzA')
        case 'mainnet-beta':
        default:
            return VOTE_PROGRAM_ID
    }
}

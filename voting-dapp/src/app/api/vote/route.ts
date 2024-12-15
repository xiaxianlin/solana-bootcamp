import { BN, Program, Provider } from '@coral-xyz/anchor'
import { VotingIDL, Voting, getVotingProgram } from '@project/anchor'
import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from '@solana/actions'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'

export const OPTIONS = GET
export async function GET(request: Request) {
    const actionMetadata: ActionGetResponse = {
        icon: 'https://pbs.twimg.com/profile_images/1785867863191932928/EpOqfO6d_400x400.png',
        title: 'Vote for your favorite NFT',
        description: 'Vote between Tiny and React.',
        label: 'Vote',
        links: {
            actions: [
                {
                    type: 'transaction',
                    href: '/api/vote?candidate=Tiny',
                    label: 'Vote for Tiny'
                },
                {
                    type: 'transaction',
                    href: '/api/vote?candidate=React',
                    label: 'Vote for React'
                }
            ]
        }
    }
    return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS })
}

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url)
    const candidate = searchParams.get('candidate')

    if (candidate !== 'Tiny' && candidate !== 'React') {
        return Response.json({ error: 'Invalid candidate' }, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
    const connection = new Connection('http://127.0.0.1:8899', 'confirmed')
    // @ts-expect-error
    const program = new Program<Voting>(VotingIDL, { connection })

    const body: ActionPostRequest = await request.json()
    let voter
    try {
        voter = new PublicKey(body.account)
    } catch (error) {
        return Response.json({ error: 'Invalid account' }, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }

    const instruction = await program.methods.vote(candidate, new BN(1)).accounts({ signer: voter }).instruction()
    const blockhash = await connection.getLatestBlockhash()
    const transaction = new Transaction({
        feePayer: voter,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight
    }).add(instruction)

    const response = await createPostResponse({
        fields: {
            type: 'transaction',
            transaction: transaction
        }
    })

    return Response.json(response, { headers: ACTIONS_CORS_HEADERS })
}

import { connection } from '../utils'
import { getKeypair } from '../utils'
import {
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js'
import { Log } from '../utils/log'

const payer = getKeypair()

const programId = new PublicKey('ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa')
const pingProgramDataId = new PublicKey(
  'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'
)

const transaction = new Transaction()

const instruction = new TransactionInstruction({
  keys: [
    {
      pubkey: pingProgramDataId,
      isSigner: false,
      isWritable: true
    }
  ],
  programId
})

transaction.add(instruction)

const signature = await sendAndConfirmTransaction(connection, transaction, [
  payer
])

Log.sign(signature)

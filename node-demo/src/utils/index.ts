import 'dotenv/config'
import { clusterApiUrl, Connection } from '@solana/web3.js'
import { getKeypairFromEnvironment } from '@solana-developers/helpers'

export const getKeypair = () => {
  return getKeypairFromEnvironment('SECRET_KEY')
}

export const connection = new Connection(clusterApiUrl('devnet'))

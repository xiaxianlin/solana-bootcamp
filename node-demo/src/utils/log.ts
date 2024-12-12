export const Log = {
  sign: (signature: string) => {
    console.log(
      `You can view your transaction on Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`
    )
  }
}

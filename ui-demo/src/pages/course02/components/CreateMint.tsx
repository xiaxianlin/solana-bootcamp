import { useCreateMint } from '@/hooks/useCreateMint'
import { Button } from 'antd'

export const CreateMint = () => {
  const { signuare, mint, create } = useCreateMint()
  return (
    <>
      <div>
        <Button onClick={create}>Create Mint</Button>
      </div>
      {signuare ? (
        <div>
          <p>Token Mint Address: {mint}</p>
          <p>View your transaction on </p>
          <Button type="link" href={`https://explorer.solana.com/tx/${signuare}?cluster=devnet`}>
            Solana Explorer
          </Button>
        </div>
      ) : null}
    </>
  )
}

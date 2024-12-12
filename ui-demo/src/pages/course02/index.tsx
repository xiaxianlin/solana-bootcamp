import { CreateMint } from './components/CreateMint'
import { CreateTokenAccount } from './components/CreateTokenAccount'
import { MintToForm } from './components/MinToForm'

export const Course02 = () => {
  return (
    <div>
      <CreateMint />
      <CreateTokenAccount />
      <MintToForm />
    </div>
  )
}

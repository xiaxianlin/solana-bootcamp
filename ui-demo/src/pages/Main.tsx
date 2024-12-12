import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Layout } from './Layout'

export const Main = () => {
  return (
    <div className="layout flex flex-col h-full">
      <nav className="bg-black">
        <div className="flex mx-auto px-4">
          <div className="flex flex-shrink-0 items-center">
            <img
              className="h-8 w-auto"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
            />
          </div>
          <div className="grow text-white text-4xl font-bold flex justify-center items-center">XXL-SOLANA-UI-DEMO</div>
          <div className="justify-center items-center my-2">
            <WalletMultiButton />
          </div>
        </div>
      </nav>
      <Layout />
    </div>
  )
}

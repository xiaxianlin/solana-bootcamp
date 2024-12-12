import { Menu } from 'antd'
import { Link, Outlet } from 'react-router-dom'
import { useAccount } from '@/hooks/useAccount'

export const Layout = () => {
  const { balance, account } = useAccount()
  if (!account) {
    return <div>连接钱包中...</div>
  }
  return (
    <div className="flex bg-white h-full">
      <div className="flex flex-col h-full">
        <div
          className="flex text-black p-4"
          style={{
            borderBlockEnd: ' 1px solid rgba(5, 5, 5, 0.06)',
            borderInlineEnd: ' 1px solid rgba(5, 5, 5, 0.06)',
          }}
        >{`Balance: ${balance} SOL`}</div>
        <Menu className="grow" style={{ width: 256 }} mode="inline" activeKey={location.pathname}>
          <Menu.Item id="/course01">
            <Link to="/course01" replace>
              Course01
            </Link>
          </Menu.Item>
          <Menu.Item id="/course02">
            <Link to="/course02" replace>
              Course02
            </Link>
          </Menu.Item>
        </Menu>
      </div>
      <div className="mx-auto max-w-7xl pt-6">
        <Outlet />
      </div>
    </div>
  )
}

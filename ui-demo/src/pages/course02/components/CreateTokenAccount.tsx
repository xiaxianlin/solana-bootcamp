import { useCreateTokenAccount } from '@/hooks/useCreateTokenAccount'
import { Button, Card, Form, Input } from 'antd'

export const CreateTokenAccount = () => {
  const { loading, account, result, create } = useCreateTokenAccount()
  return (
    <Card title="Create Token Account" className="mt-4 w-[680px]">
      <Form
        layout="vertical"
        disabled={loading}
        onFinish={(values) => {
          create(values.mint, values.owner)
        }}
        initialValues={{
          mint: '9fpHrQxJ75QwuGUhg6N7t3Fh713NA7rhVPxiDn72s1VV',
          owner: 'BC9HjdT6p5TX3ZxSj4YdbjGN1i96CcYa71YjrSFZ5rJF',
        }}
      >
        <Form.Item label="Token Mint" name="mint" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Token Account Owner" name="owner" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Create Token Account
          </Button>
        </Form.Item>
      </Form>
      {result ? (
        <div>
          <p>Token Account Address: {account}</p>
          <div className="flex items-center">
            <p>View your transaction on </p>
            <Button type="link" target="_blank" href={`https://explorer.solana.com/tx/${result}?cluster=devnet`}>
              Solana Explorer
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  )
}

import { useMintTo } from '@/hooks/useMintTo'
import { Button, Card, Form, Input } from 'antd'

export const MintToForm = () => {
  const { loading, signature, mintTo } = useMintTo()
  return (
    <Card title="Mint To Form" className="mt-4 w-[680px]">
      <Form
        layout="vertical"
        disabled={loading}
        onFinish={(values) => {
          mintTo(values.mint, values.recipient, values.amount)
        }}
        initialValues={{
          mint: '9fpHrQxJ75QwuGUhg6N7t3Fh713NA7rhVPxiDn72s1VV',
          recipient: 'BC9HjdT6p5TX3ZxSj4YdbjGN1i96CcYa71YjrSFZ5rJF',
          amount: 500,
        }}
      >
        <Form.Item label="Token Mint" name="mint" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Token Account Owner" name="recipient" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Amount Tokens To Amount" name="amount" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Mint Tokens
          </Button>
        </Form.Item>
      </Form>
      {signature ? (
        <div className="flex items-center">
          <p>View your transaction on </p>
          <Button type="link" target="_blank" href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}>
            Solana Explorer
          </Button>
        </div>
      ) : null}
    </Card>
  )
}

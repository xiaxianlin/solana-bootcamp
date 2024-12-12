import { useSendSOL } from '@/hooks/useSendSOL'
import { Button, Form, Input } from 'antd'
import type { FormProps } from 'antd'

type FieldType = {
  lamports: number
  recipientPubKey: string
  programId?: string
}

export const Course01 = () => {
  const { send } = useSendSOL()

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    send(values.recipientPubKey, values.lamports, values.programId)
  }
  return (
    <div className="">
      <div className="flex justify-center">
        <Form
          layout="vertical"
          name="basic"
          style={{ width: 640 }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item<FieldType> label="公钥" name="recipientPubKey" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType> label="SOL" name="lamports" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item<FieldType> label="Promgram" name="programId">
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              发送
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

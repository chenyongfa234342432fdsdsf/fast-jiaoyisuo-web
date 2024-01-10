/**
 * form 表单项组件
 */
import { Form, FormItemProps } from '@nbit/arco'
import { t } from '@lingui/macro'

interface Props extends FormItemProps {
  children: React.ReactNode
}

function FormItem(props: Props) {
  const formMessage = [
    { required: true, message: t`features/c2c-trade/creates-advertisements/createsadvertisements-0` },
  ]

  const {
    children,
    rules = formMessage,
    className = 'form-item',
    formatter = item => {
      if (typeof item === 'string') {
        item = item.replace(/\s*/g, '')
        return item
      }
      return item
    },
  } = props

  return (
    <Form.Item {...props} rules={rules} formatter={formatter} className={className} requiredSymbol={false}>
      {children}
    </Form.Item>
  )
}

export default FormItem

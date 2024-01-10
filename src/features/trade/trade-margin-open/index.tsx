import { t } from '@lingui/macro'
import classnames from 'classnames'
import { Form, FormInstance, Radio } from '@nbit/arco'
import { forwardRef, useImperativeHandle } from 'react'
import { useLayoutStore } from '@/store/layout'
import Styles from './index.module.css'

const FormItem = Form.Item
export interface ITradeMarginOpenRef {
  form: FormInstance
}
function TradeMarginFormItem(props) {
  const { it, i, ...rest } = props
  return (
    <div>
      <div className="mb-2">
        {i + 1}.{it.title}
      </div>
      <Radio.Group direction="vertical" {...rest}>
        {it.list.map(item => {
          return (
            <Radio key={item.id} value={item.id}>
              {({ checked }) => {
                return (
                  <div
                    className={`custom-radio-card ${
                      checked ? (it.right === item.id ? 'custom-radio-card-right' : 'custom-radio-card-error') : ''
                    }`}
                  >
                    <div className="custom-radio-card-mask">
                      <div className="custom-radio-card-mask-dot"></div>
                    </div>
                    <div className="custom-radio-card-title">{item.label}</div>
                  </div>
                )
              }}
            </Radio>
          )
        })}
      </Radio.Group>
    </div>
  )
}
function TradeMarginOpen(props, ref) {
  const [form] = Form.useForm()
  const { headerData } = useLayoutStore()
  const formDataArr = [
    {
      right: 2,
      title: t({
        id: 'features/trade/trade-margin-open/index-0',
        values: { 0: headerData?.businessName },
      }),
      list: [
        {
          id: 1,
          label: t`features/trade/trade-margin-open/index-1`,
        },
        {
          id: 2,
          label: t`features/trade/trade-margin-open/index-2`,
        },
        {
          id: 3,
          label: t`features/trade/trade-margin-open/index-3`,
        },
        {
          id: 4,
          label: t`features/trade/trade-margin-open/index-4`,
        },
      ],
    },
    {
      title: t`features/trade/trade-margin-open/index-5`,
      right: 1,
      list: [
        {
          id: 1,
          label: t`features/trade/trade-margin-open/index-6`,
        },
        {
          id: 2,
          label: t`features/trade/trade-margin-open/index-7`,
        },
        {
          id: 3,
          label: t`features/trade/trade-margin-open/index-8`,
        },
      ],
    },
    {
      title: t`features/trade/trade-margin-open/index-9`,
      right: 1,
      list: [
        {
          id: 1,
          label: t`features/trade/trade-margin-open/index-10`,
        },
        {
          id: 2,
          label: t`features/trade/trade-margin-open/index-11`,
        },
      ],
    },
    {
      title: t`features/trade/trade-margin-open/index-12`,
      right: 1,
      list: [
        {
          id: 1,
          label: t`features/trade/trade-margin-open/index-13`,
        },
        {
          id: 2,
          label: t`features/trade/trade-margin-open/index-14`,
        },
      ],
    },
    {
      title: t`features/trade/trade-margin-open/index-15`,
      right: 2,
      list: [
        {
          id: 1,
          label: t`features/trade/trade-margin-open/index-16`,
        },
        {
          id: 2,
          label: t`features/trade/trade-margin-open/index-17`,
        },
      ],
    },
    {
      title: t`features/trade/trade-margin-open/index-18`,
      right: 2,
      list: [
        {
          id: 1,
          label: t`features/trade/trade-margin-open/index-19`,
        },
        {
          id: 2,
          label: t`features/trade/trade-margin-open/index-20`,
        },
        {
          id: 3,
          label: t`features/trade/trade-margin-open/index-21`,
        },
      ],
    },
  ]
  useImperativeHandle(ref, () => ({
    form,
  }))
  return (
    <div className={Styles.scoped}>
      <Form layout="vertical" scrollToFirstError form={form} validateTrigger="onSubmit">
        {formDataArr.map((it, i) => {
          return (
            <FormItem
              labelAlign="left"
              key={i}
              field={`No.${i + 1}`}
              rules={[
                {
                  required: true,
                },
                {
                  validator(value, cb) {
                    if (value !== it.right) {
                      return cb(t`features/trade/trade-margin-open/index-22`)
                    }

                    return cb()
                  },
                },
              ]}
            >
              <TradeMarginFormItem it={it} i={i} />
            </FormItem>
          )
        })}
      </Form>
    </div>
  )
}
export default forwardRef(TradeMarginOpen)

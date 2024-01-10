import { useFuturesStore } from '@/store/futures'
import { t } from '@lingui/macro'
import { Form, FormInstance, Radio } from '@nbit/arco'
import classNames from 'classnames'
import { forwardRef, MutableRefObject, useImperativeHandle, useMemo, useState } from 'react'
import Styles from './index.module.css'

const FormItem = Form.Item
export interface ITradeFuturesOpenRef {
  form: FormInstance
  msg: MutableRefObject<string>
}
function TradeFuturesFormItem(props) {
  const { it, i, msg, ...rest } = props
  return (
    <div>
      <div className="mb-2 text-text_color_01 font-medium">
        {i + 1}.{it.title}
      </div>
      <Radio.Group direction="vertical" {...rest}>
        {it.list.map(item => {
          return (
            <Radio key={item.id} value={item.id}>
              {({ checked }) => {
                return (
                  <div
                    className={classNames('custom-radio-card', {
                      'custom-radio-card-right': msg !== null && checked && it.right === item.id,
                      'custom-radio-card-error': msg !== null && checked && it.right !== item.id,
                    })}
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
function TradeFuturesOpen(props, ref) {
  const [msg, setMsg] = useState({})
  const [form] = Form.useForm()
  const { openQuestionsMsg } = useFuturesStore()
  const _msg = useMemo(() => {
    const keysList = Object.keys(msg)
    let str = null
    keysList.forEach(k => {
      if (msg[k]) {
        str = msg[k]
      }
    })
    return str
  }, [msg])
  const formDataArr = [
    {
      right: 1,
      title: t`features/trade/trade-futures-open/index-0`,
      list: [
        {
          id: 1,
          label: t`features/trade/trade-futures-open/index-1`,
        },
        {
          id: 2,
          label: t`assets.financial-record.search.error`,
        },
      ],
    },
    {
      title: t`features/trade/trade-futures-open/index-2`,
      right: 2,
      list: [
        {
          id: 1,
          label: t`features/trade/trade-futures-open/index-3`,
        },
        {
          id: 2,
          label: t`features/trade/trade-futures-open/index-4`,
        },
      ],
    },
    {
      title: t`features/trade/trade-futures-open/index-5`,
      right: 1,
      list: [
        {
          id: 1,
          label: t`features/trade/trade-futures-open/index-6`,
        },
        {
          id: 2,
          label: t`features/trade/trade-futures-open/index-7`,
        },
      ],
    },
    {
      title: t`features/trade/trade-futures-open/index-8`,
      right: 1,
      list: [
        {
          id: 1,
          label: t`features/trade/trade-futures-open/index-9`,
        },
        {
          id: 2,
          label: t`features/trade/trade-futures-open/index-10`,
        },
      ],
    },
  ]
  useImperativeHandle(ref, () => ({
    form,
    msg: _msg,
    setMsg,
  }))
  return (
    <div className={Styles.scoped}>
      <div className="list-main">
        <Form layout="vertical" scrollToFirstError form={form} validateTrigger="onSubmit">
          {formDataArr.map((it, i) => {
            return (
              <FormItem
                labelAlign="left"
                key={i}
                field={`No.${i + 1}`}
                rules={[
                  {
                    required: false,
                  },
                  {
                    validator(value, cb) {
                      if (value !== it.right) {
                        setMsg(pre => ({
                          ...pre,
                          ...{
                            [i]: t`features/trade/trade-margin-open/index-22`,
                          },
                        }))
                        return cb()
                      }

                      setMsg(pre => ({
                        ...pre,
                        ...{
                          [i]: '',
                        },
                      }))
                      return cb()
                    },
                  },
                ]}
              >
                <TradeFuturesFormItem msg={_msg} it={it} i={i} />
              </FormItem>
            )
          })}
        </Form>
      </div>
      <div className="text-xs text-warning_color absolute -bottom-6">{openQuestionsMsg}</div>
    </div>
  )
}
export default forwardRef(TradeFuturesOpen)

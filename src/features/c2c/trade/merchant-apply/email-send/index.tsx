import { c2cMaHelpers } from '@/helper/c2c/merchant-application'
import { isValidateEmailAddress, isValidEmailOpt, c2cMaFormRules } from '@/helper/c2c/merchant-application/utils'
import { t } from '@lingui/macro'
import { Form, FormInstance, Grid, Input, InputNumber, Message } from '@nbit/arco'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { Statistic } from '@nbit/arco'
import styles from './index.module.css'

const Countdown = Statistic.Countdown

const FormItem = Form.Item
const Row = Grid.Row
const Col = Grid.Col

export function C2cMaSendEmail({ formInstance }) {
  const form = formInstance as FormInstance

  const isEmailSend = useRef<boolean>(false)
  const isEmailVerifySucceed = useRef<boolean>(false)
  const email = Form.useWatch('email', form)
  // const emailOtp = Form.useWatch('emailOtp', form)
  const rules = c2cMaFormRules()

  const now = Date.now()
  const value = now + 60 * 1000
  const [start, setStart] = useState<boolean>(false)
  const [text, setText] = useState<string>(t`features_c2c_trade_merchant_application_index_22222225101384`)

  const setEmailFieldError = (msg?: string) => {
    form.setFields({
      email: {
        error: {
          message: msg || t`features_user_utils_validate_2556`,
        },
      },
    })
  }

  useEffect(() => {
    form.setFieldValue('emailOtp', '')
    setStart(false)
    setText(t`features_c2c_trade_merchant_application_index_22222225101384`)
    isEmailSend.current = false
    isEmailVerifySucceed.current = false
  }, [email])

  const handleSend = () => {
    if (isEmailVerifySucceed.current) return
    const { isValid, errorMessage } = isValidateEmailAddress(email)
    if (isValid && !errorMessage) {
      c2cMaHelpers
        .sendEmailHelper(email)
        .then(res => {
          setStart(true)
          isEmailSend.current = true
          Message.success(t`features_c2c_trade_merchant_apply_email_send_index_hxgcbfxkqs7jompkwjzqd`)
        })
        .catch(e => {})
    } else {
      setEmailFieldError(errorMessage)
    }
  }

  return (
    <div className={classNames(styles.scope)}>
      <Row gutter={24}>
        <Col span={12}>
          <FormItem
            label={t`features_c2c_trade_merchant_application_index_22222225101377`}
            field={'email'}
            rules={[rules.email]}
          >
            <Input placeholder={t`user.validate_form_02`} />
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            label={t`user.field.reuse_03`}
            field={'emailOtp'}
            rules={[
              {
                required: true,
                validator: (value, cb) => {
                  const { isValid, errorMessage } = isValidateEmailAddress(email)
                  if (!isValid || errorMessage) {
                    setEmailFieldError(errorMessage)
                    cb(' ')
                  }
                },
              },
              {
                validator: (value, cb) => {
                  const { isValid, errorMessage } = isValidEmailOpt(value, isEmailSend)
                  if (!isValid || errorMessage) {
                    cb(errorMessage)
                  }
                },
              },
              {
                validator: async (value, cb) => {
                  return new Promise(resolve => {
                    c2cMaHelpers
                      .validateEmailHelper(email, value)
                      .then(() => {
                        setText(t`features_c2c_trade_merchant_application_index_22222225101384`)
                        setStart(false)
                        isEmailVerifySucceed.current = true
                      })
                      .catch(() => {
                        setText(t`features_c2c_trade_merchant_application_index_22222225101384`)
                        isEmailVerifySucceed.current = false
                        cb(t`features_c2c_trade_merchant_apply_email_send_index_rbubj4z-ik6d6wowwgxmk`)
                      })
                      .finally(() => {
                        resolve()
                      })
                  })
                },
              },
            ]}
          >
            <InputNumber
              hideControl
              suffix={
                <Countdown
                  value={value}
                  format="s"
                  start={start}
                  now={now}
                  onFinish={() => {
                    setStart(false)
                    setText(t`features_c2c_trade_merchant_application_index_22222225101384`)
                  }}
                  renderFormat={(_, values) => {
                    return (
                      <div className="text-sm text-brand_color font-medium">
                        <button type="button" disabled={start} onClick={handleSend}>
                          {start ? `${values}s` : text}
                        </button>
                      </div>
                    )
                  }}
                />
              }
            />
          </FormItem>
        </Col>
      </Row>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { t } from '@lingui/macro'
import { Button, Form, Input, Message } from '@nbit/arco'
import UserTipsInfo from '@/features/user/common/tips-info'
import { getMemberBaseGetPhishingCode, getMemberBaseVerifyPhishingCode } from '@/apis/user'
import { AntiPhishingCodeRules } from '@/features/user/utils/validate'
import { useLayoutStore } from '@/store/layout'
import LazyImage from '@/components/lazy-image'
import styles from './index.module.css'

const FormItem = Form.Item

function UserAntiPhishingCode({ onSuccess }) {
  const { headerData } = useLayoutStore()
  const [code, setCode] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  // const [disabled, setDisabled] = useState<boolean>(true)

  const [form] = Form.useForm()
  // const antiPhishingCode = Form.useWatch('antiPhishingCode', form)

  const rules = AntiPhishingCodeRules()

  // const handleValidateChange = () => {
  //   form
  //     .validate()
  //     .then(() => setDisabled(false))
  //     .catch(() => setDisabled(true))
  // }

  const getPhishingCode = async () => {
    const res = await getMemberBaseGetPhishingCode({})
    if (res.isOk) {
      setCode(res.data!.phishingCode)
    }
  }

  useEffect(() => {
    if (code === '') {
      getPhishingCode()
    }
  }, [])

  const onSubmit = async () => {
    setLoading(true)
    const res = await getMemberBaseVerifyPhishingCode({ phishingCode: code })
    if (res.isOk && res.data?.isSuccess) {
      Message.success(t`user.field.reuse_34`)
      form.clearFields()
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <div className={`user-anti-phishing-code user-form-style ${styles.scoped}`}>
      <div className="user-anti-phishing-code-wrap">
        <UserTipsInfo slotContent={<p>{t`user.account_security.anti_phishing_01`}</p>} />

        <Form
          layout="vertical"
          form={form}
          autoComplete="off"
          onSubmit={onSubmit}
          validateTrigger="onBlur"
          // onChange={handleValidateChange}
        >
          <FormItem
            label={t`user.field.reuse_16`}
            requiredSymbol={false}
            field="antiPhishingCode"
            rules={[rules.antiPhishingCode]}
          >
            <Input
              maxLength={10}
              value={code}
              onChange={setCode}
              placeholder={t`user.account_security.anti_phishing_02`}
            />
          </FormItem>

          <div className="text">
            <label>{t`user.account_security.anti_phishing_03`}</label>
          </div>

          <div className="card">
            <div className="card-wrap">
              <div className="header">
                <div className="icon">
                  <LazyImage src={headerData?.imgWebLogo as string} />
                </div>
                <div className="name">
                  <label>{headerData?.businessName}</label>
                </div>
                <div className="code">
                  <label>
                    {t`user.field.reuse_16`}：{code ? <span>{code}</span> : t`user.account_security.anti_phishing_04`}
                  </label>
                </div>
              </div>
              <div className="main">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="footer">
                <p>
                  {t`user.account_security.anti_phishing_05`} <label>{headerData?.businessName}</label>{' '}
                  {t`user.account_security.anti_phishing_06`}
                </p>
              </div>
            </div>
          </div>

          <FormItem style={{ marginBottom: 0 }}>
            <Button
              loading={loading}
              type="primary"
              htmlType="submit"
              // disabled={disabled || !antiPhishingCode}
            >
              {t`user.field.reuse_02`}
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  )
}

export default UserAntiPhishingCode

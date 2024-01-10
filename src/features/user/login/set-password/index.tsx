import { useState } from 'react'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import Icon from '@/components/icon'
import { useUserStore } from '@/store/user'
import { postSetPasswordRequest } from '@/apis/user'
import { Button, Form, Input, Message } from '@nbit/arco'
import { usePageContext } from '@/hooks/use-page-context'
import { RegisterFlowRules } from '@/features/user/utils/validate'
import UserPasswordValidateTips from '@/features/user/common/password-validate'
import { FormValuesTrim } from '@/features/user/utils/common'
import styles from './index.module.css'

const FormItem = Form.Item

function SetPassword() {
  const [passwordValue, setPasswordValue] = useState<string>('')
  const [passwordValidate, setPasswordValidate] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [passwordShow, setPasswordShow] = useState({
    newPasswordShow: true,
    confirmPasswordShow: true,
  })
  const [form] = Form.useForm()
  const loginPassword = Form.useWatch('loginPassword', form)
  const confirmPassword = Form.useWatch('confirmPassword', form)
  const rules = RegisterFlowRules(loginPassword)
  const pageContext = usePageContext()
  const { clearThirdPartyToken } = useUserStore()

  const getRouterParams = () => {
    const urlParsed = pageContext?.urlParsed?.search
    const type = urlParsed?.type
    const accountData = urlParsed?.account
    return { type, accountData }
  }

  const onSubmit = async values => {
    if (!passwordValidate) {
      Message.info(t`features_user_register_flow_index_2448`)
      return
    }
    const { type, accountData } = getRouterParams()
    const params = {
      accountType: type,
      account: accountData,
      password: values?.loginPassword,
    }
    setLoading(true)
    const { data, isOk } = await postSetPasswordRequest(params)
    if (isOk && data) {
      Message.success(t`features/user/personal-center/settings/converted-currency/index-0`)
      link('/')
      clearThirdPartyToken()
    }
    setLoading(false)
  }

  const onJumpOverChange = () => {
    link('/')
    clearThirdPartyToken()
  }

  const handleClearPassword = (key: string) => {
    form.setFieldValue(key, '')
    key === 'loginPassword' && setPasswordValue('')
  }

  return (
    <section className={`user-register-flow user-form-style ${styles.scoped}`}>
      <div className="set-password-back">
        <Icon name="back" hasTheme className="mt-px" />
        <label onClick={() => window.history.back()}>{t`user.field.reuse_44`}</label>
      </div>
      <div className="set-password-wrap">
        <p>{t`features_user_login_set_password_index_q62wbvnlxe`}</p>
        <span className="content-text">{t`features_user_login_set_password_index_80rznagjwk`}</span>
        <Form
          form={form}
          layout="vertical"
          onSubmit={onSubmit}
          autoComplete="off"
          validateTrigger="onBlur"
          initialValues={{ serviceAgreement: false }}
        >
          <FormItem
            label={t`user.validate_form_05`}
            field="loginPassword"
            requiredSymbol={false}
            formatter={FormValuesTrim}
            rules={[rules.password]}
          >
            <Input
              type={passwordShow.newPasswordShow ? 'password' : 'text'}
              maxLength={16}
              onChange={setPasswordValue}
              placeholder={t`user.validate_form_06`}
              suffix={
                <>
                  {loginPassword && (
                    <Icon name="del_input_box" hasTheme onClick={() => handleClearPassword('loginPassword')} />
                  )}

                  <Icon
                    name={passwordShow.newPasswordShow ? 'eyes_open' : 'eyes_close'}
                    hasTheme
                    onClick={() =>
                      setPasswordShow({
                        ...passwordShow,
                        newPasswordShow: !passwordShow.newPasswordShow,
                      })
                    }
                  />
                </>
              }
            />
          </FormItem>
          <UserPasswordValidateTips password={FormValuesTrim(passwordValue) as string} validate={setPasswordValidate} />
          <FormItem
            label={t`user.field.reuse_12`}
            field="confirmPassword"
            requiredSymbol={false}
            formatter={FormValuesTrim}
            rules={[rules.confirmPassword]}
          >
            <Input
              type={passwordShow.confirmPasswordShow ? 'password' : 'text'}
              maxLength={16}
              placeholder={t`user.validate_form_06`}
              suffix={
                <>
                  {confirmPassword && (
                    <Icon name="del_input_box" hasTheme onClick={() => handleClearPassword('confirmPassword')} />
                  )}

                  <Icon
                    name={passwordShow.confirmPasswordShow ? 'eyes_open' : 'eyes_close'}
                    hasTheme
                    onClick={() =>
                      setPasswordShow({
                        ...passwordShow,
                        confirmPasswordShow: !passwordShow.confirmPasswordShow,
                      })
                    }
                  />
                </>
              }
            />
          </FormItem>
          <FormItem>
            <Button loading={loading} type="primary" htmlType="submit">
              {t`user.validate_form_11`}
            </Button>
          </FormItem>
        </Form>
        <div className="set-password-footer" onClick={() => onJumpOverChange()}>
          <span>{t`features_user_login_set_password_index_tdjm7cqt6a`}</span>
        </div>
      </div>
    </section>
  )
}

export default SetPassword

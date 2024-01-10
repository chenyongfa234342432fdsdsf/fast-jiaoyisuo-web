import { useState, useRef } from 'react'
import { Button, Form, Input, Message } from '@nbit/arco'
import UserTipsInfo from '@/features/user/common/tips-info'
import UserPopUp from '@/features/user/components/popup'
import UserPopUpSuccessContent from '@/features/user/components/popup/content/success'
import UserCountDown from '@/features/user/components/count-down'
import UserFormLayout from '@/features/user/common/user-form-layout'
import { t } from '@lingui/macro'
import { usePageContext } from '@/hooks/use-page-context'
import { AccountSecurityOperationTypeEnum, UserSendValidateCodeBusinessTypeEnum } from '@/constants/user'
import { postMemberSafeEmailUpdate, postMemberSafeEmailBind, postMemberSafeVerifyEmailSend } from '@/apis/user'
import { PersonalCenterEmailRules } from '@/features/user/utils/validate'
import { useUserStore } from '@/store/user'
import { link } from '@/helper/link'

const FormItem = Form.Item

function UserAccountSecurityEmail() {
  const [visible, setVisible] = useState<boolean>(false)
  const [newEmail, setNewEmail] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const isEmailSend = useRef<boolean>(false)
  // const [disabled, setDisabled] = useState<boolean>(true)

  const pageContext = usePageContext()
  const [form] = Form.useForm()
  const store = useUserStore()
  const email = Form.useWatch('email', form)
  // const verifyCode = Form.useWatch('verifyCode', form)

  const rules = PersonalCenterEmailRules(isEmailSend)

  const mode = pageContext.urlParsed.search?.type || ''

  const type =
    mode === AccountSecurityOperationTypeEnum.modify
      ? UserSendValidateCodeBusinessTypeEnum.modifyNewEmail
      : UserSendValidateCodeBusinessTypeEnum.bindEmail

  // const handleValidateChange = () => {
  //   form
  //     .validate()
  //     .then(() => setDisabled(false))
  //     .catch(() => setDisabled(true))
  // }

  const handleSendEmailValidateCode = async () => {
    if (!email) {
      Message.warning(t`user.validate_form_02`)
      return false
    }

    const res = await postMemberSafeVerifyEmailSend({
      type,
      email,
    })
    const isTrue = (res.isOk && res.data?.isSuccess) || false
    if (isTrue) {
      isEmailSend.current = true
      Message.success(t`user.field.reuse_38`)
    }
    return isTrue
  }

  const onSubmit = async values => {
    values.operateType = type
    setLoading(true)

    if (mode === AccountSecurityOperationTypeEnum.modify) {
      const res = await postMemberSafeEmailUpdate(values)
      if (res.isOk && res.data?.isSuccess) {
        setNewEmail(form.getFieldValue('email'))
        setVisible(true)
      }
      setLoading(false)
    } else {
      const res = await postMemberSafeEmailBind(values)
      if (res.isOk && res.data?.isSuccess) {
        Message.success(t`features_user_personal_center_account_security_email_index_2430`)
        link('/personal-center/account-security')
      }
      setLoading(false)
    }
  }

  const handleModifySuccess = async () => {
    if (mode === AccountSecurityOperationTypeEnum.modify) {
      await store.clearUserCacheData()
      Message.success(t`features_user_personal_center_menu_navigation_index_2443`)
      setVisible(false)
      setLoading(false)
      link('/login')
      return
    }

    link('/personal-center/account-security')
  }

  return (
    <div className="user-account-security-email user-form-style mt-36">
      <div className="user-account-security-email-wrap">
        <UserFormLayout
          title={
            mode === AccountSecurityOperationTypeEnum.bind
              ? t`features_user_personal_center_account_security_email_index_2607`
              : t`features_user_personal_center_account_security_email_index_2608`
          }
        >
          <UserTipsInfo
            slotContent={
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <>
                {mode === AccountSecurityOperationTypeEnum.bind ? (
                  <p>{t`user.account_security.email.verification_01`}</p>
                ) : (
                  <>
                    <p>{t`user.account_security.email.verification_02`}</p>
                    <p>{t`user.account_security.email.verification_03`}</p>
                  </>
                )}
              </>
            }
          />

          <Form form={form} layout="vertical" onSubmit={onSubmit} autoComplete="off" validateTrigger="onBlur">
            <FormItem
              label={t`user.account_security.email.verification_04`}
              field="email"
              requiredSymbol={false}
              rules={[rules.email]}
            >
              <Input placeholder={t`user.account_security.email.verification_05`} />
            </FormItem>

            <FormItem
              label={t`user.field.reuse_18`}
              field="verifyCode"
              requiredSymbol={false}
              rules={[rules.emailCode]}
            >
              <Input
                type="number"
                maxLength={6}
                placeholder={t`user.account_security.email.verification_06`}
                suffix={<UserCountDown onSend={handleSendEmailValidateCode} />}
              />
            </FormItem>

            <FormItem style={{ marginBottom: 0 }}>
              <Button loading={loading} type="primary" htmlType="submit">
                {t`user.field.reuse_10`}
              </Button>
            </FormItem>
          </Form>
        </UserFormLayout>
      </div>

      <UserPopUp
        className="user-popup user-popup-success"
        visible={visible}
        closable={false}
        onCancel={handleModifySuccess}
        footer={<Button type="primary" onClick={handleModifySuccess}>{t`user.field.reuse_32`}</Button>}
      >
        <UserPopUpSuccessContent
          slotContent={
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {mode === AccountSecurityOperationTypeEnum.modify ? (
                <p>{t`user.account_security.email.verification_07`}</p>
              ) : (
                <>
                  <p>{t`user.account_security.email.verification_08`}</p>
                  <p>
                    {t`user.account_security.email.verification_09`} {newEmail}
                  </p>
                </>
              )}
            </>
          }
        />
      </UserPopUp>
    </div>
  )
}

export default UserAccountSecurityEmail

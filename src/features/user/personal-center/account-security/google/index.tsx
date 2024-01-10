import { useState, useEffect } from 'react'
import { Button, Form, Input, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
// import { link } from '@/helper/link'
import UserGoogleKeyContent from '@/features/user/common/secret-key'
// import UserPopUp from '@/features/user/components/popup'
// import UserPopUpSuccessContent from '@/features/user/components/popup/content/success'
import {
  getMemberSafeVerifyGoogleSecretKey,
  // getMemberUserLoginOut,
  postMemberSafeGoogleUpdate,
  postMemberSafeGoogleBind,
} from '@/apis/user'
import { PersonalCenterGoogleRules } from '@/features/user/utils/validate'
// import { useUserStore } from '@/store/user'
import { AccountSecurityOperationTypeEnum, UserSendValidateCodeBusinessTypeEnum } from '@/constants/user'
import Icon from '@/components/icon'

const FormItem = Form.Item

function UserAccountSecurityGoogleKey({ mode, onSuccess }) {
  const [qrCode, setQrCode] = useState<string>('')
  const [secretKey, setSecretKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  // const [disabled, setDisabled] = useState<boolean>(true)
  // const [visible, setVisible] = useState<boolean>(false)

  const [form] = Form.useForm()
  // const store = useUserStore()
  // const verifyCode = Form.useWatch('verifyCode', form)

  const rules = PersonalCenterGoogleRules()

  // const handleValidateChange = () => {
  //   form
  //     .validate()
  //     .then(() => setDisabled(false))
  //     .catch(() => setDisabled(true))
  // }

  const getGoogleSecretKey = async () => {
    const res = await getMemberSafeVerifyGoogleSecretKey({})
    if (res.isOk) {
      setQrCode(res.data!.qrPath)
      setSecretKey(res.data!.secretKey)
    }
  }

  useEffect(() => {
    if (qrCode === '' && secretKey === '') {
      getGoogleSecretKey()
    }
  }, [qrCode, secretKey])

  const onSubmit = async values => {
    setLoading(true)
    if (mode === AccountSecurityOperationTypeEnum.modify) {
      values.operateType = UserSendValidateCodeBusinessTypeEnum.modifyGoogle
      values.secretKey = secretKey

      const res = await postMemberSafeGoogleUpdate(values)
      // res.isOk && res.data?.isSuccess && setVisible(true)
      if (res.isOk) {
        Message.success(t`user.field.reuse_40`)
        onSuccess()
      }
      setLoading(false)
    } else {
      const res = await postMemberSafeGoogleBind({ secretKey, verifyCode: values.verifyCode })
      if (res.isOk) {
        Message.success(t`features_user_personal_center_account_security_email_index_2430`)
        onSuccess()
      }
      setLoading(false)
    }
  }

  // const handleModifySuccess = async () => {
  //   await getMemberUserLoginOut({})
  //   await store.clearUserCacheData()
  //   setVisible(false)
  //   link('/login')
  // }

  return (
    <>
      <UserGoogleKeyContent qrcode={qrCode} secretKey={secretKey} />

      <Form
        form={form}
        layout="vertical"
        onSubmit={onSubmit}
        autoComplete="off"
        validateTrigger="onBlur"
        // onChange={handleValidateChange}
      >
        <FormItem label={t`user.field.reuse_05`} field="verifyCode" requiredSymbol={false} rules={[rules.googleKey]}>
          <Input type="number" maxLength={6} placeholder={t`user.safety_verification_06`} />
        </FormItem>

        <div className="popup-tips-text">
          <Icon name="msg" />
          <label>{t`user.account_security.google.verification_01`}</label>
        </div>

        <FormItem style={{ marginBottom: 0 }}>
          <Button
            loading={loading}
            type="primary"
            htmlType="submit"
            // disabled={disabled || !verifyCode}
          >
            {t`user.field.reuse_10`}
          </Button>
        </FormItem>
      </Form>

      {/* <UserPopUp
        className="user-popup user-popup-success"
        visible={visible}
        closable={false}
        onCancel={() => setVisible(false)}
        footer={<Button type="primary" onClick={handleModifySuccess}>{t`user.field.reuse_32`}</Button>}
      >
        <UserPopUpSuccessContent
          slotContent={<p>{t`features_user_personal_center_account_security_google_index_2535`}</p>}
        />
      </UserPopUp> */}
    </>
  )
}

export default UserAccountSecurityGoogleKey

import { useState, useRef } from 'react'
import { Button, Form, Input, Message } from '@nbit/arco'
import { useUpdateEffect } from 'ahooks'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import Link from '@/components/link'
import UserTipsInfo from '@/features/user/common/tips-info'
import UserPasswordValidateTips from '@/features/user/common/password-validate'
import UserPopUp from '@/features/user/components/popup'
import UserPopUpSuccessContent from '@/features/user/components/popup/content/success'
import UserCountDown from '@/features/user/components/count-down'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'
import UserFormLayout from '@/features/user/common/user-form-layout'
import { RetrieveRestPasswordRules } from '@/features/user/utils/validate'
import {
  postMemberSafeVerifyEmailSend,
  postMemberSafeVerifyPhoneSend,
  postMemberSafeResetPassword,
  // postMemberQueryWorkOrderStatus,
} from '@/apis/user'
import { UserSendValidateCodeBusinessTypeEnum, UserVerifyTypeEnum, UserAgreementEnum } from '@/constants/user'
import { useUserStore } from '@/store/user'
import { UserInformationDesensitization, FormValuesTrim } from '@/features/user/utils/common'
import { useLayoutStore } from '@/store/layout'
import Icon from '@/components/icon'
import styles from './index.module.css'

const FormItem = Form.Item

function UserRetrieveResetPassword() {
  const [successPopup, setSuccessPopup] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [passwordValidate, setPasswordValidate] = useState<boolean>(false)
  const [workOrderPopUp, setWorkOrderPopUp] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  // const [disabled, setDisabled] = useState<boolean>(true)
  const [passwordShow, setPasswordShow] = useState({
    newPasswordShow: false,
    confirmPasswordShow: false,
  })
  const isEmailSend = useRef<boolean>(false)
  const isPhoneSend = useRef<boolean>(false)

  const store = useUserStore()
  const layoutStore = useLayoutStore()
  const [form] = Form.useForm()
  const newPassword = Form.useWatch('newPassword', form)
  const confirmPassword = Form.useWatch('confirmPassword', form)
  // const verifyCode = Form.useWatch('verifyCode', form)

  const info = store.userTransitionDatas

  const data = {
    type: UserSendValidateCodeBusinessTypeEnum.resetPassword,
    email: info.email || '',
    mobileCountryCode: info.mobileCountryCode || '',
    mobile: info.mobileNumber || '',
    uid: info.uid || '',
  }

  const passwordRules = RetrieveRestPasswordRules(newPassword, isEmailSend, isPhoneSend)

  // const handleValidateChange = () => {
  //   form
  //     .validate()
  //     .then(() => setDisabled(false))
  //     .catch(() => setDisabled(true))
  // }

  useUpdateEffect(() => {
    newPassword && confirmPassword && form.validate(['newPassword', 'confirmPassword'])
  }, [newPassword, confirmPassword])

  const handleClearPassword = (key: string) => {
    form.setFieldValue(key, '')
    key === 'newPassword' && setPassword('')
  }

  // const handleToSecurityItem = async () => {
  //   const options = {
  //     type: info.accountType,
  //     account: info.email || info.mobileNumber,
  //   }
  //   const res = await postMemberQueryWorkOrderStatus(options)
  //   res.isOk && res.data?.isBeginManualVerifyProcess ? setWorkOrderPopUp(true) : link('/safety-items')
  // }

  const handleSendEmailValidateCode = async () => {
    const res = await postMemberSafeVerifyEmailSend(data)

    const isTrue = (res.isOk && res.data?.isSuccess) || false
    if (isTrue) {
      isEmailSend.current = true
      Message.success(t`user.field.reuse_38`)
    }
    return isTrue
  }

  const handleSendPhoneValidateCode = async () => {
    const res = await postMemberSafeVerifyPhoneSend(data)

    const isTrue = (res.isOk && res.data?.isSuccess) || false
    if (isTrue) {
      isPhoneSend.current = true
      Message.success(t`user.field.reuse_38`)
    }
    return isTrue
  }

  const handleOnSuccess = async () => {
    setSuccessPopup(false)
    await store.removeUserTransitionDatas()
    link('/login')
  }

  const onSubmit = async values => {
    if (!passwordValidate) {
      Message.warning(t`features_user_register_flow_index_2448`)
      return
    }

    setLoading(true)

    switch (info.accountType) {
      case UserVerifyTypeEnum.email:
        values.account = data?.email
        values.safeVerifyType = UserVerifyTypeEnum.email

        const emailRes = await postMemberSafeResetPassword(values)
        emailRes.isOk && emailRes.data?.isSuccess && setSuccessPopup(true)
        setLoading(false)
        break
      case UserVerifyTypeEnum.phone:
        values.mobileCountryCode = data.mobileCountryCode
        values.account = data?.mobile
        values.safeVerifyType = UserVerifyTypeEnum.phone

        const mobileRes = await postMemberSafeResetPassword(values)
        mobileRes.isOk && mobileRes.data?.isSuccess && setSuccessPopup(true)
        setLoading(false)
        break

      case UserVerifyTypeEnum.uid:
        values.account = data?.uid
        values.safeVerifyType = UserVerifyTypeEnum.uid

        const uidRes = await postMemberSafeResetPassword(values)
        uidRes.isOk && uidRes.data?.isSuccess && setSuccessPopup(true)
        setLoading(false)
        break
      default:
        break
    }
  }

  return (
    <div className={`user-retrieve-reset-password user-form-style ${styles.scoped}`}>
      <div className="user-retrieve-reset-password-wrap">
        <UserFormLayout title={t`user.field.reuse_24`}>
          <UserTipsInfo slotContent={<p>{t`user.field.reuse_30`}</p>} />

          <Form
            form={form}
            layout="vertical"
            onSubmit={onSubmit}
            autoComplete="off"
            validateTrigger="onBlur"
            // onChange={handleValidateChange}
          >
            <FormItem
              label={t`features_user_retrieve_reset_password_index_2613`}
              field="newPassword"
              requiredSymbol={false}
              formatter={FormValuesTrim}
              validateTrigger="onChange"
              rules={[passwordRules.password]}
            >
              <Input
                type={passwordShow.newPasswordShow ? 'text' : 'password'}
                maxLength={16}
                onChange={setPassword}
                placeholder={t`user.field.reuse_19`}
                suffix={
                  <>
                    {newPassword && (
                      <Icon name="del_input_box" hasTheme onClick={() => handleClearPassword('newPassword')} />
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

            <UserPasswordValidateTips password={FormValuesTrim(password) as string} validate={setPasswordValidate} />

            <FormItem
              label={t`user.field.reuse_12`}
              field="confirmPassword"
              requiredSymbol={false}
              formatter={FormValuesTrim}
              rules={[passwordRules.confirmPassword]}
            >
              <Input
                type={passwordShow.confirmPasswordShow ? 'text' : 'password'}
                maxLength={16}
                placeholder={t`user.account_security.modify_password_07`}
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

            {info.accountType === UserVerifyTypeEnum.email && (
              <FormItem
                field="verifyCode"
                requiredSymbol={false}
                rules={[passwordRules.emailCode]}
                label={t`user.field.reuse_03`}
                extra={t({
                  id: 'features_user_retrieve_reset_password_index_2444',
                  values: { 0: UserInformationDesensitization(info.email) },
                })}
              >
                <Input
                  type="number"
                  maxLength={6}
                  placeholder={t`user.field.reuse_20`}
                  suffix={<UserCountDown onSend={handleSendEmailValidateCode} />}
                />
              </FormItem>
            )}

            {info.accountType === UserVerifyTypeEnum.phone && (
              <FormItem
                field="verifyCode"
                requiredSymbol={false}
                rules={[passwordRules.phoneCode]}
                label={t`user.field.reuse_04`}
                extra={t({
                  id: 'features_user_retrieve_reset_password_index_2444',
                  values: { 0: `+${info.mobileCountryCode} ${UserInformationDesensitization(info.mobileNumber)}` },
                })}
              >
                <Input
                  type="number"
                  maxLength={6}
                  placeholder={t`user.field.reuse_21`}
                  suffix={<UserCountDown onSend={handleSendPhoneValidateCode} />}
                />
              </FormItem>
            )}

            <div className="security">
              <Link
                href={layoutStore.columnsDataByCd?.[UserAgreementEnum.unreceiveVerificationCode]?.webUrl}
                className="customize-link-style"
              >{t`user.field.reuse_22`}</Link>
            </div>

            <FormItem style={{ marginBottom: 0 }}>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                // disabled={disabled || !newPassword || !confirmPassword || !verifyCode}
              >
                {t`user.field.reuse_24`}
              </Button>
            </FormItem>
          </Form>
        </UserFormLayout>
      </div>

      <UserPopUp
        className="user-popup user-popup-success"
        visible={successPopup}
        closable={false}
        onCancel={handleOnSuccess}
        footer={<Button type="primary" onClick={handleOnSuccess}>{t`user.field.reuse_32`}</Button>}
      >
        <UserPopUpSuccessContent slotContent={<p>{t`user.account_security.modify_password_08`}</p>} />
      </UserPopUp>

      <UserPopUp
        className="user-popup user-popup-tips"
        visible={workOrderPopUp}
        closeIcon={<Icon name="close" hasTheme />}
        okText={t`user.safety_verification_14`}
        cancelText={t`user.field.reuse_48`}
        onOk={() => setWorkOrderPopUp(false)}
        onCancel={() => setWorkOrderPopUp(false)}
      >
        <UserPopupTipsContent slotContent={<p>{t`user.safety_verification_13`}</p>} />
      </UserPopUp>
    </div>
  )
}

export default UserRetrieveResetPassword

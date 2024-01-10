import { useMemo, useState, useRef } from 'react'
import { useRequest } from 'ahooks'
import { Form, Button, Input, Message } from '@nbit/arco'
import { link } from '@/helper/link'
import { t } from '@lingui/macro'
import UserCountDown from '@/features/user/components/count-down'
import UserPopUp from '@/features/user/components/popup'
import UserPopUpSuccessContent from '@/features/user/components/popup/content/success'
import UserFormLayout from '@/features/user/common/user-form-layout'
import FullScreenSpin from '@/features/user/components/full-screen-loading'
import { UserValidateMethodEnum, UserSendValidateCodeBusinessTypeEnum, UserAgreementEnum } from '@/constants/user'
import { usePageContext } from '@/hooks/use-page-context'
import { RegisterVerificationRules } from '@/features/user/utils/validate'
import {
  postMemberSafeVerifyEmailSend,
  postMemberSafeVerifyPhoneSend,
  postMemberSafeVerifyEmailCheck,
  postMemberSafeVerifyPhoneCheck,
  postMemberRegisterEmail,
  postMemberRegisterPhone,
} from '@/apis/user'
import { setToken } from '@/helper/auth'
import { UserInformationDesensitization } from '@/features/user/utils/common'
import { useUserStore } from '@/store/user'
import { useLayoutStore } from '@/store/layout'
import Icon from '@/components/icon'
import styles from './index.module.css'

const FormItem = Form.Item

export default function UserRegisterVerification() {
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [spinShow, setSpinShow] = useState<boolean>(false)
  const isEmailSend = useRef<boolean>(false)
  const isPhoneSend = useRef<boolean>(false)
  // const [disabled, setDisabled] = useState<boolean>(true)

  const pageContext = usePageContext()
  const store = useUserStore()
  const layoutStore = useLayoutStore()
  const { businessName } = layoutStore.footerData || {}
  const [form] = Form.useForm()
  // const verifyCode = Form.useWatch('verifyCode', form)

  const { type } = pageContext.urlParsed.search
  const info = store.userTransitionDatas

  const rules = RegisterVerificationRules(isEmailSend, isPhoneSend)

  const data = useMemo(() => {
    return {
      type: UserSendValidateCodeBusinessTypeEnum.register,
      email: info.email || '',
      mobileCountryCode: info.mobileCountryCode || '',
      mobile: info.mobileNumber || '',
      mobileNumber: info.mobileNumber || '',
      regCountry: info.regCountry || '',
      loginPassword: info.loginPassword || '',
      invite: info.invite || '',
    }
  }, [])

  // const handleValidateChange = () => {
  //   form
  //     .validate()
  //     .then(() => setDisabled(false))
  //     .catch(() => setDisabled(true))
  // }

  const handleSendEmailValidateCode = async () => {
    const res = await postMemberSafeVerifyEmailSend({ ...data })
    const isTrue = (res.isOk && res.data?.isSuccess) || false
    if (isTrue) {
      isEmailSend.current = true
      Message.success(t`user.field.reuse_38`)
    }
    return isTrue
  }

  const handleSendPhoneValidateCode = async () => {
    const res = await postMemberSafeVerifyPhoneSend({ ...data })
    const isTrue = (res.isOk && res.data?.isSuccess) || false
    if (isTrue) {
      isPhoneSend.current = true
      Message.success(t`user.field.reuse_38`)
    }
    return isTrue
  }

  const handleRegisterSuccess = res => {
    setSpinShow(false)

    if (res.isOk && res.data?.isSuccess) {
      setToken(res.data)
      store.setUserInfo({ ...res.data?.userInfo, ...res.data?.usrMemberSettingsVO })
      store.setLogin(true)
      store.removeUserTransitionDatas()
      setRegisterSuccess(true)
    }
  }

  const handleSafeVerifyCheck = async values => {
    switch (type) {
      case UserValidateMethodEnum.email:
        const emailCheckRes = await postMemberSafeVerifyEmailCheck(values)
        if (emailCheckRes.isOk && emailCheckRes.data?.isSuccess) {
          const emailRegisterRes = await postMemberRegisterEmail(values)
          setSpinShow(true)
          handleRegisterSuccess(emailRegisterRes)
        }
        setLoading(false)
        break
      case UserValidateMethodEnum.phone:
        const phoneCheckRes = await postMemberSafeVerifyPhoneCheck(values)
        if (phoneCheckRes.isOk && phoneCheckRes.data?.isSuccess) {
          const phoneRegisterRes = await postMemberRegisterPhone(values)
          setSpinShow(true)
          handleRegisterSuccess(phoneRegisterRes)
        }
        setLoading(false)
        break
      default:
        break
    }
  }

  const { run } = useRequest(handleSafeVerifyCheck, {
    throttleWait: 2000,
    manual: true,
  })

  const onSubmit = async values => {
    values = { ...data, ...values }
    setLoading(true)

    run(values)
  }

  return (
    <section className={`register user-form-style ${styles.scoped}`}>
      <div className="register-wrap user-validate">
        <UserFormLayout title={t`user.safety_verification_01`}>
          <div className="tips">
            {type === UserValidateMethodEnum.email && (
              <label>
                {t({
                  id: 'user.register.verification_01',
                  values: {
                    0: `${UserInformationDesensitization(data?.email)}`,
                  },
                })}
              </label>
            )}
            {type === UserValidateMethodEnum.phone && (
              <label>
                {t({
                  id: 'user.register.verification_03',
                  values: {
                    0: `+${data?.mobileCountryCode} ${UserInformationDesensitization(data?.mobile)}`,
                  },
                })}
              </label>
            )}
          </div>

          <Form
            layout="vertical"
            form={form}
            onSubmit={onSubmit}
            autoComplete="off"
            validateTrigger="onBlur"
            // onChange={handleValidateChange}
          >
            {type === UserValidateMethodEnum.email && (
              <FormItem
                field="verifyCode"
                requiredSymbol={false}
                rules={[rules.emailCode]}
                label={t`user.field.reuse_03`}
              >
                <Input
                  type="number"
                  maxLength={6}
                  placeholder={t`user.field.reuse_20`}
                  suffix={<UserCountDown onSend={handleSendEmailValidateCode} />}
                />
              </FormItem>
            )}

            {type === UserValidateMethodEnum.phone && (
              <FormItem
                field="verifyCode"
                requiredSymbol={false}
                rules={[rules.phoneCode]}
                label={t`user.field.reuse_04`}
              >
                <Input
                  type="number"
                  maxLength={6}
                  placeholder={t`user.field.reuse_21`}
                  suffix={<UserCountDown onSend={handleSendPhoneValidateCode} />}
                />
              </FormItem>
            )}

            <div className="not-received-validate">
              <label
                onClick={() => link(layoutStore.columnsDataByCd?.[UserAgreementEnum.unreceiveVerificationCode]?.webUrl)}
              >{t`user.field.reuse_22`}</label>
            </div>

            <FormItem>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                // disabled={disabled || !verifyCode}
              >
                {t`user.field.reuse_02`}
              </Button>
            </FormItem>
          </Form>
        </UserFormLayout>
      </div>

      <UserPopUp
        className="user-popup user-popup-success"
        visible={registerSuccess}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => link('/')}
        footer={
          <Button type="primary" onClick={() => link('/')}>
            {t({
              id: 'features_user_register_verification_index_5101343',
              values: { 0: businessName },
            })}
          </Button>
        }
      >
        <UserPopUpSuccessContent
          slotContent={<h3>{t`user.register_08`}</h3>}
          icon={
            <div className="register-icon">
              <Icon name="sign_complete" hasTheme isRemoteUrl />
            </div>
          }
        />
      </UserPopUp>

      <FullScreenSpin isShow={spinShow} />
    </section>
  )
}

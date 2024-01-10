import { useState, useEffect, useMemo, useRef } from 'react'
import { Button, Form, Input, Message } from '@nbit/arco'
import { useRequest } from 'ahooks'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import UserPopUp from '@/features/user/components/popup'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'
import UserCountDown from '@/features/user/components/count-down'
import UserFormLayout from '@/features/user/common/user-form-layout'
import FullScreenSpin from '@/features/user/components/full-screen-loading'
import {
  UserValidateMethodEnum,
  UserSendValidateCodeBusinessTypeEnum,
  UserEnabledStateTypeEnum,
  UserVerifyTypeEnum,
  UserUpsAndDownsColorEnum,
} from '@/constants/user'
import {
  postMemberSafeVerifyEmailSend,
  postMemberSafeVerifyPhoneSend,
  postMemberSafeVerifyEmailCheck,
  postMemberSafeVerifyPhoneCheck,
  getMemberSafeVerifyGoogleCheck,
  postMemberLoginGenerateUserInfomation,
  postMemberQueryWorkOrderStatus,
} from '@/apis/user'
import { UserInformationDesensitization } from '@/features/user/utils/common'
import { SafetyVerificationRules } from '@/features/user/utils/validate'
import { useUserStore } from '@/store/user'
import { setToken } from '@/helper/auth'
import { usePageContext } from '@/hooks/use-page-context'
import Icon from '@/components/icon'
import styles from './index.module.css'

const FormItem = Form.Item
const expirationCode = [10000039]

function UserSafetyVerification() {
  const [verifyMethod, setVerifyMethod] = useState<string>(UserValidateMethodEnum.email)
  const [workOrderPopUp, setWorkOrderPopUp] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [spinShow, setSpinShow] = useState<boolean>(false)
  const isEmailSend = useRef<boolean>(false)
  const isPhoneSend = useRef<boolean>(false)
  // const [disabled, setDisabled] = useState<boolean>(true)

  const store = useUserStore()
  const [form] = Form.useForm()
  const pageContext = usePageContext()
  // const verifyCode = Form.useWatch('verifyCode', form)

  const { redirect } = pageContext.urlParsed.search
  const info = store.userTransitionDatas
  const userInfo = info.userInfo

  const rules = SafetyVerificationRules(isEmailSend, isPhoneSend)

  const verifyInputShow = useMemo(() => {
    return userInfo?.isOpenGoogleVerify === UserEnabledStateTypeEnum.enable
      ? UserValidateMethodEnum.validator
      : userInfo?.isOpenEmailVerify === UserEnabledStateTypeEnum.enable
      ? UserValidateMethodEnum.email
      : UserValidateMethodEnum.phone
  }, [])

  useEffect(() => {
    setVerifyMethod(verifyInputShow)
  }, [])

  // const handleValidateChange = () => {
  //   form
  //     .validate()
  //     .then(() => setDisabled(false))
  //     .catch(() => setDisabled(true))
  // }

  const handleToSecurityItem = async () => {
    const options = {
      type: info.accountType,
      account:
        info.accountType === UserVerifyTypeEnum.phone
          ? info.mobile
          : info.accountType === UserVerifyTypeEnum.email
          ? info.email
          : userInfo?.uid,
      mobileCountryCode: info.accountType === UserVerifyTypeEnum.phone ? info.mobileCountryCode : undefined,
    }
    const res = await postMemberQueryWorkOrderStatus(options)
    res.isOk && res.data?.isBeginManualVerifyProcess ? setWorkOrderPopUp(true) : link('/safety-items')
  }

  const switchVerifyMethod = (type: string) => {
    setVerifyMethod(type)
  }

  const handleSendEmailValidateCode = async () => {
    const res = await postMemberSafeVerifyEmailSend({
      type: UserSendValidateCodeBusinessTypeEnum.login,
      email: userInfo?.email as string,
    })

    const isTrue = (res.isOk && res.data?.isSuccess) || false
    if (isTrue) {
      isEmailSend.current = true
      Message.success(t`user.field.reuse_38`)
    }
    return isTrue
  }

  const handleSendPhoneValidateCode = async () => {
    const res = await postMemberSafeVerifyPhoneSend({
      type: UserSendValidateCodeBusinessTypeEnum.login,
      mobileCountryCode: userInfo?.mobileCountryCd as string,
      mobile: userInfo?.mobileNumber as string,
    })

    const isTrue = (res.isOk && res.data?.isSuccess) || false
    if (isTrue) {
      isPhoneSend.current = true
      Message.success(t`user.field.reuse_38`)
    }
    return isTrue
  }

  const handleLoginSuccess = data => {
    if (data.token) {
      setToken(data)
      store.setUserInfo({ ...data?.userInfo, ...data?.usrMemberSettingsVO })
      store.setMemberBaseColor(data?.usrMemberSettingsVO?.marketSetting || UserUpsAndDownsColorEnum.greenUpRedDown)
      store.setLogin(true)
      store.removeUserTransitionDatas()
      Message.success(t`features/user/safety-verification/index-0`)
      redirect ? link(redirect) : link('/')
    }
  }

  const handleLogin = async (code: number) => {
    // 登录过期码 10000039
    if (expirationCode.includes(code)) {
      link('/login')
      return
    }

    setLoading(true)

    const options = {
      account:
        info.accountType === UserVerifyTypeEnum.phone
          ? info.mobile
          : info.accountType === UserVerifyTypeEnum.email
          ? info.email
          : userInfo?.uid,
      accountType: info.accountType,
      mobileCountryCode: info.mobileCountryCode,
    }

    setSpinShow(true)
    const res = await postMemberLoginGenerateUserInfomation(options)
    if (res.isOk) {
      handleLoginSuccess(res.data)
      return
    }

    // 登录过期码 10000039
    if (expirationCode.includes(res.code as number)) {
      link('/login')
      return
    }

    setSpinShow(false)
    setLoading(false)
  }

  const handleValidateCode = async values => {
    switch (verifyMethod) {
      case UserValidateMethodEnum.email:
        const emailRes = await postMemberSafeVerifyEmailCheck({ ...values, email: userInfo?.email })
        if (emailRes.isOk) {
          emailRes.data?.isSuccess && handleLogin(emailRes.code as number)
          break
        }

        setLoading(false)
        break
      case UserValidateMethodEnum.validator:
        values.uid = userInfo?.uid

        const googleRes = await getMemberSafeVerifyGoogleCheck(values)
        if (googleRes.isOk) {
          googleRes.data?.isSuccess && handleLogin(googleRes.code as number)
          break
        }

        setLoading(false)
        break
      case UserValidateMethodEnum.phone:
        values.mobileCountryCode = userInfo?.mobileCountryCd
        values.mobile = userInfo?.mobileNumber

        const phoneRes = await postMemberSafeVerifyPhoneCheck(values)
        if (phoneRes.isOk) {
          phoneRes.data?.isSuccess && handleLogin(phoneRes.code as number)
          break
        }

        setLoading(false)
        break
      default:
        break
    }
  }

  const { run } = useRequest(handleValidateCode, {
    throttleWait: 2000,
    manual: true,
  })

  const onSubmit = async values => {
    setLoading(true)
    values.type = UserSendValidateCodeBusinessTypeEnum.login

    run(values)
  }

  return (
    <div className={`user-safety-verification user-form-style ${styles.scoped}`}>
      <div className="user-safety-verification-wrap">
        <UserFormLayout title={t`user.safety_verification_01`}>
          <Form
            form={form}
            layout="vertical"
            onSubmit={onSubmit}
            autoComplete="off"
            validateTrigger="onBlur"
            // onChange={handleValidateChange}
          >
            {userInfo?.isOpenEmailVerify === UserEnabledStateTypeEnum.enable &&
              verifyMethod === UserValidateMethodEnum.email && (
                <FormItem
                  label={t`user.field.reuse_03`}
                  field="verifyCode"
                  requiredSymbol={false}
                  rules={[rules.emailCode]}
                  extra={t({
                    id: 'user.universal_security_verification_01',
                    values: { 0: UserInformationDesensitization(userInfo?.email) },
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

            {userInfo?.isOpenPhoneVerify === UserEnabledStateTypeEnum.enable &&
              verifyMethod === UserValidateMethodEnum.phone && (
                <FormItem
                  label={t`user.field.reuse_04`}
                  field="verifyCode"
                  requiredSymbol={false}
                  rules={[rules.phoneCode]}
                  extra={t({
                    id: 'user.universal_security_verification_03',
                    values: {
                      0: `+${userInfo?.mobileCountryCd} ${UserInformationDesensitization(userInfo?.mobileNumber)}`,
                    },
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

            {userInfo?.isOpenGoogleVerify === UserEnabledStateTypeEnum.enable &&
              verifyMethod === UserValidateMethodEnum.validator && (
                <FormItem
                  label={t`user.field.reuse_05`}
                  field="verifyCode"
                  requiredSymbol={false}
                  rules={[rules.googleKey]}
                  extra={t`user.safety_verification_05`}
                >
                  <Input type="number" maxLength={6} placeholder={t`user.safety_verification_05`} />
                </FormItem>
              )}

            <div className="verify-mode">
              {userInfo?.isOpenEmailVerify === UserEnabledStateTypeEnum.enable &&
                verifyMethod !== UserValidateMethodEnum.email && (
                  <div className="item">
                    <label
                      onClick={() => switchVerifyMethod(UserValidateMethodEnum.email)}
                    >{t`user.safety_verification_09`}</label>
                  </div>
                )}

              {userInfo?.isOpenGoogleVerify === UserEnabledStateTypeEnum.enable &&
                verifyMethod !== UserValidateMethodEnum.validator && (
                  <div className="item">
                    <label
                      onClick={() => switchVerifyMethod(UserValidateMethodEnum.validator)}
                    >{t`user.safety_verification_10`}</label>
                  </div>
                )}

              {userInfo?.isOpenPhoneVerify === UserEnabledStateTypeEnum.enable &&
                verifyMethod !== UserValidateMethodEnum.phone && (
                  <div className="item">
                    <label
                      onClick={() => switchVerifyMethod(UserValidateMethodEnum.phone)}
                    >{t`user.safety_verification_11`}</label>
                  </div>
                )}

              <div className="item">
                <label onClick={handleToSecurityItem}>{t`user.safety_verification_12`}</label>
              </div>
            </div>

            <FormItem style={{ marginBottom: 0 }}>
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

      <FullScreenSpin isShow={spinShow} />
    </div>
  )
}

export default UserSafetyVerification

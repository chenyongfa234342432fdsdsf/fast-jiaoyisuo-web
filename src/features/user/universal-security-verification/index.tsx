import { useState, useEffect, useRef } from 'react'
import { Button, Form, Input, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
// import Link from '@/components/link'
import UserPopUp from '@/features/user/components/popup'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'
import UserCountDown from '@/features/user/components/count-down'
import { UniversalSecurityVerificationRules } from '@/features/user/utils/validate'
import {
  postMemberSafeVerifyEmailSend,
  postMemberSafeVerifyPhoneSend,
  postMemberSafeVerifyWithdrawalEmailSend,
  postMemberSafeVerifyWithdrawalPhoneSend,
  postMemberUniversalSecurityVerification,
  postMemberQueryWorkOrderStatus,
} from '@/apis/user'
import { UserEnabledStateTypeEnum, UserVerifyTypeEnum, UserSendValidateCodeBusinessTypeEnum } from '@/constants/user'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import { UserInformationDesensitization } from '@/features/user/utils/common'
import Icon from '@/components/icon'
import { ISafeVerifySendWithdrawalDataProps } from '@/typings/assets'
import styles from './index.module.css'

const FormItem = Form.Item
interface UniversalSecurityVerificationProps {
  /** 是否显示弹窗 */
  isShow: boolean
  /** 是否需要两项验证弹窗 */
  isVerificationTips?: boolean
  /** 业务类型 */
  businessType?: number | string
  /** 提币获取验证码入参 */
  withdrawalData?: ISafeVerifySendWithdrawalDataProps
  /** 关闭弹窗 */
  onClose?(close: boolean): void
  /** 验证通过函数 */
  onSuccess(isTrue: boolean): void
  /** 验证失败函数 */
  onError?(): void
}

function UniversalSecurityVerification({
  isShow = false,
  isVerificationTips = false,
  businessType,
  withdrawalData,
  onClose,
  onSuccess,
  onError,
}: UniversalSecurityVerificationProps) {
  const [workOrderPopUp, setWorkOrderPopUp] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const isEmailSend = useRef<boolean>(false)
  const isPhoneSend = useRef<boolean>(false)

  const { getBaseInfo, baseInfoResult, turnOnVerification } = usePersonalCenterStore()
  // const [disabled, setDisabled] = useState<boolean>(true)

  const [form] = Form.useForm()

  const rule = UniversalSecurityVerificationRules(isEmailSend, isPhoneSend)

  useEffect(() => {
    if (isShow) {
      getBaseInfo()
    }
  }, [isShow])

  // const handleValidateChange = () => {
  //   form
  //     .validate()
  //     .then(() => setDisabled(false))
  //     .catch(() => setDisabled(true))
  // }

  const handleToSecurityItem = async () => {
    const options = {
      type: baseInfoResult.email ? UserVerifyTypeEnum.email : UserVerifyTypeEnum.phone,
      account: baseInfoResult.email || baseInfoResult.mobileNumber,
      mobileCountryCode: baseInfoResult.mobileNumber ? baseInfoResult.mobileCountryCd : undefined,
    }
    const res = await postMemberQueryWorkOrderStatus(options)
    res.isOk && res.data?.isBeginManualVerifyProcess ? setWorkOrderPopUp(true) : link('/safety-items')
  }

  const isWithdrawType = businessType === UserSendValidateCodeBusinessTypeEnum.withdraw
  const handleSendEmailValidateCode = async () => {
    const res = isWithdrawType
      ? await postMemberSafeVerifyWithdrawalEmailSend({
          type: businessType! as unknown as number,
          email: baseInfoResult.email,
          address: withdrawalData?.address || '',
          quantity: withdrawalData?.quantity || 0,
          currencyCode: withdrawalData?.currencyCode || '',
          memo: withdrawalData?.memo || '',
        })
      : await postMemberSafeVerifyEmailSend({
          type: businessType! as unknown as number,
          email: baseInfoResult.email,
        })

    const isTrue = (res.isOk && res.data?.isSuccess) || false
    if (isTrue) {
      isEmailSend.current = true
      Message.success(t`user.field.reuse_38`)
    }
    return isTrue
  }

  const handleSendPhoneValidateCode = async () => {
    const res = isWithdrawType
      ? await postMemberSafeVerifyWithdrawalPhoneSend({
          type: businessType! as unknown as number,
          mobileCountryCode: baseInfoResult.mobileCountryCd,
          mobile: baseInfoResult.mobileNumber,
          address: withdrawalData?.address || '',
          quantity: withdrawalData?.quantity || 0,
          currencyCode: withdrawalData?.currencyCode || '',
          memo: withdrawalData?.memo || '',
        })
      : await postMemberSafeVerifyPhoneSend({
          type: businessType! as unknown as number,
          mobileCountryCode: baseInfoResult.mobileCountryCd,
          mobile: baseInfoResult.mobileNumber,
        })

    const isTrue = (res.isOk && res.data?.isSuccess) || false
    if (isTrue) {
      isPhoneSend.current = true
      Message.success(t`user.field.reuse_38`)
    }
    return isTrue
  }

  const handleClose = () => {
    form.resetFields()
    onClose && onClose(false)
  }

  const onContinue = () => {
    onClose && onClose(false)
    link('/personal-center/account-security')
  }

  const onSubmit = async values => {
    const options = {
      operateType: businessType,
      ...values,
    }

    setLoading(true)
    const res = await postMemberUniversalSecurityVerification(options)
    if (res.isOk) {
      setLoading(false)
      onSuccess(true)
      handleClose()
      return
    }

    setLoading(false)
    onSuccess(false)
    onError && onError()
  }

  return (
    <UserPopUp
      title={<div style={{ textAlign: 'left' }}>{t`user.pageContent.title_06`}</div>}
      autoFocus={false}
      className="user-popup"
      maskClosable={false}
      visible={isShow}
      closeIcon={<Icon name="close" hasTheme />}
      onCancel={handleClose}
      footer={null}
    >
      <div className={`universal-security-verification user-form-style ${styles.scoped}`}>
        <div className="universal-security-verification-wrap">
          <Form
            form={form}
            layout="vertical"
            onSubmit={onSubmit}
            autoComplete="off"
            validateTrigger="onBlur"
            // onChange={handleValidateChange}
          >
            {/* {isTrade && baseInfoResult.setTradePwdInd === UserEnabledStateTypeEnum.enable && (
              <FormItem
                label={t`user.account_security.settings_08`}
                field="fundPassword"
                requiredSymbol={false}
                rules={[rule.fundPassword]}
              >
                <Input placeholder={t`user.account_security.settings_09`} />
              </FormItem>
            )} */}

            {baseInfoResult.isOpenEmailVerify === UserEnabledStateTypeEnum.enable && (
              <FormItem
                style={{ marginTop: 0, marginBottom: 24 }}
                label={t({
                  id: 'user.register.verification_01',
                  values: {
                    0: `${UserInformationDesensitization(baseInfoResult?.email)}`,
                  },
                })}
                field="emailVerifyCode"
                requiredSymbol={false}
                rules={[rule.emailCode]}
              >
                <Input
                  type="number"
                  maxLength={6}
                  placeholder={t`user.field.reuse_20`}
                  suffix={isShow && <UserCountDown onSend={handleSendEmailValidateCode} />}
                />
              </FormItem>
            )}

            {baseInfoResult.isOpenPhoneVerify === UserEnabledStateTypeEnum.enable && (
              <FormItem
                style={{ marginTop: 0, marginBottom: 24 }}
                label={t({
                  id: 'user.universal_security_verification_03',
                  values: {
                    0: `+${baseInfoResult.mobileCountryCd} ${UserInformationDesensitization(
                      baseInfoResult.mobileNumber
                    )}`,
                  },
                })}
                field="mobileVerifyCode"
                requiredSymbol={false}
                rules={[rule.phoneCode]}
              >
                <Input
                  type="number"
                  maxLength={6}
                  placeholder={t`user.field.reuse_21`}
                  suffix={isShow && <UserCountDown onSend={handleSendPhoneValidateCode} />}
                />
              </FormItem>
            )}

            {baseInfoResult.isOpenGoogleVerify === UserEnabledStateTypeEnum.enable && (
              <FormItem
                style={{ marginTop: 0 }}
                label={`${t`user.safety_verification_06`}`}
                field="googleVerifyCode"
                requiredSymbol={false}
                rules={[rule.googleKey]}
              >
                <Input type="number" maxLength={6} placeholder={t`user.safety_verification_05`} />
              </FormItem>
            )}

            <div className="safety-items" onClick={handleToSecurityItem}>
              <span className="customize-link-style">{t`user.universal_security_verification_06`}</span>
            </div>

            <FormItem style={{ marginBottom: 0 }}>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                // disabled={disabled}
              >
                {t`user.field.reuse_10`}
              </Button>
            </FormItem>
          </Form>
        </div>
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

      <UserPopUp
        className="user-popup user-popup-tips"
        visible={isShow && isVerificationTips && turnOnVerification}
        closeIcon={<Icon name="close" hasTheme />}
        okText={t`user.universal_security_verification_08`}
        cancelText={t`user.field.reuse_09`}
        onOk={onContinue}
        onCancel={handleClose}
      >
        <UserPopupTipsContent
          slotContent={
            <>
              <p>{t`user.universal_security_verification_07`}</p>
              <p>{t`user.universal_security_verification_09`}</p>
              <p>{t`user.universal_security_verification_10`}</p>
              <p>{t`user.universal_security_verification_11`}</p>
            </>
          }
        />
      </UserPopUp>
    </UserPopUp>
  )
}

export default UniversalSecurityVerification

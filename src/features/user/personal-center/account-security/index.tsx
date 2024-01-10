import { ReactNode, useRef, useState } from 'react'
import { useMount } from 'react-use'
import { useRequest } from 'ahooks'
// import { Switch, Button, Message, Modal } from '@nbit/arco'
import { Switch, Button, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import UserPopUp from '@/features/user/components/popup'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'
import UserAccountSecurityGoogleKey from '@/features/user/personal-center/account-security/google'
import UserAntiPhishingCode from '@/features/user/personal-center/account-security/anti-phishing-code'
import UniversalSecurityVerification from '@/features/user/universal-security-verification'
import {
  postMemberSafeEmailStatus,
  postMemberSafePhoneStatus,
  postMemberSafeGoogleStatus,
  deleteMemberSafeMobile,
} from '@/apis/user'
import {
  AccountSecurityOperationTypeEnum,
  UserEnabledStateTypeEnum,
  UserSendValidateCodeBusinessTypeEnum,
  UserValidateMethodEnum,
} from '@/constants/user'
import { UserInformationDesensitization } from '@/features/user/utils/common'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import Icon from '@/components/icon'
import styles from './index.module.css'

interface SafetyVerificationItemProps {
  /** 图标 */
  icon?: ReactNode
  /** 名称 */
  name?: string
  /** 文本 */
  text?: string
  /** 是否启用 */
  enable?: boolean
  /** 是否绑定 */
  isBind: boolean
  /** 未绑定文字 */
  unBindText?: string
  /** 是否启用回调函数 */
  onEnable?(enable: boolean): void
  /** 是否显示 switch 按钮 */
  isSwitch?: boolean
  /** 按钮插槽 */
  buttonSlot?: ReactNode
}

const emailUrl = '/personal-center/account-security/email?type='
const phonelUrl = '/personal-center/account-security/phone?type='
const passwordlUrl = '/personal-center/account-security/modify-password'
// const tradePasswordUrl = '/personal-center/account-security/transaction-password?type='

function SafetyVerificationItem({
  icon,
  name,
  text,
  enable,
  isBind,
  unBindText,
  onEnable,
  isSwitch,
  buttonSlot,
}: SafetyVerificationItemProps) {
  return (
    <div className="safety-verification-item">
      <div className="item">
        <div className="item-name">
          {icon}
          <label>{name}</label>
        </div>
        <div className="item-text">
          <label>{text}</label>
        </div>
        <div className="item-settings">
          {buttonSlot}
          {isSwitch && <Switch checked={enable} onChange={onEnable} />}
        </div>
        {isSwitch && (
          <div className="item-status">
            <div className={`tag ${enable ? 'on' : 'off'}`}>
              <div className="icon">
                <Icon
                  name={`${enable ? 'user_safety_label_activated' : 'user_safety_label_unopened'}`}
                  isRemoteUrl
                  width={14}
                  height={14}
                />
              </div>
              <div className="text">
                <label>
                  {enable
                    ? t`user.security_item_01`
                    : isBind
                    ? t`user.security_item_02`
                    : unBindText || t`features_user_personal_center_account_security_index_2557`}
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function UserPersonalCenterAccountSecurity() {
  const [visibleTips, setVisibleTips] = useState<boolean>(false)
  const [visibleGoogleKey, setVisibleGoogleKey] = useState<boolean>(false)
  const [visibleAntiPhishing, setVisibleAntiPhishing] = useState<boolean>(false)
  const [securityVerification, setSecurityVerification] = useState<boolean>(false)
  // const [deleteTipsPopup, setDeleteTipsPopup] = useState<boolean>(false)
  const [operationType, setOperationType] = useState<string>(AccountSecurityOperationTypeEnum.bind)
  // const [validateList, setValidateList] = useState<Array<certificationStatusType>>([])
  const businessType = useRef<number>()
  const verifyMethod = useRef<string>(UserValidateMethodEnum.email)

  const { getBaseInfo, baseInfoResult, turnOnVerification } = usePersonalCenterStore()

  const { run, loading } = useRequest(getBaseInfo, { manual: true })

  useMount(run)

  /** 处理关闭验证提示 */
  const handleCloseVerficationTips = (type: number) => {
    // Modal.confirm({
    //   title: t`trade.c2c.max.reminder`,
    //   content: t`features_user_personal_center_account_security_index_2426`,
    //   okButtonProps: {
    //     status: 'default',
    //   },
    //   onOk: () => {
    //     businessType.current = type
    //     setSecurityVerification(true)
    //   },
    // })

    businessType.current = type
    setSecurityVerification(true)
  }

  /** 处理未绑定开启操作 */
  const handleUnBind = (method: number, text: string) => {
    if (method === UserEnabledStateTypeEnum.unEnable) {
      Message.info(text)
      return false
    }

    return true
  }

  const handleSecurityItemStatus = (enable: boolean, url?: string) => {
    if (turnOnVerification && !enable) {
      Message.warning(t`features_user_personal_center_account_security_index_2446`)
      return false
    }
    url && link(url)
    return true
  }

  const handleSafeEmailStatus = async (status: number) => {
    const res = await postMemberSafeEmailStatus({ status })
    if (res.isOk && res.data?.isSuccess) {
      Message.success(t`user.field.reuse_34`)
      getBaseInfo()
    }
  }

  const handleSafePhoneStatus = async (status: number) => {
    const res = await postMemberSafePhoneStatus({ status })
    if (res.isOk && res.data?.isSuccess) {
      Message.success(t`user.field.reuse_34`)
      getBaseInfo()
    }
  }

  const handleSafeGoogleStatus = async (status: number) => {
    const res = await postMemberSafeGoogleStatus({ status })
    if (res.isOk && res.data?.isSuccess) {
      Message.success(t`user.field.reuse_34`)
      getBaseInfo()
    }
  }

  /** 邮箱修改 */
  const handleModifyEmail = () => {
    const isEnableSecurity = handleSecurityItemStatus(false)
    if (!isEnableSecurity) return

    businessType.current = UserSendValidateCodeBusinessTypeEnum.modifyEmail
    verifyMethod.current = UserValidateMethodEnum.email
    setSecurityVerification(true)
  }

  /** 邮箱关闭开启 */
  const handleEmailEnableChange = (enable: boolean) => {
    const isEnableSecurity = handleSecurityItemStatus(enable)
    if (!isEnableSecurity) return

    verifyMethod.current = UserValidateMethodEnum.email

    const isTrue = handleUnBind(
      baseInfoResult.isBindEmailVerify,
      t`features_user_personal_center_account_security_index_5101346`
    )
    if (!isTrue) return

    if (!enable) {
      handleCloseVerficationTips(UserSendValidateCodeBusinessTypeEnum.closeEmailVerification)
      return
    }

    handleSafeEmailStatus(UserEnabledStateTypeEnum.enable)
  }

  /** 手机修改 */
  const handleModifyPhone = () => {
    const isEnableSecurity = handleSecurityItemStatus(false)
    if (!isEnableSecurity) return

    businessType.current = UserSendValidateCodeBusinessTypeEnum.modifyPhone
    verifyMethod.current = UserValidateMethodEnum.phone
    setSecurityVerification(true)
  }

  /** 手机关闭开启 */
  const handlePhoneEnableChange = (enable: boolean) => {
    const isEnableSecurity = handleSecurityItemStatus(enable)
    if (!isEnableSecurity) return

    verifyMethod.current = UserValidateMethodEnum.phone

    const isTrue = handleUnBind(
      baseInfoResult.isBindPhoneVerify,
      t`features_user_personal_center_account_security_index_5101347`
    )
    if (!isTrue) return

    if (!enable) {
      handleCloseVerficationTips(UserSendValidateCodeBusinessTypeEnum.closePhoneVerification)
      return
    }

    handleSafePhoneStatus(UserEnabledStateTypeEnum.enable)
  }

  /** 谷歌验证器关闭开启 */
  const handleGoogleEnableChange = (enable: boolean) => {
    const isEnableSecurity = handleSecurityItemStatus(enable)
    if (!isEnableSecurity) return

    verifyMethod.current = UserValidateMethodEnum.validator

    const isTrue = handleUnBind(
      baseInfoResult.isOpenGoogleVerify,
      t`features_user_personal_center_account_security_index_5101348`
    )
    if (!isTrue) return

    if (!enable) {
      handleCloseVerficationTips(UserSendValidateCodeBusinessTypeEnum.closeGoogleVerification)
      return
    }

    handleSafeGoogleStatus(UserEnabledStateTypeEnum.enable)
  }

  /** 绑定谷歌验证 */
  const handleToSetGoogleKey = () => {
    setOperationType(AccountSecurityOperationTypeEnum.bind)
    setVisibleGoogleKey(true)
  }

  const handleGoogleKeyPopUpOnSuccess = () => {
    setVisibleGoogleKey(false)
    getBaseInfo()
  }

  /** 重置谷歌验证 */
  const handleToReset = () => {
    const isEnableSecurity = handleSecurityItemStatus(false)
    if (!isEnableSecurity) return

    setOperationType(AccountSecurityOperationTypeEnum.modify)
    businessType.current = UserSendValidateCodeBusinessTypeEnum.modifyGoogle
    verifyMethod.current = UserValidateMethodEnum.validator
    setVisibleTips(false)
    setSecurityVerification(true)
  }

  const handleDeletePhoneVerification = () => {
    const isEnableSecurity = handleSecurityItemStatus(false)
    if (!isEnableSecurity) return

    businessType.current = UserSendValidateCodeBusinessTypeEnum.deletePhoneVerification
    verifyMethod.current = AccountSecurityOperationTypeEnum.delete
    // setDeleteTipsPopup(false)
    setSecurityVerification(true)
  }

  /** 删除手机 */
  const handleDeletePhone = async () => {
    const res = await deleteMemberSafeMobile({})
    if (res.isOk && res.data.isSuccess) {
      Message.success(t`features_user_personal_center_account_security_index_2428`)
      getBaseInfo()
    }
  }

  /** 修改登录密码 */
  const handleModifyPassword = () => {
    const isEnableSecurity = handleSecurityItemStatus(false)
    if (!isEnableSecurity) return

    link(passwordlUrl)
  }

  const handleOnSuccess = (isTrue: boolean) => {
    if (isTrue) {
      const status = UserEnabledStateTypeEnum.unEnable
      switch (verifyMethod.current) {
        case UserValidateMethodEnum.email:
          if (businessType.current === UserSendValidateCodeBusinessTypeEnum.modifyEmail) {
            handleSecurityItemStatus(false, `${emailUrl}${AccountSecurityOperationTypeEnum.modify}`)
            return
          }
          handleSafeEmailStatus(status)
          break
        case UserValidateMethodEnum.phone:
          if (businessType.current === UserSendValidateCodeBusinessTypeEnum.modifyPhone) {
            handleSecurityItemStatus(false, `${phonelUrl}${AccountSecurityOperationTypeEnum.modify}`)
            return
          }
          handleSafePhoneStatus(status)
          break
        case UserValidateMethodEnum.validator:
          if (businessType.current === UserSendValidateCodeBusinessTypeEnum.modifyGoogle) {
            setOperationType(AccountSecurityOperationTypeEnum.modify)
            setVisibleGoogleKey(true)
            return
          }
          handleSafeGoogleStatus(status)
          break
        case AccountSecurityOperationTypeEnum.delete:
          handleDeletePhone()
          break
        default:
          break
      }
    }
  }

  return (
    <section className={`personal-center ${styles.scoped}`}>
      <div className="personal-center-wrap">
        <div className="header">
          <div className="header-wrap">
            <div className="user-account-security-info">
              <div className="title">
                <h1>{t`user.personal_center_09`}</h1>
              </div>

              {/* <div className="status">
                <div className="tips">
                  <label>{t`features/user/personal-center/account-security/index-1`}</label>
                </div>

                <div className="list">
                  {validateList.map(v => (
                    <div className="item" key={v.key}>
                      <div className="item-wrap">
                        <div className="text">
                          <label>{v.text}</label>
                        </div>
                        <div className="icon">
                          {v.status ? <Icon name="login_satisfied" fontSize={16} /> : <Icon name="login_unsatisfied" hasTheme fontSize={16} />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>

            {/* <div className="safety-record">
              <Link href="/personal-center/account-security/safety-record">
                {t`features/user/personal-center/account-security/index-3`}
                <Icon name="next_arrow_hover" fontSize={16} />
              </Link>
            </div> */}
          </div>
        </div>

        <div className="safety-verification">
          <div className="safety-verification-wrap wrap">
            <div className="subtitle">
              <label>{t`user.safety_verification_01`}</label>
            </div>

            <SafetyVerificationItem
              icon={<Icon name="mailbox" hasTheme fontSize={32} />}
              name={t`user.field.reuse_13`}
              text={
                baseInfoResult?.isBindEmailVerify === UserEnabledStateTypeEnum.enable
                  ? UserInformationDesensitization(baseInfoResult?.email)
                  : ''
              }
              enable={baseInfoResult?.isOpenEmailVerify === UserEnabledStateTypeEnum.enable}
              isBind={baseInfoResult?.isBindEmailVerify === UserEnabledStateTypeEnum.enable}
              onEnable={handleEmailEnableChange}
              isSwitch
              buttonSlot={
                baseInfoResult?.isBindEmailVerify === UserEnabledStateTypeEnum.enable ? (
                  <Button type="text" onClick={handleModifyEmail}>
                    {t`user.account_security_06`}
                  </Button>
                ) : (
                  <Button type="text" onClick={() => link(`${emailUrl}${AccountSecurityOperationTypeEnum.bind}`)}>
                    {t`user.security_verification_status_02`}
                  </Button>
                )
              }
            />

            <SafetyVerificationItem
              icon={<Icon name="phone" hasTheme fontSize={32} />}
              name={t`features_user_personal_center_account_security_index_2610`}
              text={
                baseInfoResult?.isBindPhoneVerify === UserEnabledStateTypeEnum.enable
                  ? `+${baseInfoResult?.mobileCountryCd} ${UserInformationDesensitization(
                      baseInfoResult?.mobileNumber
                    )}`
                  : ''
              }
              enable={baseInfoResult?.isOpenPhoneVerify === UserEnabledStateTypeEnum.enable}
              isBind={baseInfoResult?.isBindPhoneVerify === UserEnabledStateTypeEnum.enable}
              onEnable={handlePhoneEnableChange}
              isSwitch
              buttonSlot={
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <>
                  {baseInfoResult?.isBindPhoneVerify === UserEnabledStateTypeEnum.enable ? (
                    <>
                      <Button type="text" onClick={handleModifyPhone}>
                        {t`user.account_security_06`}
                      </Button>
                      <Button className="delete-btn" type="text" onClick={handleDeletePhoneVerification}>
                        {t`assets.common.delete`}
                      </Button>
                    </>
                  ) : (
                    <Button type="text" onClick={() => link(`${phonelUrl}${AccountSecurityOperationTypeEnum.bind}`)}>
                      {t`user.security_verification_status_02`}
                    </Button>
                  )}
                </>
              }
            />

            <SafetyVerificationItem
              icon={<Icon name="google" hasTheme fontSize={32} />}
              name={t`features_user_personal_center_account_security_index_2611`}
              enable={baseInfoResult?.isOpenGoogleVerify === UserEnabledStateTypeEnum.enable}
              isBind={baseInfoResult?.isOpenGoogleVerify === UserEnabledStateTypeEnum.enable}
              unBindText={t`features/orders/order-table-cell-2`}
              onEnable={handleGoogleEnableChange}
              isSwitch
              buttonSlot={
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <>
                  {baseInfoResult?.isOpenGoogleVerify === UserEnabledStateTypeEnum.enable ? (
                    <Button type="text" onClick={() => setVisibleTips(true)}>
                      {t`user.field.reuse_47`}
                    </Button>
                  ) : (
                    <Button type="text" onClick={handleToSetGoogleKey}>
                      {t`user.account_security.google_01`}
                    </Button>
                  )}
                </>
              }
            />

            {/* <SafetyVerificationItem
              icon={<Icon name="verified" hasTheme />}
              name={t`features/user/personal-center/account-security/index-0`}
              buttonSlot={
                <>
                  {data?.identityStatus === UserAuthenticationStatusTypeEnum.underReview && (
                    <label>{t`features/user/personal-center/account-security/index-2`}</label>
                  )}
                  {data?.identityStatus === UserAuthenticationStatusTypeEnum.examinationPassed && (
                    <label className="verified">{t`user.personal_center_02`}</label>
                  )}
                  {data?.identityStatus === UserAuthenticationStatusTypeEnum.notCertified && (
                    <Link href="/personal-center/profile">{t`user.personal_center_03`}</Link>
                  )}
                  {data?.identityStatus === UserAuthenticationStatusTypeEnum.AuditNotPassed && (
                    <Link href="/personal-center/profile">{t`user.personal_center_03`}</Link>
                  )}
                </>
              }
            /> */}

            <div className="modify-item" onClick={() => setVisibleAntiPhishing(true)}>
              <div className="name">
                <label>{t`user.pageContent.title_13`}</label>
              </div>
              <div className="settings">
                <label>{t`user.field.reuse_08`}</label>
                <Icon name="next_arrow" hasTheme />
              </div>
            </div>

            <div className="modify-item" onClick={handleModifyPassword}>
              <div className="name">
                <label>{t`user.account_security_05`}</label>
              </div>
              <div className="settings">
                <label>{t`user.account_security_06`}</label>
                <Icon name="next_arrow" hasTheme />
              </div>
            </div>

            {/* <div
              className="modify-item"
              onClick={() =>
                link(
                  `${tradePasswordUrl}${
                    baseInfoResult.setTradePwdInd === UserEnabledStateTypeEnum.enable
                      ? AccountSecurityOperationTypeEnum.modify
                      : AccountSecurityOperationTypeEnum.bind
                  }`
                )
              }
            >
              <div className="name">
                <label>{t`user.account_security.settings_08`}</label>
              </div>
              <div className="settings">
                {baseInfoResult.setTradePwdInd === UserEnabledStateTypeEnum.enable ? (
                  <label>{t`user.account_security_06`}</label>
                ) : (
                  <label>{t`user.field.reuse_08`}</label>
                )}
                <Icon name="next_arrow" hasTheme />
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* <UserPopUp
        className="user-popup user-popup-tips"
        visible={deleteTipsPopup}
        closeIcon={<Icon name="close" hasTheme />}
        okText={t`user.field.reuse_17`}
        cancelText={t`user.field.reuse_09`}
        onOk={handleDeletePhoneVerification}
        onCancel={() => setDeleteTipsPopup(false)}
      >
        <UserPopupTipsContent slotContent={<p>{t`features_user_personal_center_account_security_index_2429`}</p>} />
      </UserPopUp> */}

      <UserPopUp
        className="user-popup user-popup-tips"
        visible={visibleTips}
        closeIcon={<Icon name="close" hasTheme />}
        okText={t`user.account_security.google_07`}
        cancelText={t`user.field.reuse_09`}
        onOk={handleToReset}
        onCancel={() => setVisibleTips(false)}
      >
        <UserPopupTipsContent
          slotContent={
            <>
              <p>{t`user.account_security.google_03`}</p>
              <p>
                {t`user.account_security.google_04`} <span>{t`user.account_security.google_05`}</span>{' '}
                {t`user.account_security.google_06`}
              </p>
            </>
          }
        />
      </UserPopUp>

      <UserPopUp
        className="user-popup user-form-style"
        title={
          <div style={{ textAlign: 'left' }}>
            {operationType === AccountSecurityOperationTypeEnum.bind ? t`user.field.reuse_42` : t`user.field.reuse_47`}
            {t`user.field.reuse_05`}
          </div>
        }
        visible={visibleGoogleKey}
        autoFocus={false}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisibleGoogleKey(false)}
        footer={null}
      >
        <UserAccountSecurityGoogleKey mode={operationType} onSuccess={handleGoogleKeyPopUpOnSuccess} />
      </UserPopUp>

      <UserPopUp
        className="user-popup"
        title={<div style={{ textAlign: 'left' }}>{t`user.field.reuse_16`}</div>}
        visible={visibleAntiPhishing}
        autoFocus={false}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisibleAntiPhishing(false)}
        footer={null}
      >
        <UserAntiPhishingCode onSuccess={() => setVisibleAntiPhishing(false)} />
      </UserPopUp>

      <UniversalSecurityVerification
        isShow={securityVerification}
        businessType={businessType.current}
        onClose={setSecurityVerification}
        onSuccess={handleOnSuccess}
      />

      <FullScreenLoading isShow={loading} />
    </section>
  )
}

export default UserPersonalCenterAccountSecurity

import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import Icon from '@/components/icon'
import { Button, Message } from '@nbit/arco'
import { useState, useEffect } from 'react'
import { useUserStore } from '@/store/user'
import LazyImage from '@/components/lazy-image'
import { MemberMemberAreaType } from '@/typings/user'
import UserPopUp from '@/features/user/components/popup'
import { usePageContext } from '@/hooks/use-page-context'
import ThirdParty from '@/features/user/common/third-party'
import {
  UserVerifyTypeEnum,
  SignInWithEnum,
  LoginTypeStatusEnum,
  ChinaAreaCodeEnum,
  ThirdPartyCheckoutType,
  UserUpsAndDownsColorEnum,
} from '@/constants/user'
import { oss_svg_image_domain_address } from '@/constants/oss'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'
import { postRegisterGoogleRequest, postRegisterAppleRequest, getMemberAreaIp } from '@/apis/user'
import styles from './index.module.css'

export default function SignInWith() {
  const [isPopUp, setIsPopUp] = useState<boolean>(false)
  const [thirdPartyVisible, setThirdPartyVisible] = useState<boolean>(false)
  const [emailOrPhone, setEmailOrPhone] = useState<string>('')
  const [currnetLoginType, setCurrnetLoginType] = useState<string>('')
  const [accountType, setAccountType] = useState<number>(UserVerifyTypeEnum.email)
  const [area, setArea] = useState<MemberMemberAreaType>({
    codeVal: ChinaAreaCodeEnum.code,
    codeKey: t`features_user_personal_center_account_security_phone_index_2432`,
    remark: ChinaAreaCodeEnum.remark,
  })
  const pageContext = usePageContext()
  const { invitationCode } = pageContext.urlParsed.search
  const hasInvitationCode = invitationCode ? `invitationCode=${invitationCode}&` : ''

  const { setThirdPartyToken, setToken, setUserInfo, setUserTransitionDatas, setMemberBaseColor } = useUserStore()

  const onSignChange = () => {
    setIsPopUp(false)
    link(`/login/welcome-back?accountType=${accountType}&account=${emailOrPhone}#${currnetLoginType}`)
  }

  const getAreaIp = async () => {
    const res = await getMemberAreaIp({})
    if (res.isOk) {
      const { enCode, fullName, shortName } = res.data
      setArea({
        codeVal: enCode,
        codeKey: fullName,
        remark: shortName,
      })
    }
  }

  const handleLogin = async (data, thirdPartyData, type, loginType) => {
    switch (data?.status) {
      case LoginTypeStatusEnum.needBind:
        await setUserTransitionDatas(data)
        setIsPopUp(true)
        setEmailOrPhone(thirdPartyData?.account)
        break
      case LoginTypeStatusEnum.registering:
        const account = thirdPartyData?.account
        link(`/login/master-account?${hasInvitationCode}type=${type}&account=${account}#${loginType}`)
        break
      case LoginTypeStatusEnum.isLogin:
        setToken({
          accessToken: data.token,
          refreshToken: data.refreshToken,
          accessTokenExpireTime: data.tokenExpireTime,
          refreshTokenExpireTime: data.refreshTokenExpireTime,
        })
        await setUserInfo({ ...data?.userInfo })
        await setMemberBaseColor(data.usrMemberSettingsVO?.marketSetting || UserUpsAndDownsColorEnum.greenUpRedDown)
        link('/')
        Message.success(t`store_user_index_suoaao9ftj`)
        break
      default:
    }
  }

  const handleThirdPartyOnSuccess = async (type: number, thirdPartyData) => {
    console.log(thirdPartyData, 'thirdPartyDatathirdPartyDatathirdPartyData')

    if (!thirdPartyData?.account) {
      return setThirdPartyVisible(true)
    }
    const idToken = thirdPartyData.accessToken
    const loginType = thirdPartyData?.loginType
    type && setAccountType(type)
    idToken && setThirdPartyToken(idToken)
    loginType && setCurrnetLoginType(loginType)
    if (loginType === SignInWithEnum.google) {
      const { data, isOk } = await postRegisterGoogleRequest({ idToken })
      isOk && data && handleLogin(data, thirdPartyData, type, loginType)
    } else {
      const params = { idToken, type: ThirdPartyCheckoutType.apple }
      const { data, isOk } = await postRegisterAppleRequest(params)
      isOk && data && handleLogin(data, thirdPartyData, type, loginType)
    }
  }

  useEffect(() => {
    getAreaIp()
  }, [])

  return (
    <div className={styles['sign-in-width-wrap']}>
      <ThirdParty onSuccess={handleThirdPartyOnSuccess} />

      <UserPopUp
        width={360}
        visible={isPopUp}
        footer={
          <Button type="primary" className="mx-none-button" onClick={onSignChange}>
            {t`user.field.reuse_23`}
          </Button>
        }
        className="user-popup"
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setIsPopUp(false)}
      >
        <UserPopupTipsContent
          className={styles['bind-account-popup']}
          headerIcon={
            <label className="bind-account-text">{t`features_user_login_component_sign_in_with_index_lsj6s29cqd`}</label>
          }
          slotContent={
            <div className="bind-account-popup-content">
              <span className="content-text content-text-left">
                {t`features_user_login_component_sign_in_with_index_womg7jtfid`}
              </span>
              <div className="content-input">{emailOrPhone}</div>
            </div>
          }
        />
      </UserPopUp>

      <UserPopUp
        width={360}
        className="user-popup"
        visible={thirdPartyVisible}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setThirdPartyVisible(false)}
        footer={
          <Button type="primary" className="mx-none-button" onClick={() => setThirdPartyVisible(false)}>
            {t`features_user_login_component_sign_in_with_index_zvmqygczv5`}
          </Button>
        }
      >
        <UserPopupTipsContent
          className={styles['bind-account-popup']}
          headerIcon={<LazyImage src={`${oss_svg_image_domain_address}tips.png`} />}
          slotContent={
            <div className="my-4 bind-account-popup-content">
              {t`features_user_login_component_sign_in_with_index_9gsq5nhek8`}
            </div>
          }
        />
      </UserPopUp>
    </div>
  )
}

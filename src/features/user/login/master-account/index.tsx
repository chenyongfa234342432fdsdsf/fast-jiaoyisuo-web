import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import { useState, useEffect } from 'react'
import Link from '@/components/link'
import Icon from '@/components/icon'
import { useLayoutStore } from '@/store/layout'
import {
  ChinaAreaCodeEnum,
  UserAgreementEnum,
  LoginTypeStatusEnum,
  SignInWithEnum,
  UserVerifyTypeEnum,
  ThirdPartyCheckoutType,
  UserUpsAndDownsColorEnum,
  GeeTestOperationTypeEnum,
} from '@/constants/user'
import { useUserStore } from '@/store/user'
import UserSearchArea from '@/features/user/common/search-area'
import UserPopUp from '@/features/user/components/popup'
import { usePageContext } from '@/hooks/use-page-context'
import { Input, Button, Image, Checkbox, Message } from '@nbit/arco'
import { MemberMemberAreaType } from '@/typings/user'
import { useGeeTestBind } from '@/features/user/common/geetest'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { postRegisterGoogleRequest, postRegisterAppleRequest } from '@/apis/user'
import styles from './index.module.css'

function MasterAccount() {
  const [area, setArea] = useState<MemberMemberAreaType>({
    codeVal: ChinaAreaCodeEnum.code,
    codeKey: t`features_user_personal_center_account_security_phone_index_2432`,
    remark: ChinaAreaCodeEnum.remark,
  })
  const [visible, setVisible] = useState<boolean>(false)
  const [account, setAccount] = useState<string>('')
  const [accountType, setAccountType] = useState<number>(UserVerifyTypeEnum.email)
  const [invitationValue, setInvitationValue] = useState<string>('')
  const [loginType, setLoginType] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [checkBoxStatus, setCheckBoxStatus] = useState<boolean>(false)

  const layoutStore = useLayoutStore()
  const { thirdPartyToken, setToken, setUserInfo, setMemberBaseColor } = useUserStore()
  const pageContext = usePageContext()
  const geeTestInit = useGeeTestBind()
  const { invitationCode } = pageContext.urlParsed.search

  const getRouterParams = () => {
    const urlParsed = pageContext?.urlParsed?.search
    const type = urlParsed?.type
    const accountData = urlParsed?.account
    const accountRouterType = pageContext?.urlParsed?.hash
    return { type, accountData, accountRouterType }
  }

  const getRouterInformation = () => {
    const { type, accountData, accountRouterType } = getRouterParams()
    accountData && setAccount(accountData)
    type && setAccountType(Number(type))
    accountRouterType && setLoginType(accountRouterType)
  }

  const handleSelectArea = (v: MemberMemberAreaType) => {
    setArea(v)
  }

  const handleLogin = async data => {
    const params = data?.userInfo
    setToken({
      accessToken: data.token,
      refreshToken: data.refreshToken,
      accessTokenExpireTime: data.tokenExpireTime,
      refreshTokenExpireTime: data.refreshTokenExpireTime,
    })
    await setUserInfo({ ...params })
    await setMemberBaseColor(data.usrMemberSettingsVO?.marketSetting || UserUpsAndDownsColorEnum.greenUpRedDown)
    link(`/login/set-password?account=${params?.email || params?.mobileNumber}&type=${accountType}`)
    setLoading(false)
  }

  const geeTestOnSuccess = async () => {
    let params = {
      idToken: thirdPartyToken,
      status: LoginTypeStatusEnum.registering,
      invitationCode: invitationValue,
    } as any
    if (loginType === SignInWithEnum.google) {
      const { data, isOk } = await postRegisterGoogleRequest(params)
      if (!isOk) return setLoading(false)
      data && handleLogin(data)
    } else {
      params = { ...params, type: ThirdPartyCheckoutType.apple }
      const { data, isOk } = await postRegisterAppleRequest(params)
      if (!isOk) return setLoading(false)
      data && handleLogin(data)
    }
  }

  /** 注册 */
  const onSumbitChange = async () => {
    if (!checkBoxStatus) {
      return Message.info(t`features_user_register_flow_index_2450`)
    }
    /** 极验验证 */
    setLoading(true)
    const operateType = GeeTestOperationTypeEnum.register
    const accountData = account?.replace(/\s/g, '')
    geeTestInit(accountData, operateType, geeTestOnSuccess, () => setLoading(false))
  }

  useEffect(() => {
    invitationCode && setInvitationValue(invitationCode)
  }, [invitationCode])

  useEffect(() => {
    getRouterInformation()
  }, [])

  return (
    <section className={styles.scoped}>
      <div className="master-account-body">
        <div className="main">
          <div className="master-account-wrap">
            <div className="master-account-back">
              <Icon name="back" hasTheme className="mt-px" />
              <label onClick={() => window.history.back()}>{t`user.field.reuse_44`}</label>
            </div>
            <div className="master-account-content">
              <p>{t`features_user_login_master_account_index_u4cp0osfvd`}</p>
              {/* <span className="content-text">{t`features_user_login_master_account_index_llbqrk5euv`}</span>
              <div className="content-country" onClick={() => setVisible(true)}>
                <div className="content-country-left">
                  <Image preview={false} src={`${oss_area_code_image_domain_address}${area?.remark}.png`} />
                  <span>{area?.codeKey}</span>
                </div>
                <Icon name="arrow_open" hasTheme className="content-country-icon" />
              </div>
              <div className="content-serivce">
                <span>{t`user.register.fresidence_04`}</span>
                <span className="text-brand_color">{t`user.register.fresidence_05`}</span>
                <span>{t`user.register.fresidence_06`}</span>
              </div> */}
              <Input type={'text'} placeholder={t`user.validate_form_02`} value={account} readOnly />
              <Input
                type={'text'}
                readOnly={!!invitationCode}
                placeholder={t`features_user_login_master_account_index_lha4ssocv6`}
                value={invitationValue}
                onChange={setInvitationValue}
              />
              <div className="my-6">
                <Checkbox checked={checkBoxStatus} onChange={setCheckBoxStatus}>
                  {() => {
                    return (
                      <div className="service-agreement">
                        <Icon
                          hasTheme={!checkBoxStatus}
                          className="service-agreement-icon"
                          name={`${checkBoxStatus ? 'icon_agree_yes' : 'icon_agree_no'}`}
                        />
                        <div className="text">
                          <label>
                            {t({
                              id: 'user.validate_form_09',
                              values: { 0: layoutStore.headerData?.businessName },
                            })}
                          </label>
                          <Link
                            href={layoutStore.columnsDataByCd?.[UserAgreementEnum.termsService]?.webUrl}
                            className="customize-link-style"
                          >
                            {t`features_user_personal_center_account_security_manage_account_index_ulmxsiq15y`}
                          </Link>
                        </div>
                      </div>
                    )
                  }}
                </Checkbox>
              </div>
              <Button type="primary" loading={loading} className="master-account-button" onClick={onSumbitChange}>
                {t`user.field.reuse_17`}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <UserPopUp
        title={<div style={{ textAlign: 'left' }}>{t`user.search_area_04`}</div>}
        className="user-popup"
        maskClosable={false}
        visible={visible}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <UserSearchArea
          type="area"
          checkedValue={area?.codeVal}
          placeholderText={t`user.field.reuse_25`}
          selectArea={handleSelectArea}
        />
      </UserPopUp>
    </section>
  )
}

export default MasterAccount

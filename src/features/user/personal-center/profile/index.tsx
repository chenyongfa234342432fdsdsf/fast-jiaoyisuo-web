import { useEffect, useState } from 'react'
import { useMount } from 'ahooks'
import { Button, Select, Image, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import { MemberMemberPhoneAreaType } from '@/typings/user'
import { oss_area_code_image_domain_address, oss_svg_image_domain_address } from '@/constants/oss'
import { getIsLogin } from '@/helper/auth'
import { getMainData } from '@/apis/kyc'
import cn from 'classnames'
import { UserAuthenticationStatusTypeEnum } from '@/constants/user'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { CertificationLevel } from '@/features/kyc/kyt-const'
import { useCommonStore } from '@/store/common'
import { useUserStore } from '@/store/user'
import styles from './index.module.css'

interface CertificationType {
  stardandIdentity: number
  highIdentity: number
  companyIdentity: number
}

interface AuthenticationItemProps {
  /** 认证类型 */
  type: string
  itemList: any
  list: any
  statusTion: CertificationType
  /** 标准认证类型状态 */
  standardStatus?: boolean
  /** 标题 */
  title: string

  kycStatus: number

  kycAuditStatus?: boolean
}

enum CertificationStatusType {
  start = 0, // 开始认证
  completed, // 完成认证
  underReview, // 审核中
  notApplicable, // 不适用
  notAdopt, // 未通过
}

enum AuthenticationType {
  standard = 'standard', // 标准认证
  advanced = 'advanced', // 高级认证
  enterprise = 'enterprise', // 企业认证
}

type Certification = {
  kycType: number
  kycTypeRules: Record<'cashOutNum' | 'kycType' | 'monkeyPay' | 'otcBuy' | 'otcSell', number>[]
}

function AuthenticationItem({ type, itemList, list, statusTion, title, kycAuditStatus }: AuthenticationItemProps) {
  const [certificationStatus, setCertificationStatus] = useState<number>(UserAuthenticationStatusTypeEnum.notCertified)

  const authenticationJudge = type === AuthenticationType.standard

  const linkUrl = authenticationJudge ? '/personal-verify' : '/personal-high-certification'

  const status = authenticationJudge ? statusTion?.stardandIdentity : statusTion?.highIdentity

  const personLink = authenticationJudge
    ? CertificationLevel.personalStandardCertification
    : CertificationLevel.personalAdvancedCertification

  useEffect(() => {
    switch (status) {
      case UserAuthenticationStatusTypeEnum.notCertified:
        setCertificationStatus(CertificationStatusType.start)
        break
      case UserAuthenticationStatusTypeEnum.examinationPassed:
        setCertificationStatus(CertificationStatusType.completed)
        break
      case UserAuthenticationStatusTypeEnum.underReview:
        setCertificationStatus(CertificationStatusType.underReview)
        break
      case UserAuthenticationStatusTypeEnum.notApprovedCertified:
        setCertificationStatus(CertificationStatusType.notApplicable)
        break
      case UserAuthenticationStatusTypeEnum.AuditNotPassed:
        setCertificationStatus(CertificationStatusType.notAdopt)
        break
      default:
        break
    }
  }, [status])

  return (
    <div className="authentication-item" key={type}>
      <div className="title">
        <label>{title}</label>
      </div>

      <div className="credential">
        {itemList.map(v => (
          <div className="item" key={v.text}>
            <Icon name={v.iconName} />
            <label>{v.text}</label>
          </div>
        ))}
      </div>

      {certificationStatus === CertificationStatusType.start && (
        <Button type="primary" onClick={() => link(linkUrl)}>
          {t`features/user/personal-center/profile/index-0`}
        </Button>
      )}

      {certificationStatus === CertificationStatusType.completed && (
        <Button className="completed-button" status="success">
          {t`constants/assets/index-21`}
        </Button>
      )}

      {certificationStatus === CertificationStatusType.underReview && (
        <Button
          className="under-review-button"
          disabled
        >{t`features/user/personal-center/account-security/index-2`}</Button>
      )}

      {certificationStatus === CertificationStatusType.notApplicable && (
        <Button className="not-applicable-button" disabled>
          {!authenticationJudge && !kycAuditStatus
            ? t`features_user_personal_center_profile_index_5101108`
            : t`features_user_personal_center_profile_index_5101109`}
        </Button>
      )}

      {certificationStatus === CertificationStatusType.notAdopt && (
        <Button className="not-adopt-button" onClick={() => link(`/verified-result?kycType=${personLink}`)}>
          {t`features_user_personal_center_profile_index_5101116`}
        </Button>
      )}

      <div className="tips">
        {list.map(v => (
          <div className="item" key={v.title}>
            <p>{v.title}</p>
            <p>{v.des}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function UserPersonalCenterProfile() {
  const [area, setArea] = useState<MemberMemberPhoneAreaType>({
    id: 1,
    enCode: '86',
    enableInd: 1,
    fullName: t`features_user_personal_center_account_security_phone_index_2432`,
    shortName: 'CN',
  })

  const [advancedCertification, setAdvancedCertification] = useState<CertificationType>({
    stardandIdentity: UserAuthenticationStatusTypeEnum.notCertified,
    highIdentity: UserAuthenticationStatusTypeEnum.notApprovedCertified,
    companyIdentity: UserAuthenticationStatusTypeEnum.notCertified,
  })
  const { theme } = useCommonStore()

  const themeColor = theme === 'dark' ? 'black' : 'white'

  const store = useUserStore()

  const [certification, setCertification] = useState<Certification>({ kycType: 1, kycTypeRules: [] })

  const [kycStatus, setKycStatus] = useState<number>(1)

  const [kycAuditStatus, setKycAuditStatus] = useState<boolean>(false)

  const standardCertificationItemList = [
    {
      key: 1,
      iconName: `certification_information_${themeColor}`,
      text: t`features/user/personal-center/profile/index-9`,
    },
    {
      key: 2,
      iconName: `certification_certificates_${themeColor}`,
      text: t`features_user_personal_center_profile_index_5101110`,
    },
    {
      key: 3,
      iconName: `certification_hold_${themeColor}`,
      text: t`features_user_personal_center_profile_index_5101111`,
    },
    {
      key: 4,
      iconName: `certification_time_${themeColor}`,
      text: t`features_user_personal_center_profile_index_5101112`,
    },
  ]

  const advancedCertificationItemList = [
    {
      key: 1,
      iconName: `certification_address_${themeColor}`,
      text: t`features/user/personal-center/profile/index-12`,
    },
    {
      key: 2,
      iconName: `certification_time_${themeColor}`,
      text: t`features_user_personal_center_profile_index_5101112`,
    },
  ]

  const isLogin = getIsLogin()

  const setPayBuyChange = certificationNums => {
    const limitPrice = certificationNums >= 1000 ? `${certificationNums / 1000} K` : certificationNums
    return certificationNums === -1
      ? t`features/user/personal-center/profile/index-4`
      : t({
          id: 'features_user_personal_center_profile_index_5101113',
          values: { 0: limitPrice },
        })
  }

  const setCertificationListChange = (kycTypeRules, kycType) => {
    if (kycTypeRules.length > 0) {
      const { otcBuy, monkeyPay, cashOutNum, otcSell } = kycTypeRules.find(item => item.kycType === kycType)

      const certification = [
        {
          des: setPayBuyChange(otcSell),
          title: t`features_user_personal_center_profile_index_5101114`,
          iconName: 'professional_version_in_stock',
        },
        {
          des: setPayBuyChange(otcBuy),
          title: t`features_user_personal_center_profile_index_5101115`,
          iconName: 'icon_equity_sell',
        },
        {
          des: setPayBuyChange(monkeyPay),
          title: t`features_user_personal_center_profile_index_5101297`,
          iconName: 'icon_equity_recharge',
        },
        {
          des: setPayBuyChange(cashOutNum),
          title: t`features/user/personal-center/profile/index-5`,
          iconName: 'icon_equity_withdrawal',
        },
      ]
      return certification
    } else {
      return []
    }
  }

  const setStatusTypeEnum = (auditStatus, isReadResult) => {
    return {
      1: 'underReview',
      2: 'examinationPassed',
      3: isReadResult === 2 ? 'AuditNotPassed' : 'notCertified',
      4: 'notCertified',
    }[auditStatus]
  }

  const setJudgeUserAuthentication = (auditStatus, isReadResult) => {
    return UserAuthenticationStatusTypeEnum[setStatusTypeEnum(auditStatus, isReadResult)]
  }

  const setStatusButton = (statusButtonItems, showAuditMaps): CertificationType => {
    const { auditStatus = 4, kycType = 1, isReadResult = 1 } = statusButtonItems || {}

    const judgeUserAuthentication = setJudgeUserAuthentication(auditStatus, isReadResult)

    const judgePass = Number(judgeUserAuthentication) === UserAuthenticationStatusTypeEnum.examinationPassed
    const stardand = showAuditMaps?.filter(item => item.isReadResult !== 1).find(item => item.kycType === 2)
    const company = showAuditMaps?.filter(item => item.isReadResult !== 1).find(item => item.kycType === 4)
    const high = showAuditMaps?.filter(item => item.isReadResult !== 1).find(item => item.kycType === 3)

    if (kycType === 1) {
      return {
        stardandIdentity: Number(judgeUserAuthentication),
        highIdentity: UserAuthenticationStatusTypeEnum.notApprovedCertified,
        companyIdentity: UserAuthenticationStatusTypeEnum.notCertified,
      }
    } else if (kycType === 2) {
      return {
        stardandIdentity: Number(judgeUserAuthentication),
        highIdentity: judgePass ? UserAuthenticationStatusTypeEnum.notCertified : CertificationStatusType.notApplicable,
        companyIdentity: setJudgePassStardand(company, judgePass, auditStatus),
      }
    } else if (kycType === 3) {
      return {
        stardandIdentity: Number(setJudgeUserAuthentication(stardand?.auditStatus, stardand?.isReadResult)),
        highIdentity: Number(judgeUserAuthentication),
        companyIdentity: setJudgePassStardand(
          company,
          stardand?.auditStatus === UserAuthenticationStatusTypeEnum.examinationPassed,
          stardand?.auditStatus
        ),
      }
    } else {
      const stardand = showAuditMaps.filter(item => item.isReadResult !== 1).find(item => item.kycType === 2)
      return {
        stardandIdentity: setJudgePassStardand(stardand, judgePass, auditStatus),
        highIdentity: setHightJudgePassStardand(high, stardand?.auditStatus === 2),
        companyIdentity: Number(judgeUserAuthentication),
      }
    }
  }

  const setHightJudgePassStardand = (stardand, judgePass) => {
    if (stardand?.auditStatus === 3 || judgePass) {
      return Number(setJudgeUserAuthentication(stardand?.auditStatus || 4, stardand?.isReadResult || 1))
    } else {
      return UserAuthenticationStatusTypeEnum.notApprovedCertified
    }
  }

  const setJudgePassStardand = (stardand, judgePass, auditStatus) => {
    if (stardand?.auditStatus === 3 || (!judgePass && auditStatus !== 1)) {
      return Number(setJudgeUserAuthentication(stardand?.auditStatus || 4, stardand?.isReadResult || 1))
    } else {
      return UserAuthenticationStatusTypeEnum.notApprovedCertified
    }
  }

  const setShowSort = auditMap => {
    return auditMap
      .filter(item => item.auditStatus !== 4 && item.isReadResult !== 1)
      .map(item => {
        return item.kycType
      })
      .sort((a, b) => b - a)
  }

  const getUserIdentityStatus = async () => {
    const { data, isOk } = await getMainData({})

    if (isOk) {
      const { kycType, kycTypeRules, auditMaps, countryDetail } = data

      store.setUserInfo({
        // ...store.userInfo,
        kycType,
      })

      const showKycType = setShowSort(auditMaps)[0]

      const companyStatus = auditMaps.find(item => item.kycType === 4)

      if (
        [UserAuthenticationStatusTypeEnum.examinationPassed, UserAuthenticationStatusTypeEnum.underReview].includes(
          companyStatus?.auditStatus
        )
      ) {
        setKycAuditStatus(true)
      } else {
        setKycAuditStatus(false)
      }

      setAdvancedCertification(
        setStatusButton(
          auditMaps.find(item => item.kycType === showKycType),
          auditMaps
        )
      )

      setCertification({ kycTypeRules, kycType })

      setKycStatus(kycType)

      setArea({
        ...countryDetail,
      })
    }
  }

  const setCompanyButton = certificationType => {
    return {
      [UserAuthenticationStatusTypeEnum.underReview]: {
        className: 'company-button-underreview',
        text: t`features/user/personal-center/account-security/index-2`,
        url: `/verified-result?kycType=${CertificationLevel.enterpriseCertification}`,
      },
      [UserAuthenticationStatusTypeEnum.AuditNotPassed]: {
        className: 'company-button-adopt',
        text: t`features_user_personal_center_profile_index_5101116`,
        url: `/verified-result?kycType=${CertificationLevel.enterpriseCertification}`,
      },
      [UserAuthenticationStatusTypeEnum.notApprovedCertified]: {
        // className: 'company-button-notapproved',
        // text: '不适用',
      },
      [UserAuthenticationStatusTypeEnum.examinationPassed]: {
        className: 'company-button-complete',
        text: t`features_user_personal_center_profile_index_5101117`,
      },
      [UserAuthenticationStatusTypeEnum.notCertified]: {
        url: '/enterprise-certification',
      },
    }[certificationType]
  }

  useMount(() => {
    getUserIdentityStatus()
  })

  const goToCompany = () => {
    const companyIdentityUrl = advancedCertification.companyIdentity
    const navigateUrl = setCompanyButton(companyIdentityUrl)?.url
    if (companyIdentityUrl === UserAuthenticationStatusTypeEnum.notApprovedCertified) {
      Message.info({ content: t`features_user_personal_center_profile_index_5101346` })
      return
    }
    if (navigateUrl) {
      link(navigateUrl)
    }
  }

  return (
    <section className={`personal-center-profile ${styles.scoped}`}>
      <div className="header">
        <div className="personal-center-header">
          <div className="title">
            <label>{t`features/user/personal-center/account-security/index-0`}</label>
            <Icon name="verified" />
          </div>

          <div className="area">
            <div className="text">
              <label>{t`features_user_personal_center_profile_index_5101298`}</label>
            </div>

            <div className="select-area">
              <Select
                popupVisible={false}
                disabled={isLogin}
                value={area.fullName}
                arrowIcon={<Icon name="arrow_open" hasTheme />}
                prefix={<Image preview={false} src={`${oss_area_code_image_domain_address}${area?.shortName}.png`} />}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="personal-center-profile-wrap">
        <div className="container">
          <div className="rights-and-interests">
            <div className="rights-and-interests-header">
              <div className="text">
                <label>{t`features/user/personal-center/profile/index-14`}</label>
              </div>
            </div>
            <div className="rights-and-interests-container">
              {kycStatus <= 1 ? (
                <div className="not-certified">
                  <div className="icon">
                    <LazyImage src={`${oss_svg_image_domain_address}kyc_unauthenticated_${themeColor}.png`} alt="" />
                  </div>

                  <div className="text">
                    <p>{t`features/user/personal-center/profile/index-15`}</p>
                    <p>{t`features/user/personal-center/profile/index-16`}</p>
                  </div>
                </div>
              ) : (
                <div className="rights-and-interests-result">
                  <div className="tips">
                    {setCertificationListChange(certification.kycTypeRules, certification.kycType).map(v => (
                      <div className="item" key={v.title}>
                        <div className="icon">
                          <Icon name={v.iconName} />
                        </div>
                        <div className="text">
                          <p>{v.des}</p>
                          <p>{v.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {
              <div className="company-footer" onClick={() => goToCompany()}>
                {![UserAuthenticationStatusTypeEnum.examinationPassed].includes(
                  advancedCertification.companyIdentity
                ) && (
                  <div className="rights-and-interests-footer">
                    <div className="enterprise-certification">
                      <div className="first-icon">
                        <Icon name="enterprise_certification" />
                      </div>

                      <label>{t`features/user/personal-center/profile/index-17`}</label>

                      <div className="last-icon">
                        <Icon name="help_center_more" />
                      </div>
                    </div>
                  </div>
                )}
                {setCompanyButton(advancedCertification.companyIdentity)?.text && (
                  <div
                    className={cn('company-button', setCompanyButton(advancedCertification.companyIdentity)?.className)}
                  >
                    {setCompanyButton(advancedCertification.companyIdentity)?.text}
                  </div>
                )}
              </div>
            }
          </div>

          <AuthenticationItem
            type={AuthenticationType.standard}
            list={setCertificationListChange(certification.kycTypeRules, 2)}
            itemList={standardCertificationItemList}
            statusTion={advancedCertification}
            title={t`features_user_personal_center_menu_navigation_index_5101265`}
            kycStatus={kycStatus}
          />

          <AuthenticationItem
            key={AuthenticationType.advanced}
            type={AuthenticationType.advanced}
            list={setCertificationListChange(certification.kycTypeRules, 3)}
            itemList={advancedCertificationItemList}
            statusTion={advancedCertification}
            title={t`features_user_personal_center_menu_navigation_index_5101266`}
            kycAuditStatus={kycAuditStatus}
            kycStatus={kycStatus}
          />
        </div>
      </div>
    </section>
  )
}

export default UserPersonalCenterProfile

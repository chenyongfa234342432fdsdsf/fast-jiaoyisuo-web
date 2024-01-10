import { Alert, Button } from '@nbit/arco'
import { useState, useRef } from 'react'
import { getDraft, addDraft, getMainData } from '@/apis/kyc'
import Icon from '@/components/icon'
import { useMount } from 'ahooks'
import { link as navigate } from '@/helper/link'
import { t } from '@lingui/macro'
import cn from 'classnames'
import EnterpriseModal from '@/features/c2c/trade/c2c-modal'
import KycHeader from '@/features/kyc/kyc-header'
import { CertificationLevel, CompanyType, SaveFormData } from '@/features/kyc/kyt-const'
import styles from './index.module.css'
import { useEnterprise } from './useenterprise'

type enterpriseRefRefType = Record<'openModal' | 'closeModal', () => void>

type Certification = Record<'des' | 'title' | 'iconName', string>

function Page() {
  const enterpriselRef = useRef<enterpriseRefRefType>()

  const { radioList } = useEnterprise()

  const [badgeList, setBadgeList] = useState<Certification[]>()

  const [companyMaterial, setCompanyMaterial] = useState<SaveFormData>()

  const [initCompanyType, setInitCompanyType] = useState<number>()

  const [selectCompanyType, setSelectCompanyType] = useState<number | undefined>(
    CompanyType.companyWithLimitedLiability
  )

  const getBasicInfoRequest = async () => {
    const { isOk, data } = await getDraft({ kycType: CertificationLevel.enterpriseCertification })
    try {
      const result = data !== 'undefine' ? JSON.parse(JSON.parse(data)) : {}
      if (isOk && Object.keys(result).length > 0) {
        const { companyType } = result
        setCompanyMaterial(result)
        setSelectCompanyType(Number(companyType))
        setInitCompanyType(Number(companyType))
      }
    } catch (error) {
      console.log(error, 'error')
    }
  }

  const setAddDraft = async data => {
    const { isOk } = await addDraft({
      data,
      kycType: CertificationLevel.enterpriseCertification,
    })
    return isOk
  }

  // 点击确定企业类型按钮
  const submitCompanyType = async () => {
    // 选择的类型和草稿保存的类型不一样，需要弹窗提示
    if (initCompanyType && selectCompanyType !== initCompanyType) {
      enterpriselRef.current?.openModal()
    } else {
      const isOk = await setAddDraft({ ...companyMaterial, companyType: selectCompanyType })
      isOk && navigate(`/company-verified-material`)
    }
  }

  const setCompanyChangeOk = async () => {
    const isOk = await setAddDraft({ companyType: selectCompanyType })
    if (isOk) {
      enterpriselRef.current?.closeModal()
      navigate(`/company-verified-material`)
    }
  }

  const setRadioChange = e => {
    setSelectCompanyType(e)
  }

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
  }

  const getMainDataRequest = async () => {
    const { isOk, data } = await getMainData({})
    if (isOk && data) {
      const { kycTypeRules } = data
      setBadgeList(setCertificationListChange(kycTypeRules, CertificationLevel.enterpriseCertification))
    }
  }

  useMount(() => {
    getMainDataRequest()
    getBasicInfoRequest()
  })

  return (
    <div className={styles.scoped}>
      <KycHeader type={CertificationLevel.enterpriseCertification} />
      <div className="company-verified">
        <Alert
          type="info"
          className="company-verified-alert"
          content={t`modules_kyc_enterprise_certification_index_page_2652`}
        />
        <div className="company-verified-rights">
          <div className="company-verified-badge">
            {badgeList?.map(item => {
              // return <Badge key={item.title} status="warning" text={`${item.des}  ${item.title}`} />
              return (
                <div key={item.title} className="company-badge-detail">
                  <div className="icon">
                    <Icon name={item.iconName} />
                  </div>
                  <div className="text">
                    <span>{item.title}</span>
                    <span>{item.des}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="company-select-type">
          <div className="company-information-title">{t`modules_kyc_company_verified_material_index_page_2591`}</div>
          {radioList.map(item => {
            return (
              <div
                className={cn({
                  'company-not-select-radio': selectCompanyType !== item.id,
                  'company-select-radio': selectCompanyType === item.id,
                })}
                onClick={() => setRadioChange(item.id)}
                key={item.id}
              >
                <div className={cn('company-select-item', { 'company-kyc-select': selectCompanyType === item.id })}>
                  <Icon name={selectCompanyType === item.id ? 'kyc_select' : 'kyc_unselect_black'} />
                  <span> {item.title}</span>
                </div>
              </div>
            )
          })}
        </div>
        <Button className="company-verified-button" type="primary" onClick={submitCompanyType}>
          {t`modules_kyc_enterprise_certification_index_page_2657`}
        </Button>
      </div>
      <EnterpriseModal
        ref={enterpriselRef}
        showLeftTopIcon={false}
        modalmsg={t`modules_kyc_enterprise_certification_index_page_2653`}
        okText={t`modules_kyc_enterprise_certification_index_page_2654`}
        className="enterprise-modal"
        onOk={setCompanyChangeOk}
        onCancel={() => enterpriselRef.current?.closeModal()}
      />
    </div>
  )
}

export { Page }

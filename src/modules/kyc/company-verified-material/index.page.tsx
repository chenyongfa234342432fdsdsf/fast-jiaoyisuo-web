import { Alert, Button } from '@nbit/arco'
import { link as navigate } from '@/helper/link'
import { t } from '@lingui/macro'
import KycHeader from '@/features/kyc/kyc-header'
import { CertificationLevel } from '@/features/kyc/kyt-const'
import { useCompanyVerified } from './usecompanyverified'
import styles from './index.module.css'

function Page() {
  const { materialTips } = useCompanyVerified()

  const submitCompanyType = () => {
    navigate(`/enterprise-certification-submit`)
  }

  const onMaterialSwitch = () => {
    navigate(`/enterprise-certification`)
  }

  return (
    <div className={styles.scoped}>
      <div className="company-material">
        <KycHeader type={CertificationLevel.enterpriseCertification} />
        <div className="company-material-content">
          <Alert
            type="info"
            className="company-material-alert"
            content={t`modules_kyc_company_verified_material_index_page_2590`}
          />
          <div className="company-select-type">
            <div className="company-information-title">{t`modules_kyc_company_verified_material_index_page_5101265`}</div>
          </div>
          {materialTips.map(item => {
            return (
              <div className="company-material-tips" key={item.id}>
                {item.text}
              </div>
            )
          })}
          <div className="material-button">
            <Button className="company-material-modify" type="secondary" onClick={onMaterialSwitch}>
              {t`modules_kyc_company_verified_material_index_page_5101127`}
            </Button>
            <Button className="company-material-button" type="primary" onClick={submitCompanyType}>
              {t`modules_kyc_company_verified_material_index_page_2592`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Page }

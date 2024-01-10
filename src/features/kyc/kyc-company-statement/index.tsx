import { t } from '@lingui/macro'
import Icon from '@/components/icon'
import { useContext, useState } from 'react'
import { CertificationLevel, EnterpriseSubmitContext } from '@/features/kyc/kyt-const'
import KycHeader from '@/features/kyc/kyc-header'
import { submitCompanyDetail } from '@/apis/kyc'
import cn from 'classnames'
import { omit } from 'lodash'
import { link as navigate } from '@/helper/link'
import { Button } from '@nbit/arco'
import { BasicInformation, AttachFiles } from '../company-basic-imformation/basic-informations'
import style from './index.module.css'

function KycCompanyStatement() {
  const { current, setCurrent, saveFormData } = useContext(EnterpriseSubmitContext)

  const [handleAgreement, setHandleAgreement] = useState<boolean>(false)

  const tips = [
    t`features_kyc_kyc_company_statement_index_5101155`,
    t`features_kyc_kyc_company_statement_index_5101156`,
    t`features_kyc_kyc_company_statement_index_5101157`,
    t`features_kyc_kyc_company_statement_index_5101158`,
  ]

  const prevStep = () => {
    if (current && setCurrent) {
      setCurrent(current - 1)
    }
  }

  const nextStep = async () => {
    if (!handleAgreement) return
    const { basicInformation, attachFiles } = saveFormData || {}
    const phoneForm = (basicInformation as BasicInformation).phoneForm
    if (basicInformation && attachFiles) {
      const { website } = attachFiles.splice(0, 1)[0] as Record<'website', string>
      const submitAttachFiles = (attachFiles.flat() as AttachFiles[])
        .sort((a, b) => a.sort - b.sort)
        .map((item, index) => {
          item.sort = index + 1
          return item
        })

      const submitDetail = {
        ...saveFormData,
        ...basicInformation,
        mobile: phoneForm.areacode + phoneForm.phone,
        website,
        attachFiles: submitAttachFiles,
      }
      const submitFormData = omit(submitDetail, ['basicInformation', 'current'])
      const { isOk } = await submitCompanyDetail({ ...submitFormData })
      isOk && navigate(`/verified-result?kycType=${CertificationLevel.enterpriseCertification}`)
    }
  }

  const handleAgreementChange = () => {
    setHandleAgreement(!handleAgreement)
  }

  return (
    <div className={style.scoped}>
      <KycHeader type={CertificationLevel.enterpriseCertification} />
      <div className="kyc-statement-container">
        <div className="kyc-statement-title">
          <Icon className="kyc-statement-tip" name="tips_icon" />
          <span>{t`features_kyc_kyc_company_statement_index_5101159`}</span>
        </div>
        <div className="kyc-statement-header">{t`features_kyc_kyc_company_statement_index_5101160`}</div>
        {tips.map(item => {
          return (
            <div className="kyc-statement-content" key={item}>
              <div>{item}</div>
            </div>
          )
        })}
        <div className="kyc-statement-box" onClick={handleAgreementChange}>
          {handleAgreement ? <Icon name="agreement_select" /> : <Icon name="agreement_unselect" />}
          <span>{t`features_kyc_kyc_company_statement_index_5101161`}</span>
        </div>
        <div className="kyc-statement-button">
          <Button className="kyc-statement-prev" type="secondary" onClick={() => prevStep()}>
            {t`features_kyc_kyc_company_statement_index_5101162`}
          </Button>
          <Button
            className={cn({
              'kyc-statement-next': handleAgreement,
              'kyc-statement-not': !handleAgreement,
            })}
            type="primary"
            onClick={() => nextStep()}
          >
            {t`features_kyc_kyc_company_statement_index_5101163`}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default KycCompanyStatement

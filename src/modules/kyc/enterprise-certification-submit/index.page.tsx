import { useState, useMemo } from 'react'
import EnterpriseBasicImformation from '@/features/kyc/company-basic-imformation'
import EnterpriseCertificationDirector from '@/features/kyc/company-certification-director'
import EnterpriseImformationUpload from '@/features/kyc/company-imformation-upload'
import KycCompanyStatement from '@/features/kyc/kyc-company-statement'
import EnterpriseStep from '@/features/kyc/company-step'
import cn from 'classnames'
import { getDraft } from '@/apis/kyc'
import { useMount } from 'ahooks'
import { usePageContext } from '@/hooks/use-page-context'
import {
  EnterpriseSubmitContext,
  EnterpriseInformation,
  SaveFormData,
  CertificationLevel,
} from '@/features/kyc/kyt-const'
import styles from './index.module.css'

const initialFormData = {
  basicInformation: {},
  attachFiles: [],
  directorInfos: [],
  beneficiaryInfos: [],
  traderInfos: [],
}

function Page() {
  const pageContext = usePageContext()

  const { companyType } = pageContext?.urlParsed?.search || {}

  const [current, setCurrent] = useState<number>(EnterpriseInformation.ENTERPRISEBASIC)

  const [saveFormData, setSaveFormData] = useState<SaveFormData>(initialFormData)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const submitName = () => {
    if (current) {
      const name = {
        [EnterpriseInformation.ENTERPRISEBASIC]: 'basicInformation',
        [EnterpriseInformation.ENTERPRISEIMFORMATIONUPLOAD]: 'attachFiles',
        [EnterpriseInformation.CERTIFICATIONDIRECTOR]: 'directorInfos',
        [EnterpriseInformation.CERTIFICATIONBENEFICIALOWNER]: 'beneficiaryInfos',
        [EnterpriseInformation.CERTIFICATIONACCOUNTTRADER]: 'traderInfos',
      }
      return name[current]
    }
  }

  const [companyTypeCurrent, setCompanyType] = useState<string>('')

  const saveFormDataMemo = useMemo(
    () => ({
      saveFormData,
      setSaveFormData,
      companyTypeCurrent,
      setCurrent,
      current,
      submitName,
    }),
    [saveFormData, companyTypeCurrent, current, submitName, setCurrent, setSaveFormData]
  )

  const setFormContent = current => {
    switch (current) {
      case EnterpriseInformation.ENTERPRISEBASIC:
        return <EnterpriseBasicImformation />
      case EnterpriseInformation.ENTERPRISEIMFORMATIONUPLOAD:
        return <EnterpriseImformationUpload />
      case EnterpriseInformation.CERTIFICATIONDIRECTOR:
        return <EnterpriseCertificationDirector />
      case EnterpriseInformation.CERTIFICATIONBENEFICIALOWNER:
        return <EnterpriseCertificationDirector />
      case EnterpriseInformation.CERTIFICATIONACCOUNTTRADER:
        return <EnterpriseCertificationDirector />
      case EnterpriseInformation.CERTIFICATIONCOMPANYSTATEMENT:
        return <KycCompanyStatement />
      default:
        break
    }
  }

  const getDraftRequest = async () => {
    const { isOk, data } = await getDraft({ kycType: CertificationLevel.enterpriseCertification })

    try {
      const result = isOk && data !== 'undefine' ? JSON.parse(JSON.parse(data)) : {}
      if (isOk && Object.keys(result).length > 0) {
        const formData = JSON.parse(JSON.parse(data))
        setCurrent(formData.current || EnterpriseInformation.ENTERPRISEBASIC)
        setSaveFormData({ ...initialFormData, ...formData })
      }
    } catch (error) {
      console.log(error, 'error')
    }
  }

  useMount(() => {
    setCompanyType(companyType)
    getDraftRequest()
  })

  return (
    <div className={styles.scoped}>
      <EnterpriseSubmitContext.Provider value={saveFormDataMemo}>
        {current !== EnterpriseInformation.CERTIFICATIONCOMPANYSTATEMENT && <EnterpriseStep current={current} />}
        <div
          className={cn('enterprise-submit', {
            'enterprise-submit-full': current === EnterpriseInformation.CERTIFICATIONCOMPANYSTATEMENT,
          })}
        >
          <div className="enterprise-submit-content">{setFormContent(current)}</div>
        </div>
      </EnterpriseSubmitContext.Provider>
    </div>
  )
}

export { Page }

import { EnterpriseSubmitContext, EnterpriseInformation } from '@/features/kyc/kyt-const'
import { Button, Message } from '@nbit/arco'
import cn from 'classnames'
import { useContext } from 'react'
import { t } from '@lingui/macro'
import { debounce } from 'lodash'
import { link as navigate } from '@/helper/link'
import { addDraft } from '@/apis/kyc'
import style from './index.module.css'

function CompanySubmitButton(props) {
  const { current, setCurrent, setSaveFormData, saveFormData, submitName } = useContext(EnterpriseSubmitContext)

  const prevStep = () => {
    if (current && setCurrent) {
      const resultCurrent = current - 1
      if (resultCurrent < EnterpriseInformation.ENTERPRISEBASIC) {
        navigate('/company-verified-material')
        return
      }
      document.querySelector('#page-view')?.scrollIntoView()
      setCurrent(current - 1)
    }
  }

  const nextStep = () => {
    if (current && setCurrent) {
      setCurrent(current + 1)
    }
  }

  const setaddDraftRequest = async () => {
    const result = await props.validateInforMationFn()
    if (submitName && result) {
      const information = { ...saveFormData, [submitName()]: result }
      setSaveFormData && setSaveFormData(information)
      const { isOk } = await addDraft({
        data: { ...information, current },
        kycType: 4,
      })
      return isOk
    }
  }

  const continueStep = debounce(async () => {
    const isOk = await setaddDraftRequest()
    if (isOk) {
      document.querySelector('#page-view')?.scrollIntoView()
      nextStep()
    }
  }, 500)

  const draftStep = async () => {
    const isOk = await setaddDraftRequest()
    isOk &&
      Message.success({
        content: t`features_user_company_certification_director_index_2642`,
      })
  }

  const onMaterialSwitch = () => {
    navigate(`/enterprise-certification`)
  }

  const computedStep = () => {
    return current && current <= EnterpriseInformation.ENTERPRISEIMFORMATIONUPLOAD
  }

  return (
    <div className={style.scoped}>
      <div className="company-submit-button">
        <div className="company-submit-button-step">
          {computedStep() && (
            <Button className="company-submit-modify" type="secondary" onClick={onMaterialSwitch}>
              {t`modules_kyc_company_verified_material_index_page_5101127`}
            </Button>
          )}
          <Button
            className={cn('company-submit-modify', {
              'company-submit-comare': !computedStep(),
            })}
            type="secondary"
            onClick={prevStep}
          >
            {t`features_kyc_kyc_company_statement_index_5101162`}
          </Button>
          <Button
            className={cn('company-submit-button-draft', {
              'company-submit-comare': !computedStep(),
            })}
            onClick={draftStep}
          >
            {t`features_user_company_submit_button_index_5101188`}
          </Button>
          <Button
            className={cn('company-submit-button-next', {
              'company-submit-comare': !computedStep(),
            })}
            onClick={continueStep}
            type="primary"
          >
            {t`user.field.reuse_23`}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CompanySubmitButton

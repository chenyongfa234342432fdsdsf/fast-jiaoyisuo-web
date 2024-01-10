import { t } from '@lingui/macro'

const getStepTips = () => {
  return {
    1: t`features_user_company_step_companyverifiedsubmit_2687`,
    2: (
      <div>
        {t`modules_kyc_company_verified_material_index_page_2590`}
        <div> {t`features_user_company_step_companyverifiedsubmit_2692`}</div>
      </div>
    ),
    3: t`features_user_company_step_companyverifiedsubmit_2688`,
    4: t`features_user_company_step_companyverifiedsubmit_2688`,
    5: t`features_user_company_step_companyverifiedsubmit_2688`,
  }
}

const getStepText = () => {
  return [
    t`features/user/initial-person/submit-applications/index-0`,
    t`features_user_company_imformation_upload_company_upload_index_2673`,
    t`features_user_company_step_companyverifiedsubmit_2689`,
    t`features_user_company_step_companyverifiedsubmit_2690`,
    t`features_user_company_step_companyverifiedsubmit_2691`,
  ]
}

export { getStepTips, getStepText }

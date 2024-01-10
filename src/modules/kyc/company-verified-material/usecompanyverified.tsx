import { t } from '@lingui/macro'

const useCompanyVerified = () => {
  const materialTips = [
    { id: 1, text: t`modules_kyc_company_verified_material_usecompanyverified_5101128` },
    { id: 2, text: t`modules_kyc_company_verified_material_usecompanyverified_5101129` },
    { id: 3, text: t`modules_kyc_company_verified_material_usecompanyverified_5101130` },
    { id: 4, text: t`modules_kyc_company_verified_material_usecompanyverified_5101131` },
    { id: 5, text: t`modules_kyc_company_verified_material_usecompanyverified_5101132` },
    {
      id: 6,
      text: (
        <div>
          {t`modules_kyc_company_verified_material_usecompanyverified_5101139`}
          <span>{t`modules_kyc_company_verified_material_usecompanyverified_5101140`}</span>
        </div>
      ),
    },
    { id: 7, text: t`modules_kyc_company_verified_material_usecompanyverified_5101133` },
    { id: 8, text: t`modules_kyc_company_verified_material_usecompanyverified_5101134` },
    { id: 9, text: t`modules_kyc_company_verified_material_usecompanyverified_5101135` },
    { id: 10, text: t`modules_kyc_company_verified_material_usecompanyverified_5101255` },
    { id: 11, text: t`modules_kyc_company_verified_material_usecompanyverified_5101271` },
    { id: 12, text: t`modules_kyc_company_verified_material_usecompanyverified_5101272` },
  ]
  return { materialTips }
}

export { useCompanyVerified }

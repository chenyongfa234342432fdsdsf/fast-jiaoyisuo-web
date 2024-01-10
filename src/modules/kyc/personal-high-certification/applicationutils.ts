import { t } from '@lingui/macro'

const useHighCertification = () => {
  const setMessage = () => {
    return [{ required: true, message: t`features/c2c-trade/creates-advertisements/createsadvertisements-0` }]
  }

  const requirementText = [
    { text: t`modules_kyc_personal_high_certification_applicationutils_5101141`, textTip: '' },
    {
      text: t`modules_kyc_personal_high_certification_applicationutils_5101142`,
      textTip: t`modules_kyc_personal_high_certification_applicationutils_5101295`,
    },
    {
      text: t`modules_kyc_personal_high_certification_applicationutils_5101296`,
      textTip: t`modules_kyc_personal_high_certification_applicationutils_5101143`,
    },
    {
      text: t`modules_kyc_personal_high_certification_applicationutils_5101144`,
      textTip: t`modules_kyc_personal_high_certification_applicationutils_5101145`,
    },
    {
      text: t`modules_kyc_personal_high_certification_applicationutils_5101146`,
      textTip: t`modules_kyc_personal_high_certification_applicationutils_5101147`,
    },
    { text: t`modules_kyc_personal_high_certification_applicationutils_5101148`, textTip: '' },
  ]

  return { setMessage, requirementText }
}

export { useHighCertification }

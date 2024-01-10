import { oss_svg_image_domain_address } from '@/constants/oss'
import { t } from '@lingui/macro'

type AvaratorDetail = Record<'img' | 'tip' | 'text', string | React.ReactNode>

type ResultTypes = {
  [key: number]: AvaratorDetail
}

const getResultType = (themeColor): ResultTypes => {
  return {
    // 待审批
    1: {
      img: (
        <img
          className="verifiedresult-avarter"
          src={`${oss_svg_image_domain_address}register_success_${themeColor}.png`}
          alt=""
        />
      ),
      text: t`modules_kyc_verified_result_verified_5101153`,
      tip: t`modules_kyc_verified_result_verified_5101154`,
    },
    //  2 为已通过
    2: {
      img: (
        <img
          className="verifiedresult-avarter-success"
          src={`${oss_svg_image_domain_address}kyc-examine-success.png`}
          alt=""
        />
      ),
      text: t`modules_kyc_verified_result_verified_5101268`,
      tip: t`modules_kyc_verified_result_verified_5101269`,
    },
  }
}
export { getResultType, AvaratorDetail }

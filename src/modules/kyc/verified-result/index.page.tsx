import { useState } from 'react'
import { oss_svg_image_domain_address } from '@/constants/oss'
import { useMount } from 'ahooks'
import { useCommonStore } from '@/store/common'
import KycHeader from '@/features/kyc/kyc-header'
import { getApprovalResult, getMainData, resubmitUpdate } from '@/apis/kyc'
import { link as navigate } from '@/helper/link'
import { usePageContext } from '@/hooks/use-page-context'
import { t } from '@lingui/macro'
import { Button } from '@nbit/arco'
import styles from './index.module.css'
import { getResultType } from './verified'

type RequestDetail = Record<'kycType' | 'kycId', string>

enum ApprovalStatus {
  /**
   * 待审批
   */
  toBeApproved = 1,
  /**
   * 已通过
   */
  passed,
  /**
   * 驳回
   */
  reject,
  /**
   * 取消认证
   */
  cancelAuthentication,
}

function Page() {
  const { theme } = useCommonStore()

  const themeColor = theme === 'dark' ? 'black' : 'white'

  const resultDetail = getResultType(themeColor)

  const pageContext = usePageContext()

  const { kycType } = pageContext?.urlParsed?.search || {}

  const [identityType, setIdentityType] = useState<number>(ApprovalStatus.toBeApproved)

  const [showAudit, setShowAudit] = useState<boolean>(true)

  const [identityReason, setIdentityReason] = useState<string>('')

  const [buttonText, setButtonText] = useState<string>(t`features_trade_spot_index_2510`)

  const [requestDetail, setRequestDetail] = useState<RequestDetail>()

  const getVerifyResultFn = async () => {
    const result = await getMainData({})
    if (result.isOk) {
      const { kycId } = result?.data?.auditMaps?.find(item => item.kycType === Number(kycType)) || {}
      const submitRequest = { kycId, kycType }
      setRequestDetail(submitRequest)
      const { isOk, data } = await getApprovalResult(submitRequest)

      const { approvalStatus, rejectText } = data || {}
      if (isOk && approvalStatus) {
        if (approvalStatus === ApprovalStatus.reject) {
          setButtonText(t`modules_kyc_verified_result_index_page_5101149`)
          setShowAudit(false)
          setIdentityReason(rejectText)
        }
        setIdentityType(approvalStatus || ApprovalStatus.toBeApproved)
      }
    }
  }

  const goBack = async () => {
    if (identityType === ApprovalStatus.reject) {
      const { isOk } = await resubmitUpdate(requestDetail)
      isOk && navigate('/kyc-authentication-homepage')
    } else {
      navigate('/kyc-authentication-homepage')
    }
  }

  useMount(() => {
    getVerifyResultFn()
  })

  return (
    <div className={styles.scoped}>
      <KycHeader type={Number(kycType)} />
      <div className="verifiedresult-container">
        {showAudit ? (
          <div className="verifiedresult-content">
            <div>{resultDetail?.[identityType]?.img}</div>
            <div className="verifiedresult-submited">{resultDetail?.[identityType]?.text}</div>
            <div className="verifiedresult-tips">{resultDetail?.[identityType]?.tip}</div>
          </div>
        ) : (
          <div className="verifiedresult-fail">
            <img src={`${oss_svg_image_domain_address}kyc-examine-fail.png`} alt="" />
            <div className="verifiedresult-submited">{t`modules_kyc_verified_result_index_page_5101150`}</div>
            <div className="verifiedresult-tips">{t`modules_kyc_verified_result_index_page_5101151`}</div>
            <div className="verifiedresult-fail-reason">
              {t`modules_kyc_verified_result_index_page_5101152`}
              {identityReason}
            </div>
          </div>
        )}
        <Button className="verifiedresult-button" type="primary" onClick={goBack}>
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

export { Page }

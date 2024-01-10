import { Alert, Steps } from '@nbit/arco'
import KycHeader from '@/features/kyc/kyc-header'
import { memo } from 'react'
import cn from 'classnames'
import { CertificationLevel } from '@/features/kyc/kyt-const'
import { getStepTips, getStepText } from './companyverifiedsubmit'
import styles from './index.module.css'

const Step = Steps.Step

type Props = {
  current: number
}

function CompanyStep(props: Props) {
  const { current } = props

  const customDot = (_, { status, index }) => {
    const showStatus = status !== 'wait'
    return (
      <div className={cn({ 'company-index-step': showStatus, 'company-index-not-step': !showStatus })}>{index}</div>
    )
  }

  return (
    <div className={styles.scoped}>
      <KycHeader type={CertificationLevel.enterpriseCertification} />
      <div className="company-submit">
        <div className="company-submit-header-step">
          <div className="company-submit-step">
            <Steps type="dot" current={current} customDot={customDot}>
              {getStepText().map(item => (
                <Step title={item} key={item} />
              ))}
            </Steps>
          </div>
          <Alert type="info" className="company-submit-alert" content={getStepTips()[current]} />
        </div>
      </div>
    </div>
  )
}

export default memo(CompanyStep)

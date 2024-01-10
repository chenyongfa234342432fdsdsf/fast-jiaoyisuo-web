import { t } from '@lingui/macro'
import cn from 'classnames'
import style from './index.module.css'

type Props = {
  text: string
  onClick?: () => void
  subText?: string
  showCursorPointer?: boolean
}

function KycFormTitle(props: Props) {
  const {
    text,
    subText = t`features_kyc_kyc_form_title_index_5101170`,
    onClick = () => {},
    showCursorPointer = true,
  } = props
  return (
    <div className={style.scoped}>
      <div className="kyc-certification-title">
        <span>{text}</span>
        <span className={cn('kyc-check-image', { 'kyc-cursor-pointer': showCursorPointer })} onClick={onClick}>
          {subText}
        </span>
      </div>
    </div>
  )
}

export default KycFormTitle

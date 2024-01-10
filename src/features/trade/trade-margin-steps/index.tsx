import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { Tooltip } from '@nbit/arco'
import Styles from './index.module.css'

function TradeMarginSteps() {
  return (
    <div className={Styles.scoped}>
      {t`features/trade/trade-margin-steps/index-0`}
      <div className="text-brand_color cursor-pointer">{t`features/trade/trade-margin-steps/index-1`}</div>
      <Icon name="next_arrow_white" />
      <Tooltip content={t`features/trade/trade-margin-steps/index-4`}>
        <div>{t`features/trade/trade-margin-steps/index-2`}</div>
      </Tooltip>
      <Icon name="next_arrow_white" />
      <Tooltip content={t`features/trade/trade-margin-steps/index-5`}>
        <div>{t`features/trade/trade-margin-steps/index-3`}</div>
      </Tooltip>
    </div>
  )
}

export default TradeMarginSteps

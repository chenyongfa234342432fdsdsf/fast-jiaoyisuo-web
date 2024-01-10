import TradeLayout from '@/features/trade/trade-layout'
import { t } from '@lingui/macro'
import styles from '../../index.module.css'

function TradeLayoutSettins() {
  return (
    <>
      <div className="title line line-width-full">{t`features_trade_trade_setting_common_layout_index_5101582`}</div>
      <div className="list" style={{ marginBottom: 14 }}>
        <div className={`trade-layout-wrap ${styles['trade-layout-settings']}`}>
          <TradeLayout />
        </div>
      </div>
    </>
  )
}

export default TradeLayoutSettins

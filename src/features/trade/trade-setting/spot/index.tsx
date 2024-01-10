import { t } from '@lingui/macro'
import TradeOrderConfirmation from '@/features/trade/trade-setting/common/order-confirmation'
import TradeBulletinBoard from '@/features/trade/trade-setting/common/bulletin-board'
// import TradeHistoricalTransactions from '@/features/trade/trade-setting/common/historical-transactions'
import TradeColorPreferences from '@/features/trade/trade-setting/common/color-preferences'
import TradeColorBlockSettings from '@/features/trade/trade-setting/common/color-block'
import TradeLayout from '@/features/trade/trade-setting/common/layout'
import { getMergeModeStatus } from '@/features/user/utils/common'
import Styles from '../index.module.css'

function TradeSpotSetting() {
  const isMergeMode = getMergeModeStatus()
  return (
    <div className={Styles['trade-setting-main-wrap']}>
      <div className="list-wrap">
        <div className="title">{t`features_trade_trade_setting_index_2511`}</div>

        <TradeOrderConfirmation />

        {!isMergeMode && <TradeBulletinBoard />}

        {/* <TradeHistoricalTransactions /> */}

        <TradeColorPreferences />

        <TradeColorBlockSettings />

        <TradeLayout />
      </div>
    </div>
  )
}

export default TradeSpotSetting

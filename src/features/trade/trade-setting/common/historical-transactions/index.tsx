import { Switch } from '@nbit/arco'
import { useTradeStore } from '@/store/trade'
import { t } from '@lingui/macro'

function TradeHistoricalTransactions() {
  const TradeStore = useTradeStore()
  const { layout, setLayout } = TradeStore

  return (
    <div className="list">
      <div className="label">
        <div>{t`features_trade_trade_setting_index_2513`}</div>
        <div className="sub-label">{t`features_trade_trade_setting_index_2522`}</div>
      </div>
      <div className="value sub-value">
        <Switch
          checked={layout.kLineHistory}
          onChange={val => {
            setLayout('kLineHistory', val)
          }}
        />
      </div>
    </div>
  )
}

export default TradeHistoricalTransactions

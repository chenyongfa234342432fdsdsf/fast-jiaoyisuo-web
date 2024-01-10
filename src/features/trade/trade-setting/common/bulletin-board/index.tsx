import { Switch } from '@nbit/arco'
import { useTradeStore } from '@/store/trade'
import { t } from '@lingui/macro'

function TradeBulletinBoard() {
  const TradeStore = useTradeStore()
  const { layout, setLayout } = TradeStore

  return (
    <div className="list list-margin-spacing">
      <div className="label">{t`features_trade_trade_setting_index_2512`}</div>
      <div className="value">
        <Switch
          checked={layout.announcementShow}
          onChange={val => {
            setLayout('announcementShow', val)
          }}
        />
      </div>
    </div>
  )
}

export default TradeBulletinBoard

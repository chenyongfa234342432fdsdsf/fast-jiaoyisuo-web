import { useState } from 'react'
import { t } from '@lingui/macro'
import FuturesMarginCurrencyPopUp from '@/features/trade/trade-setting/futures/margin-currency/popup'
import Icon from '@/components/icon'

function FuturesMarginCurrencySetting() {
  const [visible, setVisible] = useState<boolean>(false)
  return (
    <>
      <div className="list" onClick={() => setVisible(true)}>
        <div className="label">{t`features_trade_trade_setting_futures_margin_currency_index_5101390`}</div>
        <div className="value">
          <Icon name="next_arrow" hasTheme />
        </div>
      </div>

      <FuturesMarginCurrencyPopUp visible={visible} setVisible={setVisible} hasCloseIcon />
    </>
  )
}

export default FuturesMarginCurrencySetting

import { useEffect, useState } from 'react'
import FuturesSettlementCurrencyPopUp from '@/features/trade/trade-setting/futures/settlement-currency/popup'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import { t } from '@lingui/macro'
import Icon from '@/components/icon'

function FuturesSettlementCurrencySetting() {
  const [visible, setVisible] = useState<boolean>(false)

  const { contractPreference, getContractPreference } = useContractPreferencesStore()

  useEffect(() => {
    !visible && getContractPreference()
  }, [visible])

  return (
    <>
      <div className="list" onClick={() => setVisible(true)}>
        <div className="label">{t`features_trade_trade_setting_futures_settlement_currency_index_5101420`}</div>
        <div className="value">
          <label>{contractPreference?.clearCoinSymbol}</label>
          <Icon name="next_arrow" hasTheme />
        </div>
      </div>

      <FuturesSettlementCurrencyPopUp visible={visible} setVisible={setVisible} hasCloseIcon />
    </>
  )
}

export default FuturesSettlementCurrencySetting

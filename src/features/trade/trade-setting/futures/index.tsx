import { useEffect } from 'react'
import { t } from '@lingui/macro'
import FuturesMarginCurrencySetting from '@/features/trade/trade-setting/futures/margin-currency'
import FuturesSpreadProtectionSetting from '@/features/trade/trade-setting/futures/spread-protection'
import FuturesAutomaticMarginCallSetting from '@/features/trade/trade-setting/futures/automatic-margin-call'
import FuturesSettlementCurrencySetting from '@/features/trade/trade-setting/futures/settlement-currency'
import FuturesVersionSetting from '@/features/trade/trade-setting/futures/version'
import FuturesMarginWithdrawal from '@/features/trade/trade-setting/futures/margin-withdrawal'
import FuturesAdditionalMargin from '@/features/trade/trade-setting/futures/additional-margin'
import FuturesAutomaticCloseIsolatedPositions from '@/features/trade/trade-setting/futures/automatic-close-isolated-positions'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import { UserContractVersionEnum } from '@/constants/user'
import Styles from '../index.module.css'
/** 成功回调 */
function TradeFuturesSetting({ visible, onSuccess }: { visible: boolean; onSuccess?(isTrue: boolean): void }) {
  const { contractPreference, getContractPreference } = useContractPreferencesStore()

  useEffect(() => {
    visible && getContractPreference()
  }, [visible])

  return visible ? (
    <div className={Styles['trade-setting-main-wrap']}>
      <div className="list-wrap">
        <div className="title line">{t`features_trade_trade_setting_index_5101419`}</div>

        <FuturesVersionSetting />

        <FuturesMarginCurrencySetting />

        <FuturesSettlementCurrencySetting />

        {contractPreference.perpetualVersion === UserContractVersionEnum.professional && (
          <>
            <FuturesMarginWithdrawal />

            <FuturesAdditionalMargin />
          </>
        )}

        <FuturesAutomaticCloseIsolatedPositions />

        <FuturesSpreadProtectionSetting />

        {contractPreference.perpetualVersion === UserContractVersionEnum.professional && (
          <FuturesAutomaticMarginCallSetting onSuccess={onSuccess} />
        )}
      </div>
    </div>
  ) : null
}

export default TradeFuturesSetting

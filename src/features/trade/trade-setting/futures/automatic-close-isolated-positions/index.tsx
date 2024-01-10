import { Switch, Tooltip } from '@nbit/arco'
import { t } from '@lingui/macro'
import { UserOpenEnum } from '@/constants/user'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import Icon from '@/components/icon'

function FuturesAutomaticCloseIsolatedPositions() {
  const { contractPreference, updateContractPreference } = useContractPreferencesStore()

  /** 开启或关闭无保证金逐仓 */
  const handleIsolatedMarginWithoutMargin = (isTrue: boolean) => {
    updateContractPreference({ autoCloseIsolatedPosition: isTrue ? UserOpenEnum.open : UserOpenEnum.close })
  }

  return (
    <div className="list">
      <div className="label">
        {t`features_trade_trade_setting_futures_automatic_close_isolated_positions_index_sa9w6nwdb8lprdewqwbov`}
        <Tooltip
          content={t`features_trade_trade_setting_futures_automatic_close_isolated_positions_index_ik9vmxjiw3xyfh6i20w3n`}
        >
          <span className="tips-icon">
            <Icon name="msg" hasTheme />
          </span>
        </Tooltip>
      </div>
      <div className="value">
        <Switch
          checked={contractPreference.autoCloseIsolatedPosition === UserOpenEnum.open}
          onChange={handleIsolatedMarginWithoutMargin}
        />
      </div>
    </div>
  )
}

export default FuturesAutomaticCloseIsolatedPositions

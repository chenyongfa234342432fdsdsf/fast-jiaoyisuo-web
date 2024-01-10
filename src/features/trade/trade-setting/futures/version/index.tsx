import { useState } from 'react'
import { t } from '@lingui/macro'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import { UserContractVersionEnum } from '@/constants/user'
import FuturesVersionPopUp from '@/features/trade/trade-setting/futures/version/popup'
import Icon from '@/components/icon'

function FuturesVersionSetting() {
  const [visible, setVisible] = useState<boolean>(false)

  const contractPreferenceStore = useContractPreferencesStore()
  const { perpetualVersion } = contractPreferenceStore.contractPreference

  return (
    <>
      <div className="list" onClick={() => setVisible(true)}>
        <div className="label">{t`features_trade_trade_setting_futures_version_index_5101413`}</div>
        <div className="value">
          <label>
            {perpetualVersion === UserContractVersionEnum.base
              ? t`features_trade_trade_setting_futures_version_index_5101408`
              : t`features_trade_trade_setting_futures_version_index_5101402`}
          </label>
          <Icon name="next_arrow" hasTheme />
        </div>
      </div>

      <FuturesVersionPopUp visible={visible} setVisible={setVisible} hasCloseIcon />
    </>
  )
}

export default FuturesVersionSetting

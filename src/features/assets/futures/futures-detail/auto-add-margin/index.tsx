import { useState } from 'react'
import { Switch } from '@nbit/arco'
import { t } from '@lingui/macro'
import { UserEnableEnum } from '@/constants/user'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import FuturesAutomaticMarginCallDrawer from '@/features/trade/trade-setting/futures/automatic-margin-call/sidebar'
import UserPopUp from '@/features/user/components/popup'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'
import Icon from '@/components/icon'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import styles from './index.module.css'

function AutoAddMarginSetting({ onAutoAddMargin }: { onAutoAddMargin: () => void }) {
  const [visible, setVisible] = useState<boolean>(false)
  const [settingVisible, setSettingVisible] = useState<boolean>(false)

  const { contractPreference } = useContractPreferencesStore()
  const assetsFuturesStore = useAssetsFuturesStore()
  const { futuresDetails } = { ...assetsFuturesStore }
  /** 开启或关闭自动追加保证金 */
  const handleAutomaticMarginCall = () => {
    onAutoAddMargin && onAutoAddMargin()
  }

  const handleToSetting = () => {
    setVisible(false)
    setSettingVisible(true)
  }

  return (
    <>
      <div className={styles.scoped}>
        <div className="label">{t`features/trade/trade-order/base-7`}</div>
        <div className="value">
          {contractPreference.isAutoAdd === UserEnableEnum.yes && (
            <label className="detail" onClick={() => setSettingVisible(true)}>
              {t`features_announcement_bulletin_board_index_5101190`} &gt;
            </label>
          )}
          <Switch
            className={'ml-8 '}
            checked={futuresDetails.isAutoAdd === UserEnableEnum.yes}
            onChange={handleAutomaticMarginCall}
          />
        </div>
      </div>
      <FuturesAutomaticMarginCallDrawer maskShow visible={settingVisible} setVisible={setSettingVisible} />
      <UserPopUp
        className="user-popup"
        visible={visible}
        autoFocus={false}
        closeIcon={<Icon name="close" hasTheme />}
        okText={t`user.account_security.google_01`}
        cancelText={t`features_trade_trade_setting_futures_automatic_margin_call_index_5101374`}
        onOk={handleToSetting}
        onCancel={() => setVisible(false)}
      >
        <UserPopupTipsContent
          slotContent={<p>{t`features_trade_trade_setting_futures_automatic_margin_call_index_5101375`}</p>}
        />
      </UserPopUp>
    </>
  )
}

export default AutoAddMarginSetting

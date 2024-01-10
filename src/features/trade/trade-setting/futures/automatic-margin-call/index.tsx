import { useState } from 'react'
import { Switch } from '@nbit/arco'
import { t } from '@lingui/macro'
import UserPopUp from '@/features/user/components/popup'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'
import { UserEnableEnum } from '@/constants/user'
import { useUserStore } from '@/store/user'
import { useContractPreferencesStore } from '@/store/user/contract-preferences'
import FuturesAutomaticMarginCallDrawer from '@/features/trade/trade-setting/futures/automatic-margin-call/sidebar'
import Icon from '@/components/icon'

function FuturesAutomaticMarginCallSetting({ onSuccess }: { onSuccess?(isTrue: boolean): void }) {
  const [visible, setVisible] = useState<boolean>(false)
  const [settingVisible, setSettingVisible] = useState<boolean>(false)

  const useStore = useUserStore()
  const { contractPreference, updateContractPreference } = useContractPreferencesStore()

  const { personalCenterSettings } = useStore

  /** 开启或关闭自动追加保证金 */
  const handleEnbleAutomaticMarginCall = (isTrue: boolean) => {
    if (isTrue && personalCenterSettings.automaticMarginCall === UserEnableEnum.no) setVisible(true)
    updateContractPreference({ isAutoAdd: isTrue ? UserEnableEnum.yes : UserEnableEnum.no })
  }

  const handleToSettins = () => {
    setVisible(false)
    setSettingVisible(true)
  }

  return (
    <>
      <div className="list">
        <div
          className="label"
          style={{ borderBottom: '1px dashed var(--text_color_03)' }}
        >{t`features/trade/trade-order/base-7`}</div>
        <div className="value">
          {contractPreference.isAutoAdd === UserEnableEnum.yes && (
            <label
              className="text-brand_color mr-2 cursor-pointer"
              onClick={() => setSettingVisible(true)}
            >{t`features_trade_trade_setting_futures_automatic_margin_call_index_ulwsuruxn8hipeqrun5w7`}</label>
          )}
          <Switch
            checked={contractPreference.isAutoAdd === UserEnableEnum.yes}
            onChange={handleEnbleAutomaticMarginCall}
          />
        </div>
      </div>

      <FuturesAutomaticMarginCallDrawer visible={settingVisible} setVisible={setSettingVisible} onSuccess={onSuccess} />

      <UserPopUp
        className="user-popup"
        visible={visible}
        autoFocus={false}
        closeIcon={<Icon name="close" hasTheme />}
        okText={t`user.account_security.google_01`}
        cancelText={t`features_trade_trade_setting_futures_automatic_margin_call_index_5101374`}
        onOk={handleToSettins}
        onCancel={() => setVisible(false)}
      >
        <UserPopupTipsContent
          slotContent={<p>{t`features_trade_trade_setting_futures_automatic_margin_call_index_5101375`}</p>}
        />
      </UserPopUp>
    </>
  )
}

export default FuturesAutomaticMarginCallSetting

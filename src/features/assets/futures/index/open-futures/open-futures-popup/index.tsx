/**
 * 合约 - 开通合约账户
 */
import { useState } from 'react'
import { t } from '@lingui/macro'
import FuturesMarginCurrencyPopUp from '@/features/trade/trade-setting/futures/margin-currency/popup'
import FuturesSettlementCurrencyPopUp from '@/features/trade/trade-setting/futures/settlement-currency/popup'
import FuturesVersionPopUp from '@/features/trade/trade-setting/futures/version/popup'
import { getMemberBaseSettingsInfo } from '@/apis/user'
import { baseUserStore, useUserStore } from '@/store/user'

interface OpenFuturesPopupProps {
  visible: boolean
  setVisible: (boolean) => void
  onSuccess?: () => void
  onError?: () => void
}
export default function OpenFuturesPopup(props: OpenFuturesPopupProps) {
  const { visible, setVisible, onSuccess } = props || {}
  const [futuresSettlementCurrencyVisible, setFuturesSettlementCurrencyVisible] = useState<boolean>(false)
  const [futuresVersionVisible, setFuturesVersionVisible] = useState<boolean>(false)
  const userStore = useUserStore()

  const { setUserInfo } = userStore
  const { userInfo: _userInfo } = baseUserStore.getState()

  function onOpenSuccess() {
    onSuccess && onSuccess()
    getMemberBaseSettingsInfo({}).then(res => {
      if (res.isOk) {
        setUserInfo({ ..._userInfo, ...res?.data })
      }
    })
  }

  return (
    <>
      <FuturesMarginCurrencyPopUp
        visible={visible}
        setVisible={setVisible}
        hasCloseIcon
        isOpenContract
        buttonText={t`user.field.reuse_23`}
        onSuccess={() => setFuturesSettlementCurrencyVisible(true)}
      />
      <FuturesSettlementCurrencyPopUp
        visible={futuresSettlementCurrencyVisible}
        setVisible={setFuturesSettlementCurrencyVisible}
        isOpenContract
        hasCloseIcon
        buttonText={t`user.field.reuse_23`}
        onSuccess={() => setFuturesVersionVisible(true)}
      />
      <FuturesVersionPopUp
        hasCloseIcon
        isOpenContract
        visible={futuresVersionVisible}
        setVisible={setFuturesVersionVisible}
        onSuccess={onOpenSuccess}
      />
    </>
  )
}

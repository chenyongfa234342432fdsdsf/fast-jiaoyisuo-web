import { getMemberUserInfo, getMemberBaseSettingsInfo } from '@/apis/user'
import { UserFuturesTradeStatus } from '@/constants/user'
import { useCheckFutures } from '@/hooks/features/trade'
import { useUserStore } from '@/store/user'
import { t } from '@lingui/macro'
import { Button, ButtonProps } from '@nbit/arco'
import { useState } from 'react'
import FuturesMarginCurrencyPopUp from '../trade-setting/futures/margin-currency/popup'
import FuturesSettlementCurrencyPopUp from '../trade-setting/futures/settlement-currency/popup'
import FuturesVersionPopUp from '../trade-setting/futures/version/popup'

type IOpenFutureProps = {
  triggerButtonProps?: ButtonProps
}

export function OpenFuture({ triggerButtonProps = {} }: IOpenFutureProps) {
  const { isLogin, userInfo, setUserInfo } = useUserStore()
  const [futuresCurrencyVisible, setFuturesCurrencyVisible] = useState<boolean>(false)
  const [futuresVersionVisible, setFuturesVersionVisible] = useState<boolean>(false)
  const [futuresSettlementCurrencyVisible, setFuturesSettlementCurrencyVisible] = useState<boolean>(false)
  const isOpenFutures = userInfo.isOpenContractStatus === UserFuturesTradeStatus.open
  const { openCheckFuturesModal } = useCheckFutures({ isOk: () => setFuturesCurrencyVisible(true) })
  function onOpenSuccess() {
    Promise.all([getMemberUserInfo({}), getMemberBaseSettingsInfo({})]).then(([userInfoRes, userSettingInfoRes]) => {
      if (userInfoRes.isOk && userSettingInfoRes.isOk) {
        setUserInfo({ ...(userInfoRes.data as any), ...(userSettingInfoRes?.data as any) })
      }
    })
  }
  if (!isLogin || isOpenFutures) {
    return null
  }

  return (
    <>
      <Button type="primary" onClick={openCheckFuturesModal} {...triggerButtonProps}>
        {t`features_trade_futures_trade_form_index_5101431`}
      </Button>
      <FuturesMarginCurrencyPopUp
        visible={futuresCurrencyVisible}
        setVisible={setFuturesCurrencyVisible}
        hasCloseIcon
        isOpenContract
        hasTips
        buttonText={t`user.field.reuse_23`}
        onSuccess={() => setFuturesSettlementCurrencyVisible(true)}
      />
      <FuturesSettlementCurrencyPopUp
        visible={futuresSettlementCurrencyVisible}
        setVisible={setFuturesSettlementCurrencyVisible}
        isOpenContract
        hasTips
        hasCloseIcon
        buttonText={t`user.field.reuse_23`}
        onSuccess={() => setFuturesVersionVisible(true)}
        hasCancelButton
        leftButtonText={t`features_kyc_kyc_company_statement_index_5101162`}
        onLeftButton={() => {
          setFuturesSettlementCurrencyVisible(false)
          setFuturesCurrencyVisible(true)
        }}
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

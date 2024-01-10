import C2CFooter from '@/features/c2c/trade/c2c-footer'
import C2CTab from '@/features/c2c/trade/c2c-tab'
import { useState, cloneElement, useRef } from 'react'
import { ShortcoinsPay } from '@/features/c2c/trade/c2c-trade'
import { YapiPostV1C2CCoinListData } from '@/typings/yapi/C2cCoinListV1PostApi.d'
import { YapiGetV1C2CAreaListData } from '@/typings/yapi/C2cAreaListV1GetApi.d'
import { usePaymentCodeVal } from '@/features/c2c/trade/free-trade/use-advert-code-val'
import { useGetIsLoginStatus } from '@/hooks/use-get-login-window-visible'
import { useC2CShortBuy } from './use-c2c-short-buy'
import styles from './index.module.css'

type ShowSubmitNums = {
  currencTrade: number
  currencyTradeResult: number
}

type C2CFooter = {
  setTradeTypeChange: (item: string) => void
}

export function Page() {
  const { showC2CTabComponents } = useC2CShortBuy()

  const { getPaymentCodeVal, getPaymentColorCodeVal } = usePaymentCodeVal()

  useGetIsLoginStatus()

  const [operateCutCoins, setOperateCutCoins] = useState<string>(ShortcoinsPay.HomePageCutCoins)

  const [coinsType, setCoinsType] = useState<string>('PurChase')

  const [orderPurchaseType, setPurchaseOrderType] = useState<string>('NUMBER')

  const [orderSellType, setSellOrderType] = useState<string>('NUMBER')

  const [showSubmitNums, setShowSubmitNums] = useState<ShowSubmitNums>({ currencTrade: 0, currencyTradeResult: 0 })

  const [handleCoinsTypeReturn, setHandleCoinsType] = useState<YapiPostV1C2CCoinListData>()

  const [handleAreaTypeReturn, setHandleAreaType] = useState<YapiGetV1C2CAreaListData>()

  const c2cFooterRef = useRef<C2CFooter>()

  const setOperateChange = item => {
    setOperateCutCoins(item)
  }

  const setShowSubmitNumsChange = item => {
    setShowSubmitNums(item)
  }

  const onTradeChange = e => {
    c2cFooterRef.current?.setTradeTypeChange(e)
    setCoinsType(e)
  }

  const setOrderPurchaseTypeChange = e => {
    setPurchaseOrderType(e)
  }

  const setSellOrderTypeChange = e => {
    setSellOrderType(e)
  }

  const setHandleCoinsTypeFn = item => {
    setHandleCoinsType(item)
  }

  const setHandleAreaTypeFn = item => {
    setHandleAreaType(item)
  }

  const getCloneElementParams = () => {
    const params = {
      setOperateChange,
      showSubmitNums,
      setShowSubmitNumsChange,
      handleCoinsTypeReturn,
      handleAreaTypeReturn,
      setSellOrderTypeChange,
      getPaymentCodeVal,
      setOrderPurchaseTypeChange,
      orderType: coinsType === 'PurChase' ? orderPurchaseType : orderSellType,
      getPaymentColorCodeVal,
    }
    return operateCutCoins === ShortcoinsPay.HomePageCutCoins
      ? {
          ...params,
          coinsType,
          onTradeChange,
          setHandleCoinsTypeFn,
          setHandleAreaTypeFn,
        }
      : params
  }

  return (
    <div className={styles.scoped}>
      <C2CTab activeTab="ShortcutCoins">
        {cloneElement(showC2CTabComponents[operateCutCoins], {
          ...getCloneElementParams(),
        })}
      </C2CTab>
      {operateCutCoins === ShortcoinsPay.HomePageCutCoins && (
        <C2CFooter ref={c2cFooterRef} onTradeChange={onTradeChange} />
      )}
    </div>
  )
}

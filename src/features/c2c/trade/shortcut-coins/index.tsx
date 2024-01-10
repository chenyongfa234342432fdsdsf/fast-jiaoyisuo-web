import { useState, memo, useRef, useEffect, useCallback } from 'react'
import { Radio, FormInstance, Form, Input, Select, Spin, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import cn from 'classnames'
import { useMount, useUpdateEffect, useUnmount, useDebounceFn } from 'ahooks'
import LazyImage, { Type } from '@/components/lazy-image'
import { debounce, set } from 'lodash'
import Icon from '@/components/icon'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { formatCurrency, formatNumberDecimal } from '@/helper/decimal'
import { getQuickTransaction, getQuickSellTransaction, getBestPrice } from '@/apis/c2c/c2c-trade'
import './shortcutcoins.module.css'
import { useUserStore } from '@/store/user'
import { ShortcoinsPay, isPassThrough, ReturnFreeTradeTip, AdvertDirectCds } from '@/features/c2c/trade/c2c-trade'
import { useRiskStatement } from '@/features/c2c/trade/free-trade/use-risk-statement'
import { FreeTradeTipModalType } from '@/features/c2c/trade/free-trade/use-free-trade'
import { useC2CStore } from '@/store/c2c'
import { link } from '@/helper/link'
import { getC2CCenterPagePath, getKycPageRoutePath, getC2cOrderShortPageRoutePath } from '@/helper/route'
import { decimalUtils } from '@nbit/utils'
import { useOverscrollBehavior } from '@/hooks/use-overscroll-behavior'
import { YapiPostV1C2CCoinListData } from '@/typings/yapi/C2cCoinListV1PostApi.d'
import { YapiGetV1C2CAreaListData } from '@/typings/yapi/C2cAreaListV1GetApi.d'
import { YapiPostV1C2CQuickTransactionBuyCurrencyListData } from '@/typings/yapi/C2cQuickTransactionBuyCurrencyV1PostApi'
import { YapiPostV1C2CQuickTransactionSellCurrencyListData } from '@/typings/yapi/C2cQuickTransactionSellCurrencyV1PostApi.d'
import FreeTradeTipModal from '@/features/c2c/trade/free-trade/free-tradetip-modal'
import { postV1OtcGetChannelsApiRequest } from '@/apis/otc'
import CoinSelect from '../c2c-select/coin-select'
import { useShortCoins } from './shortcutcoins'
import ShorcutCoinsModal from './shorcut-coins-modal'

type YapiGetV1C2CAreaListDataParams = YapiGetV1C2CAreaListData & { hasCoins: boolean }

type ShowSubmitNums = {
  currencTrade: number
  currencyTradeResult: number
  currencyList: YapiPostV1C2CQuickTransactionBuyCurrencyListData[] | YapiPostV1C2CQuickTransactionSellCurrencyListData[]
}

type OverAvailableBalanceLimit = {
  text?: string
  status: boolean
}

type Props = {
  setOperateChange?: (item: string) => void
  setShowSubmitNumsChange?: (item: ShowSubmitNums) => void
  coinsType: string
  orderType?: string
  onTradeChange?: (item: string) => void
  setOrderPurchaseTypeChange?: (item: string) => void
  setSellOrderTypeChange?: (item: string) => void
  handleCoinsTypeReturn?: YapiPostV1C2CCoinListData
  handleAreaTypeReturn?: YapiGetV1C2CAreaListData
  setHandleCoinsTypeFn?: (item: Record<'PurChase' | 'Sell', YapiPostV1C2CCoinListData>) => void
  setHandleAreaTypeFn?: (item: Record<'PurChase' | 'Sell', YapiGetV1C2CAreaListData>) => void
}

const Option = Select.Option

const SafeCalcUtil = decimalUtils.SafeCalcUtil

function ShortcutCoins(props: Props) {
  const {
    setOperateChange,
    setShowSubmitNumsChange,
    coinsType,
    onTradeChange,
    handleCoinsTypeReturn,
    handleAreaTypeReturn,
    setHandleCoinsTypeFn,
    setHandleAreaTypeFn,
    setOrderPurchaseTypeChange,
    setSellOrderTypeChange,
    orderType,
  } = props || {}

  const { c2cTrade, getC2CAreaCoinPayList, getC2CAreaPayList, getTransactionPayRate, clearc2cCoinAndAreaList } =
    useC2CStore()

  useOverscrollBehavior()

  const isLogin = useUserStore()?.isLogin

  const { c2cAreaList, transactionPayRate, c2cCoinList } = c2cTrade

  const freeTradeTipModalRef = useRef<FreeTradeTipModalType>(null)

  const formRef = useRef<FormInstance>(null)

  const c2cTradeRef = useRef<string>()

  c2cTradeRef.current = coinsType

  const shorcutCoinsModalFormRef = useRef<Record<'openCoinsPayvisibleModal', (item?: boolean) => void>>()

  const { getShortcuCoinsType, getShortCoinsHandle } = useShortCoins()

  const { isRiskTip, setRiskStatement, freeTradeTip } = useRiskStatement(freeTradeTipModalRef, undefined, isLogin)

  const showShortCoinsHandle = getShortCoinsHandle()[coinsType as string]

  const [c2cAreaSelectList, setC2CAreaSelectList] = useState<YapiGetV1C2CAreaListData[]>([])

  const [c2cCoinSelectList, setC2CCoinSelectList] = useState<YapiPostV1C2CCoinListData[]>([])

  const handleCoinsTypeRef = useRef<Record<'PurChase' | 'Sell', YapiPostV1C2CCoinListData>>()

  const handleAreaTypeRef = useRef<Record<'PurChase' | 'Sell', YapiGetV1C2CAreaListData>>()

  const [handleCoinsType, setHandleCoinsType] = useState<Record<'PurChase' | 'Sell', YapiPostV1C2CCoinListData>>({
    PurChase: {} as YapiPostV1C2CCoinListData,
    Sell: {} as YapiPostV1C2CCoinListData,
  })

  const [handleAreaType, setHandleAreaType] = useState<Record<'PurChase' | 'Sell', YapiGetV1C2CAreaListData>>({
    PurChase: c2cAreaList[0] || {},
    Sell: c2cAreaList[0] || {},
  })

  const [overstepLimit, setOverstepLimit] = useState<boolean>(false)

  const [overAvailableBalance, setOverAvailableBalance] = useState<boolean>(false)

  const [contentTips, setContentTips] = useState<string>('')

  const [shortcutCoinsLoading, setShortcutCoinsLoading] = useState<boolean>(false)

  const [showBestPrice, setShowBestPrice] = useState<number>(0)

  const [showBestPriceButton, setShowBestPriceButton] = useState<boolean>(true)

  const [overAvailableBalanceLimit, setOverAvailableBalanceLimit] = useState<OverAvailableBalanceLimit>({
    status: false,
  })

  const [areaPaySearchKey, setAreaPaySearchKey] = useState<string>('')

  const [areaCoinSearchKey, setCoinPaySearchKey] = useState<string>('')

  const [isPassStatus, setIsPassStatus] = useState<boolean | undefined>(true)

  const [kycText, setKycText] = useState<string>()

  const [showTransactionPayRate, setShowTransactionPayRate] = useState<Record<'PurChase' | 'Sell', string>>({
    PurChase: '',
    Sell: '',
  })

  const getTransactionPayRateChange = async () => {
    const { getFieldValue } = formRef.current || {}
    const buySymbol = handleCoinsType?.[coinsType]?.coinName
    const paySymbol = handleAreaType?.[coinsType]?.currencyName
    const areaId = handleAreaType?.[coinsType]?.legalCurrencyId
    const amount = getFieldValue && getFieldValue(showShortCoinsHandle.fieldBuy)
    if (!amount && buySymbol && areaId && paySymbol && !isLogin) {
      const res = await getTransactionPayRate({
        buySymbol,
        paySymbol,
        areaId,
      })
      if (Object.values(showTransactionPayRate).filter(item => item).length > 0) {
        setShowTransactionPayRate({ ...showTransactionPayRate, [coinsType]: res?.rate })
      } else {
        setShowTransactionPayRate({ PurChase: res?.rate, Sell: res?.rate })
      }
    }
  }

  const getC2CAreaCoinPayListRequest = (areaIds, searchKey = '') => {
    getC2CAreaCoinPayList({
      areaIds,
      searchKey,
      isQuickTrade: true,
      side: coinsType === 'PurChase' ? AdvertDirectCds.BUY : AdvertDirectCds.SELL,
    })
  }

  const setHandleCoinsTypeChange = key => {
    const item = c2cCoinList.find(coinitem => coinitem?.id === key)
    setHandleCoinsType({ ...handleCoinsType, [coinsType]: item })
    handleCoinsTypeRef.current = { ...handleCoinsType, [coinsType]: item }
    getBestPriceChangeAmout(item)
  }

  const setHandleAreaTypeChange = key => {
    const item = c2cAreaList.find(areaitem => areaitem?.legalCurrencyId === key)
    getC2CAreaCoinPayListRequest([item?.legalCurrencyId])
    setRiskStatement(item?.areaRiskWarn)
    isRiskTip(item?.currencyName, item?.areaRiskWarn)
    setHandleAreaType({ ...handleAreaType, [coinsType]: item })
    handleAreaTypeRef.current = { ...handleAreaType, [coinsType]: item }
    getBestPriceChangePrice(undefined, item)
  }

  const setFormatNumber = (item, type) => {
    const formatterNum = String(item)
      ?.replace(/[^\d.]+/g, '')
      ?.replace(/(\..*)\./g, '$1')

    const handleCoinsTypeLength = handleCoinsTypeRef.current?.[coinsType]?.trade_precision
    const handleAreaTypeLength = handleAreaTypeRef.current?.[coinsType]?.precision
    const juageNumberType = type === 'Number' ? Number(handleCoinsTypeLength) : Number(handleAreaTypeLength)
    if (formatterNum?.split('.')?.[1]?.length > juageNumberType && type) {
      return formatNumberDecimal(formatterNum, type === 'Number' ? handleCoinsTypeLength : handleAreaTypeLength)
    } else {
      return formatterNum
    }
  }

  const getBestPriceChange = async (
    amount?: string,
    handleCoinsTypeParams?: YapiPostV1C2CCoinListData,
    handleAreaTypeParams?: YapiGetV1C2CAreaListData,
    quoteAmount?: string,
    type = 'quantity'
  ) => {
    const coinId = handleCoinsTypeParams?.id || handleCoinsType?.[coinsType]?.id
    const areaId = handleAreaTypeParams?.legalCurrencyId || handleAreaType?.[coinsType]?.legalCurrencyId

    if (isLogin && coinId && areaId) {
      setShortcutCoinsLoading(true)
      const { isOk, data, code } = await getBestPrice({
        side: coinsType === 'PurChase' ? AdvertDirectCds.BUY : AdvertDirectCds.SELL,
        coinId,
        areaId,
        amount,
        type,
        quoteAmount,
        isSupportOtc: true,
      })

      if (code === 10109014) {
        setShowBestPriceButton(false)
      }

      if (isOk) {
        setShowBestPriceButton(true)
      }
      setShowBestPrice(data?.price)
      setShortcutCoinsLoading(false)
      return { isOk, data }
    } else {
      if (isLogin)
        return {
          isOk: false,
        }
      if (handleCoinsTypeParams || handleAreaTypeParams) {
        const data = await getTransactionPayRate({
          buySymbol: handleCoinsTypeParams?.coinName || handleCoinsType?.[coinsType]?.coinName,
          paySymbol: handleAreaTypeParams?.currencyName || handleAreaType?.[coinsType]?.currencyName,
          areaId: handleAreaTypeParams?.legalCurrencyId || handleAreaType?.[coinsType]?.legalCurrencyId,
        })

        setShowTransactionPayRate({ ...showTransactionPayRate, [coinsType]: data?.rate })
        return { isOk: true, data: { price: data?.rate } }
      } else {
        return { isOk: true, data: { price: transactionPayRate } }
      }
    }
  }

  const getJadgeErrorValues = () => {
    const { getFieldValue } = formRef.current || {}
    if (getFieldValue) {
      return getFieldValue(showShortCoinsHandle.fieldBuy) || getFieldValue(showShortCoinsHandle.fieldSell)
    }
  }

  const getBestPriceChangeAmout = debounce(
    async (handleCoinsTypeParams?: YapiPostV1C2CCoinListData, handleAreaTypeParams?: YapiGetV1C2CAreaListData) => {
      const { getFieldValue, setFieldsValue, validate } = formRef.current || {}
      const amount = setFormatNumber(getFieldValue && getFieldValue(showShortCoinsHandle.fieldBuy), 'Number')

      if (Number(amount) <= 0 || !amount) {
        setFieldsValue &&
          setFieldsValue({
            [showShortCoinsHandle.fieldBuy]: amount,
            [showShortCoinsHandle.fieldSell]: undefined,
          })
        getBestPriceChange(amount, handleCoinsTypeParams, handleAreaTypeParams, undefined, 'quantity')
        getJadgeErrorValues() && validate && validate()
        return
      }

      const { isOk, data } = await getBestPriceChange(
        amount,
        handleCoinsTypeParams,
        handleAreaTypeParams,
        undefined,
        'quantity'
      )

      if (isOk && setFieldsValue && getFieldValue && validate) {
        setFieldsValue({
          [showShortCoinsHandle.fieldSell]: Number(SafeCalcUtil.mul(amount, data?.price)),
        })
      } else {
        setFieldsValue &&
          setFieldsValue({
            [showShortCoinsHandle.fieldSell]: undefined,
          })
        setShowBestPrice(0)
      }
      if (c2cTradeRef.current === coinsType) {
        getJadgeErrorValues() && validate && validate()
      }
    },
    300
  )

  useEffect(() => {
    if (c2cAreaList.length > 0) {
      const { areaRiskWarn, currencyName } = c2cAreaList[0] || {}
      setRiskStatement(areaRiskWarn)
      isRiskTip(currencyName, areaRiskWarn)
    }
  }, [c2cAreaList])

  useUpdateEffect(() => {
    handleCoinsType?.[coinsType] && getTransactionPayRateChange()
  }, [handleAreaType, isLogin])

  useUpdateEffect(() => {
    getTransactionPayRateChange()
  }, [handleCoinsType])

  useEffect(() => {
    const showC2CCoinList = c2cCoinList?.filter(item => item?.id === handleCoinsType?.[coinsType]?.id)
    const showC2CCoinDefautList = c2cCoinList?.filter(item => item?.defaultShow)

    if (Object.values(handleCoinsType)?.flat()?.length > 0) {
      if (c2cCoinList?.length > 0) {
        const coinsTypeValue = { ...handleCoinsType, [coinsType]: showC2CCoinList?.[0] || showC2CCoinDefautList?.[0] }
        setHandleCoinsType(coinsTypeValue)
        handleCoinsTypeRef.current = coinsTypeValue
      } else {
        setHandleCoinsType({ ...handleCoinsType, [coinsType]: {} })
        handleCoinsTypeRef.current = { ...handleCoinsType, [coinsType]: {} }
      }
    } else {
      if (c2cCoinList?.length > 0) {
        const coinsTypeValueInitail = { PurChase: showC2CCoinList?.[0], Sell: showC2CCoinList?.[0] }
        setHandleCoinsType(coinsTypeValueInitail)
        handleCoinsTypeRef.current = coinsTypeValueInitail
      } else {
        setHandleCoinsType({ PurChase: {}, Sell: {} })
        handleCoinsTypeRef.current = { PurChase: {}, Sell: {} }
      }
    }
    setC2CCoinSelectList(c2cCoinList)
  }, [c2cCoinList, coinsType])

  useEffect(() => {
    if (
      c2cAreaList.length > 0 &&
      handleAreaType?.[coinsType] &&
      Object.values(handleAreaType?.[coinsType]).length === 0
    ) {
      const initialc2cArea = { PurChase: c2cAreaList[0], Sell: c2cAreaList[0] }
      setHandleAreaType(initialc2cArea)
      handleAreaTypeRef.current = initialc2cArea
      getC2CAreaCoinPayList({
        areaIds: [c2cAreaList[0]?.legalCurrencyId],
        searchKey: '',
        isQuickTrade: true,
        side: AdvertDirectCds.BUY,
      })
      setC2CAreaSelectList(c2cAreaList)
    }
  }, [c2cAreaList])

  const setOperateChangeJudge = () => {
    const operate = coinsType === 'PurChase' ? ShortcoinsPay.C2CCoinspayBuy : ShortcoinsPay.C2CCoinspaySell
    setOperateChange && setOperateChange(operate)
  }

  const getBestPriceChangePrice = debounce(
    async (handleCoinsTypeParams?: YapiPostV1C2CCoinListData, handleAreaTypeParams?: YapiGetV1C2CAreaListData) => {
      const { getFieldValue, setFieldsValue, validate } = formRef.current || {}
      const quoteAmount = setFormatNumber(getFieldValue && getFieldValue(showShortCoinsHandle.fieldSell), 'TOTAL_PRICE')

      if (Number(quoteAmount) <= 0 || !quoteAmount) {
        setFieldsValue &&
          setFieldsValue({
            [showShortCoinsHandle.fieldBuy]: undefined,
            [showShortCoinsHandle.fieldSell]: quoteAmount,
          })
        getBestPriceChange(undefined, handleCoinsTypeParams, handleAreaTypeParams, quoteAmount, 'amount')
        getJadgeErrorValues() && validate && validate()
        return
      }

      const { isOk, data } = await getBestPriceChange(
        undefined,
        handleCoinsTypeParams,
        handleAreaTypeParams,
        quoteAmount,
        'amount'
      )
      if (isOk && setFieldsValue && getFieldValue && validate) {
        setFieldsValue({
          [showShortCoinsHandle.fieldBuy]: Number(SafeCalcUtil.div(quoteAmount, data?.price)),
        })
      } else {
        setFieldsValue &&
          setFieldsValue({
            [showShortCoinsHandle.fieldBuy]: undefined,
          })
        setShowBestPrice(0)
      }
      if (c2cTradeRef.current === coinsType) {
        getJadgeErrorValues() && validate && validate([showShortCoinsHandle.fieldBuy])
      }
      setShortcutCoinsLoading(false)
    },
    300
  )

  const getCodeContentTips = code => {
    return {
      10106001: () => {
        setContentTips(
          t({
            id: 'features_c2c_trade_free_trade_index_poyrvytidj8eomuv1_rch',
            values: { 0: kycText },
          })
        )
        shorcutCoinsModalFormRef.current?.openCoinsPayvisibleModal()
      },
      10106003: () => {
        setContentTips(t`features_c2c_trade_free_trade_index_hrwoun2opmjrntb3cn1bp`)
        shorcutCoinsModalFormRef.current?.openCoinsPayvisibleModal(true)
      },
      10109006: () => {
        setContentTips(t`features_c2c_trade_shortcut_coins_index_z3ylwqemaffvex81ycn8k`)
        shorcutCoinsModalFormRef.current?.openCoinsPayvisibleModal()
      },
      10109007: () => {
        setContentTips(t`features_c2c_trade_shortcut_coins_index_oyf5kjnbmn3ss7s1wjdmx`)
        shorcutCoinsModalFormRef.current?.openCoinsPayvisibleModal()
      },
    }[code]
  }

  const getRequestParams = res => {
    return orderType === 'NUMBER'
      ? {
          typeCd: orderType,
          number: Number(setFormatNumber(res[showShortCoinsHandle.fieldBuy], false)),
        }
      : {
          typeCd: orderType as string,
          totalPrice: Number(setFormatNumber(res[showShortCoinsHandle.fieldSell], false)),
        }
  }

  const getQuickTransactionPay = async res => {
    const requestParams = getRequestParams(res)

    Promise.all([
      getQuickTransaction({
        // isSupportOtc: true,
        coinId: handleCoinsType?.[coinsType]?.id,
        areaId: handleAreaTypeReturn?.[coinsType]?.legalCurrencyId || handleAreaType?.[coinsType]?.legalCurrencyId,
        ...requestParams,
      }),
      // postV1OtcGetChannelsApiRequest({
      //   direction: AdvertDirectCds.BUY,
      //   cryptoAmount: requestParams.number?.toString(),
      //   fiatCurrency:
      //     handleAreaTypeReturn?.[coinsType]?.currencyName || handleAreaType?.[coinsType]?.currencyName || '',
      //   cryptoCurrency: handleCoinsType?.[coinsType]?.coinName || '',
      // }),
    ]).then(async ([_res]) => {
      const { isOk, data, code } = _res

      if (isOk && data?.length) {
        setShowSubmitNumsChange &&
          setShowSubmitNumsChange({
            currencTrade: Number(setFormatNumber(res[showShortCoinsHandle.fieldBuy], false)),
            currencyTradeResult: Number(setFormatNumber(res[showShortCoinsHandle.fieldSell], false)),
            currencyList: data,
          })

        setOperateChangeJudge()
        return
      }

      // if (!data?.length && res1.data?.length) {
      //   setShowSubmitNumsChange &&
      //     setShowSubmitNumsChange({
      //       currencTrade: Number(res1?.data?.[0]?.payments?.[0]?.cryptoAmount),
      //       currencyTradeResult: Number(res1?.data?.[0]?.payments?.[0]?.fiatAmount),
      //       currencyList: [],
      //     })
      //   setOperateChangeJudge()
      //   return
      // }

      // if (!data?.length && !res1.data?.length) {
      //   Message.error(res?.message || '')
      //   getCodeContentTips(code) && getCodeContentTips(code)?.()
      // }

      if (!data?.length) {
        Message.error(res?.message || '')
        getCodeContentTips(code) && getCodeContentTips(code)?.()
      }
    })
  }

  const getQuickTransactionSellPay = async res => {
    const coinId = handleCoinsType?.[coinsType]?.id
    const areaId = handleAreaTypeReturn?.[coinsType]?.legalCurrencyId || handleAreaType?.[coinsType]?.legalCurrencyId
    const number = res[showShortCoinsHandle.fieldBuy]

    const requestParams = getRequestParams(res)

    if (coinId && areaId && number) {
      Promise.all([
        getQuickSellTransaction({
          // isSupportOtc: true,
          coinId,
          areaId,
          ...requestParams,
        }),
        // postV1OtcGetChannelsApiRequest({
        //   direction: AdvertDirectCds.SELL,
        //   cryptoAmount: requestParams.number?.toString(),
        //   fiatCurrency:
        //     handleAreaTypeReturn?.[coinsType]?.currencyName || handleAreaType?.[coinsType]?.currencyName || '',
        //   cryptoCurrency: handleCoinsType?.[coinsType]?.coinName || '',
        // }),
      ]).then(async ([_res]) => {
        const { isOk, data, code } = _res

        if (isOk && data?.length) {
          setShowSubmitNumsChange &&
            setShowSubmitNumsChange({
              currencTrade: Number(setFormatNumber(number, false)),
              currencyTradeResult: Number(setFormatNumber(res[showShortCoinsHandle.fieldSell], false)),
              currencyList: data,
            })

          setOperateChangeJudge()
          return
        }

        // if (!data?.length && res1.data?.length) {
        //   setShowSubmitNumsChange &&
        //     setShowSubmitNumsChange({
        //       currencTrade: Number(res1?.data?.[0]?.payments?.[0]?.cryptoAmount),
        //       currencyTradeResult: Number(res1?.data?.[0]?.payments?.[0]?.fiatAmount),
        //       currencyList: [],
        //     })
        //   setOperateChangeJudge()
        //   return
        // }

        // if (!data?.length && !res1.data?.length) {
        if (!data?.length) {
          Message.error(res?.message || '')
          getCodeContentTips(code) && getCodeContentTips(code)?.()
        }
      })
    }
  }

  const setHandleCoinsButton = async () => {
    if (!isLogin) {
      link(`/login?redirect=${getC2cOrderShortPageRoutePath()}`)
      return
    }
    try {
      const res = await formRef.current?.validate()
      setHandleAreaTypeFn && setHandleAreaTypeFn(handleAreaType[coinsType])
      setHandleCoinsTypeFn && setHandleCoinsTypeFn(handleCoinsType[coinsType])
      coinsType === 'PurChase' ? getQuickTransactionPay(res) : getQuickTransactionSellPay(res)
    } catch (error) {
      console.log(error, 'errorerrorerrorerror')
    }
  }

  const renderFormatComponent = (currencyName, url, isTradingArea?: boolean) => {
    const imageParams = {
      whetherPlaceholdImg: false,
      src: url,
    }
    const lazyImageParams = isTradingArea ? set(imageParams, 'imageType', Type.png) : imageParams
    return (
      <div className="shortcut-short">
        <LazyImage className="shortcut-short-img" {...lazyImageParams} />
        <div> {currencyName}</div>
      </div>
    )
  }

  const setAreaChangeInput = searchKey => {
    setAreaPaySearchKey(searchKey)
  }

  const setCoinChangeInput = searchKey => {
    setCoinPaySearchKey(searchKey)
  }

  const getIsNotValidChange = () => {
    const { getFieldsValue, getFieldValue } = formRef.current || {}
    if (getFieldsValue && getFieldValue) {
      const isNotValid = Object.values(
        getFieldsValue([showShortCoinsHandle.fieldBuy, showShortCoinsHandle.fieldSell])
      ).some(item => item)
      return isNotValid
    }
  }

  useUpdateEffect(() => {
    isLogin && !getIsNotValidChange() && getBestPriceChange()
  }, [handleCoinsType, isLogin])

  useUpdateEffect(() => {
    const { getFieldsValue, validate, getFieldValue } = formRef.current || {}
    if (getFieldsValue && getFieldValue) {
      if (getIsNotValidChange()) {
        validate && validate([showShortCoinsHandle.fieldBuy, showShortCoinsHandle.fieldSell])
        const isBestPrice =
          getFieldValue(showShortCoinsHandle.fieldBuy) && getFieldValue(showShortCoinsHandle.fieldSell)
            ? orderType === 'NUMBER'
            : getFieldValue(showShortCoinsHandle.fieldBuy)
        isBestPrice ? getBestPriceChangeAmout({}) : getBestPriceChangePrice({})
      } else {
        !isLogin && getBestPriceChange()
      }
    }
    getC2CAreaCoinPayListRequest([handleAreaType?.[coinsType]?.legalCurrencyId])
  }, [coinsType])

  const setOnTradeChange = e => {
    getC2CAreaPayList({
      searchKey: areaPaySearchKey,
      side: e === 'PurChase' ? AdvertDirectCds.BUY : AdvertDirectCds.SELL,
    })
    setShowBestPriceButton(true)
    onTradeChange && onTradeChange(e)
  }

  const isSettingKycLevel = async () => {
    if (isLogin) {
      const { status, title } = (await isPassThrough()) || {}
      setIsPassStatus(status)
      setKycText(title)
    }
  }

  const setGotKyc = () => {
    link(getKycPageRoutePath())
  }

  useUnmount(() => {
    clearc2cCoinAndAreaList()
  })

  useMount(() => {
    getC2CAreaPayList({ searchKey: '', side: AdvertDirectCds.BUY })
    Promise.resolve((document.body.scrollTop = 0))
    isSettingKycLevel()
  })

  const getC2CAreaPayListChange = async searchKey => {
    const res = await getC2CAreaPayList({
      searchKey,
      side: coinsType === 'PurChase' ? AdvertDirectCds.BUY : AdvertDirectCds.SELL,
      showSelectList: true,
    })
    setC2CAreaSelectList(res || [])
  }

  const getC2CCoinPayListChange = async searchKey => {
    const res = await getC2CAreaCoinPayList({
      areaIds: [handleAreaType?.[coinsType]?.legalCurrencyId],
      searchKey,
      isQuickTrade: true,
      showSelectList: true,
      side: coinsType === 'PurChase' ? AdvertDirectCds.BUY : AdvertDirectCds.SELL,
    })
    setC2CCoinSelectList(res || [])
  }

  useUpdateEffect(() => {
    getC2CAreaPayListChange(areaPaySearchKey)
  }, [areaPaySearchKey])

  useUpdateEffect(() => {
    getC2CCoinPayListChange(areaCoinSearchKey)
  }, [areaCoinSearchKey])

  const onAreaVisibleChange = e => {
    !e && setAreaChangeInput('')
  }

  const onCoinVisibleChange = e => {
    !e && setCoinChangeInput('')
  }

  const getShortHandle = () => {
    return (
      <div className="shortcut-short-handle">
        <CoinSelect
          onChange={setHandleAreaTypeChange}
          setC2CChangeInput={setAreaChangeInput}
          renderFormat={item => {
            return item
              ? renderFormatComponent(
                  item?.extra.currencyName,
                  `${oss_area_code_image_domain_address}${item?.extra.countryAbbreviation}`,
                  true
                )
              : ''
          }}
          onVisibleChange={onAreaVisibleChange}
          // handleAreaTypeReturn?.[coinsType]?.legalCurrencyId ||
          value={handleAreaType?.[coinsType]?.legalCurrencyId}
          searchKeyValue={areaPaySearchKey}
        >
          {c2cAreaSelectList?.map(option => (
            <Option
              key={option.legalCurrencyId}
              disabled={option?.statusCd === 'DISABLE' || !(option as YapiGetV1C2CAreaListDataParams)?.hasCoins}
              value={option?.legalCurrencyId}
              extra={option}
            >
              <LazyImage
                className="select-img"
                src={`${oss_area_code_image_domain_address}${option?.countryAbbreviation}.png`}
              />
              <span className="select-text">{option.currencyName}</span>
            </Option>
          ))}
        </CoinSelect>
      </div>
    )
  }

  const getShortHandleRate = () => {
    return (
      <div className="shortcut-short-handle">
        <CoinSelect
          setC2CChangeInput={setCoinChangeInput}
          onChange={setHandleCoinsTypeChange}
          renderFormat={item => {
            return item ? renderFormatComponent(item?.extra.coinName, item?.extra.webLogo) : '--'
          }}
          onVisibleChange={onCoinVisibleChange}
          value={handleCoinsTypeReturn?.[coinsType]?.id || handleCoinsType?.[coinsType]?.id}
          searchKeyValue={areaCoinSearchKey}
        >
          {c2cCoinSelectList?.map(option => (
            <Option
              key={option.id}
              disabled={option?.statusCd === 'DISABLE'}
              value={option?.id as number}
              extra={option}
            >
              <LazyImage className="select-img" src={option?.webLogo as string} />
              <span className="select-text">{option.coinName}</span>
            </Option>
          ))}
        </CoinSelect>
      </div>
    )
  }

  const setPurChaseLimit = (value, callback) => {
    if (
      (handleCoinsType && Number(value) < Number(handleCoinsType?.[coinsType]?.minTransQuantity)) ||
      Number(value) > Number(handleCoinsType?.[coinsType]?.maxTransQuantity)
    ) {
      callback(true)
      setOverstepLimit(true)
    } else if (!value) {
      callback(true)
      setOverstepLimit(false)
    } else {
      setOverstepLimit(false)
    }
  }

  const setOverAvailableBalanceChange = (value, callback) => {
    if (handleCoinsType && Number(value) > Number(handleCoinsType?.[coinsType]?.balance)) {
      callback(true)
      setOverAvailableBalance(true)
      return
    } else if (!value) {
      callback(true)
      setOverAvailableBalance(false)
      setOverAvailableBalanceLimit({ status: false })
      return
    } else {
      setOverAvailableBalance(false)
    }

    if (handleCoinsType && Number(value) < Number(handleCoinsType?.[coinsType]?.minTransQuantity)) {
      callback(true)
      setOverAvailableBalanceLimit({
        status: true,
        text: t`features_c2c_trade_free_trade_free_placeorder_modal_index_gcrdnksnz09mwqigytatq`,
      })
    } else if (Number(value) > Number(handleCoinsType?.[coinsType]?.maxTransQuantity)) {
      setOverAvailableBalanceLimit({
        status: true,
        text: t`features_c2c_trade_free_trade_free_placeorder_modal_index_ovfjl05yole4tb3fwl9zg`,
      })
      callback(true)
    } else if (!value) {
      callback(true)
    } else {
      setOverAvailableBalanceLimit({
        status: false,
        text: t`features_c2c_trade_free_trade_free_placeorder_modal_index_ovfjl05yole4tb3fwl9zg`,
      })
    }
  }

  const setSellAllChange = () => {
    const { setFieldsValue, getFieldValue } = formRef.current || {}
    if (
      getFieldValue &&
      Number(handleCoinsType?.[coinsType]?.balance) === Number(getFieldValue(showShortCoinsHandle.fieldBuy))
    ) {
      return
    }
    setFieldsValue &&
      setFieldsValue({
        [showShortCoinsHandle.fieldBuy]: Number(handleCoinsType?.[coinsType]?.balance),
      })
    getBestPriceChangeAmout()
  }

  const setTransferChange = () => {
    link(getC2CCenterPagePath())
  }

  const _onShortcutCoinChange = useCallback(
    e => {
      // if (!setFormatNumber(Object.values(e)[0])) {
      //   return
      // }

      const { setFieldsValue, getFieldValue } = formRef.current || {}
      const coinKey = Object.keys(e)[0]

      if (setFieldsValue && getFieldValue && setOrderPurchaseTypeChange && setSellOrderTypeChange) {
        const setFieldsCoinValue = {
          currencTradePurChase: () => {
            getBestPriceChangeAmout()
            setOrderPurchaseTypeChange('NUMBER')
          },
          currencyTradeResultPurChase: () => {
            getBestPriceChangePrice()
            setOrderPurchaseTypeChange('TOTAL_PRICE')
          },
          currencyTradeResultSell: () => {
            getBestPriceChangePrice()
            setSellOrderTypeChange('TOTAL_PRICE')
          },
          currencTradeSell: () => {
            getBestPriceChangeAmout()
            setSellOrderTypeChange('NUMBER')
          },
        }
        setFieldsCoinValue[coinKey]?.()
      }
    },
    [getBestPriceChangeAmout, getBestPriceChangePrice, formRef.current]
  )

  const { run: onShortcutCoinChange } = useDebounceFn(
    e => {
      _onShortcutCoinChange(e)
    },
    {
      wait: 500,
    }
  )

  const getBestPriceChangeValues = () => {
    if (isLogin) {
      return showBestPrice ? formatNumberDecimal(showBestPrice, handleAreaType?.[coinsType]?.precision) : '--'
    } else {
      return showTransactionPayRate[coinsType]
    }
  }

  const setFormItemChange = () => {
    const formItem = [
      <div className={cn('short-handle-container', { 'c2c-coin-show-not': !c2cCoinList?.length })} key="purchase">
        <Form.Item
          label={showShortCoinsHandle.PurChase}
          field={showShortCoinsHandle.fieldBuy}
          formatter={item => {
            const formatterNum = String(item)
              ?.replace(/[^\d.]+/g, '')
              ?.replace(/(\..*)\./g, '$1')

            // .replace(/\.{2,}/g, '.')
            // 下面正则是开头不能输入多个 0
            if (handleCoinsType) {
              return formatterNum?.split('.')?.[1]?.length >= handleCoinsType?.[coinsType]?.trade_precision
                ? formatNumberDecimal(formatterNum, handleCoinsType?.[coinsType]?.trade_precision)?.replace(
                    /^0+(?=\d)/,
                    ''
                  )
                : formatterNum?.replace(/^0+(?=\d)/, '')
            }
          }}
          rules={[
            {
              validator: coinsType === 'Sell' ? setOverAvailableBalanceChange : setPurChaseLimit,
            },
          ]}
        >
          <Input
            className={cn('short-handle-input', {
              'short-handle-focus': coinsType === 'Sell',
            })}
            autoComplete="off"
            placeholder={String(formatNumberDecimal(0, handleCoinsType?.[coinsType]?.trade_precision))}
            size="large"
          />
        </Form.Item>
        {getShortHandleRate()}
        {coinsType === 'Sell' && (
          <>
            <div
              className={cn('sell-show-nums', {
                'text-sell_down_color': overAvailableBalance || overAvailableBalanceLimit.status,
                'text-text_color_02': !overAvailableBalance && !overAvailableBalanceLimit.status,
              })}
            >
              {!overAvailableBalanceLimit.status && handleCoinsType?.[coinsType]?.balance
                ? t({
                    id: 'features_c2c_trade_shortcut_coins_index_rbhqtmhvsrdpbkjdq7uae',
                    values: { 0: handleCoinsType?.[coinsType]?.balance, 1: handleCoinsType?.[coinsType]?.coinName },
                  })
                : overAvailableBalanceLimit?.text}
            </div>
            <div className="short-handle-aller">
              {handleCoinsType?.[coinsType]?.balance && (
                <div className="short-sell-all inline-block" onClick={setSellAllChange}>
                  {t`features_c2c_trade_shortcut_coins_index_gwd2xdrqdtozwojn0hmly`}
                </div>
              )}
              {/* 
              <div className="short-handle-all inline-block" onClick={setTransferChange}>
                {t`features/assets/main/index-4`}
              </div> */}
            </div>
          </>
        )}
        {coinsType === 'PurChase' && (
          <div
            className={cn('sell-show-nums', {
              'text-sell_down_color': overstepLimit,
              'text-text_color_02': !overstepLimit,
            })}
          >
            {handleCoinsType?.[coinsType]?.minTransQuantity
              ? Number(handleCoinsType?.[coinsType]?.minTransQuantity)
              : 0}
            -{formatCurrency(Number(handleCoinsType?.[coinsType]?.maxTransQuantity))}
            {handleCoinsType?.[coinsType]?.coinName}
          </div>
        )}
      </div>,
      <div className="short-handle-container" key="sell">
        <Form.Item
          label={showShortCoinsHandle.Sell}
          formatter={item => {
            const formatterNum = String(item)
              ?.replace(/[^\d.]+/g, '')
              ?.replace(/(\..*)\./g, '$1')

            // 下面正则是开头不能输入多个 0
            return formatterNum?.split('.')?.[1]?.length >= handleAreaType?.[coinsType]?.precision
              ? formatNumberDecimal(formatterNum, handleAreaType?.[coinsType]?.precision)?.replace(/^0+(?=\d)/, '')
              : formatterNum?.replace(/^0+(?=\d)/, '')
          }}
          field={showShortCoinsHandle.fieldSell}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input
            className={cn('short-handle-input', {
              'short-handle-focus': coinsType === 'PurChase',
            })}
            autoComplete="off"
            placeholder={String(formatNumberDecimal(0, handleAreaType?.[coinsType]?.precision))}
            size="large"
          />
        </Form.Item>
        <div className="sell-nums">
          1 {handleCoinsType?.[coinsType]?.coinName}≈ {getBestPriceChangeValues()}
          {handleAreaType?.[coinsType]?.currencyName}
        </div>

        {getShortHandle()}
      </div>,
    ]
    // 此判断保留，后面可能发生变化
    // return coinsType === 'PurChase' ? formItem.reverse() : formItem
    return formItem
  }

  const coinsTypeObj = {
    PurChase: t`features_c2c_trade_shortcut_coins_index_fyc-qma0mk-51t5ukvcin`,
    Sell: t`features_c2c_trade_shortcut_coins_index_x5bqpogz3ua4t_xduggzu`,
  }

  return (
    <div className="shortcut-coins">
      <div className="shortcut-title">
        <div className="shortcut-title-first">{t`features_c2c_trade_shortcut_coins_index_hj_7x1hudu9dbxcislrgl`}</div>
        <div>
          {t`features_c2c_trade_shortcut_coins_index_5bc4nj3iiqtdktxzumsyh`}
          {t`features_c2c_trade_shortcut_coins_index_4otzdqlhbph2cipioml-j`}
          {t`features_c2c_trade_shortcut_coins_index_cccobwuaxvrcumvfzyiny`}
        </div>
        <div>{t`features_c2c_trade_shortcut_coins_index_nmhi-qoehvib78nyv_io6`}</div>
        <div className="shortcut-coins-icon">
          <Icon name="c2c_bank_card" hasTheme className="apple" />
          <Icon name="c2c_apple_pay" hasTheme className="apple" />
          <Icon name="c2c_visa" hasTheme className="paypal" />
          <Icon name="c2c_paypal" hasTheme className="paypal" />
        </div>
      </div>
      <FreeTradeTipModal ref={freeTradeTipModalRef} freeTradeTipProps={freeTradeTip as ReturnFreeTradeTip} />
      <ShorcutCoinsModal contentTips={contentTips} ref={shorcutCoinsModalFormRef} />
      <div className="shortcut-coins-submit">
        <div className="shortcut-coins-select">
          <Radio.Group value={coinsType} onChange={setOnTradeChange}>
            {getShortcuCoinsType().map(item => {
              return (
                <Radio key={item.id} value={item.id}>
                  {({ checked }) => {
                    return (
                      <div
                        className={cn('trade-radio-button', {
                          'trade-radio-button-checked': checked,
                          'trade-radio-button-notchecked': !checked,
                        })}
                        key={item.id}
                      >
                        {item.title}
                      </div>
                    )
                  }}
                </Radio>
              )
            })}
          </Radio.Group>
          <div className="shortcut-coins-form">
            <Form layout="vertical" ref={formRef} onChange={onShortcutCoinChange}>
              {setFormItemChange().flatMap(item => {
                return item
              })}
            </Form>
          </div>
          {isPassStatus ? (
            <div className="shortcut-coins-button" onClick={setHandleCoinsButton}>
              <Spin loading={shortcutCoinsLoading}>
                <div
                  className={cn('shortcut-coins-button-submit', {
                    'bg-sell_down_color': coinsType === 'Sell',
                    'bg-buy_up_color': coinsType === 'PurChase',
                  })}
                >
                  {showBestPriceButton
                    ? coinsTypeObj[coinsType as string]
                    : t`features_c2c_trade_shortcut_coins_index_hexcim52jsjcfkaecxe2t`}
                </div>
              </Spin>
            </div>
          ) : (
            <div className="shortcut-coins-button" onClick={setGotKyc}>
              <div className="shortcut-coins-button-kyc">
                {t`features_c2c_trade_shortcut_coins_index_gzo5dibnovkx3jkx064_f`} KYC{' '}
                {t`features_c2c_trade_free_trade_index_ueruhwwnrlhksqf41fkqn`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(ShortcutCoins)

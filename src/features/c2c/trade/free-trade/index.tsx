import { useState, memo, useRef, useEffect, useCallback } from 'react'
import { Radio, Form, Grid, FormInstance, Select, Message } from '@nbit/arco'
import Table from '@/components/table'
import cn from 'classnames'
import { t } from '@lingui/macro'
import LazyImage from '@/components/lazy-image'
import {
  setAdvertIndexList,
  getCheckBeforeCreate,
  getCoinForbiddenCheck,
  getC2CAreaCoinList,
  getC2CAreaList,
  getMainChainList,
  queryCanPublishAd,
} from '@/apis/c2c/c2c-trade'
import { useOverscrollBehavior } from '@/hooks/use-overscroll-behavior'
import { useMount, useUpdateEffect } from 'ahooks'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { setC2CParamsTipsCache, getC2CParamsTipsCache } from '@/helper/cache'
import { link } from '@/helper/link'
import {
  getC2cPostAdvPageRoutePath,
  getC2CCenterPagePath,
  getKycPageRoutePath,
  getC2cOrderC2CPageRoutePath,
} from '@/helper/route'
import { debounce, isEmpty } from 'lodash'
import { baseUserStore, useUserStore } from '@/store/user'
import { YapiPostV1C2CCoinListData } from '@/typings/yapi/C2cCoinListV1PostApi.d'
import { YapiGetV1C2CAreaListData } from '@/typings/yapi/C2cAreaListV1GetApi.d'
import { YapiPostV1C2CCoinMainChainListData } from '@/typings/yapi/C2cCoinMainChainListV1PostApi'
import {
  YapiPostV1C2CAdvertIndexListPaymentDetailsListData,
  YapiPostV1C2CAdvertIndexListData,
  YapiPostV1C2cAdvertIndexListApiRequest,
} from '@/typings/yapi/C2cAdvertIndexListV1PostApi'
import { guid } from '@/helper/kyc'
import C2CPaythodsStyle from '@/features/c2c/trade/c2c-paythods-style'
import C2CTypeInput from '../c2c-type-input'
import CoinSelect from '../c2c-select/coin-select'
import styles from './freetrade.module.css'
import FreeTradeTipModal from './free-tradetip-modal'
import FreePlaceorderModal from './free-placeorder-modal'
import {
  useFreeTrade,
  FreeTradeClassName,
  FreeTradeTipModalType,
  FreeTradePlaceModal,
  Props,
  payMenthodItem,
  RequestDetail,
} from './use-free-trade'
import {
  useCommonTrade,
  ReturnFreeTradeTip,
  isPassThrough,
  TransactionStation,
  PayMethods,
  AdvertDirectCds,
} from '../c2c-trade'
import { useFreeTradeScroll } from './use-free-trade-scroll'
import { useRiskStatement } from './use-risk-statement'
import BidTrade from '../bid-trade'

const Row = Grid.Row
const Option = Select.Option

function FreeTrade(props: Props) {
  const { setShowLoadingOpenChange, setShowLoadingCloseChange, showLoading } = props

  let { userInfo, isLogin } = useUserStore()

  // replace to fastpay userInfo in public c2cMode
  if (!isEmpty(baseUserStore.getState().c2cModeUserInfo)) {
    userInfo = baseUserStore.getState().c2cModeUserInfo
  }

  useOverscrollBehavior()

  const formRef = useRef<FormInstance>(null)

  const tableRef = useRef<HTMLDivElement>(null)

  const freeTradeClassNameRef = useRef<FreeTradeClassName>({
    fullClassName:
      'w-full h-10 bg-brand_color cursor-pointer font-medium text-button_text_02 flex justify-center items-center rounded',
    halfBrandName:
      'h-10 w-36 bg-brand_color font-medium cursor-pointer text-button_text_02 flex justify-center items-center rounded',
    cancelHalfBrandName:
      'h-10 w-36 border border-line_color_01 text-text_color_02 cursor-pointer flex justify-center items-center rounded',
    halfBrandBorderName:
      'h-10 w-36 border border-brand_color font-medium text-brand_color cursor-pointer flex justify-center items-center rounded',
  })

  const { payMethods } = useCommonTrade()

  const freeTradeTipModalRef = useRef<FreeTradeTipModalType>(null)

  const freeTradePlaceModalRef = useRef<FreeTradePlaceModal>(null)

  const [requestHandle, setRequestHandle] = useState<boolean>(true)

  const paythodMethodsListRef = useRef<Record<'payMenthodsList', payMenthodItem[]>>({
    payMenthodsList: [{ label: '', value: '', filterNum: 0 }],
  })

  const [onAreaVisible, setOnAreaVisible] = useState<boolean>(true)

  const [onCoinVisible, setOnCoinVisible] = useState<boolean>(true)

  const [limitProhibit, setLimitProhibit] = useState<string[]>([])

  const [mainChainList, setMainChainList] = useState<YapiPostV1C2CCoinMainChainListData[]>([])

  const [areaPrecisionDetail, setAreaPrecisionDetail] = useState<YapiPostV1C2CCoinListData>()

  const selectOtherOub = () => {
    freeTradeTipModalRef.current?.setCoinsTradeTipNotVisible()
  }

  const goToKyc = () => {
    link(getKycPageRoutePath())
  }

  const goToAddPaymentMethod = () => {
    link(getC2CCenterPagePath(undefined, 2))
  }

  const setGoToPublishAds = () => {
    link(getC2cPostAdvPageRoutePath())
  }

  const freeTradeTipParams = {
    increaseKycLevel: {
      tipContent: t`features_c2c_trade_free_trade_index_hrwoun2opmjrntb3cn1bp`,
      tipButton: (
        <div className="w-full flex justify-between">
          <div className={freeTradeClassNameRef.current.cancelHalfBrandName} onClick={selectOtherOub}>
            {t`features_c2c_trade_free_trade_index_ptlr4xwchw95iebrerelt`}
          </div>
          <div className={freeTradeClassNameRef.current.halfBrandName} onClick={goToKyc}>
            {t`features_c2c_trade_free_trade_index_t_2kb34ljxqk-dnmnmr4u`}KYC
            {t`features_c2c_trade_free_trade_index_ueruhwwnrlhksqf41fkqn`}
          </div>
        </div>
      ),
    },
    areaRiskWarn: {
      tipContent: t`features_c2c_trade_free_trade_index_nb976eavdjvtq98478jko`,
      tipButton: (
        <div
          className={freeTradeClassNameRef.current.fullClassName}
        >{t`features_c2c_trade_free_trade_index_nmty2yfzwaudu-verkkt7`}</div>
      ),
    },
    offsiteTransaction(placeProps) {
      return {
        tipContent: t`features_c2c_trade_free_trade_index_j5e3imbc7khdm8fpbycmu`,
        tipButton: (
          <div className="w-full flex justify-between">
            <div className={freeTradeClassNameRef.current.halfBrandBorderName} onClick={selectOtherOub}>
              {t`features_c2c_trade_free_trade_index_-owqd0c5witzyk34exqmq`}
            </div>
            <div
              className={freeTradeClassNameRef.current.halfBrandName}
              onClick={() => continueToBuy(placeProps, true)}
            >
              {t`features_c2c_trade_free_trade_index_nmty2yfzwaudu-verkkt7`}
            </div>
          </div>
        ),
      }
    },
    prohibitedLinks: {
      tipContent: '',
      tipButton: (
        <div className={freeTradeClassNameRef.current.fullClassName} onClick={selectOtherOub}>
          {t`features_c2c_trade_free_trade_index_-owqd0c5witzyk34exqmq`}
        </div>
      ),
    },
    riskControlReasons: {
      tipContent: t`features_c2c_trade_free_trade_index_lfjrkr-_uaxqc9aqqm-r_`,
      tipButton: (
        <div className={freeTradeClassNameRef.current.fullClassName} onClick={selectOtherOub}>
          {t`user.field.reuse_48`}
        </div>
      ),
    },
    paymentMethodTip(title) {
      return {
        tipContent: t({
          id: 'features_c2c_trade_free_trade_index_0b69pzb_2r9kaosrv2uuw',
          values: { 0: title },
        }),
        tipButton: (
          <div className={freeTradeClassNameRef.current.fullClassName} onClick={goToAddPaymentMethod}>
            {t`features_c2c_trade_free_trade_index_cror__n4ujg_bk0mdmtk0`}
          </div>
        ),
      }
    },
    judgeKycLevel(title) {
      return {
        tipContent: t({
          id: 'features_c2c_trade_free_trade_index_poyrvytidj8eomuv1_rch',
          values: { 0: title },
        }),
        tipButton: (
          <div className="w-full flex justify-between">
            <div className={freeTradeClassNameRef.current.halfBrandBorderName} onClick={selectOtherOub}>
              {t`features_c2c_trade_free_trade_index_ozhwo5gjjaje0vyaz4w94`}
            </div>
            <div className={freeTradeClassNameRef.current.halfBrandName} onClick={goToKyc}>
              {t`features_c2c_trade_free_trade_index_osqcvjneeouaujc6lch-z`}kyc
              {t`features_c2c_trade_free_trade_index_ueruhwwnrlhksqf41fkqn`}
            </div>
          </div>
        ),
      }
    },
  }

  const continueToBuy = async (placeProps, isOnce?: boolean) => {
    if (placeProps?.tradeTypeCd !== TransactionStation.INSIDE) {
      const { isOk, data } = await getCoinForbiddenCheck({ advertId: placeProps?.advertId })
      setLimitProhibit(data?.chainData?.map(item => item?.chainType as string) || [])
      if (isOk && data?.pass) {
        freeTradeTipModalRef.current?.setCoinsTradeTipNotVisible()
        isOnce && freeTradePlaceModalRef.current?.setCoinsTradePlaceVisible()
        return true
      } else {
        let tipContent = ''
        data?.chainData?.forEach((element, index, item) => {
          tipContent += `${element?.symbol} (${element?.chainType}) ${
            index === item.length - 1 ? t`features_c2c_trade_free_trade_index_klcucl5zhonornpbjpev5` : '、'
          }`
        })
        freeTradeTipParamsStatus.prohibitedLinks.tipContent = tipContent
        setFreeTradeTipProps(freeTradeTipParamsStatus?.prohibitedLinks)
        freeTradeTipModalRef.current?.setCoinsTradeTipVisible()
        return false
      }
    } else {
      return true
    }
  }

  const [freeTradeTipParamsStatus, setFreeTradeTipParamsStatus] = useState<any>(freeTradeTipParams)

  const [freeTradeTipProps, setFreeTradeTipProps] = useState<ReturnFreeTradeTip>()

  const [freePlaceProps, setFreePlaceProps] = useState<YapiPostV1C2CAdvertIndexListData>()

  const [areaPaySearchKey, setAreaPaySearchKey] = useState<string>('')

  const [areaCoinSearchKey, setCoinPaySearchKey] = useState<string>('')

  const [c2cTradeColumnList, setC2CTradeColumnList] = useState<YapiPostV1C2CAdvertIndexListData[]>([])

  const [c2cTradeColumnTotal, setC2CTradeColumnTotal] = useState<number>()

  const [paythodMethods, setPaythodMethods] = useState<Record<'label' | 'value', string>[]>()

  const [payCoinSearchKey, setPayCoinSearchKey] = useState<string>('')

  const [releaseAdvertSwitch, setReleaseAdvertSwitch] = useState<boolean>(false)

  const [tradeList, setTradeList] = useState<Record<'label' | 'value', string>[]>()

  const [c2cAreaList, setC2CAreaList] = useState<YapiGetV1C2CAreaListData[]>([])

  const [c2cCoinList, setC2CCoinList] = useState<YapiPostV1C2CCoinListData[]>([])

  const requestDetail = useRef<RequestDetail>({
    pageNum: 1,
    pageSize: 20,
  })

  const [tradeType, setTradeType] = useState<string>(AdvertDirectCds.BUY)

  const [handleCoinsType, setHandleCoinsType] = useState<YapiPostV1C2CCoinListData>()

  const isJudgeBeforeCreate = async placeProps => {
    const { isOk: isOkBefore, data } = await getCheckBeforeCreate({
      advertId: placeProps?.advertId,
      amount: 0,
      side: placeProps?.advertDirectCd === AdvertDirectCds.BUY ? AdvertDirectCds.SELL : AdvertDirectCds.BUY,
    })

    if (isOkBefore && data?.code === 10106005) {
      setFreeTradeTipProps(freeTradeTipParamsStatus?.increaseKycLevel)
      freeTradeTipModalRef.current?.setCoinsTradeTipVisible()
      return false
    } else if (isOkBefore && data?.code === 10107001) {
      let showPaymentMethodTip = ''
      placeProps?.payments?.forEach((element, index, paymentsArray) => {
        showPaymentMethodTip += `${payMethods[element]}${index < paymentsArray.length - 1 ? '、' : ''}`
      })
      setFreeTradeTipProps(freeTradeTipParamsStatus?.paymentMethodTip(showPaymentMethodTip))
      freeTradeTipModalRef.current?.setCoinsTradeTipVisible()
      return false
    } else if (isOkBefore && data?.code === 20000008) {
      setFreeTradeTipProps(freeTradeTipParamsStatus?.riskControlReasons)
      freeTradeTipModalRef.current?.setCoinsTradeTipVisible()
      return false
    } else if (!isOkBefore) {
      return false
    }
    return true
  }

  const { isRiskTip, setRiskStatement } = useRiskStatement(freeTradeTipModalRef, setFreeTradeTipProps, isLogin)

  const isSettingKycLevel = async () => {
    const { status, title } = (await isPassThrough()) || {}
    if (!status) {
      setFreeTradeTipProps(freeTradeTipParamsStatus?.judgeKycLevel(title))
      freeTradeTipModalRef.current?.setCoinsTradeTipVisible()
      return false
    }
    return true
  }

  const isJudgeInSide = placeProps => {
    const isInSide = placeProps?.tradeTypeCd === TransactionStation.INSIDE
    const paramsTipsCache = getC2CParamsTipsCache() || {}
    const { isInSideCache } = paramsTipsCache

    if (!isInSide && !isInSideCache) {
      setC2CParamsTipsCache({ ...paramsTipsCache, isInSideCache: true })
      setFreeTradeTipProps(freeTradeTipParamsStatus?.offsiteTransaction(placeProps))
      freeTradeTipModalRef.current?.setCoinsTradeTipVisible()
      return false
    }
    return true
  }

  const setTradeHandlePart = async (isRisk, placeProps) => {
    const isJudgeBefore = isRisk && (await isJudgeBeforeCreate(placeProps))
    const isJudgeInSides = isJudgeBefore && isJudgeInSide(placeProps)
    const isContinueSides = isJudgeInSides && (await continueToBuy(placeProps))
    if (isContinueSides) {
      freeTradePlaceModalRef.current?.setCoinsTradePlaceVisible()
    }
  }

  const setTradeHandle = async placeProps => {
    if (!isLogin) {
      link(`/login?redirect=${getC2cOrderC2CPageRoutePath()}`)
      return
    }
    if (placeProps?.uid === userInfo?.uid) {
      Message.error(t`features_c2c_trade_free_trade_index_sybe-8xczuzwigibiobzu`)
      return
    }
    setFreePlaceProps(placeProps)
    const isKycLevel = placeProps?.advertDirectCd === 'SELL' || (await isSettingKycLevel())
    // const isRisk = isKycLevel && isRiskTip(placeProps)
    setTradeHandlePart(isKycLevel, placeProps)
  }

  const {
    freeTradeTableColumns,
    tradeSelect,
    setRequestParamsType,
    setFormatterNum,
    setScrollTop,
    renderFormatComponent,
    advertDealType,
    getPaymentCodeVal,
    getPaymentColorCodeVal,
    getAdvertCodeVal,
  } = useFreeTrade(tradeType, setTradeHandle, handleCoinsType, payMethods)

  const getC2CTradeList = async (
    columnList: YapiPostV1C2CAdvertIndexListPaymentDetailsListData[] = [],
    isNeedLoading = true
  ) => {
    isNeedLoading && setShowLoadingOpenChange()
    setRequestHandle(false)
    const { isOk, data } = await setAdvertIndexList({ ...requestDetail.current } as Required<
      RequestDetail & Record<'coinId', string>
    >)
    if (isOk && data) {
      // @ts-ignores
      setC2CTradeColumnList([...columnList, ...data.list])
      // @ts-ignores
      setC2CTradeColumnTotal(data?.total)
    }
    if (isNeedLoading) {
      setScrollTop()
      setShowLoadingCloseChange()
    }
    setRequestHandle(true)
    return true
  }

  const setC2CRequestScroll = useCallback(
    columnList => {
      // console.log(columnList, 'columnListcolumnListcolumnListcolumnListcolumnList')
      if (c2cTradeColumnList.length > 0 && columnList.length > 0) {
        const request = requestDetail.current
        requestDetail.current = { ...request, pageNum: request.pageNum + 1 }
        getC2CTradeList(columnList, false)
      }
    },
    [getC2CTradeList, requestDetail.current, c2cTradeColumnList]
  )

  useFreeTradeScroll({
    list: c2cTradeColumnList,
    listParams: { total: c2cTradeColumnTotal || 0, pageSize: requestDetail.current.pageSize },
    request: setC2CRequestScroll,
    bottomDistance: 500,
    requestHandle,
  })

  const setTradeTypeFn = e => {
    if (e !== AdvertDirectCds.BIDTRADE) {
      const requestDirectCds = e === AdvertDirectCds.BUY ? AdvertDirectCds.SELL : AdvertDirectCds.BUY
      requestDetail.current = { ...requestDetail.current, advertDirectCds: [requestDirectCds], pageNum: 1 }
      setC2CTradeColumnList([])
    }
    setTradeType(e)
  }

  const tradeTypeLoading = async () => {
    await getC2CTradeList()
  }

  useUpdateEffect(() => {
    tradeTypeLoading()
  }, [tradeType])

  const getC2CAreaCoinPayListChange = async items => {
    const { isOk, data } = await getC2CAreaCoinList(items)
    if (isOk && data) {
      setC2CCoinList(data)
      return data
    }
  }

  useEffect(() => {
    if (c2cCoinList.length > 0 && onCoinVisible) {
      const showC2CCoinList = c2cCoinList?.filter(item => item?.defaultShow)
      setHandleCoinsType(showC2CCoinList?.[0])
    }
  }, [c2cCoinList])

  const setPayMenthodsList = areaList => {
    const { setFieldsValue, getFieldValue } = formRef.current || {}
    const payMenthodsList = areaList?.payments?.map(item => {
      const obj = {
        label: getPaymentCodeVal(item),
        value: item,
      }
      return obj
    })
    payMenthodsList.unshift({
      label: t`features_c2c_trade_free_trade_index_0fagnuqqywfisjoovkrfo`,
      value: '',
    })
    setPaythodMethods(payMenthodsList)

    paythodMethodsListRef.current.payMenthodsList = payMenthodsList
    const paymentMethod = getFieldValue && getFieldValue('paymentMethod')
    const payment = payMenthodsList?.find(item => item?.value === paymentMethod)
    setFieldsValue && setFieldsValue({ paymentMethod: payment?.value || '' })
  }

  const setTradeTypeList = defaultClientTypeCd => {
    const { setFieldsValue } = formRef.current || {}
    const typeList = advertDealType?.map(item => {
      return {
        label: item?.codeKey,
        value: item?.codeVal,
      }
    })

    const tradeTypeList = [
      {
        label: t`constants_c2c_history_records_index_sqmod462gxas21d8zhwde`,
        value: '',
      },
      ...typeList,
    ]
    const transaction = tradeTypeList?.filter(item => item?.value === defaultClientTypeCd)
    setTradeList(tradeTypeList)
    setFieldsValue && setFieldsValue({ transactionType: transaction?.[0]?.value || '' })
  }

  const getQueryCanPublishAdChange = async areaId => {
    const { isOk, data } = await queryCanPublishAd({
      areaId,
    })
    if (isOk) {
      setReleaseAdvertSwitch(data?.releaseAdvertSwitch)
    }
  }

  const setTradeListChange = async areaList => {
    if (areaList?.length > 0 && onAreaVisible) {
      const { setFieldsValue } = formRef.current || {}
      const { legalCurrencyId, defaultClientTypeCd, areaRiskWarn, payments, currencyName } = areaList[0] || {}
      setAreaPrecisionDetail(areaList[0])

      const areaIds = legalCurrencyId
      const coinData = await getC2CAreaCoinPayListChange({ areaIds: [areaIds], searchKey: '' })
      setFieldsValue && setFieldsValue({ c2cAreasType: areaIds })
      setPayMenthodsList(areaList?.[0])
      setTradeTypeList(defaultClientTypeCd)
      setRiskStatement(areaRiskWarn)
      const showC2CCoinList = coinData?.filter(item => item?.defaultShow)
      isRiskTip(currencyName, areaRiskWarn)
      isLogin && getQueryCanPublishAdChange(areaIds)
      requestDetail.current = {
        ...requestDetail.current,
        areaId: areaIds,
        coinId: showC2CCoinList?.[0]?.id,
        advertDirectCds: [AdvertDirectCds.BUY ? AdvertDirectCds.SELL : AdvertDirectCds.BUY],
        tradeTypeCds: !defaultClientTypeCd ? advertDealType?.map(item => item?.codeVal) : [defaultClientTypeCd],
        payments: !payments ? [PayMethods.ALIPAY, PayMethods.WECHAT, PayMethods.BANK] : payments,
        // chains: ['ERC20'],
      }
      getC2CTradeList()
    }
  }

  useEffect(() => {
    // freeTradePlaceModalRef.current?.setCoinsTradePlaceVisible()
    if (advertDealType?.length > 0) {
      setTradeListChange(c2cAreaList)
    }
  }, [c2cAreaList, advertDealType])

  const setCoinChangeInputChanges = debounce(searchKey => {
    const areaIds = formRef.current?.getFieldValue('c2cAreasType')
    getC2CAreaCoinPayListChange({ areaIds: [areaIds], searchKey })
  }, 400)

  const setCoinChangeInput = useCallback(searchKey => {
    setCoinPaySearchKey(searchKey)
    setCoinChangeInputChanges(searchKey)
  }, [])

  const setAreaChangeInput = searchKey => {
    setAreaPaySearchKey(searchKey)
    getC2CAreaListChange({ searchKey })
  }

  const setHandleCoinsTypeChange = key => {
    const item = c2cCoinList.find(coinitem => coinitem?.id === key)
    setHandleCoinsType(item)
    requestDetail.current = {
      ...requestDetail.current,
      coinId: item?.id,
      pageNum: 1,
    }
    getC2CTradeList()
  }

  const getC2CAreaListChange = async params => {
    const { isOk, data } = await getC2CAreaList(params)
    if (isOk && data) {
      setC2CAreaList(data)
    }
  }

  const getMainChainListChange = async name => {
    const { isOk, data } = await getMainChainList({ name })
    if (isOk && data) {
      setMainChainList(data)
    }
  }

  useEffect(() => {
    handleCoinsType?.symbol && isLogin && getMainChainListChange(handleCoinsType?.symbol)
  }, [handleCoinsType, isLogin])

  useMount(() => {
    setShowLoadingOpenChange()
    getC2CAreaListChange({ searchKey: '' })
  })

  const setPaythodChangeInput = e => {
    if (paythodMethodsListRef.current && e) {
      const paythodMethodsList = paythodMethodsListRef.current.payMenthodsList
        .filter(item => item.label.indexOf(e) !== -1)
        .sort((a, b) => {
          const codeKeyRemark = a.label?.toLowerCase()
          const countryValueRemark = b.label?.toLowerCase()
          if (codeKeyRemark === countryValueRemark) return 0
          return codeKeyRemark < countryValueRemark ? -1 : 1
        })
        .map(item => {
          item.filterNum = item.label.indexOf(e)
          return item
        })
        .sort((a, b) => {
          if (a.label && b?.label) {
            return a.filterNum - b.filterNum
          }
          return 0
        })
      setPaythodMethods(paythodMethodsList)
    } else {
      setPaythodMethods(paythodMethodsListRef.current.payMenthodsList)
    }
    setPayCoinSearchKey(e)
  }

  const setHandleAreaTypeChange = async key => {
    const item = c2cAreaList.find(areaitem => areaitem?.legalCurrencyId === key)
    setAreaPrecisionDetail(item as YapiGetV1C2CAreaListData)
    const coinData = await getC2CAreaCoinPayListChange({ areaIds: [item?.legalCurrencyId], searchKey: '' })
    const res = await formRef.current?.validate()
    const showC2CCoinList = coinData?.filter(items => items?.defaultShow)
    setPayMenthodsList(item)
    const paymentMethod = paythodMethodsListRef.current.payMenthodsList?.find(
      items => items?.value === res?.paymentMethod
    )

    setTradeTypeList(item?.defaultClientTypeCd)

    requestDetail.current = {
      ...requestDetail.current,
      coinId: showC2CCoinList?.[0]?.id,
      ...setRequestParamsType(res),
      pageNum: 1,
      payments: paymentMethod?.value ? [paymentMethod?.value] : [PayMethods.ALIPAY, PayMethods.WECHAT, PayMethods.BANK],
      tradeTypeCds: !item?.defaultClientTypeCd
        ? advertDealType?.map(items => items?.codeVal)
        : [item?.defaultClientTypeCd as string],
    }
    setRiskStatement(item?.areaRiskWarn)
    isRiskTip(item?.currencyName, item?.areaRiskWarn)
    isLogin && getQueryCanPublishAdChange(item?.legalCurrencyId)
    getC2CTradeList()
  }

  const setCoinSelectChange = debounce(async e => {
    const tradeKey = Object.keys(e)[0]
    if (tradeKey === 'c2cAreasType') {
      setHandleAreaTypeChange(e[tradeKey])
    } else {
      const res = await formRef.current?.validate()
      if (
        tradeKey === 'c2cCoinsType' &&
        Number(String(setFormatterNum(res?.c2cCoinsType))?.replace(/[^\d.]/g, '')) ===
          Number(requestDetail.current?.amount)
      ) {
        return
      }
      requestDetail.current = {
        ...requestDetail.current,
        coinId: handleCoinsType?.id,
        ...setRequestParamsType(res),
        pageNum: 1,
        amount: Number(setFormatterNum(res?.c2cCoinsType)) || undefined,
      }
      getC2CTradeList()
    }
  }, 300)

  const onAreaVisibleChange = e => {
    setOnAreaVisible(!e)
  }

  const onCoinVisibleChange = e => {
    setOnCoinVisible(!e)
  }

  return (
    <div className={styles.container}>
      <FreeTradeTipModal ref={freeTradeTipModalRef} freeTradeTipProps={freeTradeTipProps as ReturnFreeTradeTip} />
      {tradeType !== AdvertDirectCds.BIDTRADE ? (
        <FreePlaceorderModal
          ref={freeTradePlaceModalRef}
          handleCoinsType={handleCoinsType}
          areaPrecisionDetail={areaPrecisionDetail as YapiPostV1C2CCoinListData}
          freePlaceProps={freePlaceProps}
          tradeType={tradeType}
          mainChainList={mainChainList}
          limitProhibit={limitProhibit}
          getPaymentCodeVal={getPaymentCodeVal}
          getAdvertCodeVal={getAdvertCodeVal}
          getPaymentColorCodeVal={getPaymentColorCodeVal}
        />
      ) : null}
      <div className="affix-name">
        <div className="freeTrade-tab">
          <div className="freeTrade-tabPane">
            <div className="freeTrade-tabPane-select">
              <div
                className={cn('trade-select', {
                  'trade-select-sell': tradeType === AdvertDirectCds.SELL,
                })}
              >
                <Radio.Group defaultValue={AdvertDirectCds.BUY} onChange={setTradeTypeFn}>
                  {[AdvertDirectCds.BUY, AdvertDirectCds.SELL, AdvertDirectCds.BIDTRADE].map(item => {
                    return (
                      <Radio key={item} value={item}>
                        {({ checked }) => {
                          return (
                            <div
                              className={cn('trade-radio-button', {
                                'trade-radio-purchase':
                                  (item === AdvertDirectCds.BUY || item === AdvertDirectCds.BIDTRADE) && checked,
                                'trade-radio-sell': item === AdvertDirectCds.SELL && checked,
                              })}
                              key={item}
                            >
                              {tradeSelect[item]}
                            </div>
                          )
                        }}
                      </Radio>
                    )
                  })}
                </Radio.Group>
              </div>
            </div>
            {releaseAdvertSwitch && (
              <div className="free-publish-ads" onClick={setGoToPublishAds}>
                {t`features_c2c_trade_free_trade_index_o2b2obqunp6yhlx0cdebj`}
              </div>
            )}
          </div>
        </div>
        {tradeType === AdvertDirectCds.BIDTRADE ? (
          <div>
            <BidTrade />
          </div>
        ) : (
          <div className="freeTrade-tabPane-item">
            <Form ref={formRef} layout="vertical" onChange={setCoinSelectChange}>
              <Row gutter={24}>
                <Form.Item className="coin-select-width coin-select-form-label mx-3" label="" field="c2cAreasType">
                  <CoinSelect
                    setC2CChangeInput={setAreaChangeInput}
                    onVisibleChange={onAreaVisibleChange}
                    renderFormat={item => {
                      return item
                        ? renderFormatComponent(
                            item?.extra.currencyName,
                            `${oss_area_code_image_domain_address}${item?.extra.countryAbbreviation}`,
                            true
                          )
                        : ''
                    }}
                    searchKeyValue={areaPaySearchKey}
                  >
                    {c2cAreaList?.map(option => (
                      <Option
                        key={option.legalCurrencyId}
                        disabled={option?.statusCd === 'DISABLE'}
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
                </Form.Item>
                <Form.Item shouldUpdate className="coin-select-form-label c2c-coins-type mx-3">
                  {() => {
                    return (
                      <Form.Item
                        label=""
                        className="coin-select-form-label"
                        formatter={item => {
                          return setFormatterNum(item)?.replace(/^0+(?=\d)/, '')
                        }}
                        field="c2cCoinsType"
                      >
                        <C2CTypeInput>
                          <CoinSelect
                            onChange={setHandleCoinsTypeChange}
                            onVisibleChange={onCoinVisibleChange}
                            setC2CChangeInput={setCoinChangeInput}
                            renderFormat={item => {
                              return item ? renderFormatComponent(item?.extra.coinName, item?.extra.webLogo) : ''
                            }}
                            value={handleCoinsType?.id}
                            searchKeyValue={areaCoinSearchKey}
                          >
                            {c2cCoinList?.map(option => (
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
                        </C2CTypeInput>
                      </Form.Item>
                    )
                  }}
                </Form.Item>
                <Form.Item label="" className="coin-select-form-label coin-select-width mx-3" field="paymentMethod">
                  <CoinSelect
                    setC2CChangeInput={setPaythodChangeInput}
                    renderFormat={item => {
                      return item ? <div className="font-normal">{item?.extra?.label}</div> : ''
                    }}
                    searchKeyValue={payCoinSearchKey}
                  >
                    {paythodMethods?.map(option => (
                      <Option key={option?.value} value={option?.value} extra={option}>
                        <C2CPaythodsStyle
                          getPaymentColorCodeVal={getPaymentColorCodeVal}
                          value={option?.value}
                          allValue={t`features_c2c_trade_free_trade_index_0fagnuqqywfisjoovkrfo`}
                          getPaymentCodeVal={getPaymentCodeVal}
                        />
                      </Option>
                    ))}
                  </CoinSelect>
                </Form.Item>
                <Form.Item label="" field="transactionType" className="coin-select-form-label coin-select-width mx-3">
                  <CoinSelect>
                    {tradeList?.map(option => (
                      <Select.Option key={option?.value} value={option?.value}>
                        <span className="font-normal">{option?.label}</span>
                      </Select.Option>
                    ))}
                  </CoinSelect>
                </Form.Item>
              </Row>
            </Form>
          </div>
        )}
      </div>
      {tradeType === AdvertDirectCds.BIDTRADE ? null : (
        <div
          ref={tableRef}
          className={cn('free-table-list', {
            'table-list-is': showLoading || c2cTradeColumnTotal === undefined,
          })}
        >
          <Table
            border={false}
            rowKey={item => (item?.advertId || guid()) as React.Key}
            columns={freeTradeTableColumns}
            data={c2cTradeColumnList}
            pagination={false}
          />
        </div>
      )}
    </div>
  )
}

export default memo(FreeTrade)

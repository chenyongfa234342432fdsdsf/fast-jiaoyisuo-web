import { useState, memo, useRef, useEffect, useCallback } from 'react'
import { Message } from '@nbit/arco'
import Table from '@/components/table'
import cn from 'classnames'
import { t } from '@lingui/macro'
import {
  getBidTradeDetailList,
  getC2CAreaCoinList,
  getCheckBeforeCreate,
  getCoinForbiddenCheck,
  getMainChainList,
} from '@/apis/c2c/c2c-trade'
import { useOverscrollBehavior } from '@/hooks/use-overscroll-behavior'
import { link } from '@/helper/link'
import { getC2CCenterPagePath, getC2cOrderC2CPageRoutePath, getKycPageRoutePath } from '@/helper/route'
import { debounce, isEmpty } from 'lodash'
import { baseUserStore, useUserStore } from '@/store/user'
import { guid } from '@/helper/kyc'
import { setC2CParamsTipsCache, getC2CParamsTipsCache } from '@/helper/cache'
import Icon from '@/components/icon'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './index.module.css'
import { useBidTrade, Props, FreeTradeClassName, FreeTradeTipModalType, FreeTradePlaceModal } from './use-bid-trade'
import { YapiPostV1C2CAdvertIndexListData } from '../../../../typings/yapi/C2cAdvertIndexListV1PostApi'
import { usePageContext } from '../../../../hooks/use-page-context'
import Filter, { SelectDataType } from './bid-filter'
import {
  YapiPostV1C2CAdvertTradingActivitiesDetailData,
  YapiPostV1C2CAdvertTradingActivitiesDetailListAdvertsData,
  YapiPostV1C2cAdvertTradingActivitiesDetailApiRequest,
} from '../../../../typings/yapi/C2cAdvertTradingActivitiesDetailV1PostApi'
import Header from './bid-header'
import FreePlaceorderModal from './bid-placeorder-modal'
import BidTradeTipModal from './bid-tradetip-modal'
import { AdvertDirectCds, ReturnFreeTradeTip, TransactionStation } from '../c2c-trade'
import { YapiPostV1C2CCoinListData } from '../../../../typings/yapi/C2cCoinListV1PostApi'
import { YapiPostV1C2CCoinMainChainListData } from '../../../../typings/yapi/C2cCoinMainChainListV1PostApi'
import { useBidTradeScroll } from './use-bid-trade-scroll'
import { BuyMethod, FilterType, NotCanTradeType } from '../../../../constants/c2c/bid'
import { usePaymentCodeVal } from './use-advert-code-val'

function BidTradeDetail(props: Props) {
  const { setShowLoadingOpenChange, setShowLoadingCloseChange, showLoading } = props
  const pageContext = usePageContext()

  let { userInfo, isLogin } = useUserStore()

  // replace to fastpay userInfo in public c2cMode
  if (!isEmpty(baseUserStore.getState().c2cModeUserInfo)) {
    userInfo = baseUserStore.getState().c2cModeUserInfo
  }

  useOverscrollBehavior()

  const tableRef = useRef<HTMLDivElement>(null)

  const [c2cTradeColumnTotal, setC2CTradeColumnTotal] = useState<number>(0)
  const [c2cTradeColumnList, setC2CTradeColumnList] = useState<YapiPostV1C2CAdvertIndexListData[]>([])
  const [tradeDetail, setTradeDetail] = useState<YapiPostV1C2CAdvertTradingActivitiesDetailData>()

  // 请求头
  const requestParamsRef = useRef<YapiPostV1C2cAdvertTradingActivitiesDetailApiRequest>()

  // 是否按照金额方式展示数据
  const [isAreaCurrency, setIsAreaCurrency] = useState<boolean>(true)

  const freeTradeTipModalRef = useRef<FreeTradeTipModalType>(null)

  const freeTradePlaceModalRef = useRef<FreeTradePlaceModal>(null)

  const [freeTradeTipProps, setFreeTradeTipProps] = useState<ReturnFreeTradeTip>()

  // 币种相关的 area
  const [areaPrecisionDetail, setAreaPrecisionDetail] = useState<YapiPostV1C2CCoinListData>()

  // 当前操作的对象
  const [freePlaceProps, setFreePlaceProps] = useState<YapiPostV1C2CAdvertTradingActivitiesDetailListAdvertsData>()

  const [requestHandle, setRequestHandle] = useState<boolean>(true)

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

  useEffect(() => {
    const params = pageContext.urlParsed.search
    if (params.price && params.advertDirect && params.areaId && params.coinId) {
      requestParamsRef.current = {
        areaId: params.areaId,
        coinId: params.coinId,
        pageNum: '1',
        pageSize: '20',
        price: params.price,
        advertDirect: params.advertDirect,
      }
    }
  }, [pageContext.urlParsed])

  useEffect(() => {
    const fetchData = async () => {
      // 开始加载
      setRequestHandle(false)
      setShowLoadingOpenChange()
      const { isOk, data } = await getBidTradeDetailList({
        ...(requestParamsRef.current as YapiPostV1C2cAdvertTradingActivitiesDetailApiRequest),
      })
      // 加载完成
      setShowLoadingCloseChange()

      if (isOk && data) {
        setTradeDetail(data as any)
        setC2CTradeColumnList((data as any).adverts.list)
        setC2CTradeColumnTotal((data as any).adverts.total)
        setAreaPrecisionDetail(data.area)
      }
      setRequestHandle(true)
    }

    if (requestParamsRef.current) {
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    setShowLoadingOpenChange()
    const { isOk, data } = await getBidTradeDetailList({
      ...(requestParamsRef.current as any),
    })
    if (isOk && data) {
      setC2CTradeColumnList([...(data as any).adverts.list])
    }

    setShowLoadingCloseChange()
  }

  // 筛选条件处理
  const onChange = async (e: SelectDataType) => {
    let isNeedRequest = true

    if (requestParamsRef.current) {
      switch (e.type) {
        case FilterType.AmountType:
          // 按照购买方式
          requestParamsRef.current.buyType = e.value
          if (e.value === BuyMethod.Number) {
            setIsAreaCurrency(false)
          } else {
            setIsAreaCurrency(true)
          }
          break
        case FilterType.LimitAmount:
          // 这个需要延迟请求
          isNeedRequest = false
          // 限额
          debounce((value: string) => {
            if (requestParamsRef.current) {
              requestParamsRef.current.amount = value ? value.toString() : undefined

              // 限额必须要传递相应的购买类型
              if (requestParamsRef.current.amount !== undefined && requestParamsRef.current.buyType === undefined) {
                requestParamsRef.current.buyType = BuyMethod.Amount
              }
              fetchData()
            }
          }, 500)(e.value)
          break
        case FilterType.PaymentMethod:
          // 支付方式
          if (e.value === '') {
            requestParamsRef.current.payments = undefined
          } else {
            requestParamsRef.current.payments = [e.value]
          }

          break
        case FilterType.TransactionType:
          // 交易类型
          if (e.value === 'all') {
            requestParamsRef.current.tradeTypeCds = undefined
          } else {
            requestParamsRef.current.tradeTypeCds = [e.value]
          }

          break
        case FilterType.OrderAmountType:
          // 成单量
          requestParamsRef.current.sort = e.value

          break
        case FilterType.AdverteType:
          // 显示广告
          if (e.value) {
            requestParamsRef.current.advertTypeCds = ['CAN_TRADE']
          } else {
            requestParamsRef.current.advertTypeCds = undefined
          }
          break
        default:
      }
    }

    if (requestParamsRef.current && isNeedRequest) {
      fetchData()
    }
  }

  const goToAddPaymentMethod = () => {
    link(getC2CCenterPagePath(undefined, 2))
  }

  // 个人认证
  const goToKyc = () => {
    link(getKycPageRoutePath())
  }

  const selectOtherOub = () => {
    freeTradeTipModalRef.current?.setCoinsTradeTipNotVisible()
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
    limitedOrderCount(count) {
      return {
        tipTitle: (
          <LazyImage
            className="nb-icon-png"
            src={`${oss_svg_image_domain_address}msg_tips.png`}
            width={36}
            height={36}
          />
        ),
        tipContent: t({
          id: 'features_c2c_trade_bid_trade_detail_index_oje5hoc94t',
          values: { 0: count },
        }),
        tipButton: (
          <div className="w-full flex justify-between">
            <div className={freeTradeClassNameRef.current.fullClassName} onClick={selectOtherOub}>
              {t`features_agent_apply_index_5101501`}
            </div>
          </div>
        ),
      }
    },
  }

  /**
   * 这些是具体操作展示的代码
   */
  const [freeTradeTipParamsStatus, setFreeTradeTipParamsStatus] = useState<any>(freeTradeTipParams) // 此处应该使用 ref

  // 主链
  const [mainChainList, setMainChainList] = useState<YapiPostV1C2CCoinMainChainListData[]>([])

  // 禁止币种
  const [limitProhibit, setLimitProhibit] = useState<string[]>([])

  // 买入和出售的币种
  const [handleCoinsType, setHandleCoinsType] = useState<YapiPostV1C2CCoinListData>()

  const [coinsList, setCoinsList] = useState<YapiPostV1C2CCoinListData[]>([])

  // 获取主链
  useEffect(() => {
    if (handleCoinsType && handleCoinsType.symbol) {
      const fetchMainChain = async (symbol: string) => {
        const { isOk, data } = await getMainChainList({ name: symbol })
        if (isOk && data) {
          setMainChainList(data)
        }
      }

      fetchMainChain(handleCoinsType.symbol)
    }
  }, [handleCoinsType])

  // 获取买入卖出的币种
  useEffect(() => {
    const fetchCoinList = async params => {
      const { isOk, data } = await getC2CAreaCoinList(params)
      if (isOk && data) {
        const showC2CCoinList = data.filter(item => item?.defaultShow)
        setHandleCoinsType(showC2CCoinList?.[0])
        setCoinsList(data)
      }
    }

    fetchCoinList({ areaIds: [pageContext.urlParsed.search.areaId] })
  }, [pageContext.urlParsed.search.areaId])
  const { getPaymentCodeVal, getPaymentColorCodeVal } = usePaymentCodeVal()
  const isJudgeBeforeCreate = async placeProps => {
    const { isOk: isOkBefore, data } = await getCheckBeforeCreate({
      advertId: placeProps?.advertId,
      amount: 0,
      side: placeProps?.advertDirectCd,
    })

    if (isOkBefore && data?.code === 10106005) {
      setFreeTradeTipProps(freeTradeTipParamsStatus?.increaseKycLevel)
      freeTradeTipModalRef.current?.setCoinsTradeTipVisible()
      return false
    } else if (isOkBefore && data?.code === 10107001) {
      let showPaymentMethodTip = ''
      placeProps?.payments?.forEach((element, index, paymentsArray) => {
        showPaymentMethodTip += `${getPaymentCodeVal(element)}${
          index < paymentsArray.length - 1 ? t`features_c2c_trade_ad_list_2222222225101679` : ''
        }`
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
            index === item.length - 1
              ? t`features_c2c_trade_free_trade_index_klcucl5zhonornpbjpev5`
              : t`features_c2c_trade_ad_list_2222222225101679`
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

  const setTradeHandlePart = async (isRisk, placeProps) => {
    const isJudgeBefore = isRisk && (await isJudgeBeforeCreate(placeProps))
    const isJudgeInSides = isJudgeBefore && isJudgeInSide(placeProps)
    const isContinueSides = isJudgeInSides && (await continueToBuy(placeProps))
    if (isContinueSides) {
      freeTradePlaceModalRef.current?.setCoinsTradePlaceVisible()
    }
  }

  // 交易操作处理
  const setTradeHandle = async (record: YapiPostV1C2CAdvertTradingActivitiesDetailListAdvertsData) => {
    if (!isLogin) {
      link(`/login?redirect=${getC2cOrderC2CPageRoutePath()}`)
      return
    }
    if (record?.uid === userInfo?.uid) {
      Message.error(t`features_c2c_trade_free_trade_index_sybe-8xczuzwigibiobzu`)
      return
    }

    // 由于方向是反的，所以修改数据
    const correntRecord = {
      ...record,
      advertDirectCd: record.advertDirectCd === AdvertDirectCds.BUY ? AdvertDirectCds.SELL : AdvertDirectCds.BUY,
    }
    setFreePlaceProps(correntRecord)
    //
    if (!record.canTrade) {
      switch (record.notCanTradeType) {
        case NotCanTradeType.NeedElementary:
          // 个人认证
          link(getKycPageRoutePath())
          break
        case NotCanTradeType.NeedSenior:
          // 高级认证
          link(getKycPageRoutePath())
          break
        case NotCanTradeType.NeedEnterprise:
          // 企业认证
          link(getKycPageRoutePath())
          break
        default:
          // 默认广告已设限
          setFreeTradeTipProps(freeTradeTipParamsStatus?.limitedOrderCount(record.completedOrderCount))
          freeTradeTipModalRef.current?.setCoinsTradeTipVisible()
      }
    } else {
      // const isKycLevel = record.advertDirectCd === 'SELL' || (await isSettingKycLevel())
      // const isRisk = isKycLevel && isRiskTip(placeProps)
      setTradeHandlePart(true, correntRecord)
    }
  }

  const { freeTradeTableColumns, setScrollTop, getAdvertCodeVal } = useBidTrade(
    setTradeHandle,
    undefined,
    isAreaCurrency,
    pageContext.urlParsed.search.coinName || '',
    pageContext.urlParsed.search.currencyName || ''
  )

  const getC2CTradeList = async (columnList: YapiPostV1C2CAdvertIndexListData[] = [], isNeedLoading = true) => {
    isNeedLoading && setShowLoadingOpenChange()
    setRequestHandle(false)
    const { isOk, data } = await getBidTradeDetailList({
      ...requestParamsRef.current,
    } as YapiPostV1C2cAdvertTradingActivitiesDetailApiRequest)
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
      if (c2cTradeColumnList.length > 0 && columnList.length > 0) {
        const request = requestParamsRef.current
        if (request) {
          requestParamsRef.current = { ...request, pageNum: request.pageNum + 1 }
        }
        getC2CTradeList(columnList, false)
      }
    },
    [c2cTradeColumnList.length]
  )

  useBidTradeScroll({
    list: c2cTradeColumnList,
    listParams: { total: c2cTradeColumnTotal || 0, pageSize: 20 },
    request: setC2CRequestScroll,
    bottomDistance: 500,
    requestHandle,
  })

  return (
    <div className={styles.container}>
      <BidTradeTipModal ref={freeTradeTipModalRef} freeTradeTipProps={freeTradeTipProps as ReturnFreeTradeTip} />
      {freePlaceProps && (
        <FreePlaceorderModal
          ref={freeTradePlaceModalRef}
          handleCoinsType={handleCoinsType}
          areaPrecisionDetail={areaPrecisionDetail as YapiPostV1C2CCoinListData}
          freePlaceProps={freePlaceProps}
          tradeType={freePlaceProps.advertDirectCd}
          mainChainList={mainChainList}
          limitProhibit={limitProhibit}
          getPaymentCodeVal={getPaymentCodeVal}
          getAdvertCodeVal={getAdvertCodeVal}
          getPaymentColorCodeVal={getPaymentColorCodeVal}
        />
      )}

      <div className="affix-name">
        <Header
          advertDirect={requestParamsRef.current?.advertDirect}
          coinName={tradeDetail?.coinName}
          areaId={requestParamsRef.current?.areaId}
          coinsList={coinsList}
          currencyName={tradeDetail?.area.currencyName}
          price={requestParamsRef.current?.price}
          countryAbbreviation={tradeDetail?.countryAbbreviation}
          currencySymbol={tradeDetail?.currencySymbol}
        />
        <Filter
          onChange={onChange}
          currencyName={tradeDetail?.area.currencyName}
          coinName={tradeDetail?.coinName}
          countryAbbreviation={tradeDetail?.countryAbbreviation}
          areaId={requestParamsRef.current?.areaId}
          minAmount={tradeDetail?.minAmount}
          maxAmount={tradeDetail?.maxAmount}
          minAreaAmount={tradeDetail?.minAreaAmount}
          maxAreaAmount={tradeDetail?.maxAreaAmount}
        />
      </div>
      <div
        ref={tableRef}
        className={cn('free-table-list', {
          'table-list-is': showLoading || c2cTradeColumnTotal === undefined,
        })}
      >
        <Table
          fitByContent
          border={false}
          rowKey={item => (item?.advertId || guid()) as React.Key}
          columns={freeTradeTableColumns}
          data={c2cTradeColumnList}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default memo(BidTradeDetail)

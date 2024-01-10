import { memo, useEffect, useMemo, useRef } from 'react'
import { t } from '@lingui/macro'
import { IncreaseTag } from '@nbit/react'
import classNames from 'classnames'
import { translateUrlToParams, formatTradePair, getQuoteDisplayName, getCurrentContractCoin } from '@/helper/market'
import { useMarketStore } from '@/store/market'
import spotWs from '@/plugins/ws'
import futureWs from '@/plugins/ws/futures'
import { rateFilter, rateFilterFutures } from '@/helper/assets'
import {
  postV3FullDepth,
  getMarketTicker,
  getV1PerpetualTradePairDetailApiRequest,
  getPerpetualMarketRestV1MarketDepthApiRequest,
} from '@/apis/market'
import CollectStar from '@/components/collect-star'
import { usePageContext } from '@/hooks/use-page-context'
import { WSThrottleTypeEnum } from '@/plugins/ws/constants'
import { YapiGetV1TradePairDetailData } from '@/typings/yapi/TradePairDetailV1GetApi'
import { WsThrottleTimeEnum } from '@/constants/ws'
import { decimalUtils } from '@nbit/utils'
import { useMarketListStore } from '@/store/market/market-list'
import HorizontalScrollBar from '@/components/horizontal-scroll-bar'
import { usePrevious, useSafeState } from 'ahooks'
import { KLineChartType } from '@nbit/chart-utils'
import { useContractMarketStore } from '@/store/market/contract'
import { MarketLisModulesEnum } from '@/constants/market/market-list'
import { useOrderBookStore } from '@/store/order-book'
import { getV1PerpetualAssetsFeeRateCurrentApiRequest } from '@/apis/market/futures'
import { formatCurrency } from '@/helper/decimal'
import CountDown from '@/components/count-down'
import { Spin } from '@nbit/arco'
import { MarketSectorBadage } from '@/features/market/real-time-quote/market-sector-badage'
import { OrderBookContractMarketSubs, OrderBookSpotMarketSubs } from '@/store/order-book/common'
import Styles from './index.module.css'
import { MarketListActiveTradeLayout } from '../market-list/market-list-trade-spot-layout'
import { initCurrentCoin } from '../../../constants/market/index'

interface RealTimeQuoteProps {
  type: KLineChartType
}

function RealTimeQuote(props: RealTimeQuoteProps) {
  let currentModule

  const pageContext = usePageContext()
  const marketState = useMarketStore()
  const contractMarketState = useContractMarketStore()
  const orderBookStore = useOrderBookStore()

  const { contractMarkPrice: markPrice, contractIndexPrice: indexPrice } = orderBookStore

  const ws = props.type === KLineChartType.Futures ? futureWs : spotWs
  const marketTradeStore =
    useMarketListStore()[
      props.type === KLineChartType.Futures
        ? MarketLisModulesEnum.futuresMarketsTrade
        : MarketLisModulesEnum.spotMarketsTrade
    ]

  const symbolName = translateUrlToParams(pageContext.routeParams.id)
  const tempRef = useRef<any>()

  const controlRef = useRef<boolean>(true)
  if (props.type === KLineChartType.Quote) {
    currentModule = marketState
  } else {
    currentModule = contractMarketState
  }

  // 获取币对标题的位置
  const symboTitleRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!symboTitleRef.current) return
    marketTradeStore.setTradeAreaLeftOffset(symboTitleRef.current.getBoundingClientRect().x)
  }, [symboTitleRef.current])

  const priceOffset = Number(currentModule.currentCoin.priceOffset) || 4
  const amountOffset = Number(currentModule.currentCoin.amountOffset) || 4

  const [monenyRate, setMonenyRate] = useSafeState({
    rate: 0,
    time: 0,
  })

  const [settle, setSettle] = useSafeState({
    settleTimes: '',
    settleSpan: 0,
  })

  const MarketWs = {
    Sub: 1,
    UnSub: 0,
  }
  const [marketWs, setMarketWs] = useSafeState<number>(MarketWs.UnSub)

  useEffect(() => {
    setMarketWs(MarketWs.UnSub)
  }, [symbolName])

  useEffect(() => {
    const kLineCallback = data => {
      // 更新实时报价信息
      const _priceOffset = tempRef.current.priceOffset || 4
      const _amountOffset = tempRef.current.amountOffset || 4
      /** 如果页面已被销毁，就不设置值了，防止接口没有返回，页面已经切换了其它币种 */
      if (!controlRef.current) return

      if (data?.length) {
        currentModule.updateCurrentCoin({
          ...tempRef.current,
          chg: Number(data[0].chg).toFixed(_priceOffset),
          close: Number(data[0].close).toFixed(_priceOffset),
          high: Number(data[0].high).toFixed(_priceOffset),
          last: Number(data[0].last).toFixed(_priceOffset),
          low: Number(data[0].low).toFixed(_priceOffset),
          open: Number(data[0].open).toFixed(_priceOffset),
          volume: Number(data[0].volume).toFixed(_amountOffset),
          quoteVolume: Number(data[0].quoteVolume).toFixed(_amountOffset),
        })
      }
    }

    const subs =
      props.type === KLineChartType.Quote
        ? OrderBookSpotMarketSubs(tempRef.current?.symbolWassName)
        : OrderBookContractMarketSubs(tempRef.current?.symbolWassName)

    if (marketWs === MarketWs.Sub) {
      ws.subscribe({
        subs,
        callback: kLineCallback,
        throttleType: WSThrottleTypeEnum.increment,
        throttleTime: WsThrottleTimeEnum.Fast,
      })
    }

    return () => {
      // if (klineWs === KlineWs.unSub) {
      ws.unsubscribe({
        subs,
        callback: kLineCallback,
      })
      // }
    }
  }, [marketWs])

  useEffect(() => {
    /** 进来的时候设置为 true */
    controlRef.current = true
    Promise.all([
      props.type === KLineChartType.Quote
        ? getMarketTicker({ symbol: symbolName })
        : getV1PerpetualTradePairDetailApiRequest({ symbol: symbolName }),
      props.type === KLineChartType.Quote
        ? postV3FullDepth({ symbol: symbolName, limit: '1000' })
        : getPerpetualMarketRestV1MarketDepthApiRequest({ symbol: symbolName, limit: '1000' }),
    ]).then(([detailRes, deptRes]) => {
      if (detailRes.isOk) {
        // @ts-ignore
        const { id } = detailRes.data as YapiGetV1TradePairDetailData
        if (props.type === KLineChartType.Futures) {
          getV1PerpetualAssetsFeeRateCurrentApiRequest({ tradePairId: String(id) }).then(res => {
            if (res.isOk) {
              setMonenyRate({
                rate: res.data?.feeRate as number,
                time: res.data?.settleSpan as number,
              })
              if (res.data?.settleSpan) {
                setSettle({
                  settleTimes: res.data?.settleTimes as string,
                  settleSpan: res.data?.settleSpan,
                })
              }
            }
          })
        }
        /** 如果页面已被销毁，就不设置值了，防止接口没有返回，页面已经切换了其它币种 */
        if (!controlRef.current) return
        currentModule.updateCurrentCoin({
          ...currentModule.currentCoin,
          ...detailRes.data,
        })
        tempRef.current = detailRes.data

        if (tempRef.current?.id) {
          if (!controlRef.current) return
          setMarketWs(MarketWs.Sub)
        }
      }

      if (deptRes.isOk) {
        const asks = deptRes.data?.asks || []
        const bids = deptRes.data?.bids || []
        currentModule.updateCurrentInitPrice({
          buyPrice: bids[0]?.[0] || detailRes.data?.last,
          sellPrice: asks[0]?.[0] || detailRes.data?.last,
        })

        currentModule.updateDepthList(deptRes.data || {})
      }
    })
    return () => {
      controlRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolName])

  // 查看 state 里的 currentCoin 的信息是否健全，不健全的话从 allTradePairs 里面拿
  const coinData = currentModule.currentCoin.symbolName
    ? currentModule.currentCoin
    : currentModule.allTradePairs.find(x => x.symbolName === symbolName) || initCurrentCoin
  const coinFullName =
    currentModule.allCoinSymbolInfo.find(x => x.id === String(coinData.sellCoinId))?.coinFullName || ''
  const prevLast = usePrevious(coinData.last)

  return (
    <div className={Styles.scoped}>
      {currentModule?.currentCoin?.symbolName ? (
        <>
          <div className="symbol-wrap">
            <CollectStar needWrap={false} {...(coinData as any)} />
            <div
              className="market-popover-wrap flex flex-row justify-start items-center"
              onFocus={() => marketTradeStore.setIsSearchPopoverVisible(true)}
              onMouseOver={() => marketTradeStore.setIsSearchPopoverVisible(true)}
              onMouseLeave={() => marketTradeStore.setIsSearchPopoverVisible(false)}
            >
              <div className="symbol-title" ref={symboTitleRef}>
                <span>{getQuoteDisplayName({ coin: coinData })}</span>
                <span className="full-name">
                  {' '}
                  {props.type === KLineChartType.Quote ? coinFullName : t`assets.enum.tradeCoinType.perpetual`}
                </span>
              </div>
              <div className="market-icon">
                <MarketListActiveTradeLayout type={props.type} />
              </div>
            </div>

            <MarketSectorBadage type={props.type} coinData={coinData} />
            <div className="divide"></div>
          </div>
          <div className="price-wrap">
            <div className="col-price">
              <span className={classNames('last-price')}>
                {formatTradePair(coinData as any).lastWithDiffTarget(prevLast as any)}
              </span>
              <span className="cny">
                {props.type === KLineChartType.Quote
                  ? rateFilter({
                      amount: coinData.last,
                      symbol: coinData.quoteSymbolName,
                    })
                  : rateFilterFutures({
                      amount: coinData.last,
                      symbol: coinData.quoteSymbolName,
                    })}
              </span>
            </div>
            <HorizontalScrollBar>
              {props.type === KLineChartType.Futures && (
                <>
                  <div className="col-price">
                    <span>{t`future.funding-history.index-price.column.mark-price`}</span>
                    <span className="mark-price">
                      {markPrice || formatCurrency(currentModule?.currentCoin?.markPrice, priceOffset)}
                    </span>
                  </div>
                  <div className="col-price">
                    <span>{t`future.funding-history.index-price.column.index-price`}</span>
                    <span className="mark-price">
                      {indexPrice || formatCurrency(currentModule?.currentCoin?.indexPrice, priceOffset)}
                    </span>
                  </div>
                  <div className="col-price">
                    <span>
                      {t`future.funding-history.funding-rate.funding-rate`} /{' '}
                      {t`future.funding-history.funding-rate.countdown`}
                    </span>
                    {settle.settleSpan && <CountDown settle={settle} monenyRate={monenyRate} />}
                  </div>
                </>
              )}
              <div className="col-price">
                <span>24h {t`quote.common.change`}</span>
                <div className="change">
                  <IncreaseTag
                    delZero={false}
                    digits={priceOffset}
                    value={
                      decimalUtils
                        .getSafeDecimal(coinData.chg)
                        .mul(decimalUtils.getSafeDecimal(coinData.last))
                        .div(decimalUtils.getSafeDecimal(100)) as unknown as number
                    }
                  />
                  <IncreaseTag delZero={false} hasPostfix digits={2} value={coinData.chg} />
                </div>
              </div>
              <div className="col-price">
                <span>24h {t`quote.common.high`}</span>
                <span className="mark-price">{coinData.high}</span>
              </div>
              <div className="col-price">
                <span>24h {t`quote.common.low`}</span>
                <span className="mark-price">{coinData.low}</span>
              </div>
              <div className="col-price">
                <span>
                  24h {t`quote.common.volume`}({coinData.baseSymbolName})
                </span>
                <span className="mark-price">{formatTradePair({} as any).volume(coinData.volume)}</span>
              </div>
              <div className="col-price">
                <span>
                  24h {t`features_market_real_time_quote_index_5101265`}({coinData.quoteSymbolName})
                </span>
                <span className="mark-price">{formatTradePair({} as any).volume(coinData.quoteVolume)}</span>
              </div>
            </HorizontalScrollBar>
          </div>
        </>
      ) : (
        <Spin />
      )}
    </div>
  )
}

export default memo(RealTimeQuote)

import { Spin } from '@nbit/arco'
import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import classNames from 'classnames'
import cacheUtils from 'store'

import { KLineChart } from '@nbit/chart-web'
import {
  getTheme,
  ChartLayoutOptionsType,
  KLineChartData,
  MainIndicatorType,
  SubIndicatorType,
  SwitchTimeType,
  timeMap,
  tradingviewTimeMap,
  WSThrottleTypeEnum,
  sortMarketChartData,
} from '@nbit/chart-utils'
import { getIsLogin } from '@/helper/auth'

import { usePageContext } from '@/hooks/use-page-context'
import {
  getPerpetualMarketRestV1MarketIndexPriceKlinesApiRequest,
  getPerpetualMarketRestV1MarketKlinesApiRequest,
  getPerpetualMarketRestV1MarketMarketPriceKlinesApiRequest,
} from '@/apis/market'

import ws from '@/plugins/ws/futures'

import { YapiGetV1OrdersHistoryKlineListData } from '@/typings/yapi/OrdersHistoryKlineV1GetApi'
import { initMainIndicator, initSubIndicator, ChartKLineRequest } from '@/constants/market'
import { useSafeState } from 'ahooks'
import { WsThrottleTimeEnum } from '@/constants/ws'

import { useTradeStore } from '@/store/trade'

import { useUserStore } from '@/store/user'
import { UserUpsAndDownsColorEnum } from '@/constants/user'
// import { KLineChart, TradingView, Dept } from './src'
import HeaderRateData from './header-rate-data'

import styles from './chart.module.css'
import { SpotNotAvailable } from './not-available'
import Icon from '../icon'

interface PropsType {
  theme: string
  currentCoinInfo: any
  currentPriceType: string
}

dayjs.extend(customParseFormat)
dayjs.extend(isBetween)

enum ChartVersion {
  Tradingview = 'tradingview',
  Normal = 'normal',
  Dept = 'dept',
}

function KLine(props: PropsType) {
  let currentModule = props.currentCoinInfo

  const contractKline = {
    perpetual_index_kline: getPerpetualMarketRestV1MarketIndexPriceKlinesApiRequest,
    perpetual_market_kline: getPerpetualMarketRestV1MarketMarketPriceKlinesApiRequest,
    perpetual_kline: getPerpetualMarketRestV1MarketKlinesApiRequest,
  }
  const TradeStore = useTradeStore()

  const { layout } = TradeStore
  const useStore = useUserStore()

  const { personalCenterSettings } = useStore
  const colors = personalCenterSettings.colors || UserUpsAndDownsColorEnum.greenUpRedDown
  const isLogin = getIsLogin()

  const controlRef = useRef<boolean>(true)

  const priceOffset = Number(currentModule.currentCoin.priceOffset) || 4
  const amountOffset = Number(currentModule.currentCoin.amountOffset) || 4

  const { bgColor, textColor, brandColor, upColor, downColor, textColor01 } = getTheme()
  const [ordersKlineData, setOrdersKlineData] = useSafeState<YapiGetV1OrdersHistoryKlineListData[]>([])
  const [currentChart, setCurrentChart] = useSafeState<string>(ChartVersion.Normal)
  const [curData, setCurData] = useSafeState<Array<KLineChartData>>([])
  const [getDataAndUpdateChart, setGetDataAndUpdateChart] = useSafeState<number>(0)

  const currentPriceTypeRef = useRef('perpetual_kline')
  const curDataRef = useRef<Array<KLineChartData>>([])
  const onlineRef = useRef<boolean>(true)
  const firstLoadRef = useRef<boolean>(false)
  const pageVisibelRef = useRef<boolean>(false)
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const [mainIndicator, setMainIndicator] = useSafeState<MainIndicatorType>(initMainIndicator)

  const pageContext = usePageContext()
  const locale = pageContext.locale || ''
  const currentModuleRef = useRef<any>(null)
  const childRef = useRef<{
    updateCandlestickData: (data) => void
    updateTimeData: (data) => void
    updateVolumeData: (data) => void
    updateMaData: () => void
    updateWrData: () => void
    updateRsiData: () => void
    updateKdjData: () => void
    updateBollData: () => void
    updateMacdData: () => void
    scrollToTime: (v) => void
  }>()

  const modalRef = useRef<{
    openChartSettingModal: () => void
  }>()

  useEffect(() => {
    currentModuleRef.current = currentModule
  }, [currentModule])

  const [subIndicator, setSubIndicator] = useSafeState<SubIndicatorType>(initSubIndicator)

  const mainIndicatorStorage = cacheUtils.get('mainIndicator') || '{}'
  const subIndicatorStorage = cacheUtils.get('subIndicator') || '{}'

  const KlineWs = {
    Sub: 1,
    unSub: 0,
    OutSub: 2,
  }
  const [klineWs, setKlineWs] = useState<number>(KlineWs.unSub)

  currentPriceTypeRef.current = props.currentPriceType

  useEffect(() => {
    if (props.currentPriceType) {
      setKlineWs(KlineWs.unSub)
    }
  }, [props.currentPriceType])

  useEffect(() => {
    if (!currentModule.currentCoin.symbolName) {
      return
    }
    let chartRequestInterval

    chartRequestInterval = setInterval(() => {
      if (!navigator.onLine) {
        onlineRef.current = false
      } else {
        if (!onlineRef.current) {
          controlRef.current = false
          getKlineHistoryData(currentModule.currentCoin.symbolName, curTimeRef.current, null, ChartKLineRequest.OutLine)
        }
      }
    }, 10000)

    const visibleChange = () => {
      // 页面变为可见时触发
      if (document.visibilityState === 'visible') {
        controlRef.current = false
        setKlineWs(KlineWs.unSub)
        pageVisibelRef.current = true
        requestAnimationFrame(() => {
          getKlineHistoryData(currentModule.currentCoin.symbolName, curTimeRef.current, null, ChartKLineRequest.OutLine)
        })
      }
    }
    document.addEventListener('visibilitychange', visibleChange)
    return () => {
      clearInterval(chartRequestInterval)
      document.removeEventListener('visibilitychange', visibleChange)
    }
  }, [currentModule.currentCoin.symbolName])

  useEffect(() => {
    if (mainIndicatorStorage.ma) {
      setMainIndicator(mainIndicatorStorage)
    }

    if (subIndicatorStorage.macd) {
      setSubIndicator(subIndicatorStorage)
    }
  }, [JSON.stringify(mainIndicatorStorage), JSON.stringify(subIndicatorStorage)])

  const [curTime, setCurTime] = useSafeState<SwitchTimeType>({
    unit: 'm',
    value: 15,
  })

  const [chartLayoutOptions, setChartLayoutOptions] = useSafeState<
    ChartLayoutOptionsType & { fontSize: number; fontFamily: string }
  >({
    background: {
      color: bgColor,
    },
    textColor,
    fontSize: 10,
    fontFamily:
      "DINPro, -apple-system, system-ui, 'PingFang SC', 'Microsoft Yahei', 'Heiti SC', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  })

  const curTimeRef = useRef<SwitchTimeType>(curTime)

  useEffect(() => {
    const kLineCallback = data => {
      // 更新实时报价信息
      /** 如果页面已被销毁，就不设置值了，防止接口没有返回，页面已经切换了其它币种 */
      if (!controlRef.current) return
      if (pageVisibelRef.current) {
        setGetDataAndUpdateChart(new Date().valueOf() + 1)
        pageVisibelRef.current = false
      }
      if (data?.[0]?.time) {
        if (currentModuleRef.current?.currentCoin.symbolWassName !== data?.[0]?.symbolWassName) {
          return
        }
        data.forEach(item => {
          const value = {
            time: Number(item.time),
            open: Number(item.open),
            /** 后端返回数据有时候最高价小于开盘价，前端容错 */
            high: item.high < item.open ? item.open : item.high,
            low: item.low < item.close ? item.low : item.close,
            close: Number(item.close),
            volume: Number(item.volume),
            quoteVolume: Number(item.quoteVolume),
          }
          if (curDataRef.current?.length) {
            /** 图表拉取数据时，ws要根据当前选择的时间，来调整k线柱子，比如1小时k线，ws就在1小时跳动，这里要加入时间的判断 */
            const lastValue = Number(curDataRef.current[curDataRef.current.length - 1]?.time)
            /** 时间不等时，判断图表所处时间范围 */

            /** sentry出现ws返回的时间比k线时间小的情况，按理说是不会的，容错处理 */
            if (value.time >= lastValue) {
              if (
                lastValue === value.time ||
                (value.time > lastValue &&
                  value.time <
                    lastValue +
                      Number(tradingviewTimeMap[`${curTimeRef.current.value}${curTimeRef.current.unit}`]) * 60 * 1000)
              ) {
                const newCurData = curDataRef.current.map((item, index) => {
                  if (index === curDataRef.current.length - 1) {
                    return {
                      ...value,
                      open: item.open,
                      volume: Number((value.volume + (item.volume || 0)).toFixed(amountOffset)),
                      quoteVolume: Number((value.quoteVolume + (item.quoteVolume || 0)).toFixed(amountOffset)),
                      high: value.high > item.high ? value.high : item.high,
                      low: value.low < item.low ? value.low : item.low,
                      time: item.time,
                    }
                  }
                  return item
                })
                // setCurData(sortMarketChartData(newCurData))
                curDataRef.current = newCurData
                updateIndSetting()
              } else {
                const newCurData = sortMarketChartData(curDataRef.current.concat([value]))
                // setCurData(newCurData)
                curDataRef.current = newCurData
              }

              const newValue = curDataRef.current[curDataRef.current.length - 1]
              if (curTime.unit === 'time') {
                childRef.current?.updateTimeData({
                  ...newValue,
                  value: newValue.close,
                })
              } else {
                childRef.current?.updateCandlestickData(newValue)
              }
              childRef.current?.updateVolumeData({
                ...newValue,
                time: newValue.time,
                value: newValue.volume,
                quoteVolume: newValue.quoteVolume,
                dir: newValue.close > newValue.open ? 'rise' : 'fall',
              })
            }
          }
        })
      }
    }
    const subs = {
      biz: 'perpetual',
      type: currentPriceTypeRef.current,
      base: currentModuleRef.current?.currentCoin.baseSymbolName,
      quote: currentModuleRef.current?.currentCoin.quoteSymbolName,
      contractCode: currentModuleRef.current?.currentCoin.symbolWassName,
    }
    if (klineWs === KlineWs.Sub || klineWs === KlineWs.OutSub) {
      ws.subscribe({
        subs,
        callback: kLineCallback,
        throttleType: WSThrottleTypeEnum.increment,
        throttleTime: WsThrottleTimeEnum.Market,
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
  }, [klineWs])

  useEffect(() => {
    setKlineWs(KlineWs.unSub)
    return () => {
      controlRef.current = false
      curDataRef.current = []
      setCurData([])
    }
  }, [currentModule.currentCoin.symbolName])

  useEffect(() => {
    curTimeRef.current = curTime
  }, [curTime.value, curTime.unit])

  useEffect(() => {
    const _bgColor = getTheme().bgColor
    const _textColor = getTheme().textColor
    setChartLayoutOptions({
      background: {
        color: _bgColor,
      },
      textColor: _textColor,
      fontSize: 10,
      fontFamily:
        "DINPro, -apple-system, system-ui, 'PingFang SC', 'Microsoft Yahei', 'Heiti SC', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    })
  }, [props.theme])

  /** ws 更新图表指标 */
  const updateIndSetting = () => {
    /** 如果设置了下面的指标，在 ws 改变的时候，会同时改变下面的指标，切换时间指标后，会导致可能出现 ws 数据不对的情况 */
    childRef.current?.updateMaData()
    childRef.current?.updateWrData()
    childRef.current?.updateRsiData()
    childRef.current?.updateKdjData()
    childRef.current?.updateBollData()
    childRef.current?.updateMacdData()
  }

  const apiTimeRef = useRef<Array<number>>([])

  let apiRequest = contractKline[currentPriceTypeRef.current]

  /** 请求 k 线数据 */
  const getKlineHistoryData = (symbolName, timeSharing, param?, requestType?) => {
    controlRef.current = true
    const symbol = symbolName
    const time = timeMap[`${timeSharing.value}${timeSharing.unit}`]
    const params = {
      symbol,
      interval: time,
      limit: String(24 * 60),
      endTime: param?.time || undefined,
    }
    let apiRequest = contractKline[currentPriceTypeRef.current]

    apiRequest(params).then(res => {
      if (res.isOk) {
        /** 如果页面已被销毁，就不设置值了，防止接口没有返回，页面已经切换了其它币种 */
        if (!controlRef.current) return
        const klineData: Array<KLineChartData> = []
        if (res.data?.list?.length) {
          res.data?.list?.forEach(item => {
            const barValue = {
              time: Number(item[6]),
              open: Number(item[0]),
              close: Number(item[3]),
              quoteVolume: Number(item[5]),
              volume: Number(item[4]),
              /** 后端返回数据有时候最高价小于开盘价，前端容错 */
              high: Number(item[1]) < Number(item[0]) ? Number(item[0]) : Number(item[1]),
              low: Number(item[2]) > Number(item[3]) ? Number(item[3]) : Number(item[2]),
            }
            klineData.push(barValue)
          })

          if (requestType === ChartKLineRequest.OutLine) {
            onlineRef.current = true
          }

          /** 滚动图表，如果接口返回的数据为空，就把之前的数据返回 */
          if (param?.time) {
            setCurData(sortMarketChartData(klineData).concat(curDataRef.current))
            curDataRef.current = sortMarketChartData(sortMarketChartData(klineData).concat(curDataRef.current))
          } else {
            /** 如果不是滚动的时候拉取数据，就把已记录的时间清空，这么做是为了防止图表滚动到最左侧的时候，频繁的去拉取接口 */
            apiTimeRef.current = []

            setCurData(sortMarketChartData(klineData))
            // if (requestType !== ChartKLineRequest.OutLine) {
            curDataRef.current = sortMarketChartData(klineData)
            // }
          }
          setGetDataAndUpdateChart(new Date().valueOf())
          /** 非依赖请求 k 线时，不需要重新订阅 */
          if (!requestType) {
            setKlineWs(KlineWs.Sub)
          }
          if (requestType === ChartKLineRequest.OutLine) {
            setKlineWs(KlineWs.OutSub)
          }
        } else {
          if (param?.time) {
            let value: any = apiTimeRef.current
            apiTimeRef.current = value.concat([param.time])
          } else {
            apiTimeRef.current = []
          }
        }
      }
    })
  }

  /** 图表滚动的时候去拉去更多的数据，拼接在图表数据的头部 */
  const getMoreKlineData = param => {
    if (apiTimeRef.current?.indexOf(param.time) !== -1) {
      return
    }
    getKlineHistoryData(currentModule.currentCoin.symbolName, curTimeRef.current, param, ChartKLineRequest.More)
  }

  useEffect(() => {
    if (!currentModule.currentCoin.symbolName) {
      return
    }

    setCurData([])
    curDataRef.current = []
    if (currentModule.currentCoin.id && curTime.value) {
      getKlineHistoryData(currentModule.currentCoin.symbolName, curTime)
    }

    return () => {
      controlRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentModule.currentCoin.symbolName,
    curTime.unit,
    curTime.value,
    isLogin,
    layout.kLineHistory,
    currentPriceTypeRef.current,
  ])

  const [openChartProperties, setOpenChartProperties] = useSafeState<string>('')

  const updateFirstLoadRef = () => {
    firstLoadRef.current = true
  }

  const updateMainIndicator = v => {
    setMainIndicator(v)
  }

  const updateSubIndicator = v => {
    setSubIndicator(v)
  }

  return (
    <div className={styles.scoped} ref={fullscreenRef} id="fullscreen">
      <SpotNotAvailable className="not-avi" tradeCoin={currentModule.currentCoin}>
        <HeaderRateData
          ref={modalRef}
          currentChart={currentChart}
          setCurrentChart={setCurrentChart}
          locale={locale}
          mainIndicator={mainIndicator}
          setMainIndicator={setMainIndicator}
          setOpenChartProperties={setOpenChartProperties}
          subIndicator={subIndicator}
          setSubIndicator={setSubIndicator}
          curTime={curTime}
          setCurTime={setCurTime}
          fullscreenRef={fullscreenRef}
          updateFirstLoadRef={updateFirstLoadRef}
        />
        <div className={classNames('chart-wrap')}>
          <div
            className={classNames('chart-common', {
              show: currentChart === ChartVersion.Normal,
              hidden: currentChart !== ChartVersion.Normal,
            })}
          >
            {currentChart === ChartVersion.Normal &&
              (curDataRef.current.length && curData?.length ? (
                <KLineChart
                  theme={props.theme}
                  chartLayoutOptions={chartLayoutOptions}
                  data={curData}
                  curDataRef={curDataRef.current}
                  locale={locale}
                  createChart={{ brandColor, upColor, downColor, bgColor, textColor, textColor01 }}
                  mainIndicator={mainIndicator}
                  updateMainIndicator={updateMainIndicator}
                  subIndicator={subIndicator}
                  updateSubIndicator={updateSubIndicator}
                  curTime={curTime}
                  ref={childRef}
                  modalRef={modalRef.current}
                  ordersKlineData={ordersKlineData}
                  expandIcon={<Icon name="arrow_open" hasTheme className="expand-icon" />}
                  chartSettingIcon={{
                    hidden: <Icon name="spot_hidden" hasTheme className="expand-icon" />,
                    setting: <Icon name="icon_spot_set" hasTheme className="expand-icon" />,
                    delete: <Icon name="spot_close" hasTheme className="expand-icon" />,
                    hiddenHover: <Icon name="spot_hidden_hover" hasTheme className="expand-icon" />,
                    settingHover: <Icon name="icon_spot_set_hover" hasTheme className="expand-icon" />,
                    deleteHover: <Icon name="spot_close_hover" hasTheme className="expand-icon" />,
                  }}
                  coinInfo={{
                    baseSymbolName: currentModule.currentCoin.baseSymbolName,
                    quoteSymbolName: currentModule.currentCoin.quoteSymbolName,
                  }}
                  getDataAndUpdateChart={getDataAndUpdateChart}
                  getMoreKlineData={getMoreKlineData}
                  offset={{ priceOffset, amountOffset }}
                  updateMarketChangesTime={currentModule.updateMarketChangesTime}
                  colors={colors}
                />
              ) : (
                <div className="spin-wrap">
                  <Spin />
                </div>
              ))}
          </div>
        </div>
      </SpotNotAvailable>
    </div>
  )
}

export default KLine

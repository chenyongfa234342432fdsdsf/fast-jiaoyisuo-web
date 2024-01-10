import { decimalUtils } from '@nbit/utils'
import { KLineChartData } from '@nbit/chart-utils'
import { formatNumberDecimal } from '@/helper/decimal'
import { formatDate } from '@/helper/date'
import { rateFilter, rateFilterFutures } from '@/helper/assets'
import { IncreaseTag } from '@nbit/react'
import { ICommonTradePairType } from '@/typings/api/market'
import { baseMarketStore } from '@/store/market'
import { ILinkConfig, link } from '@/helper/link'
import { down_color_class, initCurrentCoin, initDescribe, up_color_class } from '@/constants/market'
import { baseMarketListStore } from '@/store/market/market-list'
import { CommonTradePairDataWithMarketCap } from '@/typings/api/market/market-list'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import { UserCurrencyNameEnum, UserCurrencySymbolEnum } from '@/constants/user'
import { I18nsEnum } from '@/constants/i18n'
import { isNaN, memoize } from 'lodash'
import { baseCommonStore } from '@/store/common'
import { baseContractMarketStore, useContractMarketStore } from '@/store/market/contract'
import {
  checkTradePairType,
  getFuturesTypeNameByType,
  GlobalSearchTypesMappingEnum,
  MarketLisModulesEnum,
} from '@/constants/market/market-list'
import { baseOrderBookStore } from '@/store/order-book'
import { calMarketCap } from '@/helper/market/market-list'
import { YapiGetV1PerpetualTradePairListData } from '@/typings/yapi/PerpetualTradePairListV1GetApi'
import { basePersonalCenterStore } from '@/store/user/personal-center'
import { t } from '@lingui/macro'
import { getBusinessName } from './common'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

/**
 * 计算两个值相对涨跌
 * 已经封装在 marketUtils.getColorClassByPrice
 * @param price 当前价格
 * @param target 目标价格，可空，如果不传就是和 0 进行比较
 * @returns 'text-buy_up_color' | 'text-sell_down_color' | ''
 */
function getColorClassByPrice(price?: number | string, target: number | string = 0): string {
  if (!price || price === '--' || (!target && target !== 0) || target === '--') {
    return ''
  }
  const _price = decimalUtils.getSafeDecimal(price)
  const _targetPrice = decimalUtils.getSafeDecimal(target)
  if (_price.gt(_targetPrice)) {
    return up_color_class
  } else if (_price.eq(_targetPrice)) {
    return ''
  } else {
    return down_color_class
  }
}

/** 当前行情币对，ws 传给后端 */
const getCurrentQuoteApiCoin = (sellSymbol: string, buySymbol: string): string => {
  return `${sellSymbol}_${buySymbol}`.toLowerCase()
}

/** 当前行情币对 页面展示 */
const getCurrentQuoteShowCoin = (
  sellSymbol: string,
  buySymbol: string,
  hasColorContrast = false
): string | JSX.Element => {
  if (!hasColorContrast) return `${sellSymbol}/${buySymbol}`
  else
    return (
      <>
        <span className="base-symbol-name">{sellSymbol}</span>
        <span className="text-text_color_02 quote-symbol-name">/{buySymbol}</span>
      </>
    )
}

/**
 * 获取币对的统一展示名称
 */
export const getQuoteDisplayName = ({
  coin,
  spot = {},
  futures = {},
  onClickProps = {},
}: {
  coin:
    | YapiGetV1PerpetualTradePairListData
    | YapiGetV1TradePairListData
    | { baseSymbolName?: string; quoteSymbolName?: string }
  spot?: {
    // 现货计价币是否有颜色对比
    hasColorContrast?: boolean
  }
  futures?: {
    // 是否包含包含币对的类型，如合约的永续、交割
    withSymbolType?: boolean
    // 合约类型是否有背景色等 css
    withSymbolTypeCss?: boolean
  }
  onClickProps?: {
    redirect?: boolean
    isHistoryInPlace?: boolean
  }
}): string | JSX.Element => {
  const type = checkTradePairType(coin)

  // 通过传入的币对 typeInd 字段来判别
  switch (type) {
    case GlobalSearchTypesMappingEnum.futures: {
      const item = coin as YapiGetV1PerpetualTradePairListData
      const { withSymbolType, withSymbolTypeCss } = futures

      return (
        <span
          className={`flex whitespace-nowrap pair-name pair-name-futures ${
            onClickProps.redirect ? 'cursor-pointer' : ''
          }`}
          onClick={() => {
            onClickProps.redirect && onTradePairClickRedirect(item, {}, onClickProps.isHistoryInPlace)
          }}
        >
          <span className="base-symbol-name">{item.baseSymbolName}</span>
          <span className="quote-symbol-name">{item.quoteSymbolName}</span>
          {withSymbolType && !withSymbolTypeCss && (
            <span className="mx-1 symbol-type">{getFuturesTypeNameByType(item)}</span>
          )}
          {withSymbolType && withSymbolTypeCss && (
            <span className="bg-card_bg_color_02 px-[6px] py-[2px] text-xs ml-1 symbol-type-color">
              {getFuturesTypeNameByType(item)}
            </span>
          )}
        </span>
      )
    }

    default: {
      const item = coin as YapiGetV1TradePairListData
      const { hasColorContrast } = spot

      return (
        <span
          className={`flex whitespace-nowrap pair-name pair-name-spot ${onClickProps.redirect ? 'cursor-pointer' : ''}`}
          onClick={() => {
            onClickProps.redirect && onTradePairClickRedirect(item, {}, onClickProps.isHistoryInPlace)
          }}
        >
          <span className="base-symbol-name">{item.baseSymbolName}</span>
          <span className={`quote-symbol-name ${hasColorContrast && 'text-text_color_02'}`}>
            {item.quoteSymbolName && `/${item.quoteSymbolName}`}
          </span>
        </span>
      )
    }
  }
}

/** 获取本地价格 */
const getLocaleCurrency = (currency: string, symbol: string): string => {
  return `≈${symbol}${currency}`
}

/** url 直接使用 url 传递的 symbolName */
export const translateUrlToParams = (url: string): string => {
  return url
}

/** 多语言映射到 */
const translateLocaleToTule = (locale: string): string => {
  return locale.replace('-', '_')
}

/** 判断是否包含用户收藏币种 */
const includeCoinId = (favoriteList: Array<number>, tradeId: number): boolean => {
  return favoriteList.indexOf(tradeId) !== -1
}

const sortMarketChartData = (data: Array<KLineChartData>) => {
  const sortData = data.sort((x, y) => {
    return x.time - y.time
  })
  const timeList: Array<number> = []
  const resultList: Array<KLineChartData> = []
  sortData.forEach(item => {
    if (timeList.indexOf(item.time) === -1) {
      timeList.push(item.time)
      resultList.push(item)
    }
  })
  return resultList
}

/** 合约 code */
const getCurrentContractCoin = (code: string): string => {
  return code.replace('_', '')
}

export {
  getCurrentQuoteApiCoin,
  getLocaleCurrency,
  getCurrentQuoteShowCoin,
  translateLocaleToTule,
  includeCoinId,
  sortMarketChartData,
  getCurrentContractCoin,
}
/** 合约实时成交转换为现货相同的格式 */
export function futureTradeListItemToSpot(item: any[]) {
  return {
    tradeId: item[4],
    ts: item[3],
    direction: item[2],
    amount: item[1],
    price: item[0],
  }
}

/** 合约实时成交 size */
export const ContractOrderbookSize = 30

/** 计算币种概况相关价格 */

export const calcCoinDescribePrice = (price, last) => {
  return formatNumberDecimal(SafeCalcUtil.mul(price, last), 2)
}

export const calcCoinDescribeTime = (price, time) => {
  return `${price}(${formatDate(time, 'YYYY/MM/DD')})`
}

export const getCoinRemarks = (info, expand) => {
  if (!info) {
    return ''
  }

  if (info.length <= 100 || expand) {
    return info
  }

  return `${info.substring(0, 97)}...`
}

export const getDefaultTradeUrl = () => {
  const store = baseMarketStore.getState()
  return `/trade/${store.defaultCoin.symbolName}`
}

export const useDefaultFuturesUrl = (groupId?: string) => {
  const futuresStore = useContractMarketStore()
  let url = `/futures/${futuresStore.defaultCoin.symbolName}`
  if (groupId) {
    url += `?selectgroup=${groupId}`
  }
  return url
}

export const onTradePairClickRedirect = (
  item: ICommonTradePairType,
  goConfig: ILinkConfig = {},
  // 是否改变历史快捷选择的位置，默认为改变
  isHistoryInPlace = false
) => {
  const activeModule = baseMarketListStore.getState().activeModule
  const type = checkTradePairType(item)

  switch (type) {
    case GlobalSearchTypesMappingEnum.futures:
      return onTradePairClickRedirectFutures(item, goConfig, isHistoryInPlace)
    default: {
      return onTradePairClickRedirectSpot(item, goConfig, isHistoryInPlace)
    }
  }
}

export const onTradePairClickRedirectFutures = (
  item: ICommonTradePairType,
  goConfig: ILinkConfig = {},
  // 是否改变历史快捷选择的位置，默认为改变
  isHistoryInPlace = false
) => {
  if (item.baseSymbolName && item.quoteSymbolName) {
    const store = baseContractMarketStore.getState()
    if (item.id === store.currentCoin.id) {
      return
    }
    store.updateCurrentCoin(initCurrentCoin)
    store.updateCurrentCoinDescribe(initDescribe)
    store.updateCoinSelectedHistoryList([item] as YapiGetV1TradePairListData[], isHistoryInPlace)
    link(`/futures/${item.symbolName}`, goConfig)
  }
}

export const onTradePairClickRedirectSpot = (
  item: ICommonTradePairType,
  goConfig: ILinkConfig = {},
  // 是否改变历史快捷选择的位置，默认为改变
  isHistoryInPlace = false
) => {
  if (item.baseSymbolName && item.quoteSymbolName) {
    const store = baseMarketStore.getState()
    const marketListStore = baseMarketListStore.getState().spotMarketsTradeModule
    if (item.id === store.currentCoin.id) {
      return
    }
    store.updateCurrentCoin(initCurrentCoin)
    store.updateCurrentCoinDescribe(initDescribe)
    store.updateCoinSelectedHistoryList([item] as YapiGetV1TradePairListData[], isHistoryInPlace)
    marketListStore.isSearchPopoverVisible && marketListStore.setIsSearchPopoverVisible(false)

    // 直接传 symbolName
    link(`/trade/${item.symbolName}`, goConfig)
  }
}

/**
  格式化法币字符串,如:$100.00,¥0.00123
  精度取值规则:
  -整数位>0时,保留2位小数.
  -小数位第一位>0时,保留2位小数位;
  -小数位第一位=0时,往后判断;保留位数为n+3(n:0的个数);
  -最多保留6位小数
*/
export function getPrecisionByRule(value) {
  // Convert the value to a number and handle NaN or invalid inputs
  const numberValue = parseFloat(value)
  if (isNaN(numberValue) || !isFinite(numberValue)) {
    return 0
  }

  // Check if the value is zero
  if (numberValue === 0) {
    return 2
  }

  // Convert the value to a string for easier manipulation
  const valueStr = numberValue.toString()

  // Split the value into integer and decimal parts
  const [integerPart, decimalPart] = valueStr.split('.')

  // Check if the integer part is greater than 0
  if (parseInt(integerPart) > 0) {
    // Keep 2 decimal places
    return 2
  } else {
    // Check if the first decimal place is greater than 0
    if (parseInt(decimalPart[0]) > 0) {
      // Keep 2 decimal places
      return 2
    } else {
      // Count the number of zeros after the first decimal place
      let countZeros = 0
      for (let i = 0; i < decimalPart.length; i += 1) {
        if (decimalPart[i] === '0') {
          countZeros += 1
        } else {
          break
        }
      }

      const targetPrecision = countZeros + 3
      // Determine the precision based on the count of zeros
      const precision = Math.min(Math.min(targetPrecision, decimalPart.length), 6)

      // Keep the desired precision
      return precision
    }
  }
}

/**
 *
 *  根据语言设置，加单位后缀来简写数字
 *  en-US：K M B..., 比如 1000 -> 1K
 *  zh-CN：万 亿 万亿...，比如 10000 -> 1 万
 * @param withCurrencyPrefix 是否加法币前缀，由用户币种偏好来定
 * @param precision 简写之后的保留几位小数，四舍五入，默认两位小数
 */
export const convertToMillions = (val: number | string, withCurrencyPrefix = true, precision = 2) => {
  if (isNaN(val as any)) return val
  const locale = baseCommonStore.getState().locale
  const str = getFormatterByCurrencySymbol({ lang: locale, precision }).format(Number(val || 0))
  const [integers = '', digitsWithUnit = ''] = str.split('.')
  // 考虑多个字符的单位，如万亿，使用 regex 抓取
  const [_, digits = '', resolvedUnit = ''] = Array.from(digitsWithUnit.match(/^(\d*)(.*)$/) || [])
  // 多保留一位小数，下一步四舍五入
  const resolvedDigits = digits.slice(0, precision + 1)
  const resolvedNum = Number(`${integers}${resolvedDigits ? `.${resolvedDigits}` : ''}`).toFixed(precision)
  const resolvedVal = resolvedUnit ? `${resolvedNum}${resolvedUnit}` : resolvedNum

  // 单位按照用户偏好设置
  const { currencySymbol } = basePersonalCenterStore.getState().fiatCurrencyData

  return withCurrencyPrefix ? `${currencySymbol}${resolvedVal}` : `${resolvedVal}`
}

/**
 * 根据用户的币种偏好来获取数字多语言格式化实例
 * @param lang 语言偏好
 * @param precision 保留精度
 * @ref NumberFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
 * @ref 产品数值规范 https://products.admin-devops.com/result/nb%20global%20app/#g=1&p=%E6%95%B0%E5%80%BC%E8%A7%84%E8%8C%83
 */
export const getFormatterByCurrencySymbol = memoize(({ lang, precision }: { lang: I18nsEnum; precision: number }) => {
  let formatter: Intl.NumberFormat
  const totalLength = precision + 4

  const commonOptions: any = {
    notation: 'compact',
    // minimumFractionDigits，maximumFractionDigits 在部分电脑 safari 无法保留制定精度
    minimumSignificantDigits: totalLength,
    maximumSignificantDigits: totalLength,
  }

  switch (lang) {
    case I18nsEnum['zh-CN']:
      formatter = new Intl.NumberFormat(lang, {
        ...commonOptions,
      })
      break

    case I18nsEnum['zh-HK']:
      formatter = new Intl.NumberFormat('zh-Hant', {
        ...commonOptions,
      })
      break

    default:
      formatter = new Intl.NumberFormat(lang, {
        ...commonOptions,
      })
      break
  }

  return formatter
})

export const getResolvedRateFilter = (item: any) =>
  checkTradePairType(item) === GlobalSearchTypesMappingEnum.futures ? rateFilterFutures : rateFilter

export function formatTradePair(item: CommonTradePairDataWithMarketCap) {
  const priceOffset = Number(item.priceOffset || baseMarketStore.getState().currentCoin.priceOffset || 4)
  const amountOffset = Number(item.amountOffset || baseMarketStore.getState().currentCoin.amountOffset || 4)
  const resolvedRateFilter = getResolvedRateFilter(item)

  return {
    chg() {
      if (Number(item.chg) === 0) return '0.00%'
      return <IncreaseTag digits={2} delZero={false} value={item.chg} hasPostfix hasPrefix defaultEmptyText={'--'} />
    },
    last() {
      return (
        <IncreaseTag
          value={item.last}
          delZero={false}
          digits={priceOffset}
          kSign
          defaultEmptyText={'--'}
          hasPrefix={false}
          hasColor={false}
        />
      )
    },
    lastByUserPreference() {
      return (
        <>
          {resolvedRateFilter({
            amount: item.last || 0,
            showUnit: true,
            symbol: item.quoteSymbolName,
            precision: getPrecisionByRule(item.last),
          })}
        </>
      )
    },
    lastWithDiffTarget(prev?: number | string) {
      return (
        <IncreaseTag
          value={item.last}
          delZero={false}
          digits={priceOffset}
          kSign
          defaultEmptyText={'--'}
          hasPrefix={false}
          hasColor
          diffTarget={item.lastPrev || prev || item.last}
        />
      )
    },
    lastWithBase() {
      return (
        <>
          <span>{formatTradePair(item).last()} /</span>
          <span className="text-text_color_02">{formatTradePair(item).lastByUserPreference()}</span>
        </>
      )
    },
    marketCap() {
      return (
        <>
          {convertToMillions(
            Number(
              resolvedRateFilter({
                amount: formatNumberDecimal(item.calMarketCap || calMarketCap(item), priceOffset),
                showUnit: false,
                symbol: item.quoteSymbolName,
              })
            )
          )}
        </>
      )
    },
    // 成交量 简写 无前缀
    volumneWithMillionUnit() {
      return convertToMillions(item.quoteVolume || 0, false)
    },

    // 成交额 / 成交量 不缩略
    volume(val: string) {
      return (
        <IncreaseTag
          value={val}
          digits={amountOffset}
          delZero={false}
          kSign
          defaultEmptyText={'--'}
          hasPrefix={false}
          hasColor={false}
        />
      )
    },
  }
}

/** 获取盘口买一卖一价 */
export function getDepthFirstPrice() {
  const { bidsList, asksList } = baseOrderBookStore.getState()
  const sell = asksList?.[0]?.price
  const buy = bidsList?.[0]?.price
  return {
    sellPrice: sell === '--' ? null : sell,
    buyPrice: buy === '--' ? null : buy,
  }
}
/** 更具买卖方向判断是否有买一价卖一价 */
export function getHasDepthFirstPrice(isModeBuy) {
  const depthPrice = getDepthFirstPrice()
  if (isModeBuy) {
    return !!depthPrice.sellPrice
  }
  return !!depthPrice.buyPrice
}
/**  查找获取合约币对 */
export function getFutureTradePair(symbol: string) {
  return baseContractMarketStore.getState().allTradePairs.find(item => item.symbolName === symbol)
}

export function generateMarketDefaultSeoMeta(
  // TODO commTitle 备用，后面扩张
  keys: {
    title: string
    description?: string
    commTitle?: string
  },
  values?: any
) {
  const businessName = getBusinessName()
  if (!values) {
    values = { businessName }
  } else {
    values.businessName = businessName
  }
  return {
    title: keys.title,
    description: t({
      id: keys?.description || `helper_market_sector_index_2fx_qgeqgg`,
      values,
    }),
  }
}

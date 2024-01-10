import { getV1PerpetualTradePairDefaultApiRequest } from '@/apis/market/market-list'
import { tableSortHelper } from '@/helper/common'
import { baseContractMarketStore } from '@/store/market/contract'
import { ICommonTradePairType } from '@/typings/api/market'
import { YapiGetV1PerpetualTradePairDetailData } from '@/typings/yapi/PerpetualTradePairDetailV1GetApi'
import { YapiGetV1PerpetualTradePairListData } from '@/typings/yapi/PerpetualTradePairListV1GetApi'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import { getMergeModeStatus } from '@/features/user/utils/common'
import { t } from '@lingui/macro'
import { SorterResult } from '@nbit/arco/es/Table/interface'
import { sortBy } from 'lodash'

export enum MarketListRouteEnum {
  spot = '/markets/spot',
  futures = '/markets/futures',
  sector = '/markets/sector',
  sectorDetails = '/markets/details',
  sectorTable = '/markets/sector/table',
}

export const getRouteByModuleTabName = (moduleName: MarketLisModulesEnum) => {
  return {
    [MarketLisModulesEnum.spotMarkets]: MarketListRouteEnum.spot,
    [MarketLisModulesEnum.futuresMarkets]: MarketListRouteEnum.futures,
    [MarketLisModulesEnum.sector]: MarketListRouteEnum.sector,
  }[moduleName]
}

export enum MarketLisModulesEnum {
  spotMarkets = 'spot',
  futuresMarkets = 'futures',
  spotMarketsTrade = 'spotMarketsTradeModule',
  futuresMarketsTrade = 'futuresMarketsTradeModule',
  sector = 'sector',
  sectorDetails = 'sectorDetails',
}

export const getMarketListModuleList = () => {
  const isMergeMode = getMergeModeStatus()

  const spotMarkets = { title: t`store/market/market-list/index-0`, id: MarketLisModulesEnum.spotMarkets }
  const futuresMarkets = { title: t`store/market/market-list/index-1`, id: MarketLisModulesEnum.futuresMarkets }
  const sector = { title: t`store/market/market-list/index-2`, id: MarketLisModulesEnum.sector }

  return isMergeMode ? [futuresMarkets] : [spotMarkets, futuresMarkets, sector]
}

export enum FuturesTabsEnum {
  favorites = 'favoritesTab',
  total = 'totalTab',
  // uBase = 'usdt',
  // coinBase = 'other',
}

export const getFuturesTabs = () => {
  return [
    {
      title: t`store_market_market_list_futuresmarkets_index_2426`,
      id: FuturesTabsEnum.favorites,
    },
    {
      title: t`common.all`,
      id: FuturesTabsEnum.total,
    },
  ]
}

export enum SpotListApiParamsSortByEnum {
  symbolName = 'symbolName',
  chg = 'chg',
  volume = 'volume',
  last = 'last',
}

export enum SpotListApiParamsSortOrderTypeEnum {
  asc = 'asc',
  desc = 'desc',
}

/**
 *  value 需要和后端返回的类型对应
 *  keyof YapiGetV1TradePairSearchData
 */
export enum GlobalSearchTypesMappingEnum {
  // 'all' = 'all',
  'spot' = 'spot',
  'futures' = 'perpetual',
  // 'delivery' = 'delivery',
  // 'leverage' = 'leverage',
}

/**
 * 按照模块的顺序进行组合
 */
export const globalSearchDisplayModules: GlobalSearchTypesMappingEnum[] = [
  GlobalSearchTypesMappingEnum.spot,
  GlobalSearchTypesMappingEnum.futures,
  // GlobalSearchTypesMappingEnum.delivery,
  // GlobalSearchTypesMappingEnum.leverage,
]

export function globalSearchTypesMappingEnumMapToModule(type: GlobalSearchTypesMappingEnum) {
  switch (type) {
    case GlobalSearchTypesMappingEnum.spot:
      return MarketLisModulesEnum.spotMarkets

    case GlobalSearchTypesMappingEnum.futures:
      return MarketLisModulesEnum.futuresMarkets

    default:
      return null
  }
}

export const getGlobalSearchTypesList = () => {
  return [
    // 不展示
    // { title: t`common.all`, id: GlobalSearchTypesMappingEnum.all },
    { title: t`order.constants.marginMode.spot`, id: GlobalSearchTypesMappingEnum.spot },
    { title: t`future.funding-history.future-select.future`, id: GlobalSearchTypesMappingEnum.futures },
    // { title: t`constants_market_market_list_index_5101351`, id: GlobalSearchTypesMappingEnum.delivery },
    // { title: t`features/orders/order-columns/future-0`, id: GlobalSearchTypesMappingEnum.leverage },
  ]
}

// Spot Module
export enum SpotMarketBaseCurrenyEnum {
  favorites = 'favoritesTab',
}

export enum SpotMarketSectorCategoryEnum {
  total = 'totalTab',
}

export const spotMarketsBaseCurrencyFilter = () => [
  {
    title: t`store_market_market_list_futuresmarkets_index_2426`,
    id: SpotMarketBaseCurrenyEnum.favorites,
  },
]

export const spotMarketsCategoryFilter = () => [
  {
    title: t`common.all`,
    id: SpotMarketSectorCategoryEnum.total,
  },
]

/** 币对列表 前端 sort handler */
function sortMarketListData(
  data: YapiGetV1TradePairListData[],
  type: SpotListApiParamsSortByEnum,
  orderType: SpotListApiParamsSortOrderTypeEnum
) {
  // https://lodash.com/docs/4.17.15#sortBy
  return sortBy(data, [type], [orderType])
}

export function getTradePairTopRising(data: YapiGetV1TradePairListData[]) {
  return sortMarketListData(data, SpotListApiParamsSortByEnum.chg, SpotListApiParamsSortOrderTypeEnum.asc)
}

export function getTradePairTopFalling(data: YapiGetV1TradePairListData[]) {
  return sortMarketListData(data, SpotListApiParamsSortByEnum.chg, SpotListApiParamsSortOrderTypeEnum.desc)
}

export function getTradePairTopVolumne(data: YapiGetV1TradePairListData[]) {
  return sortMarketListData(data, SpotListApiParamsSortByEnum.volume, SpotListApiParamsSortOrderTypeEnum.desc)
}

export enum TradePairEnum {
  topRising = 'topRising',
  topFalling = 'topFalling',
  topVolumne = 'topVolumne',
}

export const tradePairDataHandlerMap = (type: TradePairEnum) => {
  switch (type) {
    case TradePairEnum.topFalling:
      return getTradePairTopRising

    case TradePairEnum.topRising:
      return getTradePairTopFalling

    case TradePairEnum.topVolumne:
      return getTradePairTopVolumne

    default:
      return null
  }
}

export enum ApiStatusEnum {
  default = 'default',
  fetching = 'fetching',
  succeed = 'succeed',
  failed = 'failed',
}

export enum MarketListFuturesEnum {
  delivery = 'delivery',
  perpetual = 'perpetual',
}

export function getFuturesTypeNameByType(item?: YapiGetV1PerpetualTradePairListData) {
  switch (item?.typeInd) {
    case MarketListFuturesEnum.delivery:
      return t`constants_market_market_list_index_5101351`
    case MarketListFuturesEnum.perpetual:
      return t`assets.enum.tradeCoinType.perpetual`
    default:
      return ''
  }
}

export function checkTradePairType(
  item?: YapiGetV1PerpetualTradePairListData | YapiGetV1TradePairListData | ICommonTradePairType
): GlobalSearchTypesMappingEnum {
  switch ((item as YapiGetV1PerpetualTradePairListData)?.typeInd) {
    case MarketListFuturesEnum.delivery:
    case MarketListFuturesEnum.perpetual:
      return GlobalSearchTypesMappingEnum.futures
    default:
      return GlobalSearchTypesMappingEnum.spot
  }
}

export const quoteVolumneTableSorter: SorterResult = {
  direction: 'descend',
  field: 'quoteVolume',
}

export const chgTableSorter: SorterResult = {
  direction: 'descend',
  field: 'chg',
}

export const sortBy24QuoteVolume = (data: any[]) => {
  const res = data.slice().sort((a, b) => tableSortHelper.common(quoteVolumneTableSorter, a, b))
  return res
}

export const getFuturesDefaultTradePair = () => {
  const store = baseContractMarketStore.getState()

  // getV1PerpetualTradePairDefaultApiRequest({}).then(res => {
  //   if (res.isOk && (res.data as any)?.symbolName) {
  //     const data = res.data as YapiGetV1PerpetualTradePairDetailData
  //     store.updateDefaultCoin(data)
  //     // store.updateCurrentCoin({ ...currentCoin, ...data })
  //   }
  // })
}

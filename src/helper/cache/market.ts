import cacheUtils from 'store'
import { YapiGetV1FavouriteListData } from '@/typings/yapi/FavouriteListV1GetApi'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import { MarketLisModulesEnum } from '@/constants/market/market-list'

/** 行情相关 */
export const cacheKeyMarketSpotAllTradePairs = 'MARKET_SPOT_ALL_TRADE_PAIRS'
export const cacheKeyMarketSpotAllCoinSymbolBasicInfo = 'MARKET_SPOT_ALL_Coin_Symbol_Basic_Info'

/** Market favourite list */
const storageSpotFavListKey = 'MARKET_SPOT_FAVOURITE_LIST'
const storageFuturesFavListKey = 'MARKET_FUTUREs_FAVOURITE_LIST'

export function getFavouriteListCache(type: 'spot' | 'futures') {
  return cacheUtils.get(type === 'spot' ? storageSpotFavListKey : storageFuturesFavListKey)
}

export function setFavouriteListCache(type: 'spot' | 'futures', data?: YapiGetV1FavouriteListData[]) {
  cacheUtils.set(type === 'spot' ? storageSpotFavListKey : storageFuturesFavListKey, data)
}

/** 现货交易区搜索选择记录 */
export const searchHistoryCacheKey = 'SPOT_TRADE_AREA_SEARCH_HISTORY'

export function getSearchHistoryCache(type: MarketLisModulesEnum) {
  return cacheUtils.get(`${searchHistoryCacheKey}_${type}`)
}

export function setSearchHistoryCache(type: MarketLisModulesEnum, list: YapiGetV1TradePairListData[]) {
  cacheUtils.set(`${searchHistoryCacheKey}_${type}`, list)
}

/** 合约币对历史选择记录 */
export const tradePairFuturesHistoryQuickSelectCacheKey = 'TRADE_PAIR_FUTURES_HISTORY_QUICK_SELECT'

export function getTradePairFuturesHistoryQuickSelectCache() {
  return cacheUtils.get(tradePairFuturesHistoryQuickSelectCacheKey)
}

export function setTradePairFuturesHistoryQuickSelectCache(list: YapiGetV1TradePairListData[]) {
  cacheUtils.set(tradePairFuturesHistoryQuickSelectCacheKey, list)
}

/** 币对历史选择记录 */
export const tradePairHistoryQuickSelectCacheKey = 'TRADE_PAIR_HISTORY_QUICK_SELECT'

export function getTradePairHistoryQuickSelectCache() {
  return cacheUtils.get(tradePairHistoryQuickSelectCacheKey)
}

export function setTradePairHistoryQuickSelectCache(list: YapiGetV1TradePairListData[]) {
  cacheUtils.set(tradePairHistoryQuickSelectCacheKey, list)
}

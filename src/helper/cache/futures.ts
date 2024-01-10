import cacheUtils from 'store'

/** 合约缓存下单交易类型 */
const tradeFuturesOrderTypes = 'TRADE_FUTURES_ORDER_TYPES'

export function getTradeFuturesOrderTypes() {
  return cacheUtils.get(tradeFuturesOrderTypes)
}

export function setTradeFuturesOrderTypes(type) {
  cacheUtils.set(tradeFuturesOrderTypes, type)
}

export const tradeFuturesOrderAssetsTypes = 'tradeFuturesOrderAssetsTypes'

export function getCacheTradeFuturesOrderAssetsTypes() {
  return cacheUtils.get(tradeFuturesOrderAssetsTypes)
}
export const futuresCurrentLeverageCache = 'futuresCurrentLeverageCache'

export function getFuturesCurrentLeverageCache() {
  return cacheUtils.get(futuresCurrentLeverageCache)
}
export function setFuturesCurrentLeverageCache(val) {
  return cacheUtils.set(futuresCurrentLeverageCache, val)
}

export function setCacheTradeFuturesOrderAssetsTypes(val) {
  return cacheUtils.set(tradeFuturesOrderAssetsTypes, val)
}

// 合约组点击合约页面可用的弹窗设置、资金开仓还是合约组开仓

const groupMarginSourceCacheMap = 'groupMarginSourceCacheMap'

export function getGroupMarginSourceCacheMap() {
  return cacheUtils.get(groupMarginSourceCacheMap)
}

export function setGroupMarginSourceCacheMap(type) {
  cacheUtils.set(groupMarginSourceCacheMap, type)
}
// 合约交易下单单位

const futuresTradeUnit = 'futuresTradeUnit'

export function getFuturesTradeUnit() {
  return cacheUtils.get(futuresTradeUnit)
}

export function setFuturesTradeUnit(type) {
  cacheUtils.set(futuresTradeUnit, type)
}

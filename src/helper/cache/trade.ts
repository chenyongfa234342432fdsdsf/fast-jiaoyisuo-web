import cacheUtils from 'store'

export const tradeLayout = 'TRADE_Layout'

export function getCacheTradeLayout() {
  return cacheUtils.get(tradeLayout)
}

export function setCacheTradeLayout(val) {
  return cacheUtils.set(tradeLayout, val)
}

export function removeCacheTradeLayout() {
  return cacheUtils.set(tradeLayout, '')
}

export const tradeSetting = 'TRADE_SETTING'

export function removeCacheTradeSetting() {
  return cacheUtils.set(tradeSetting, '')
}

export function getCacheTradeSetting() {
  return cacheUtils.get(tradeSetting)
}

export function setCacheTradeSetting(val) {
  return cacheUtils.set(tradeSetting, val)
}

// 交易下单单位

const tradeUnit = 'tradeUnit'

export function getTradeUnit() {
  return cacheUtils.get(tradeUnit)
}

export function setTradeUnit(type) {
  cacheUtils.set(tradeUnit, type)
}

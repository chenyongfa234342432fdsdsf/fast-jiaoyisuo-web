import cacheUtils from 'store'

/** 持仓 - 止盈止损本地设置 */
export const POSITION_STRATEGY_INFO = 'POSITION_STRATEGY_INFO'
export function getPositionStrategyCache() {
  return cacheUtils.get(POSITION_STRATEGY_INFO)
}
export function setPositionStrategyCache(data: any) {
  return cacheUtils.set(POSITION_STRATEGY_INFO, data)
}

/** 资产 - 合约相关本地设置 */
export const ASSETS_FUTURES_SETTING = 'ASSETS_FUTURES_SETTING'
export function getAssetsFuturesSettingCache() {
  return cacheUtils.get(ASSETS_FUTURES_SETTING)
}
export function setAssetsFuturesSettingCache(data: any) {
  return cacheUtils.set(ASSETS_FUTURES_SETTING, data)
}

/** 资产 - 合约相关本地设置 */
export const assetFuturesCache = 'ASSETS_FUTURES'
export function getAssetsFuturesCache() {
  return cacheUtils.get(assetFuturesCache)
}
export function setAssetsFuturesCache(data: any) {
  return cacheUtils.set(assetFuturesCache, data)
}
export function removeAssetsFuturesCache() {
  return cacheUtils.set(assetFuturesCache, '')
}

export const assetSetting = 'ASSET_SETTING'

export function getAssetSetting() {
  return cacheUtils.get(assetSetting)
}

export function setAssetSetting(val) {
  return cacheUtils.set(assetSetting, val)
}

export function removeAssetSetting() {
  return cacheUtils.set(assetSetting, '')
}

/** 资产 - 充提币 - 币种选择搜索历史 */
export const ASSETS_DEPOSIT_COIN_HISTORY = 'ASSETS_DEPOSIT_COIN_HISTORY'
export function getAssetsDepositCoinHistoryCache() {
  return cacheUtils.get(ASSETS_DEPOSIT_COIN_HISTORY)
}
export function setAssetsDepositCoinHistoryCache(data: any) {
  return cacheUtils.set(ASSETS_DEPOSIT_COIN_HISTORY, data)
}

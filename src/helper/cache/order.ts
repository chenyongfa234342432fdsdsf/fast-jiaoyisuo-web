import cacheUtils from 'store'
import { IBaseOrderFutureStore } from '@/store/order/future'
import { IBaseOrderSpotStore } from '@/store/order/spot'
import { cloneDeep, pick } from 'lodash'

const SPOT_ORDER_SETTINGS_KEY = 'SPOT_ORDER_SETTINGS_KEY'
const FUTURE_ORDER_SETTINGS_KEY = 'FUTURE_ORDER_SETTINGS_KEY'

export function getSpotOrderSettingsFromCache() {
  return cacheUtils.get(SPOT_ORDER_SETTINGS_KEY) as Pick<IBaseOrderSpotStore, 'orderSettings'>
}
export function setSpotOrderSettingsToCache(settings: IBaseOrderSpotStore) {
  return cacheUtils.set(SPOT_ORDER_SETTINGS_KEY, pick(cloneDeep(settings), ['orderSettings']))
}

export function getFutureOrderSettingsFromCache() {
  return cacheUtils.get(FUTURE_ORDER_SETTINGS_KEY) as Pick<IBaseOrderFutureStore, 'orderSettings'>
}
export function setFutureOrderSettingsToCache(settings: IBaseOrderFutureStore) {
  return cacheUtils.set(FUTURE_ORDER_SETTINGS_KEY, pick(cloneDeep(settings), ['orderSettings']))
}

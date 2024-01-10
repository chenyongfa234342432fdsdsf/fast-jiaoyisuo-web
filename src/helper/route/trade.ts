import { TradeOrderTypesEnum } from '@/constants/trade'

/**
 * 获取现货交易页面路由地址
 */
export function getTradeRoutePath(id: string, type?: TradeOrderTypesEnum) {
  let url = `/trade/${id}?type=${type || TradeOrderTypesEnum.market}`
  return url
}
/**
 * 获取合约交易页面路由地址
 */
export function getTradeFuturesRoutePath(id: string, type?: TradeOrderTypesEnum, groupId?: string) {
  let url = `/futures/${id}?type=${type || TradeOrderTypesEnum.market}`
  if (groupId) {
    url = `${url}&selectgroup=${groupId}`
  }
  return url
}

import { FundingHistoryTabIdEnum, FundingHistoryTypeEnum } from '@/constants/future/funding-history'
import { OrderTabTypeEnum, EntrustTypeEnum } from '@/constants/order'
import { FinancialRecordLogTypeEnum } from '@/constants/assets'
import { baseLayoutStore } from '@/store/layout'
import { link } from '@/helper/link'
import { getIsLogin } from '@/helper/auth'
import { HistoryTabTypeEnum } from '@/constants/c2c/advertise'

/** 获取现货订单页面路径 */
export function getSpotOrderPagePath(tab: OrderTabTypeEnum, entrustType?: EntrustTypeEnum) {
  return `/orders/spot/${tab}${entrustType ? `?type=${entrustType}` : ''}`
}
/** 获取合约订单页面路径 */
export function getFutureOrderPagePath(tab: OrderTabTypeEnum, entrustType?: EntrustTypeEnum) {
  return `/orders/future/${tab}${entrustType ? `?type=${entrustType}` : ''}`
}
type IGetFutureFundingRatePagePathParams = {
  type?: FundingHistoryTypeEnum
  tradeId?: any
  tab?: FundingHistoryTabIdEnum
}
/** 获取合约资金费率页面路径 */
export function getFutureFundingRatePagePath({
  type = FundingHistoryTypeEnum.fundingRate,
  tab = FundingHistoryTabIdEnum.usdt,
  tradeId,
}: IGetFutureFundingRatePagePathParams) {
  return `/futures/funding-history/${tab === FundingHistoryTabIdEnum.usdt ? '' : 'quarterly/'}${type}?tradeId=${
    tradeId || ''
  }`
}

/** 联系客服 */
export function linkToCustomerService() {
  const url = baseLayoutStore.getState().layoutProps?.customerJumpUrl
  link(url, { target: true })
}

/**
 * 获取 c2c 中心页面路径
 * @param uid 查看他人 uid 查看自己不传
 * @param type 0 默认进入我的广告单
 * @returns url
 */
export function getC2CCenterPagePath(uid = '', type = 0) {
  let url = '/c2c/center'

  if (uid) {
    url = `${url}?uid=${uid}`
  }

  if (type) {
    url = `${url}?&type=${type}`
  }

  return url
}

export function linkWithLoginCheck(path: string) {
  if (getIsLogin()) {
    return link(path)
  }

  return link(`login?redirect=${path}`)
}

/** c2c-去充值 */
export function getC2cTopupPageRoutePath() {
  return `/assets/main/deposit`
}

/** c2c-发布广告 */
export function getC2cPostAdvPageRoutePath() {
  return `/c2c/post/adv`
}

/** c2c-bid 交易详单 */
export function getC2cOrderBidDetailPageRoutePath(querystring: string) {
  return `/bid/trade/detail?${querystring}`
}

/**
 * c2c-商家广告单记录
 * @param type 0 默认进入我的广告单
 */
export function getC2cAdsHistoryPageRoutePath(type?: HistoryTabTypeEnum) {
  let url = '/c2c/ads/history'
  if (type) {
    url = `${url}?&type=${type}`
  }
  return url
}

/** c2c-广告单详情 */
export function getC2cAdvDetailPageRoutePath(id: string) {
  return `/c2c/adv/detail/${id}`
}

/** c2c-成为商家首页 */
export function getC2cMerchantPageRoutePath() {
  return `/c2c/merchant`
}

/** c2c-申请成为商家 */
export function getC2MerchantApplicationPageRoutePath() {
  return `/c2c/merchant/application`
}

/** c2c-历史订单 */
export function getC2cHistoryRecordsPageRoutePath() {
  return `/c2c/orders`
}
/** c2c-订单流程 */
export function getC2cOrderDetailPageRoutePath(id?: string) {
  return `/c2c/orders/detail/${id}`
}

/** c2c-快捷交易 */
export function getC2cOrderShortPageRoutePath() {
  return `/c2c/fast-trade`
}

/** 第三方交易 */
export function getThirdPartyPaymentPageRoutePath() {
  return `/c2c/third-party-payment`
}

/** c2c-C2C 交易 */
export function getC2cOrderC2CPageRoutePath() {
  return `/c2c/trade`
}

/** kyc 中心 */
export function getKycPageRoutePath() {
  return '/kyc-authentication-homepage'
}

/** 查看资产 */
export function getAssetsRoutePath() {
  return '/assets/c2c'
}

/** 查看财务记录 */
export function getFinancialRecordRoutePath() {
  return `/assets/financial-record?type=${FinancialRecordLogTypeEnum.main}`
}

/** maintenance page */
export function getMaintenanceRoutePath() {
  return '/maintenance'
}

/** c2c-bid 交易 */
export function getC2cOrderBidPageRoutePath() {
  return `/bid/trade`
}

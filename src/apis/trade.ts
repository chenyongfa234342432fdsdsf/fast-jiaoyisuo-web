import request, { MarkcoinRequest } from '@/plugins/request'
import {
  TradeSystemArgsReq,
  TradeSystemArgsResp,
  TradeDdvListReq,
  TradeDdvListRes,
  TradeOtcBalanceReq,
  TradeOtcBalanceReqResp,
  TradeOtcOrderReq,
  TradeOtcOrderResp,
  TradeOtcReleaseCheckReq,
  TradeOtcReleaseCheckResp,
  TradeMerchantInfoReq,
  TradeMerchantInfoResp,
  TradeBankInfoReq,
  TradeBankInfoResp,
} from '@/typings/trade'
import {
  YapiDtoundefined,
  YapiPostOtcMerchantAdvReleaseApiResponse,
} from '@/typings/yapi-old/OtcMerchantAdvReleasePostApi'
import {
  YapiDtoAdvReferenceParameterVo,
  YapiGetOtcMerchantAdvParamsApiRequest,
} from '@/typings/yapi-old/OtcMerchantAdvParamsGetApi'
import { YapiPostOtcMerchantAdvListApiRequest } from '@/typings/yapi-old/OtcMerchantAdvListPostApi'
import {
  YapiPostOtcMerchantAdvUpdateStatusApiRequest,
  YapiPostOtcMerchantAdvUpdateStatusApiResponse,
} from '@/typings/yapi-old/OtcMerchantAdvUpdatestatusPostApi'
import { YapiPostV1OrdersPlaceApiRequest, YapiPostV1OrdersPlaceApiResponse } from '@/typings/yapi/OrdersPlaceV1PostApi'
import { YapiPostV1SplSaveStrategyApiRequest } from '@/typings/yapi/SplSaveStrategyV1PostApi'

import { IQueryTradeNotificationsReq, ITradeNotificationLampList, ITradeNotification } from '@/typings/api/trade'
import {
  YapiPostV1PerpetualPlanOrdersPlaceApiRequest,
  YapiPostV1PerpetualPlanOrdersPlaceApiResponse,
} from '@/typings/yapi/PerpetualPlanOrdersPlaceV1PostApi'
import {
  YapiPostV1PerpetualOrdersPlaceApiRequest,
  YapiPostV1PerpetualOrdersPlaceApiResponse,
} from '@/typings/yapi/PerpetualOrdersPlaceV1PostApi'

/**
 * 获取自选交易列表
 *
 */
export const getDdvList: MarkcoinRequest<TradeDdvListReq, TradeDdvListRes> = data => {
  return request({
    path: `/otc/adv/list`,
    method: 'POST',
    data,
  })
}

/**
 * 获取自选交易列表相关配置的值
 *
 */
export const getSystemArgs: MarkcoinRequest<TradeSystemArgsReq, TradeSystemArgsResp> = params => {
  return request({
    path: `/otc/common/systemArgs`,
    method: 'GET',
    params,
  })
}

/**
 * 获取目前账户余额
 *
 */
export const getOtcBalance: MarkcoinRequest<TradeOtcBalanceReq, TradeOtcBalanceReqResp> = params => {
  return request({
    path: `/otc/balance`,
    method: 'GET',
    params,
  })
}

/**
 * otc 下单
 *
 */
export const setCreateOrder: MarkcoinRequest<TradeOtcOrderReq, TradeOtcOrderResp> = data => {
  return request({
    path: `/otc/order/create`,
    method: 'POST',
    data,
  })
}

/**
 * 获取目前用户的状态 是否是黑名单等
 *
 */
export const getReleaseCheck: MarkcoinRequest<TradeOtcReleaseCheckReq, TradeOtcReleaseCheckResp> = () => {
  return request({
    path: `/otc/merchant/adv/release/check`,
    method: 'POST',
    needAllRes: true,
  })
}

/**
 * @description: 杠杆普通委托下单
 * https://yapi.coin-online.cc/project/72/interface/api/2126
 * @param {*} params
 */
export const postTradeMarginPlace: MarkcoinRequest = params => {
  return request({
    path: `/v1/margin/place`,
    method: 'POST',
    data: params,
    signature: true,
  })
}
/**
 * @description: 批量下单
 * https://yapi.coin-online.cc/project/72/interface/api/2480
 * @param {*} params
 */
export const postTradePerpetualBatchOrder: MarkcoinRequest = ({ params, code }) => {
  return request({
    path: `v1/perpetual/products/${code}/batch-order`,
    method: 'POST',
    data: params,
  })
}

/**
 * @description: 杠杆计划委托下单
 * https://yapi.coin-online.cc/project/72/interface/api/2129
 * @param {*} params
 */
export const postTradeMarginPlanPlace: MarkcoinRequest = params => {
  return request({
    path: `/v1/margin/plan/place`,
    method: 'POST',
    data: params,
    signature: true,
  })
}
/**
 * @description: 下单接口_限价市价
 * https://yapi.admin-devops.com/project/44/interface/api/2660
 * @param {*} params
 */
export const postTradeOrderPlace: MarkcoinRequest<
  YapiPostV1OrdersPlaceApiRequest,
  YapiPostV1OrdersPlaceApiResponse['data']
> = params => {
  return request({
    path: `/v1/orders/place`,
    method: 'POST',
    data: params,
    signature: true,
  })
}
/**
 * @description: 新增计划委托单
 * https://yapi.admin-devops.com/project/44/interface/api/2666
 * @param {*} params
 */
export const postSplSaveStrategy: MarkcoinRequest = params => {
  return request({
    path: `/v1/spl/saveStrategy`,
    method: 'POST',
    data: params,
    signature: true,
  })
}
/**
 * @description: 现货买下单
 * https://yapi.coin-online.cc/project/72/interface/api/2048
 * @param {*} params
 */
export const postTradeCNYBuy: MarkcoinRequest = params => {
  return request({
    path: `/trade/cny_buy`,
    method: 'POST',
    data: params,
    signature: true,
  })
}
/**
 * @description: 现货卖下单
 * https://yapi.coin-online.cc/project/72/interface/api/2075
 * @param {*} params
 */
export const postTradeCNYSell: MarkcoinRequest = params => {
  return request({
    path: `/trade/cny_sell`,
    method: 'POST',
    data: params,
    signature: true,
  })
}
/**
 * @description: 计划委托下单
 * https://yapi.coin-online.cc/project/72/interface/api/1613
 * @param {*} params
 */
export const postEntrustPlanOrderPlace: MarkcoinRequest = params => {
  return request({
    path: `/entrust/plan/order/place`,
    method: 'POST',
    data: params,
    signature: true,
  })
}
/**
 * 获取目前用户的状态 是否是黑名单等
 *
 */
export const getMerchantInfo: MarkcoinRequest<TradeMerchantInfoReq, TradeMerchantInfoResp> = params => {
  return request({
    path: `/otc/merchant/info`,
    method: 'GET',
    params,
  })
}

/**
 * 获取创建广告页面各种初始参数
 *
 */
export const getAdvParams: MarkcoinRequest<
  YapiGetOtcMerchantAdvParamsApiRequest,
  YapiDtoAdvReferenceParameterVo
> = params => {
  return request({
    path: `/otc/merchant/adv/params`,
    method: 'GET',
    params,
  })
}

/**
 * 查询收款方式
 *
 */
export const getBankInfo: MarkcoinRequest<TradeBankInfoReq, TradeBankInfoResp> = () => {
  return request({
    path: `/otc/bankInfo`,
    method: 'POST',
    signature: 'decrypted',
  })
}

/**
 * 创建广告
 *
 */

export const setSubmitAdv: MarkcoinRequest<YapiDtoundefined, YapiPostOtcMerchantAdvReleaseApiResponse> = () => {
  return request({
    path: `/otc/merchant/adv/release`,
    method: 'POST',
    signature: true,
  })
}

/**
 * 修改广告
 *
 */

export const setSubmitEditAdv: MarkcoinRequest<YapiDtoundefined, YapiPostOtcMerchantAdvReleaseApiResponse> = () => {
  return request({
    path: `/otc/merchant/adv/edit`,
    method: 'POST',
    signature: true,
  })
}

/**
 * 获取广告列表广告
 *
 */

export const getMerchantAdvList: MarkcoinRequest<YapiPostOtcMerchantAdvListApiRequest> = params => {
  return request({
    path: `/otc/merchant/adv/list`,
    method: 'POST',
    data: params,
    needAllRes: true,
  })
}

/**
 * 改变广告的状态
 *
 */

export const getUpdateStatus: MarkcoinRequest<
  YapiPostOtcMerchantAdvUpdateStatusApiRequest,
  YapiPostOtcMerchantAdvUpdateStatusApiResponse
> = params => {
  return request({
    path: `/otc/merchant/adv/updateStatus`,
    method: 'POST',
    data: params,
  })
}

/**
 * 查询现货币种是否已订阅上线通知
 */
export const querySpotCoinSubscribed: MarkcoinRequest<
  {
    tradeId: string
  },
  {
    subscribed: boolean
  }
> = params => {
  return request({
    path: `/v1/orders/place`,
    method: 'GET',
    params,
  })
}

/**
 * 订阅币种上线通知
 */
export const subscribeSpotCoin: MarkcoinRequest<{
  tradeId: number
}> = data => {
  return request({
    path: `/v1/tradePair/subscribe`,
    method: 'POST',
    data,
  })
}

/**
 * 获取最新交易数据
 */
export const getMarketTrades: MarkcoinRequest<{
  limit: number
  symbol: string
}> = params => {
  return request({
    path: `/v1/market/trades`,
    method: 'GET',
    params,
  })
}

/**
 * 获取我的交易数据
 */
export const getPageHistory = params => {
  return request({
    path: `/v1/orders/deals`,
    method: 'GET',
    params,
  })
}

/**
 * 获取交易通知列表
 * https://yapi.admin-devops.com/project/44/interface/api/3002
 */
export const queryTradeNotifications: MarkcoinRequest<
  IQueryTradeNotificationsReq,
  ITradeNotificationLampList
> = data => {
  return request({
    path: `/v1/helpCenter/horseLamp`,
    method: 'POST',
    data,
  })
}

/**
 * [新建计划委托↗](https://yapi.nbttfc365.com/project/44/interface/api/3891)
 * */
export const postV1PerpetualPlanOrdersPlaceApiRequest: MarkcoinRequest<
  YapiPostV1PerpetualPlanOrdersPlaceApiRequest,
  YapiPostV1PerpetualPlanOrdersPlaceApiResponse['data']
> = data => {
  return request({
    path: '/v1/perpetual/plan/orders/place',
    method: 'POST',
    data,
  })
}

/**
 * [新建普通委托单↗](https://yapi.nbttfc365.com/project/44/interface/api/3639)
 * */
export const postV1PerpetualOrdersPlaceApiRequest: MarkcoinRequest<
  YapiPostV1PerpetualOrdersPlaceApiRequest,
  YapiPostV1PerpetualOrdersPlaceApiResponse['data']
> = data => {
  return request({
    path: '/v1/perpetual/orders/place',
    method: 'POST',
    data,
  })
}

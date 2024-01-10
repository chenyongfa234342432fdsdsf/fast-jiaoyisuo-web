import { EntrustTypeEnum, FutureOrderSystemTypeEnum, OrderTabTypeEnum } from '@/constants/order'
import request, { MarkcoinRequest } from '@/plugins/request'
import {
  IBaseOrderItem,
  ICreateFutureStopLimitReq,
  IFutureOrderStopLimitDetail,
  IIQuerySpotPlanHistoryOrderListReq,
  IIQuerySpotPlanOpenOrderListReq,
  IOrderActionPrams,
  IQueryFutureFundingFeeLogDetail,
  IQueryFutureFundingFeeLogsReq,
  IQueryFutureFundingFeeLogsResp,
  IQueryFutureLeverInfoReq,
  IQueryFutureLeverInfoResp,
  IQueryFutureOrderDetailResp,
  IQueryFutureOrderListReq,
  IQueryFutureOrderListResp,
  IQueryOrderDetailResp,
  IQuerySpotNormalHistoryOrderListReq,
  IQuerySpotNormalHistoryOrderListResp,
  IQuerySpotNormalOpenOrderListReq,
  IQuerySpotNormalOpenOrderListResp,
  IQuerySpotPlanHistoryOrderListResp,
  IQuerySpotPlanOpenOrderListResp,
  ISpotBatchCancelOrderReq,
  IUpdateFutureStopLimitReq,
} from '@/typings/api/order'
import { YapiGetV1PerpetualAssetsFundingRateDetailApiRequest } from '@/typings/yapi/PerpetualAssetsFundingRateDetailV1GetApi'
import {
  YapiGetV1PerpetualClearingTradeHistoryApiRequest,
  YapiGetV1PerpetualClearingTradeHistoryApiResponse,
  YapiGetV1PerpetualClearingTradeHistoryData,
} from '@/typings/yapi/PerpetualClearingTradeHistoryV1GetApi'
import {
  YapiGetV1PerpetualOrderDetailData,
  YapiGetV1PerpetualOrderDetailListApiRequest,
  YapiGetV1PerpetualOrderDetailListApiResponse,
} from '@/typings/yapi/PerpetualOrderDetailListV1GetApi'

/**
 * 获取现货普通当前订单列表
 * https://yapi.admin-devops.com/project/44/interface/api/2774
 */
export const querySpotNormalOpenOrderList: MarkcoinRequest<
  IQuerySpotNormalOpenOrderListReq,
  IQuerySpotNormalOpenOrderListResp
> = params => {
  return request({
    path: `/v1/orders/current`,
    method: 'GET',
    params,
  })
}
/**
 * 获取现货普通订单详情
 * https://yapi.admin-devops.com/project/44/interface/api/2663
 */
export const querySpotNormalOpenOrderDetail: MarkcoinRequest<{ id }, IBaseOrderItem> = ({ id }) => {
  return request({
    path: `/v1/orders/details/${id}`,
    method: 'GET',
  })
}
/**
 * 获取现货普通历史订单列表
 * https://yapi.admin-devops.com/project/44/interface/api/2669
 */
export const querySpotNormalHistoryOrderList: MarkcoinRequest<
  IQuerySpotNormalHistoryOrderListReq,
  IQuerySpotNormalHistoryOrderListResp
> = params => {
  return request({
    path: `/v1/orders/history`,
    method: 'GET',
    params,
  })
}
/**
 * 获取现货计划订单当前订单列表
 * https://yapi.admin-devops.com/project/44/interface/api/2930
 */
export const querySpotPlanOpenOrderList: MarkcoinRequest<
  IIQuerySpotPlanOpenOrderListReq,
  IQuerySpotPlanOpenOrderListResp
> = params => {
  return request({
    path: `/v1/spl/page/current`,
    method: 'GET',
    params,
  })
}
/**
 * 获取现货计划订单历史订单列表
 * https://yapi.admin-devops.com/project/44/interface/api/2843
 */
export const querySpotPlanHistoryOrderList: MarkcoinRequest<
  IIQuerySpotPlanHistoryOrderListReq,
  IQuerySpotPlanHistoryOrderListResp
> = params => {
  return request({
    path: `/v1/spl/page/history`,
    method: 'GET',
    params,
  })
}
const futureOrderListUrlMap = {
  [EntrustTypeEnum.normal]: {
    [OrderTabTypeEnum.current]: '/v1/perpetual/orders/current',
    [OrderTabTypeEnum.history]: '/v1/perpetual/orders/history',
  },
  [EntrustTypeEnum.stopLimit]: {
    [OrderTabTypeEnum.current]: '/v1/perpetual/strategy/current',
    [OrderTabTypeEnum.history]: '/v1/perpetual/strategy/history',
  },
  [EntrustTypeEnum.plan]: {
    [OrderTabTypeEnum.current]: '/v1/perpetual/plan/orders/current',
    [OrderTabTypeEnum.history]: '/v1/perpetual/plan/orders/history',
  },
}
/**
 * 获取合约订单列表
 * 复合接口，文档地址按 url 搜索
 */
export const queryFutureOrderList: MarkcoinRequest<
  IQueryFutureOrderListReq,
  IQueryFutureOrderListResp
> = async params => {
  const res = await request({
    path: futureOrderListUrlMap[params.entrustType!][params.tab],
    method: 'GET',
    params,
  })

  if (res.isOk && res.data) {
    // 处理数据结构不同步的问题
    res.data = {
      ...res.data,
      rows: res.data.rows || res.data.data || res.data,
      total: res.data.total || res.data.totalCount || res.data.length,
    }
  }

  return res
}
/**
 * 获取合约订单详情
 * https://yapi.nbttfc365.com/project/44/interface/api/3679
 */
export const queryFutureOrderDetail: MarkcoinRequest<
  {
    id: any
  },
  IQueryFutureOrderDetailResp
> = ({ id }) => {
  return request({
    path: `/v1/perpetual/orders/details/${id}`,
    method: 'GET',
  })
}

/**
 * 取消现货普通订单
 * https://yapi.admin-devops.com/project/44/interface/api/2672
 */
export const cancelSpotNormalOrder: MarkcoinRequest<IOrderActionPrams> = data => {
  return request({
    path: `/v1/orders/cancel/${data.id}`,
    method: 'DELETE',
  })
}
/**
 * 取消现货计划订单
 * https://yapi.admin-devops.com/project/44/interface/api/2997
 */
export const cancelAllSpotNormalOrder: MarkcoinRequest<ISpotBatchCancelOrderReq> = params => {
  return request({
    path: `/v1/orders/cancelAll`,
    method: 'DELETE',
    params,
  })
}
/**
 * 取消现货计划订单
 * https://yapi.admin-devops.com/project/44/interface/api/2997
 */
export const cancelSpotPlanOrder: MarkcoinRequest<IOrderActionPrams> = data => {
  return request({
    path: `/v1/spl/cancel/${data.id}`,
    method: 'DELETE',
  })
}
/**
 * 取消全部现货计划订单
 * https://yapi.admin-devops.com/project/44/interface/api/2933
 */
export const cancelAllSpotPlanOrder: MarkcoinRequest<ISpotBatchCancelOrderReq> = params => {
  return request({
    path: `/v1/spl/batchCancel`,
    method: 'DELETE',
    params,
  })
}
/**
 * 获取订单成交详情
 * TODO: 地址
 */
export const queryOrderDetail: MarkcoinRequest<IOrderActionPrams, IQueryOrderDetailResp> = params => {
  return request({
    path: `entrust/detail`,
    method: 'GET',
    params,
  })
}

/**
 * 撤销全部订单
 * TODO: 地址
 */
export const batchCancelOrder: MarkcoinRequest<{
  placeOrderType: number
}> = data => {
  return request({
    path: `v1/entrust/batchcancel`,
    method: 'POST',
    data,
  })
}
const CANCEL_FUTURE_ORDER_URL_MAP = {
  [EntrustTypeEnum.normal]: {
    single: '/v1/perpetual/orders/cancel',
    batch: '/v1/perpetual/orders/cancelAll',
  },
  [EntrustTypeEnum.stopLimit]: {
    batch: '/v1/perpetual/strategy/cancelAll',
    single: 'v1/perpetual/strategy/cancel',
  },
  [EntrustTypeEnum.plan]: {
    batch: '/v1/perpetual/plan/orders/cancelAll',
    single: '/v1/perpetual/plan/orders/cancel',
  },
}
/**
 * 取消合约订单
 * https://yapi.nbttfc365.com/project/44/interface/api/3899
 * https://yapi.nbttfc365.com/project/44/interface/api/3655
 * https://yapi.nbttfc365.com/project/44/interface/api/3927
 */
export const cancelFutureOrder: MarkcoinRequest<IOrderActionPrams> = ({ id, entrustType }) => {
  return request({
    path: `${CANCEL_FUTURE_ORDER_URL_MAP[entrustType].single}`,
    method: 'POST',
    data: {
      id,
    },
  })
}

export const batchCancelFutureOrder: MarkcoinRequest<{
  entrustType: EntrustTypeEnum
  params: any
}> = ({ entrustType, params }) => {
  return request({
    path: `${CANCEL_FUTURE_ORDER_URL_MAP[entrustType].batch}`,
    method: 'POST',
    data: params,
  })
}

/**
 * 调整保证金
 * TODO: 地址
 */
export const modifyOrderMargin: MarkcoinRequest<{
  code: string
  side: string
  margin: string
}> = params => {
  return request({
    path: `v1/perpetual/position/${params.code}/change-margin`,
    method: 'POST',
    params,
  })
}
/**
 * 调整保证金
 * https://yapi.nbttfc365.com/project/44/interface/api/4075
 */
export const modifyFutureOrderMargin: MarkcoinRequest<{
  id: any
  margin: any
}> = params => {
  return request({
    path: `v1/perpetual/plan/orders/${params.id}/margin`,
    method: 'POST',
    data: {
      additionalMargin: params.margin,
    },
  })
}
/**
 * 设置止盈止损
 * TODO: 地址
 */
export const setFutureOrderStopLimit: MarkcoinRequest<ICreateFutureStopLimitReq> = params => {
  return request({
    path: `v1/perpetual/products/${params.code}/batch-order`,
    method: 'POST',
    data: params.data,
  })
}
/**
 * 更新止盈止损
 * https://yapi.nbttfc365.com/project/44/interface/api/4087
 */
export const updateFutureOrderStopLimit: MarkcoinRequest<IUpdateFutureStopLimitReq> = data => {
  return request({
    path: `/v1/perpetual/orders/strategy/update`,
    method: 'POST',
    data,
  })
}
/**
 * 更新计划委托止盈止损
 * https://yapi.nbttfc365.com/project/44/interface/api/4087
 */
export const updateFuturePlanOrderStopLimit: MarkcoinRequest<IUpdateFutureStopLimitReq> = data => {
  return request({
    path: `/v1/perpetual/plan/orders/strategy/update`,
    method: 'POST',
    data,
  })
}
/**
 * 查询最新价
 * TODO: 地址
 */
export const queryFutureLatestPrice: MarkcoinRequest<
  {
    code: string
  },
  {
    11: string
  }
> = ({ code }) => {
  return request({
    path: `v1/perpetual/public/products/${code}/ticker`,
    method: 'GET',
  })
}
/**
 * 持仓市价全平
 * TODO: 地址待定
 */
export const cancelAllHoldingOrderByMarketPrice: MarkcoinRequest<{
  code: string
  side: string
  amount: string
  triggerPrice: string
}> = ({ code, ...params }) => {
  return request({
    path: `v1/perpetual/products/${code}/order`,
    method: 'POST',
    contentType: 1,
    params: {
      ...params,
      triggerBy: null,
      type: FutureOrderSystemTypeEnum.market,
    },
  })
}
/**
 * 获取杠杆订单 交易区
 * TODO: 地址
 */
export const getLeverOrderAreaList: MarkcoinRequest<
  any,
  {
    areas: {
      areaId: string
      tradeArea: string
    }[]
  }
> = () => {
  return request({
    path: `margin/tradeArea/list`,
    method: 'GET',
  })
}
/**
 * 迁移合约持仓订单
 * TODO: 地址
 */
export const migrateFutureHoldingOrder: MarkcoinRequest<{
  groupId: string
  amount: number
  orderId: string
}> = data => {
  return request({
    path: `v2/perpetual/products/condition/modify`,
    method: 'PUT',
    data,
  })
}
/**
 * 锁仓合约订单
 * TODO: 地址
 */
export const lockPositionFutureHoldingOrder: MarkcoinRequest<{
  percent: number
  orderId: string
}> = data => {
  return request({
    path: `v2/perpetual/products/condition/modify`,
    method: 'PUT',
    data,
  })
}

/**
 * 查询合约订单资金费用列表
 * https://yapi.nbttfc365.com/project/44/interface/api/3687
 */
export const queryFutureFundingFees: MarkcoinRequest<
  IQueryFutureFundingFeeLogsReq,
  IQueryFutureFundingFeeLogsResp
> = params => {
  return request({
    path: `/v1/perpetual/clearing/fundingRate/list`,
    method: 'GET',
    params,
  })
}
/**
 * 查询合约订单资金费用详情
 * https://yapi.nbttfc365.com/project/44/interface/api/4335
 */
export const queryFutureFundingFeeDetail: MarkcoinRequest<
  YapiGetV1PerpetualAssetsFundingRateDetailApiRequest,
  IQueryFutureFundingFeeLogDetail
> = params => {
  return request({
    path: `/v1/perpetual/assets/fundingRateDetail`,
    method: 'GET',
    params,
  })
}
/**
 * 查询合约要素
 * TODO: 地址
 */
export const queryFutureLeverInfoList: MarkcoinRequest<
  IQueryFutureLeverInfoReq,
  IQueryFutureLeverInfoResp
> = params => {
  return request({
    path: `/v1/perpetual/orders/infos-lever`,
    method: 'GET',
    params,
  })
}
/**
 * [普通委托订单止盈止损详情查询↗]
 * https://yapi.nbttfc365.com/project/44/interface/api/4083
 * */
export const queryFutureOrderStopLimitDetail: MarkcoinRequest<{ id: string }, IFutureOrderStopLimitDetail> = params => {
  return request({
    path: `/v1/perpetual/orders/strategy/details/${params.id}`,
    method: 'GET',
    params,
  })
}
/**
 * [计划委托订单止盈止损详情查询↗](https://yapi.nbttfc365.com/project/44/interface/api/4099)
 * */
export const queryFuturePlanOrderStopLimitDetail: MarkcoinRequest<
  { id: string },
  IFutureOrderStopLimitDetail
> = params => {
  return request({
    path: `/v1/perpetual/plan/orders/strategy/details/${params.id}`,
    method: 'GET',
    params,
  })
}

/**
 * [查询成交历史↗](https://yapi.nbttfc365.com/project/44/interface/api/3915)
 * */
export const queryFutureOrderTransactionLogs: MarkcoinRequest<
  YapiGetV1PerpetualClearingTradeHistoryApiRequest,
  YapiGetV1PerpetualClearingTradeHistoryData
> = params => {
  return request({
    path: '/v1/perpetual/clearing/trade/history',
    method: 'GET',
    params,
  })
}
/**
 * [订单详情资金明细列表↗](https://yapi.nbttfc365.com/project/44/interface/api/4347)
 * */
export const queryFutureOrderFundingFeeLogs: MarkcoinRequest<
  {
    orderId: any
  },
  // TODO: YapiGetV1PerpetualOrderDetailData 等接口文档更新
  {
    list: any[]
    total: number
  }
> = params => {
  return request({
    path: '/v1/perpetual/order/detail/list',
    method: 'GET',
    params,
  })
}

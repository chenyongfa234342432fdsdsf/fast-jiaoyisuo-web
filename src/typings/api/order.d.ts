import { FutureHoldingOrderDirectionEnum, FutureOrderDirectionEnum, FutureOrderPositionTypeEnum, FutureOrderPriceTypeEnum, FutureOrderStatusEnum, FutureOrderStopLimitTypeEnum, FutureOrderSystemTypeEnum, OrderMarginModeEnum, OrderMarketUnitEnum,  OrderMatchTypeEnum, OrderPriceTypeEnum, OrderStatusEnum, OrderTabTypeEnum } from '../../constants/order'
import { YapiGetV1OrdersCurrentApiRequest as IQuerySpotNormalOpenOrderListReq, YapiGetV1OrdersCurrentData as IQuerySpotNormalOpenOrderListResp } from '../yapi/OrdersCurrentV1GetApi.d'
import { YapiGetV1OrdersHistoryListData as IBaseOrderItem, YapiGetV1OrdersHistoryListTransactionLogsListData as IBaseOrderTransactionLog, YapiGetV1OrdersHistoryApiRequest as IQuerySpotNormalHistoryOrderListReq, YapiGetV1OrdersHistoryData as IQuerySpotNormalHistoryOrderListResp } from '../yapi/OrdersHistoryV1GetApi.d'
import { YapiGetV1SplPageHistoryApiRequest as IIQuerySpotPlanHistoryOrderListReq, YapiGetV1SplPageHistoryListData as ISpotPlanOrderItem, YapiGetV1SplPageHistoryData as IQuerySpotPlanHistoryOrderListResp } from '../yapi/SplPageHistoryV1GetApi.d'
import { YapiGetV1SplPageCurrentApiRequest as IIQuerySpotPlanOpenOrderListReq, YapiGetV1SplPageCurrentData as IQuerySpotPlanOpenOrderListResp } from '../yapi/SplPageCurrentV1GetApi.d'
import { YapiDeleteV1OrdersCancelAllApiRequest as ISpotBatchCancelOrderReq } from '@/typings/yapi/OrdersCancelAllV1DeleteApi'
import { Order_Body as IWsSpotOrder } from '@/plugins/ws/protobuf/ts/proto/Order'
import { YapiGetV1PerpetualOrdersHistoryApiRequest, YapiGetV1PerpetualOrdersHistoryListData } from '../yapi/PerpetualOrdersHistoryV1GetApi'
import { YapiGetV1PerpetualOrdersDetailsIdData } from '../yapi/PerpetualOrdersDetailsIdV1GetApi'
import { YapiGetV1PerpetualPlanOrdersHistoryListData } from '../yapi/PerpetualPlanOrdersHistoryV1GetApi'
import { YapiGetV1PerpetualStrategyHistoryData, YapiGetV1PerpetualStrategyHistoryListData } from '../yapi/PerpetualStrategyHistoryV1GetApi'
import { YapiGetV1PerpetualOrdersStrategyDetailsIdData, YapiGetV1PerpetualOrdersStrategyDetailsIdStopProfitStrategyData } from '../yapi/PerpetualOrdersStrategyDetailsIdV1GetApi'
import { YapiPostV1PerpetualOrdersStrategyUpdateApiRequest, YapiPostV1PerpetualOrdersStrategyUpdateApiRequestStrategy } from '../yapi/PerpetualOrdersStrategyUpdateV1PostApi'
import { YapiGetV1PerpetualClearingTradeHistoryListData } from '../yapi/PerpetualClearingTradeHistoryV1GetApi'
import { YapiGetV1PerpetualClearingFundingRateListApiRequest, YapiGetV1PerpetualClearingFundingRateListData } from '../yapi/PerpetualClearingFundingRateListV1GetApi'
import { YapiGetV1PerpetualAssetsFundingRateDetailData } from '../yapi/PerpetualAssetsFundingRateDetailV1GetApi'


export {
  IQuerySpotNormalOpenOrderListReq,
  IBaseOrderItem,
  ISpotPlanOrderItem,
  IQuerySpotNormalHistoryOrderListReq,
  IQuerySpotNormalOpenOrderListResp,
  IQuerySpotPlanHistoryOrderListResp,
  IQuerySpotPlanOpenOrderListResp,
  IIQuerySpotPlanOpenOrderListReq,
  IIQuerySpotPlanHistoryOrderListReq,
  IQuerySpotNormalHistoryOrderListResp,
  IBaseOrderTransactionLog,
  ISpotBatchCancelOrderReq,
  IWsSpotOrder,
}
export type IOrderCommonReq = {
  direction?: any
  dateType?: any
  statusArr?: any[]
  status?: string
  entrustType?: number
  beginDateNumber?: number
  endDateNumber?: number
  hideCanceled?: boolean
  tradeId?: string
  orderType?: any
}
/** 现货订单请求参数 */
export type IQuerySpotOrderReqParams = Partial<IQuerySpotNormalHistoryOrderListReq> & IOrderCommonReq

/** 订单成交记录 */
export type IOrderDetailLog = {
  id: number
  entrustId: number
  amount: string
  count: string
  createTime: number
  remark: string
  lastupdattime: number
  fee: string
  /** 成交价格 */
  prize: string
}
export type IOrderActionPrams = {
  entrustId?: any
  id?: any
  matchType?: number
  code?: string
  entrustType?: any
}
export type IOrderDetail = IBaseOrderItem & {
  entrustLogs: IOrderDetailLog[]
}
export type IQueryOrderDetailResp = IOrderDetail

export type IFutureStopLimit = {
  amount: string
}
export type IFutureOrderBaseItem = YapiGetV1PerpetualOrdersHistoryListData & {
  // 临时
  quote: string
  indexBase: string
  base: string
  marketPriceDigit: number
  contractCode: string
  amount: string
}
export type IFuturePlanOrderItem = YapiGetV1PerpetualPlanOrdersHistoryListData & {
  perpetualVersion?: number
}
export type IFutureStopLimitOrderItem = YapiGetV1PerpetualStrategyHistoryListData
export type IFutureOrderItem = IFutureOrderBaseItem & {
  profit: string
  detailSide: FutureOrderDirectionEnum
  positionType: FutureOrderPositionTypeEnum
  systemType: FutureOrderSystemTypeEnum
  stopLimitType: FutureOrderStopLimitTypeEnum
  orderPriceType: FutureOrderPriceTypeEnum
  avgPrice: string
  /** 已成交数量 */
  dealAmount: string
  fee: string
  reason: number
  modifyDate: number
  triggerDate: number
  stopLoss?: IFutureStopLimit
  stopProfit?: IFutureStopLimit
  refConditionOrderId: string
  marketUnit: any
  realizedProfit?: string
} & IFuturePlanOrderItem & IFutureStopLimitOrderItem

export type IFutureHoldingOrderItem = IFutureOrderBaseItem & {
  type: number
  availableBalance: string
  closingAmount: string
  amount: string
  triggerPrice: string
  closingConditionAmount: string
  closingLossConditionAmount: string
  closingProfitConditionAmount: string
  liqudatePrice: string
  lossTriggerPrice: string
  maintainRate: string
  maxLever: string
  stopLoss?: IFutureStopLimit
  stopProfit?: IFutureStopLimit
  openMargin: string
  openMarginRate: string
  orderAmount: string
  preLiqudatePrice: string
  side: FutureHoldingOrderDirectionEnum
  unitAmount: string
  unRealizedSurplus: string
  realizedSurplus: string
  marginDigit: number
  feeRate: string
  avgPrice: string
  base: string
  lockedPosition: boolean
  lockedPositionPercent: number
  // 计算得到
  frontendCalcLiquidateAmount: number
  frontendCalcUnRealizedSurplus: string | number
  frontendCalcEarnings: number
  frontendCalcYieldRate: string
  frontendCalcOpenMarginRateTwo: string
  frontendCalOpenMarginRate: string
  /** 最小保证金 */
  frontendCalcMinMargin: string
  /** 收益 */
  frontendProfit: string
  frontendCalcMinMarginRate: string
  // 计算得到
}

export type IQueryFutureOrderListReq = IOrderCommonReq & Partial<YapiGetV1PerpetualOrdersHistoryApiRequest> & {
  tab?: any
  entrustTypeInd?: any
}
export type IQueryFutureOrderListResp = {
  list: IFutureOrderItem[]
  total: number
}
export type IQueryFutureOrderDetailResp = YapiGetV1PerpetualOrdersDetailsIdData & IFutureOrderItem & {
  updatedByTime: number
}
export type IFutureStopLimitBaseReq = {
  amount?: string
  price?: string
  triggerPrice: string
  tradeUnit?: string
  tradeAmountUnit?: string
}
export type ICreateFutureStopLimitReq = {
  code: string
  data: (IFutureStopLimitBaseReq & {
    algoType: FutureOrderSystemTypeEnum
    currentPrice?: string
    side: FutureOrderDirectionEnum
    /** 和接口返回的枚举是相反的 */
    stopLimitType: 1 | 0
    triggerBy: 'last'
    type: 12
  })[]
}
export type IUpdateFutureStopLimitReq = {
  id: any
  strategy: Partial<YapiPostV1PerpetualOrdersStrategyUpdateApiRequestStrategy>
}

export type IMarginOrderItem = {
  afterLiquidatePrice: string
  afterMargin: string
  amount: string
  beforeLiquidatePrice: string
  beforeMargin: string
  contract: {}
  contractCode: string
  createdDate: number
  currencyCode: string
  lever: number
  positionType: number
  side: string
  type: string
}
export type IQueryFutureFundingFeeLogsReq = YapiGetV1PerpetualClearingFundingRateListApiRequest
export type IQueryFutureFundingFeeLogsResp = {
  list: IFutureFundingFeeLog[]
  total: number
}
export type IQueryFutureFundingFeeLogDetail = YapiGetV1PerpetualAssetsFundingRateDetailData
export type IFutureFundingFeeLog = YapiGetV1PerpetualClearingFundingRateListData
export type IQueryFutureLeverInfoReq = {
  tradeId: string
}
export type IQueryFutureLeverInfoResp = {
  list: IFutureLeverInfoItem[]
  total: number
}
export type IFutureLeverInfoItem = {
  level: number
  lever: number
  maxHolding: number
  sellCoinName: string
  marginRate: string
  id: any
}

export type IFutureOrderStopLimitDetail = YapiGetV1PerpetualOrdersStrategyDetailsIdData
export type IFutureOrderStopLimitStrategy = YapiGetV1PerpetualOrdersStrategyDetailsIdStopProfitStrategyData
/** 订单成交历史记录 */
export type IFutureOrderTransactionLog = YapiGetV1PerpetualClearingTradeHistoryListData

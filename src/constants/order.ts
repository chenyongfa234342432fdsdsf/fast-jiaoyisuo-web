import { t } from '@lingui/macro'

export enum OrderTabTypeEnum {
  current = 'open',
  history = 'history',
  holdings = 'holdings',
  plan = 1,
  // 止盈止损
  profitLoss,
  // 保证金
  margin,
  leverInfo,
  funding = 'funding',
  assets = 'assets',
}
export function geOrderTabTypeEnumName(value: OrderTabTypeEnum) {
  return {
    [OrderTabTypeEnum.current]: t`order.tabs.current`,
    [OrderTabTypeEnum.history]: t`order.tabs.history`,
    [OrderTabTypeEnum.holdings]: t`order.tabs.holdings`,
    [OrderTabTypeEnum.plan]: t`order.constants.placeOrderType.plan`,
    [OrderTabTypeEnum.profitLoss]: t`order.tabs.profitLoss`,
    [OrderTabTypeEnum.margin]: t`order.tabs.margin`,
    [OrderTabTypeEnum.leverInfo]: t`constants_order_5101476`,
    [OrderTabTypeEnum.funding]: t`constants/assets/common-8`,
    [OrderTabTypeEnum.assets]: t`order.tabs.assets`,
  }[value]
}
export enum OrderDirectionEnum {
  all = '',
  buy = 1,
  sell = 2,
}
export function getOrderDirectionEnumName(value: OrderDirectionEnum) {
  return {
    [OrderDirectionEnum.all]: t`order.constants.direction.all`,
    [OrderDirectionEnum.buy]: t`order.constants.direction.buy`,
    [OrderDirectionEnum.sell]: t`order.constants.direction.sell`,
  }[value]
}

export enum OrderPriceTypeEnum {
  market = 'ALL',
  bbo = 'BBO',
  optimal5 = 'optimal5',
  optimal10 = 'optimal10',
  optimal20 = 'optimal20',
}
export function getOrderPriceTypeEnumName(value: OrderPriceTypeEnum) {
  return {
    [OrderPriceTypeEnum.market]: t`trade.tab.orderType.marketPrice`,
    [OrderPriceTypeEnum.bbo]: t`trade.form.price.type.2`,
    [OrderPriceTypeEnum.optimal10]: t`order.constants.priceType.optimal10`,
    [OrderPriceTypeEnum.optimal20]: t`order.constants.priceType.optimal20`,
    [OrderPriceTypeEnum.optimal5]: t`order.constants.priceType.optimal5`,
  }[value]
}
export enum PlanOrderMatchTypeEnum {
  limitPrice = 1,
  marketPrice = 2,
}
export enum OrderMatchTypeEnum {
  limitPrice = 0,
  marketPrice = 1,
  planPrice = 4,
}

export function getOrderMatchTypeEnumName(value: OrderMatchTypeEnum) {
  return {
    [OrderMatchTypeEnum.limitPrice]: t`constants/trade-0`,
    [OrderMatchTypeEnum.marketPrice]: t`constants/trade-1`,
  }[value]
}

export enum OrderMarketUnitEnum {
  amount = 'amount',
}
export enum SpotPlanOrderStatusEnum {
  unTrigger = 1,
  triggered,
  triggeredEntrustFailed,
  manualCanceled,
  systemCanceled,
}

export enum OrderStatusEnum {
  unsettled = 1,
  partlySucceed,
  settled,
  manualCanceled,
  systemCanceled,
  partlyCanceled,
  revocation,
  canceled,
  unTrigger,
  entrusted,
  failed,
}

export function getOrderStatusEnumName(value: OrderStatusEnum) {
  return {
    [OrderStatusEnum.unsettled]: t`order.constants.status.unsettled`,
    [OrderStatusEnum.partlySucceed]: t`order.constants.status.partlySucceed`,
    [OrderStatusEnum.settled]: t`order.constants.status.settled`,
    [OrderStatusEnum.manualCanceled]: t`constants_order_5101072`,
    [OrderStatusEnum.systemCanceled]: t`constants_order_5101073`,
    [OrderStatusEnum.revocation]: t`order.constants.status.revocation`,
    [OrderStatusEnum.canceled]: t`order.constants.status.canceled`,
    [OrderStatusEnum.unTrigger]: t`order.constants.status.unTrigger`,
    [OrderStatusEnum.entrusted]: t`order.constants.status.entrusted`,
    [OrderStatusEnum.failed]: t`order.constants.status.failed`,
    [OrderStatusEnum.partlyCanceled]: t`order.constants.status.partlyCanceled`,
  }[value]
}

export enum OrderMarginModeEnum {
  // TODO: 待定
  /** 现货 */
  spot = 'nonmag',
  /**  杠杆 */
  margin = 'cross',
}
export function getOrderMarginModeEnumName(value: OrderMarginModeEnum) {
  return {
    [OrderMarginModeEnum.spot]: t`order.constants.marginMode.spot`,
    [OrderMarginModeEnum.margin]: t`order.constants.marginMode.margin`,
  }[value]
}

export enum FutureOrderDirectionEnum {
  all = '',
  openBuy = 'open_long',
  openSell = 'open_short',
  closeBuy = 'close_long',
  closeSell = 'close_short',
}
export function getFutureOrderDirectionEnumName(value: FutureOrderDirectionEnum) {
  return {
    [FutureOrderDirectionEnum.all]: t`order.constants.direction.all`,
    [FutureOrderDirectionEnum.openBuy]: t`constants/order-0`,
    [FutureOrderDirectionEnum.openSell]: t`constants/order-1`,
    [FutureOrderDirectionEnum.closeBuy]: t`constants/order-2`,
    [FutureOrderDirectionEnum.closeSell]: t`constants/order-3`,
  }[value]
}
export enum FutureOrderPositionTypeEnum {
  cross = 1,
  isolated = 0,
}
export function getFutureOrderPositionTypeEnumName(value: FutureOrderPositionTypeEnum) {
  return {
    [FutureOrderPositionTypeEnum.cross]: t`constants/order-4`,
    [FutureOrderPositionTypeEnum.isolated]: t`constants/order-5`,
  }[value]
}
export enum FutureHoldingOrderPositionTypeEnum {
  cross = 0,
  isolated = 1,
}
export function getFutureHoldingOrderPositionTypeEnumName(value: FutureHoldingOrderPositionTypeEnum) {
  return {
    [FutureHoldingOrderPositionTypeEnum.cross]: t`constants/order-4`,
    [FutureHoldingOrderPositionTypeEnum.isolated]: t`constants/order-5`,
  }[value]
}
export enum FutureOrderStopLimitTypeEnum {
  none = '',
  // 止盈
  profit = 0,
  // 止损
  loss = 1,
  // 计划限价
  planLimit = 2,
}
export enum FutureStopLimitOrderStopLimitTypeEnum {
  profit = 1,
  none = '',
  loss = 0,
  planLimit = 2,
}
export function getFutureOrderStopLimitTypeEnumName(value: FutureOrderStopLimitTypeEnum) {
  return {
    [FutureOrderStopLimitTypeEnum.profit]: t`constants/order-6`,
    [FutureOrderStopLimitTypeEnum.loss]: t`constants/order-7`,
    [FutureOrderStopLimitTypeEnum.planLimit]: t`constants/order-8`,
  }[value]
}
export enum FutureOrderSystemTypeEnum {
  limit = 10,
  market = 11,
  // 强平
  liquidateBuy = 13,
  liquidateSell = 14,
  // 强平其它 TODO: 含义待定
  liquidateOther = 15,
  // 强减
  forceReduce = 16,
}
export function getFutureOrderEntrustTypeName(
  systemType: FutureOrderSystemTypeEnum,
  limitType: FutureOrderStopLimitTypeEnum,
  limitTypeEnum: typeof FutureOrderStopLimitTypeEnum | typeof FutureStopLimitOrderStopLimitTypeEnum
) {
  const typeNames = {
    [FutureOrderSystemTypeEnum.limit]: {
      [limitTypeEnum.none]: t`constants/trade-0`,
      [limitTypeEnum.profit]: t`constants/order-9`,
      [limitTypeEnum.loss]: t`constants/order-10`,
      [limitTypeEnum.planLimit]: t`constants/order-8`,
    },
    [FutureOrderSystemTypeEnum.market]: {
      [limitTypeEnum.none]: t`constants/trade-1`,
      [limitTypeEnum.profit]: t`constants/order-11`,
      [limitTypeEnum.loss]: t`constants/order-12`,
    },
    [FutureOrderSystemTypeEnum.liquidateBuy]: t`constants/order-13`,
    [FutureOrderSystemTypeEnum.liquidateSell]: t`constants/order-13`,
    [FutureOrderSystemTypeEnum.liquidateOther]: t`constants/order-13`,
    [FutureOrderSystemTypeEnum.forceReduce]: t`constants/order-14`,
  }
  if (!typeNames[systemType]) {
    return ''
  }
  return (typeof typeNames[systemType] === 'string' ? typeNames[systemType] : typeNames[systemType][limitType]) || ''
}
export enum FutureOrderPriceTypeEnum {
  bbo = 1,
  optimal5 = 5,
  optimal10 = 10,
  optimal20 = 20,
}
export function getFutureOrderPriceTypeEnumName(value: FutureOrderPriceTypeEnum) {
  return {
    [FutureOrderPriceTypeEnum.bbo]: t`trade.form.price.type.2`,
    [FutureOrderPriceTypeEnum.optimal10]: t`order.constants.priceType.optimal10`,
    [FutureOrderPriceTypeEnum.optimal20]: t`order.constants.priceType.optimal20`,
    [FutureOrderPriceTypeEnum.optimal5]: t`order.constants.priceType.optimal5`,
  }[value]
}
export enum FutureOrderStatusEnum {
  partlySucceed = 1,
  settled = 2,
  revocation = 3,
  canceled = -1,
  unTrigger = 0,
  // TODO: 待定
  entrusted = 10,
  failed = 8,
  partlyCanceled = -2,
}

export function getFutureOrderStatusEnumName(value: FutureOrderStatusEnum) {
  return {
    [FutureOrderStatusEnum.partlySucceed]: t`order.constants.status.partlySucceed`,
    [FutureOrderStatusEnum.settled]: t`order.constants.status.settled`,
    [FutureOrderStatusEnum.revocation]: t`order.constants.status.revocation`,
    [FutureOrderStatusEnum.canceled]: t`order.constants.status.canceled`,
    [FutureOrderStatusEnum.unTrigger]: t`order.constants.status.unsettled`,
    [FutureOrderStatusEnum.entrusted]: t`order.constants.status.entrusted`,
    [FutureOrderStatusEnum.failed]: t`order.constants.status.failed`,
    [FutureOrderStatusEnum.partlyCanceled]: t`order.constants.status.partlyCanceled`,
  }[value]
}
export enum FuturePlanOrderStatusEnum {
  canceled = -1,
  unTrigger = 'not_triggered',
  unTrigger2 = 2,
  entrusted = 1,
  triggered = 'already_triggered',
  triggeredEntrustFailed = 'triggered_failed',
  systemCanceled = 'revoke_sys',
  manualCanceled = 'revoke',
}

export function getFuturePlanOrderStatusEnumName(value: FuturePlanOrderStatusEnum) {
  return {
    [FuturePlanOrderStatusEnum.unTrigger]: t`order.constants.status.unTrigger`,
    [FuturePlanOrderStatusEnum.unTrigger2]: t`order.constants.status.unTrigger`,
    [FuturePlanOrderStatusEnum.entrusted]: t`order.constants.status.entrusted`,
    [FuturePlanOrderStatusEnum.triggered]: t`features_orders_order_columns_spot_5101087`,
    [FuturePlanOrderStatusEnum.systemCanceled]: t`order.constants.status.canceled`,
    [FuturePlanOrderStatusEnum.manualCanceled]: t`order.constants.status.canceled`,
    [FuturePlanOrderStatusEnum.triggeredEntrustFailed]: t`constants_order_5101513`,
  }[value]
}
export enum FutureOrderReasonEnum {
  system = 1,
  user = 2,
}

export function getFutureOrderReasonEnumName(value: FutureOrderReasonEnum) {
  return (
    {
      [FutureOrderReasonEnum.system]: t`constants/order-15`,
      [FutureOrderReasonEnum.user]: t`constants/order-16`,
    }[value] || t`order.constants.status.failed`
  )
}
export enum FutureHoldingOrderDirectionEnum {
  all = '',
  buy = 'long',
  sell = 'short',
}
export function getFutureHoldingOrderDirectionEnumName(value: FutureHoldingOrderDirectionEnum) {
  return {
    [FutureHoldingOrderDirectionEnum.all]: t`common.all`,
    [FutureHoldingOrderDirectionEnum.buy]: t`constants/order-17`,
    [FutureHoldingOrderDirectionEnum.sell]: t`constants/order-18`,
  }[value]
}
export enum FutureMarginOrderTypeEnum {
  manual = 1,
  lever = 2,
  auto = 3,
  all = '',
}
export function getFutureMarginOrderTypeEnumName(value: FutureMarginOrderTypeEnum) {
  return {
    [FutureMarginOrderTypeEnum.all]: t`common.all`,
    [FutureMarginOrderTypeEnum.manual]: t`constants/order-19`,
    [FutureMarginOrderTypeEnum.lever]: t`constants/order-20`,
    [FutureMarginOrderTypeEnum.auto]: t`constants/order-21`,
  }[value]
}
/** 现货订单状态组合 */
export const SpotOrderStatusParamsCompositionEnum = {
  settled: OrderStatusEnum.settled,
  canceled: [OrderStatusEnum.manualCanceled, OrderStatusEnum.systemCanceled].join(','),
  partlyCanceled: OrderStatusEnum.partlyCanceled,
}
/** 现货计划订单状态组合 */
export const SpotPlanOrderStatusParamsCompositionEnum = {
  triggered: [SpotPlanOrderStatusEnum.triggered, SpotPlanOrderStatusEnum.triggeredEntrustFailed].join(','),
  canceled: [SpotPlanOrderStatusEnum.manualCanceled, SpotPlanOrderStatusEnum.systemCanceled].join(','),
}

/** 委托方式 */
export enum EntrustTypeEnum {
  // 限价市价都属于普通委托
  limit = 1, // 限价
  market = 2, // 市价
  plan,
  normal,
  stopLimit,
}
export function getOrderEntrustTypeEnumName(value: EntrustTypeEnum) {
  return {
    [EntrustTypeEnum.limit]: t`order.constants.matchType.limit`,
    [EntrustTypeEnum.market]: t`order.constants.matchType.market`,
    [EntrustTypeEnum.normal]: t`order.constants.placeOrderType.normal`,
    [EntrustTypeEnum.plan]: t`order.constants.placeOrderType.plan`,
    [EntrustTypeEnum.stopLimit]: t`order.tabs.profitLoss`,
  }[value]
}
export enum TradePriceTypeEnum {
  /** 最新价 */
  latest = 2,
  /** 标价价格 */
  mark = 1,
}
export function getTradePriceTypeEnumName(type: TradePriceTypeEnum) {
  return {
    [TradePriceTypeEnum.latest]: t`features_market_market_list_common_market_list_trade_pair_table_schema_index_5101265`,
    [TradePriceTypeEnum.mark]: t`constants_order_5101074`,
  }[type]
}
export function getTradePriceTypeEnumName2(type: TradePriceTypeEnum) {
  return {
    [TradePriceTypeEnum.latest]: t`constants_order_5101075`,
    [TradePriceTypeEnum.mark]: t`future.funding-history.index-price.column.mark-price`,
  }[type]
}
export enum SpotPlanTriggerDirection {
  up = 1,
  down = 2,
}
export enum SpotNormalOrderMarketUnitEnum {
  /** 交易额 */
  amount = 'funds',
  /** 委托数量 */
  entrustAmount = 'amount',
}

export enum FutureNormalOrderTypeIndEnum {
  limit = 'limit_order',
  market = 'market_order',
  liquidation = 'forced_liquidation_order',
  /** 强减 */
  lighten = 'forced_lighten_order',
}
export function getFutureNormalOrderTypeIndEnumNameWithSuffix(value: FutureNormalOrderTypeIndEnum) {
  return {
    [FutureNormalOrderTypeIndEnum.limit]: t`order.constants.matchType.limit`,
    [FutureNormalOrderTypeIndEnum.market]: t`order.constants.matchType.market`,
    [FutureNormalOrderTypeIndEnum.liquidation]: t`constants_order_5101353`,
    [FutureNormalOrderTypeIndEnum.lighten]: t`constants_order_5101354`,
  }[value]
}
export function getFutureNormalOrderTypeIndEnumName(value: FutureNormalOrderTypeIndEnum) {
  return {
    [FutureNormalOrderTypeIndEnum.limit]: t`trade.tab.orderType.currentPrice`,
    [FutureNormalOrderTypeIndEnum.market]: t`trade.tab.orderType.marketPrice`,
    [FutureNormalOrderTypeIndEnum.liquidation]: t`constants/order-13`,
    [FutureNormalOrderTypeIndEnum.lighten]: t`constants/order-14`,
  }[value]
}
export enum FutureNormalOrderStatusEnum {
  canceled = 'revoke',
  unsettled = 'unsold',
  systemCanceled = 'revoke_sys',
  manualCanceled = 'revoke',
  partlySucceed = 'partially',
  settled = 'deal_done',
  partlyCanceled = 'partial_deal_canceled',
}
export function getFutureNormalOrderStatusEnumName(value: FutureNormalOrderStatusEnum) {
  return {
    [FutureNormalOrderStatusEnum.partlySucceed]: t`order.constants.status.partlySucceed`,
    [FutureNormalOrderStatusEnum.settled]: t`features_orders_order_columns_spot_5101086`,
    [FutureNormalOrderStatusEnum.unsettled]: t`features_orders_details_spot_5101077_2`,
    [FutureNormalOrderStatusEnum.systemCanceled]: t`order.constants.status.canceled`,
    [FutureNormalOrderStatusEnum.manualCanceled]: t`order.constants.status.canceled`,
    [FutureNormalOrderStatusEnum.canceled]: t`order.constants.status.canceled`,
    [FutureNormalOrderStatusEnum.partlyCanceled]: t`order.constants.status.partlyCanceled`,
  }[value]
}
export enum FutureOrderActionEnum {
  cancel = 'cancel',
  margin = 'margin',
  detail = 'detail',
  stopLimit = 'stopLimit',
}
/** 止盈止损委托类型 */
export enum FutureOrderStopLimitEntrustTypeEnum {
  limit = 'limit',
  market = 'market',
}
export function getFutureOrderGeneralEntrustTypeWithSuffix(value: FutureOrderStopLimitEntrustTypeEnum) {
  return {
    [FutureOrderStopLimitEntrustTypeEnum.limit]: t`order.constants.matchType.limit`,
    [FutureOrderStopLimitEntrustTypeEnum.market]: t`order.constants.matchType.market`,
  }[value]
}
export function getFuturePlanOrderGeneralEntrustTypeWithSuffix(value: FutureOrderStopLimitEntrustTypeEnum) {
  return {
    [FutureOrderStopLimitEntrustTypeEnum.limit]: t`constants/order-8`,
    [FutureOrderStopLimitEntrustTypeEnum.market]: t`features_orders_order_columns_spot_5101082`,
  }[value]
}
/** 止盈止损触发价格类型 */
export enum FutureOrderStopLimitTriggerTypeIndEnum {
  new = 'new',
  mark = 'mark',
}

/** 止损止盈详情里的状态 */
export enum FutureOrderStopLimitStatusEnum {
  editable = 'not_triggered',
  // 已生效
  effective = 'already_triggered',
  // 已失效
  invalid = 'expired',
}
/** 止盈止损订单状态 */
export enum FutureStopLimitOrderStatusEnum {
  canceled = 'revoke',
  systemCanceled = 'revoke_sys',
  manualCanceled = 'revoke',
  unTrigger = 'not_triggered',
  triggered = 'already_triggered',
  triggered2 = 'already_triggered',
  triggeredFailed = 'triggered_failed',
}
export function getFutureStopLimitOrderStatusEnumName(value: FutureStopLimitOrderStatusEnum) {
  return {
    [FutureStopLimitOrderStatusEnum.unTrigger]: t`features/orders/order-columns/future-3`,
    [FutureStopLimitOrderStatusEnum.triggered]: t`features/orders/order-columns/future-4`,
    [FutureStopLimitOrderStatusEnum.triggered2]: t`features/orders/order-columns/future-4`,
    [FutureStopLimitOrderStatusEnum.systemCanceled]: t`order.constants.status.canceled`,
    [FutureStopLimitOrderStatusEnum.manualCanceled]: t`order.constants.status.canceled`,
    [FutureStopLimitOrderStatusEnum.triggeredFailed]: t`constants_order_5101513`,
  }[value]
}
/** 合约普通订单状态组合 */
export const FutureNormalOrderStatusParamsCompositionEnum = {
  settled: FutureNormalOrderStatusEnum.settled,
  canceled: [FutureNormalOrderStatusEnum.manualCanceled, FutureNormalOrderStatusEnum.systemCanceled].join(','),
  partlyCanceled: FutureNormalOrderStatusEnum.partlyCanceled,
}
/** 合约计划订单状态组合 */
export const FuturePlanOrderStatusParamsCompositionEnum = {
  triggered: [FuturePlanOrderStatusEnum.triggered, FuturePlanOrderStatusEnum.triggeredEntrustFailed].join(','),
  canceled: [FuturePlanOrderStatusEnum.manualCanceled, FuturePlanOrderStatusEnum.systemCanceled].join(','),
}
/** 合约止盈止损订单状态组合 */
export const FutureStopLimitOrderStatusParamsCompositionEnum = {
  triggered: [FutureStopLimitOrderStatusEnum.triggered, FutureStopLimitOrderStatusEnum.triggeredFailed].join(','),
  canceled: [FutureStopLimitOrderStatusEnum.canceled, FutureStopLimitOrderStatusEnum.systemCanceled].join(','),
}

export enum FutureOrderStopLimitStrategyTypeEnum {
  profit = 'stop_profit',
  loss = 'stop_loss',
}
export enum FutureOrderPlaceUnitEnum {
  // 计价币
  QUOTE = 'QUOTE',
  // 标的币
  BASE = 'BASE',
}

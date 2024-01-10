import { ITableAction } from '@/components/table-actions'
import {
  EntrustTypeEnum,
  FutureNormalOrderStatusEnum,
  FutureNormalOrderTypeIndEnum,
  FutureOrderActionEnum,
  FutureOrderDirectionEnum,
  FutureOrderPlaceUnitEnum,
  FutureOrderStatusEnum,
  FutureOrderStopLimitEntrustTypeEnum,
  FutureOrderStopLimitStrategyTypeEnum,
  FutureOrderSystemTypeEnum,
  FuturePlanOrderStatusEnum,
} from '@/constants/order'
import { TradeFuturesOrderAssetsTypesEnum, TradeMarketAmountTypesEnum } from '@/constants/trade'
import { baseOrderFutureStore } from '@/store/order/future'
import { IFutureOrderItem, IQueryFutureOrderDetailResp, IQueryFutureOrderListReq } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { decimalUtils } from '@nbit/utils'
import futureWs from '@/plugins/ws/futures'
import Decimal from 'decimal.js'
import { WsBizEnum, WsThrottleTimeEnum, WsTypesEnum } from '@/constants/ws'
import { ISubscribeParams } from '@/plugins/ws/types'
import { WSThrottleTypeEnum } from '@/plugins/ws/constants'
import { UserContractVersionEnum } from '@/constants/user'
import { baseFuturesStore } from '@/store/futures'
import { baseContractMarketStore } from '@/store/market/contract'
import { formatNumberDecimal, formatNumberDecimalDelZero } from '../decimal'
import { getTextFromStoreEnums } from '../store'
import { getBusinessName } from '../common'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

export function futureOrderMapParamsFn(params: IQueryFutureOrderListReq): IQueryFutureOrderListReq {
  return {
    ...params,
    statusCd: Array.isArray(params.statusArr) ? params.statusArr.join(',') : params.status,
    // side: Array.isArray(params.direction) ? (params.direction.length > 1 ? '' : params.direction[0]) : params.direction,
    startTime: params.beginDateNumber?.toString(),
    endTime: params.endDateNumber?.toString(),
    entrustTypeInd: params.orderType,
    typeInd: params.orderType,
    beginDateNumber: undefined,
    endDateNumber: undefined,
    direction: undefined,
    statusArr: undefined,
    dateType: undefined,
  }
}
function getFutureStopLimitOrderTypeText(entrustType: string, strategyTypeInd: string) {
  return (
    {
      [FutureOrderStopLimitStrategyTypeEnum.profit]: {
        [FutureOrderStopLimitEntrustTypeEnum.market]: t`constants/order-11`,
        [FutureOrderStopLimitEntrustTypeEnum.limit]: t`constants/order-9`,
      },
      [FutureOrderStopLimitStrategyTypeEnum.loss]: {
        [FutureOrderStopLimitEntrustTypeEnum.market]: t`constants/order-12`,
        [FutureOrderStopLimitEntrustTypeEnum.limit]: t`constants/order-10`,
      },
    }[strategyTypeInd]?.[entrustType] || ''
  )
}
function getFuturePlanOrderTypeText(entrustType: string) {
  return (
    {
      [FutureOrderStopLimitEntrustTypeEnum.market]: t`features_orders_order_columns_spot_5101082`,
      [FutureOrderStopLimitEntrustTypeEnum.limit]: t`constants/order-8`,
    }[entrustType] || ''
  )
}
/** 获取订单枚举文本 */
export function getFutureOrderValueEnumText(
  orderItem: IFutureOrderItem | IQueryFutureOrderDetailResp,
  replaceValues: Partial<IFutureOrderItem> = {}
) {
  const order = {
    ...orderItem,
    ...replaceValues,
  }
  const orderEnums = baseOrderFutureStore.getState().orderEnums
  const orderStatusEnums = orderEnums.orderStatus.enums
  const planOrderStatusEnums = orderEnums.planOrderStatus.enums
  const stopLimitOrderStatusEnums = orderEnums.stopLimitOrderStatus.enums
  const planOrder = order as IFutureOrderItem
  const normalOrder = order as IFutureOrderItem
  const entrustType = normalOrder.strategyTypeInd
    ? EntrustTypeEnum.stopLimit
    : planOrder.triggerPrice
    ? EntrustTypeEnum.plan
    : EntrustTypeEnum.normal
  const normalStatusConfigs = {
    [FutureNormalOrderStatusEnum.systemCanceled]: {
      text: t`order.constants.status.canceled`,
    },
    [FutureNormalOrderStatusEnum.manualCanceled]: {
      text: t`order.constants.status.canceled`,
    },
  }
  const planStatusConfigs = {
    [FuturePlanOrderStatusEnum.systemCanceled]: {
      text: t`order.constants.status.canceled`,
    },
    [FuturePlanOrderStatusEnum.manualCanceled]: {
      text: t`order.constants.status.canceled`,
    },
  }
  const stopLimitStatusConfigs = {
    [FuturePlanOrderStatusEnum.systemCanceled]: {
      text: t`order.constants.status.canceled`,
    },
    [FuturePlanOrderStatusEnum.manualCanceled]: {
      text: t`order.constants.status.canceled`,
    },
  }
  const statusConfig = {
    [EntrustTypeEnum.normal]: normalStatusConfigs,
    [EntrustTypeEnum.plan]: planStatusConfigs,
    [EntrustTypeEnum.stopLimit]: stopLimitStatusConfigs,
  }[entrustType][order.statusCd]
  const statusEnums = {
    [EntrustTypeEnum.normal]: orderStatusEnums,
    [EntrustTypeEnum.plan]: planOrderStatusEnums,
    [EntrustTypeEnum.stopLimit]: stopLimitOrderStatusEnums,
  }[entrustType]
  const typeTextWithSuffixEnums = {
    [EntrustTypeEnum.normal]: orderEnums.entrustTypeWithSuffix.enums,
    [EntrustTypeEnum.plan]: orderEnums.planEntrustTypeWithSuffix.enums,
    [EntrustTypeEnum.stopLimit]: orderEnums.stopLimitEntrustTypeWithSuffix.enums,
  }[entrustType]
  // 对于已撤销，这里做一个单独的处理，因为控制台还是分开显示手动和系统，但是前端只有一个已撤销，无法改变文字来区分
  const statusText = statusConfig?.text || getTextFromStoreEnums(normalOrder.statusCd!, statusEnums)

  const typeText = getTextFromStoreEnums(order.typeInd, orderEnums.entrustType.enums)
  let typeTextWithSuffix = {
    [EntrustTypeEnum.normal]: getTextFromStoreEnums(order.typeInd, typeTextWithSuffixEnums),
    [EntrustTypeEnum.plan]: getTextFromStoreEnums(planOrder.entrustTypeInd!, typeTextWithSuffixEnums),
    [EntrustTypeEnum.stopLimit]: getTextFromStoreEnums(normalOrder.entrustTypeInd, typeTextWithSuffixEnums),
  }[entrustType]
  if (entrustType === EntrustTypeEnum.stopLimit) {
    typeTextWithSuffix = getFutureStopLimitOrderTypeText(order.entrustTypeInd, order.strategyTypeInd)
  } else if (entrustType === EntrustTypeEnum.plan) {
    typeTextWithSuffix = getFuturePlanOrderTypeText(order.entrustTypeInd)
  }
  const directionText = getTextFromStoreEnums(
    entrustType === EntrustTypeEnum.stopLimit ? order.triggerSideInd : order.sideInd,
    orderEnums.orderDirection.enums
  )

  return {
    statusText,
    directionText,
    typeText,
    typeTextWithSuffix,
  }
}
export function getFutureOrderCountSymbol(order: IFutureOrderItem) {
  return order.placeUnit === FutureOrderPlaceUnitEnum.BASE ? order.baseCoinShortName : order.quoteCoinShortName
}

/** 获取订单操作列可用操作 */
export function getFutureOrderActions(order: IFutureOrderItem) {
  const isPlanOrder = !!order.triggerPrice && !order.strategyTypeInd
  const isStopLimitOrder = !!order.triggerPrice && !!order.strategyTypeInd
  const showStopLimitButton = order.hasStrategy
  const cancelable =
    // 正常订单
    (!isPlanOrder &&
      [FutureNormalOrderStatusEnum.partlySucceed, FutureNormalOrderStatusEnum.unsettled].includes(
        order.statusCd as FutureNormalOrderStatusEnum
      )) ||
    ((isPlanOrder || isStopLimitOrder) && [FuturePlanOrderStatusEnum.unTrigger].includes(order.statusCd as any))
  const isLiquidation = [
    FutureOrderSystemTypeEnum.liquidateBuy,
    FutureOrderSystemTypeEnum.liquidateSell,
    FutureOrderSystemTypeEnum.liquidateOther,
  ].includes(order.systemType)
  const hasRefOrder = (!isPlanOrder && !isStopLimitOrder) || !!order.refOrderId
  const isProVersion =
    // 兼容老版本数据
    order.perpetualVersion === UserContractVersionEnum.professional || Number(order.additionalMargin) > 0
  const actions: ITableAction[] = [
    {
      name: t`features_orders_order_table_cell_5101350`,
      id: FutureOrderActionEnum.stopLimit,
      visible: showStopLimitButton,
    },
    {
      name: isLiquidation ? t`features/orders/order-table-cell-0` : t`assets.financial-record.detail`,
      id: FutureOrderActionEnum.detail,
      visible: !cancelable && hasRefOrder,
    },
    {
      name: t`order.table-cell.action.cancel`,
      id: FutureOrderActionEnum.cancel,
      visible: cancelable,
    },
    {
      name: t`features/orders/details/holding-7`,
      id: FutureOrderActionEnum.margin,
      // 减仓单不能调整保证金，下单时为普通版也不能调整保证金
      visible:
        isPlanOrder &&
        isProVersion &&
        order.marginType === TradeFuturesOrderAssetsTypesEnum.assets &&
        (order.statusCd as any) === FuturePlanOrderStatusEnum.unTrigger &&
        order.typeInd !== FutureNormalOrderTypeIndEnum.lighten &&
        ![FutureOrderDirectionEnum.closeBuy, FutureOrderDirectionEnum.closeSell].includes(order.sideInd as any),
    },
  ]

  return actions
}

export function getFutureOrderIsBuy(direction: string) {
  return [FutureOrderDirectionEnum.openBuy, FutureOrderDirectionEnum.closeSell].includes(direction as any)
}
export function getFutureOrderDirectionColorClass(direction: string) {
  return FutureOrderDirectionEnum.openBuy === direction ? 'text-buy_up_color' : 'text-sell_down_color'
}
/**
 * 计算百分比
 * 金额 / 可用余额
 */
export function calcPercent(amount: Decimal.Value, balance: Decimal.Value) {
  if (Number(balance) === 0) {
    return 100
  }
  return Math.min(Number(formatNumberDecimal(decimalUtils.SafeCalcUtil.div(amount, balance).mul(100), 2, true)), 100)
}
type ICheckStrategyPriceParams = {
  entrustType: EntrustTypeEnum
  isBuy: boolean
  lossPrice: string
  profitPrice: string
  entrustPrice: string
  triggerPrice: string
  /** 0 是买 1 价，1 是卖 1 价 */
  depthQuotePrice: string[]
  isMarketPrice: boolean
}
function checkStrategyLossPrice({ depthQuotePrice, lossPrice, isBuy }: ICheckStrategyPriceParams) {
  if (!lossPrice) {
    return true
  }
  // 开多止损小于卖一价，开空止损大于买一价
  return isBuy
    ? SafeCalcUtil.sub(lossPrice, depthQuotePrice[1]).lt(0)
    : SafeCalcUtil.sub(lossPrice, depthQuotePrice[0]).gt(0)
}
function checkStrategyProfitPrice({ depthQuotePrice, profitPrice, isBuy }: ICheckStrategyPriceParams) {
  if (!profitPrice) {
    return true
  }

  // 开多止盈大于卖一价，开空止盈小于买一价
  return isBuy
    ? SafeCalcUtil.sub(profitPrice, depthQuotePrice[1]).gt(0)
    : SafeCalcUtil.sub(profitPrice, depthQuotePrice[0]).lt(0)
}
/**
 * 校验止盈止损规则
 * @return 校验通过
 */
export function checkStrategyPrice(params: ICheckStrategyPriceParams) {
  // 市价取盘口价
  let depthQuotePrice = [...params.depthQuotePrice]
  // 限价和计划限价取委托价
  if (
    params.entrustType === EntrustTypeEnum.limit ||
    (params.entrustType === EntrustTypeEnum.plan && !params.isMarketPrice)
  ) {
    depthQuotePrice = [params.entrustPrice, params.entrustPrice]
  } else if (params.entrustType === EntrustTypeEnum.plan && params.isMarketPrice) {
    depthQuotePrice = [params.triggerPrice, params.triggerPrice]
  }
  return (
    checkStrategyLossPrice({
      ...params,
      depthQuotePrice,
    }) &&
    checkStrategyProfitPrice({
      ...params,
      depthQuotePrice,
    })
  )
}

export function subscribeFutureOrders(createCallback: (type: EntrustTypeEnum) => (data: any) => void) {
  const subscribeParams: ISubscribeParams[] = [
    {
      subs: {
        biz: WsBizEnum.perpetual,
        type: WsTypesEnum.perpetualOrder,
        base: '',
        quote: '',
        granularity: '',
      },
      throttleType: WSThrottleTypeEnum.increment,
      throttleTime: WsThrottleTimeEnum.Market,
      callback: createCallback(EntrustTypeEnum.normal),
    },
    {
      subs: {
        biz: WsBizEnum.perpetual,
        type: WsTypesEnum.perpetualPlanOrder,
        base: '',
        quote: '',
        granularity: '',
      },
      throttleType: WSThrottleTypeEnum.increment,
      throttleTime: WsThrottleTimeEnum.Market,
      callback: createCallback(EntrustTypeEnum.plan),
    },
    {
      subs: {
        biz: WsBizEnum.perpetual,
        type: WsTypesEnum.perpetualStopLimitOrder,
        base: '',
        quote: '',
        granularity: '',
      },
      throttleType: WSThrottleTypeEnum.increment,
      throttleTime: WsThrottleTimeEnum.Market,
      callback: createCallback(EntrustTypeEnum.stopLimit),
    },
  ]
  subscribeParams.forEach(({ callback, ...params }) => {
    futureWs.subscribe({
      ...params,
      callback,
    })
  })
  return () => {
    subscribeParams.forEach(params => {
      futureWs.unsubscribe(params)
    })
  }
}
/** 从列表里获取合约币对，需要在页面调用获取函数之后才能正确拿到数据 */
export function getFuture(symbolNameOrId: string | number) {
  const { allTradePairs } = baseContractMarketStore.getState()
  const future = allTradePairs.find(item => item.symbolName === symbolNameOrId || item.id === symbolNameOrId)
  return future
}
/** 根据交易区设置获取合约订单委托数量单位，要响应式的话需要顶层组件订阅依赖 */
export function getFutureOrderCountByTradeUnit(order: IFutureOrderItem) {
  const tradeUnit: TradeMarketAmountTypesEnum = baseFuturesStore.getState().tradePanel.tradeUnit
  let tradeSize = ''
  let size = ''
  const placeUnit = order.placeUnit || FutureOrderPlaceUnitEnum.BASE
  const future = getFuture(order.symbol)
  const symbolName =
    tradeUnit === TradeMarketAmountTypesEnum.amount ? order.baseCoinShortName : order.quoteCoinShortName
  const sizeDigit = tradeUnit === TradeMarketAmountTypesEnum.amount ? future?.amountOffset : future?.quoteSymbolScale
  if (
    // 止盈止损委托没有单位，默认为按数量下单
    (tradeUnit === TradeMarketAmountTypesEnum.amount && placeUnit === FutureOrderPlaceUnitEnum.BASE) ||
    (tradeUnit === TradeMarketAmountTypesEnum.funds && placeUnit === FutureOrderPlaceUnitEnum.QUOTE)
  ) {
    tradeSize = formatNumberDecimalDelZero(order.tradeSize, sizeDigit)
    size = formatNumberDecimalDelZero(order.size, sizeDigit)
  } else {
    // 二者不一致时就需要换算
    // 取委托价，市价的话就取触发价或者成交均价
    const entrustPrice = order.price || order.triggerPrice || order.tradePrice
    if (tradeUnit === TradeMarketAmountTypesEnum.amount) {
      // 成交数量用均价，委托数量用委托价
      tradeSize = order.tradeSize
        ? formatNumberDecimalDelZero(SafeCalcUtil.div(order.tradeSize, order.tradePrice), sizeDigit)
        : order.tradeSize
      size = formatNumberDecimalDelZero(SafeCalcUtil.div(order.size, entrustPrice), sizeDigit)
    } else {
      tradeSize = order.tradeSize
        ? formatNumberDecimalDelZero(SafeCalcUtil.mul(order.tradeSize, order.tradePrice), sizeDigit)
        : order.tradeSize
      size = formatNumberDecimalDelZero(SafeCalcUtil.mul(order.size, entrustPrice), sizeDigit)
    }
  }

  return {
    tradeSize,
    size,
    symbolName,
  }
}

export function generateOrderPageDefaultSeoMeta(pageTitle?: string) {
  const values = {
    businessName: getBusinessName(),
  }
  const preTitle = pageTitle ? `${pageTitle} | ` : ''

  return {
    title: `${preTitle}${t({
      id: `modules_kyc_company_verified_material_index_page_server_qovx8dpfv3`,
      values,
    })}`,
    description: `${preTitle}${t({
      id: `modules_assets_company_verified_material_index_page_server_efre42ngx6`,
      values,
    })}`,
  }
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { FutureTradeUnitEnum } from '@/constants/future/trade'
import {
  FutureOrderSystemTypeEnum,
  FutureOrderStopLimitTypeEnum,
  FutureHoldingOrderDirectionEnum,
  FutureHoldingOrderPositionTypeEnum,
} from '@/constants/order'
import { baseOrderFutureStore, IBaseOrderFutureStore } from '@/store/order/future'
import { IFutureHoldingOrderItem, IFutureOrderItem } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { decimalUtils } from '@nbit/utils'
import { formatNumberDecimal } from './decimal'

/**
 * 将 Modal.confirm 转为 promise，避免太多回调，语义也更清晰，其它类似组件也可以用，
 * @returns 返回一个关闭弹窗的函数
 */
export function confirmToPromise<
  T extends {
    onOk?: () => void
    onCancel?: () => void
  }
>(fn: (a: T) => any, params: T) {
  let done = (ok?: boolean) => {}
  const donePromise = new Promise((resolve, reject) => {
    done = (ok = true) => {
      if (ok) {
        resolve(true)
      } else {
        reject()
      }
    }
  })
  return new Promise<typeof done>((resolve, reject) => {
    // eslint-disable-next-line no-promise-executor-return
    return fn({
      autoFocus: false,
      ...params,
      onOk: async () => {
        resolve(done)
        return donePromise
      },
      onCancel: reject,
    })
  })
}
/**
 * 将 id 数组转为可用的 options
 * @param values [1, 2]
 * @param getNameFn 根据 id 获取名称的函数，如 (id) => ({ 1: '1}[id])
 */
export function enumValuesToOptions(values: any[], getNameFn: (value: any) => string) {
  return values.map(value => ({
    value,
    label: getNameFn(value),
  }))
}
export function isUsdt(val: string) {
  return val === FutureTradeUnitEnum.usdt
}
/** 获取金额数量 */
export function getAmount(amount: string, price: string, row: any, unit: number) {
  return formatNumberDecimal(0, 4)
}

export function getUnitName(unit: FutureTradeUnitEnum, quote: string, indexBase: string) {
  return {
    [FutureTradeUnitEnum.a]: t`helper/order-0`,
    [FutureTradeUnitEnum.quote]: quote.toLocaleUpperCase(),
    [FutureTradeUnitEnum.indexBase]: indexBase.toLocaleUpperCase(),
  }[unit]
}

/** 获取带单位的数量 */
export function getCurrentUnitAmount(
  amount: string,
  row: any,
  isDealAmount: boolean,
  setUnit?: FutureTradeUnitEnum,
  withName = true
) {
  return ''
}

/** 当前币对的可用余额 */
function getAvailableBalance(base: string, state: IBaseOrderFutureStore) {
  return (
    state.assetsCoinList.find(item => item.currencyCode.toUpperCase() === base.toUpperCase())?.realAvailableBalance || 0
  )
}
/** 获取所有全仓的未实现盈亏总额  */
function getUnRealizedSurplus(base: string, state: IBaseOrderFutureStore) {
  return 0
}
/** 获取标记价格  */
export function getMarkPrice(contractCode: string, state: IBaseOrderFutureStore) {
  return (
    state.fundRatesList.find(item => item.contractCode.toUpperCase() === contractCode.toUpperCase())?.markPrice || ''
  )
}
/** 获取最新价格  */
export function getLatestPrice(contractCode: string, state: IBaseOrderFutureStore) {
  return state.quotationList.find(item => item.contractCode.toUpperCase() === contractCode.toUpperCase())?.last || ''
}
/** 可平金额 */
function calcHoldingOrderLiquidateAmount(order: IFutureHoldingOrderItem) {
  return 0
}
/** 未实现盈亏 */
function calcHoldingOrderUnRealizedSurplus(order: IFutureHoldingOrderItem, state: IBaseOrderFutureStore) {
  return 0
}
/** 收益率 */
function calcHoldingOrderEaringRate(order: IFutureHoldingOrderItem, state: IBaseOrderFutureStore) {
  return {
    frontendCalcEarnings: 0,
    frontendCalcYieldRate: 0,
  }
}
/** 保证金率值 */
function calcHoldingOrderMarginRateValue(order: IFutureHoldingOrderItem, state: IBaseOrderFutureStore) {
  return 0
}
/** 保证金率 */
function calcHoldingOrderMarginRate(order: IFutureHoldingOrderItem, state: IBaseOrderFutureStore) {
  return {
    frontendCalcOpenMarginRateTwo: 0,
    frontendCalOpenMarginRate: 0,
  }
}
/** 最小保证金 */
function calcHoldingOrderMinMargin(order: IFutureHoldingOrderItem) {
  return 0
}
/** 计算调整后的强平价格 */
export function calcHoldingOrderLiquidatePriceAfterModifyMargin(order: IFutureHoldingOrderItem, margin: string) {
  return 0
}

/** 计算持仓订单的各项指标 */
export function calcHoldingOrder(order: IFutureHoldingOrderItem, state: IBaseOrderFutureStore) {
  return {
    ...calcHoldingOrderMarginRate(order, state),
    ...calcHoldingOrderEaringRate(order, state),
    frontendCalcMinMargin: calcHoldingOrderMinMargin(order),
    frontendCalcLiquidateAmount: calcHoldingOrderLiquidateAmount(order),
    frontendCalcUnRealizedSurplus: calcHoldingOrderUnRealizedSurplus(order, state),
  }
}
/** 转换数字价格 */
export function transformPriceNumber(val: string) {
  return (
    val
      // 清除“数字”和“.”以外的字符
      .replace(/[^\d.]/g, '')
      // 验证第一个字符是数字而不是。
      .replace(/^\./g, '')
      // 只保留第一个。清除多余的 .
      .replace(/\.{2,}/g, '.')
      // 这两步，我也不清楚干嘛的
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
  )
}
/** 止盈止损可平金额 */
export function calcFutureOrderLiquidateAmountWithStopLimit({
  order,
  orderAmount,
  isModify,
  isProfit,
  triggerPrice,
  latestPrice,
  stopLimitType,
  isMarketPrice,
  entrustPrice,
  futureUnit,
}: {
  order: IFutureHoldingOrderItem
  orderAmount: string
  isProfit: boolean
  /** 是否为修改，从持仓中为新增，止损止盈中为修改 */
  isModify: boolean
  triggerPrice: string
  entrustPrice: string
  latestPrice: string
  stopLimitType: FutureOrderStopLimitTypeEnum
  isMarketPrice: boolean
  futureUnit: FutureTradeUnitEnum
}) {
  return formatNumberDecimal('', 4).toString()
}
/** 数量转换为张 */
export function amountToCount({
  price,
  contractCode,
  amount,
  unitAmount,
  unitType,
}: {
  price: string
  contractCode: string
  amount: string
  unitAmount: string
  unitType: FutureTradeUnitEnum
}) {
  return 0
}
/** 计算止损止盈的预计盈亏金额 */
export function calcStopLimitProfitLossAmount({
  targetPrice,
  amount,
  orderPrice,
  order,
  isBuy,
  unitType,
}: {
  /** 计划卖出的价格 */
  targetPrice: string
  /** 计划卖出的数量 */
  amount: string
  orderPrice: string
  order: IFutureHoldingOrderItem
  isBuy: boolean
  unitType: FutureTradeUnitEnum
}) {
  return 0
}

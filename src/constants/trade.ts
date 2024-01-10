import { t } from '@lingui/macro'

export enum TradeModeEnum {
  /** 现货交易 */
  spot = 'spot',
  /** 合约交易 */
  futures = 'futures',
  /** 杠杆交易 */
  margin = 'margin',
}
export const getTradeModeMap = () => {
  return {
    [TradeModeEnum.spot]: t`trade.type.coin`,
    [TradeModeEnum.futures]: t`constants/trade-0`,
    [TradeModeEnum.margin]: t`constants/trade-1`,
  }
}
export enum TradeMarginEnum {
  /** 逐仓 */
  isolated = 'isolated',
  /** 全仓 */
  margin = 'margin',
}

export type ITradeSpotTabs = TradeMarginEnum | TradeModeEnum
export type ITradeFuturesTabs = TradeMarginEnum | TradeModeEnum

export const getTradeTabsMap = () => {
  return {
    [TradeModeEnum.spot]: t`trade.type.coin`,
    [TradeMarginEnum.isolated]: t`constants_trade_5`,
    [TradeMarginEnum.margin]: t`constants_trade_6`,
  }
}
export enum TradeOrderTypesEnum {
  /** 市价交易 */
  market = 'market',
  /** 限价交易 */
  limit = 'limit',
  /** 计划委托 */
  trailing = 'trailing',
}
export const getTradeOrderTypesMap = () => {
  return {
    [TradeOrderTypesEnum.market]: t`constants/trade-3`,
    [TradeOrderTypesEnum.limit]: t`constants/trade-2`,
    [TradeOrderTypesEnum.trailing]: t`features_trade_trade_setting_index_2520`,
  }
}
export enum TradePriceTypeEnum {
  /** 币种类型 */
  coinType = '0',
  /** 对手价 */
  lastPrice = 'BBO',
  /** 最优五档 */
  fivePrice = 'optimal5',
  /** 最优十档 */
  tenPrice = 'optimal10',
  /** 最优二十档 */
  twentyPrice = 'optimal20',
}
export const getTradePriceTypeMap = inputSuffix => ({
  [TradePriceTypeEnum.coinType]: inputSuffix,
  [TradePriceTypeEnum.lastPrice]: t`trade.form.price.type.2`,
  [TradePriceTypeEnum.fivePrice]: t`trade.form.price.type.3`,
  [TradePriceTypeEnum.tenPrice]: t`trade.form.price.type.4`,
  [TradePriceTypeEnum.twentyPrice]: t`trade.form.price.type.5`,
})

export const getTradePriceTypeLabelMap = isBuy => {
  if (isBuy) {
    return {
      [TradePriceTypeEnum.lastPrice]: t`trade.form.price.type.label.lastPrice.1`,
      [TradePriceTypeEnum.fivePrice]: t`trade.form.price.type.label.3${5}`,
      [TradePriceTypeEnum.tenPrice]: t`trade.form.price.type.label.3${10}`,
      [TradePriceTypeEnum.twentyPrice]: t`trade.form.price.type.label.3${20}`,
    }
  }
  return {
    [TradePriceTypeEnum.lastPrice]: t`trade.form.price.type.label.lastPrice.2`,
    [TradePriceTypeEnum.fivePrice]: t`trade.form.price.type.label.3${5}`,
    [TradePriceTypeEnum.tenPrice]: t`trade.form.price.type.label.3${10}`,
    [TradePriceTypeEnum.twentyPrice]: t`trade.form.price.type.label.3${20}`,
  }
}

export enum TradeBuyOrSellEnum {
  buy = '0',
  sell = '1',
}
/** 市价交易交易类型 */
export enum TradeMarketAmountTypesEnum {
  amount = 'amount',
  funds = 'funds',
}
export const getTradeMarketAmountTypesMap = (funds, amount) => ({
  [TradeMarketAmountTypesEnum.amount]: amount,
  [TradeMarketAmountTypesEnum.funds]: funds,
})
/** 杠杆交易类型 */
export enum TradeMarginTypesEnum {
  /** 普通 */
  normal = 'normal',
  /** 自动借款 */
  borrow = 'borrow',
  /** 自动还款 */
  repay = 'repay',
}
/** 杠杆交易类型 */
export const getTradeMarginTypesMap = () => ({
  [TradeMarginTypesEnum.normal]: t`constants_trade_7`,
  [TradeMarginTypesEnum.borrow]: t`constants_trade_8`,
  [TradeMarginTypesEnum.repay]: t`constants_trade_9`,
})
/** 合约交易类型 */
export enum TradeFuturesTypesEnum {
  /** 开仓 */
  open = 'open',
  /** 平仓 */
  close = 'close',
}
export const getTradeFuturesTypesMap = () => ({
  [TradeFuturesTypesEnum.open]: t`constants_trade_10`,
  [TradeFuturesTypesEnum.close]: t`constants_trade_11`,
})
/** 合约前提条件单位类型 */
export enum TradeFuturesOptionUnitEnum {
  /** 最新 */
  last = 'last',
  /** 标记 */
  mark = 'mark',
}
export const getTradeFuturesOptionUnitMap = () => ({
  [TradeFuturesOptionUnitEnum.last]: t`constants_trade_13`,
  [TradeFuturesOptionUnitEnum.mark]: t`constants_trade_12`,
})
/** 合约前提条件止盈止损类型 */
export enum TradeFuturesOptionEnum {
  /** 止盈 */
  takeProfit = 'takeProfit',
  /** 止损 */
  stopLoss = 'stopLoss',
}
export const getTradeFuturesOptionMap = () => ({
  [TradeFuturesOptionEnum.takeProfit]: t`constants/order-6`,
  [TradeFuturesOptionEnum.stopLoss]: t`constants/order-7`,
})

export type TradeEntrustModalType = Record<'openModal' | 'closeModal', () => void>

/** 手续费页面 tab 类型 */
export enum HelpFeeTabTypeEnum {
  /** 充提手续费率 */
  withdrawFee = 1,
  /** 现货手续费率 */
  spotFee,
  /** 合约交易手续费率 */
  futuresFee,
}

export enum TradeLayoutEnum {
  default = 'default',
  left = 'left',
  right = 'right',
}

export enum TradeFuturesOrderAssetsTypesEnum {
  assets = 'wallet',
  group = 'group',
}

/** 合约计算器收益、收益率类型 */
export enum TradeFuturesCalculatorIncomeUnitEnum {
  /** 收益 */
  incomeNumber = 'incomeNumber',
  /** 收益率 */
  incomePercent = 'incomePercent',
}
export const getTradeFuturesCalculatorIncomeUnitMap = () => ({
  [TradeFuturesCalculatorIncomeUnitEnum.incomeNumber]: t`features/orders/order-columns/future-2`,
  [TradeFuturesCalculatorIncomeUnitEnum.incomePercent]: t`features/orders/order-columns/holding-5`,
})

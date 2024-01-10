import {
  ITradeFuturesTabs,
  ITradeSpotTabs,
  TradeFuturesTypesEnum,
  TradeMarginEnum,
  TradeMarginTypesEnum,
  TradeMarketAmountTypesEnum,
  TradeModeEnum,
  TradeOrderTypesEnum,
  TradePriceTypeEnum,
} from '@/constants/trade'

import { t } from '@lingui/macro'
import { decimalUtils } from '@nbit/utils'
import Decimal from 'decimal.js'
import { YapiGetV1PerpetualTradePairDetailData } from '@/typings/yapi/PerpetualTradePairDetailV1GetApi'
import { UserFuturesTradeStatus } from '@/constants/user'
import { formatNumberDecimal } from './decimal'
import { getBusinessName } from './common'
/**
 * @description: 更具币种价格和数量计算交易额
 * 公式 price * amount
 */
export function getTradeTotalPrice(price, amount, precision, isRound?: boolean | Decimal.Rounding) {
  return Number(
    formatNumberDecimal(decimalUtils.getSafeDecimal(price).mul(decimalUtils.getSafeDecimal(amount)), precision, isRound)
  )
}
/**
 * @description: 更具币种价格和交易额计算数量
 * 公式 totalPrice / price
 * @param {*} price
 * @param {*} amount
 */
export function getTradeAmount(totalPrice, price, precision, isRound?: boolean | Decimal.Rounding) {
  return Number(
    formatNumberDecimal(
      decimalUtils.getSafeDecimal(totalPrice).div(decimalUtils.getSafeDecimal(price)),
      precision,
      isRound
    )
  )
}

/**
 * @description:
 * 1: 更具用户总筹码除以价格算出最大购买数量，公式 maxAmount=userCoinTotal/price
 * 2: 更具拖动百分比数字来计算交易数量，公式 maxAmount*percent/100
 * @param {*} percent
 * @param {*} userCoinTotal 用户拥有的筹码
 * @param {*} precision
 */
export function getTradeAmountByPercent(percent, userCoinTotal, precision) {
  return getValueByPercent(percent, userCoinTotal, precision)
}
/**
 * @description:
 * 更具拖动百分比数字来计算数量，公式 value*percent/100
 * @param {*} percent
 * @param {*} value 用户拥有的筹码
 * @param {*} precision
 */
export function getValueByPercent(percent, value, precision) {
  return formatNumberDecimal(
    decimalUtils.getSafeDecimal(percent).mul(decimalUtils.getSafeDecimal(value)).div(100),
    precision
  )
}
/**
 * @description: 更具用户持仓获取百分比金额
 * 公式 userCoinTotal*percent/100
 * @param {*} percent
 * @param {*} userCoinTotal
 */
export function getTotalByPercent(percent, userCoinTotal, precision) {
  return formatNumberDecimal(
    decimalUtils.getSafeDecimal(percent).mul(decimalUtils.getSafeDecimal(userCoinTotal)).div(100),
    precision
  )
}
export const getTradePriceByOrderBook = type => {
  // TODO:待实现 orderBook
  if (type === TradePriceTypeEnum.lastPrice) {
    return 300
  }
  if (type === TradePriceTypeEnum.fivePrice) {
    return 300
  }
  if (type === TradePriceTypeEnum.tenPrice) {
    return 300
  }
  if (type === TradePriceTypeEnum.twentyPrice) {
    return 300
  }
  return 0
}

export function getTradeOrderParams(
  tradeParams: any,
  currentCoin: any,
  tradeMode: TradeModeEnum,
  tradeTabType: ITradeSpotTabs | TradeFuturesTypesEnum | ITradeFuturesTabs,
  tradeOrderType: TradeOrderTypesEnum,
  tradeMarginType: TradeMarginTypesEnum,
  tradePriceType: TradePriceTypeEnum,
  isModeBuy: boolean,
  amountType: TradeMarketAmountTypesEnum
) {
  if (tradeMode === TradeModeEnum.spot) {
    // https://yapi.admin-devops.com/project/44/interface/api/2660
    if (tradeOrderType === TradeOrderTypesEnum.market) {
      const _params =
        amountType === TradeMarketAmountTypesEnum.amount
          ? { placeCount: tradeParams.amount, marketUnit: 'amount' }
          : { funds: tradeParams.funds, marketUnit: 'funds' }
      return {
        orderType: 2,
        side: isModeBuy ? 1 : 2,
        tradeId: currentCoin.tradeId,
        ..._params,
      }
    }
    if (tradeOrderType === TradeOrderTypesEnum.limit) {
      return {
        orderType: 1,
        optimalLimitOrder: 1,
        side: isModeBuy ? 1 : 2,
        tradeId: currentCoin.tradeId,
        placeCount: tradeParams.amount,
        placePrice: tradeParams.price,
      }
    }
  }
  if (tradeMode === TradeModeEnum.margin) {
    if (tradeOrderType === TradeOrderTypesEnum.trailing) {
      return {
        /** 0-买入 1-卖出 */
        direction: isModeBuy ? 0 : 1,
        marginMode: tradeTabType === TradeMarginEnum.margin ? 'cross' : 'isolated',
        marginTradeMode: tradeMarginType,
        tradeId: currentCoin.tradeId,
        type: isModeBuy ? 'buy' : 'sell',
      }
    }
    return {
      marginMode: tradeTabType === TradeMarginEnum.margin ? 'cross' : 'isolated',
      marginTradeMode: tradeMarginType,
      tradeId: currentCoin.tradeId,
      type: isModeBuy ? 'buy' : 'sell',
    }
  }
  return {}
}

/** 获取交易计划委托传参 */
export function getTradeSpotTrailingOrderParams(
  tradeParams: any,
  currentCoin: any,
  isModeBuy: boolean,
  amountType: TradeMarketAmountTypesEnum,
  isTradeTrailingMarketOrderType: boolean,
  lastPrice: string | number
) {
  // yapi.admin-devops.com/project/44/interface/api/2666
  if (isTradeTrailingMarketOrderType) {
    const trailingParams =
      amountType === TradeMarketAmountTypesEnum.funds
        ? {
            orderPrice: Number(tradeParams.funds),
          }
        : {
            orderAmount: Number(tradeParams.amount),
          }
    return {
      ...trailingParams,
      tradeId: currentCoin.tradeId,
      triggerTypeInd: 2,
      triggerPrice: tradeParams.triggerPrice,
      matchType: isTradeTrailingMarketOrderType ? 2 : 1,
      side: isModeBuy ? 1 : 2,
      triggerDirectionInd: tradeParams.triggerPrice <= lastPrice ? 2 : 1,
    }
  }
  return {
    tradeId: currentCoin.tradeId,
    triggerTypeInd: 2,
    triggerPrice: tradeParams.triggerPrice,
    matchType: isTradeTrailingMarketOrderType ? 2 : 1,
    side: isModeBuy ? 1 : 2,
    triggerDirectionInd: tradeParams.triggerPrice <= lastPrice ? 2 : 1,
    orderAmount: Number(tradeParams.amount),
    orderPrice: Number(tradeParams.price),
  }
}

/**
 * @description: 更具下单类型、交易价格类型判断是否需要数字输入框
 */
export function getIsPriceNumberTradePriceType(
  tradeOrderType: TradeOrderTypesEnum,
  tradePriceType: TradePriceTypeEnum
) {
  if (tradeOrderType === TradeOrderTypesEnum.limit || tradeOrderType === TradeOrderTypesEnum.trailing) {
    return tradePriceType === TradePriceTypeEnum.coinType
  }
  if (tradeOrderType === TradeOrderTypesEnum.market) {
    return false
  }
  return true
}

/**
 * @description: 校验 value 是否有值、合法
 * @param {*} value
 */
export const validatorTradeNumber = value => {
  /** 校验 0 undefined null */
  if (!value) {
    return false
  }
  /** 文字字符串允许通过校验 */
  const _val = Number(value)
  if (Number.isNaN(_val)) {
    return true
  }
  /** "0.000" */
  if (!_val) {
    return false
  }
  return true
}

/**
 * @description: 获取交易表单提交按钮文案
 * @param {*} tradeMode
 * @param {*} isModeBuy
 * @param {*} underlyingCoin
 * @param {*} futuresDelOptionChecked 是否合约减仓单
 */
export function getTradeFormSubmitBtnText(
  tradeMode: string,
  isTrading,
  contractStatusInd,
  isModeBuy?: boolean,
  underlyingCoin?: string,
  futuresDelOptionChecked?: boolean
) {
  if (contractStatusInd !== UserFuturesTradeStatus.open) {
    return t`helper_trade_xzelwd2yoj`
  }
  if (!isTrading) {
    return t`helper_trade_5101064`
  }
  if (tradeMode === TradeModeEnum.spot) {
    return isModeBuy
      ? t({ id: `features_trade_spot_index-0`, values: { underlyingCoin } })
      : t({ id: `features_trade_spot_index-1`, values: { underlyingCoin } })
  }
  if (TradeModeEnum.margin === tradeMode) {
    return isModeBuy
      ? t({ id: `features_trade_spot_index-2`, values: { underlyingCoin } })
      : t({ id: `features_trade_spot_index-3`, values: { underlyingCoin } })
  }
  if (TradeModeEnum.futures === tradeMode) {
    if (futuresDelOptionChecked) {
      return isModeBuy ? t`helper_trade_5101513` : t`helper_trade_5101514`
    }
    return isModeBuy ? t`helper/trade-2` : t`helper/trade-3`
  }
  return null
}

/**
 * @description:
 * 更具币对价格、数量获取交易额  price*amount
 * 1 BTC = 10000 USDT
 * @param {*} price
 * @param {*} amount
 * @param {*} precision
 * @param {*} currentLeverage 杠杆倍数
 */
export function getTradeTotalByMarket(price: any, amount: any, precision: any, currentLeverage?: any) {
  if (currentLeverage) {
    return formatNumberDecimal(decimalUtils.getSafeDecimal(price).mul(amount).div(currentLeverage), precision)
  }
  return formatNumberDecimal(decimalUtils.getSafeDecimal(price).mul(amount), precision)
}
/**
 * @description:
 * 更具币对价格、交易额获取数量  total/price
 * 1 BTC = 10000 USDT
 * @param {*} price
 * @param {*} total
 * @param {*} precision
 */
export function getTradeAmountByMarket(price, total, precision) {
  return formatNumberDecimal(decimalUtils.getSafeDecimal(total).div(price), precision)
}

/**
 * Parse leverage input value - remove unit 'X'
 * @param val formatted leverage value
 * @returns leverage value
 */
export function leverageInputParser(val) {
  let newVal = val
  if (newVal.toString().includes('.')) {
    newVal = newVal.split('.')[0]
  }
  if (newVal.toString().includes('x')) {
    newVal = newVal.split('x')[0]
  }
  return newVal
}

/**
 * Format leverage input value - add unit 'X'
 * @param val leverage value
 * @returns formatted leverage value
 */
export function leverageInputFormatter(val) {
  if (!val.toString().includes('x')) return `${val}x`
  return val.toString()
}

/** 按最大杠杆数分割 */
export function getLeverSliderPoints(maxLever: number) {
  const points = [1]
  const step = Math.floor(maxLever / 5)
  for (let i = 1; i < 5; i += 1) {
    points.push(step * i)
  }
  points.push(maxLever)
  return points
}

export function isMarketTrade(tradeOrderType, isTradeTrailingMarketOrderType) {
  if (
    tradeOrderType === TradeOrderTypesEnum.market ||
    (tradeOrderType === TradeOrderTypesEnum.trailing && isTradeTrailingMarketOrderType)
  ) {
    return true
  }
  return false
}

export type ITradePairLever = Required<YapiGetV1PerpetualTradePairDetailData>['tradePairLeverList'][0]

/** 获取当前杠杆配置 */
export function getCurrentLeverConfig(lever: number, leverList: ITradePairLever[]) {
  const currentLeverConfig =
    leverList
      .slice()
      .reverse()
      .find(item => item.maxLever! >= lever) || ({} as ITradePairLever)

  return currentLeverConfig
}
/**  重置默认杠杆 */
export function getResetLever(tradePairLeverList?: any) {
  const maxLever = tradePairLeverList ? tradePairLeverList?.[0]?.maxLever || 1 : 1
  const max = maxLever >= 20 ? 20 : 1
  return max
}

export function generateTradeDefaultSeoMeta({ title }, values: { symbol?: string; businessName?: string }) {
  const businessName = getBusinessName()
  values.businessName = businessName

  return {
    title,
    description: t({
      id: `modules_trade_index_page_hssvdouaqa`,
      values,
    }),
  }
}

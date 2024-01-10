// 合约计算器相关公式，和持仓中的公式无法共用

import { decimalUtils } from '@nbit/utils'
import { TradeFuturesCalculatorIncomeUnitEnum, TradeMarketAmountTypesEnum } from '@/constants/trade'
import { t } from '@lingui/macro'
import { TradeFuturesCalculatorTabsEnum } from '@/constants/future/trade'
import { getCurrentLeverConfig } from '../trade'
import { formatNumberDecimalDelZero } from '../decimal'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

/**
 * 计算保证金
 * 保证金 = 合约数量 * 开仓价格 / 杠杆
 */
export function calcMargin({ entrustPrice, lever, entrustAmount, digit, entrustFunds, amountType }, needDigit = true) {
  let margin
  if (amountType === TradeMarketAmountTypesEnum.amount) {
    margin = SafeCalcUtil.div(SafeCalcUtil.mul(entrustAmount, entrustPrice), lever).toString()
  } else {
    margin = SafeCalcUtil.div(entrustFunds, lever).toString()
  }
  return needDigit ? formatNumberDecimalDelZero(margin, digit) : margin
}
function calcFee({ entrustPrice, entrustAmount, digit, closePrice }, rate: number) {
  const openFee = SafeCalcUtil.mul(SafeCalcUtil.mul(entrustPrice, entrustAmount), rate)
  const closeFee = SafeCalcUtil.mul(SafeCalcUtil.mul(closePrice, entrustAmount), rate)
  return formatNumberDecimalDelZero(SafeCalcUtil.add(openFee, closeFee), digit)
}
/**
 * 计算 taker 手续费
 */
export function calcTakerFee(params: any) {
  return calcFee(params, params.selectedFuture?.takerFeeRate || 0)
}

/**
 * 计算 maker 手续费
 */
export function calcMakerFee(params: any) {
  return calcFee(params, params.selectedFuture?.markerFeeRate || 0)
}

/**
 * 计算收益
 * 收益 = (平仓价格 - 开仓价格) * 合约数量
 */
export function calcProfit({ entrustPrice, entrustAmount, closePrice, digit, direction }, needDigit = true) {
  // 暂时不减去手续费
  const result = SafeCalcUtil.sub(SafeCalcUtil.mul(SafeCalcUtil.sub(closePrice, entrustPrice), entrustAmount), 0).mul(
    !direction ? 1 : -1
  )
  if (needDigit) {
    return formatNumberDecimalDelZero(result, digit)
  }
  return result
}
/**
 * 计算收益率
 * 收益 = 收益 / 本金
 */
export function calcProfitRate({
  entrustPrice,
  lever,
  entrustAmount,
  digit,
  entrustFunds,
  amountType,
  closePrice,
  direction,
}) {
  return formatNumberDecimalDelZero(
    SafeCalcUtil.div(
      calcProfit({ entrustPrice, entrustAmount, closePrice, digit, direction }, false),
      calcMargin({ entrustPrice, lever, entrustAmount, digit, entrustFunds, amountType }, false)
    ),
    4
  )
}

/**
 * 计算平仓价格
 * 平仓价格 = 收益 / 合约数量 + 开仓价格
 */
export function calcClosePrice({
  entrustPrice,
  lever,
  entrustAmount,
  digit,
  entrustFunds,
  amountType,
  profitIsRate,
  profitRate,
  profit,
  direction,
}) {
  const _profit = profitIsRate
    ? SafeCalcUtil.mul(
        calcMargin({ entrustPrice, lever, entrustAmount, digit, entrustFunds, amountType }, false),
        SafeCalcUtil.div(profitRate, 100)
      )
    : profit
  return formatNumberDecimalDelZero(
    SafeCalcUtil.add(SafeCalcUtil.div(_profit, entrustAmount).mul(!direction ? 1 : -1), entrustPrice),
    digit
  )
}

/**
 * 计算强平价格
 * 开空/开多
 * （开仓价格 ±（保证金 + 额外保证金）/ 开仓数量 ) /（1 ± (taker 手续费率 + 维持保证金率）)
 */
export function calcLiquidationPrice({
  entrustPrice,
  extraMargin,
  lever,
  entrustAmount,
  digit,
  selectedFuture,
  entrustFunds,
  amountType,
  direction,
}) {
  const currentLeverConfig = getCurrentLeverConfig(lever, selectedFuture!.tradePairLeverList as any)
  const maintainMarginRatio = currentLeverConfig.marginRate
  const takerFeeRate = selectedFuture?.takerFeeRate || 0

  const margin = calcMargin({ entrustPrice, lever, entrustAmount, digit, entrustFunds, amountType }, false)

  const price = formatNumberDecimalDelZero(
    SafeCalcUtil.div(
      SafeCalcUtil.add(
        entrustPrice,
        SafeCalcUtil.div(SafeCalcUtil.add(margin, extraMargin), entrustAmount).mul(!direction ? -1 : 1)
      ),
      SafeCalcUtil.add(1, SafeCalcUtil.add(takerFeeRate, maintainMarginRatio).mul(!direction ? -1 : 1))
    ),
    digit
  )

  return Number(price) > 0 ? price : '0'
}

/**
 * 合约计算器校验
 */
export function validatorFuturesCalculator(formParams, tabVal, amountType, amountPrefix, futuresIncomeOptionUnit) {
  if (tabVal === TradeFuturesCalculatorTabsEnum.income) {
    if (!formParams.buyPrice) {
      const msg = t`helper_futures_computer_o9tqmtsqllajb0hjz5fe6`
      return msg
    }
    if (!formParams.sellPrice) {
      const msg = t`helper_futures_computer_tk78iowljkiorzg53nzr2`
      return msg
    }
    if (!formParams[amountType]) {
      const msg = t({
        id: 'features_trade_trade_futures_calculator_futures_calculator_amount_index_k9ejpv80qztlpaolfvodu',
        values: { 0: amountPrefix },
      })
      return msg
    }
  }
  if (tabVal === TradeFuturesCalculatorTabsEnum.close) {
    if (!formParams.buyPrice) {
      const msg = t`helper_futures_computer_o9tqmtsqllajb0hjz5fe6`
      return msg
    }

    if (!formParams[amountType]) {
      const msg = t({
        id: 'features_trade_trade_futures_calculator_futures_calculator_amount_index_k9ejpv80qztlpaolfvodu',
        values: { 0: amountPrefix },
      })
      return msg
    }
    if (!formParams[futuresIncomeOptionUnit]) {
      const msg =
        futuresIncomeOptionUnit === TradeFuturesCalculatorIncomeUnitEnum.incomeNumber
          ? t`helper_futures_computer_jxjgtphrtdvupnlir8n0w`
          : t`helper_futures_computer_ffy7r09hqswceaxy8-xvs`
      return msg
    }
  }
  if (tabVal === TradeFuturesCalculatorTabsEnum.force) {
    if (!formParams.buyPrice) {
      const msg = t`helper_futures_computer_o9tqmtsqllajb0hjz5fe6`
      return msg
    }

    if (!formParams[amountType]) {
      const msg = t({
        id: 'features_trade_trade_futures_calculator_futures_calculator_amount_index_k9ejpv80qztlpaolfvodu',
        values: { 0: amountPrefix },
      })
      return msg
    }
  }
  return false
}

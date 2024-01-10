import { decimalUtils } from '@nbit/utils'
import { baseFuturesStore, useFuturesStore } from '@/store/futures'
import { baseContractPreferencesStore } from '@/store/user/contract-preferences'
import {
  ITradeFuturesTabs,
  ITradeSpotTabs,
  TradeFuturesOptionUnitEnum,
  TradeFuturesTypesEnum,
  TradeMarginTypesEnum,
  TradeMarketAmountTypesEnum,
  TradeModeEnum,
  TradeOrderTypesEnum,
  TradePriceTypeEnum,
} from '@/constants/trade'
import { baseAssetsFuturesStore, useAssetsFuturesStore } from '@/store/assets/futures'
import { baseOrderBookStore } from '@/store/order-book'
import { getFuturePerpetualList } from '@/apis/future/common'
import { useEffect, useState } from 'react'
import { UserMarginSourceEnum } from '@/constants/user'
import { useContractMarketStore, baseContractMarketStore } from '@/store/market/contract'
import { FuturesPositionStatusTypeEnum } from '@/constants/assets/futures'
import { getGroupPurchasingPower } from '@/apis/assets/futures/position'
import { YapiGetPerpetualMarketRestV1MarketDepthApiResponse } from '@/typings/yapi/PerpetualMarketRestMarketDepthV1GetApi'
import { t } from '@lingui/macro'
import { Modal } from '@nbit/arco'
import Icon from '@/components/icon'
import { formatNumberDecimal } from '../decimal'
import { isMarketTrade, validatorTradeNumber } from '../trade'
import {
  calculatorInitMargin,
  checkOpenMarginInfo,
  getFuturesMarketDepthApi,
  onGetExpectedProfit,
} from '../assets/futures'

/**
 * 获取平仓合约组额外保证金
 * @param groupId 合约组 id
 */
export const onGetGroupPurchasingPower = async (groupId: string) => {
  const res = await getGroupPurchasingPower({ groupId })
  const { isOk, data } = res || {}
  if (!isOk || !data) {
    return ''
  }

  return data?.purchasingPower
}
/**
 * @description:
 * 获取减仓保证金价值  根据减仓价值➗杠杆倍数得出
 * 数量的话要 数量 * 对手价
 */
export function getDelMarginValue(
  inputAmountField,
  currentLeverage,
  inputAmountAmountFieldVal,
  inputAmountFundsFieldVal,
  initPrice,
  precision
) {
  if (inputAmountField === TradeMarketAmountTypesEnum.amount) {
    if (!inputAmountAmountFieldVal) {
      return 0
    }
    return formatNumberDecimal(
      decimalUtils.SafeCalcUtil.mul(inputAmountAmountFieldVal, initPrice).div(currentLeverage),
      precision
    )
  }
  if (!inputAmountFundsFieldVal) {
    return 0
  }
  return formatNumberDecimal(decimalUtils.SafeCalcUtil.div(inputAmountFundsFieldVal, currentLeverage), precision)
}
/**
 * @description:
 * 获取仓位名义价值
• 1、账户资产作为额外保证金模式下：
- 输入框选择计价币时：仓位名义价值=仓位保证金*杠杆倍数；开仓数量=仓位名义价值/标的币价值；最大保留至标的币数量精度
- 输入框选择标的币时，仓位名义价值=标的币价值*开仓数量，仓位保证金=（开仓数量*标的币价值）/杠杆倍数；最大保留至 usd 稳定币计算精度
• 2、开仓资金作为保证金模式下：
- 输入框选择计价币时：仓位名义价值=（仓位保证金 - 额外保证金数量）*杠杆倍数；开仓数量=仓位名义价值/标的币价值；最大保留至标的币数量精度
- 输入框选择标的币时，仓位名义价值=标的币价值*开仓数量 - 额外保证金数量*杠杆倍数，仓位保证金=仓位名义价值/杠杆倍数；最大保留
 */
export function getNominalPositionValue(
  inputAmountField,
  currentLeverage,
  // eslint-disable-next-line default-param-last
  additionalMarginPrice = 0,
  marginSource,
  initPrice,
  funds,
  amount
) {
  if (!currentLeverage) {
    return '--'
  }
  if (marginSource === UserMarginSourceEnum.wallet) {
    if (inputAmountField === TradeMarketAmountTypesEnum.funds) {
      return decimalUtils.SafeCalcUtil.mul(funds, currentLeverage).toString()
    }
    return decimalUtils.SafeCalcUtil.mul(initPrice, amount).toString()
  }
  // 开仓作为额外保证金
  if (inputAmountField === TradeMarketAmountTypesEnum.funds) {
    const res = decimalUtils.SafeCalcUtil.sub(funds, additionalMarginPrice).mul(currentLeverage).toString()
    return Number(res) > 0 ? res : 0
  }
  const res = decimalUtils.SafeCalcUtil.mul(initPrice, amount).toString()
  return Number(res) > 0 ? res : 0
}

/**
 * 获取初始保证金
• 1、账户资产作为额外保证金模式下：
- 输入框选择计价币时：仓位名义价值=仓位保证金*杠杆倍数；开仓数量=仓位名义价值/标的币价值；最大保留至标的币数量精度
- 输入框选择标的币时，仓位名义价值=标的币价值*开仓数量，仓位保证金=（开仓数量*标的币价值）/杠杆倍数；最大保留至 usd 稳定币计算精度
• 2、开仓资金作为保证金模式下：
- 输入框选择计价币时：仓位名义价值=（仓位保证金 - 额外保证金数量）*杠杆倍数；开仓数量=仓位名义价值/标的币价值；最大保留至标的币数量精度
- 输入框选择标的币时，仓位名义价值=标的币价值*开仓数量 - 额外保证金数量*杠杆倍数，仓位保证金=仓位名义价值/杠杆倍数；最大保留
 */
export function getInitMargin(
  amountType,
  level,
  amount,
  funds,
  initPrice,
  marginSource,
  // eslint-disable-next-line default-param-last
  additionalMarginPrice = 0,
  futuresDelOptionChecked
) {
  if (marginSource === UserMarginSourceEnum.wallet) {
    if (amountType === TradeMarketAmountTypesEnum.amount) {
      if (!initPrice) {
        return 0
      }
      // 初始仓位保证金=（开仓数量*价格）/杠杆倍数
      if (!futuresDelOptionChecked) {
        const res = decimalUtils.SafeCalcUtil.mul(amount, initPrice).div(decimalUtils.getSafeDecimal(level)).toString()
        return Number(res) > 0 ? res : 0
      }
      const res = decimalUtils.SafeCalcUtil.mul(amount, initPrice).toString()
      return Number(res) > 0 ? res : 0
    }
    return funds
  }

  if (amountType === TradeMarketAmountTypesEnum.amount) {
    if (!initPrice) {
      return 0
    }
    // 初始仓位保证金=（开仓数量*价格）/杠杆倍数
    if (!futuresDelOptionChecked) {
      const res = decimalUtils.SafeCalcUtil.mul(amount, initPrice)
        .div(decimalUtils.getSafeDecimal(level))
        .add(additionalMarginPrice)
        .toString()
      return Number(res) > 0 ? res : 0
    }
    const res = decimalUtils.SafeCalcUtil.mul(amount, initPrice).add(additionalMarginPrice).toString()
    return Number(res) > 0 ? res : 0
  }
  return funds
}
/**
 * 获取开仓数量
• 1、账户资产作为额外保证金模式下：
- 输入框选择计价币时：仓位名义价值=仓位保证金*杠杆倍数；开仓数量=仓位名义价值/标的币价值；最大保留至标的币数量精度
- 输入框选择标的币时，仓位名义价值=标的币价值*开仓数量，仓位保证金=（开仓数量*标的币价值）/杠杆倍数；最大保留至 usd 稳定币计算精度
• 2、开仓资金作为保证金模式下：
- 输入框选择计价币时：仓位名义价值=（仓位保证金 - 额外保证金数量）*杠杆倍数；开仓数量=仓位名义价值/标的币价值；最大保留至标的币数量精度
- 输入框选择标的币时，仓位名义价值=标的币价值*开仓数量 - 额外保证金数量*杠杆倍数，仓位保证金=仓位名义价值/杠杆倍数；最大保留
 */
export function getInitAmount(
  amountType,
  level,
  amount,
  funds,
  initPrice,
  marginSource,
  // eslint-disable-next-line default-param-last
  additionalMarginPrice = 0,
  futuresDelOptionChecked
) {
  if (futuresDelOptionChecked) {
    level = 1
  }
  if (marginSource === UserMarginSourceEnum.wallet) {
    // - 输入框选择计价币时：仓位名义价值=仓位保证金*杠杆倍数；开仓数量=仓位名义价值/标的币价值；最大保留至标的币数量精度
    if (amountType === TradeMarketAmountTypesEnum.funds) {
      if (!initPrice) {
        return 0
      }
      if (futuresDelOptionChecked) {
        const res = decimalUtils.SafeCalcUtil.div(funds, initPrice).toString()
        return Number(res) > 0 ? res : 0
      }
      const _nominalPositionValue = getNominalPositionValue(
        amountType,
        level,
        additionalMarginPrice,
        marginSource,
        initPrice,
        funds,
        amount
      )
      const res = decimalUtils.SafeCalcUtil.div(_nominalPositionValue, initPrice).toString()
      return Number(res) > 0 ? res : 0
    }
    return amount
  }
  // - 输入框选择计价币时：仓位名义价值=（仓位保证金 - 额外保证金数量）*杠杆倍数；开仓数量=仓位名义价值/标的币价值；最大保留至标的币数量精度
  if (amountType === TradeMarketAmountTypesEnum.funds) {
    if (!initPrice) {
      return 0
    }
    if (futuresDelOptionChecked) {
      const res = decimalUtils.SafeCalcUtil.div(funds, initPrice).toString()
      return Number(res) > 0 ? res : 0
    }
    const _nominalPositionValue = getNominalPositionValue(
      amountType,
      level,
      additionalMarginPrice,
      marginSource,
      initPrice,
      funds,
      amount
    )
    const res = decimalUtils.SafeCalcUtil.div(_nominalPositionValue, initPrice).toString()
    return Number(res) > 0 ? res : 0
  }
  return amount
}
/**
 * 获取止盈止损 triggerDirectionInd 的返回参数
 */
function getTriggerDirectionIndParams(
  futuresProfitLossUnit,
  profitLossPrice,
  initPrice,
  contractMarkPriceInitialValue
) {
  if (futuresProfitLossUnit === TradeFuturesOptionUnitEnum.mark) {
    return Number(profitLossPrice) >= Number(contractMarkPriceInitialValue || initPrice) ? 'up' : 'down'
  }
  return Number(profitLossPrice) >= Number(initPrice) ? 'up' : 'down'
}
// 获取止盈止损参数
function getStrategy(
  tradeParams,
  isModeBuy,
  tradeOrderType,
  futuresTakeProfitUnit,
  futuresStopLossUnit,
  initPrice,
  contractMarkPriceInitialValue
) {
  const stopProfitPrice = tradeParams.takeProfit
  const stopLossPrice = tradeParams.stopLoss
  const stopProfit = stopProfitPrice
    ? {
        stopProfit: {
          // 止盈策略
          strategyTypeInd: 'stop_profit', // 策略类型 stop_profit 止盈
          triggerPrice: stopProfitPrice, // 触发价格
          triggerPriceTypeInd: futuresTakeProfitUnit === TradeFuturesOptionUnitEnum.mark ? 'mark' : 'new', // 触发价格类型（mark 标记，new 最新）
          triggerSideInd: isModeBuy ? 'close_long' : 'close_short', // 方向 close_long 平多 , close_short 平空
          entrustTypeInd: 'market', // 委托价格类型 limit 限价 market 市价 止盈止损是按市价平掉所有持有仓位
          triggerDirectionInd: getTriggerDirectionIndParams(
            futuresTakeProfitUnit,
            stopProfitPrice,
            initPrice,
            contractMarkPriceInitialValue
          ),
        },
      }
    : {}
  const stopLoss = stopLossPrice
    ? {
        stopLoss: {
          // 止损策略
          strategyTypeInd: 'stop_loss', // 策略类型 stop_loss 止损
          triggerPrice: stopLossPrice, // 触发价格
          triggerPriceTypeInd: futuresStopLossUnit === TradeFuturesOptionUnitEnum.mark ? 'mark' : 'new', // 触发价格类型（mark 标记，new 最新）
          triggerSideInd: isModeBuy ? 'close_long' : 'close_short', // 方向 close_long 平多 , close_short 平空
          entrustTypeInd: 'market', // 委托价格类型 limit 限价 market 市价 止盈止损是按市价平掉所有持有仓位
          triggerDirectionInd: getTriggerDirectionIndParams(
            futuresStopLossUnit,
            stopLossPrice,
            initPrice,
            contractMarkPriceInitialValue
          ),
        },
      }
    : {}
  return !stopLossPrice && !stopProfitPrice
    ? {}
    : {
        strategy: {
          // 止盈止损策略，开多，开空的情况下可以有
          ...stopProfit,
          ...stopLoss,
        },
      }
}
/**
 * 更具类型获取反向 key
 */
function getDelSideKey(isModeBuy) {
  return isModeBuy ? 'short' : 'long'
}
/**
 * 更具类型获取正向 key
 */
function getSideKey(isModeBuy) {
  return !isModeBuy ? 'short' : 'long'
}
function getSideInd(isModeBuy, futuresDelOptionChecked) {
  if (isModeBuy) {
    return futuresDelOptionChecked ? 'close_short' : 'open_long'
  }
  return futuresDelOptionChecked ? 'close_long' : 'open_short'
}

function calcPositionItemSize(positionItem) {
  if (positionItem?.statusCd === FuturesPositionStatusTypeEnum.locked) {
    return 0
  }
  return (
    Number(positionItem?.size || 0) - Number(positionItem?.lockSize || 0) - Number(positionItem?.entrustFrozenSize || 0)
  )
}
/** 获取反向通杠杆倍数合约组可用 */
export function useFindFuturesPositionItemSize(isModeBuy, futuresDelOptionChecked) {
  const [positionItemSize, setPositionItemSize] = useState(0)
  const assetsFuturesStore = useAssetsFuturesStore()
  const { selectedContractGroup, currentLeverage } = useFuturesStore()
  const { currentCoin } = useContractMarketStore()
  const positionListFutures = assetsFuturesStore.positionListFutures
  const groupId = selectedContractGroup?.groupId as unknown as number

  useEffect(() => {
    if (!futuresDelOptionChecked) {
      setPositionItemSize(0)
      return
    }
    /** 合约当前持仓 */
    let positionItem = null as any
    const sideInd = getDelSideKey(isModeBuy)
    positionListFutures.forEach(it => {
      // id 杠杆 方向
      if (
        String(it?.groupId) === String(groupId) &&
        Number(it?.lever) === Number(currentLeverage) &&
        sideInd === it.sideInd &&
        it.symbol === currentCoin.symbolName
      ) {
        positionItem = it
      }
    })

    setPositionItemSize(calcPositionItemSize(positionItem))
  }, [futuresDelOptionChecked, positionListFutures, isModeBuy, groupId, currentLeverage, currentCoin.symbolName])

  return positionItemSize
}
/** 获取反向通杠杆倍数合约组 */
function findFuturesPositionItem(isModeBuy, isSideRight = false) {
  const assetsFuturesStore = baseAssetsFuturesStore.getState()
  const { selectedContractGroup, currentLeverage } = baseFuturesStore.getState()
  /** 合约当前持仓 */
  const positionListFutures = assetsFuturesStore.positionListFutures
  const groupId = selectedContractGroup?.groupId as unknown as number
  let res = null as any
  const sideInd = !isSideRight ? getDelSideKey(isModeBuy) : getSideKey(isModeBuy)
  const { currentCoin } = baseContractMarketStore.getState()

  positionListFutures.forEach(it => {
    // id 杠杆 方向
    if (
      String(it?.groupId) === String(groupId) &&
      Number(it?.lever) === Number(currentLeverage) &&
      sideInd === it.sideInd &&
      it.symbol === currentCoin.symbolName
    ) {
      res = it
    }
  })
  return res
}
function getPositionIdParams(isModeBuy, futuresDelOptionChecked) {
  if (futuresDelOptionChecked) {
    const positionItem = findFuturesPositionItem(isModeBuy)
    return positionItem ? { positionId: positionItem.positionId } : {}
  }
  return {}
}

/**
 * 获取合约下单传参
 * https://chandao.nbttfc365.com/zentao/doc-objectLibs-custom-0-98-1023.html#app=my
 */
export function getTradeFuturesOrderParams(
  tradeParams: any,
  currentCoin: any,
  tradeMode: TradeModeEnum,
  tradeTabType: ITradeSpotTabs | TradeFuturesTypesEnum | ITradeFuturesTabs,
  tradeOrderType: TradeOrderTypesEnum,
  tradeMarginType: TradeMarginTypesEnum,
  tradePriceType: TradePriceTypeEnum,
  isModeBuy: boolean,
  amountType: TradeMarketAmountTypesEnum,
  /** 只减仓 */
  futuresDelOptionChecked: boolean,
  isAutoAssets: boolean,
  futuresOptionUnit: TradeFuturesOptionUnitEnum,
  isTradeTrailingMarketOrderType: boolean,
  futuresTakeProfitUnit,
  futuresStopLossUnit,
  priceOffset,
  amountOffset,
  initPrice: string | number
) {
  const { contractPreference } = baseContractPreferencesStore.getState()
  const { marginSource } = contractPreference
  const contractMarkPriceInitialValue =
    baseOrderBookStore.getState().contractMarkPriceInitialValue || currentCoin.markPrice
  const { currentGroupOrderAssetsTypes, currentLeverage, selectedContractGroup } = baseFuturesStore.getState()
  const groupIdParams = selectedContractGroup?.groupId ? { groupId: selectedContractGroup?.groupId } : {}

  // 额外保证金
  const _additionalMargin = tradeParams.additionalMarginPrice
    ? { additionalMargin: tradeParams.additionalMarginPrice }
    : { additionalMargin: 0 }
  // 这种模式下需要扣减
  if (marginSource === UserMarginSourceEnum.group && amountType === TradeMarketAmountTypesEnum.funds) {
    tradeParams.funds -= tradeParams.additionalMarginPrice || 0
  }
  const initMargin = Number(
    formatNumberDecimal(
      getInitMargin(
        amountType,
        currentLeverage,
        tradeParams.amount,
        tradeParams.funds,
        initPrice,
        marginSource,
        tradeParams.additionalMarginPrice,
        futuresDelOptionChecked
      ),
      priceOffset
    )
  ) as number
  const positionIdParams = getPositionIdParams(isModeBuy, futuresDelOptionChecked)
  // 减仓单 不传 额外保证金、自动保证金设置等等
  const extParams = futuresDelOptionChecked
    ? { ...positionIdParams }
    : {
        ..._additionalMargin,
        initMargin,
        lever: currentLeverage, // 杠杆倍数
        autoAddMargin: isAutoAssets ? 'yes' : 'no', // 是否自动追加保证金，当选择创建新的合约组时（即 groupId 为空），必传，yes:是，no:否。
        marginType: currentGroupOrderAssetsTypes, // 开仓保证金来源
      }
  const baseParams = {
    ...extParams,
    ...groupIdParams, // 合约组 id，当选择创建新的合约组时不传值
    tradeId: currentCoin.tradeId, // 交易对 id
    placeUnit: amountType === TradeMarketAmountTypesEnum.amount ? 'BASE' : 'QUOTE', // 数量为标的币 BASE，计价币 QUOTE
  }
  if (tradeMode === TradeModeEnum.futures) {
    /** 仅仅发现批量接口 */
    if (tradeOrderType === TradeOrderTypesEnum.limit) {
      const _params =
        amountType === TradeMarketAmountTypesEnum.amount
          ? { size: tradeParams.amount }
          : {
              size: futuresDelOptionChecked
                ? initMargin
                : Number(formatNumberDecimal(initMargin * currentLeverage, amountOffset)),
            }
      return {
        ..._params,
        ...baseParams,
        ...getStrategy(
          tradeParams,
          isModeBuy,
          tradeOrderType,
          futuresTakeProfitUnit,
          futuresStopLossUnit,
          initPrice,
          contractMarkPriceInitialValue
        ),
        typeInd: 'limit_order',
        entrustTypeInd: 'limit',
        sideInd: getSideInd(isModeBuy, futuresDelOptionChecked),
        price: Number(tradeParams.price),
      }
    }
    if (tradeOrderType === TradeOrderTypesEnum.market) {
      // 单位为 USD，值=initMargin*lever，当 marketUnit=amount 必传
      const _params =
        amountType === TradeMarketAmountTypesEnum.amount
          ? { size: tradeParams.amount, marketUnit: 'quantity' }
          : {
              funds: formatNumberDecimal(
                tradeParams.funds * (futuresDelOptionChecked ? 1 : currentLeverage),
                priceOffset,
                false
              ),
              marketUnit: 'amount',
            }
      return {
        ...baseParams,
        ...getStrategy(
          tradeParams,
          isModeBuy,
          tradeOrderType,
          futuresTakeProfitUnit,
          futuresStopLossUnit,
          initPrice,
          contractMarkPriceInitialValue
        ),
        ..._params,
        typeInd: 'market_order',
        entrustTypeInd: 'market',
        sideInd: getSideInd(isModeBuy, futuresDelOptionChecked),
      }
    }
    if (tradeOrderType === TradeOrderTypesEnum.trailing) {
      const isUp =
        futuresOptionUnit === TradeFuturesOptionUnitEnum.last
          ? Number(tradeParams.triggerPrice) > Number(currentCoin.last)
          : Number(tradeParams.triggerPrice) > Number(contractMarkPriceInitialValue)

      const trailingParams = {
        // 触发价格类型（mark 标记价格，new 最新价格）
        triggerPriceTypeInd: futuresOptionUnit === TradeFuturesOptionUnitEnum.last ? 'new' : 'mark',
        triggerPrice: tradeParams.triggerPrice,
        /**
         * 触发方向（up=向上对比，down=向下对比）根据当前最新价格 和 用户在此处设置的触发价格 做对比得出，
         * 若当前价格 < 触发价格，方向为向上；若当前价格 > 触发价格，方向为向下
         */
        triggerDirectionInd: isUp ? 'up' : 'down',
      }
      if (isTradeTrailingMarketOrderType) {
        const _params =
          amountType === TradeMarketAmountTypesEnum.amount
            ? { size: tradeParams.amount, marketUnit: 'quantity' }
            : {
                funds: Number(
                  formatNumberDecimal(tradeParams.funds * (futuresDelOptionChecked ? 1 : currentLeverage), priceOffset)
                ),
                marketUnit: 'amount',
              }
        return {
          ...trailingParams,
          ...baseParams,
          ...getStrategy(
            tradeParams,
            isModeBuy,
            tradeOrderType,
            futuresTakeProfitUnit,
            futuresStopLossUnit,
            initPrice,
            contractMarkPriceInitialValue
          ),
          ..._params,
          typeInd: 'market_order',
          entrustTypeInd: 'market',
          sideInd: getSideInd(isModeBuy, futuresDelOptionChecked),
        }
      }
      const _params =
        amountType === TradeMarketAmountTypesEnum.amount
          ? { size: tradeParams.amount }
          : {
              size: futuresDelOptionChecked
                ? initMargin
                : Number(formatNumberDecimal(initMargin * currentLeverage, amountOffset)),
            }
      return {
        ..._params,
        ...trailingParams,
        ...baseParams,
        ...getStrategy(
          tradeParams,
          isModeBuy,
          tradeOrderType,
          futuresTakeProfitUnit,
          futuresStopLossUnit,
          initPrice,
          contractMarkPriceInitialValue
        ),
        typeInd: 'limit_order',
        entrustTypeInd: 'limit',
        sideInd: getSideInd(isModeBuy, futuresDelOptionChecked),
        price: Number(tradeParams.price),
      }
    }
  }
  return {}
}
/**
 * 实时获取不同市价、限价、计划类型校验的价格
 */
export function getInitPrice(isModeBuy, tradeOrderType, isTradeTrailingMarketOrderType, inputPrice, formTriggerPrice) {
  const isMarketPriceMode = isMarketTrade(tradeOrderType, isTradeTrailingMarketOrderType)
  const { bidsList, asksList } = baseOrderBookStore.getState()
  const { currentCoin } = baseContractMarketStore.getState()
  const depthSellQuotePrice = Number(decimalUtils.getSafeDecimal(asksList?.[0]?.price).toNumber() || currentCoin.last)
  const depthBuyQuotePrice = Number(decimalUtils.getSafeDecimal(bidsList?.[0]?.price).toNumber() || currentCoin.last)
  const depthQuotePrice = isModeBuy ? depthSellQuotePrice : depthBuyQuotePrice
  if (isTradeTrailingMarketOrderType && TradeOrderTypesEnum.trailing === tradeOrderType) {
    return formTriggerPrice || depthQuotePrice
  }
  if (!isMarketPriceMode) {
    return inputPrice
  }
  return depthQuotePrice
}
/**
 * 校验止盈止损规则
 * @return boolean tree 校验通过
 * https://products.admin-devops.com/result/nb%20global%20web/#g=1&p=%E5%90%88%E7%BA%A6%E6%AD%A2%E7%9B%88%E6%AD%A2%E6%8D%9F%E8%A7%84%E5%88%99
 */
export function checkStrategyPrice(tradeOrderType, tradeParams, isModeBuy, initPrice) {
  const stopProfitPrice = tradeParams.takeProfit
  const stopLossPrice = tradeParams.stopLoss
  if (!stopProfitPrice && !stopLossPrice) {
    return true
  }
  if (isModeBuy) {
    /**
     * 市价委托 - 开多
     * 止盈大于卖 1 价
     * 止损小于卖 1 价
     */
    if (!stopProfitPrice) {
      return stopLossPrice < initPrice
    }
    if (!stopLossPrice) {
      return stopProfitPrice > initPrice
    }
    return stopProfitPrice > initPrice && stopLossPrice < initPrice
  }
  /**
   * 市价委托 - 开空
   * 止盈小于买 1 价
   * 止损大于买 1
   */
  if (!stopProfitPrice) {
    return stopLossPrice > initPrice
  }
  if (!stopLossPrice) {
    return stopProfitPrice < initPrice
  }
  return stopProfitPrice < initPrice && stopLossPrice > initPrice
}
/**
 * 非勾选只减仓时校验 目标下单合约是否存在正向同倍数合约锁仓
 */
export function checkFuturesValueLocked(isModeBuy, futuresDelOptionChecked) {
  if (futuresDelOptionChecked) {
    return true
  }
  let resCheck = true
  const positionItem = findFuturesPositionItem(isModeBuy, true)
  if (positionItem) {
    resCheck = positionItem.statusCd !== FuturesPositionStatusTypeEnum.locked
  }

  return resCheck
}
/**
 * 判断是否需要补充只减仓的保证金或者先平盈利仓位
 * 因当前仓位亏损过高，保证金不足，请补充保证金或先平盈利仓位。
 * 仓位预计亏损>=仓位初始保证金 + 合约组额外保证金
 */
export async function checkFuturesDelValueSupplement(
  isModeBuy,
  futuresDelOptionChecked,
  currentCoin,
  formParams,
  initPrice,
  initAmount,
  isMarketPriceMode
) {
  if (!futuresDelOptionChecked) {
    return true
  }
  const positionItem = findFuturesPositionItem(isModeBuy)
  if (!positionItem) {
    return true
  }
  let price = 0
  if (isMarketPriceMode) {
    const marketDepth: YapiGetPerpetualMarketRestV1MarketDepthApiResponse['data'] =
      (await getFuturesMarketDepthApi(currentCoin.symbolName, 5)) || {}
    const bidsLength = marketDepth?.bids?.length || 0
    const asksLength = marketDepth?.asks?.length || 0
    const maxBids = marketDepth?.bids?.[bidsLength - 1]?.[0] || '' // 最大买 5 价
    const maxAsks = marketDepth?.asks?.[asksLength - 1]?.[0] || '' // 最大卖 5 价
    const depthSellQuotePrice = Number(decimalUtils.getSafeDecimal(maxBids).toNumber() || initPrice)
    const depthBuyQuotePrice = Number(decimalUtils.getSafeDecimal(maxAsks).toNumber() || initPrice)
    const depthQuotePrice = isModeBuy ? depthSellQuotePrice : depthBuyQuotePrice
    price = depthQuotePrice
  }

  // 仓位预计亏损
  const estimatedProfit = onGetExpectedProfit({
    price: price || formParams.price || initPrice,
    closeSize: initAmount,
    openPrice: positionItem?.openPrice || '',
    takerFeeRate: currentCoin.takerFeeRate!,
    sideInd: positionItem!.sideInd,
  })
  const { selectedContractGroup } = baseFuturesStore.getState()
  const groupId = selectedContractGroup?.groupId as unknown as number
  const groupAvailableMargin = await onGetGroupPurchasingPower(groupId as unknown as string)
  // 仓位预计亏损>=平仓数量的仓位初始保证金 + 合约组可用
  const positionInitMargin = calculatorInitMargin(positionItem?.openPrice || 0, initAmount, positionItem?.lever || 0)
  if (checkOpenMarginInfo(estimatedProfit, positionInitMargin, groupAvailableMargin)) {
    return false
  }

  return true
}
/**
 * 勾选只减仓时目标下单合约是否存在反向同倍数合约
 * 从当前持仓列表找到当前下单的进行匹配判断大小
 */
export function checkFuturesDelValue(
  inputAmountField,
  inputAmountFieldVal,
  isModeBuy,
  futuresDelOptionChecked,
  depthQuotePrice,
  formParams,
  tradeOrderType,
  isTradeTrailingMarketOrderType
) {
  if (!futuresDelOptionChecked) {
    return [true, true]
  }
  let resCheck = false
  let amountCheck = false
  const positionItem = findFuturesPositionItem(isModeBuy)
  if (positionItem) {
    const positionItemSize = calcPositionItemSize(positionItem)
    resCheck = true
    if (inputAmountField === TradeMarketAmountTypesEnum.amount) {
      amountCheck = positionItemSize >= inputAmountFieldVal
    } else {
      if (
        tradeOrderType === TradeOrderTypesEnum.market ||
        (tradeOrderType === TradeOrderTypesEnum.trailing && isTradeTrailingMarketOrderType)
      ) {
        amountCheck = Number(positionItemSize) * depthQuotePrice >= inputAmountFieldVal
        return [resCheck, amountCheck]
      }
      if (
        tradeOrderType === TradeOrderTypesEnum.limit ||
        (tradeOrderType === TradeOrderTypesEnum.trailing && !isTradeTrailingMarketOrderType)
      ) {
        amountCheck = Number(positionItemSize) * formParams.price >= inputAmountFieldVal
      }
    }
  }

  return [resCheck, amountCheck]
}
/**
 * check 是否合约组超过 26
 */
export async function checkFuturesGroupAmount(): Promise<boolean> {
  return new Promise(function (resolve, reject) {
    getFuturePerpetualList({}).then(res => {
      if (res.isOk && res.data) {
        resolve(res.data?.list?.length < 26)
      } else {
        resolve(false)
      }
    })
  })
}

/** 获取合约所有仓位持仓标的币 */
export function usePositionAllAmount() {
  const { positionListFutures } = useAssetsFuturesStore()
  let amount = 0
  positionListFutures.forEach(position => {
    amount += Number(position.size)
  })

  return amount
}

/** 获取是否下单余额充足 */
export function getIsFuturesSafeAssets(initMargin, assets, additionalMarginPrice, marginSource) {
  if (marginSource === UserMarginSourceEnum.wallet) {
    return decimalUtils.getSafeDecimal(initMargin).comparedTo(decimalUtils.getSafeDecimal(assets)) < 1
  }
  // 模式调整后，即使是使用开仓资金作为额外保证金，也只比较保证金（开仓数量会减少）
  return decimalUtils.SafeCalcUtil.add(initMargin, 0).comparedTo(decimalUtils.getSafeDecimal(assets)) < 1
}

export function validatorFuturesAmount(
  value,
  inputAmountField,
  futuresDelOptionChecked,
  initMargin,
  userCoinTotalDenominatedCoin,
  additionalMarginPrice,
  marginSource,
  maxAmount,
  minAmount,
  underlyingCoin,
  denominatedCoin,
  currentCoin,
  currentLeverage,
  nominalPositionValue,
  amountOffset,
  coinOffset
) {
  value = Number(value || 0)

  if (inputAmountField === TradeMarketAmountTypesEnum.amount) {
    if (!validatorTradeNumber(value)) {
      const msg = futuresDelOptionChecked
        ? t`features_assets_futures_common_close_position_modal_index_5101497`
        : t`features_trade_futures_trade_form_index_5101584`
      return msg
    }

    if (!getIsFuturesSafeAssets(initMargin, userCoinTotalDenominatedCoin, additionalMarginPrice, marginSource)) {
      // 只减仓仓量后置校验
      if (!futuresDelOptionChecked) {
        return t`features_orders_details_extra_margin_5101363`
      }
    }
    if (value > maxAmount) {
      const msg = t({
        id: 'features_trade_spot_trade_form_index_2612',
        values: { 0: maxAmount, 1: underlyingCoin },
      })
      return msg
    }
    if (value < minAmount && !futuresDelOptionChecked) {
      const msg = t({
        id: 'features_trade_spot_trade_form_index_2613',
        values: { 0: minAmount, 1: underlyingCoin },
      })
      return msg
    }
    return false
  }
  if (!validatorTradeNumber(value)) {
    const msg = futuresDelOptionChecked
      ? t`features_assets_futures_common_close_position_modal_index_5101496`
      : t`features_trade_futures_trade_form_index_5101585`
    return msg
  }
  if (!getIsFuturesSafeAssets(initMargin, userCoinTotalDenominatedCoin, additionalMarginPrice, marginSource)) {
    if (!futuresDelOptionChecked) {
      return t`features_orders_details_extra_margin_5101363`
    }
  }
  const maxFunds = futuresDelOptionChecked
    ? decimalUtils.SafeCalcUtil.mul(maxAmount, currentCoin.last).toString()
    : getNominalPositionValue(
        TradeMarketAmountTypesEnum.amount,
        currentLeverage,
        additionalMarginPrice,
        marginSource,
        currentCoin.last,
        value,
        maxAmount
      )

  if (decimalUtils.getSafeDecimal(nominalPositionValue).comparedTo(maxFunds) === 1) {
    const msg = t({
      id: 'features_trade_spot_trade_form_index_2618',
      values: { 0: maxFunds, 1: denominatedCoin },
    })
    return msg
  }
  const minFunds = futuresDelOptionChecked
    ? 0
    : getNominalPositionValue(
        TradeMarketAmountTypesEnum.amount,
        currentLeverage,
        additionalMarginPrice,
        marginSource,
        currentCoin.last,
        value,
        minAmount
      )
  if (decimalUtils.getSafeDecimal(nominalPositionValue).comparedTo(minFunds) === -1) {
    const msg = t({
      id: 'features_trade_spot_trade_form_index_2619',
      values: { 0: minFunds, 1: denominatedCoin },
    })
    return msg
  }
  // 校验只减仓精度，只考虑 usd 下单场景
  // BTCUSD 的最小数量精度就是 0.01 用减仓下单的 USD 去折算成 BTC 数量和 0.01 去比较，错误提示就是用户小于最小减仓 价格*0.01 USD
  if (futuresDelOptionChecked) {
    const _minVal = decimalUtils.formatNumberDecimal(0.1 ** amountOffset, amountOffset)
    const _amount = decimalUtils.SafeCalcUtil.div(value, currentCoin.last)
    if (decimalUtils.getSafeDecimal(_amount).comparedTo(_minVal) === -1) {
      const _minPrice = decimalUtils.formatNumberDecimal(
        decimalUtils.SafeCalcUtil.mul(currentCoin.last, _minVal),
        coinOffset
      )
      // 错误提示就是用户小于最小减仓 价格*0.01 USD
      const msg = t({
        id: 'helper_futures_7kuwlqmhrml02atuwvgkr',
        values: { 0: _minPrice, 1: denominatedCoin },
      })
      return msg
    }
  }
  return false
}

// 验证标记价格和最新价格
export async function validateMarkPrice(futuresDelOptionChecked) {
  if (futuresDelOptionChecked) {
    return true
  }
  const target = 0.02
  const { currentCoin } = baseContractMarketStore.getState()
  const markPrice = baseOrderBookStore.getState().contractMarkPriceInitialValue || currentCoin.markPrice
  const latestPrice = currentCoin.last || 1
  if (decimalUtils.SafeCalcUtil.sub(markPrice, latestPrice).div(latestPrice).abs().gt(target)) {
    return new Promise(function (resolve, reject) {
      Modal?.confirm?.({
        icon: null,
        closable: true,
        title: (
          <div className="flex justify-center">
            <Icon name="tips_icon" style={{ fontSize: '78px' }} />
          </div>
        ),
        style: { width: '360px' },
        content: (
          <div>
            {t`helper_futures_index_xqjgoeusowy4wo-kwjkcm`} <span className="text-brand_color">2%</span>{' '}
            {t`helper_futures_index_-ffvx9tamo7c90sxmqieh`}
          </div>
        ),
        okText: t`features_user_login_index_5101198`,
        cancelText: t`trade.c2c.cancel`,
        onCancel: () => {
          resolve(false)
        },
        onOk: () => {
          resolve(true)
        },
      })
    })
  }
  return true
}

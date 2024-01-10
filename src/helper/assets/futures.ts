/**
 * 资产 - 合约
 */

import { decimalUtils } from '@nbit/utils'
import { Message } from '@nbit/arco'
import { formatNumberDecimal, removeDecimalZero, formatCurrency } from '@/helper/decimal'
import {
  getTradePairDetailApi,
  postGroupExistEntrustOrder,
  getCurrencySettings,
  getPerpetualMarginSettings,
} from '@/apis/assets/futures/common'
import { baseAssetsFuturesStore, defaultUserAssetsFutures } from '@/store/assets/futures'
import { getAssetsOverview, rateFilter, rateFilterFutures } from '@/helper/assets'
import { t } from '@lingui/macro'
import { CurrencySymbolEnum, CurrencyNameEnum, ErrorTypeEnum } from '@/constants/assets/index'
import {
  getV1PerpetualAssetsQueryAssetApiRequest,
  getV1PerpetualPositionCurrentApiRequest,
  postPerpetualPositionExistEntrustOrder,
  getPerpetualPositionMaxSizeLimit,
  getPerpetualPositionReverseInfo,
  getPerpetualPositionSymbolSize,
  getGroupPurchasingPower,
} from '@/apis/assets/futures/position'
import { FuturesGroupDetailResp, MerAssetsMarginSettingData, DetailMarginListChild } from '@/typings/api/assets/futures'
import {
  getAssetsFuturesAssetsList,
  getAssetsFuturesList,
  postPerpetualGroupCancelOrder,
} from '@/apis/assets/futures/overview'
import {
  FuturePositionDirectionEnum,
  MarginAssetTypeEnum,
  PerpetualMigrateRateTypeEnum,
  TriggerPriceTypeEnum,
} from '@/constants/assets/futures'
import {
  IPositionListData,
  IPositionGroupList,
  ITradePairDetailData,
  ITradePairLeverList,
} from '@/typings/api/assets/futures/position'
import { WsBizEnum, WsTypesEnum } from '@/constants/ws'
import { PerpetualIndexPrice } from '@/plugins/ws/protobuf/ts/proto/PerpetualIndexPrice'
import Decimal from 'decimal.js'
import { getPerpetualMarketRestV1MarketDepthApiRequest } from '@/apis/market'
import { CoinRateResp } from '@/typings/api/assets/assets'
import { baseAssetsStore } from '@/store/assets'

const SafeCalcUtil = decimalUtils.SafeCalcUtil
/**
 * 根据百分比计算数量
 * @description: 公式 maxAmount*(percent/100)
 * @param percent 百分比
 * @param maxAmount 最大数量
 * @param precision 精度位
 * @returns
 */
export function getAmountByPercent(percent: number, maxAmount: number, precision = 2) {
  try {
    if (!percent || !maxAmount) {
      return 0
    }
    if (precision === undefined) precision = 2
    const amount = SafeCalcUtil.mul(maxAmount, SafeCalcUtil.div(percent, 100))
    return formatNumberDecimal(String(amount), Number(precision))
  } catch (error) {
    return 0
  }
}

/**
 * 根据数量计算百分比
 * @description: 公式 (val/maxAmount)*100
 * @param val 输入的数值
 * @param maxAmount 最大数量
 * @param msg 错误提示
 * @returns
 */
export const getPercentByAmount = (
  val: string | number,
  maxAmount: string | number,
  msg = t`helper_assets_futures_5101560`
) => {
  if (!val || !maxAmount) {
    return 0
  }

  if (Number(val) > Number(maxAmount)) {
    Message.error({
      content: msg,
      id: ErrorTypeEnum.uncategorizedError,
    })
    return 100
  }
  const _percent = +formatNumberDecimal(String(SafeCalcUtil.mul(SafeCalcUtil.div(val, maxAmount), 100)), 0, true)
  return _percent
}

/**
 * 根据合约类型/方向，不同展示
 * @param direction 交易方向｜类型
 */
export const getBuySellColor = direction => {
  const buyUpTextColor = 'text-buy_up_color'
  const sellDownTextColor = 'text-sell_down_color'

  let colorCss = ''
  direction ? (colorCss = buyUpTextColor) : (colorCss = sellDownTextColor)

  return colorCss
}

/** 合约币对详情 */
export const getTradePairDetail = async (symbol: string) => {
  const res = await getTradePairDetailApi({ symbol })
  let results = res.data
  if (res.isOk && results) {
    baseAssetsFuturesStore().updateTradePairDetail(results)
    return results
  }
  return null
}

/** 获取合约资产持仓列表 - 交易页面用 */
export const getFuturesPositionList = async () => {
  // const currentCoin = baseContractMarketStore.getState().currentCoin
  const assetsFuturesStore = baseAssetsFuturesStore.getState()
  const res = await getV1PerpetualPositionCurrentApiRequest({})
  let results = res.data?.list
  if (res.isOk && results) {
    assetsFuturesStore.updatePositionListFutures(results)
    return results
  }
}

/** 获取合约资产 - 交易页面用 */
export const getUserAssetsFutures = async () => {
  /** 获取持仓列表 */
  // getFuturesPositionList()
  const defaultData = defaultUserAssetsFutures
  const res = await getV1PerpetualAssetsQueryAssetApiRequest({})
  let results = res.data
  if (res.isOk && results) {
    const assetsFuturesStore = baseAssetsFuturesStore.getState()
    const offset = assetsFuturesStore.futuresCurrencySettings.offset
    const newAssetData = {
      ...results,
      availableBalanceValueText: formatCurrency(String(results.availableBalanceValue), offset || 2),
    }
    assetsFuturesStore.updateUserAssetsFutures(newAssetData)
    return results
  }

  return defaultData
}

/** 检测仓位是否存在委托订单 */
export const checkPositionExistEntrustOrder = async (groupId, positionId) => {
  const params = { groupId, positionId }
  const res = await postPerpetualPositionExistEntrustOrder(params)
  let isExist = res.data?.exist
  if (res.isOk && isExist) {
    return isExist
  }
  return false
}

/**
 * 资产总览 - 查询合约资产列表
 */
/**
 * 资产总览 - 查询合约资产列表
 */
export const onGetContractAssetsList = async () => {
  const { futuresAssetsMarginList, updateFuturesAssetsMarginList } = baseAssetsFuturesStore.getState()
  const res = await getAssetsFuturesAssetsList({})

  const { isOk, data } = res || {}
  if (!isOk || !data) return

  updateFuturesAssetsMarginList(data)
}

/**
 * 校验当前合约组是否存在委托订单
 */
export const onCheckGroupEntrustOrder = async (groupId: string) => {
  if (!groupId) {
    return false
  }
  const res = await postGroupExistEntrustOrder({ groupId })
  const { isOk, data, message = '' } = res || {}

  if (isOk) {
    if (data?.lock) {
      Message.error(t`features_assets_futures_common_merge_group_modal_index_5101528`)
      return false
    }

    if (data?.exist) {
      // onHint(true)
      return false
    }

    return true
  } else {
    Message.error(message)
    return false
  }
}

/**
 * 撤销当前合约组所有委托订单
 */
export const onRevokeGroupEntrustOrder = async (groupId: string) => {
  const res = await postPerpetualGroupCancelOrder({ groupId })
  const { isOk, data } = res || {}

  if (isOk && data?.isSuccess) {
    Message.success(t`features_assets_futures_common_exist_position_entrust_modal_index_5101525`)
    return true
  } else {
    Message.error(t`features_assets_futures_common_exist_position_entrust_modal_index_5101524`)
    return false
  }
}

/** 法币资产格式化 */
export const formatAssetInfo = (val, unit, decimal = 2, isShowUnit = true) => {
  const newVal = formatCurrency(String(val), Number(decimal))
  if (!isShowUnit) return newVal
  return `${newVal} ${unit}`
}

/**
 * 一键反向 - 获取反向开仓信息
 */
export const onGetReverseInfo = async (groupId, positionId, marginType) => {
  const res = await getPerpetualPositionReverseInfo({ groupId, positionId, marginType })
  const { isOk, data } = res || {}

  if (!isOk) {
    return
  }

  return data
}

/**
 * 获取币对最大可开仓数量
 */
export const onGetMaxSizeLimit = async (tradeId, lever) => {
  const res = await getPerpetualPositionMaxSizeLimit({ tradeId, lever })
  const { isOk, data } = res || {}

  if (!isOk) {
    return
  }

  return data
}

/**
 * 持仓 - 计算预计盈亏
 * 多单：（触发价格 - 开仓均价）*平仓数量 - 触发价格*平仓数量*taker 费率
 * 空单：（开仓均价 - 触发价格）*平仓数量 - 触发价格*平仓数量*taker 费率
 * @param price 触发价格（预计盈亏：市价：触发价格，限价：委托价格；仓位预计亏损：市价：第五档价格，限价：委托价格）
 * @param closeSize 平仓数量
 * @param openPrice 开仓均价
 * @param takerFeeRate taker 费率
 * @param sideInd 仓位方向
 * @returns
 */
export const onGetExpectedProfit = ({
  price,
  closeSize,
  openPrice,
  takerFeeRate,
  sideInd,
}: {
  price: string
  closeSize: string
  openPrice: string
  takerFeeRate: string
  sideInd: string
}) => {
  if (!price || !closeSize) {
    return ''
  }

  let difference
  if (sideInd === FuturePositionDirectionEnum.openBuy) {
    difference = SafeCalcUtil.mul(SafeCalcUtil.sub(price, openPrice), closeSize)
  } else {
    difference = SafeCalcUtil.mul(SafeCalcUtil.sub(openPrice, price), closeSize)
  }
  const fee = SafeCalcUtil.mul(SafeCalcUtil.mul(price, closeSize), takerFeeRate)

  return `${SafeCalcUtil.sub(difference, fee)}`
}

/**
 * 平仓数量的仓位初始保证金 = 开仓均价 * 平仓数量 / 杠杆倍数
 * @param openPrice  开仓均价
 * @param entrustAmount  平仓数量
 * @param lever 杠杆倍数
 * @returns 仓位初始保证金
 */
export const calculatorInitMargin = (
  openPrice: number | string | Decimal,
  entrustAmount: number | string | Decimal,
  lever: number | string | Decimal
) => {
  return SafeCalcUtil.div(SafeCalcUtil.mul(openPrice, entrustAmount), Number(lever))
}

/**
 * 检查保证金是否充足，接近强平提醒
 * 预计亏损<0 且 仓位预计亏损绝对值>=平仓数量的仓位初始保证金 + 合约组可用，提示保证金不足
 * 平仓数量的仓位初始保证金 = 开仓均价 * 平仓数量 / 杠杆倍数
 * @param positionProfit 仓位预计亏损
 * @param initMargin 仓位初始保证金
 * @param groupAvailableMargin 合约组可用
 * @returns 保证金是否充足检查结果
 */
export const checkOpenMarginInfo = (
  positionProfit: number | string | Decimal,
  initMargin: number | string | Decimal,
  groupAvailableMargin: number | string | Decimal
) => {
  if (
    Number(positionProfit) < 0 &&
    Number(Decimal.abs(positionProfit)) >= Number(SafeCalcUtil.add(initMargin, groupAvailableMargin))
  ) {
    return true
  }
  return false
}

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
 * 获取商户法币配置
 */
export const getFuturesCurrencySettings = async () => {
  const { updateFuturesCurrencySettings } = baseAssetsFuturesStore.getState()
  const res = await getCurrencySettings({})
  const { isOk, data } = res || {}

  if (!isOk || !data) {
    return
  }

  updateFuturesCurrencySettings(data)
  return data
}

/**
 * 获取商户保证金币种配置
 */
export const onLoadMarginSettings = async () => {
  const { updateMarginSettings } = baseAssetsFuturesStore.getState()
  const res = await getPerpetualMarginSettings({})
  const { isOk, data } = res || {}

  if (!isOk) {
    return
  }
  data && updateMarginSettings(data.merAssetsMarginSettingData)
}

/**
 * 获取对手价，买一/卖一价
 * @returns bid 买价，ask 卖价
 */
export const getFuturesMarketDepthApi = async (symbolName, limit = 1) => {
  const res = await getPerpetualMarketRestV1MarketDepthApiRequest({ symbol: symbolName, limit: String(limit) })
  const { isOk, data } = res || {}

  if (!isOk || !data) {
    return
  }
  return data
}

/**
 * 资产总览 - 查询合约资产/合约逐仓列表
 */
export const onGetContractOverview = async (isUpdateList = false) => {
  const res = await getAssetsFuturesList({})
  const { updateFuturesGroupList } = { ...baseAssetsFuturesStore.getState() }

  const { isOk, data } = res || {}
  const groupList = data?.list
  if (!isOk || !data || !groupList || groupList.length === 0) {
    if (isUpdateList) {
      updateFuturesGroupList(groupList)
    }
    return null
  }

  const totalDataOverview = {
    /** 合约总资产 */
    totalPerpetualAsset: 0,
    /** 可用保证金 */
    totalMarginAvailable: 0,
    /** 仓位资产 */
    totalPositionAssets: 0,
    /** 未实现盈亏 */
    totalUnrealizedProfit: 0,
    /** 可用币种资产 */
    totalMarginCoinAvailable: 0,
    /** 仓位占用币种资产 */
    totalPositionCoinAsset: 0,
    /** 开仓冻结币种价值 */
    totalLockCoinAsset: 0,
    /** 开仓冻结保证金价值 */
    totalLockMarginAsset: 0,
  }
  groupList.forEach(item => {
    // 排序前先转化成数字
    // 逐仓资产=逐仓保证金币种价值 + 未实现盈亏
    item.groupTotalAsset = Number(SafeCalcUtil.add(item.groupCoinAsset, item.unrealizedProfit))
    item.unrealizedProfit = Number(item.unrealizedProfit)
    item.positionCoinAsset = Number(item.positionCoinAsset)
    item.marginAvailable = Number(item.marginAvailable)
    item.lockCoinAsset = Number(item.lockCoinAsset)
    // 合约资产折合=逐仓保证金币种价值 + 未实现盈亏
    totalDataOverview.totalPerpetualAsset = Number(
      SafeCalcUtil.add(totalDataOverview.totalPerpetualAsset, item.groupTotalAsset)
    )
    totalDataOverview.totalMarginAvailable = Number(
      SafeCalcUtil.add(totalDataOverview.totalMarginAvailable, item.marginAvailable)
    )
    totalDataOverview.totalPositionAssets = Number(
      SafeCalcUtil.add(totalDataOverview.totalPositionAssets, item.positionAsset)
    )
    totalDataOverview.totalUnrealizedProfit = Number(
      SafeCalcUtil.add(totalDataOverview.totalUnrealizedProfit, item.unrealizedProfit)
    )
    totalDataOverview.totalMarginCoinAvailable = Number(
      SafeCalcUtil.add(totalDataOverview.totalMarginCoinAvailable, item.marginCoinAvailable)
    )
    totalDataOverview.totalPositionCoinAsset = Number(
      SafeCalcUtil.add(totalDataOverview.totalPositionCoinAsset, item.positionCoinAsset || 0)
    )
    totalDataOverview.totalLockCoinAsset = Number(
      SafeCalcUtil.add(totalDataOverview.totalLockCoinAsset, item.lockCoinAsset)
    )
    totalDataOverview.totalLockMarginAsset = Number(
      SafeCalcUtil.add(totalDataOverview.totalLockMarginAsset, item.lockMarginAsset)
    )
  })

  if (isUpdateList) {
    updateFuturesGroupList(groupList)
  }

  return totalDataOverview
}

/** 百分比数据格式化 */
export const formatRatioNumber = val => {
  if (isNaN(val)) return val
  const data = removeDecimalZero(formatNumberDecimal(String(SafeCalcUtil.mul(val, 100)), 2))
  return data || 0
}

/**
 * 按计价币法币或合约数量精度展示
 */
export const formatNumberByOffset = (val, offset = 2, keepDigits = true) => {
  if (isNaN(val)) return '--'
  const data = formatCurrency(val, Number(offset), keepDigits)
  // if (isNeedRemoveZero) data = removeDecimalZero(data)
  return data || '--'
}

/**
 * 根据持仓列表过滤 symbolWassName
 * @param positionList 当前持仓列表
 */
export const onFilterSymbolWassName = (positionList: IPositionListData[]) => {
  const assetsFuturesStore = baseAssetsFuturesStore.getState()
  let newList: string[] = []
  for (let i = 0; i < positionList.length; i += 1) {
    if (newList.indexOf(positionList[i].symbolWassName) === -1) {
      newList.push(positionList[i].symbolWassName)
    }
  }

  assetsFuturesStore.updatePositionSymbolWassNameList(newList)
}

/**
 * 根据 symbolWassName 生成标记价格推送 subs
 */
export const onGetMarkPriceSubs = (type = TriggerPriceTypeEnum.mark) => {
  const { positionSymbolWassNameList = [] } = baseAssetsFuturesStore.getState()

  if (positionSymbolWassNameList && positionSymbolWassNameList.length > 0) {
    const newList = positionSymbolWassNameList.map((contractCode: string) => {
      if (type === TriggerPriceTypeEnum.new) {
        return {
          biz: WsBizEnum.perpetual,
          type: WsTypesEnum.perpetualDeal,
          base: '',
          quote: '',
          contractCode,
        }
      }
      return { biz: WsBizEnum.perpetual, type: WsTypesEnum.perpetualIndex, contractCode }
    })
    return newList
  }
}

/**
 * 计算数量=持仓数量 - 锁仓数量
 * @return 计算数量
 */
const calculatorAmount = (size, lockSize) => {
  return +SafeCalcUtil.sub(size, lockSize)
}

/**
 * 持仓列表 - 锁仓未实现盈亏计算
 * 开多=(锁仓价格 - 开仓均价)*锁仓数量
 * 开空=(开仓均价 - 锁仓价格)*锁仓数量
 * @param lockPrice 锁仓价格
 * @param openPrice 开仓均价
 * @param lockSize 锁仓数量
 * @return 锁仓未实现盈亏
 */
const calculatorUnrealizedProfitLock = (data: IPositionListData) => {
  const { sideInd, lockPrice, openPrice, lockSize } = data || {}

  let agio = 0
  if (sideInd === FuturePositionDirectionEnum.openBuy) {
    agio = +SafeCalcUtil.sub(lockPrice, openPrice)
  }

  if (sideInd === FuturePositionDirectionEnum.openSell) {
    agio = +SafeCalcUtil.sub(openPrice, lockPrice)
  }

  return +SafeCalcUtil.mul(agio, lockSize)
}

/**
 * 持仓列表 - 未实现盈亏计算
 * 开多=(标记价格 - 开仓均价)*仓位数量 + 锁仓未实现盈亏 - 锁仓利息
 * 开空=(开仓均价 - 标记价格)*仓位数量 + 锁仓未实现盈亏 - 锁仓利息
 * @param markPrice 标记价格
 * @param openPrice 开仓均价
 * @param size 数量
 * @param sideIndEnum 方向
 * @param unconfirmedLock 锁仓时未实现盈亏
 * @param lockFees 锁仓利息
 * @return 未实现盈亏
 */
const calculatorUnrealizedProfit = (data: IPositionListData) => {
  const { sideInd, markPrice, openPrice, size, lockFees, lockSize } = data || {}

  let unrealizedProfit = 0
  if (sideInd === FuturePositionDirectionEnum.openBuy) {
    unrealizedProfit = +SafeCalcUtil.sub(markPrice, openPrice)
  }

  if (sideInd === FuturePositionDirectionEnum.openSell) {
    unrealizedProfit = +SafeCalcUtil.sub(openPrice, markPrice)
  }

  unrealizedProfit = +SafeCalcUtil.mul(unrealizedProfit, calculatorAmount(size, lockSize))
  unrealizedProfit = +SafeCalcUtil.sub(
    SafeCalcUtil.add(unrealizedProfit, calculatorUnrealizedProfitLock(data)),
    lockFees
  )
  return unrealizedProfit
}

/**
 * 开仓保证金 (初始保证金) 计算
 * 开仓保证金=开仓均价*(仓位数量 + 锁仓数量)/杠杠倍数 ===》开仓保证金=开仓均价*持仓数量/杠杠倍数
 * 仓位数量=持仓数量 - 锁仓数量
 * @param data 当前持仓列表
 * @return 开仓保证金
 */
const calculatorOpenMargin = (data: IPositionListData) => {
  const { openPrice, size, lockSize, lever } = data
  let openMargin = 0
  openMargin = +SafeCalcUtil.mul(openPrice, size)
  openMargin = +SafeCalcUtil.div(openMargin, lever)
  return openMargin
}

/**
 * 合约组详情 - 合约组占用保证金计算
 * 合约组占用保证金=MAX(合约组维持保证金之和 - 合约组整体未实现盈亏，合约组初始保证金之和)
 * @param maintMarginRatioTotal 合约组所有仓位维持保证金之和
 * @param unrealizedProfitTotal 合约组所有仓位未实现盈亏之和
 * @param openMarginTotal 合约组初始保证金和
 */
const calculatorOccupyMargin = (groupInfo: IPositionGroupList) => {
  const { unrealizedProfitTotal, maintMarginRatioTotal, openMarginTotal = '' } = groupInfo || {}

  return Math.max(+SafeCalcUtil.sub(maintMarginRatioTotal, unrealizedProfitTotal), +openMarginTotal)
}

/**
 * 持仓列表 - 收益率计算
 * 收益率 = 收益 / 开仓保证金
 * @param profit 收益
 * @return 收益率
 */
const calculatorProfitRatio = (data: IPositionListData) => {
  const { profit } = data || {}
  const openMargin = calculatorOpenMargin(data)
  const profitRatio = +SafeCalcUtil.div(profit, openMargin)
  return profitRatio
}

/**
 * 持仓列表 - 仓位保证金率计算
 * 仓位保证金率 = (合约组保证金 + 整体未实现盈亏 - 其余仓位维持保证金)/(标记价格*(仓位数量 + 锁仓数量))
 * 【整体未实现盈亏】=合约组所有仓位未实现盈亏之和
 * 【其余仓位维持保证金】=合约组所有仓位维持保证金之和 - 当前仓位维持保证金
 * @param groupMargin 合约组保证金
 * @param markPrice 标记价格
 * @param size 仓位数量
 * @param lockSize 锁仓数量
 * @param maintMargin 当前仓位维持保证金
 * @param unrealizedProfitTotal 合约组所有仓位未实现盈亏之和
 * @param maintMarginRatioTotal 合约组所有仓位维持保证金之和
 * @return 仓位保证金率
 */
const calculatorPositionMarginRatio = (
  data: IPositionListData,
  unrealizedProfitTotal: string,
  maintMarginRatioTotal: string
) => {
  const { groupMargin, markPrice, lockSize, size, maintMargin } = data || {}
  let marginRatio = 0

  /** 【其余仓位维持保证金】=合约组所有仓位维持保证金之和 - 当前仓位维持保证金 */
  const otherMaintMargin = +SafeCalcUtil.sub(maintMarginRatioTotal, maintMargin)

  marginRatio = +SafeCalcUtil.sub(SafeCalcUtil.add(groupMargin, unrealizedProfitTotal), otherMaintMargin)
  marginRatio = +SafeCalcUtil.div(marginRatio, +SafeCalcUtil.mul(markPrice, size))

  return marginRatio
}

/**
 * 持仓列表 - 维持保证金计算
 * 仓位维持保证金=标记价格*(仓位数量 + 锁仓数量)*(维持保证金率 + 卖出手续费率)
 * @param markPrice 标记价格
 * @param size 仓位数量
 * @param lockSize 锁仓数量
 * @param maintMarginRatio 维持保证金率
 * @param sellFeeRate 卖出手续费率
 * @return 仓位维持保证金
 */
const calculatorPositionMaintMarginRatio = (data: IPositionListData) => {
  const { markPrice, size, lockSize, maintMarginRatio, sellFeeRate } = data || {}

  let newMaintMarginRatio = 0
  newMaintMarginRatio = +SafeCalcUtil.mul(markPrice, size)
  newMaintMarginRatio = +SafeCalcUtil.mul(newMaintMarginRatio, SafeCalcUtil.add(maintMarginRatio, sellFeeRate))

  return newMaintMarginRatio
}

/**
 * 持仓列表 - 预估强平价计算
 * 做多:（开仓均价 -（（合约组保证金 + 其他仓位未实现盈亏 - 其余仓位维持保证金 + 锁仓未实现盈亏 - 锁仓利息 -（锁仓数量*合约组可用保证金*（维持保证金率 + 手续费率））/仓位数量））/（1-手续费率 - 维持保证金率）
 * 做空:（开仓均价 +（（合约组保证金 + 其他仓位未实现盈亏 - 其余仓位维持保证金 + 锁仓未实现盈亏 - 锁仓利息 -（锁仓数量*合约组可用保证金*（维持保证金率 + 手续费率））/仓位数量））/（1+手续费率 + 维持保证金率）
 * @param sideInd long:多仓; short:空仓
 * @param openPrice 开仓均价
 * @param groupMargin 合约组保证金
 * @param lockFees 锁仓利息
 * @param size 仓位数量
 * @param sellFeeRate 手续费率
 * @param maintMargin 维持保证金
 * @param maintMarginRatio 维持保证金率
 * @param unrealizedProfit 未实现盈亏
 * @param unrealizedProfitTotal 合约组所有仓位未实现盈亏之和
 * @param maintMarginRatioTotal 合约组所有仓位维持保证金之和
 * @return  预估强平价
 */
const calculatorLiquidatePrice = (
  data: IPositionListData,
  unrealizedProfitTotal: string,
  maintMarginRatioTotal: string
) => {
  const {
    sideInd,
    openPrice,
    groupMargin,
    lockFees,
    size,
    sellFeeRate,
    maintMarginRatio,
    maintMargin,
    unrealizedProfit,
    lockSize,
  } = data || {}

  // 如果仓位数量为 0 时，预估强评价返回 0
  const positionSize = calculatorAmount(size, lockSize)
  if (+positionSize === 0) return 0

  // 其他仓位未实现盈亏
  const otherUnrealizedProfit = +SafeCalcUtil.sub(unrealizedProfitTotal, unrealizedProfit)
  // 其余仓位维持保证金
  const otherMaintMarginRatio = +SafeCalcUtil.sub(maintMarginRatioTotal, maintMargin)

  // 锁仓未实现盈亏
  const unrealizedProfitLock = calculatorUnrealizedProfitLock(data)
  // 锁仓数量*合约组可用保证金*（维持保证金率 + 手续费率）
  const fee = SafeCalcUtil.mul(SafeCalcUtil.mul(lockSize, groupMargin), SafeCalcUtil.add(maintMarginRatio, sellFeeRate))

  let liquidatePrice = 0
  // （合约组保证金 + 其他仓位未实现盈亏 - 其余仓位维持保证金 + 锁仓未实现盈亏 - 锁仓利息 -（锁仓数量*合约组可用保证金*（维持保证金率 + 手续费率））/仓位数量）
  liquidatePrice = +SafeCalcUtil.sub(SafeCalcUtil.add(groupMargin, otherUnrealizedProfit), otherMaintMarginRatio)
  liquidatePrice = +SafeCalcUtil.sub(SafeCalcUtil.add(liquidatePrice, unrealizedProfitLock), lockFees)
  liquidatePrice = +SafeCalcUtil.sub(liquidatePrice, fee)
  liquidatePrice = +SafeCalcUtil.div(liquidatePrice, positionSize)

  if (sideInd === FuturePositionDirectionEnum.openBuy) {
    const rate = SafeCalcUtil.sub(SafeCalcUtil.sub(1, sellFeeRate), maintMarginRatio)
    liquidatePrice = +SafeCalcUtil.div(SafeCalcUtil.sub(openPrice, liquidatePrice), rate)
  }

  if (sideInd === FuturePositionDirectionEnum.openSell) {
    const rate = SafeCalcUtil.add(SafeCalcUtil.add(1, sellFeeRate), maintMarginRatio)
    liquidatePrice = +SafeCalcUtil.div(SafeCalcUtil.add(openPrice, liquidatePrice), rate)
  }
  return liquidatePrice
}

/**
 * 持仓列表 - 收益计算
 * 收益 = 未实现盈亏 + 已实现盈亏
 * @param unrealizedProfit 未实现盈亏
 * @param realizedProfit 已实现盈亏
 * @return 收益
 */
const calculatorProfit = (data: IPositionListData) => {
  const { unrealizedProfit, realizedProfit } = data || {}
  return +SafeCalcUtil.add(unrealizedProfit, realizedProfit)
}

/**
 * 币种汇率计算
 * 保证金汇率类型 (固定)：币种汇率 = 1 * 浮动比例
 * 保证金汇率类型 (浮动)：币种汇率 = 保证金对应的法币实时汇率 * 浮动比例
 * @param symbol 币种符号
 * @param currencySymbol 法币符号
 * @param isCalcFloat 是否计算浮动比例
 * @returns 币种汇率
 */
const calculatorCoinRate = (symbol: string, currencySymbol: string, isCalcFloat = true) => {
  const {
    coinRate: { coinRate: coinRateList, legalCurrencyRate },
  } = { ...baseAssetsStore.getState() }
  const { marginSettings } = { ...baseAssetsFuturesStore.getState() }
  const rate: CoinRateResp =
    coinRateList.find((item: CoinRateResp) => {
      return item.symbol === symbol
    }) || ({} as CoinRateResp)
  const marginCoin: any = marginSettings.find((item: MerAssetsMarginSettingData) => {
    return item.coinCode === symbol
  })
  const rateData = SafeCalcUtil.mul(rate?.usdtRate, legalCurrencyRate[currencySymbol?.toUpperCase()])

  if (!isCalcFloat) {
    return rateData
  }

  let newRate = 0
  if (rate?.symbol && marginCoin?.coinCode) {
    newRate = +SafeCalcUtil.mul(
      marginCoin.rateTypeInd === PerpetualMigrateRateTypeEnum.fixed ? 1 : rateData,
      marginCoin.scale
    )
  }
  return newRate
}

/**
 * 合约组详情 - 合约组保证金
 * 合约组保证金=保证金币种数量*币种汇率
 * 币种汇率 = 币种对应的法币实时汇率 * 浮动比例
 * @param marginCurrencyTotal 合约组保证金
 * @param isCalcFloat 是否计算浮动比例
 * @param type 保证金类型
 * @returns 合约组保证金
 */
const calculatorGroupMargin = (isCalcFloat = true, type = MarginAssetTypeEnum.totalAmount) => {
  const {
    marginList: { list: marginList, baseCoin },
  } = baseAssetsFuturesStore.getState()
  let marginCurrencyTotal = 0
  marginList.forEach((marginItem: DetailMarginListChild) => {
    const coinRate = calculatorCoinRate(marginItem.symbol, baseCoin, isCalcFloat)
    let marginCurrency = 0
    switch (type) {
      case MarginAssetTypeEnum.totalAmount:
        marginCurrency = +SafeCalcUtil.mul(marginItem.amount, coinRate)
        break
      case MarginAssetTypeEnum.availableAmount:
        marginCurrency = +SafeCalcUtil.mul(marginItem.availableAmount, coinRate)
        break
      case MarginAssetTypeEnum.lockAmount:
        marginCurrency = +SafeCalcUtil.mul(marginItem.lockAmount, coinRate)
        break
      default:
        marginCurrency = +SafeCalcUtil.mul(marginItem.amount, coinRate)
        break
    }
    marginCurrencyTotal = +SafeCalcUtil.add(marginCurrencyTotal, marginCurrency)
  })
  return marginCurrencyTotal
}

/**
 * 合约组详情 - 合约组总价值计算
 * 合约组总价值 = 保证金币种价值之和 + 合约组整体未实现盈亏
 * 保证金币种价值之和 =
 * 合约组保证金 = 保证金币种购买力之和
 * 保证金币种购买力 = 保证金币种数量 * 保证金对应的法币实时汇率；不需要计算浮动比例
 * @param unrealizedProfitTotal 合约组所有仓位未实现盈亏之和
 * @returns 合约组总价值
 */
export const calculatorGroupAsset = (groupInfo: IPositionGroupList) => {
  let groupAsset = 0
  const marginCurrencyTotal = calculatorGroupMargin(false, MarginAssetTypeEnum.totalAmount)

  groupAsset = +SafeCalcUtil.add(marginCurrencyTotal, groupInfo.unrealizedProfitTotal)
  return groupAsset
}

/**
 * 合约组详情 - 合约组可用保证金总价值计算
 * 合约组可用保证金总价值=MIN(MAX(合约组保证金-(合约组维持保证金和)+合约组未实现盈亏和，0),MAX(合约组保证金 - 合约组初始保证金和，0))
 * @param groupMargin 合约组保证金
 * @param unrealizedProfitTotal 合约组所有仓位未实现盈亏之和
 * @param maintMarginRatioTotal 合约组所有仓位维持保证金之和
 * @param openMarginTotal 合约组初始保证金和
 */
export const calculatorMarginAvailable = (details: FuturesGroupDetailResp, groupInfo: IPositionGroupList) => {
  const { unrealizedProfitTotal, maintMarginRatioTotal, openMarginTotal, data } = groupInfo || {}
  const groupMargin = calculatorGroupMargin(true, MarginAssetTypeEnum.availableAmount)
  let marginAvailable = 0

  // MAX(合约组保证金 - 合约组维持保证金和 + 合约组未实现盈亏和，0)
  let profitVal = SafeCalcUtil.sub(groupMargin, maintMarginRatioTotal)
  profitVal = SafeCalcUtil.add(profitVal, unrealizedProfitTotal)
  profitVal = Decimal.max(profitVal, 0)

  // MAX(合约组保证金 - 合约组初始保证金和，0)
  let marginVal = SafeCalcUtil.sub(groupMargin, openMarginTotal)
  marginVal = Decimal.max(marginVal, 0)

  // 取上面两个值的最小值
  marginAvailable = +Decimal.min(profitVal, marginVal)

  return marginAvailable
}

/**
 * 对比推送结果的 symbolWassName，计算未实现盈亏/收益/收益率/维持保证金率/未实现盈亏总额
 * @param groupList 根据合约组 ID 分组后的持仓列表
 * @param markData 标记价格推送结果
 * @return
 */
const calculatorPositionProfitData = (groupList: IPositionGroupList[], markData: PerpetualIndexPrice[]) => {
  const newGroupList =
    groupList &&
    groupList.map(item => {
      let unrealizedProfitTotal = '0' // 合约组未实现盈亏总额
      let maintMarginRatioTotal = '0' // 合约组维持保证金总额
      let openMarginTotal = '0' // 合约组仓位保证金总额
      let newData: IPositionListData[] = []

      item.data.forEach((positionItem: IPositionListData) => {
        const markInfo =
          markData.find((markItem: PerpetualIndexPrice) => markItem.symbolWassName === positionItem.symbolWassName) ||
          ({} as PerpetualIndexPrice)
        let maintMargin = '0'

        const openMargin = `${calculatorOpenMargin(positionItem)}`
        if (markInfo?.symbolWassName === positionItem?.symbolWassName) {
          const unrealizedProfit = `${calculatorUnrealizedProfit({ ...positionItem, markPrice: markInfo?.markPrice })}`
          const profit = `${calculatorProfit({ ...positionItem, unrealizedProfit })}`
          maintMargin = `${calculatorPositionMaintMarginRatio({ ...positionItem, markPrice: markInfo?.markPrice })}`

          positionItem = {
            ...positionItem,
            unrealizedProfit,
            profit,
            profitRatio: `${calculatorProfitRatio({ ...positionItem, profit })}`,
            maintMargin,
          }
        } else {
          maintMargin = `${calculatorPositionMaintMarginRatio({ ...positionItem })}`
          positionItem = {
            ...positionItem,
            maintMargin,
          }
        }

        unrealizedProfitTotal = `${SafeCalcUtil.add(unrealizedProfitTotal, positionItem.unrealizedProfit)}`
        maintMarginRatioTotal = `${SafeCalcUtil.add(maintMarginRatioTotal, maintMargin)}`
        openMarginTotal = `${SafeCalcUtil.add(openMarginTotal, openMargin)}`
        newData = [...newData, { ...positionItem }]
      })

      return { ...item, data: newData, unrealizedProfitTotal, maintMarginRatioTotal, openMarginTotal }
    })

  return newGroupList
}

/**
 * 根据未实现盈亏总额/维持保证金总额，计算仓位保证金率/预估强平价
 * @param groupList 根据合约组 ID 分组后的持仓列表
 * @param markData 标记价格推送结果
 * @return
 */
const calculatorPositionMarginRatioData = (list: IPositionGroupList[], markData: PerpetualIndexPrice[]) => {
  // const markData = [...markDataData]
  const groupList = calculatorPositionProfitData(list, markData)
  let newGroupList: IPositionGroupList[] = []
  groupList.forEach(item => {
    const { unrealizedProfitTotal = '', maintMarginRatioTotal = '', data = [] } = item || {}
    const newData: IPositionListData[] = []

    data.forEach((positionItem: IPositionListData) => {
      const markInfo = markData.filter((markItem: PerpetualIndexPrice) => {
        return markItem.symbolWassName === positionItem.symbolWassName
      })

      if (markInfo && markInfo.length > 0) {
        const markPrice = markInfo[0].markPrice
        positionItem = {
          ...positionItem,
          markPrice,
          marginRatio: `${calculatorPositionMarginRatio(
            { ...positionItem, markPrice },
            unrealizedProfitTotal,
            maintMarginRatioTotal
          )}`,
          liquidatePrice: `${calculatorLiquidatePrice(
            { ...positionItem, markPrice },
            unrealizedProfitTotal,
            maintMarginRatioTotal
          )}`,
        }
      }

      newData.push(positionItem)
    })
    newGroupList.push({ ...item, data: newData })
  })

  return newGroupList
}

/**
 * 当前持仓列表/合约组详情持仓列表根据最新价格计算持仓的法币数量
 * @param dealData 最新价格推送结果
 * @param groupId 合约组 ID（区分合约组详情/当前持仓来源）
 */
export const onChangePositionSize = (dealData: any[]) => {
  if (!dealData || dealData.length === 0) {
    return
  }
  const futuresStore = baseAssetsFuturesStore.getState()
  const { positionListFutures = [], updatePositionListFutures } = { ...futuresStore }
  const latestData = dealData[0]
  const symbolName = latestData.symbolWassName.replace('_', '')
  const newList: IPositionListData[] = JSON.parse(JSON.stringify(positionListFutures))
  for (let i = 0; i < newList.length; i += 1) {
    let item = newList[i]
    if (item.symbol === symbolName) {
      item.latestPrice = latestData.price
    }
  }
  updatePositionListFutures(newList)
}

/**
 * 当前持仓列表/合约组详情持仓列表根据标记价格推送计算持仓数据
 * @param markData 标记价格推送结果
 * @param groupId 合约组 ID（区分合约组详情/当前持仓来源）
 */
export const onChangePositionData = (markData: PerpetualIndexPrice[], groupId?: string) => {
  const futuresStore = baseAssetsFuturesStore.getState()
  const {
    positionListFutures = [],
    futuresDetails,
    updateFuturesDetails,
    updatePositionListFutures,
    updateFuturesDetailsChartData,
  } = futuresStore

  if (!markData || markData.length === 0) {
    return
  }

  // 根据 groupId 将持仓列表分组
  let temObj = {}
  for (let i = 0; i < positionListFutures.length; i += 1) {
    let item = positionListFutures[i]
    if (!temObj[item.groupId]) {
      temObj[item.groupId] = [item]
    } else {
      temObj[item.groupId].push(item)
    }
  }

  let groupList: IPositionGroupList[] = [] // 分组后的持仓列表
  Object.keys(temObj).forEach(key => {
    groupList.push({
      groupId: key,
      data: temObj[key],
    })
  })

  const newGroupList = calculatorPositionMarginRatioData(groupList, markData)
  // 计算合约组总价值/合约组可用保证金总价值，并更新store
  if (groupId) {
    newGroupList.forEach((groupItem: IPositionGroupList) => {
      if (groupItem.groupId === groupId) {
        const newGroupDetails = {
          ...futuresDetails,
          /** 计算合约组总价值 */
          groupAsset: String(calculatorGroupAsset(groupItem)),
          /** 计算可用保证金总价值 */
          marginAvailable: String(calculatorMarginAvailable(futuresDetails, groupItem)),
          /** 仓位占用保证金 */
          positionMargin: String(calculatorOccupyMargin(groupItem)),
          /** 未实现盈亏 */
          unrealizedProfit: String(groupItem.unrealizedProfitTotal),
        }
        updateFuturesDetails(newGroupDetails)
        const { baseCoin, marginAvailable, positionMargin, marginCoin, positionAsset, openLockAsset, groupAsset } = {
          ...newGroupDetails,
        }
        updateFuturesDetailsChartData({
          baseCoin,
          marginAvailable,
          positionMargin,
          marginCoin,
          positionAsset,
          openLockAsset,
          groupAsset,
        })
      }
    })
  }

  // 更新持仓列表
  const newPositionList = positionListFutures.map((positionItem: IPositionListData) => {
    let newPositionItem = {} as IPositionListData
    newGroupList.forEach((groupItem: IPositionGroupList) => {
      if (positionItem.groupId === groupItem.groupId) {
        groupItem.data.forEach((dataItem: IPositionListData) => {
          if (positionItem.positionId === dataItem.positionId) {
            newPositionItem = { ...positionItem, ...dataItem }
          }
        })
      }
    })

    return newPositionItem
  })

  updatePositionListFutures(newPositionList)
}

type RateFilterFuturesMarginProps = {
  /** 币种数量 */
  amount: string | number
  /** 币种符号 - 币对换算用标的币符号 */
  symbol?: string
  /** 法币符号 - 默认 USD */
  currencySymbol?: string
  /** 法币精度 默认为 2 */
  precision?: number
  /** 是否需要单位 */
  needUnit?: boolean
}
/**
 * 合约保证金汇率折算
 * 保证金汇率类型 (固定)：保证金币种购买力 = 保证金币种数量 * 1 * 浮动比例
 * 保证金汇率类型 (浮动)：保证金币种购买力 = 保证金币种数量 * 保证金对应的法币实时汇率 * 浮动比例合约组保证金 = 保证金币种购买力之和
 * @param RateFilterFuturesMarginProps
 * @returns 汇率换算后的金额
 */
export const rateFilterFuturesMargin = (params: RateFilterFuturesMarginProps) => {
  const { amount, symbol = '', precision = 2, currencySymbol, needUnit = true } = params
  if (!symbol || !amount) return '0.00'

  // 法币符号
  const currencyEnName = currencySymbol?.toUpperCase() || CurrencyNameEnum.usd

  // 币种汇率，需要区分固定还是浮动，处理浮动比例
  const coinRate = calculatorCoinRate(symbol || '', currencyEnName)

  // 金额格式化
  const newAssets = formatCurrency(SafeCalcUtil.mul(amount, coinRate), precision, false)
  if (!needUnit) return newAssets
  return `${newAssets} ${currencyEnName}`
}

/**
 * 资产总览 - 获取折算成商户设置法币的总资产
 */
export const onGetMyTotalAssets = async () => {
  const { fetchCoinRate } = baseAssetsStore.getState()
  fetchCoinRate()
  const [totalAssetsRes, settings] = await Promise.all([getAssetsOverview(), getFuturesCurrencySettings()])
  const { totalAmount, symbol } = totalAssetsRes || {}
  if (!totalAmount || !symbol) return '--'
  const newTotalAmount = rateFilterFutures({
    amount: totalAmount,
    symbol,
    rate: settings?.currencySymbol,
    showUnit: false,
    isFormat: false,
  })
  return newTotalAmount
}

/**
 * 调整持仓杠杆 - 计算额外占用保证金
 * 额外占用保证金=[（持仓数量*开仓均价）/（调整目标杠杆倍数）]-[（持仓数量*开仓均价）/杠杆倍数]
 * @param size 持仓数量
 * @param openPrice 开仓均价
 * @param lever 持仓杠杆倍数
 * @param newLever 调整目标杠杆倍数
 * @returns 额外占用保证金
 */
export const calculatorAdditionalOccupationMargin = (groupInfo: IPositionListData, newLever: number) => {
  const { size, lockSize, openPrice, lever } = groupInfo || {}

  // 持仓数量*开仓均价
  const positionAmount = SafeCalcUtil.mul(calculatorAmount(size, lockSize), openPrice)
  const oldMargin = SafeCalcUtil.div(positionAmount, lever)
  const newMargin = SafeCalcUtil.div(positionAmount, newLever)

  return `${SafeCalcUtil.sub(newMargin, oldMargin)}`
}

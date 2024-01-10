/**
 * 行情异动相关
 */
import { t } from '@lingui/macro'

/**
 * 行情异动 - 异动类型
 */
export enum TopMoversTypeEnum {
  /** 大单买入 */
  large1Buy = 1,
  /** 大单卖出 */
  large1Sell,
  /** 阶段回调 */
  stageCallback,
  /** 触底反弹 */
  rally,
  /** 今日新高 */
  new24hHigh,
  /** 今日新低 */
  new24hLow,
  /** 本周新高 */
  new7dHigh,
  /** 本周新低 */
  new7dLow,
  /** 本月新高 */
  new30dHigh,
  /** 本月新低 */
  new30dLow,
  /** 极速拉升 */
  rapidUp,
  /** 极速下跌 */
  rapidFall,
  /** 大幅震荡 */
  largeShock,
  /** 横盘震荡 */
  sideways,
}

/**
 *  行情异动 - 异动类型名称
 */
export const getTopMoversTypeName = (type: TopMoversTypeEnum) => {
  return {
    [TopMoversTypeEnum.large1Buy]: t`constants_market_market_activity_index_5101241`,
    [TopMoversTypeEnum.large1Sell]: t`constants_market_market_activity_index_5101242`,
    [TopMoversTypeEnum.stageCallback]: t`constants_market_market_activity_index_5101243`,
    [TopMoversTypeEnum.rally]: t`constants_market_market_activity_index_5101244`,
    [TopMoversTypeEnum.new24hHigh]: t`constants_market_market_activity_index_5101245`,
    [TopMoversTypeEnum.new24hLow]: t`constants_market_market_activity_index_5101246`,
    [TopMoversTypeEnum.new7dHigh]: t`constants_market_market_activity_index_5101247`,
    [TopMoversTypeEnum.new7dLow]: t`constants_market_market_activity_index_5101248`,
    [TopMoversTypeEnum.new30dHigh]: t`constants_market_market_activity_index_5101249`,
    [TopMoversTypeEnum.new30dLow]: t`constants_market_market_activity_index_5101250`,
    [TopMoversTypeEnum.rapidUp]: t`constants_market_market_activity_index_5101251`,
    [TopMoversTypeEnum.rapidFall]: t`constants_market_market_activity_index_5101252`,
    [TopMoversTypeEnum.largeShock]: t`constants_market_market_activity_index_5101253`,
    [TopMoversTypeEnum.sideways]: t`constants_market_market_activity_index_5101254`,
  }[type]
}

/**
 * 行情异动 - 异动涨跌色
 */
export enum TopMoversColorTypeEnum {
  /** 涨 */
  up = 1,
  /** 跌 */
  down,
}

/**
 * 行情移动 - 异动值数据类型
 */
export enum TopMoversDataTypeEnum {
  /** 委单数量 */
  orderQuantity = 1,
  /** 涨跌幅 */
  quoteChange,
}

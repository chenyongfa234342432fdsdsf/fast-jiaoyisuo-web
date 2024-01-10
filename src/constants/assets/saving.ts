/**
 * 理财账户
 */
import { t } from '@lingui/macro'

/**
 * 累计收益类型
 */
export enum profitTypeEnum {
  /** 本月 */
  THIS_MONTH = 1,
  /** 本季度 */
  THIS_TQUARTER = 3,
  /** 本年度 */
  THIS_YEAR = 12,
  /** 所有 */
  ALL = 0,
}

/**
 * 累计收益类型列表
 */
export const profitTypeList = [
  { label: t`features/assets/saving/totalAssets/index-8`, value: profitTypeEnum.THIS_MONTH },
  { label: t`features/assets/saving/totalAssets/index-9`, value: profitTypeEnum.THIS_TQUARTER },
  { label: t`features/assets/saving/totalAssets/index-10`, value: profitTypeEnum.THIS_YEAR },
  { label: t`features/assets/saving/totalAssets/index-11`, value: profitTypeEnum.ALL },
]

/**
 * 所有持仓类型
 */
export enum productTypeEnum {
  /** 全部 */
  ALL = 0,
  /** 活期宝 */
  CURRENT = 1,
  /** 定期宝 */
  REGULAR = 2,
}

/**
 * 理财账户 - 理财记录 - 类型
 */
export enum historyTypeEnum {
  /** 全部 */
  ALL = 0,
  /** 申购 */
  SUBSCRIBE = 1,
  /** 赎回 */
  REDEEM = 2,
  /** 收益 */
  PROFIT = 3,
}

/**
 * 理财账户 - 理财记录 - 类型列表
 */
export const historyTypeList = [
  { label: t`assets.financial-record.search.all`, value: historyTypeEnum.ALL },
  { label: t`constants/assets/saving-0`, value: historyTypeEnum.SUBSCRIBE },
  { label: t`constants/assets/saving-1`, value: historyTypeEnum.REDEEM },
  { label: t`features/orders/order-columns/future-2`, value: historyTypeEnum.PROFIT },
]

/**
 * 理财账户 - 理财记录 - 类型名称
 */
export const getHistoryTypeName = (type: historyTypeEnum) => {
  return {
    [historyTypeEnum.SUBSCRIBE]: t`constants/assets/saving-0`,
    [historyTypeEnum.REDEEM]: t`constants/assets/saving-1`,
    [historyTypeEnum.PROFIT]: t`features/orders/order-columns/future-2`,
  }[type]
}

/**
 * 理财账户 - 理财记录 - 状态
 */
export enum historyStatusEnum {
  /** 全部 */
  ALL = 0,
  /** 审核中 */
  UNDER_REVIEW = 1,
  /** 已完成 */
  DONE = 2,
  /** 失败 */
  FAIL = 3,
}

/**
 * 理财账户 - 理财记录 - 状态列表
 */
export const historyStatusList = [
  { label: t`assets.financial-record.search.all`, value: historyStatusEnum.ALL },
  { label: t`features/user/personal-center/account-security/index-2`, value: historyStatusEnum.UNDER_REVIEW },
  { label: t`constants/assets/index-21`, value: historyStatusEnum.DONE },
  { label: t`assets.financial-record.search.failure`, value: historyStatusEnum.FAIL },
]

/**
 * 理财账户 - 理财记录 - 类型名称
 */
export const getHistoryStatusName = (status: historyStatusEnum) => {
  return {
    [historyStatusEnum.UNDER_REVIEW]: t`features/user/personal-center/account-security/index-2`,
    [historyStatusEnum.DONE]: t`constants/assets/index-21`,
    [historyStatusEnum.FAIL]: t`constants/assets/saving-2`,
  }[status]
}

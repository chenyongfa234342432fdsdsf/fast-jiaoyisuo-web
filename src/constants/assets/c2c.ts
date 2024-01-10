/**
 * 合约资产
 */
import { t } from '@lingui/macro'
/*  --------- 参考老 Tule 的分割线---------- */

/**
 * tabs
 */
export enum tabsEnum {
  OVERVIEW = '1',
  TRANSFER_RECORD = '2',
}

/**
 * 划转记录 - 状态
 */
export enum transferStutasEnum {
  /** 所有 */
  ALL = 0,
  /** 审核中 */
  UNDER_REVIEW = 1,
  /** 已完成 */
  DONE = 2,
  /** 审核失败 */
  AUDIT_FAILED = 3,
  UNDER_REVIEW_SECOND = '0',
  AUDIT_FAILED_SECOND = 4,
}

/**
 * 划转记录 - 状态列表
 */
export const transferStutasList = [
  { label: t`features/assets/saving/totalAssets/index-11`, value: transferStutasEnum.ALL },
  { label: t`features/user/personal-center/account-security/index-2`, value: transferStutasEnum.UNDER_REVIEW },
  { label: t`constants/assets/index-21`, value: transferStutasEnum.DONE },
  { label: t`constants/assets/futures-0`, value: transferStutasEnum.AUDIT_FAILED },
]

/**
 * 划转记录 - 状态名称
 * @param stutas 划转状态
 * @returns 划转状态
 */
export const getTransferStutasName = (stutas: transferStutasEnum) => {
  return {
    [transferStutasEnum.UNDER_REVIEW]: t`features/user/personal-center/account-security/index-2`,
    [transferStutasEnum.DONE]: t`constants/assets/index-21`,
    [transferStutasEnum.AUDIT_FAILED]: t`constants/assets/futures-0`,
    [transferStutasEnum.UNDER_REVIEW_SECOND]: t`features/user/personal-center/account-security/index-2`,
    [transferStutasEnum.AUDIT_FAILED_SECOND]: t`constants/assets/futures-0`,
  }[stutas]
}

/**
 * 划转记录 - 周期
 */
export enum transferCycleEnum {
  /** 一周内 */
  WEEK = 3,
  /** 一月内 */
  MONTH = 1,
  /** 一年内 */
  YEAR = 2,
}

/**
 * 划转记录 - 周期列表
 */
export const transferCycleList = [
  { label: t`order.filters.timeRange.week`, value: transferCycleEnum.WEEK },
  { label: t`order.filters.timeRange.month`, value: transferCycleEnum.MONTH },
  { label: t`order.filters.timeRange.1y`, value: transferCycleEnum.YEAR },
]

/**
 * 划转记录 - 类型
 */
export enum transferTypeEnum {
  /** 币币至合约 */
  CURRENCY_TO_CONTRACT = 30,
  /** 合约至币币 */
  CONTRACT_TO_CURRENCY = 31,
  /** 合约至 C2C */
  CONTRACT_TO_C2C = 32,
  /** C2C 至合约 */
  C2C_TO_CONTRACT = 33,
}

/**
 * 划转记录 - 类型名称
 * @param type 划转类型
 * @returns 划转类型
 */
export const getTransferTypeName = (type: transferTypeEnum) => {
  return {
    [transferTypeEnum.CURRENCY_TO_CONTRACT]: t`constants/assets/index-1`,
    [transferTypeEnum.CONTRACT_TO_CURRENCY]: t`constants/assets/index-2`,

    [transferTypeEnum.CONTRACT_TO_C2C]: t`constants/assets/futures-1`,
    [transferTypeEnum.C2C_TO_CONTRACT]: t`constants/assets/futures-2`,
  }[type]
}

/**
 * 合约账户 - 财务日志 - 类型
 */
export enum historyTypeEnum {
  /** 全部 */
  ALL = 0,
  /** 手续费 */
  SERVICE_CHARGE = 3,
  /** 平仓结算 */
  CLOSING_SETTLEMENT = 2,
  /** 资金费用 */
  CAPITAL_EXPENSE = 1,
  /** 转入 */
  SWITCH_TO = 7,
  /** 转出 */
  TRANSFER_OUT = 8,
}

/**
 * 合约账户 - 财务日志 - 类型列表
 */
export const historyTypeList = [
  { label: t`assets.financial-record.search.all`, value: historyTypeEnum.ALL },
  { label: t`trade.c2c.procedureFee`, value: historyTypeEnum.SERVICE_CHARGE },
  { label: t`constants/assets/futures-3`, value: historyTypeEnum.CLOSING_SETTLEMENT },
  { label: t`constants/assets/futures-4`, value: historyTypeEnum.CAPITAL_EXPENSE },
  { label: t`constants/assets/futures-5`, value: historyTypeEnum.SWITCH_TO },
  { label: t`constants/assets/futures-6`, value: historyTypeEnum.TRANSFER_OUT },
]

/**
 * 合约账户 - 财务日志 - 类型名称
 * @param type 类型
 * @returns 类型名称
 */
export const getHistoryTypeName = (type: historyTypeEnum) => {
  return {
    [historyTypeEnum.SERVICE_CHARGE]: t`trade.c2c.procedureFee`,
    [historyTypeEnum.CLOSING_SETTLEMENT]: t`constants/assets/futures-3`,
    [historyTypeEnum.CAPITAL_EXPENSE]: t`constants/assets/futures-4`,
    [historyTypeEnum.SWITCH_TO]: t`constants/assets/futures-5`,
    [historyTypeEnum.TRANSFER_OUT]: t`constants/assets/futures-6`,
  }[type]
}

/**
 * 合约账户 - 财务日志 - 周期
 */
export enum historyCycleEnum {
  /** 一周内 */
  WEEK = 7,
  /** 一月内 */
  MONTH = 30,
  /** 一年内 */
  YEAR = 365,
}

/**
 * 合约账户 - 财务日志 - 周期列表
 */
export const historyCycleList = [
  { label: t`order.filters.timeRange.week`, value: historyCycleEnum.WEEK },
  { label: t`order.filters.timeRange.month`, value: historyCycleEnum.MONTH },
  { label: t`order.filters.timeRange.1y`, value: historyCycleEnum.YEAR },
]

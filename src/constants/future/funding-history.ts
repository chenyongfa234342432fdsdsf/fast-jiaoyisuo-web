import { t } from '@lingui/macro'

export enum FundingHistoryTabIdEnum {
  usdt = 0,
  coin = 1,
}
export enum FundingHistoryTypeEnum {
  fundingRate = 'rate',
  index = 'index',
  // 风险准备金
  insuranceFund = 'insurance-fund',
}
export function getFundingHistoryTabIdEnumName(id: FundingHistoryTabIdEnum): string {
  return {
    [FundingHistoryTabIdEnum.usdt]: t`future.funding-history.tabs.usdt`,
    [FundingHistoryTabIdEnum.coin]: t`future.funding-history.tabs.coin`,
  }[id]
}

export enum FundingHistoryIndexPriceTypeEnum {
  index = 'index',
  mark = 'mark',
}
export function getFundingHistoryIndexPriceTypeEnumName(id: FundingHistoryIndexPriceTypeEnum): string {
  return {
    [FundingHistoryIndexPriceTypeEnum.index]: t`future.funding-history.index-price.column.index-price`,
    [FundingHistoryIndexPriceTypeEnum.mark]: t`future.funding-history.index-price.column.mark-price`,
  }[id]
}
export enum IndexPriceTableTypeEnum {
  price = 'index',
  ingredient = 'ingredient',
}
export function getIndexPriceTableTypeEnumName(id: IndexPriceTableTypeEnum): string {
  return {
    [FundingHistoryIndexPriceTypeEnum.index]: t`future.funding-history.index-price.column.index-price`,
    [FundingHistoryIndexPriceTypeEnum.mark]: t`future.funding-history.index-price.column.mark-price`,
  }[id]
}
/** 合约相关帮助中心文档链接枚举 */
export enum FutureHelpCenterEnum {
  /** 标记价格说明 */
  markPrice = 'mark_price_help',
  /** 指数价格说明 */
  indexPrice = 'index_price_help',
  /** 资金费率说明 */
  fundingRate = 'funding_rate_help',
  /** 协议 */
  futureAgreement = 'contract_user_agreement',
  /** 风险提示 */
  futureRisk = 'risk_warning_statement',
  /** 额外保证金说明 */
  extraMargin = 'additional_margin',
}

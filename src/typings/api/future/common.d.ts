import { YapiGetV1TradePairListData } from "@/typings/yapi/TradePairListV1GetApi"

export type IFuture = YapiGetV1TradePairListData & {
  typeInd: string
  minusFeeRate: number
  plusFeeRate: number
}
export type IFutureListReq = {
  type: string
}
export type IFutureListResp = {
  list: IFuture[]
}
export type IPerpetualFuture = {
  base: string
  indexBase: string
  code: string
  price: string
  quote: string
  marketPriceDigit: number
  unitAmount: string
}
export type IPerpetualFutureListResp = IPerpetualFuture[]
/**
 * 合约资产币种
 */
export type IFutureAssetsCoin = {
  currencyCode: string
  realAvailableBalance: string
}
/**
 * 合约资金费率以及价格
 */
 export type IFutureFundRatePrice = {
  contractcode: string
  estimatefeerate: string
  feerate: string
  indexprice: string
  markprice: string
  nextliquidationinterval: number
  totalposition: string
}
/**
 * 合约行情
 */
 export type IFutureQuotation = {
  amount24: string
  buy: string
  change24: string
  changepercentage: string
  contractCode: string
  contractcode: string
  createddate: number
  first: string
  high: string
  last: string
  lastcny: string
  low: string
  sell:string
  size24: string
}

export type IFutureConfig = {
  autoAddMargin: 1 | 0
  // 含义不明，暂时用来判断是否展示自动追加保证金
  type: 1
}

export type IUpdateFutureConfigReq = {
  contractCode: string
  value: any
  // TODO: 暂时只看到更新追加保证金的设置
  type: 1
}

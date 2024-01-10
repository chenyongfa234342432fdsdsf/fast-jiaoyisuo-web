import { TradeMarginEnum, TradeMarginTypesEnum, TradeModeEnum } from "@/constants/trade"
import { AllCoinListResp } from '@/typings/api/assets/assets'
import { AssetsRecordsListReq } from '@/typings/api/assets/assets'

/** 获取所有币币列表返回信息 */
export interface IResultAllCoinList {
  /** 所有币信息 */
  coinList?: null | AllCoinListResp[]
  /** 通过 coinId 查到的币信息 */
  coinInfo?: any
}

/** 提现 form 表单组件 props */
export interface IWithdrawFormProps {
  coin?: AllCoinListResp
}

/** 获取现货资产 - 主要交易页面用 */
export interface IUserAssetsSpot {
  tradeId?: number
  /** 买币 id */
  buyCoinId?: number
  /** 卖币 id */
  sellCoinId?:number
}

/** 提币信息确认 - 信息 */
export interface IWithdrawData {
  coinName?: string
  amount?: number
  symbol?: any
  address?: string
  memo?: string
  changeFee?: number | string
  feeCoinName?: string
  feeSymbol?: string
  withdrawPrecision?:number
  targetUID?: string
  uidNick?: string
  hiddenAddAddress?:boolean
  dayMaxWithdrawAmount?: string
}
/** 提币获取验证码入参 */
export interface ISafeVerifySendWithdrawalDataProps {
  address: string // 提币地址
  quantity: number // 提币数量
  currencyCode: string // 提币币种
  memo: string // memo 地址
}

/** 杠杠账户资产列表方法入参 */
export interface IMarginAssetsListProps {
  /** cross 全仓，isolated 逐仓 */
  activeName?: string
  /** 回调，返回当前币种的资产数据 */
  onSuccess?(data: any): void
}

/** 获取杠杆资产方法入参 */
export type getMarginAssetsProps = {
    /** cross 全仓，isolated 逐仓 */
    activeName: string
    /** 币 id */
    tradeId: number
    /** 杠杆模式：1 普通模式，2 自动借款模式，3 自动还款模式 */
    leverBuyMode: TradeMarginTypesEnum
    /** 杠杆卖出模式：1 普通模式，2 自动借款模式，3 自动还款模式 */
    leverSellMode: TradeMarginTypesEnum
    /** 回调，返回当前币种的资产数据 */
    onSuccess?(data: any): void
}

/** 获取合约资产 - 方法入参 */
export type getFuturesAssetsProps = {
  /** 当前选中币的 code，如：usdt */
  currencyCode: string
  /** 回调 */
  onSuccess?(data: any): void
}

/** 获取用户资产 - 方法入参 */
export type getMyAssetsDataProps = {
  /** 账户类型：TradeModeEnum */
  accountType: TradeModeEnum
  /** 现货资产入参 */
  paramsCoin?: {
    /** 币对 id */
    tradeId: number
  }
  /** 现货资产入参 */
  paramsMargin?: {
    /** cross 全仓，isolated 逐仓 */
    activeName: TradeMarginEnum
    /** 币对 id */
    tradeId: number
    /** 杠杆买入模式：1 普通模式，2 自动借款模式，3 自动还款模式 */
    leverBuyMode: TradeMarginTypesEnum
    /** 杠杆卖出模式：1 普通模式，2 自动借款模式，3 自动还款模式 */
    leverSellMode: TradeMarginTypesEnum
  }
  /** 合约资产入参 */
  paramsFutures?: {
    /** 当前选中币的 code，如：usdt */
    currencyCode: string
  }
  /** 回调，返回当前币种的资产数据 */
  onSuccess?(data: any): void
}


export interface ISearchParamsProps {
  overview?: AssetsRecordsListReq
  main?: AssetsRecordsListReq
  futures?: AssetsRecordsListReq
  derivative?: AssetsRecordsListReq
  commission?: AssetsRecordsListReq
  other?: AssetsRecordsListReq
  rebate?: AssetsRecordsListReq
  c2c?: AssetsRecordsListReq
}

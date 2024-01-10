/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [杠杆逐仓交易对信息↗](https://yapi.coin-online.cc/project/72/interface/api/1922) 的 **请求类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/pair`
 * @更新时间 `2022-08-29 13:58:23`
 */
export interface YapiGetMarginIsolatedPairApiRequest {}

/**
 * 接口 [杠杆逐仓交易对信息↗](https://yapi.coin-online.cc/project/72/interface/api/1922) 的 **返回类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/pair`
 * @更新时间 `2022-08-29 13:58:23`
 */
export interface YapiGetMarginIsolatedPairApiResponse {
  code?: number
  data?: YapiDtoMagIsolatedPairVo[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 逐仓杠杆交易对
 */
export interface YapiDtoMagIsolatedPairVo {
  /**
   * 标的币Name
   */
  base?: string
  /**
   * 标的币能否借币，默认0不可借 1可借
   */
  baseBorrowable?: boolean
  /**
   * 标的币id
   */
  baseCoinId?: number
  /**
   * 标的币日利率
   */
  baseDailyInterestRate?: string
  /**
   * 标的币最大可借
   */
  baseMaxBorrow?: string
  /**
   * 标的币能否转入，默认0不可转入 1可转入
   */
  baseTransferinable?: boolean
  /**
   * 标的币能否转出，默认0不可转出 1可转出
   */
  baseTransferoutable?: boolean
  /**
   * 标的币年利率
   */
  baseYearInterestRate?: string
  id?: number
  /**
   * 交易状态，默认0不可交易 1可交易
   */
  marginTradeable?: boolean
  /**
   * 逐仓最大杠杆倍数
   */
  maxMarginRatio?: number
  /**
   * 计价币Name
   */
  quote?: string
  /**
   * 计价币能否借币，默认0不可借 1可借
   */
  quoteBorrowable?: boolean
  /**
   * 计价币id
   */
  quoteCoinId?: number
  /**
   * 计价币日利率
   */
  quoteDailyInterestRate?: string
  /**
   * 计价币最大可借
   */
  quoteMaxBorrow?: string
  /**
   * 计价币能否转入，默认0不可转入 1可转入
   */
  quoteTransferinable?: boolean
  /**
   * 计价币能否转出，默认0不可转出 1可转出
   */
  quoteTransferoutable?: boolean
  /**
   * 计价币年利率
   */
  quoteYearInterestRate?: string
  /**
   * 交易区，比如BTC、USDT
   */
  tradeArea?: string
  /**
   * 交易对id
   */
  tradeId?: number
}

/* prettier-ignore-end */

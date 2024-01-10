/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [逐仓交易对↗](https://yapi.coin-online.cc/project/72/interface/api/1934) 的 **请求类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/tradeTypes`
 * @更新时间 `2022-08-29 13:58:23`
 */
export interface YapiGetMarginIsolatedTradeTypesApiRequest {}

/**
 * 接口 [逐仓交易对↗](https://yapi.coin-online.cc/project/72/interface/api/1934) 的 **返回类型**
 *
 * @分类 [逐仓杠杆交易↗](https://yapi.coin-online.cc/project/72/interface/api/cat_461)
 * @标签 `逐仓杠杆交易`
 * @请求头 `GET /margin/isolated/tradeTypes`
 * @更新时间 `2022-08-29 13:58:23`
 */
export interface YapiGetMarginIsolatedTradeTypesApiResponse {
  code?: number
  data?: YapiDtoMagTradeTypeVO[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 逐仓交易对
 */
export interface YapiDtoMagTradeTypeVO {
  /**
   * 标的币名称
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
   * 标的币Logo
   */
  baseImageUrl?: string
  /**
   * 标的币序号
   */
  baseSortId?: number
  /**
   * 标的币能否转入，默认0不可转入 1可转入
   */
  baseTransferinable?: boolean
  /**
   * 标的币能否转出，默认0不可转出 1可转出
   */
  baseTransferoutable?: boolean
  /**
   * 有效小数位控制
   */
  digit?: string
  id?: number
  /**
   * 能否杠杆交易，默认flase 不可交易 true可交易
   */
  marginTradeAble?: boolean
  /**
   * 计价币名称
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
   * 计价币Logo
   */
  quoteImageUrl?: string
  /**
   * 计价币序号
   */
  quoteSortId?: number
  /**
   * 计价币能否转入，默认0不可转入 1可转入
   */
  quoteTransferinable?: boolean
  /**
   * 计价币能否转出，默认0不可转出 1可转出
   */
  quoteTransferoutable?: boolean
  /**
   * 交易对id
   */
  tradeId?: number
}

/* prettier-ignore-end */

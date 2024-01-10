/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [质押借币-用户历史借币币种↗](https://yapi.coin-online.cc/project/72/interface/api/1583) 的 **请求类型**
 *
 * @分类 [hotcoin-der-service-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_398)
 * @标签 `hotcoin-der-service-controller`
 * @请求头 `GET /der/order/loanSymbol/list`
 * @更新时间 `2022-08-29 13:58:10`
 */
export interface YapiGetDerOrderLoanSymbolListApiRequest {}

/**
 * 接口 [质押借币-用户历史借币币种↗](https://yapi.coin-online.cc/project/72/interface/api/1583) 的 **返回类型**
 *
 * @分类 [hotcoin-der-service-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_398)
 * @标签 `hotcoin-der-service-controller`
 * @请求头 `GET /der/order/loanSymbol/list`
 * @更新时间 `2022-08-29 13:58:10`
 */
export interface YapiGetDerOrderLoanSymbolListApiResponse {
  code?: number
  data?: YapiDtoDerOrderCoinSymbolResp[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
/**
 * 质押借币-订单币种属性
 */
export interface YapiDtoDerOrderCoinSymbolResp {
  /**
   * 平台币种ID
   */
  coinId?: number
  /**
   * 最新价-USDT
   */
  lastPrice?: string
  /**
   * 币种名称
   */
  symbol?: string
  /**
   * 质押借币业务币种ID
   */
  symbolId?: number
}

/* prettier-ignore-end */

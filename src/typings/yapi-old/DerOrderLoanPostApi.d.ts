/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [质押借币-借币↗](https://yapi.coin-online.cc/project/72/interface/api/1580) 的 **请求类型**
 *
 * @分类 [hotcoin-der-service-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_398)
 * @标签 `hotcoin-der-service-controller`
 * @请求头 `POST /der/order/loan`
 * @更新时间 `2022-08-29 13:58:10`
 */
export interface YapiPostDerOrderLoanApiRequest {
  /**
   * 借款数量
   */
  loanAmount?: number
  /**
   * 借币周期
   */
  loanPeriod?: number
  /**
   * 借出币Id
   */
  loanSymbolId?: number
  /**
   * 质押币ID
   */
  pledgeSymbolId?: number
}

/**
 * 接口 [质押借币-借币↗](https://yapi.coin-online.cc/project/72/interface/api/1580) 的 **返回类型**
 *
 * @分类 [hotcoin-der-service-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_398)
 * @标签 `hotcoin-der-service-controller`
 * @请求头 `POST /der/order/loan`
 * @更新时间 `2022-08-29 13:58:10`
 */
export interface YapiPostDerOrderLoanApiResponse {
  code?: number
  data?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */

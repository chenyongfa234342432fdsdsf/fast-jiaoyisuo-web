/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [理财持仓币种列表↗](https://yapi.coin-online.cc/project/72/interface/api/1667) 的 **请求类型**
 *
 * @分类 [热币宝理财↗](https://yapi.coin-online.cc/project/72/interface/api/cat_452)
 * @标签 `热币宝理财`
 * @请求头 `GET /finance/hold/currency/list`
 * @更新时间 `2022-08-29 13:58:13`
 */
export interface YapiGetFinanceHoldCurrencyListApiRequest {}

/**
 * 接口 [理财持仓币种列表↗](https://yapi.coin-online.cc/project/72/interface/api/1667) 的 **返回类型**
 *
 * @分类 [热币宝理财↗](https://yapi.coin-online.cc/project/72/interface/api/cat_452)
 * @标签 `热币宝理财`
 * @请求头 `GET /finance/hold/currency/list`
 * @更新时间 `2022-08-29 13:58:13`
 */
export interface YapiGetFinanceHoldCurrencyListApiResponse {
  code?: number
  data?: number[]
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */

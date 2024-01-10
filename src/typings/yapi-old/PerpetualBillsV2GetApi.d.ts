/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [合约账单↗](https://yapi.coin-online.cc/project/72/interface/api/2468) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v2/perpetual/bills`
 * @更新时间 `2022-08-29 16:18:29`
 */
export interface YapiGetV2PerpetualBillsApiRequest {
  page: string
  pageSize: string
  startDate: string
  endDate: string
  currencyCode: string
  type: string
}

/**
 * 接口 [合约账单↗](https://yapi.coin-online.cc/project/72/interface/api/2468) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v2/perpetual/bills`
 * @更新时间 `2022-08-29 16:18:29`
 */
export interface YapiGetV2PerpetualBillsApiResponse {
  code?: number
  data?: {}
  msg?: string
}

/* prettier-ignore-end */

/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [搜索所有交易区的所有币种↗](https://yapi.coin-online.cc/project/72/interface/api/2216) 的 **请求类型**
 *
 * @分类 [trade-ws-api-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_413)
 * @标签 `trade-ws-api-controller`
 * @请求头 `GET /v3/getTradeTypeBySellName`
 * @更新时间 `2022-08-29 13:58:34`
 */
export interface YapiGetV3GetTradeTypeBySellNameApiRequest {
  /**
   * sellName
   */
  sellName?: string
}

/**
 * 接口 [搜索所有交易区的所有币种↗](https://yapi.coin-online.cc/project/72/interface/api/2216) 的 **返回类型**
 *
 * @分类 [trade-ws-api-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_413)
 * @标签 `trade-ws-api-controller`
 * @请求头 `GET /v3/getTradeTypeBySellName`
 * @更新时间 `2022-08-29 13:58:34`
 */
export interface YapiGetV3GetTradeTypeBySellNameApiResponse {
  code?: number
  data?: {}
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */

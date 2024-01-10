/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [MarketJson↗](https://yapi.coin-online.cc/project/72/interface/api/2252) 的 **请求类型**
 *
 * @分类 [trade-ws-api-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_413)
 * @标签 `trade-ws-api-controller`
 * @请求头 `POST /v3/realTimeTrade`
 * @更新时间 `2022-08-29 13:58:35`
 */
export interface YapiPostV3RealTimeTradeApiRequest {
  /**
   * tradeId
   */
  tradeId?: string
  /**
   * successCount
   */
  successCount?: string
}

/**
 * 接口 [MarketJson↗](https://yapi.coin-online.cc/project/72/interface/api/2252) 的 **返回类型**
 *
 * @分类 [trade-ws-api-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_413)
 * @标签 `trade-ws-api-controller`
 * @请求头 `POST /v3/realTimeTrade`
 * @更新时间 `2022-08-29 13:58:35`
 */
export interface YapiPostV3RealTimeTradeApiResponse {
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

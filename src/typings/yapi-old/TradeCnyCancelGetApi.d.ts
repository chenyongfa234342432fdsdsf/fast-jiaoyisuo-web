/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [cancelEntrust↗](https://yapi.coin-online.cc/project/72/interface/api/2051) 的 **请求类型**
 *
 * @分类 [front-trade-json-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_395)
 * @标签 `front-trade-json-controller`
 * @请求头 `GET /trade/cny_cancel`
 * @更新时间 `2022-08-29 13:58:27`
 */
export interface YapiGetTradeCnyCancelApiRequest {
  /**
   * id
   */
  id: string
  /**
   * matchType
   */
  matchType?: string
}

/**
 * 接口 [cancelEntrust↗](https://yapi.coin-online.cc/project/72/interface/api/2051) 的 **返回类型**
 *
 * @分类 [front-trade-json-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_395)
 * @标签 `front-trade-json-controller`
 * @请求头 `GET /trade/cny_cancel`
 * @更新时间 `2022-08-29 13:58:27`
 */
export interface YapiGetTradeCnyCancelApiResponse {
  code?: number
  data?: {}
  msg?: string
  time?: number
}

/* prettier-ignore-end */

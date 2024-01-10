/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [entrust↗](https://yapi.coin-online.cc/project/72/interface/api/2069) 的 **请求类型**
 *
 * @分类 [front-trade-json-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_395)
 * @标签 `front-trade-json-controller`
 * @请求头 `GET /trade/cny_entrust_json`
 * @更新时间 `2022-08-29 13:58:28`
 */
export interface YapiGetTradeCnyEntrustJsonApiRequest {
  /**
   * symbol
   */
  symbol?: string
  /**
   * status
   */
  status?: string
  /**
   * currentPage
   */
  currentPage?: string
}

/**
 * 接口 [entrust↗](https://yapi.coin-online.cc/project/72/interface/api/2069) 的 **返回类型**
 *
 * @分类 [front-trade-json-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_395)
 * @标签 `front-trade-json-controller`
 * @请求头 `GET /trade/cny_entrust_json`
 * @更新时间 `2022-08-29 13:58:28`
 */
export interface YapiGetTradeCnyEntrustJsonApiResponse {
  code?: number
  data?: {}
  msg?: string
  time?: number
}

/* prettier-ignore-end */

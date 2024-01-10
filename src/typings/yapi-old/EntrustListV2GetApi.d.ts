/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [orderEntrust↗](https://yapi.coin-online.cc/project/72/interface/api/2159) 的 **请求类型**
 *
 * @分类 [order-api-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_410)
 * @标签 `order-api-controller`
 * @请求头 `GET /v2/entrust/list`
 * @更新时间 `2022-08-29 13:58:32`
 */
export interface YapiGetV2EntrustListApiRequest {
  /**
   * symbol
   */
  symbol?: string
  /**
   * type
   */
  type?: string
  /**
   * pageNo
   */
  pageNo?: string
  /**
   * pageSize
   */
  pageSize?: string
}

/**
 * 接口 [orderEntrust↗](https://yapi.coin-online.cc/project/72/interface/api/2159) 的 **返回类型**
 *
 * @分类 [order-api-controller↗](https://yapi.coin-online.cc/project/72/interface/api/cat_410)
 * @标签 `order-api-controller`
 * @请求头 `GET /v2/entrust/list`
 * @更新时间 `2022-08-29 13:58:32`
 */
export interface YapiGetV2EntrustListApiResponse {
  code?: number
  data?: {}
  msg?: string
  time?: number
}

/* prettier-ignore-end */

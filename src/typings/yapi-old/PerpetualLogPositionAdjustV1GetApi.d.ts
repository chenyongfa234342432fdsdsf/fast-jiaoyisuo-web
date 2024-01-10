/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [positionAdjustList↗](https://yapi.coin-online.cc/project/72/interface/api/2507) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v1/perpetual/log/position-adjust`
 * @更新时间 `2022-08-29 16:54:34`
 */
export interface YapiGetV1PerpetualLogPositionAdjustApiRequest {
  contractCode?: string
  side?: string
  type?: string
  startDate?: string
  endDate?: string
  indexBase?: string
  quote?: string
  page?: string
  pageSize?: string
}

/**
 * 接口 [positionAdjustList↗](https://yapi.coin-online.cc/project/72/interface/api/2507) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v1/perpetual/log/position-adjust`
 * @更新时间 `2022-08-29 16:54:34`
 */
export interface YapiGetV1PerpetualLogPositionAdjustApiResponse {
  code?: number
  data?: {}
  msg?: string
}

/* prettier-ignore-end */

/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取订单详情↗](https://yapi.coin-online.cc/project/72/interface/api/2453) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v1/perpetual/products/detail/{contractCode}/{orderId}`
 * @更新时间 `2022-08-29 16:05:10`
 */
export interface YapiGetV1PerpetualProductsDetailContractCodeOrderIdApiRequest {
  contractCode: string
  orderId: string
}

/**
 * 接口 [获取订单详情↗](https://yapi.coin-online.cc/project/72/interface/api/2453) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v1/perpetual/products/detail/{contractCode}/{orderId}`
 * @更新时间 `2022-08-29 16:05:10`
 */
export interface YapiGetV1PerpetualProductsDetailContractCodeOrderIdApiResponse {
  code?: number
  data?: {}
  msg?: string
}

/* prettier-ignore-end */

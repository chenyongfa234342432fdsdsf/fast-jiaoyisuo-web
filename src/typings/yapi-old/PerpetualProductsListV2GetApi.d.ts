/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取所有合约下的订单列表,只有未完成订单↗](https://yapi.coin-online.cc/project/72/interface/api/2504) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v2/perpetual/products/list`
 * @更新时间 `2022-08-29 16:53:08`
 */
export interface YapiGetV2PerpetualProductsListApiRequest {
  contractCode?: string
  base?: string
  detailSide?: string
  status?: string
  type?: string
  expectStatus?: string
  systemType?: string
  startDate?: string
  endDate?: string
  page?: string
  pageSize?: string
  stopLimitType?: string
  indexBase?: string
  quote?: string
}

/**
 * 接口 [获取所有合约下的订单列表,只有未完成订单↗](https://yapi.coin-online.cc/project/72/interface/api/2504) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v2/perpetual/products/list`
 * @更新时间 `2022-08-29 16:53:08`
 */
export interface YapiGetV2PerpetualProductsListApiResponse {
  code?: number
  data?: {}
  msg?: string
}

/* prettier-ignore-end */

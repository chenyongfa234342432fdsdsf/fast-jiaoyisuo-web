/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [取得对应合约深度数据↗](https://yapi.coin-online.cc/project/72/interface/api/2471) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v1/perpetual/public/{contractCode}/orderbook`
 * @更新时间 `2022-08-29 16:19:30`
 */
export interface YapiGetV1PerpetualPublicContractCodeOrderbookApiRequest {
  size: string
  /**
   * 合约编码
   */
  contractCode: string
}

/**
 * 接口 [取得对应合约深度数据↗](https://yapi.coin-online.cc/project/72/interface/api/2471) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v1/perpetual/public/{contractCode}/orderbook`
 * @更新时间 `2022-08-29 16:19:30`
 */
export interface YapiGetV1PerpetualPublicContractCodeOrderbookApiResponse {
  code?: number
  data?: {}
  msg?: string
}

/* prettier-ignore-end */

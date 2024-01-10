/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [撤单↗](https://yapi.coin-online.cc/project/72/interface/api/2492) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v1/perpetual/condition/{contractCode}/order/{id}`
 * @更新时间 `2022-08-29 16:39:03`
 */
export interface YapiGetV1PerpetualConditionContractCodeOrderIdApiRequest {
  /**
   * 合约编码
   */
  contractCode: string
  /**
   * id
   */
  id: string
}

/**
 * 接口 [撤单↗](https://yapi.coin-online.cc/project/72/interface/api/2492) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v1/perpetual/condition/{contractCode}/order/{id}`
 * @更新时间 `2022-08-29 16:39:03`
 */
export interface YapiGetV1PerpetualConditionContractCodeOrderIdApiResponse {
  code?: number
  data?: {}
  msg?: string
}

/* prettier-ignore-end */

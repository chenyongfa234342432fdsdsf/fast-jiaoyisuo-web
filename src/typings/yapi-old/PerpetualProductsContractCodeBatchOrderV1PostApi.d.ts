/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [批量下单↗](https://yapi.coin-online.cc/project/72/interface/api/2480) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `POST /v1/perpetual/products/{contractCode}/batch-order`
 * @更新时间 `2022-08-29 16:30:32`
 */
export interface YapiPostV1PerpetualProductsContractCodeBatchOrderApiRequest {
  /**
   * 合约编码
   */
  contractCode: string
}

/**
 * 接口 [批量下单↗](https://yapi.coin-online.cc/project/72/interface/api/2480) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `POST /v1/perpetual/products/{contractCode}/batch-order`
 * @更新时间 `2022-08-29 16:30:32`
 */
export interface YapiPostV1PerpetualProductsContractCodeBatchOrderApiResponse {
  code?: number
  data?: {}
  msg?: string
}

/* prettier-ignore-end */

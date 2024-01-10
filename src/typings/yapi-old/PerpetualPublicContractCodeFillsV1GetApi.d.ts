/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [获取最新交易数据接口↗](https://yapi.coin-online.cc/project/72/interface/api/2474) 的 **请求类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v1/perpetual/public/{contractCode}/fills`
 * @更新时间 `2022-08-29 16:20:13`
 */
export interface YapiGetV1PerpetualPublicContractCodeFillsApiRequest {
  /**
   * 合约编码
   */
  contractCode: string
}

/**
 * 接口 [获取最新交易数据接口↗](https://yapi.coin-online.cc/project/72/interface/api/2474) 的 **返回类型**
 *
 * @分类 [newex-dax-perpetual-rest↗](https://yapi.coin-online.cc/project/72/interface/api/cat_473)
 * @请求头 `GET /v1/perpetual/public/{contractCode}/fills`
 * @更新时间 `2022-08-29 16:20:13`
 */
export interface YapiGetV1PerpetualPublicContractCodeFillsApiResponse {
  code?: number
  data?: {}
  msg?: string
}

/* prettier-ignore-end */

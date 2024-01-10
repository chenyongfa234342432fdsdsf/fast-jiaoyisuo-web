/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询用户平台保证金币种设置↗](https://yapi.nbttfc365.com/project/44/interface/api/3803) 的 **请求类型**
 *
 * @分类 [合约主流程↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_532)
 * @请求头 `GET /v1/perpetual/mer/assetsMargin`
 * @更新时间 `2023-01-09 11:39:33`
 */
export interface YapiGetV1PerpetualMerAssetsMarginApiRequest {}

/**
 * 接口 [查询用户平台保证金币种设置↗](https://yapi.nbttfc365.com/project/44/interface/api/3803) 的 **返回类型**
 *
 * @分类 [合约主流程↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_532)
 * @请求头 `GET /v1/perpetual/mer/assetsMargin`
 * @更新时间 `2023-01-09 11:39:33`
 */
export interface YapiGetV1PerpetualMerAssetsMarginApiResponse {
  /**
   * 200成功，其他失败
   */
  code: string
  message: string
  data: YapiGetV1PerpetualMerAssetsMarginListData[]
}
export interface YapiGetV1PerpetualMerAssetsMarginListData {
  /**
   * 币种Id
   */
  coinId: number
  /**
   * 排序
   */
  sort: number
  /**
   * 汇率
   */
  rate: string
  /**
   * 法币符号
   */
  currencySymbol: string
  /**
   * 币种名称
   */
  coinName: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [查询用户平台保证金币种设置↗](https://yapi.nbttfc365.com/project/44/interface/api/3803)
// **/
// export const getV1PerpetualMerAssetsMarginApiRequest: MarkcoinRequest<
//   YapiGetV1PerpetualMerAssetsMarginApiRequest,
//   YapiGetV1PerpetualMerAssetsMarginApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/perpetual/mer/assetsMargin",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

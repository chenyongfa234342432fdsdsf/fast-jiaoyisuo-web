/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [资产-跟带单账户资产列表↗](https://yapi.nbttfc365.com/project/44/interface/api/19453) 的 **请求类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /v1/perpetual/follow/balance/list`
 * @更新时间 `2023-11-14 16:47:04`
 */
export interface YapiGetV1PerpetualFollowBalanceListApiRequest {
  /**
   * 账户id
   */
  accountId: string
}

/**
 * 接口 [资产-跟带单账户资产列表↗](https://yapi.nbttfc365.com/project/44/interface/api/19453) 的 **返回类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /v1/perpetual/follow/balance/list`
 * @更新时间 `2023-11-14 16:47:04`
 */
export interface YapiGetV1PerpetualFollowBalanceListApiResponse {
  code: number
  message: string
  data: YapiGetV1PerpetualFollowBalanceData
}
export interface YapiGetV1PerpetualFollowBalanceData {
  list: YapiGetV1PerpetualFollowBalanceListData[]
  /**
   * 计价币
   */
  baseCoin: string
}
export interface YapiGetV1PerpetualFollowBalanceListData {
  /**
   * 币种id
   */
  coinId: string
  /**
   * 币种名称
   */
  coinName: string
  /**
   * 数量
   */
  amount: string
  appLogo: string
  webLogo: string
  /**
   * 币种符号
   */
  symbol: string
  /**
   * 冻结数量
   */
  lockAmount: string
  /**
   * 可用数量
   */
  availableAmount: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [资产-跟带单账户资产列表↗](https://yapi.nbttfc365.com/project/44/interface/api/19453)
// **/
// export const getV1PerpetualFollowBalanceListApiRequest: MarkcoinRequest<
//   YapiGetV1PerpetualFollowBalanceListApiRequest,
//   YapiGetV1PerpetualFollowBalanceListApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/perpetual/follow/balance/list",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

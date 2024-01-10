/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [资产-带跟单账户列表↗](https://yapi.nbttfc365.com/project/44/interface/api/19489) 的 **请求类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /v1/perpetual/follow/account/list`
 * @更新时间 `2023-11-14 16:49:57`
 */
export interface YapiGetV1PerpetualFollowAccountListApiRequest {
  /**
   * 账户类型：trader，带单账户，follower：跟单账户
   */
  typeInd: string
}

/**
 * 接口 [资产-带跟单账户列表↗](https://yapi.nbttfc365.com/project/44/interface/api/19489) 的 **返回类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /v1/perpetual/follow/account/list`
 * @更新时间 `2023-11-14 16:49:57`
 */
export interface YapiGetV1PerpetualFollowAccountListApiResponse {
  code: number
  message: string
  data: YapiGetV1PerpetualFollowAccountData
}
export interface YapiGetV1PerpetualFollowAccountData {
  list: YapiGetV1PerpetualFollowAccountListData[]
}
export interface YapiGetV1PerpetualFollowAccountListData {
  /**
   * 账户id
   */
  accountId: string
  /**
   * 账户名称
   */
  name: string
  /**
   * 账户类型
   */
  typeInd: string
  /**
   * 账户保证金
   */
  accountMargin: string
  /**
   * 可用保证金
   */
  availableMargin: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [资产-带跟单账户列表↗](https://yapi.nbttfc365.com/project/44/interface/api/19489)
// **/
// export const getV1PerpetualFollowAccountListApiRequest: MarkcoinRequest<
//   YapiGetV1PerpetualFollowAccountListApiRequest,
//   YapiGetV1PerpetualFollowAccountListApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/perpetual/follow/account/list",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

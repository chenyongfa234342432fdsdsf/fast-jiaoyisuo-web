/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [资产-（内部接口）创建账户_copy↗](https://yapi.nbttfc365.com/project/44/interface/api/19531) 的 **请求类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `POST /inner/v1/perpetual/follow/account/create_1700016362081`
 * @更新时间 `2023-11-15 10:46:02`
 */
export interface YapiPostInnerV1PerpetualFollowAccountCreate_1700016362081ApiRequest {
  /**
   * 商户id
   */
  businessId: number
  /**
   * uid
   */
  uid: number
  /**
   * 账户类型：trader，带单账户，follower：跟单账户
   */
  typeInd: string
}

/**
 * 接口 [资产-（内部接口）创建账户_copy↗](https://yapi.nbttfc365.com/project/44/interface/api/19531) 的 **返回类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `POST /inner/v1/perpetual/follow/account/create_1700016362081`
 * @更新时间 `2023-11-15 10:46:02`
 */
export interface YapiPostInnerV1PerpetualFollowAccountCreate_1700016362081ApiResponse {
  isSuccess: boolean
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [资产-（内部接口）创建账户_copy↗](https://yapi.nbttfc365.com/project/44/interface/api/19531)
// **/
// export const postInnerV1PerpetualFollowAccountCreate_1700016362081ApiRequest: MarkcoinRequest<
//   YapiPostInnerV1PerpetualFollowAccountCreate_1700016362081ApiRequest,
//   YapiPostInnerV1PerpetualFollowAccountCreate_1700016362081ApiResponse['data']
// > = data => {
//   return request({
//     path: "/inner/v1/perpetual/follow/account/create_1700016362081",
//     method: "POST",
//     data
//   })
// }

/* prettier-ignore-end */

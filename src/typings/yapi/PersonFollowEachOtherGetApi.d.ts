/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [主页:关注\/取消关注↗](https://yapi.nbttfc365.com/project/44/interface/api/19465) 的 **请求类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /person/followEachOther`
 * @更新时间 `2023-11-14 16:03:01`
 */
export interface YapiGetPersonFollowEachOtherApiRequest {
  /**
   * 取消/关注人uid，操作人是当前登录用户
   */
  uid: string
  /**
   * 关注1  取消关注2
   */
  openType: string
}

/**
 * 接口 [主页:关注\/取消关注↗](https://yapi.nbttfc365.com/project/44/interface/api/19465) 的 **返回类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /person/followEachOther`
 * @更新时间 `2023-11-14 16:03:01`
 */
export interface YapiGetPersonFollowEachOtherApiResponse {
  code: string
  message: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [主页:关注/取消关注↗](https://yapi.nbttfc365.com/project/44/interface/api/19465)
// **/
// export const getPersonFollowEachOtherApiRequest: MarkcoinRequest<
//   YapiGetPersonFollowEachOtherApiRequest,
//   YapiGetPersonFollowEachOtherApiResponse['data']
// > = params => {
//   return request({
//     path: "/person/followEachOther",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [主页:关注\/粉丝列表↗](https://yapi.nbttfc365.com/project/44/interface/api/19459) 的 **请求类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /person/idolList`
 * @更新时间 `2023-11-14 18:44:19`
 */
export interface YapiGetPersonIdolListApiRequest {
  page: string
  pageSize: string
  /**
   * 1查询粉丝、2查询关注
   */
  queryType: string
  /**
   * 搜索内容
   */
  queryContext?: string
}

/**
 * 接口 [主页:关注\/粉丝列表↗](https://yapi.nbttfc365.com/project/44/interface/api/19459) 的 **返回类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /person/idolList`
 * @更新时间 `2023-11-14 18:44:19`
 */
export interface YapiGetPersonIdolListApiResponse {
  code: string
  message: string
  page: number
  pageSize: number
  total: number
  list: YapiGetPersonIdolList[]
}
export interface YapiGetPersonIdolList {
  /**
   * 头像
   */
  headPic: string
  /**
   * 名称
   */
  name: string
  /**
   * 简介
   */
  synopsis: string
  /**
   * 是否互相关注1 是 2否
   */
  followEachOther: number
  /**
   * uid
   */
  uid: number
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [主页:关注/粉丝列表↗](https://yapi.nbttfc365.com/project/44/interface/api/19459)
// **/
// export const getPersonIdolListApiRequest: MarkcoinRequest<
//   YapiGetPersonIdolListApiRequest,
//   YapiGetPersonIdolListApiResponse['data']
// > = params => {
//   return request({
//     path: "/person/idolList",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

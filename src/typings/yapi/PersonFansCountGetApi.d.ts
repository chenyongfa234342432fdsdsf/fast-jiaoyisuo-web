/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [主页:粉丝或者关注人数统计↗](https://yapi.nbttfc365.com/project/44/interface/api/19471) 的 **请求类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /person/fansCount`
 * @更新时间 `2023-11-14 16:02:48`
 */
export interface YapiGetPersonFansCountApiRequest {
  /**
   * 查看对象uid，不传取当前登录人
   */
  uid?: string
}

/**
 * 接口 [主页:粉丝或者关注人数统计↗](https://yapi.nbttfc365.com/project/44/interface/api/19471) 的 **返回类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /person/fansCount`
 * @更新时间 `2023-11-14 16:02:48`
 */
export interface YapiGetPersonFansCountApiResponse {
  /**
   * 我的粉丝人数
   */
  fansNumber: number
  /**
   * 我关注人数
   */
  idol: number
  code: string
  message: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [主页:粉丝或者关注人数统计↗](https://yapi.nbttfc365.com/project/44/interface/api/19471)
// **/
// export const getPersonFansCountApiRequest: MarkcoinRequest<
//   YapiGetPersonFansCountApiRequest,
//   YapiGetPersonFansCountApiResponse['data']
// > = params => {
//   return request({
//     path: "/person/fansCount",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

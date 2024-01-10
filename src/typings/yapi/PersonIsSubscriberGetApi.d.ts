/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [主页：订阅或取消订阅↗](https://yapi.nbttfc365.com/project/44/interface/api/19507) 的 **请求类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /person/isSubscriber`
 * @更新时间 `2023-11-14 19:13:19`
 */
export interface YapiGetPersonIsSubscriberApiRequest {
  /**
   * 订阅或者取消对象uid，操作人是当前登录用户
   */
  uid: string
  /**
   * 订阅1  取消订阅2
   */
  openType: string
}

/**
 * 接口 [主页：订阅或取消订阅↗](https://yapi.nbttfc365.com/project/44/interface/api/19507) 的 **返回类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /person/isSubscriber`
 * @更新时间 `2023-11-14 19:13:19`
 */
export interface YapiGetPersonIsSubscriberApiResponse {
  code: string
  message: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [主页：订阅或取消订阅↗](https://yapi.nbttfc365.com/project/44/interface/api/19507)
// **/
// export const getPersonIsSubscriberApiRequest: MarkcoinRequest<
//   YapiGetPersonIsSubscriberApiRequest,
//   YapiGetPersonIsSubscriberApiResponse['data']
// > = params => {
//   return request({
//     path: "/person/isSubscriber",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

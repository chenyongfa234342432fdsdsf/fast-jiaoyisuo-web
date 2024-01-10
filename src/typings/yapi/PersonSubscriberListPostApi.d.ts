/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [主页：订阅列表查询↗](https://yapi.nbttfc365.com/project/44/interface/api/19501) 的 **请求类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `POST /person/subscriberList`
 * @更新时间 `2023-11-14 18:52:27`
 */
export interface YapiPostPersonSubscriberListApiRequest {
  /**
   * 排序字段名： yield 收益； subscriberTime订阅时间
   */
  orderby: string
  /**
   * asc 正序排列、desc 反序排列
   */
  order: string
  /**
   * 搜索用户名
   */
  userName: string
  /**
   * 页码
   */
  page: number
  /**
   * 每页大小
   */
  pageSize: string
  /**
   * 排序字段名
   */
  orderBy: string
}

/**
 * 接口 [主页：订阅列表查询↗](https://yapi.nbttfc365.com/project/44/interface/api/19501) 的 **返回类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `POST /person/subscriberList`
 * @更新时间 `2023-11-14 18:52:27`
 */
export interface YapiPostPersonSubscriberListApiResponse {
  code: string
  message: string
  /**
   * 页码
   */
  page: number
  /**
   * 每页条数
   */
  pageSize: string
  /**
   * 总页数
   */
  total: string
  list: YapiPostPersonSubscriberList[]
}
export interface YapiPostPersonSubscriberList {
  /**
   * 头像
   */
  headPic: string
  /**
   * 项目名称
   */
  proJectName: string
  /**
   * 订阅时间
   */
  subscriberTime: string
  /**
   * 跟随收益
   */
  yield: string
  /**
   * 是否订阅 1 是 2否
   */
  isSubscriber: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [主页：订阅列表查询↗](https://yapi.nbttfc365.com/project/44/interface/api/19501)
// **/
// export const postPersonSubscriberListApiRequest: MarkcoinRequest<
//   YapiPostPersonSubscriberListApiRequest,
//   YapiPostPersonSubscriberListApiResponse['data']
// > = data => {
//   return request({
//     path: "/person/subscriberList",
//     method: "POST",
//     data
//   })
// }

/* prettier-ignore-end */

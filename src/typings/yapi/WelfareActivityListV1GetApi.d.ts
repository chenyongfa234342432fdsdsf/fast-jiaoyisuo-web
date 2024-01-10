/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [活动中心列表-用户-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/19927) 的 **请求类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `GET /v1/welfare/activity/list`
 * @更新时间 `2023-11-29 09:58:57`
 */
export interface YapiGetV1WelfareActivityListApiRequest {
  /**
   * 状态 processing 进行中 	ends 已结束
   */
  status: string
  /**
   * 分页参数页号 ，从1开始
   */
  pageNum: string
  /**
   * 分页大小 默认 20 ，最小1，最大500
   */
  pageSize: string
}

/**
 * 接口 [活动中心列表-用户-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/19927) 的 **返回类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `GET /v1/welfare/activity/list`
 * @更新时间 `2023-11-29 09:58:57`
 */
export interface YapiGetV1WelfareActivityListApiResponse {
  /**
   * 200成功
   */
  code: number
  /**
   * 描述
   */
  message: string
  data: YapiGetV1WelfareActivityData
}
export interface YapiGetV1WelfareActivityData {
  /**
   * 活动列表
   */
  list: YapiGetV1WelfareActivityListData[]
  total: string
  pageNum: string
  pageSize: string
}
export interface YapiGetV1WelfareActivityListData {
  /**
   * 活动ID
   */
  activityId: string
  /**
   * 活动名称
   */
  activityName: string
  /**
   * 截止日期，13位毫秒值
   */
  expirationTime: number
  /**
   * 见字典 welfare_activity_status_code
   */
  status: string
  /**
   * 活动链接
   */
  activityUrl: string
  /**
   * web封面地址
   */
  webCoverUrl: string
  /**
   * H5 APP 封面地址
   */
  h5CoverUrl: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [活动中心列表-用户-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/19927)
// **/
// export const getV1WelfareActivityListApiRequest: MarkcoinRequest<
//   YapiGetV1WelfareActivityListApiRequest,
//   YapiGetV1WelfareActivityListApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/welfare/activity/list",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

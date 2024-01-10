/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [活动中心列表-全部-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/20119) 的 **请求类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `GET /v1/welfare/activity/all`
 * @更新时间 `2023-11-29 09:59:34`
 */
export interface YapiGetV1WelfareActivityAllApiRequest {
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
 * 接口 [活动中心列表-全部-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/20119) 的 **返回类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `GET /v1/welfare/activity/all`
 * @更新时间 `2023-11-29 09:59:34`
 */
export interface YapiGetV1WelfareActivityAllApiResponse {
  /**
   * 200成功
   */
  code: number
  /**
   * 描述
   */
  message: string
  data: YapiGetV1WelfareActivityAllData
}
export interface YapiGetV1WelfareActivityAllData {
  /**
   * 所有活动列表
   */
  list: YapiGetV1WelfareActivityAllListData[]
  total: string
  pageNum: string
  pageSize: string
}
export interface YapiGetV1WelfareActivityAllListData {
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
  expirationTime: string
  /**
   * 见字典welfare_activity_status_code
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
// * [活动中心列表-全部-分页↗](https://yapi.nbttfc365.com/project/44/interface/api/20119)
// **/
// export const getV1WelfareActivityAllApiRequest: MarkcoinRequest<
//   YapiGetV1WelfareActivityAllApiRequest,
//   YapiGetV1WelfareActivityAllApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/welfare/activity/all",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

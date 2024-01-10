/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [活动-立即报名↗](https://yapi.nbttfc365.com/project/44/interface/api/19933) 的 **请求类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `POST /v1/welfare/activity/join`
 * @更新时间 `2023-11-21 14:46:12`
 */
export interface YapiPostV1WelfareActivityJoinApiRequest {
  /**
   * 活动ID
   */
  activityId: string
}

/**
 * 接口 [活动-立即报名↗](https://yapi.nbttfc365.com/project/44/interface/api/19933) 的 **返回类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `POST /v1/welfare/activity/join`
 * @更新时间 `2023-11-21 14:46:12`
 */
export interface YapiPostV1WelfareActivityJoinApiResponse {
  /**
   * 200成功
   */
  code: number
  /**
   * 描述
   */
  message: string
  data: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [活动-立即报名↗](https://yapi.nbttfc365.com/project/44/interface/api/19933)
// **/
// export const postV1WelfareActivityJoinApiRequest: MarkcoinRequest<
//   YapiPostV1WelfareActivityJoinApiRequest,
//   YapiPostV1WelfareActivityJoinApiResponse['data']
// > = data => {
//   return request({
//     path: "/v1/welfare/activity/join",
//     method: "POST",
//     data
//   })
// }

/* prettier-ignore-end */

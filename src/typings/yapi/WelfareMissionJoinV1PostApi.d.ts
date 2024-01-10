/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [任务中心列表-点击去完成↗](https://yapi.nbttfc365.com/project/44/interface/api/19903) 的 **请求类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `POST /v1/welfare/mission/join`
 * @更新时间 `2023-11-24 14:22:30`
 */
export interface YapiPostV1WelfareMissionJoinApiRequest {
  /**
   * 任务ID
   */
  missionId: string
}

/**
 * 接口 [任务中心列表-点击去完成↗](https://yapi.nbttfc365.com/project/44/interface/api/19903) 的 **返回类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `POST /v1/welfare/mission/join`
 * @更新时间 `2023-11-24 14:22:30`
 */
export interface YapiPostV1WelfareMissionJoinApiResponse {
  /**
   * 200成功
   */
  code: number
  /**
   * 描述
   */
  message: string
  /**
   * true成功
   */
  data: boolean
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [任务中心列表-点击去完成↗](https://yapi.nbttfc365.com/project/44/interface/api/19903)
// **/
// export const postV1WelfareMissionJoinApiRequest: MarkcoinRequest<
//   YapiPostV1WelfareMissionJoinApiRequest,
//   YapiPostV1WelfareMissionJoinApiResponse['data']
// > = data => {
//   return request({
//     path: "/v1/welfare/mission/join",
//     method: "POST",
//     data
//   })
// }

/* prettier-ignore-end */

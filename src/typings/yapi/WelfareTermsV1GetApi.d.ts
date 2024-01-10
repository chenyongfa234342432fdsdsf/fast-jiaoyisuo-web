/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [规则条款↗](https://yapi.nbttfc365.com/project/44/interface/api/20209) 的 **请求类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `GET /v1/welfare/terms`
 * @更新时间 `2023-12-06 12:38:53`
 */
export interface YapiGetV1WelfareTermsApiRequest {}

/**
 * 接口 [规则条款↗](https://yapi.nbttfc365.com/project/44/interface/api/20209) 的 **返回类型**
 *
 * @分类 [福利中心-任务活动↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1193)
 * @请求头 `GET /v1/welfare/terms`
 * @更新时间 `2023-12-06 12:38:53`
 */
export interface YapiGetV1WelfareTermsApiResponse {
  code?: number
  message?: string
  data?: YapiGetV1WelfareTermsData
}
/**
 * url
 */
export interface YapiGetV1WelfareTermsData {
  missionTermWebUrl: string
  missionTermH5Url: string
  couponTermWebUrl: string
  couponTermH5Url: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [规则条款↗](https://yapi.nbttfc365.com/project/44/interface/api/20209)
// **/
// export const getV1WelfareTermsApiRequest: MarkcoinRequest<
//   YapiGetV1WelfareTermsApiRequest,
//   YapiGetV1WelfareTermsApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/welfare/terms",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

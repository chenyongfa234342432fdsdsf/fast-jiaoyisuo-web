/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [带单员平仓-内部↗](https://yapi.nbttfc365.com/project/44/interface/api/20131) 的 **请求类型**
 *
 * @分类 [合约主流程↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_532)
 * @请求头 `POST /inner/v1/perpetual/orders/closePosition/project`
 * @更新时间 `2023-11-27 15:16:17`
 */
export interface YapiPostInnerV1PerpetualOrdersClosePositionProjectApiRequest {
  /**
   * 用户id
   */
  uid: string
  /**
   * 商户id
   */
  businessId: string
  projectId: string
}

/**
 * 接口 [带单员平仓-内部↗](https://yapi.nbttfc365.com/project/44/interface/api/20131) 的 **返回类型**
 *
 * @分类 [合约主流程↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_532)
 * @请求头 `POST /inner/v1/perpetual/orders/closePosition/project`
 * @更新时间 `2023-11-27 15:16:17`
 */
export interface YapiPostInnerV1PerpetualOrdersClosePositionProjectApiResponse {
  data?: string
  code?: number
  message?: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [带单员平仓-内部↗](https://yapi.nbttfc365.com/project/44/interface/api/20131)
// **/
// export const postInnerV1PerpetualOrdersClosePositionProjectApiRequest: MarkcoinRequest<
//   YapiPostInnerV1PerpetualOrdersClosePositionProjectApiRequest,
//   YapiPostInnerV1PerpetualOrdersClosePositionProjectApiResponse['data']
// > = data => {
//   return request({
//     path: "/inner/v1/perpetual/orders/closePosition/project",
//     method: "POST",
//     data
//   })
// }

/* prettier-ignore-end */

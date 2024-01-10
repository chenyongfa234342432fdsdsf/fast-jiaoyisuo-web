/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [用户合约资产清理(内部接口)↗](https://yapi.nbttfc365.com/project/44/interface/api/11164) 的 **请求类型**
 *
 * @分类 [资产-合约组接口↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_538)
 * @请求头 `POST /inner/v1/perpetual/assets/clear`
 * @更新时间 `2023-07-24 11:20:55`
 */
export interface YapiPostInnerV1PerpetualAssetsClearApiRequest {
  businessId: number
  uid: number
}

/**
 * 接口 [用户合约资产清理(内部接口)↗](https://yapi.nbttfc365.com/project/44/interface/api/11164) 的 **返回类型**
 *
 * @分类 [资产-合约组接口↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_538)
 * @请求头 `POST /inner/v1/perpetual/assets/clear`
 * @更新时间 `2023-07-24 11:20:55`
 */
export interface YapiPostInnerV1PerpetualAssetsClearApiResponse {
  isSuccess: boolean
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [用户合约资产清理(内部接口)↗](https://yapi.nbttfc365.com/project/44/interface/api/11164)
// **/
// export const postInnerV1PerpetualAssetsClearApiRequest: MarkcoinRequest<
//   YapiPostInnerV1PerpetualAssetsClearApiRequest,
//   YapiPostInnerV1PerpetualAssetsClearApiResponse['data']
// > = data => {
//   return request({
//     path: "/inner/v1/perpetual/assets/clear",
//     method: "POST",
//     data
//   })
// }

/* prettier-ignore-end */

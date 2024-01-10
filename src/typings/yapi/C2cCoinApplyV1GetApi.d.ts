/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [商家申请冻结币种列表↗](https://yapi.nbttfc365.com/project/73/interface/api/20250) 的 **请求类型**
 *
 * @分类 [公共分类↗](https://yapi.nbttfc365.com/project/73/interface/api/cat_553)
 * @请求头 `GET /v1/c2c/coin/apply`
 * @更新时间 `2023-12-06 11:27:13`
 */
export interface YapiGetV1C2cCoinApplyApiRequest {}

/**
 * 接口 [商家申请冻结币种列表↗](https://yapi.nbttfc365.com/project/73/interface/api/20250) 的 **返回类型**
 *
 * @分类 [公共分类↗](https://yapi.nbttfc365.com/project/73/interface/api/cat_553)
 * @请求头 `GET /v1/c2c/coin/apply`
 * @更新时间 `2023-12-06 11:27:13`
 */
export interface YapiGetV1C2cCoinApplyApiResponse {
  code?: number
  data?: YapiGetV1C2CCoinApplyListData[]
  message?: string
}
export interface YapiGetV1C2CCoinApplyListData {
  symbol?: string
  appLogo?: string
  precision?: number
  maxTransQuantity?: string
  statusCd?: string
  defaultShow?: boolean
  trade_precision?: number
  sortCode?: number
  total?: number
  balance?: string
  minTransQuantity?: string
  webLogo?: string
  usdRate?: number
  coinFullName?: string
  id?: string
  coinName?: string
  freezeBalance?: number
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [商家申请冻结币种列表↗](https://yapi.nbttfc365.com/project/73/interface/api/20250)
// **/
// export const getV1C2cCoinApplyApiRequest: MarkcoinRequest<
//   YapiGetV1C2cCoinApplyApiRequest,
//   YapiGetV1C2cCoinApplyApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/c2c/coin/apply",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

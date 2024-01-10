/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [产品code获取产品ID↗](https://yapi.nbttfc365.com/project/44/interface/api/19765) 的 **请求类型**
 *
 * @分类 [娱乐区↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_810)
 * @请求头 `GET /v1/ra/products/getByCode`
 * @更新时间 `2023-11-16 14:21:14`
 */
export interface YapiGetV1RaProductsGetByCodeApiRequest {
  code: string
}

/**
 * 接口 [产品code获取产品ID↗](https://yapi.nbttfc365.com/project/44/interface/api/19765) 的 **返回类型**
 *
 * @分类 [娱乐区↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_810)
 * @请求头 `GET /v1/ra/products/getByCode`
 * @更新时间 `2023-11-16 14:21:14`
 */
export interface YapiGetV1RaProductsGetByCodeApiResponse {
  code: string
  message: string
  data: number
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [产品code获取产品ID↗](https://yapi.nbttfc365.com/project/44/interface/api/19765)
// **/
// export const getV1RaProductsGetByCodeApiRequest: MarkcoinRequest<
//   YapiGetV1RaProductsGetByCodeApiRequest,
//   YapiGetV1RaProductsGetByCodeApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/ra/products/getByCode",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

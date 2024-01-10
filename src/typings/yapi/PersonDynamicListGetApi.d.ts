/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [个人主页-动态列表分页查询（近七天）↗](https://yapi.nbttfc365.com/project/44/interface/api/19329) 的 **请求类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /person/dynamicList`
 * @更新时间 `2023-11-14 19:17:30`
 */
export interface YapiGetPersonDynamicListApiRequest {
  page: string
  pageSize: string
}

/**
 * 接口 [个人主页-动态列表分页查询（近七天）↗](https://yapi.nbttfc365.com/project/44/interface/api/19329) 的 **返回类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /person/dynamicList`
 * @更新时间 `2023-11-14 19:17:30`
 */
export interface YapiGetPersonDynamicListApiResponse {
  code: string
  /**
   * 页码
   */
  page: number
  /**
   * 页码大小
   */
  pageSize: number
  /**
   * 总条数
   */
  total: number
  message: string
  list?: YapiGetPersonDynamicList[]
}
export interface YapiGetPersonDynamicList {
  /**
   * 头像地址
   */
  headPic: string
  /**
   * 名称
   */
  takerName: string
  /**
   * 动态类型：1创建项目、2完成项目、3开仓、4平仓
   */
  dynamicType: number
  /**
   * 项目状态：1进行中 2已结束
   */
  projectSta: number
  /**
   * 动态时间
   */
  dynamicTime: string
  /**
   * 收益率
   */
  yield: number
  /**
   * 跟随人数
   */
  followerNumber: number
  /**
   * 币对ID
   */
  tradeId: number
  /**
   * 币对symbol
   */
  tradeSymbol: string
  /**
   * 合约类型 delivery 交割 perpetual 永续erty
   */
  typeInd: string
  /**
   * 杠杆倍数 Integer
   */
  lever: number
  /**
   * 操作类型1 买、2卖 操作类型+操作类型判断当前操作
   */
  openType: number
  /**
   * 操作价格 开仓或者平常价格
   */
  openPrice: number
  /**
   * 项目id，用于跳转去查看详情
   */
  projectId: number
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [个人主页-动态列表分页查询（近七天）↗](https://yapi.nbttfc365.com/project/44/interface/api/19329)
// **/
// export const getPersonDynamicListApiRequest: MarkcoinRequest<
//   YapiGetPersonDynamicListApiRequest,
//   YapiGetPersonDynamicListApiResponse['data']
// > = params => {
//   return request({
//     path: "/person/dynamicList",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

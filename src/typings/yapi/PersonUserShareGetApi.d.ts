/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [主页:交易员、跟单人分享<分享人是当前登录人>↗](https://yapi.nbttfc365.com/project/44/interface/api/19483) 的 **请求类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /person/userShare`
 * @更新时间 `2023-11-14 17:02:04`
 */
export interface YapiGetPersonUserShareApiRequest {
  /**
   * 被分享人uid
   */
  shareUid: string
  /**
   * 分享类型：1跟单人 2交易员
   */
  userType: string
}

/**
 * 接口 [主页:交易员、跟单人分享<分享人是当前登录人>↗](https://yapi.nbttfc365.com/project/44/interface/api/19483) 的 **返回类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /person/userShare`
 * @更新时间 `2023-11-14 17:02:04`
 */
export interface YapiGetPersonUserShareApiResponse {
  code: string
  message: string
  /**
   * 头像地址
   */
  headPic: string
  /**
   * 名称
   */
  name: string
  /**
   * 标签列表
   */
  tagList: YapiGetPersonUserShareListTagList[]
  /**
   * 收益率
   */
  yield: number
  /**
   * 收益Usdt
   */
  yieldNumber: number
  /**
   * 胜率
   */
  successRate: number
  /**
   * 项目人数
   */
  projectPeople: number
  /**
   * 跟随人数
   */
  idolPeople: number
  /**
   * 分享码
   */
  shareCode: string
}
export interface YapiGetPersonUserShareListTagList {
  /**
   * 标签名称
   */
  name: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [主页:交易员、跟单人分享<分享人是当前登录人>↗](https://yapi.nbttfc365.com/project/44/interface/api/19483)
// **/
// export const getPersonUserShareApiRequest: MarkcoinRequest<
//   YapiGetPersonUserShareApiRequest,
//   YapiGetPersonUserShareApiResponse['data']
// > = params => {
//   return request({
//     path: "/person/userShare",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

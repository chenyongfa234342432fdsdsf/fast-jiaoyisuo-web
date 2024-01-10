/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [主页：用户信息查询↗](https://yapi.nbttfc365.com/project/44/interface/api/19513) 的 **请求类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /person/userInfo`
 * @更新时间 `2023-11-15 10:12:10`
 */
export interface YapiGetPersonUserInfoApiRequest {
  /**
   * 查询用户uid，不传查当前登录人
   */
  uid?: string
}

/**
 * 接口 [主页：用户信息查询↗](https://yapi.nbttfc365.com/project/44/interface/api/19513) 的 **返回类型**
 *
 * @分类 [跟单↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_1112)
 * @请求头 `GET /person/userInfo`
 * @更新时间 `2023-11-15 10:12:10`
 */
export interface YapiGetPersonUserInfoApiResponse {
  code: string
  message: string
  /**
   * 头像
   */
  headPic: string
  /**
   * 昵称
   */
  nickname: string
  /**
   * 入驻天数
   */
  enterDateNumber: number
  /**
   * 简介
   */
  synopsis: string
  /**
   * 标签列表：交易员、C2C商家等
   */
  tagList: YapiGetPersonUserInfoListTagList[]
}
export interface YapiGetPersonUserInfoListTagList {
  /**
   * 标签名称
   */
  name: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [主页：用户信息查询↗](https://yapi.nbttfc365.com/project/44/interface/api/19513)
// **/
// export const getPersonUserInfoApiRequest: MarkcoinRequest<
//   YapiGetPersonUserInfoApiRequest,
//   YapiGetPersonUserInfoApiResponse['data']
// > = params => {
//   return request({
//     path: "/person/userInfo",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

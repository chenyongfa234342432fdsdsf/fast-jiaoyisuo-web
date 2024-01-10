/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询代理加普通一共开通的产品线↗](https://yapi.nbttfc365.com/project/44/interface/api/5479) 的 **请求类型**
 *
 * @分类 [代理商↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_541)
 * @请求头 `GET /v1/agent/invitationCode/queryProductCd`
 * @更新时间 `2023-08-17 15:51:42`
 */
export interface YapiGetV1AgentInvitationCodeQueryProductCdApiRequest {}

/**
 * 接口 [查询代理加普通一共开通的产品线↗](https://yapi.nbttfc365.com/project/44/interface/api/5479) 的 **返回类型**
 *
 * @分类 [代理商↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_541)
 * @请求头 `GET /v1/agent/invitationCode/queryProductCd`
 * @更新时间 `2023-08-17 15:51:42`
 */
export interface YapiGetV1AgentInvitationCodeQueryProductCdApiResponse {
  code?: number
  message?: string
  data?: YapiGetV1AgentInvitationCodeQueryProductCdData
}
export interface YapiGetV1AgentInvitationCodeQueryProductCdData {
  /**
   * 有值就开通了现货
   */
  spot?: string
  /**
   * 有值就开通了合约
   */
  contract?: string
  /**
   * 有值就开通了借币
   */
  borrowCoin?: string
  /**
   * 有值就开通了三元期权
   */
  option?: string
  /**
   * 有值就开通了娱乐区
   */
  recreation?: string
  scaleList: YapiGetV1AgentInvitationCodeQueryProductCdScaleListData
}
export interface YapiGetV1AgentInvitationCodeQueryProductCdScaleListData {
  /**
   * 产品线 1
   */
  productCd: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [查询代理加普通一共开通的产品线↗](https://yapi.nbttfc365.com/project/44/interface/api/5479)
// **/
// export const getV1AgentInvitationCodeQueryProductCdApiRequest: MarkcoinRequest<
//   YapiGetV1AgentInvitationCodeQueryProductCdApiRequest,
//   YapiGetV1AgentInvitationCodeQueryProductCdApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/agent/invitationCode/queryProductCd",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [查询海报文案↗](https://yapi.nbttfc365.com/project/44/interface/api/4652) 的 **请求类型**
 *
 * @分类 [代理商↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_541)
 * @请求头 `GET /v1/agent/invitationCode/getSlogan`
 * @更新时间 `2023-02-20 18:55:33`
 */
export interface YapiGetV1AgentInvitationCodeGetSloganApiRequest {}

/**
 * 接口 [查询海报文案↗](https://yapi.nbttfc365.com/project/44/interface/api/4652) 的 **返回类型**
 *
 * @分类 [代理商↗](https://yapi.nbttfc365.com/project/44/interface/api/cat_541)
 * @请求头 `GET /v1/agent/invitationCode/getSlogan`
 * @更新时间 `2023-02-20 18:55:33`
 */
export interface YapiGetV1AgentInvitationCodeGetSloganApiResponse {
  code?: number
  message?: string
  data?: string
}

// 以下为自动生成的 api 请求，需要使用的话请手动复制到相应模块的 api 请求层
// import request, { MarkcoinRequest } from '@/plugins/request'

// /**
// * [查询海报文案↗](https://yapi.nbttfc365.com/project/44/interface/api/4652)
// **/
// export const getV1AgentInvitationCodeGetSloganApiRequest: MarkcoinRequest<
//   YapiGetV1AgentInvitationCodeGetSloganApiRequest,
//   YapiGetV1AgentInvitationCodeGetSloganApiResponse['data']
// > = params => {
//   return request({
//     path: "/v1/agent/invitationCode/getSlogan",
//     method: "GET",
//     params
//   })
// }

/* prettier-ignore-end */

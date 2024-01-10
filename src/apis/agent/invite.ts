import request, { MarkcoinRequest } from '@/plugins/request'
import {
  YapiPostV1AgentInviteHistoryApiRequestReal,
  YapiPostV1AgentInviteHistoryApiResponseReal,
} from '@/typings/api/agent/invite'
import {
  YapiGetV1AgentInvitationCodeQueryMaxApiRequest,
  YapiGetV1AgentInvitationCodeQueryMaxApiResponse,
} from '@/typings/yapi/AgentInvitationCodeQueryMaxV1GetApi'
import {
  YapiGetV1AgentInvitationCodeQueryProductCdApiRequest,
  YapiGetV1AgentInvitationCodeQueryProductCdApiResponse,
} from '@/typings/yapi/AgentInvitationCodeQueryProductCdV1GetApi'
import {
  YapiPostV1AgentInviteDetailsAnalysisApiRequest,
  YapiPostV1AgentInviteDetailsAnalysisApiResponse,
} from '@/typings/yapi/AgentInviteDetailsAnalysisV1PostApi'
import {
  YapiPostV1AgentInviteDetailsApiRequest,
  YapiPostV1AgentInviteDetailsApiResponse,
} from '@/typings/yapi/AgentInviteDetailsV1PostApi'
import {
  YapiPostV1AgentInviteHistoryApiRequest,
  YapiPostV1AgentInviteHistoryApiResponse,
} from '@/typings/yapi/AgentInviteHistoryV1PostApi'

/**
 * [代理商 - 邀请明细↗](https://yapi.nbttfc365.com/project/44/interface/api/4159)
 * */
export const postV1AgentInviteDetailsApiRequest: MarkcoinRequest<
  YapiPostV1AgentInviteDetailsApiRequest,
  YapiPostV1AgentInviteDetailsApiResponse
> = data => {
  return request({
    path: '/v1/agent/inviteDetails',
    method: 'POST',
    data,
  })
}

/**
 * [代理商 - 邀请明细分析↗](https://yapi.nbttfc365.com/project/44/interface/api/4235)
 * */
export const postV1AgentInviteDetailsAnalysisApiRequest: MarkcoinRequest<
  YapiPostV1AgentInviteDetailsAnalysisApiRequest,
  YapiPostV1AgentInviteDetailsAnalysisApiResponse['data']
> = params => {
  return request({
    path: '/v1/agent/inviteDetailsAnalysis',
    method: 'POST',
    data: params,
  })
}

/**
 * [代理商 - 邀请用户详情↗](https://yapi.nbttfc365.com/project/44/interface/api/4003)
 * */
export const postV1AgentInviteHistoryApiRequest: MarkcoinRequest<
  YapiPostV1AgentInviteHistoryApiRequestReal,
  YapiPostV1AgentInviteHistoryApiResponseReal
> = params => {
  return request({
    path: '/v1/agent/inviteHistory',
    method: 'POST',
    data: params,
  })
}

/**
 * [查询系统最大可设置返佣比例↗](https://yapi.nbttfc365.com/project/44/interface/api/4407)
 * */
export const getV1AgentInvitationCodeQueryMaxApiRequest: MarkcoinRequest<
  YapiGetV1AgentInvitationCodeQueryMaxApiRequest,
  YapiGetV1AgentInvitationCodeQueryMaxApiResponse['data']
> = params => {
  return request({
    path: '/v1/agent/invitationCode/queryMax',
    method: 'GET',
    params,
  })
}

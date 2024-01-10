import request, { MarkcoinRequest } from '@/plugins/request'
import {
  AgentInviteQueryMaxReq,
  AgentInviteQueryMaxResp,
  AgentManageInviteAddReq,
  AgentManageInviteAddResp,
  AgentManageInvitePageListReq,
  AgentManageInvitePageListResp,
  AgentManageInviteQueryReq,
  AgentManageInviteQueryResp,
  AgentManageInviteUpdateReq,
  AgentManageInviteUpdateResp,
  JoinInviteAddReq,
  JoinInviteAddResp,
} from '@/typings/api/agent/manage'

/* ========== 代理商 邀请返佣 ========== */
/**
 * 代理商 - 查询邀请码
 * https://yapi.nbttfc365.com/project/44/interface/api/3943
 */
export const fetchManageInvitequery: MarkcoinRequest<AgentManageInviteQueryReq, AgentManageInviteQueryResp> = () => {
  return request({
    path: `/v1/agent/invitationCode/query`,
    method: 'GET',
  })
}

/* ========== 代理商 管理邀请码 ========== */
/**
 * 代理商 - 管理邀请码查询
 * https://yapi.nbttfc365.com/project/44/interface/api/4283
 */
export const fetchManageInvitePageList: MarkcoinRequest<
  AgentManageInvitePageListReq,
  AgentManageInvitePageListResp
> = options => {
  return request({
    path: `/v1/agent/invitationCode/pageList`,
    method: 'GET',
    params: {
      page: options.page, // 页数
      pageSize: options.pageSize, // 条数
    },
  })
}

/**
 * 代理商 - 管理邀请码添加
 * https://yapi.nbttfc365.com/project/44/interface/api/4287
 */
export const fetchManageInviteAdd: MarkcoinRequest<AgentManageInviteAddReq, AgentManageInviteAddResp> = options => {
  return request({
    path: `/v1/agent/invitationCode/add`,
    method: 'POST',
    data: {
      invitationCodeName: options.invitationCodeName, // 邀请码名称
      spotSelfRate: options.spotSelfRate, // 现货自身
      spotChildRate: options.spotChildRate, // 现货好友
      contractSelfRate: options.contractSelfRate, // 合约自身
      contractChildRate: options.contractChildRate, // 合约好友
      borrowCoinSelfRate: options.borrowCoinSelfRate, // 合约自身
      borrowCoinChildRate: options.borrowCoinChildRate, // 合约好友
      isDefault: options.isDefault, // 是否默认邀请码：1 是 2 否
    },
  })
}

/**
 * 代理商 - 管理邀请码删除
 * https://yapi.nbttfc365.com/project/44/interface/api/4291
 */
export const fetchManageInviteRemove: MarkcoinRequest = options => {
  return request({
    path: `/v1/agent/invitationCode/remove`,
    method: 'POST',
    data: {
      id: options.id, // 邀请码 id
    },
  })
}

/**
 * 代理商 - 管理邀请码修改
 * https://yapi.nbttfc365.com/project/44/interface/api/4299
 */
export const fetchManageInviteUpdate: MarkcoinRequest<
  AgentManageInviteUpdateReq,
  AgentManageInviteUpdateResp
> = options => {
  return request({
    path: `/v1/agent/invitationCode/update`,
    method: 'POST',
    data: {
      invitationCodeName: options.invitationCodeName, // 邀请码名称
      spotSelfRate: options.spotSelfRate, // 现货自身
      spotChildRate: options.spotChildRate, // 现货好友
      contractSelfRate: options.contractSelfRate, // 合约自身
      contractChildRate: options.contractChildRate, // 合约好友
      borrowCoinSelfRate: options.borrowCoinSelfRate, // 合约自身
      borrowCoinChildRate: options.borrowCoinChildRate, // 合约好友
      isDefault: options.isDefault, // 是否默认邀请码：1 是 2 否
      id: options.id, // 邀请码 id
      invitationCode: options.invitationCode, // 邀请码
    },
  })
}

/**
 * 代理商 - 申请
 * https://yapi.nbttfc365.com/project/44/interface/api/4331
 */
export const fetchJoinInviteAdd: MarkcoinRequest<JoinInviteAddReq, JoinInviteAddResp> = options => {
  return request({
    path: `/v2/agtApplication/add`,
    method: 'POST',
    data: {
      contact: options.contact, // 联系类型  1 为手机 2 为邮箱
      contactInformation: options.contactInformation, // 联系方式
      invitationNum: options.invitationNum, // 预计可邀请用户数
      rebates: options.rebates, // 现货 合约 借币 预期比例
      comment: options.comment, // 申请补充说明
      mobileCountryCd: options.mobileCountryCd, // 区号，contact 为 1 时必传
      socialMedia: options.socialMedia, // 社交媒体名称，contact 为 3 时必传
    },
  })
}

/**
 * 代理商 - 代理第一次设置返佣比例
 * https://yapi.nbttfc365.com/project/44/interface/api/4403
 */
export const fetchAgentInviteAddRebates: MarkcoinRequest = options => {
  return request({
    path: `/v1/agent/invitationCode/addRebates`,
    method: 'POST',
    data: {
      scales: options.scales, // object [] 产品线 现货 合约 借币 返佣比例
    },
  })
}

/**
 * 代理商 - 查询系统最大可设置返佣比例
 * https://yapi.nbttfc365.com/project/44/interface/api/4407
 */
export const fetchAgentInviteQueryMax: MarkcoinRequest<AgentInviteQueryMaxReq, AgentInviteQueryMaxResp> = () => {
  return request({
    path: `/v1/agent/invitationCode/queryMax`,
    method: 'GET',
  })
}

/**
 * 代理商 - 查询系统最大可设置返佣比例
 * https://yapi.nbttfc365.com/project/44/interface/api/4407
 */
export const fetchAgentInviteQuerySys: MarkcoinRequest<AgentInviteQueryMaxReq, AgentInviteQueryMaxResp> = () => {
  return request({
    path: `/v1/agent/invitationCode/querySys`,
    method: 'GET',
  })
}

/**
 * 代理商 - 海报比例查询
 * https://yapi.nbttfc365.com/project/44/interface/api/5111
 */
export const fetchAgentInviteQueryRebates: MarkcoinRequest<AgentInviteQueryMaxReq, AgentInviteQueryMaxResp> = () => {
  return request({
    path: `/v1/agent/invitationCode/queryRebates`,
    method: 'GET',
  })
}

/**
 * 代理商 - 周返佣 top
 * https://yapi.nbttfc365.com/project/44/interface/api/4411
 */
export const fetchAgentRebatesHistoryTop: MarkcoinRequest = () => {
  return request({
    path: `/v1/agtRebateInfoHistory/getTop`,
    method: 'GET',
  })
}

/**
 * 代理商 - 代理商申请信息修改
 * https://yapi.nbttfc365.com/project/44/interface/api/4567
 */
export const fetchAgtApplicationUpdate: MarkcoinRequest = options => {
  return request({
    path: `/v1/agtApplication/update`,
    method: 'POST',
    data: {
      id: options.id, // 审批 id
    },
  })
}

import request, { MarkcoinRequest } from '@/plugins/request'
import {
  AgencyCenterGetMethodDefaultReq,
  AgencyCenterOverviewResp,
  AgencyCenterQueryIncomeDetailsReq,
  AgencyCenterQueryIncomeDetailsResp,
  AgencyCenterQueryInviteDetailsReq,
  AgencyCenterQueryInviteDetailsResp,
} from '@/typings/api/agent/agency-center'
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
import {
  YapiGetV1AgentInvitationCodeQueryProductCdApiRequest,
  YapiGetV1AgentInvitationCodeQueryProductCdApiResponse,
} from '@/typings/yapi/AgentInvitationCodeQueryProductCdV1GetApi'

/* ========== 代理商中心 ========== */
/**
 * 代理商 - 总览
 * https://yapi.nbttfc365.com/project/44/interface/api/4251
 */
export const getRebateInfoHistoryOverview: MarkcoinRequest<
  AgencyCenterGetMethodDefaultReq,
  AgencyCenterOverviewResp
> = () => {
  return request({
    path: `/v1/agtRebateInfoHistory/overview`,
    method: 'GET',
  })
}

/**
 * 代理商 - 收益明细分析
 * https://yapi.nbttfc365.com/project/44/interface/api/4243
 */
export const postQueryDetailsAnalysis: MarkcoinRequest = options => {
  return request({
    path: `/v1/agtRebateInfoHistory/queryDetailsAnalysis`,
    method: 'POST',
    data: {
      startTime: options.startTime, // 开始时间
      endTime: options.endTime, // 结束时间
    },
  })
}

/**
 * 代理商 - 收益明细
 * https://yapi.nbttfc365.com/project/44/interface/api/4143
 */
export const postQueryIncomeDetails: MarkcoinRequest<
  AgencyCenterQueryIncomeDetailsReq,
  AgencyCenterQueryIncomeDetailsResp
> = options => {
  return request({
    path: `/v1/agtRebateInfoHistory/queryDetails`,
    method: 'POST',
    data: {
      productCd: options.productCd, // 产品线 字典表 code：agent_product_cd
      startTime: options.startTime, // 开始时间
      endTime: options.endTime, // 结束时间
      minAmount: options.minAmount, // 最小金额
      maxAmount: options.maxAmount, // 最大金额
      page: options.page, // 页
      pageSize: options.pageSize, // 条数
    },
  })
}

/**
 * 代理商 - 邀请明细
 * https://yapi.nbttfc365.com/project/44/interface/api/4159
 */
export const postQueryInviteDetails: MarkcoinRequest<
  AgencyCenterQueryInviteDetailsReq,
  AgencyCenterQueryInviteDetailsResp
> = options => {
  return request({
    path: `/v1/agent/inviteDetails`,
    method: 'POST',
    data: {
      isAgt: options.isAgt, // 邀请类型
      uid: options.uid, // 搜索用户 id
      kycStatus: options.kycStatus, // 实名状态 1 为未认证，不传默认已认证
      minChildNum: options.minChildNum, // 最小伞下人数
      maxChildNum: options.maxChildNum, // 最大伞下人数
      minSpot: options.minSpot, // 最小现货比例
      maxSpot: options.maxSpot, // 最大现货比例
      minContract: options.minContract, // 最小合约比例
      maxContract: options.maxContract, // 最大合约比例
      minBorrow: options.minBorrow, // 最小借币比例
      maxBorrow: options.maxBorrow, // 最大借币比例
      registerStartTime: options.registerStartTime, // 注册开始时间
      registerEndTime: options.registerEndTime, // 注册结束时间
      registerSort: options.registerSort, // 注册时间排序 1 正序 2 倒序
      childNumSort: options.childNumSort, // 伞下人数排序 1 正序 2 倒序
      page: options.page, // 页
      pageSize: options.pageSize, // 条数
    },
  })
}

/**
 * 代理商 - 邀请用户详情
 * https://yapi.nbttfc365.com/project/44/interface/api/4003
 */
export const postQueryInviteHistory: MarkcoinRequest = options => {
  return request({
    path: `/v1/agent/inviteHistory`,
    method: 'POST',
    data: {
      targetUid: options.targetUid, // 查看指定的 UID
      levelLimit: options.levelLimit, // 展示层级限制，默认不限制 如需要只看我的下级，此处应传 1
      puid: options.puid, // 上级 id
      spotMin: options.spotMin, // 最小现货手续费总值
      spotMax: options.spotMax, // 最大现货手续费总值
      contractMin: options.contractMin, // 最小合约手续费总值
      contractMax: options.contractMax, // 最大合约手续费总值
      borrowCoinMin: options.borrowCoinMin, // 最小借币利息总值
      borrowCoinMax: options.borrowCoinMax, // 最大借币利息总值
    },
  })
}

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
 * [查询代理加普通一共开通的产品线↗](https://yapi.nbttfc365.com/project/44/interface/api/5479)
 * */
export const getV1AgentInvitationCodeQueryProductCdApiRequest: MarkcoinRequest<
  YapiGetV1AgentInvitationCodeQueryProductCdApiRequest,
  YapiGetV1AgentInvitationCodeQueryProductCdApiResponse['data']
> = params => {
  return request({
    path: '/v1/agent/invitationCode/queryProductCd',
    method: 'GET',
    params,
  })
}

import request, { MarkcoinRequest } from '@/plugins/request'
import {
  InfoHistoryOverviewReq,
  AgencyCenterGetMethodDefaultReq,
  AgencyCenterOverviewResp,
  AgencyCenterQueryIncomeDetailsReq,
  AgencyCenterQueryIncomeDetailsResp,
  AgencyCenterQueryInviteDetailsReq,
  AgencyCenterQueryInviteDetailsResp,
  AgencyCenterInvitationCodeQueryProductCdResp,
} from '@/typings/api/agent/agency-center'
import { YapiGetV1AgentGetUrlApiRequest, YapiGetV1AgentGetUrlApiResponse } from '@/typings/yapi/AgentGetUrlV1GetApi'

/* ========== 代理商中心 ========== */
/**
 * 代理商 - 总览
 * https://yapi.nbttfc365.com/project/44/interface/api/4251
 */
export const getRebateInfoHistoryOverview: MarkcoinRequest<
  InfoHistoryOverviewReq,
  AgencyCenterOverviewResp
> = options => {
  return request({
    path: `/v1/agtRebateInfoHistory/overview`,
    method: 'GET',
    params: {
      startDate: options.startDate,
      endDate: options.endDate,
    },
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

/**
 * 代理商 - 获取邀请用户详情导出地址
 * https://yapi.nbttfc365.com/project/44/interface/api/4343
 */
export const getInviteHistoryExcelUrl: MarkcoinRequest<AgencyCenterGetMethodDefaultReq, string> = () => {
  return request({
    path: `/v1/agent/inviteHistory/getUrl`,
    method: 'GET',
  })
}

/**
 * 代理商 - 收益明细导出地址
 * https://yapi.nbttfc365.com/project/44/interface/api/4383
 */
export const getIncomeHistoryExcelUrl: MarkcoinRequest<AgencyCenterGetMethodDefaultReq, string> = () => {
  return request({
    path: `/v1/agtRebateInfoHistory/queryDetails/getUrl`,
    method: 'GET',
  })
}

/**
 * [代理商 - 获取邀请用户详情导出地址↗](https://yapi.nbttfc365.com/project/44/interface/api/4661)
 * */
export const getV1AgentGetUrlApiRequest: MarkcoinRequest<
  YapiGetV1AgentGetUrlApiRequest,
  YapiGetV1AgentGetUrlApiResponse['data']
> = params => {
  return request({
    path: '/v1/agent/getUrl',
    method: 'GET',
    params,
  })
}

/**
 * 查询代理加普通一共开通的产品线 https://yapi.nbttfc365.com/project/44/interface/api/5479
 * */
export const getInvitationCodeQueryProductCd: MarkcoinRequest<
  AgencyCenterGetMethodDefaultReq,
  AgencyCenterInvitationCodeQueryProductCdResp
> = () => {
  return request({
    path: '/v1/agent/invitationCode/queryProductCd',
    method: 'GET',
  })
}

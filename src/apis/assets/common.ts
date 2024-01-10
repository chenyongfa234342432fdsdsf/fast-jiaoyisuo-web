/**
 * 资产公共 api 接口
 */
import request, { MarkcoinRequest } from '@/plugins/request'
import {
  AssetsOverviewReq,
  AssetsOverviewResp,
  AssetsCoinRateReq,
  AssetsCoinRateResp,
  AssetsTradeListReq,
  AssetsTradeListResp,
  AssetsNickNameReq,
  AssetsNickNameResp,
  AssetsSettingCoinPushReq,
  AssetsSettingCoinPushResp,
  AssetsCoinPushStatusReq,
  AssetsCoinPushStatusResp,
  WithdrawsFeeListReq,
  WithdrawsFeeListResp,
} from '@/typings/api/assets/assets'

/**
 * 获取资产总览
 * yapi: https://yapi.admin-devops.com/project/44/interface/api/389
 * TODO: 接口未返回昨日盈亏，后端这期先不做盈亏 - 前端先写假数据
 */
export const getOverviewAsset: MarkcoinRequest<AssetsOverviewReq, AssetsOverviewResp> = params => {
  return request({
    path: `/v1/asset/overview`,
    method: 'GET',
    params,
  })
}

/**
 * 币种汇率
 * yapi: https://yapi.admin-devops.com/project/44/interface/api/2600
 * TODO: 这期先走 http，后续要走 ws 实时推送
 */
export const getCoinRate: MarkcoinRequest<AssetsCoinRateReq, AssetsCoinRateResp> = params => {
  return request({
    path: `/v1/pay/coin/rate`,
    method: 'GET',
    params,
  })
}

/**
 * 行情 - 搜索交易对 (币对模糊查询，交易币搜索)
 * yapi: https://yapi.admin-devops.com/project/44/interface/api/2846
 */
export const getTradeList: MarkcoinRequest<AssetsTradeListReq, AssetsTradeListResp> = params => {
  return request({
    path: `/v1/tradePair/search`,
    method: 'GET',
    params,
  })
}

/**
 * 个人中心 - 通过 uid 查询昵称
 * yapi: https://yapi.admin-devops.com/project/44/interface/api/2858
 */
export const getNickName: MarkcoinRequest<AssetsNickNameReq, AssetsNickNameResp> = params => {
  return request({
    path: `/v1/member/base/info/nickName`,
    method: 'GET',
    params,
  })
}

/**
 * 资产 - 设置币种充提通知
 * yapi: https://yapi.admin-devops.com/project/44/interface/api/2870
 */
export const postSettingCoinPush: MarkcoinRequest<AssetsSettingCoinPushReq, AssetsSettingCoinPushResp> = data => {
  return request({
    path: `/v1/coin/settingCoinPush`,
    method: 'POST',
    data,
  })
}

/**
 * 资产 - 获取币种开启充提推送状态
 * yapi: https://yapi.admin-devops.com/project/44/interface/api/2903
 */
export const getCoinPushStatus: MarkcoinRequest<AssetsCoinPushStatusReq, AssetsCoinPushStatusResp> = params => {
  return request({
    path: `/v1/coin/getCoinPushStatus`,
    method: 'GET',
    params,
  })
}

/**
 * 手续费 - 费率标准 - 提现手续费
 */
export const getWithdrawsFeeList: MarkcoinRequest<WithdrawsFeeListReq, WithdrawsFeeListResp[]> = params => {
  return request({
    path: `/v1/asset/withdraw/getWithdraws`,
    method: 'GET',
    params,
  })
}

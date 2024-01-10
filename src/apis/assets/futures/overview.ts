import request, { MarkcoinRequest } from '@/plugins/request'
import {
  FuturesAssetsReq,
  FuturesAssetsResp,
  FuturesDetailMarginListReq,
  FuturesDetailMarginListResp,
  FuturesDetailPositionFlashAllReq,
  FuturesDetailPositionFlashAllResp,
  FuturesDetailPositionListReq,
  FuturesDetailRechargeCoinListReq,
  FuturesDetailRechargeCoinListResp,
  FuturesDetailRechargeMarginReq,
  FuturesDetailRechargeMarginResp,
  FuturesDetailWithdrawCoinListReq,
  FuturesDetailWithdrawCoinListResp,
  FuturesDetailWithdrawMarginReq,
  FuturesDetailWithdrawMarginResp,
  FuturesGroupDetailReq,
  FuturesGroupDetailResp,
  FuturesListReq,
  FuturesListResp,
  FuturesGroupCancelOrderReq,
  FuturesGroupCancelOrderResp,
  FuturesGroupMergeReq,
  FuturesGroupMergeResp,
  FuturesDetailMarginScaleListReq,
  FuturesDetailMarginScaleListResp,
  FuturesDetailIsLiquidateReq,
  FuturesDetailIsLiquidateResp,
  FuturesAssetsListReq,
  FuturesAssetsListResp,
  FuturesDetailMarginScaleDetailReq,
  FuturesDetailMarginScaleDetailResp,
} from '@/typings/api/assets/futures'
import { IPositionListRep, IPositionListResp, IPositionListData } from '@/typings/api/assets/futures/position'

/**
 * 获取合约资产
 * @returns
 */
export const getAssetsFuturesOverview: MarkcoinRequest<FuturesAssetsReq, FuturesAssetsResp> = () => {
  return request({
    path: `/v1/perpetual/group/assets`,
    method: 'GET',
  })
}

/**
 * 获取资产合约组列表
 */
export const getAssetsFuturesList: MarkcoinRequest<FuturesListReq, FuturesListResp> = () => {
  return request({
    path: `/v1/perpetual/group/list`,
    method: 'GET',
  })
}

/**
 * 获取合约组详情
 */
export const getFuturesGroupDetail: MarkcoinRequest<FuturesGroupDetailReq, FuturesGroupDetailResp> = params => {
  return request({
    path: `/v1/perpetual/group/detail`,
    method: 'GET',
    params,
  })
}

/**
 * 合约组详情 - 获取合约组保证金列表
 */
export const getPerpetualGroupMarginList: MarkcoinRequest<
  FuturesDetailMarginListReq,
  FuturesDetailMarginListResp
> = params => {
  return request({
    path: `/v1/perpetual/group/margin/list`,
    method: 'GET',
    params,
  })
}

/**
 * 合约组详情 - 获取合约组保证金提取币种列表
 */
export const getPerpetualGroupCoinList: MarkcoinRequest<
  FuturesDetailWithdrawCoinListReq,
  FuturesDetailWithdrawCoinListResp
> = params => {
  return request({
    path: `/v1/perpetual/group/coinInfo`,
    method: 'GET',
    params,
  })
}

/**
 * 合约组详情 - 获取合约组详情保证金充值币种列表
 */
export const getPerpetualGroupRechargeCoinList: MarkcoinRequest<
  FuturesDetailRechargeCoinListReq,
  FuturesDetailRechargeCoinListResp
> = params => {
  return request({
    path: `/v1/perpetual/group/assetsCoinInfo`,
    method: 'GET',
    params,
  })
}

/**
 * 合约组详情 - 合约组保证金提取
 */
export const postPerpetualGroupWithdrawMargin: MarkcoinRequest<
  FuturesDetailWithdrawMarginReq,
  FuturesDetailWithdrawMarginResp
> = data => {
  return request({
    path: `/v1/perpetual/group/coin/submit`,
    method: 'POST',
    data,
  })
}

/**
 * 合约组详情 - 合约组保证金充值
 */
export const postPerpetualGroupRechargeMargin: MarkcoinRequest<
  FuturesDetailRechargeMarginReq,
  FuturesDetailRechargeMarginResp
> = data => {
  return request({
    path: `/v1/perpetual/group/margin/deposit`,
    method: 'POST',
    data,
  })
}

/**
 * 合约组详情 - 持仓详情列表
 */
export const postPerpetualGroupPositionList: MarkcoinRequest<
  FuturesDetailPositionListReq,
  IPositionListResp
> = params => {
  return request({
    path: `/v1/perpetual/group/position`,
    method: 'GET',
    params,
  })
}

/**
 * 合约组详情 - 闪电平仓
 */
export const postPerpetualGroupPositionFlashAll: MarkcoinRequest<
  FuturesDetailPositionFlashAllReq,
  FuturesDetailPositionFlashAllResp
> = data => {
  return request({
    path: `/v1/perpetual/orders/position/flashAll`,
    method: 'POST',
    data,
  })
}

/**
 * 资产 - 合约组 - 撤销合约组所有委托
 */
export const postPerpetualGroupCancelOrder: MarkcoinRequest<
  FuturesGroupCancelOrderReq,
  FuturesGroupCancelOrderResp
> = data => {
  return request({
    path: `/v1/perpetual/group/cancelOrder`,
    method: 'POST',
    data,
  })
}

/**
 * 资产 - 合约组 - 一键合并
 */
export const postPerpetualGroupMerge: MarkcoinRequest<FuturesGroupMergeReq, FuturesGroupMergeResp> = data => {
  return request({
    path: `/v1/perpetual/group/merge`,
    method: 'POST',
    data,
  })
}

/**
 * 资产 - 合约组详情保证金折算率列表
 */
export const postPerpetualAssetsMarginScale: MarkcoinRequest<
  FuturesDetailMarginScaleListReq,
  FuturesDetailMarginScaleListResp
> = params => {
  return request({
    path: `/v1/perpetual/assets/marginScale`,
    method: 'GET',
    params,
  })
}

/**
 * 合约组详情 - 闪电平仓 - 合约组是否强平中
 */
export const getPerpetualGroupIsLiquidate: MarkcoinRequest<
  FuturesDetailIsLiquidateReq,
  FuturesDetailIsLiquidateResp
> = params => {
  return request({
    path: `/v1/perpetual/group/isLiquidate`,
    method: 'GET',
    params,
  })
}

/**
 * 资产 - 获取合约保证金资产列表
 */
export const getAssetsFuturesAssetsList: MarkcoinRequest<FuturesAssetsListReq, FuturesAssetsListResp> = () => {
  return request({
    path: `/v1/perpetual/assets/list`,
    method: 'GET',
  })
}

/**
 * 合约组详情 - 逐仓总价值
 */
export const postPerpetualTotalMarginDetail: MarkcoinRequest<
  FuturesDetailMarginScaleDetailReq,
  FuturesDetailMarginScaleDetailResp
> = params => {
  return request({
    path: `/v1/perpetual/group/totalValue/detail`,
    method: 'GET',
    params,
  })
}

/**
 * 合约组详情 - 可用保证金
 */
export const postPerpetualAvailableMarginDetail: MarkcoinRequest<
  FuturesDetailMarginScaleDetailReq,
  FuturesDetailMarginScaleDetailResp
> = params => {
  return request({
    path: `/v1/perpetual/group/availableMargin/detail`,
    method: 'GET',
    params,
  })
}

/**
 * 合约组详情 - 仓位占用保证金
 */
export const postPerpetualOccupyMarginDetail: MarkcoinRequest<
  FuturesDetailMarginScaleDetailReq,
  FuturesDetailMarginScaleDetailResp
> = params => {
  return request({
    path: `/v1/perpetual/group/occupyMargin/detail`,
    method: 'GET',
    params,
  })
}

/**
 * 合约组详情 - 合约组开仓冻结保证金详情
 */
export const postPerpetualLockMarginDetail: MarkcoinRequest<
  FuturesDetailMarginScaleDetailReq,
  FuturesDetailMarginScaleDetailResp
> = params => {
  return request({
    path: `/v1/perpetual/group/lockMargin/detail`,
    method: 'GET',
    params,
  })
}

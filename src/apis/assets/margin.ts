/**
 * 杠杠资产相关 api 接口
 */
import request, { MarkcoinRequest } from '@/plugins/request'
import { ICrossPairAssetsReq, IMarginIsolatedPairResp } from '@/typings/api/assets/margin'
import { IBaseReq } from '@/typings/api/assets/main'

/**
 * 获取全仓杠杆资产信息 - 币对
 * @returns
 */
export const getMarginCrossPairAssets: MarkcoinRequest<ICrossPairAssetsReq> = params => {
  return request({
    path: `/margin/cross/pairAssets`,
    method: 'GET',
    params,
  })
}

/**
 * 获取逐仓杠杆资产信息 - 币对
 * @returns
 */
export const getMarginIsolatedPairAssets: MarkcoinRequest<ICrossPairAssetsReq> = params => {
  return request({
    path: `/margin/isolated/pairAssets`,
    method: 'GET',
    params,
  })
}

/**
 * 获取全仓杠杆资产信息
 * @returns
 */
export const getMarginCrossAssets: MarkcoinRequest<IBaseReq> = params => {
  return request({
    path: `/margin/cross/account`,
    method: 'GET',
    params,
  })
}

/**
 * 获取逐仓杠杆资产信息
 * @returns
 */
export const getMarginIsolatedAssets: MarkcoinRequest<IBaseReq> = params => {
  return request({
    path: `/margin/isolated/account`,
    method: 'GET',
    params,
  })
}

/**
 * 获取杠杠数据 - 借贷利率和全仓限额
 * @returns
 */
export const getMarginCrossCoin: MarkcoinRequest<IBaseReq> = params => {
  return request({
    path: `/margin/cross/coin`,
    method: 'GET',
    params,
  })
}

/**
 * 获取杠杠数据 - 逐仓档位信息
 * @returns
 */
export const getMarginIsolatedLadder: MarkcoinRequest<ICrossPairAssetsReq> = params => {
  return request({
    path: `/margin/isolated/ladder`,
    method: 'GET',
    params,
  })
}

/**
 * 获取杠杠数据 - 逐仓交易对
 * @returns
 */
export const getMarginIsolatedPair: MarkcoinRequest<IBaseReq, IMarginIsolatedPairResp[]> = params => {
  return request({
    path: `/margin/isolated/pair`,
    method: 'GET',
    params,
  })
}

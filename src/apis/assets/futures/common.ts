import request, { MarkcoinRequest } from '@/plugins/request'
import {
  GroupExistEntrustOrderReq,
  GroupExistEntrustOrderResp,
  AssetsCurrencySettingsReq,
  AssetsCurrencySettingsResp,
  AssetsMarginSettingsReq,
  AssetsMarginSettingsResp,
  PerpetualGroupModifyNameReq,
  PerpetualGroupModifyNameResp,
  IFuturesSpotTransferResp,
  ITransferAccountListReq,
  ITransferAccountListResp,
  IFuturesSpotTransferReq,
} from '@/typings/api/assets/futures'
import {
  ITradePairDetailDataReq,
  ITradePairDetailData,
  IPositionCheckExistReq,
  IPositionCheckExistResp,
} from '@/typings/api/assets/futures/position'
/**
 * 是否存在委托订单
 */
export const postGroupExistEntrustOrder: MarkcoinRequest<
  GroupExistEntrustOrderReq,
  GroupExistEntrustOrderResp
> = data => {
  return request({
    path: `/v1/perpetual/group/existEntrustOrder`,
    method: 'POST',
    data,
  })
}

/**
 * [合约币对详情↗](https://yapi.nbttfc365.com/project/44/interface/api/4047)
 * */
export const getTradePairDetailApi: MarkcoinRequest<ITradePairDetailDataReq, ITradePairDetailData> = params => {
  return request({
    path: '/v1/perpetual/tradePair/detail',
    method: 'GET',
    params,
  })
}

/**
 * [仓位是否存在↗](https://yapi.nbttfc365.com/project/44/interface/api/4323)
 * */
export const postPositionCheckExist: MarkcoinRequest<IPositionCheckExistReq, IPositionCheckExistResp> = data => {
  return request({
    path: '/v1/perpetual/position/checkExist',
    method: 'POST',
    data,
  })
}

/**
 * 资产 - 获取商户法币配置
 */
export const getCurrencySettings: MarkcoinRequest<AssetsCurrencySettingsReq, AssetsCurrencySettingsResp> = params => {
  return request({
    path: `/v1/perpetual/mer/currency/settings`,
    method: 'GET',
    params,
  })
}

/**
 * 资产 - 获取商户保证金币种配置
 */
export const getPerpetualMarginSettings: MarkcoinRequest<
  AssetsMarginSettingsReq,
  AssetsMarginSettingsResp
> = params => {
  return request({
    path: `/v1/perpetual/mer/asset/margin/settings`,
    method: 'GET',
    params,
  })
}

/**
 * 合约 - 修改逐仓名称
 */
export const postPerpetualGroupModifyName: MarkcoinRequest<
  PerpetualGroupModifyNameReq,
  PerpetualGroupModifyNameResp
> = data => {
  return request({
    path: `/v1/perpetual/group/modifyName`,
    method: 'POST',
    data,
  })
}

/**
 * 划转 - 合约资金 (https://yapi.nbttfc365.com/project/44/interface/api/5634)
 */
export const postFuturesSpotTransfer: MarkcoinRequest<IFuturesSpotTransferReq, IFuturesSpotTransferResp> = data => {
  return request({
    path: '/v1/perpetual/assets/transfer',
    method: 'POST',
    data,
  })
}

/**
 * 划转 - 划转账户选择 (https://yapi.nbttfc365.com/project/44/interface/api/5819)
 */
export const getTransferAccount: MarkcoinRequest<ITransferAccountListReq, ITransferAccountListResp> = params => {
  return request({
    path: '/v1/perpetual/assets/transfer/account',
    method: 'GET',
    params,
  })
}

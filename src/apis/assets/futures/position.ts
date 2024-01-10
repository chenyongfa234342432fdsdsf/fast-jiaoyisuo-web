import request, { MarkcoinRequest } from '@/plugins/request'
import {
  YapiGetV1PerpetualAssetsQueryAssetApiRequest as IQueryFuturesAssetReq,
  YapiGetV1PerpetualAssetsQueryAssetApiResponse as IQueryFuturesAssetResp,
} from '@/typings/yapi/PerpetualAssetsQueryAssetV1GetApi'
import {
  IPerpetualPositionExistEntrustOrderReq,
  IPerpetualPositionExistEntrustOrderResp,
  IPerpetualPositionMigrateSizeReq,
  IPerpetualPositionMigrateSizeResp,
  IPerpetualPositionMigrateMarginReq,
  IPerpetualPositionMigrateMarginResp,
  IPerpetualPositionCheckMergeReq,
  IPerpetualPositionCheckMergeResp,
  IPerpetualPositionMigrateReq,
  IPerpetualPositionMigrateResp,
  IPerpetualPositionCheckMigrateMarginReq,
  IPerpetualPositionCheckMigrateMarginResp,
  IPerpetualOrdersPlaceReq,
  IPerpetualOrdersPlaceResp,
  IPerpetualPositionCheckMinSizeReq,
  IPerpetualPositionCheckMinSizeResp,
  IPositionCancelOrderReq,
  IPositionCancelOrderResp,
  IPositionListRep,
  IPositionListResp,
  FuturesPositionLeverCheckMaxSizeReq,
  FuturesPositionLeverCheckMaxSizeResp,
} from '@/typings/api/assets/futures/position'
import {
  PositionCheckLockReq,
  PositionCheckLockResp,
  FuturesLockPositionSettingReq,
  FuturesLockPositionSettingResp,
  PositionLockFeeReq,
  PositionLockFeeResp,
  PositionLockReq,
  PositionLockResp,
  FuturesPositionSymbolSizeReq,
  FuturesPositionSymbolSizeResp,
  FuturesPositionReverseInfoReq,
  FuturesPositionReverseInfoResp,
  FuturesPositionMaxSizeLimitReq,
  FuturesPositionMaxSizeLimitResp,
  FuturesPositionStrategyDetailsReq,
  FuturesPositionStrategyDetailsResp,
  FuturesPositionStrategyCancelReq,
  FuturesPositionStrategyCancelResp,
  FuturesPositionStrategyCancelAllReq,
  FuturesPositionStrategyCancelAllResp,
  StrategyPlaceReq,
  StrategyPlaceResp,
  FuturesGroupPurchasingPowerReq,
  FuturesGroupPurchasingPowerResp,
  ModifyPositionLeverReq,
  ModifyPositionLeverResp,
} from '@/typings/api/assets/futures'

/**
 * [获取现货资产购买力↗](https://yapi.nbttfc365.com/project/44/interface/api/4247)
 * */
export const getV1PerpetualAssetsQueryAssetApiRequest: MarkcoinRequest<
  IQueryFuturesAssetReq,
  IQueryFuturesAssetResp['data']
> = params => {
  return request({
    path: '/v1/perpetual/assets/queryAsset',
    method: 'GET',
    params,
  })
}

/**
 * [当前持仓↗](https://yapi.nbttfc365.com/project/44/interface/api/3939)
 * */
export const getV1PerpetualPositionCurrentApiRequest: MarkcoinRequest<IPositionListRep, IPositionListResp> = params => {
  return request({
    path: '/v1/perpetual/position/current',
    method: 'GET',
    params,
  })
}

/**
 * 平仓、一键反向（新建普通委托单）
 * yapi: https://yapi.nbttfc365.com/project/44/interface/api/3639
 * [新建普通委托单↗](https://yapi.nbttfc365.com/project/44/interface/api/3639)
 * */
export const postPerpetualOrdersPlace: MarkcoinRequest<IPerpetualOrdersPlaceReq, IPerpetualOrdersPlaceResp> = data => {
  return request({
    path: '/v1/perpetual/orders/place',
    method: 'POST',
    data,
  })
}

/**
 * [是否存在委托订单↗](https://yapi.nbttfc365.com/project/44/interface/api/3975)
 * */
export const postPerpetualPositionExistEntrustOrder: MarkcoinRequest<
  IPerpetualPositionExistEntrustOrderReq,
  IPerpetualPositionExistEntrustOrderResp
> = data => {
  return request({
    path: '/v1/perpetual/position/existEntrustOrder',
    method: 'POST',
    data,
  })
}
/**
 * [仓位迁移--获取能迁移的数量↗](https://yapi.nbttfc365.com/project/44/interface/api/3955)
 * */
export const postV1PerpetualPositionMigrateSizeApiRequest: MarkcoinRequest<
  IPerpetualPositionMigrateSizeReq,
  IPerpetualPositionMigrateSizeResp
> = data => {
  return request({
    path: '/v1/perpetual/position/migrateSize',
    method: 'POST',
    data,
  })
}

/**
 * [仓位迁移--获取能迁移的保证金↗](https://yapi.nbttfc365.com/project/44/interface/api/3959)
 * */
export const postV1PerpetualPositionMigrateMarginApiRequest: MarkcoinRequest<
  IPerpetualPositionMigrateMarginReq,
  IPerpetualPositionMigrateMarginResp
> = data => {
  return request({
    path: '/v1/perpetual/position/migrateMargin',
    method: 'POST',
    data,
  })
}

/**
 * [仓位迁移--检查最小持仓数量↗](https://yapi.nbttfc365.com/project/44/interface/api/3963)
 * */
export const postV1PerpetualPositionCheckMinSizeApiRequest: MarkcoinRequest<
  IPerpetualPositionCheckMinSizeReq,
  IPerpetualPositionCheckMinSizeResp
> = data => {
  return request({
    path: '/v1/perpetual/position/checkMinSize',
    method: 'POST',
    data,
  })
}

/**
 * [仓位迁移--检查是否有可合并的仓位↗](https://yapi.nbttfc365.com/project/44/interface/api/3967)
 * */
export const postV1PerpetualPositionCheckMergeApiRequest: MarkcoinRequest<
  IPerpetualPositionCheckMergeReq,
  IPerpetualPositionCheckMergeResp
> = data => {
  return request({
    path: '/v1/perpetual/position/checkMerge',
    method: 'POST',
    data,
  })
}

/**
 * [仓位迁移↗](https://yapi.nbttfc365.com/project/44/interface/api/3859)
 * */
export const postV1PerpetualPositionMigrateApiRequest: MarkcoinRequest<
  IPerpetualPositionMigrateReq,
  IPerpetualPositionMigrateResp
> = data => {
  return request({
    path: '/v1/perpetual/position/migrate',
    method: 'POST',
    data,
  })
}

/**
 * [仓位迁移--检查迁移的保证金↗](https://yapi.nbttfc365.com/project/44/interface/api/4359)
 * */
export const postV1PerpetualPositionCheckMigrateMarginApiRequest: MarkcoinRequest<
  IPerpetualPositionCheckMigrateMarginReq,
  IPerpetualPositionCheckMigrateMarginResp
> = data => {
  return request({
    path: '/v1/perpetual/position/checkMigrateMargin',
    method: 'POST',
    data,
  })
}

/**
 * 交易-一键锁仓-获取锁仓时间周期/费率等设置
 */
export const getPerpetualLockPositionSetting: MarkcoinRequest<
  FuturesLockPositionSettingReq,
  FuturesLockPositionSettingResp
> = params => {
  return request({
    path: `/v1/perpetual/lockPosition/setting`,
    method: 'GET',
    params,
  })
}

/**
 * 交易 - 一键锁仓 - 计算锁仓费用等信息
 */
export const postPerpetualPositionLockFee: MarkcoinRequest<PositionLockFeeReq, PositionLockFeeResp> = data => {
  return request({
    path: `/v1/perpetual/position/lockFee`,
    method: 'POST',
    data,
  })
}

/**
 * 交易 - 一键锁仓 - 检查能否锁仓 [锁仓--检查能否锁仓↗](https://yapi.nbttfc365.com/project/44/interface/api/3971)
 */
export const postPerpetualPositionCheckLock: MarkcoinRequest<PositionCheckLockReq, PositionCheckLockResp> = data => {
  return request({
    path: `/v1/perpetual/position/checkLock`,
    method: 'POST',
    data,
  })
}

/**
 * 合约 - 一键锁仓 (https://yapi.nbttfc365.com/project/44/interface/api/3863)
 */
export const postPerpetualPositionLock: MarkcoinRequest<PositionLockReq, PositionLockResp> = data => {
  return request({
    path: `/v1/perpetual/position/lock`,
    method: 'POST',
    data,
  })
}

/**
 * 交易 - 撤销仓位所有委托订单
 */
export const postPerpetualPositionCancelEntrustOrder: MarkcoinRequest<
  IPositionCancelOrderReq,
  IPositionCancelOrderResp
> = data => {
  return request({
    path: `/v1/perpetual/position/cancelEntrustOrder`,
    method: 'POST',
    data,
  })
}

/**
 * 交易 - 一键反向 - 获取币对持仓数量
 */
export const getPerpetualPositionSymbolSize: MarkcoinRequest<
  FuturesPositionSymbolSizeReq,
  FuturesPositionSymbolSizeResp
> = params => {
  return request({
    path: `/v1/perpetual/position/symbol/querySize`,
    method: 'GET',
    params,
  })
}

/**
 * 交易 - 一键反向 - 获取反向开仓信息
 */
export const getPerpetualPositionReverseInfo: MarkcoinRequest<
  FuturesPositionReverseInfoReq,
  FuturesPositionReverseInfoResp
> = params => {
  return request({
    path: `/v1/perpetual/position/reverseInfo`,
    method: 'GET',
    params,
  })
}

/**
 * 交易 - 一键反向 - 获取币对最大可开仓数量
 */
export const getPerpetualPositionMaxSizeLimit: MarkcoinRequest<
  FuturesPositionMaxSizeLimitReq,
  FuturesPositionMaxSizeLimitResp
> = params => {
  return request({
    path: `/v1/perpetual/position/maxSizeLimit`,
    method: 'GET',
    params,
  })
}

/**
 * 交易-止盈止损-新增止盈止损/仓位止盈止损
 */
export const postPerpetualStrategyPlace: MarkcoinRequest<StrategyPlaceReq, StrategyPlaceResp> = data => {
  return request({
    path: `/v1/perpetual/strategy/place`,
    method: 'POST',
    data,
  })
}

/**
 * 交易 - 止盈止损 - 查询仓位止盈止损详情
 */
export const getPerpetualPositionStrategyDetails: MarkcoinRequest<
  FuturesPositionStrategyDetailsReq,
  FuturesPositionStrategyDetailsResp
> = params => {
  return request({
    path: `/v1/perpetual/position/${params.id}/strategy/details`,
    method: 'GET',
  })
}

/**
 * 交易 - 止盈止损 - 取消仓位止盈止损
 */
export const deletePerpetualStrategy: MarkcoinRequest<
  FuturesPositionStrategyCancelReq,
  FuturesPositionStrategyCancelResp
> = data => {
  return request({
    path: `/v1/perpetual/strategy/cancel`,
    method: 'POST',
    data,
  })
}

/**
 * 交易 - 止盈止损 - 撤销全部仓位止盈止损
 */
export const deletePerpetualStrategyAll: MarkcoinRequest<
  FuturesPositionStrategyCancelAllReq,
  FuturesPositionStrategyCancelAllResp
> = data => {
  return request({
    path: `/v1/perpetual/strategy/cancelAll`,
    method: 'POST',
    data,
  })
}

/**
 * 交易 - 平仓 - 合约组额外保证金
 */
export const getGroupPurchasingPower: MarkcoinRequest<
  FuturesGroupPurchasingPowerReq,
  FuturesGroupPurchasingPowerResp
> = params => {
  return request({
    path: `/v1/perpetual/group/queryGroupPurchasingPower`,
    method: 'GET',
    params,
  })
}

/**
 * 合约 - 调整持仓杠杆 (https://yapi.nbttfc365.com/project/44/interface/api/5674)
 */
export const postModifyPositionLever: MarkcoinRequest<ModifyPositionLeverReq, ModifyPositionLeverResp> = data => {
  return request({
    path: `/v1/perpetual/position/modifyLever`,
    method: 'POST',
    data,
  })
}

/**
 * 交易 - 调整持仓杠杆 - 修改仓位杠杆倍数检查最大持仓量
 */
export const postPerpetualLeverCheckMaxSize: MarkcoinRequest<
  FuturesPositionLeverCheckMaxSizeReq,
  FuturesPositionLeverCheckMaxSizeResp
> = data => {
  return request({
    path: `/v1/perpetual/position/modifyLever/checkMaxSize`,
    method: 'POST',
    data,
  })
}

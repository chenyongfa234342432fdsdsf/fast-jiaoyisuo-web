import request, { MarkcoinRequest } from '@/plugins/request'
import {
  IFutureListReq,
  IFutureListResp,
  IPerpetualFutureListResp,
  IUpdateFutureConfigReq,
} from '@/typings/api/future/common'

import {
  YapiPostV1PerpetualGroupCreateApiRequest,
  YapiPostV1PerpetualGroupCreateData,
} from '@/typings/yapi/PerpetualGroupCreateV1PostApi.d'

import {
  YapiGetV1PerpetualGroupListApiRequest,
  YapiGetV1PerpetualGroupData,
} from '@/typings/yapi/PerpetualGroupListV1GetApi.d'

/**
 * 获取合约列表
 * https://yapi.coin-online.cc/project/44/interface/api/461
 */
export const queryFutureList: MarkcoinRequest<IFutureListReq, IFutureListResp> = () => {
  return request({
    path: `/perpetual-market-rest/v1/contract/list`,
    method: 'GET',
    params: {
      pageSize: 400,
    },
  })
}
/**
 * 更新合约配置
 * TODO: 地址待定
 */
export const updatePositionConfigs: MarkcoinRequest<IUpdateFutureConfigReq> = data => {
  return request({
    path: `v2/perpetual/position/${data.contractCode}/setting`,
    method: 'POST',
    contentType: 1,
    data,
  })
}

/**
 * 获取合约最新交易数据
 */
export const getFutureMarketTrades: MarkcoinRequest<{
  limit: number
  symbol: string
}> = params => {
  return request({
    path: `/perpetual-market-rest/v1/market/trades`,
    method: 'GET',
    params,
  })
}

/**
 * 获取合约最新交易数据
 */
export const getFuturePerpetualList: MarkcoinRequest<
  YapiGetV1PerpetualGroupListApiRequest,
  YapiGetV1PerpetualGroupData
> = () => {
  return request({
    path: `/v1/perpetual/group/list`,
    method: 'GET',
  })
}

/**
 * 创建合约组
 */
export const setFutureGroupCreate: MarkcoinRequest<
  YapiPostV1PerpetualGroupCreateApiRequest,
  YapiPostV1PerpetualGroupCreateData
> = data => {
  return request({
    path: `/v1/perpetual/group/create`,
    method: 'POST',
    data,
  })
}

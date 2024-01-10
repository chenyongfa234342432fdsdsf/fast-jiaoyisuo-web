/**
 * c2c-公共
 */
import request, { MarkcoinRequest } from '@/plugins/request'
import {
  C2CAreaListReq,
  C2CAreaListResp,
  C2CCoinListReq,
  C2CCoinListResp,
  C2CMainTypeListReq,
  C2CMainTypeListResp,
  C2cCoinTypeListReq,
  C2cCoinTypeListResp,
  ReleaseAdvertSwitchReq,
  ReleaseAdvertSwitchResp,
} from '@/typings/api/c2c/common'

/**
 * 获取可交易的区域列表
 */
export const getAreaList: MarkcoinRequest<C2CAreaListReq, C2CAreaListResp[]> = params => {
  return request({
    path: `/v1/c2c/area/list`,
    method: 'GET',
    params,
  })
}

/**
 * 获取可交易的区域下的币种列表
 */
export const postCoinList: MarkcoinRequest<C2CCoinListReq, C2CCoinListResp[]> = data => {
  return request({
    path: `/v1/c2c/coin/list`,
    method: 'POST',
    data,
  })
}

/**
 * 获取币种对应的 mainType
 */
export const getMainTypeList: MarkcoinRequest<C2CMainTypeListReq, C2CMainTypeListResp[]> = params => {
  return request({
    path: `/v1/c2c/mainType/list`,
    method: 'GET',
    params,
  })
}

/**
 * [获取广告发布开关↗](https://yapi.nbttfc365.com/project/73/interface/api/5554)
 * */
export const getCanPublishAd: MarkcoinRequest<ReleaseAdvertSwitchReq, ReleaseAdvertSwitchResp> = params => {
  return request({
    path: '/v1/c2c/advert/getReleaseAdvertSwitch',
    method: 'GET',
    params,
  })
}

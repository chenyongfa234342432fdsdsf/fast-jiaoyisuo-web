/**
 * 资产公共 api 接口
 */
import request, { MarkcoinRequest } from '@/plugins/request'
import {
  AssetsRecordsCoinListReq,
  AssetsRecordsCoinListResp,
  AssetsRecordsListReq,
  AssetsRecordsListResp,
  AssetsRecordsDetailsReq,
  AssetsRecordsDetailsResp,
} from '@/typings/api/assets/assets'

/**
 * 财务记录 - 获取财务日志币种列表
 * yapi: https://yapi.coin-online.cc/project/44/interface/api/2705
 */
export const getRecordsCoinList: MarkcoinRequest<AssetsRecordsCoinListReq, AssetsRecordsCoinListResp> = params => {
  return request({
    path: `/v1/bill/log/coinList`,
    method: 'GET',
    params,
  })
}

/**
 * 财务记录 - 财务记录列表
 * yapi: https://yapi.coin-online.cc/project/44/interface/api/392
 */
export const getRecordsList: MarkcoinRequest<AssetsRecordsListReq, AssetsRecordsListResp> = data => {
  return request({
    path: `/v1/pay/bill/log/list`,
    method: 'POST',
    data,
  })
}

/**
 * 财务记录 - 财务记录详情
 * yapi: https://yapi.coin-online.cc/project/44/interface/api/395
 */
export const getRecordsDetails: MarkcoinRequest<AssetsRecordsDetailsReq, AssetsRecordsDetailsResp> = params => {
  return request({
    path: `/v1/bill/log/detail`,
    method: 'GET',
    params,
  })
}

/**
 * 合约账户相关 api 接口
 */
import request, { MarkcoinRequest } from '@/plugins/request'
import {
  YapiGetV1PerpetualGroupQueryPurchasingPowerApiRequest,
  YapiGetV1PerpetualGroupQueryPurchasingPowerApiResponse,
} from '@/typings/yapi/PerpetualGroupQueryPurchasingPowerV1GetApi'

/**
 * 获取用户资产列表
 * @returns
 */
export const getAsset: MarkcoinRequest = () => {
  return request({
    path: `/v1/perpetual/account/assets/v1/condition`,
    method: 'GET',
  })
}

/**
 * 取得所有币种列表
 * @returns
 */
export const getCurrencies: MarkcoinRequest = () => {
  return request({
    path: `/v1/perpetual/public/currencies`,
    method: 'GET',
  })
}

/**
 * 划转记录列表
 * @param data
 * @returns
 */
export const getTransferList: MarkcoinRequest<any> = data => {
  return request({
    path: `/v2/perpetual/transfer/record`,
    method: 'POST',
    data,
    contentType: 1,
  })
}

/**
 * 财务日志列表
 * @param data
 * @returns
 */
export const getHistoryList: MarkcoinRequest<any> = params => {
  return request({
    path: `/v2/perpetual/bills`,
    method: 'GET',
    params,
  })
}

/**
 * [查询合约组剩余购买力信息↗](https://yapi.nbttfc365.com/project/44/interface/api/4255)
 * */
export const getV1PerpetualGroupQueryPurchasingPowerApiRequest: MarkcoinRequest<
  YapiGetV1PerpetualGroupQueryPurchasingPowerApiRequest,
  YapiGetV1PerpetualGroupQueryPurchasingPowerApiResponse['data']
> = params => {
  return request({
    path: '/v1/perpetual/group/queryPurchasingPower',
    method: 'GET',
    params,
  })
}

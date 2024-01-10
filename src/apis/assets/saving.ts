/**
 * 理财账户相关 api 接口
 */
import request, { MarkcoinRequest } from '@/plugins/request'
/**
 * 获取总资产
 * @returns
 */
export const getAsset: MarkcoinRequest = () => {
  return request({
    path: `/finance/asset/view`,
    method: 'GET',
  })
}

/**
 * 获取累计收益
 * @param params
 * @returns
 */
export const getProfitPeriod: MarkcoinRequest<any> = params => {
  return request({
    path: `/finance/asset/profit/view`,
    method: 'GET',
    params,
  })
}

/**
 * 理财持仓币种列表
 * @returns
 */
export const getCurrencyList: MarkcoinRequest = () => {
  return request({
    path: `/finance/hold/currency/list`,
    method: 'GET',
  })
}

/**
 * 理财持仓产品列表
 * @param params
 * @returns
 */
export const getSavingList: MarkcoinRequest<any> = params => {
  return request({
    path: `/finance/asset/hold/view`,
    method: 'GET',
    params,
    needAllRes: true,
  })
}

/**
 * 理财记录列表
 * @param params
 * @returns
 */
export const getRecordList: MarkcoinRequest<any> = params => {
  return request({
    path: `/finance/asset/record/list`,
    method: 'GET',
    params,
    needAllRes: true,
  })
}

/**
 * 理财记录列表
 * @param params
 * @returns
 */
export const getRecordDetail: MarkcoinRequest<any> = params => {
  return request({
    path: `/finance/asset/record/detail`,
    method: 'GET',
    params,
    needAllRes: true,
  })
}

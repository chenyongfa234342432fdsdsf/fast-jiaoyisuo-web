import request, { MarkcoinRequest } from '@/plugins/request'
import {
  YapiGetV1MarketMarketActivitiesApiRequest,
  YapiGetV1MarketMarketActivitiesListData,
} from '@/typings/yapi/MarketMarketActivitiesV1GetApi'
import { IMarketActivitiesStatisticsReq, IMarketActivitiesStatisticsResp } from '@/typings/api/market/market-activity'

/**
 * 行情异动
 */
export const getMarketActivities: MarkcoinRequest<
  YapiGetV1MarketMarketActivitiesApiRequest,
  YapiGetV1MarketMarketActivitiesListData[]
> = params => {
  return request({
    path: `/v1/market/marketActivities`,
    method: 'GET',
    params,
  })
}

/**
 * 行情异动
 */
export const addMarketActivitiesStatistics: MarkcoinRequest<
  IMarketActivitiesStatisticsReq,
  IMarketActivitiesStatisticsResp
> = params => {
  return request({
    path: `/v1/market/marketActivities/statistics`,
    method: 'GET',
    params,
  })
}

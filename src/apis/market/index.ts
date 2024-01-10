import request, { MarkcoinRequest } from '@/plugins/request'
import {
  IGetKlineHistoryReq,
  IPostPerpetualPublicListResp,
  IGetPerpetualPublicOrderbookResp,
  IGetSymbolLabelInfoResp,
  IPostCoinInfoReq,
  IPostCoinInfoResp,
  IPostFavoriteJsonReq,
  IPostFavoriteJsonResp,
  IPostV3FullDepthReq,
  IPostV3FullDepthResp,
} from '@/typings/api/market'
import {
  YapiGetV1CoinQueryMainCoinListApiRequest,
  YapiGetV1CoinQueryMainCoinListApiResponse,
} from '@/typings/yapi/CoinQueryMainCoinListV1GetApi'
import { YapiGetV1MarketDepthApiRequest, YapiGetV1MarketDepthApiResponse } from '@/typings/yapi/MarketDepthV1GetApi'
import { YapiGetV1MarketKlinesApiRequest, YapiGetV1MarketKlinesApiResponse } from '@/typings/yapi/MarketKlinesV1GetApi'
import {
  YapiGetV1OrdersHistoryKlineApiRequest,
  YapiGetV1OrdersHistoryKlineApiResponse,
} from '@/typings/yapi/OrdersHistoryKlineV1GetApi'
import {
  YapiGetV1PerpetualChartApiRequest,
  YapiGetV1PerpetualChartApiResponse,
} from '@/typings/yapi/PerpetualChartV1GetApi'
import {
  YapiGetPerpetualMarketRestV1MarketDepthApiRequest,
  YapiGetPerpetualMarketRestV1MarketDepthApiResponse,
} from '@/typings/yapi/PerpetualMarketRestMarketDepthV1GetApi'
import {
  YapiGetPerpetualMarketRestV1MarketIndexPriceKlinesApiRequest,
  YapiGetPerpetualMarketRestV1MarketIndexPriceKlinesApiResponse,
} from '@/typings/yapi/PerpetualMarketRestMarketIndexPriceKlinesV1GetApi'
import {
  YapiGetPerpetualMarketRestV1MarketKlinesApiRequest,
  YapiGetPerpetualMarketRestV1MarketKlinesApiResponse,
} from '@/typings/yapi/PerpetualMarketRestMarketKlinesV1GetApi'
import {
  YapiGetPerpetualMarketRestV1MarketMarketPriceKlinesApiRequest,
  YapiGetPerpetualMarketRestV1MarketMarketPriceKlinesApiResponse,
} from '@/typings/yapi/PerpetualMarketRestMarketMarketPriceKlinesV1GetApi'

import {
  YapiGetV1PerpetualTradePairDetailApiRequest,
  YapiGetV1PerpetualTradePairDetailApiResponse,
} from '@/typings/yapi/PerpetualTradePairDetailV1GetApi'

import {
  YapiGetV1TradePairCoinExtApiRequest,
  YapiGetV1TradePairCoinExtApiResponse,
} from '@/typings/yapi/TradePairCoinExtV1GetApi'
import {
  YapiGetV1TradePairDetailApiRequest,
  YapiGetV1TradePairDetailApiResponse,
} from '@/typings/yapi/TradePairDetailV1GetApi'
import {
  YapiGetV1TradePairListApiRequest,
  YapiGetV1TradePairListApiResponse,
} from '@/typings/yapi/TradePairListV1GetApi'

/**
 * 获取当前币种详情 postCoinInfo
 */
export const getTradePairCoinExt: MarkcoinRequest<
  YapiGetV1TradePairCoinExtApiRequest,
  YapiGetV1TradePairCoinExtApiResponse
> = params => {
  return request({
    path: `/v1/tradePair/coinExt`,
    method: 'GET',
    params,
  })
}

/**
 * 获取收藏币种
 */
export const postFavoriteJson: MarkcoinRequest<IPostFavoriteJsonReq, IPostFavoriteJsonResp> = params => {
  return request({
    path: `hk-web/user/user_favorite_json`,
    method: 'POST',
    params,
  })
}

/**
 * 获取币种列表
 */
export const getSymbolLabelInfo: MarkcoinRequest<
  YapiGetV1TradePairListApiRequest,
  YapiGetV1TradePairListApiResponse['data']
> = params => {
  return request({
    path: `/v1/tradePair/list`,
    method: 'GET',
    params,
  })
}

/**
 * 获取我的成交
 */
export const getOrdersHistoryKline: MarkcoinRequest<
  YapiGetV1OrdersHistoryKlineApiRequest,
  YapiGetV1OrdersHistoryKlineApiResponse['data']
> = params => {
  return request({
    path: `/v1/orders/history/kline`,
    method: 'GET',
    params,
  })
}

/**
 * 24 小时行情
 */
export const getMarketTicker: MarkcoinRequest<
  YapiGetV1TradePairDetailApiRequest,
  YapiGetV1TradePairDetailApiResponse['data']
> = params => {
  return request({
    path: `/v1/tradePair/detail`,
    method: 'GET',
    params,
  })
}

/**
 * [合约币对详情↗](https://yapi.nbttfc365.com/project/44/interface/api/4047)
 * */
export const getV1PerpetualTradePairDetailApiRequest: MarkcoinRequest<
  YapiGetV1PerpetualTradePairDetailApiRequest,
  YapiGetV1PerpetualTradePairDetailApiResponse['data']
> = params => {
  return request({
    path: '/v1/perpetual/tradePair/detail',
    method: 'GET',
    params,
  })
}

/**
 * [合约盘口深度↗](https://yapi.nbttfc365.com/project/44/interface/api/3787)
 * */
export const getPerpetualMarketRestV1MarketDepthApiRequest: MarkcoinRequest<
  YapiGetPerpetualMarketRestV1MarketDepthApiRequest,
  YapiGetPerpetualMarketRestV1MarketDepthApiResponse['data']
> = params => {
  return request({
    path: '/perpetual-market-rest/v1/market/depth',
    method: 'GET',
    params,
  })
}

/**
 * [合约k线↗](https://yapi.nbttfc365.com/project/44/interface/api/3783)
 * */
export const getPerpetualMarketRestV1MarketKlinesApiRequest: MarkcoinRequest<
  YapiGetPerpetualMarketRestV1MarketKlinesApiRequest,
  YapiGetPerpetualMarketRestV1MarketKlinesApiResponse['data']
> = params => {
  return request({
    path: '/perpetual-market-rest/v1/market/klines',
    method: 'GET',
    params,
  })
}

/**
 * [合约指数价格K线图接口↗](https://yapi.nbttfc365.com/project/44/interface/api/4211)
 * */
export const getPerpetualMarketRestV1MarketIndexPriceKlinesApiRequest: MarkcoinRequest<
  YapiGetPerpetualMarketRestV1MarketIndexPriceKlinesApiRequest,
  YapiGetPerpetualMarketRestV1MarketIndexPriceKlinesApiResponse['data']
> = params => {
  return request({
    path: '/perpetual-market-rest/v1/market/indexPriceKlines',
    method: 'GET',
    params,
  })
}

/**
 * [合约标记价格k线图数据↗](https://yapi.nbttfc365.com/project/44/interface/api/4215)
 * */
export const getPerpetualMarketRestV1MarketMarketPriceKlinesApiRequest: MarkcoinRequest<
  YapiGetPerpetualMarketRestV1MarketMarketPriceKlinesApiRequest,
  YapiGetPerpetualMarketRestV1MarketMarketPriceKlinesApiResponse['data']
> = params => {
  return request({
    path: '/perpetual-market-rest/v1/market/marketPriceKlines',
    method: 'GET',
    params,
  })
}

// /**
//  * [个人图表偏好设置↗](https://yapi.nbttfc365.com/project/44/interface/api/3707)
//  * */
// export const postV1PerpetualSettingsChartApiRequest: MarkcoinRequest<
//   YapiPostV1PerpetualSettingsChartApiRequest,
//   YapiPostV1PerpetualSettingsChartApiResponse['data']
// > = data => {
//   return request({
//     path: '/v1/perpetual/settings/chart',
//     method: 'POST',
//     data,
//   })
// }

/**
 * [ 查询用户图表设置↗](https://yapi.nbttfc365.com/project/44/interface/api/3799)
 * */
export const getV1PerpetualChartApiRequest: MarkcoinRequest<
  YapiGetV1PerpetualChartApiRequest,
  YapiGetV1PerpetualChartApiResponse['data']
> = params => {
  return request({
    path: '/v1/perpetual/chart',
    method: 'GET',
    params,
  })
}

/**
 * 获取币种买卖价格
 */
export const postV3FullDepth: MarkcoinRequest<
  YapiGetV1MarketDepthApiRequest,
  YapiGetV1MarketDepthApiResponse['data']
> = params => {
  return request({
    path: `/v1/market/depth`,
    method: 'GET',
    params,
  })
}

/**
 * 获取 k 线数据
 */
export const getKlineHistory: MarkcoinRequest<
  YapiGetV1MarketKlinesApiRequest,
  YapiGetV1MarketKlinesApiResponse['data']
> = params => {
  return request({
    path: `/v1/market/klines`,
    method: 'GET',
    params,
  })
}

/**
 * 获取实时成交
 */
export const queryRealTimeTradeList: MarkcoinRequest<
  {
    tradeId: number
  },
  any[]
> = params => {
  return request({
    path: `hk-web/v3/realTimeTrade`,
    method: 'POST',
    params,
  })
}

/**
 * 获取实时成交
 */
export const queryFutureRealTimeTradeList: MarkcoinRequest<
  {
    contractCode: string
  },
  any[][]
> = params => {
  return request({
    path: `v1/perpetual/public/${params.contractCode}/fills`,
    method: 'GET',
    params,
  })
}

/**
 * 获取合约列表
 */
export const postPerpetualPublicList: MarkcoinRequest<Record<string, never>, IPostPerpetualPublicListResp> = params => {
  return request({
    path: `v2/perpetual/public/list`,
    method: 'POST',
    params,
  })
}

/**
 * 合约报价
 */
export const getPerpetualPublicOrderbook: MarkcoinRequest<
  {
    contractCode: string
    size: number
  },
  IGetPerpetualPublicOrderbookResp
> = params => {
  return request({
    path: `'v1/perpetual/public/${params.contractCode}/orderbook`,
    method: 'GET',
    params,
  })
}

/**
 * 获取所有币种基本信息
 */
export const getAllCoinSymbolInfoList: MarkcoinRequest<
  YapiGetV1CoinQueryMainCoinListApiRequest,
  YapiGetV1CoinQueryMainCoinListApiResponse['data']
> = params => {
  return request({
    path: `v1/coin/queryMainCoinList`,
    method: 'GET',
    params,
  })
}

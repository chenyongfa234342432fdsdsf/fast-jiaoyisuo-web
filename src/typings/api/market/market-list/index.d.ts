import { ApiRequestWithPagination, ApiResponseCommon } from '@/typings/common'
import { YapiGetV1CoinQueryCoinPageListCoinListData } from '@/typings/yapi/CoinQueryCoinPageListV1GetApi'
import { YapiGetV1FavouriteDefaultList } from '@/typings/yapi/FavouriteDefaultV1GetApi'
import { YapiGetV1PerpetualFavouriteTradePairDefaultListData } from '@/typings/yapi/PerpetualFavouriteTradePairDefaultV1GetApi'
import { YapiGetV1PerpetualTradePairListApiRequest } from '@/typings/yapi/PerpetualTradePairListV1GetApi'
import { YapiGetV1TradePairHotListData } from '@/typings/yapi/TradePairHotV1GetApi'
import { YapiGetV1TradePairListApiRequest, YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import {
  YapiGetV1TradePairSearchData,
  YapiGetV1TradePairSearchListSpotData,
} from '@/typings/yapi/TradePairSearchV1GetApi'

/** 行情 - 首页 - 热门列表 */
// YapiGetV1TradePairHotListData &
export type TradePairWithCoinInfoType = YapiGetV1CoinQueryCoinPageListCoinListData &
  YapiGetV1TradePairListData & {
    lastPrev?: string | number
  }

export type TradePairBasicType = Pick<TradePairWithCoinInfoType, 'quoteSymbolName' | 'baseSymbolName'>

export type YapiGetV1TradePairSearchListAllDataType = Partial<
  YapiGetV1TradePairSearchListSpotData & {
    // 全部展示的时候 需要生成一个唯一的 id， 由类型和原 id 拼接
    rowKey?: string
  }
>

export type MarketListGlobalSearchResultViewModel = Partial<
  YapiGetV1TradePairSearchData & {
    all?: YapiGetV1TradePairSearchListAllDataType[]
  }
>

export type WsTradePairCommonType = {
  low: string
  volume: string
  last: string
  open: string
  chg: string
  quoteVolume: string
  high: string
}

export type WsMarketSubConfig = Partial<
  Pick<YapiGetV1TradePairHotListData, 'quoteSymbolName' | 'baseSymbolName' | 'symbolWassName'>
>

export type WsTradePairCommonApiDataType = Partial<WsMarketSubConfig> & Partial<WsTradePairCommonType>

export type YapiGetV1TradePairListApiRequestWithPagination = ApiRequestWithPagination<YapiGetV1TradePairListApiRequest>
// TODO-LEO PULL LATEST API
export type YapiGetV1FuturesTradePairListApiRequestWithPagination = ApiRequestWithPagination<
  YapiGetV1PerpetualTradePairListApiRequest & {
    /**
     * 板块ID
     */
    conceptId?: string
  }
>

export type WsFavouriteDefaultDataType = Partial<
  YapiGetV1PerpetualFavouriteTradePairDefaultListData & YapiGetV1TradePairListData
> &
  WsMarketSubConfig &
  YapiGetV1CoinQueryCoinPageListCoinListData

export type YapiGetV1FavouriteDefaultApiResp = ApiResponseCommon<{ list: Required<YapiGetV1FavouriteDefaultList>[] }>
export type YapiGetV1FuturesFavouriteDefaultApiResp = ApiResponseCommon<{
  list: Required<YapiGetV1PerpetualFavouriteTradePairDefaultListData>[]
}>

export type WithTableIndex<T> = T & { tableIndex?: string }

export type CommonTradePairDataWithMarketCap = Partial<
  YapiGetV1TradePairListData & {
    calMarketCap?: number | string
    lastPrev?: number | string
  }
>

export type YapiGetV1TradePairSearchDataReal = Partial<
  Omit<YapiGetV1TradePairSearchData, 'spot'> & {
    spot: (YapiGetV1TradePairSearchListSpotData & { calMarketCap?: string | number })[]
  }
>

export type SelectUIOptionType = {
  id: string
  title: string
}

import { globalSearchDisplayModules } from '@/constants/market/market-list'
import { leftJoinByKey } from '@/helper/common'
import { onTradePairClickRedirect } from '@/helper/market'
import { ConceptPrice_Body } from '@/plugins/ws/protobuf/ts/proto/ConceptPrice'
import {
  MarketListGlobalSearchResultViewModel,
  TradePairWithCoinInfoType,
  WithTableIndex,
  YapiGetV1TradePairSearchListAllDataType,
} from '@/typings/api/market/market-list'
import { YapiGetV1CoinQueryMainCoinListCoinListData } from '@/typings/yapi/CoinQueryMainCoinListV1GetApi'
import { YapiGetV1ConceptConceptPriceListData } from '@/typings/yapi/ConceptConceptPriceListV1GetApi'
import { YapiGetV1FavouriteDefaultList } from '@/typings/yapi/FavouriteDefaultV1GetApi'
import { YapiGetV1PerpetualTradePairHotListData } from '@/typings/yapi/PerpetualTradePairHotV1GetApi'
import { YapiGetV1TradePairHotListData } from '@/typings/yapi/TradePairHotV1GetApi'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import { YapiGetV1TradePairSearchData } from '@/typings/yapi/TradePairSearchV1GetApi'
import { TableProps } from '@nbit/arco'
import { decimalUtils } from '@nbit/utils'
import { uniqueId } from 'lodash'

const SafeCalcUtil = decimalUtils.SafeCalcUtil

export const toMarketListGlobalSearchWithAllType = (
  data: Partial<YapiGetV1TradePairSearchData | null>
): MarketListGlobalSearchResultViewModel | null => {
  if (!data) data = {}

  let all: YapiGetV1TradePairSearchListAllDataType[] = []

  globalSearchDisplayModules.forEach(type => {
    const subData: YapiGetV1TradePairSearchListAllDataType[] = (data || {})[type] || []
    const subDataWithKey = subData.map(x => {
      x.rowKey = `${type}-${x.id}`
      return x
    })
    all = [...all, ...subDataWithKey]
  })

  const res = { all, ...data }
  return res
}

export function mergeTradePairWithSymbolInfo(
  hotCurrenciesResp?: YapiGetV1TradePairHotListData[] | YapiGetV1PerpetualTradePairHotListData[],
  symbolInfoResp?: YapiGetV1CoinQueryMainCoinListCoinListData[]
): TradePairWithCoinInfoType[] {
  const merged = leftJoinByKey<TradePairWithCoinInfoType>({
    arr1: hotCurrenciesResp,
    key1: 'sellCoinId',
    arr2: symbolInfoResp,
    key2: 'id',
  })

  return merged
}

export function mergeTradePairWithFavDefault(
  all?: YapiGetV1TradePairListData[],
  partial?: YapiGetV1FavouriteDefaultList[]
): YapiGetV1TradePairListData[] {
  const merged = leftJoinByKey<YapiGetV1TradePairListData>({
    arr1: partial,
    key1: 'tradePairId',
    arr2: all,
    key2: 'id',
    isInnerJoin: true,
  })

  return merged
}

export function mergeTradePairWithWsDataByWassName(apiData: any[], wsData: any[]) {
  const merged = leftJoinByKey<TradePairWithCoinInfoType>({
    arr1: apiData,
    key1: 'symbolWassName',
    arr2: wsData,
    key2: 'symbolWassName',
  })

  return merged
}

export function mergeMarketSectorConceptListById(
  apiData: YapiGetV1ConceptConceptPriceListData[],
  wsData: ConceptPrice_Body[]
) {
  const merged = leftJoinByKey<any>({
    arr1: apiData,
    key1: 'id',
    arr2: wsData,
    key2: 'id',
  })

  return merged
}

export function addTableIndexToData<T>(data: T[], key?: keyof T): WithTableIndex<T>[] {
  if (!data) return data

  const resolved: WithTableIndex<T>[] = []

  data.forEach((item, index) => {
    resolved.push({
      ...item,
      tableIndex: key ? `${item[key as string]}${index}` : `tableIndex-${index}`,
    })
  })

  return resolved
}

export function append0Prefix(number, target) {
  const arr = String(Number(number || 0) + 1).split('')

  while (arr.length < target) {
    arr.unshift('0')
  }

  return arr.join('')
}

export const tradePairTableCommonProps = (): TableProps => {
  return {
    pagination: false,
    border: {
      bodyCell: false,
      cell: false,
    },
    onRow: (item, index) => {
      return {
        onClick: e => {
          onTradePairClickRedirect(item as any)
        },
      }
    },
    showSorterTooltip: false,
    rowKey: record => record?.id || uniqueId(),
  }
}

export const calMarketCap = (item: { last?: string | number; circulatingSupply?: string | number }) => {
  return SafeCalcUtil.mul(item.last || 0, item.circulatingSupply || 0).toString()
}

export const generateSWRCacheKey = (cacheKey: string, params?: any[]) => {
  const key = `${cacheKey}${params?.reduce((acc, cur) => `${acc}-${cur}`, '-params-')}`
  return key
}

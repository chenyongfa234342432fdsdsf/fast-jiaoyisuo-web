import {
  GlobalSearchTypesMappingEnum,
  SpotMarketSectorCategoryEnum,
  quoteVolumneTableSorter,
} from '@/constants/market/market-list'
import { getSearchHistoryCache, setSearchHistoryCache } from '@/helper/cache'
import { onTradePairClickRedirect } from '@/helper/market'
import { setStateByModulePath, getStateByModulePath } from '@/helper/store'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import { uniqBy } from 'lodash'

export default function (set, get, type) {
  const boundSet = setStateByModulePath.bind(null, set, [type])
  const boundedGet = getStateByModulePath.bind(null, get, [type])

  return {
    tradeAreaLeftOffset: 300,
    setTradeAreaLeftOffset(offset: number) {
      boundSet('tradeAreaLeftOffset', offset || 300)
    },

    selectedBaseCurrencyFilter: SpotMarketSectorCategoryEnum.total as string,
    setSelectedBaseCurrencyFilter(tab: string) {
      boundSet('selectedBaseCurrencyFilter', tab || '')
    },

    searchInput: '',
    setSearchInput(value: string) {
      boundSet('searchInput', value)
    },

    isSearchInputFocused: false,
    setIsSearchInputFocused(value: boolean) {
      boundSet('isSearchInputFocused', value)
    },

    isSearchPopoverVisible: false,
    setIsSearchPopoverVisible(val: boolean) {
      boundSet('isSearchPopoverVisible', val)
      if (val) return

      // otherwise reset
      boundSet('searchInput', '')
      boundSet('isSearchInputFocused', false)
    },

    globalSearchSelectedTabId: GlobalSearchTypesMappingEnum.futures,

    showToolTip: '',
    setShowToolTip(index) {
      boundSet('showToolTip', index)
    },

    pairSearchHistory: [] as YapiGetV1TradePairListData[],
    loadFromCacheForpairSearchHistory() {
      const cache = getSearchHistoryCache(type) || []
      boundSet('pairSearchHistory', cache)
    },
    clearPairSearchHistory() {
      boundSet('pairSearchHistory', [])
      setSearchHistoryCache(type, [])
    },
    updatePairSearchHistory(item) {
      // 最多显示八个
      const newList = uniqBy([item, ...boundedGet('pairSearchHistory')], x => x.id).slice(0, 8)
      setSearchHistoryCache(type, newList)
      boundSet('pairSearchHistory', newList)
      boundedGet('setIsSearchPopoverVisible')(false)
      onTradePairClickRedirect(item)
    },

    tableSorter: quoteVolumneTableSorter,
    setTableSorter(config) {
      boundSet('tableSorter', config)
    },
  }
}

import create from 'zustand'
import { createTrackedSelector } from 'react-tracked'
import { devtools } from 'zustand/middleware'
import {
  GlobalSearchTypesMappingEnum,
  MarketLisModulesEnum,
  MarketListRouteEnum,
  quoteVolumneTableSorter,
} from '@/constants/market/market-list'
import futuresModule from '@/store/market/market-list/contract-module'
import { setStateByModulePath, getStateByModulePath } from '@/helper/store'
import futuresTradeModule from '@/store/market/market-list/futures-trade-module'
import sectorDetailsModule from '@/store/market/market-list/sector-details-module'
import produce from 'immer'
import spotTradeModule from './spot-trade-module'
import spotModule from './spot-module'

export type IMarketListBaseStore = ReturnType<typeof getBaseStore>

function getBaseStore(set, get) {
  const boundSet = setStateByModulePath.bind(null, set, [])
  const boundGet = getStateByModulePath.bind(null, get, [])

  return {
    activeModule: MarketLisModulesEnum.spotMarkets,
    setActiveModule(module: MarketLisModulesEnum) {
      boundSet('activeModule', module || MarketListRouteEnum.spot)

      // 联动 globalSearchSelectedTabId
      if (module === MarketLisModulesEnum.futuresMarkets) {
        boundSet('globalSearchSelectedTabId', GlobalSearchTypesMappingEnum.futures)
      } else {
        boundSet('globalSearchSelectedTabId', GlobalSearchTypesMappingEnum.spot)
      }
    },

    searchInput: '',
    setSearchInput(val: string) {
      boundSet('searchInput', String(val).trim())
    },

    isSearchInputFocused: false,
    setIsSearchInputFocused(value: boolean) {
      boundSet('isSearchInputFocused', value)
    },

    globalSearchSelectedTabId: GlobalSearchTypesMappingEnum.spot,
    setGlobalSearchSelectedTabId(val: { id: GlobalSearchTypesMappingEnum }) {
      boundSet('globalSearchSelectedTabId', val.id)
    },

    globalTablePaginationConfig: {
      pageNum: 1,
      pageSize: 30,
    },
    setGlobalTablePaginationConfig(config) {
      boundSet('globalTablePaginationConfig', { ...boundGet('globalTablePaginationConfig'), ...config })
    },
    resetGlobalTablePaginationConfig() {
      boundSet('globalTablePaginationConfig', { ...boundGet('globalTablePaginationConfig'), ...{ pageNum: 1 } })
    },

    // 默认按照 quoteVolume sorter
    globalTableSorter: quoteVolumneTableSorter,
    setGlobalTableSorter(config) {
      boundSet('globalTableSorter', config)
    },

    // 行情、交易区列表的运行时缓存
    cache: {
      spotListMap: {} as Record<string, any>,
      setSpotListMap(key: string, value: any) {
        set(
          produce((draft: IMarketListBaseStore) => {
            draft.cache.spotListMap = { ...draft.cache.spotListMap, ...{ [key]: value } }
          })
        )
      },

      futuresListMap: {} as Record<string, any>,
      setFuturesListMap(key: string, value: any) {
        set(
          produce((draft: IMarketListBaseStore) => {
            draft.cache.futuresListMap = { ...draft.cache.futuresListMap, ...{ [key]: value } }
          })
        )
      },

      futuresCategories: [],
      setFuturesCategories(value) {
        set(
          produce((draft: IMarketListBaseStore) => {
            draft.cache.futuresCategories = value
          })
        )
      },
    },

    [MarketLisModulesEnum.spotMarkets]: spotModule(set, get),
    [MarketLisModulesEnum.futuresMarkets]: futuresModule(set, get),
    [MarketLisModulesEnum.spotMarketsTrade]: spotTradeModule(set, get, MarketLisModulesEnum.spotMarketsTrade),
    [MarketLisModulesEnum.futuresMarketsTrade]: futuresTradeModule(set, get, MarketLisModulesEnum.futuresMarketsTrade),
    [MarketLisModulesEnum.sectorDetails]: sectorDetailsModule(set, get, MarketLisModulesEnum.sectorDetails),
  }
}

function getStore(set, get) {
  return {
    // ...createUpdateProp<IMarketListBaseStore>(set),
    ...getBaseStore(set, get),
  }
}

const baseMarketListStore = create(devtools(getStore, { name: 'market-list-store' }))

const useMarketListStore = createTrackedSelector(baseMarketListStore)

export { useMarketListStore, baseMarketListStore }

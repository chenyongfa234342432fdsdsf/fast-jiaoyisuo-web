import {
  MarketLisModulesEnum,
  SpotMarketBaseCurrenyEnum,
  spotMarketsCategoryFilter,
  SpotMarketSectorCategoryEnum,
} from '@/constants/market/market-list'
import { getMarketTradePairListTableColumns } from '@/features/market/market-list/common/market-list-trade-pair-table-schema'
import { setStateByModulePath } from '@/helper/store'

export default function (set, get) {
  const boundSet = setStateByModulePath.bind(null, set, [MarketLisModulesEnum.spotMarkets])

  return {
    selectedBaseCurrencyFilter: SpotMarketBaseCurrenyEnum.favorites,
    setSelectedBaseCurrencyFilter(tab: string) {
      boundSet('selectedBaseCurrencyFilter', tab)
    },

    selectedCategroyFilter: SpotMarketSectorCategoryEnum.total,
    setSelectedCategroyFilter(tab: string) {
      boundSet('selectedCategroyFilter', tab)
    },

    getTableColumn: getMarketTradePairListTableColumns,
  }
}

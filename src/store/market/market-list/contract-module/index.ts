import { FuturesTabsEnum, MarketLisModulesEnum } from '@/constants/market/market-list'
import { getMarketFuturesTradePairListTableColumns } from '@/features/market/market-list/common/market-list-trade-pair-table-schema'
import { setStateByModulePath } from '@/helper/store'

export default function (set, get) {
  const boundSet = setStateByModulePath.bind(null, set, [MarketLisModulesEnum.futuresMarkets])

  return {
    selectedBaseCurrencyFilter: FuturesTabsEnum.favorites as FuturesTabsEnum | string,
    setSelectedBaseCurrencyFilter(id: FuturesTabsEnum | string) {
      boundSet('selectedBaseCurrencyFilter', id)
    },

    getTableColumn: getMarketFuturesTradePairListTableColumns,
  }
}

import { GlobalSearchTypesMappingEnum } from '@/constants/market/market-list'
import {
  getMarketFuturesTradePairListTableColumns,
  getMarketTradePairListTableColumns,
} from '@/features/market/market-list/common/market-list-trade-pair-table-schema'
import { tableSortHelper } from '@/helper/common'
import useWsMarketSearchAll from '@/hooks/features/market/market-list/use-ws-market-search-all'
import { useMarketListStore } from '@/store/market/market-list'
import { SorterResult } from '@nbit/arco/es/Table/interface'
import { useEffect, useState } from 'react'
import {
  useWsMarketSearchFutures,
  useWsMarketSearchSpot,
} from '@/hooks/features/market/market-list/use-ws-market-search'
import { MarketTradeSearchResultTableContent } from '@/features/market/market-list/common/market-list-table-content/market-list-table-content-trade-area'
import MarketListGlobalSearchTableFilterTab from '../market-list-global-search-table-filter-tab'
import MarketListSpotCommonTableContent from '../market-list-trade-pair-common-table-content'

export default function MarketListGlobalSearchTableContent() {
  const store = useMarketListStore()
  const { data, setData, apiStatus } = useWsMarketSearchAll({ apiParams: { symbolName: store.searchInput } })
  const selectedData = data[store.globalSearchSelectedTabId] || []
  const getCurrentColumn = () => {
    return store.globalSearchSelectedTabId === GlobalSearchTypesMappingEnum.futures
      ? getMarketFuturesTradePairListTableColumns()
      : getMarketTradePairListTableColumns()
  }
  const [columns, setColumns] = useState(getCurrentColumn())
  useEffect(() => {
    setColumns(getCurrentColumn())
  }, [store.globalSearchSelectedTabId])

  return (
    <div className="global-search-content">
      <div className="search-result-tab">
        <MarketListGlobalSearchTableFilterTab
          selectedTab={{ id: store.globalSearchSelectedTabId }}
          handleSelectChange={e => {
            store.setGlobalSearchSelectedTabId(e)
            store.resetGlobalTablePaginationConfig()
          }}
          data={data}
        />
      </div>

      <MarketListSpotCommonTableContent
        data={selectedData}
        getRowKey={row => row.rowKey || row.id}
        columns={columns}
        apiStatus={apiStatus}
        onSortChange={(sorter: SorterResult) => {
          setData(prev => {
            return {
              ...prev,
              [store.globalSearchSelectedTabId]: tableSortHelper.handler({ data: selectedData, sorter }),
            }
          })
        }}
      />
    </div>
  )
}

export function MarketListSpotTradeSearchResult() {
  const store = useMarketListStore().spotMarketsTradeModule
  const { data, setData, apiStatus } = useWsMarketSearchSpot({ apiParams: { symbolName: store.searchInput } })
  return <MarketTradeSearchResultTableContent data={data} setData={setData} apiStatus={apiStatus} store={store} />
}

export function MarketListFuturesTradeSearchResult() {
  const store = useMarketListStore().futuresMarketsTradeModule
  const { data, setData, apiStatus } = useWsMarketSearchFutures({ apiParams: { symbolName: store.searchInput } })
  return <MarketTradeSearchResultTableContent data={data} setData={setData} apiStatus={apiStatus} store={store} />
}

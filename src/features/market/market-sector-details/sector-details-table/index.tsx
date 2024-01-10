import MarketTradePairCommonTable from '@/features/market/market-list/common/market-trade-pair-common-table'
import { onTradePairClickRedirect } from '@/helper/market'
import { getMarketSectorDetailsTableColumns } from '@/features/market/market-list/common/market-list-trade-pair-table-schema'
import {
  useWsMarketSectorFuturesTradePairListWithSymbolInfo,
  useWsMarketSectorTradePairListWithSymbolInfo,
} from '@/hooks/features/market/market-list/use-ws-market-trade-pair-list'
import { useMarketListStore } from '@/store/market/market-list'
import { SectorCategoryEnum } from '@/helper/market/sector'
import { usePageContext } from '@/hooks/use-page-context'
import { quoteVolumneTableSorter } from '@/constants/market/market-list'

export function MarketSectorDetailsTableSwitcher() {
  const pageContext = usePageContext()
  const { selectedTabId } = useMarketListStore().sectorDetails

  const conceptId = pageContext?.routeParams?.id?.trim() || ''
  if (!conceptId) return null

  switch (selectedTabId) {
    case SectorCategoryEnum.futures:
      return <MarketSectorDetailsTableFutures conceptId={conceptId} />

    default:
      return <MarketSectorDetailsTableSpot conceptId={conceptId} />
  }
}

export function MarketSectorDetailsTableSpot({ conceptId }) {
  const columns = getMarketSectorDetailsTableColumns()
  const { data, setData, apiStatus } = useWsMarketSectorTradePairListWithSymbolInfo({ apiParams: { conceptId } })
  const props = { apiStatus, columns, data, setData }

  return <MarketSectorDetailsTable {...props} />
}

export function MarketSectorDetailsTableFutures({ conceptId }) {
  const columns = getMarketSectorDetailsTableColumns()
  const { data, setData, apiStatus } = useWsMarketSectorFuturesTradePairListWithSymbolInfo({ apiParams: { conceptId } })
  const props = { apiStatus, columns, data, setData }
  return <MarketSectorDetailsTable {...props} />
}

function MarketSectorDetailsTable({ apiStatus, columns, data, setData }) {
  return (
    <MarketTradePairCommonTable
      apiStatus={apiStatus}
      columns={columns}
      data={data as any}
      setData={setData}
      scroll={{ y: 480 }}
      className={'sector-table'}
      rowKey={item => item.id}
      defaultSorter={quoteVolumneTableSorter}
      onRow={(record, index) => {
        return {
          onClick: e => {
            onTradePairClickRedirect(record as any)
          },
        }
      }}
    />
  )
}

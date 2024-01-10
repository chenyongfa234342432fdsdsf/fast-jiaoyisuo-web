import TableClientPaginationSorting, {
  ITableClientPaginationSortingProps,
} from '@/components/table-client-pagination-sort'
import { SorterResult } from '@nbit/arco/es/Table/interface'
import { IMarketListBaseStore, useMarketListStore } from '@/store/market/market-list'
import { onTradePairClickRedirect } from '@/helper/market'
import { tableSortHelper } from '@/helper/common'
import { ApiStatusEnum, quoteVolumneTableSorter } from '@/constants/market/market-list'
import styles from './index.module.css'

type IProps<T> = ITableClientPaginationSortingProps<T> & {
  setData?: any
  defaultSorter?: SorterResult | null
  apiStatus?: ApiStatusEnum
}

export default function MarketListSpotCommonTableContent<T>({
  sorter,
  data,
  setData,
  defaultSorter,
  setSorter,
  ...rest
}: IProps<T>) {
  const store = useMarketListStore()
  const activeStore = store[store.activeModule] as IMarketListBaseStore['spot']
  const { globalTablePaginationConfig, setGlobalTablePaginationConfig, globalTableSorter, setGlobalTableSorter } =
    useMarketListStore()
  // set to global sorter if not explicitly set to null
  const resolvedSorter = sorter || sorter === null ? sorter : globalTableSorter
  const resolvedDefaultSorter = defaultSorter || defaultSorter === null ? defaultSorter : quoteVolumneTableSorter
  const resolvedSetSorter = setSorter || setGlobalTableSorter

  return (
    <div className={`${styles.scoped}`}>
      <div className="spot-market-list-table-content-wrapper">
        <TableClientPaginationSorting
          data={data}
          apiStatus={rest.apiStatus}
          columns={rest.columns || activeStore.getTableColumn()}
          paginationProps={globalTablePaginationConfig}
          setPaginationProps={setGlobalTablePaginationConfig}
          sorter={resolvedSorter}
          setSorter={resolvedSetSorter}
          defaultSorter={resolvedDefaultSorter}
          onSortChange={(_sorter: SorterResult) =>
            tableSortHelper.handler({ data, sorter: _sorter, setData, defaultSorter: resolvedDefaultSorter })
          }
          tableProps={{
            onRow: (item, index) => {
              return {
                onClick: e => {
                  onTradePairClickRedirect(item as any)
                },
              }
            },
          }}
          {...rest}
        />
      </div>
    </div>
  )
}

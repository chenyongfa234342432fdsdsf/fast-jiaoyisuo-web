import { tradePairTableCommonProps } from '@/helper/market/market-list'
import { Table, TableProps } from '@nbit/arco'
import {
  useWsMarketFuturesUserFavListFullAmount,
  useWsMarketSpotUserFavListFullAmount,
} from '@/hooks/features/market/market-list/use-ws-market-spot-user-favourite-list'
import { useMarketListStore } from '@/store/market/market-list'
import useWsMarketTradePairList, {
  useWsMarketFuturesTradePair,
} from '@/hooks/features/market/market-list/use-ws-market-trade-pair-list'
import { SorterResult } from '@nbit/arco/es/Table/interface'
import { tableSortHelper } from '@/helper/common'
import { useEffect, useState } from 'react'
import { getResolvedSorter, modifyColumnsSorter, modifyDataSorting } from '@/components/table-client-pagination-sort'
import classNames from 'classnames'
import { isEmpty } from 'lodash'
import NoDataImage from '@/components/no-data-image'
import { ApiStatusEnum } from '@/constants/market/market-list'
import MarketListCommonTableContentTradeArea from '@/features/market/market-list/common/market-list-trade-pair-common-table-content-trade-area'
import styles from './index.module.css'

interface IProps<T> extends TableProps {
  data: T[]
  columns: any
  setData?: any
  defaultSorter?: SorterResult | null
  hideScrollbarOnNotActive?: boolean
  apiStatus?: ApiStatusEnum
}

/**
 * data 根据定义的 sorter 进行排序
 */
export default function MarketTradePairCommonTable<T>({
  columns,
  data,
  setData,
  defaultSorter,
  hideScrollbarOnNotActive = true,
  apiStatus,
  ...rest
}: IProps<T>) {
  const [tableData, setTableData] = useState([])
  const [resolvedColumns, setResolvedColumns] = useState(columns || [])
  const [sorterState, setSorterState] = useState<SorterResult | null>(defaultSorter || null)
  const showEmpty = (ApiStatusEnum.failed === apiStatus || ApiStatusEnum.succeed === apiStatus) && isEmpty(data)

  useEffect(() => {
    setResolvedColumns(modifyColumnsSorter(columns || [], sorterState))
  }, [sorterState])

  useEffect(() => {
    setTableData(modifyDataSorting(data || [], sorterState))
  }, [data])

  return (
    <div
      className={classNames(`${styles.root} scrollbar-custom market-common-table`, {
        // 'hide-scrollbar-on-not-active': hideScrollbarOnNotActive,
      })}
    >
      <Table
        {...tradePairTableCommonProps()}
        onChange={(_, sorter: SorterResult) => {
          setSorterState(getResolvedSorter(sorter, columns, defaultSorter))
          tableSortHelper.handler({ data, setData, sorter, defaultSorter })
        }}
        {...rest}
        columns={resolvedColumns}
        data={tableData || []}
        noDataElement={showEmpty ? <NoDataImage /> : <div></div>}
        // noDataElement={<div></div>}
      />
    </div>
  )
}

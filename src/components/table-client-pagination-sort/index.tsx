import { Pagination, TableProps, PaginationProps } from '@nbit/arco'
import Table from '@/components/table'
import { WithTableIndex } from '@/typings/api/market/market-list'
import { useState, useEffect } from 'react'
import { ColumnProps, SorterResult } from '@nbit/arco/es/Table/interface'
import { tableSortHelper } from '@/helper/common'
import { isEmpty, uniqueId } from 'lodash'
import { YapiGetV1TradePairListData } from '@/typings/yapi/TradePairListV1GetApi'
import { ApiStatusEnum } from '@/constants/market/market-list'
import NoDataImage from '@/components/no-data-image'
import classNames from 'classnames'
import styles from './index.module.css'

export type ITableClientPaginationSortingProps<T> = {
  columns?: ColumnProps[]
  data: WithTableIndex<T>[]
  tableProps?: TableProps

  // 全局的 sorter
  sorter?: SorterResult | null
  setSorter?: any
  onSortChange?: (sorter: SorterResult) => void
  defaultSorter?: SorterResult | null

  // 全局的 pagination config
  paginationProps?: PaginationProps & { pageNum: number }
  setPaginationProps?: any

  getRowKey?: (any) => string

  apiStatus?: ApiStatusEnum
}
// internal helper
const modifyDataSlicing = (input, paginationConfig) => {
  if (!paginationConfig) return input

  return (
    input?.slice(
      (paginationConfig.pageNum - 1) * paginationConfig.pageSize,
      paginationConfig.pageNum * paginationConfig.pageSize
    ) || []
  )
}

// TODO 根据自定义的方法来 sort
export const modifyDataSorting = (input, sorter) => {
  if (!sorter) return [...input]
  return (input || []).slice().sort((a, b) => tableSortHelper.common(sorter, a, b))
}

export const applyAllDataHelper = (input, sorter, paginationConfig) => {
  return modifyDataSlicing(modifyDataSorting(input || [], sorter), paginationConfig) as YapiGetV1TradePairListData[]
}

/**
 * 根据 sorter 对 column 的 sortOrder 参数进行处理
 */
export const modifyColumnsSorter = (inputColumns: ColumnProps[], sorter?: SorterResult | null) => {
  const columns = [...inputColumns]
  const column = columns.find(x => x.dataIndex === sorter?.field)

  columns.forEach(column => {
    column.sortOrder = undefined
    // arco 组件中已经统一修改
    // column.sortDirections = ['descend', 'ascend']
  })

  if (column && sorter) {
    column.sortOrder = sorter.direction
  }
  return columns
}

export function getResolvedSorter(sorter, columns, defaultSorter) {
  const column = columns?.find(x => x.dataIndex === sorter?.field)

  let resolvedSorter

  if (sorter?.direction && column) {
    resolvedSorter = sorter
  } else {
    resolvedSorter = defaultSorter
  }

  return resolvedSorter
}

export default function TableClientPaginationSorting<T>({
  columns,
  data,
  paginationProps,
  tableProps,
  onSortChange,
  sorter,
  setPaginationProps,
  setSorter,
  defaultSorter,
  getRowKey,
  apiStatus,
}: ITableClientPaginationSortingProps<T>) {
  const [tableData, setTableData] = useState<YapiGetV1TradePairListData[]>([])
  const [resolvedColumns, setResolvedColumns] = useState(columns || [])
  const totalLength = (data || []).length
  const showEmpty = (ApiStatusEnum.failed === apiStatus || ApiStatusEnum.succeed === apiStatus) && isEmpty(data)

  useEffect(() => {
    // 当跳转不同的表，sorter 有可能并不存在于当前的 columns，这里重新计算 sorter
    sorter = getResolvedSorter(sorter, columns, defaultSorter)
    setResolvedColumns(modifyColumnsSorter(columns || [], sorter))
  }, [sorter, columns])

  useEffect(() => {
    setTableData(applyAllDataHelper(data, sorter, paginationProps))
  }, [data, paginationProps])

  return (
    <div className={classNames(styles.scoped)}>
      <div className="table-placeholder">
        <Table
          rowKey={record => {
            if (getRowKey) {
              return getRowKey(record)
            }
            return record?.id || uniqueId()
          }}
          columns={resolvedColumns}
          data={tableData || []}
          pagination={false}
          showSorterTooltip={false}
          onChange={(_, _sorter: SorterResult) => {
            const newSorter = getResolvedSorter(_sorter, resolvedColumns, defaultSorter)
            onSortChange && onSortChange(newSorter)
            setSorter && setSorter(newSorter)
            setPaginationProps && setPaginationProps({ pageNum: 1 })
          }}
          noDataElement={showEmpty ? <NoDataImage /> : <div></div>}
          {...(tableProps || {})}
        />
      </div>
      {setPaginationProps && (
        <div className="flex justify-end mt-4">
          <Pagination
            current={paginationProps?.pageNum || 1}
            total={totalLength}
            showTotal
            showJumper
            sizeCanChange
            onChange={(pageNumber: number, pageSize: number) => {
              setPaginationProps &&
                setPaginationProps({
                  pageNum: pageNumber,
                  pageSize,
                })
            }}
            hideOnSinglePage
            {...(paginationProps || {})}
            pageSize={paginationProps?.pageSize || 10}
          />
        </div>
      )}
    </div>
  )
}

import { PaginationProps } from '@nbit/arco'
import Table from '@/components/table'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import { ApiStatusEnum } from '@/constants/market/market-list'
import NoDataImage from '@/components/no-data-image'
import { ColumnProps, TableProps } from '@nbit/arco/es/Table'
import styles from './index.module.css'

export type IProps = TableProps & {
  columns: ColumnProps[]
  data: any[]
  getRowKey: (any) => string
  apiStatus?: ApiStatusEnum
  page?: PaginationProps
  setPage?: any
  onTableChange?: (_page, _sorter) => void
}

export function C2cHrTable({ columns, setPage, data, apiStatus, page, getRowKey, onTableChange }: IProps) {
  const onChangeTable = (_page: PaginationProps, _sorter) => {
    const selectedPageSize = _page.pageSize
    const selectedPage = _page.current

    setPage &&
      setPage(prev => {
        return {
          ...prev,
          pageSize: selectedPageSize,
          current: selectedPage,
        }
      })

    onTableChange && onTableChange(_page, _sorter)
  }

  return (
    <div className={classNames(styles.table)}>
      <Table
        columns={columns}
        data={data || []}
        rowKey={r => getRowKey(r)}
        loading={apiStatus === ApiStatusEnum.fetching}
        showSorterTooltip={false}
        pagination={page}
        onChange={onChangeTable}
        renderPagination={paginationNode => (
          <div className="table-pagination">
            <div>{paginationNode}</div>
            <div className="table-pagination-extra">{t`features_agent_manage_index_5101442`}</div>
          </div>
        )}
        className="table-body"
        noDataElement={
          apiStatus === ApiStatusEnum.succeed && !data.length ? <NoDataImage size="h-24 w-28" /> : <span></span>
        }
      />
    </div>
  )
}

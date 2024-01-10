import classNames from 'classnames'
import { useC2CHrStore } from '@/store/c2c/history-records'
import { C2cHrTable } from '@/features/c2c/trade/history-records/common/table'
import { useRef } from 'react'
import { C2cHistoryRecordsResponse } from '@/typings/api/c2c/history-records'
import styles from './index.module.css'
import { getC2cHistoryRecordsColumns } from './column'
import OrderDetailModal from './order-detail-modal'

export function C2cHistoryRecordsTable() {
  const store = useC2CHrStore()
  const orderDetailModalRef = useRef<Record<'openChartSettingModal', (item: C2cHistoryRecordsResponse) => void>>()
  const columns = getC2cHistoryRecordsColumns(orderDetailModalRef)
  const { apiData: list, setPage, page, apiStatus } = store.hooks.useC2cHistoryRecords()

  return (
    <div className={classNames(styles.scope)}>
      <OrderDetailModal ref={orderDetailModalRef} />
      <C2cHrTable
        columns={columns}
        data={list || []}
        getRowKey={record => `${record.id}`}
        page={page}
        setPage={setPage}
        apiStatus={apiStatus}
        scroll={{
          x: 1200,
        }}
      />
    </div>
  )
}

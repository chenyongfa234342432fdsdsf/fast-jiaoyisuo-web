import C2CTab from '@/features/c2c/trade/c2c-tab'
import classNames from 'classnames'
import { useMount, useUnmount } from 'ahooks'
import { C2cHistoryRecordsHeaderTabs } from '@/features/c2c/trade/history-records/header-tabs'
import { C2cHistoryRecordsTable } from '@/features/c2c/trade/history-records/content-table'
import { C2cHistoryRecordsFilterForm } from '@/features/c2c/trade/history-records/filter-form'
import { useC2CHrStore } from '@/store/c2c/history-records'
import styles from './index.module.css'

function C2cHistoryRecords() {
  const store = useC2CHrStore()
  useUnmount(() => {
    store.resetRequestData()
  })

  return (
    <div className={classNames(styles.scope)}>
      <div className="content-wrapper">
        <div className="header-tab-wrapper">
          <C2cHistoryRecordsHeaderTabs />
        </div>

        <div className="form-filter-wrapper">
          <C2cHistoryRecordsFilterForm />
        </div>

        <div className="content-table-wrapper">
          <C2cHistoryRecordsTable />
        </div>
      </div>
    </div>
  )
}

export function C2cHistoryRecordsLayout() {
  const store = useC2CHrStore()
  useMount(() => {
    store.apis.fetchAllCoins()
    store.apis.fetchTradeArea()
  })
  return (
    <C2CTab activeTab="HistoryOrders">
      <C2cHistoryRecords />
    </C2CTab>
  )
}

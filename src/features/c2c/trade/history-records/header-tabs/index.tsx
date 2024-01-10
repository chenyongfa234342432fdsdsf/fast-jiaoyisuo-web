import classNames from 'classnames'
import Tabs from '@/components/tabs'
import { getC2cHistoryRecordsTab } from '@/constants/c2c/history-records'
import { useC2CHrStore } from '@/store/c2c/history-records'
import { useEffect } from 'react'
import styles from './index.module.css'

export function C2cHistoryRecordsHeaderTabs() {
  const tabList = getC2cHistoryRecordsTab()
  const store = useC2CHrStore()

  useEffect(() => {
    store.resetRequestData({
      statusCd: store.requestData.statusCd,
    })
  }, [store.requestData.statusCd])

  return (
    <div className={classNames(styles.scope)}>
      <Tabs
        value={store.requestData.statusCd}
        classNames="tab-list"
        tabList={tabList}
        onChange={v => {
          store.setRequestData({ statusCd: v.id })
        }}
      />
    </div>
  )
}

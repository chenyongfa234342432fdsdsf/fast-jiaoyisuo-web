import { useState } from 'react'
import { Tabs } from '@nbit/arco'
import styles from './index.module.css'

interface ITab {
  [key: string]: any
}

type IAesstsTabsProps = {
  tabList: ITab[]
  onChangeFn?: (tabItem: any) => void
  defaultActiveTab?: number | string | undefined
}
/** 准备废弃 */
function AesstsTabs({ tabList, onChangeFn, defaultActiveTab }: IAesstsTabsProps) {
  const TabPane = Tabs.TabPane
  const [activeTab, setActiveTab] = useState(defaultActiveTab || '1')

  return (
    <div className={styles.scoped}>
      <Tabs
        activeTab={`${activeTab}`}
        type="rounded"
        onChange={key => {
          setActiveTab(key)
          onChangeFn && onChangeFn(key)
        }}
      >
        {tabList.map(({ title, content, id }) => (
          <TabPane key={id} title={title}>
            {content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}

export default AesstsTabs

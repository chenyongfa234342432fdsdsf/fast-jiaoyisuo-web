import Tabs from '@/components/tabs'
import { useMarketListStore } from '@/store/market/market-list'
import styles from './index.module.css'

function SectorTableCategoryTab() {
  const { getTabList, setSelectedTab, selectedTabId } = useMarketListStore().sectorDetails

  const onTabChange = item => {
    setSelectedTab(item.id)
  }

  return (
    <div className={styles.scoped}>
      <Tabs mode="button" tabList={getTabList()} value={selectedTabId} onChange={onTabChange} />
    </div>
  )
}
export default SectorTableCategoryTab

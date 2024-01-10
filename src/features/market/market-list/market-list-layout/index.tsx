import DebounceSearchBar from '@/components/debounce-search-bar'
import Tabs from '@/components/tabs'
import { getMarketListModuleList, getRouteByModuleTabName, MarketLisModulesEnum } from '@/constants/market/market-list'
import { useMarketListStore } from '@/store/market/market-list'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import { useEffect } from 'react'
import styles from './index.module.css'
import MarketListGlobalSearchTableContent from '../common/market-list-table-content-search'

type IProps = {
  moduleName: MarketLisModulesEnum
  children: React.ReactNode
}

export default function MarketListLayout({ moduleName: moduleId, children }: IProps) {
  const store = useMarketListStore()

  useEffect(() => {
    store.setActiveModule(moduleId)
  }, [moduleId])

  return (
    <div className={styles.scoped}>
      <MarketTitle />

      <div className="module-search-panel">
        <div className="module-tabs">
          <Tabs
            mode="text"
            value={moduleId}
            tabList={getMarketListModuleList()}
            onChange={val => {
              store.setActiveModule(val.id)
              store.resetGlobalTablePaginationConfig()
              store.setSearchInput('')
              store.setIsSearchInputFocused(false)
              link(getRouteByModuleTabName(val.id))
            }}
          />
        </div>

        <div className="global-search-bar">
          <DebounceSearchBar
            placeholder={t`future.funding-history.search-future`}
            onChange={value => {
              store.setSearchInput(value)
              store.resetGlobalTablePaginationConfig()
            }}
            inputValue={store.searchInput}
          />
        </div>
      </div>

      <div className="page-content">
        {store.searchInput ? <MarketListGlobalSearchTableContent /> : <div>{children}</div>}
      </div>
    </div>
  )
}

export function MarketTitle() {
  return (
    <div className="market-title-wrapper">
      <div className="py-10">
        <div className="title-container">
          <div>{t`market`}</div>
        </div>
      </div>
    </div>
  )
}

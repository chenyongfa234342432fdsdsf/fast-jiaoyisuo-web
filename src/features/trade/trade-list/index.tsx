import Tabs from '@/components/tabs'
import { TradeActivityList } from '@/features/market/market-activity/trade-activity-list'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { useState } from 'react'
import { usePageContext } from '@/hooks/use-page-context'
import { TradeListLayout } from './base'
import styles from './index.module.css'

enum TabsTitle {
  /**
   * 最新成交
   */
  latestTransaction = 'latestTransaction',
  /**
   * 我的成交
   */
  realTimeTransaction = 'realTimeTransaction',
  /**
   * 行情异动
   */
  marketFluctuation = 'marketFluctuation',
}

/** 交易页面实时成交 */
function TradeList() {
  const [selectedTab, setSelectedTab] = useState(TabsTitle.latestTransaction)

  const pageContext = usePageContext()

  const { pathname } = pageContext.urlParsed

  const setChangeSubs = pathname => {
    const pathnameArr = pathname?.split('/')
    return pathnameArr?.[pathnameArr.length - 2]
  }

  const tabs = [
    {
      title: t`features/trade/trade-list/base-0`,
      content: <TradeListLayout id={selectedTab} />,
      id: TabsTitle.latestTransaction,
    },
    {
      title: t`features_trade_trade_deal_tradedeal_5101192`,
      content: <TradeListLayout id={selectedTab} />,
      id: TabsTitle.realTimeTransaction,
    },
    {
      title: t`features_market_market_time_axis_index_2523`,
      content: <TradeActivityList />,
      id: TabsTitle.marketFluctuation,
    },
  ]

  const showTab =
    setChangeSubs(pathname) === 'futures' ? tabs.filter(item => item.id === TabsTitle.latestTransaction) : tabs

  const onTabChange = (item: typeof tabs[0]) => {
    setSelectedTab(item.id)
  }

  return (
    <div className={styles['trade-list-outer-layout-wrapper']}>
      <div className="header-tabs-wrapper">
        <Tabs
          tabList={showTab}
          classNames="header-tabs"
          value={selectedTab}
          idMap="id"
          onChange={onTabChange}
          mode="text"
        />
      </div>
      <div className="content-wrapper">
        {showTab?.map(tab => {
          return (
            <div
              key={tab.id}
              className={classNames('content-wrapper-container', {
                hidden: selectedTab !== tab.id,
              })}
            >
              {selectedTab === tab.id && tab.content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TradeList

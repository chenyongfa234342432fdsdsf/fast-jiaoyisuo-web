import MCTabs from '@/components/tabs'
import {
  FundingHistoryTabIdEnum,
  FundingHistoryTypeEnum,
  getFundingHistoryTabIdEnumName,
} from '@/constants/future/funding-history'
import { usePageContext } from '@/hooks/use-page-context'
import { Empty, Tabs } from '@nbit/arco'
import { t } from '@lingui/macro'
import { useUpdateEffect } from 'ahooks'
import { useState } from 'react'
import { link } from '@/helper/link'
import { IFuture } from '@/typings/api/future/common'
import { getFutureFundingRatePagePath } from '@/helper/route'
import FundingRate from './funding-rate'
import FundingIndex from './index/index'
import InsuranceFund from './insurance-fund'

function getTabAndTypes() {
  const tabs = [FundingHistoryTabIdEnum.usdt].map(id => {
    return {
      id,
      title: getFundingHistoryTabIdEnumName(id),
    }
  })
  const types = [
    {
      id: FundingHistoryTypeEnum.fundingRate,
      title: t`future.funding-history.types.funding-rate`,
      component: FundingRate,
    },
    {
      id: FundingHistoryTypeEnum.index,
      title: t`future.funding-history.types.index`,
      component: FundingIndex,
    },
    {
      id: FundingHistoryTypeEnum.insuranceFund,
      title: t`features_future_funding_history_layout_tvo7e2zcq6`,
      component: InsuranceFund,
    },
  ]
  return {
    tabs,
    types,
  }
}

export function FundingHistoryLayout() {
  const { tabs, types } = getTabAndTypes()
  const pageContext = usePageContext()
  const [selectedTabId, setSelectedTabId] = useState<any>(
    !pageContext.urlPathname.includes('quarterly') ? FundingHistoryTabIdEnum.usdt : FundingHistoryTabIdEnum.coin
  )
  const isEmpty = selectedTabId === FundingHistoryTabIdEnum.coin
  const selectedTypeId = pageContext.routeParams.type
  const selectedType = types.find(item => item.id === selectedTypeId)!
  const onChangeTypes = (typeId: FundingHistoryTypeEnum) => {
    link(
      getFutureFundingRatePagePath({
        type: typeId,
      }),
      {
        overwriteLastHistoryEntry: true,
      }
    )
  }
  useUpdateEffect(() => {
    link(
      getFutureFundingRatePagePath({
        tab: selectedTabId,
      }),
      {
        overwriteLastHistoryEntry: true,
      }
    )
  }, [selectedTabId])
  const [selectedFuture, setSelectedFuture] = useState<IFuture>(null as any)

  return (
    <div>
      <div className="bg-card_bg_color_01 py-10">
        <div className="mx-auto max-w-7xl px-10">
          <h1 className="text-4xl">{t`future.funding-history.title`}</h1>
        </div>
      </div>
      <div className="bg-bg_color">
        <div className="mx-auto max-w-7xl px-10">
          <div className="hidden">
            <MCTabs tabList={tabs} mode="button" value={selectedTabId} onChange={i => setSelectedTabId(i.id)} />
          </div>
          {isEmpty && (
            <div className="py-20">
              <Empty description={t`future.funding-history.tab-empty`} />
            </div>
          )}
          {!isEmpty && (
            <>
              <div className="py-4">
                <Tabs activeTab={selectedTypeId as any} onChange={onChangeTypes as any}>
                  {types.map(item => {
                    return <Tabs.TabPane key={item.id} title={item.title} />
                  })}
                </Tabs>
              </div>
              {selectedType && (
                <selectedType.component
                  key={selectedType.id}
                  selectedFuture={selectedFuture}
                  onChange={setSelectedFuture}
                  type={selectedTabId}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

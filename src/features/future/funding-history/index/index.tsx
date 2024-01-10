import Link from '@/components/link'
import {
  FundingHistoryIndexPriceTypeEnum,
  FundingHistoryTabIdEnum,
  FutureHelpCenterEnum,
  getFundingHistoryIndexPriceTypeEnumName,
} from '@/constants/future/funding-history'
import { IFuture } from '@/typings/api/future/common'
import { t } from '@lingui/macro'
import React, { FC, useState } from 'react'
import { Select } from '@nbit/arco'
import Tabs from '@/components/tabs'
import { usePageContext } from '@/hooks/use-page-context'
import AsyncSuspense from '@/components/async-suspense'
import ErrorBoundary from '@/components/error-boundary'
import { useCommonStore } from '@/store/common'
import { useHelpCenterUrl } from '@/hooks/use-help-center-url'
import FutureSelector from '../future-selector'
import styles from './index.module.css'
import { PriceListTable, IngredientTable } from './table'

const ChartRate = React.lazy(() => import('@/components/chart/chart-rate'))

function usePriceLink(type: FundingHistoryIndexPriceTypeEnum) {
  const indexPriceUrl = useHelpCenterUrl(FutureHelpCenterEnum.indexPrice)
  const markPriceUrl = useHelpCenterUrl(FutureHelpCenterEnum.markPrice)

  return {
    [FundingHistoryIndexPriceTypeEnum.index]: {
      href: indexPriceUrl,
      text: t`future.funding-history.index.index-detail`,
    },
    [FundingHistoryIndexPriceTypeEnum.mark]: {
      href: markPriceUrl,
      text: t`future.funding-history.index.mark-detail`,
    },
  }[type]
}
const FundingIndex: FC<{
  type: FundingHistoryTabIdEnum
  selectedFuture: IFuture
  onChange: (future: IFuture) => any
  // eslint-disable-next-line react/function-component-definition
}> = ({ type, selectedFuture, onChange }) => {
  const [selectedPriceType, setSelectedPriceType] = useState<FundingHistoryIndexPriceTypeEnum>(
    FundingHistoryIndexPriceTypeEnum.index
  )
  const priceTypes = [FundingHistoryIndexPriceTypeEnum.index, FundingHistoryIndexPriceTypeEnum.mark].map(id => {
    return {
      value: id,
      label: getFundingHistoryIndexPriceTypeEnumName(id),
    }
  })
  const isIndexPriceType = selectedPriceType === FundingHistoryIndexPriceTypeEnum.index
  const priceLink = usePriceLink(selectedPriceType)
  const indexTableTypes = [
    {
      value: 0,
      label: t`future.funding-history.index.table-type.price`,
      component: PriceListTable,
    },
    {
      value: 1,
      label: t`future.funding-history.index.table-type.ingredient`,
      component: IngredientTable,
    },
  ]
  const pageContext = usePageContext()
  const [selectedTableType, setSelectedTableType] = useState(indexTableTypes[0].value)
  const SelectedTableComponent = isIndexPriceType
    ? indexTableTypes.find(item => item.value === selectedTableType)!.component
    : PriceListTable
  const onChangeTableTypes = (tab: typeof indexTableTypes[0]) => {
    setSelectedTableType(Number(tab.value))
  }

  const contractList = {
    index: 'perpetual_index_kline',
    mark: 'perpetual_market_kline',
  }

  const commonState = useCommonStore()

  return (
    <div className={styles['index-price-wrapper']}>
      <div className="px-4 flex items-center justify-between">
        <div className="flex">
          <FutureSelector
            defaultId={pageContext.urlParsed.search?.tradeId}
            value={selectedFuture}
            onChange={onChange}
            type={type}
          />
          <div className="ml-4">
            <Select options={priceTypes} value={selectedPriceType} onChange={setSelectedPriceType} />
          </div>
        </div>
        <Link href={priceLink.href} className="text-sm text-brand_color">
          {priceLink.text} &gt;
        </Link>
      </div>
      {selectedFuture && (
        <div className="chart-rate-wrap">
          <AsyncSuspense>
            <ErrorBoundary>
              <ChartRate
                currentCoinInfo={{ currentCoin: selectedFuture }}
                theme={commonState.theme}
                currentPriceType={contractList[selectedPriceType]}
              />
            </ErrorBoundary>
          </AsyncSuspense>
        </div>
      )}

      {isIndexPriceType ? (
        <div className="py-4">
          <Tabs
            titleMap="label"
            idMap="value"
            mode="line"
            tabList={indexTableTypes}
            value={selectedTableType as any}
            onChange={onChangeTableTypes}
          />
        </div>
      ) : (
        <div className="py-2"></div>
      )}
      <SelectedTableComponent type={selectedPriceType} selectedFuture={selectedFuture} />
    </div>
  )
}

export default FundingIndex

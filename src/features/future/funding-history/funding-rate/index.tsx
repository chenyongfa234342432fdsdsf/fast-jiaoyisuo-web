import { t } from '@lingui/macro'
import { useCountDown, useCreation, useRequest, useUpdateEffect } from 'ahooks'
import dayjs from 'dayjs'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Pagination, Radio, TableColumnProps } from '@nbit/arco'
import Table from '@/components/table'
import { ICurrentFundingRate, IFundingRate, IFundingRateHistoryReq } from '@/typings/api/future/funding-history'
import { IFuture } from '@/typings/api/future/common'
import { FundingHistoryTabIdEnum, FutureHelpCenterEnum } from '@/constants/future/funding-history'
import Link from '@/components/link'
import { queryCurrentFundingRate, queryFundingRateHistory } from '@/apis/future/funding-history'
import { fillZero, getFutureFundingRateNextDate, getPeriodDayTime } from '@/helper/date'
import { useCommonStore } from '@/store/common'
import { envIsServer } from '@/helper/env'
import { useTablePagination } from '@/hooks/use-table-pagination'
import { usePageContext } from '@/hooks/use-page-context'
import { useUserStore } from '@/store/user'
import { UserUpsAndDownsColorEnum } from '@/constants/user'
import { useContractMarketStore } from '@/store/market/contract'
import { getPercentDisplay } from '@/helper/common'
import { sortMarketChartData } from '@/helper/market'
import { useHelpCenterUrl } from '@/hooks/use-help-center-url'
import FutureSelector from '../future-selector'
import styles from './index.module.css'
import commonStyles from '../common.module.css'

function useRateList(params: IFundingRateHistoryReq) {
  const defaultData = { data: [], total: 0, current: {} as ICurrentFundingRate }
  const {
    data: rateList = defaultData,
    run,
    loading,
  } = useRequest(
    async () => {
      if (!params.tradePairId) {
        return defaultData
      }
      const [historyRes, currentRes] = await Promise.all([
        queryFundingRateHistory(params),
        queryCurrentFundingRate({
          id: params.tradePairId?.toString(),
        }),
      ])
      if (!historyRes.data || !currentRes.data) {
        return defaultData
      }

      return {
        data: historyRes.data.list,
        total: historyRes.data.total,
        current: currentRes.data,
      }
    },
    {
      manual: true,
    }
  )
  useEffect(() => {
    run()
  }, [params])

  return {
    rateList,
    loading,
  }
}
function getRateListTableColumns(): TableColumnProps<IFundingRate>[] {
  return [
    {
      title: t`future.funding-history.funding-rate.column.time`,
      render: (_, item) => {
        return dayjs(item.timeIndex).format('YYYY-MM-DD HH:mm:ss')
      },
    },
    {
      title: t`future.funding-history.funding-rate.column.interval`,
      align: 'center',
      render: (_, item) => {
        return `${item.settleSpan} ${t`features_future_funding_history_funding_rate_index_5101548`}`
      },
    },
    {
      title: t`future.funding-history.funding-rate.column.rate`,
      align: 'right',
      render: (_, item) => {
        return getPercentDisplay(item.feeRate)
      },
    },
  ]
}

function RateInfoChart({ selectedFuture }: { selectedFuture: IFuture }) {
  const [range, setRange] = useState(8)
  const commonState = useCommonStore()
  const rangeList = [
    {
      label: t`future.funding-history.funding-rate.range.7d`,
      value: 8,
    },
    {
      label: t`future.funding-history.funding-rate.range.14d`,
      value: 15,
    },
  ]
  const params: IFundingRateHistoryReq = useMemo(() => {
    return {
      tradePairId: selectedFuture?.id || 0,
      startTime: getPeriodDayTime(range).start,
      // 最多 15 * 24 条数据，这里取一点余量
      pageSize: 400,
    }
  }, [selectedFuture, range])
  const { rateList } = useRateList(params)
  const current = rateList.current
  const [, { hours, seconds, minutes }] = useCountDown({
    targetDate: getFutureFundingRateNextDate(current.settleTimes || '', current.settleSpan!),
  })
  const lineChartData =
    rateList.data.map(item => {
      return {
        time: item.timeIndex,
        value: Number(item.feeRate) * 100,
      }
    }) || []
  const LineChart = useCreation(() => {
    return lazy(() => import('@nbit/chart-web'))
    // return lazy(() => import('@/components/chart/src'))
  }, [])

  const useStore = useUserStore()
  const { personalCenterSettings } = useStore

  const colors = personalCenterSettings.colors || UserUpsAndDownsColorEnum.greenUpRedDown
  const marketState = useContractMarketStore()
  const { currentCoin } = marketState

  const { priceOffset = 2, amountOffset = 2 } = currentCoin
  const text = t({
    id: 'future.funding-history.funding-rate.rate-info',
    values: {
      0: getPercentDisplay(selectedFuture?.plusFeeRate),
      1: getPercentDisplay(selectedFuture?.minusFeeRate),
    },
  })

  return (
    <div>
      <div className={styles['rate-info-chart-wrapper']}>
        <div className="header">
          <div className="flex items-center">
            <span className="text-sm font-medium">
              {t`future.funding-history.funding-rate.funding-rate`}: {getPercentDisplay(current?.feeRate)}
            </span>
            <span className="text-xs text-text_color_03 ml-4">{text}</span>
          </div>
          <div className={commonStyles['radio-group-wrapper']}>
            <Radio.Group value={range} type="button" onChange={setRange as any}>
              {rangeList.map(item => {
                return (
                  <Radio key={item.value} value={item.value}>
                    {item.label}
                  </Radio>
                )
              })}
            </Radio.Group>
          </div>
        </div>
        <div className="flex text-xs py-3">
          <div className="mr-6">
            {t`future.funding-history.funding-rate.countdown`}: {fillZero(hours)}:{fillZero(minutes)}:
            {fillZero(seconds)}
          </div>
          <div className="mr-6">
            {t`future.funding-history.funding-rate.immediate-rate`}: {getPercentDisplay(current.feeRate)}
          </div>
          <div>
            {t`future.funding-history.funding-rate.base-rate`}: {getPercentDisplay(current.interestRate as any)}
          </div>
        </div>
        <div style={{ height: '300px' }}>
          {envIsServer ? (
            <div></div>
          ) : (
            <Suspense fallback={null}>
              <LineChart
                theme={commonState.theme}
                seriesData={sortMarketChartData(lineChartData as any) as any}
                offset={{ priceOffset, amountOffset }}
                colors={colors}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  )
}
function RateListTable({ selectedFuture }: { selectedFuture?: IFuture }) {
  const params: IFundingRateHistoryReq = useCreation(() => {
    return {
      tradePairId: selectedFuture?.id || 0,
    }
  }, [selectedFuture])
  const { tablePaginationProps, data, loading } = useTablePagination({
    search: async searchParams => {
      if (!selectedFuture) return
      return queryFundingRateHistory(searchParams)
    },
    defaultPageSize: 20,
    params,
  })
  const columns = getRateListTableColumns()
  return (
    <div className={commonStyles['table-wrapper']}>
      <Table
        border={false}
        rowKey={i => i.timeIndex}
        columns={columns}
        data={data}
        loading={loading}
        pagination={tablePaginationProps}
      />
    </div>
  )
}

function FundingRate({
  type,
  selectedFuture,
  onChange,
}: {
  type: FundingHistoryTabIdEnum
  selectedFuture: IFuture
  onChange: (future: IFuture) => any
}) {
  const pageContext = usePageContext()
  const fundingRateUrl = useHelpCenterUrl(FutureHelpCenterEnum.fundingRate)

  return (
    <div className={styles['funding-rate-wrapper']}>
      <div className="py-4 flex items-center justify-between">
        <FutureSelector
          defaultId={pageContext.urlParsed.search?.tradeId}
          value={selectedFuture}
          onChange={onChange}
          type={type}
        />
        <Link href={fundingRateUrl} className="text-sm text-brand_color">
          {t`future.funding-history.funding-rate.detail`} &gt;
        </Link>
      </div>
      <RateInfoChart selectedFuture={selectedFuture} />
      <RateListTable selectedFuture={selectedFuture} />
    </div>
  )
}

export default FundingRate

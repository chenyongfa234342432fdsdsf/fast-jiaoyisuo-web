import {
  queryInsuranceFundCurrent,
  queryInsuranceFundLogs,
  queryInsuranceFundTrend,
} from '@/apis/future/funding-history'
import { FundingHistoryTabIdEnum } from '@/constants/future/funding-history'
import { formatDate } from '@/helper/date'
import { IFuture } from '@/typings/api/future/common'
import { IFutureInsuranceFundLog, IQueryInsuranceFundTrendReq } from '@/typings/api/future/funding-history'
import { t } from '@lingui/macro'
import { useRequest } from 'ahooks'
import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { formatCurrency, formatNumberDecimalDelZero } from '@/helper/decimal'
import { IncreaseTag } from '@nbit/react'
import { Radio, Spin, TableColumnProps } from '@nbit/arco'
import Table from '@/components/table'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { useTablePagination } from '@/hooks/use-table-pagination'
import styles from './index.module.css'
import commonStyles from '../common.module.css'

const LineChart = lazy(() => import('./line-chart'))

function getFundListTableColumns(): TableColumnProps<IFutureInsuranceFundLog>[] {
  return [
    {
      title: t`future.funding-history.funding-rate.column.time`,
      render: (_, item) => {
        return formatDate(item.settleTime)
      },
    },
    {
      title: t`features_future_funding_history_insurance_fund_index_wud_9r0kel`,
      align: 'center',
      render: (_, item) => {
        return <IncreaseTag kSign hasColor={false} value={item.changeAsset} />
      },
    },
    {
      title: t`features_future_funding_history_insurance_fund_index_afgsoiemtd`,
      align: 'right',
      render: (_, item) => {
        return <IncreaseTag hasPrefix={false} kSign hasColor={false} value={item.totalAsset} />
      },
    },
  ]
}
function RateListTable() {
  const { tablePaginationProps, data, loading } = useTablePagination({
    search: async searchParams => {
      return queryInsuranceFundLogs(searchParams) as any
    },
    defaultPageSize: 20,
  })
  const columns = getFundListTableColumns()
  return (
    <div className={commonStyles['table-wrapper']}>
      <Table
        border={false}
        rowKey={i => i.settleTime}
        columns={columns}
        data={data}
        loading={loading}
        pagination={tablePaginationProps}
      />
    </div>
  )
}
function useFundList(params: IQueryInsuranceFundTrendReq) {
  const defaultData = { data: [] as IFutureInsuranceFundLog[], current: '' }
  const {
    data: rateList = defaultData,
    run,
    loading,
  } = useRequest(
    async () => {
      const [historyRes, currentRes] = await Promise.all([
        queryInsuranceFundTrend(params),
        queryInsuranceFundCurrent({}),
      ])
      if (!historyRes.data || !currentRes.data) {
        return defaultData
      }

      return {
        data: historyRes.data.list,
        current: currentRes.data.totalAsset,
      }
    },
    {
      manual: true,
    }
  )
  useEffect(() => {
    run()
  }, [params])

  return [rateList, loading] as const
}

function FundChart() {
  const [range, setRange] = useState(7)
  const rangeList = [
    {
      label: t`future.funding-history.funding-rate.range.7d`,
      value: 7,
    },
    {
      label: t`future.funding-history.funding-rate.range.30d`,
      value: 30,
    },
  ]
  const params: IQueryInsuranceFundTrendReq = useMemo(() => {
    return {
      day: range as any,
    }
  }, [range])
  const [rateList, loading] = useFundList(params)
  const lineChartData =
    rateList.data.reverse().map(item => {
      return {
        x: item.settleTime,
        y: Number(item.totalAsset),
      }
    }) || []
  const { futuresCurrencySettings } = useAssetsFuturesStore()
  const symbol = futuresCurrencySettings.currencySymbol || 'USD'
  const text = t({
    id: 'features_future_funding_history_insurance_fund_index_lrcvbuomk6',
    values: { 0: symbol },
  })

  return (
    <div className={styles['rate-info-chart-wrapper']}>
      <div className="px-4 flex justify-between mb-2">
        <div className="mb-3 font-semibold text-base">
          <span className="mr-1 ">{text}</span>
          <span>{formatCurrency(formatNumberDecimalDelZero(rateList.current, futuresCurrencySettings.offset))}</span>
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
      <div className="h-60 px-4 pb-4">
        <Spin loading={loading} className="w-full h-full">
          {lineChartData.length > 0 ? (
            <Suspense fallback={null}>
              <LineChart symbol={symbol} data={lineChartData} digit={futuresCurrencySettings.offset} />
            </Suspense>
          ) : (
            <div className="h-full"></div>
          )}
        </Spin>
      </div>
    </div>
  )
}

type IFundingRateProps = {
  type: FundingHistoryTabIdEnum
  selectedFuture: IFuture
  onChange: (future: IFuture) => any
}
function InsuranceFund({ selectedFuture }: IFundingRateProps) {
  return (
    <div className="pt-4">
      <FundChart />
      <div className="h-4"></div>
      <RateListTable />
    </div>
  )
}

export default InsuranceFund

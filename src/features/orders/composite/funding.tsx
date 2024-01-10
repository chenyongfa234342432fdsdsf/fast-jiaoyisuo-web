import { t } from '@lingui/macro'
import { useOrderCommonParams } from '@/hooks/features/order'
import { Button } from '@nbit/arco'
import { queryFutureFundingFees, queryFutureOrderList } from '@/apis/order'
import { futureOrderMapParamsFn } from '@/helper/order/future'
import { useRef } from 'react'
import { OrderDateFiltersInTable } from '../filters/base'
import { FutureOrderModuleContext, useCreateOrderModuleContext } from '../order-module-context'
import { OrderTableLayout } from '../order-table-layout'
import { getFutureFundingColumns } from '../order-columns/funding'

export function FutureOrderFundingFees() {
  const [commonParams, setCommonParams] = useOrderCommonParams()
  const contextValue = useCreateOrderModuleContext({} as any)
  const refresh = () => {
    contextValue.refreshEvent$.emit()
  }
  const reset = () => {
    setCommonParams({} as any, true /** reset */)
  }
  const search = async (pageParams: any) => {
    const res = await queryFutureFundingFees({
      startTime: commonParams.beginDateNumber?.toString(),
      endTime: commonParams.endDateNumber?.toString(),
      ...pageParams,
    })
    if (res.isOk && res.data) {
      return {
        data: res.data.list,
        total: res.data.total,
      }
    }
    return {
      data: [],
      total: 0,
    }
  }
  const staticRefs = useRef({
    tableLayoutProps: {
      tableHeight: 500,
    },
  })
  const columns = getFutureFundingColumns()

  return (
    <FutureOrderModuleContext.Provider value={contextValue}>
      <div>
        <div className="flex px-8 mt-4">
          <OrderDateFiltersInTable params={commonParams} onChange={setCommonParams} filterOptions={[]} />
          <div className="mb-filter-block">
            <Button className="mr-4 h-10" onClick={refresh} type="primary">
              {t`assets.financial-record.search.search`}
            </Button>
            <Button className="h-10" onClick={reset}>
              {t`user.field.reuse_47`}
            </Button>
          </div>
        </div>
        <OrderTableLayout
          {...staticRefs.current.tableLayoutProps}
          columns={columns}
          autoSetWidth={false}
          params={commonParams}
          onlyTable
          orderModuleContext={contextValue}
          filters={null}
          search={search as any}
        />
      </div>
    </FutureOrderModuleContext.Provider>
  )
}

import { IOrderTableLayoutProps, OrderTableLayout } from '@/features/orders/order-table-layout'
import { useCreation, useSetState, useUpdateEffect } from 'ahooks'
import { getFutureOrderDefaultParams } from '@/features/orders/filters/future'
import { queryFutureOrderList } from '@/apis/order'
import { IFutureOrderItem, IQueryFutureOrderListReq } from '@/typings/api/order'
import { FutureNormalOrderStatusEnum, OrderTabTypeEnum } from '@/constants/order'
import { getFutureColumns } from '@/features/orders/order-columns/future'
import { useOrderFutureStore } from '@/store/order/future'
import { futureOrderMapParamsFn } from '@/helper/order/future'
import { useFutureOrderModuleContext } from '../order-module-context'

export type IFutureOrderProps = {
  tab: any
  orders?: any[]
  inTrade: boolean
  customParams: Partial<IQueryFutureOrderListReq>
  tableLayoutProps?: Partial<IOrderTableLayoutProps<any, any>>
  onListChange?: (list: any[]) => void
  columnsMap?: Parameters<typeof getFutureColumns>[3]
}
export function FutureHoldingOrder({ customParams, inTrade, tableLayoutProps = {} }: Partial<IFutureOrderProps>) {
  const state = useOrderFutureStore()
  const defaultParams = getFutureOrderDefaultParams(OrderTabTypeEnum.holdings)
  const [params, setParams] = useSetState<IQueryFutureOrderListReq>(defaultParams)
  const columns = getFutureColumns(OrderTabTypeEnum.holdings, params, inTrade)
  const contextValue = useFutureOrderModuleContext()

  const orders = state.positionList
  useUpdateEffect(() => {
    setParams({
      ...params,
      ...customParams,
    })
  }, [customParams])

  return (
    <OrderTableLayout
      orderModuleContext={contextValue}
      {...tableLayoutProps}
      columns={columns}
      params={params}
      propData={orders}
      filters={null}
    />
  )
}
export function FutureOrder({
  tab,
  orders,
  customParams,
  onListChange,
  columnsMap,
  inTrade,
  tableLayoutProps = {},
}: IFutureOrderProps) {
  const contextValue = useFutureOrderModuleContext()
  const search = async (searchParams: any) => {
    const res = await queryFutureOrderList(
      futureOrderMapParamsFn({
        ...searchParams,
        ...customParams,
        tab,
      })
    )
    onListChange?.(res?.data?.list || [])
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
  const columns = useCreation(() => {
    return getFutureColumns(tab, customParams, inTrade, columnsMap)
  }, [tab, customParams, inTrade, columnsMap])
  if (tab === OrderTabTypeEnum.holdings) {
    return <FutureHoldingOrder tableLayoutProps={tableLayoutProps} customParams={customParams} />
  }
  const getRowClassName = (record: IFutureOrderItem) => {
    if (
      [FutureNormalOrderStatusEnum.systemCanceled, FutureNormalOrderStatusEnum.manualCanceled].includes(
        record.statusCd as any
      )
    ) {
      return 'disabled-row'
    }
    return ''
  }

  return (
    <OrderTableLayout
      {...tableLayoutProps}
      columns={columns}
      isFuture
      orderModuleContext={contextValue}
      params={customParams}
      propData={orders}
      filters={null}
      getRowClassName={getRowClassName}
      search={search}
      autoSetWidth
    />
  )
}

import { IOrderTableLayoutProps, OrderTableLayout } from '@/features/orders/order-table-layout'
import { useCreation, useSetState, useUpdateEffect } from 'ahooks'
import {
  querySpotNormalHistoryOrderList,
  querySpotPlanOpenOrderList,
  querySpotPlanHistoryOrderList,
  querySpotNormalOpenOrderList,
} from '@/apis/order'
import { EntrustTypeEnum, OrderStatusEnum, OrderTabTypeEnum } from '@/constants/order'
import { getSpotColumns } from '@/features/orders/order-columns/spot'
import { IQuerySpotOrderReqParams } from '@/typings/api/order'
import { normalOrderMapParamsFn } from '@/helper/order/spot'
import { useSpotOrderModuleContext } from '../order-module-context'

type IQueryOrderListReq = IQuerySpotOrderReqParams

export type ISpotOrderProps = {
  tab: any
  isNormalOrder?: boolean
  orders?: any[]
  onListChange?: (list: any[]) => void
  customParams?: Partial<IQueryOrderListReq>
  columnsMap?: Parameters<typeof getSpotColumns>[3]
  tableLayoutProps?: Partial<IOrderTableLayoutProps<any, any>>
}
export function SpotOrder({
  tab,
  columnsMap,
  orders,
  isNormalOrder,
  tableLayoutProps = {},
  customParams,
  onListChange,
}: ISpotOrderProps) {
  const defaultParams: IQueryOrderListReq = {
    ...customParams,
  }
  const [params, setParams] = useSetState<IQueryOrderListReq>(defaultParams)
  const search = async (searchParams: any) => {
    const fn: any =
      tab === OrderTabTypeEnum.current
        ? isNormalOrder
          ? querySpotNormalOpenOrderList
          : querySpotPlanOpenOrderList
        : isNormalOrder
        ? querySpotNormalHistoryOrderList
        : querySpotPlanHistoryOrderList
    const res = await fn(
      normalOrderMapParamsFn({
        ...searchParams,
        ...params,
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
    return getSpotColumns(tab, params, tableLayoutProps.inTrade, columnsMap)
  }, [tab, params, tableLayoutProps.inTrade, columnsMap])
  useUpdateEffect(() => {
    setParams({
      ...params,
      ...customParams,
    })
  }, [customParams])
  const contextValue = useSpotOrderModuleContext()

  return (
    <OrderTableLayout
      {...tableLayoutProps}
      columns={columns}
      params={params}
      onlyTable
      orderModuleContext={contextValue}
      propData={orders}
      expandProps={{
        rowExpandable(record) {
          if (tab === OrderTabTypeEnum.current) {
            return record.status === OrderStatusEnum.partlySucceed
          }
          return (
            ([OrderStatusEnum.entrusted].includes(record.status) && record.placeOrderType === EntrustTypeEnum.normal) ||
            ([OrderStatusEnum.partlyCanceled, OrderStatusEnum.settled].includes(record.status) &&
              record.placeOrderType === EntrustTypeEnum.plan)
          )
        },
      }}
      filters={null}
      search={search as any}
    />
  )
}

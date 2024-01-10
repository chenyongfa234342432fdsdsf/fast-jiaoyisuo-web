import PopupSearchSelect from '@/components/popup-search-select'
import {
  EntrustTypeEnum,
  FutureHoldingOrderDirectionEnum,
  FutureMarginOrderTypeEnum,
  FutureOrderDirectionEnum,
  FutureOrderReasonEnum,
  FutureOrderStatusEnum,
  FutureOrderStopLimitTypeEnum,
  FutureOrderSystemTypeEnum,
  FuturePlanOrderStatusEnum,
  getFutureHoldingOrderDirectionEnumName,
  getFutureMarginOrderTypeEnumName,
  getFutureOrderDirectionEnumName,
  getFutureOrderEntrustTypeName,
  getFutureOrderStatusEnumName,
  OrderTabTypeEnum,
} from '@/constants/order'
import { enumValuesToOptions } from '@/helper/order'
import { useContractMarketStore } from '@/store/market/contract'
import { baseOrderFutureStore, useOrderFutureStore } from '@/store/order/future'
import { IQueryFutureOrderListReq } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { useState } from 'react'
import { IFiltersProps, IOrderFilterOption, OrderFilterSelect } from './base'

type IPrams = IQueryFutureOrderListReq

export enum FutureOrderParamsKeyEnum {
  detailSide = 'detailSide',
  side = 'side',
  currency = 'currency',
  timeRange = 'timeRange',
  // 组合而成的订单类型
  orderType = 'orderType',
  marginType = 'type',
  compositeStatus = 'compositeStatus',
}

function getBaseFilterOptions(params: IPrams) {
  const baseFilters: IOrderFilterOption[] = [
    {
      paramsKey: FutureOrderParamsKeyEnum.detailSide,
      label: t`features/orders/filters/future-0`,
      options: enumValuesToOptions(
        [
          FutureOrderDirectionEnum.all,
          FutureOrderDirectionEnum.openBuy,
          FutureOrderDirectionEnum.closeBuy,
          FutureOrderDirectionEnum.openSell,
          FutureOrderDirectionEnum.closeSell,
        ],
        getFutureOrderDirectionEnumName
      ),
    },
    {
      paramsKey: FutureOrderParamsKeyEnum.side,
      label: t`order.columns.direction`,
      options: enumValuesToOptions(
        [
          FutureHoldingOrderDirectionEnum.all,
          FutureHoldingOrderDirectionEnum.buy,
          FutureHoldingOrderDirectionEnum.sell,
        ],
        getFutureHoldingOrderDirectionEnumName
      ),
    },
    {
      paramsKey: FutureOrderParamsKeyEnum.timeRange,
      label: t`order.filters.timeRange.label`,
      options: [
        {
          // 这里无需使用 enum
          value: 7,
          label: t`order.filters.timeRange.week`,
        },
        {
          value: 30,
          label: t`order.filters.timeRange.month`,
        },
        {
          value: 365,
          label: t`order.filters.timeRange.1y`,
        },
      ],
    },
    {
      paramsKey: FutureOrderParamsKeyEnum.orderType,
      label: t`order.columns.entrustType`,
      options: [],
    },
    {
      paramsKey: FutureOrderParamsKeyEnum.compositeStatus,
      label: t`order.filters.status.label`,
      options: [],
    },
    {
      paramsKey: FutureOrderParamsKeyEnum.marginType,
      label: t`assets.financial-record.search.type`,
      options: enumValuesToOptions(
        [
          FutureMarginOrderTypeEnum.all,
          FutureMarginOrderTypeEnum.manual,
          FutureMarginOrderTypeEnum.lever,
          FutureMarginOrderTypeEnum.auto,
        ],
        getFutureMarginOrderTypeEnumName
      ),
    },
  ]

  return baseFilters
}
/** 传入 id 数组 和可选映射函数返回筛选和重新排序后的列 */
function getFutureOrderBaseFilterOptions(keys: FutureOrderParamsKeyEnum[], params: IPrams) {
  return getBaseFilterOptions(params)
    .filter(filter => keys.includes(filter.paramsKey as any))
    .sort((a, b) => keys.indexOf(a.paramsKey) - keys.indexOf(b.paramsKey))
}
export function getOrderTypeOptions(tab: OrderTabTypeEnum): {
  label: string
  value: any
}[] {
  function typesToOption(type: string[]) {
    return {
      value: type.join(':'),
      label:
        getFutureOrderEntrustTypeName(type[0] as any, type[1] as any, FutureOrderStopLimitTypeEnum) ||
        t`constants/order-13`,
    }
  }
  const historyOrderTypes = [
    [FutureOrderSystemTypeEnum.market, FutureOrderStopLimitTypeEnum.none],
    [FutureOrderSystemTypeEnum.limit, FutureOrderStopLimitTypeEnum.none],
    [FutureOrderSystemTypeEnum.limit, FutureOrderStopLimitTypeEnum.planLimit],
    [FutureOrderSystemTypeEnum.market, FutureOrderStopLimitTypeEnum.loss],
    [FutureOrderSystemTypeEnum.market, FutureOrderStopLimitTypeEnum.profit],
    [FutureOrderSystemTypeEnum.limit, FutureOrderStopLimitTypeEnum.loss],
    [FutureOrderSystemTypeEnum.limit, FutureOrderStopLimitTypeEnum.profit],
    [
      [
        FutureOrderSystemTypeEnum.liquidateBuy,
        FutureOrderSystemTypeEnum.liquidateSell,
        FutureOrderSystemTypeEnum.liquidateOther,
      ].join(','),
      FutureOrderStopLimitTypeEnum.none,
    ],
    [FutureOrderSystemTypeEnum.forceReduce, FutureOrderStopLimitTypeEnum.none],
  ].map(type => typesToOption(type as string[]))
  const currentOrderTypes = [
    [FutureOrderSystemTypeEnum.limit, FutureOrderStopLimitTypeEnum.none],
    [FutureOrderSystemTypeEnum.limit, FutureOrderStopLimitTypeEnum.planLimit],
    [FutureOrderSystemTypeEnum.limit, FutureOrderStopLimitTypeEnum.loss],
    [FutureOrderSystemTypeEnum.limit, FutureOrderStopLimitTypeEnum.profit],
  ].map(type => typesToOption(type as string[]))
  const map = {
    [OrderTabTypeEnum.history]: [
      {
        label: t`common.all`,
        value: '',
      },
      ...historyOrderTypes,
    ],
    [OrderTabTypeEnum.current]: [
      {
        label: t`common.all`,
        value: '',
      },
      ...currentOrderTypes,
    ],
  }

  return map[tab] || []
}
function getStatusOptions(tab: OrderTabTypeEnum) {
  const historyStatusOptions = [
    {
      label: t`common.all`,
      value: '',
    },
    ...enumValuesToOptions(
      [FutureOrderStatusEnum.settled, FutureOrderStatusEnum.partlyCanceled, FutureOrderStatusEnum.canceled],
      getFutureOrderStatusEnumName
    ),
  ]
  const planStatusOptions = [
    {
      label: t`common.all`,
      value: [
        FuturePlanOrderStatusEnum.canceled,
        FuturePlanOrderStatusEnum.entrusted,
        FuturePlanOrderStatusEnum.unTrigger,
        FuturePlanOrderStatusEnum.unTrigger2,
      ].join(','),
    },
    {
      label: t`order.constants.status.unTrigger`,
      value: [FuturePlanOrderStatusEnum.unTrigger, FuturePlanOrderStatusEnum.unTrigger2].join(','),
    },
    {
      label: t`order.constants.status.entrusted`,
      value: [FuturePlanOrderStatusEnum.entrusted].join(','),
    },
    {
      label: t`order.constants.status.failed`,
      value: `${[FuturePlanOrderStatusEnum.canceled].join(',')}:${[3, 4, 5].join(',')}`,
    },
    {
      label: t`constants/order-16`,
      value: `${[FuturePlanOrderStatusEnum.canceled].join(',')}:${[FutureOrderReasonEnum.user].join(',')}`,
    },
  ]
  const stopLimitStatusOptions = [
    {
      label: t`common.all`,
      value: '',
    },
    {
      label: t`order.constants.status.unTrigger`,
      value: [FuturePlanOrderStatusEnum.unTrigger, FuturePlanOrderStatusEnum.unTrigger2].join(','),
    },
    {
      label: t`order.constants.status.entrusted`,
      value: [FuturePlanOrderStatusEnum.entrusted].join(','),
    },
    {
      label: t`order.constants.status.failed`,
      value: `${[FuturePlanOrderStatusEnum.canceled].join(',')}:${[3, 4, 5].join(',')}`,
    },
    {
      label: t`constants/order-16`,
      value: `${[FuturePlanOrderStatusEnum.canceled].join(',')}:${[FutureOrderReasonEnum.user].join(',')}`,
    },
    {
      label: t`constants/order-15`,
      value: `${[FuturePlanOrderStatusEnum.canceled].join(',')}:${[FutureOrderReasonEnum.system].join(',')}`,
    },
  ]
  const currentStatusOptions = [
    {
      label: t`common.all`,
      value: '',
    },
    ...enumValuesToOptions(
      [FutureOrderStatusEnum.unTrigger, FutureOrderStatusEnum.partlySucceed],
      getFutureOrderStatusEnumName
    ),
  ]
  const map = {
    [OrderTabTypeEnum.history]: historyStatusOptions,
    [OrderTabTypeEnum.plan]: planStatusOptions,
    [OrderTabTypeEnum.profitLoss]: stopLimitStatusOptions,
    [OrderTabTypeEnum.current]: currentStatusOptions,
  }

  return map[tab] || []
}

export function getFutureOrderFilterOptions(tab: OrderTabTypeEnum, params: IQueryFutureOrderListReq) {
  const columnsMap = {
    [OrderTabTypeEnum.holdings]: [FutureOrderParamsKeyEnum.side],
    [OrderTabTypeEnum.current]: [],
    [OrderTabTypeEnum.plan]: [FutureOrderParamsKeyEnum.detailSide, FutureOrderParamsKeyEnum.compositeStatus],
    [OrderTabTypeEnum.profitLoss]: [FutureOrderParamsKeyEnum.detailSide, FutureOrderParamsKeyEnum.compositeStatus],
    [OrderTabTypeEnum.margin]: [],
    [OrderTabTypeEnum.history]: [FutureOrderParamsKeyEnum.orderType],
  }
  const entrustType = params.entrustType!
  const filterOptions = getFutureOrderBaseFilterOptions(columnsMap[tab], params)
  const statusFilter = filterOptions.find(i => i.paramsKey === FutureOrderParamsKeyEnum.compositeStatus)!
  if (statusFilter) {
    statusFilter.options = getStatusOptions(tab)
  }
  const orderTypeFilter = filterOptions.find(i => i.paramsKey === FutureOrderParamsKeyEnum.orderType)!

  if (orderTypeFilter) {
    const orderEnums = baseOrderFutureStore.getState().orderEnums
    orderTypeFilter.options =
      {
        [EntrustTypeEnum.normal]: orderEnums.entrustTypeWithSuffix.enums,
        [EntrustTypeEnum.plan]: orderEnums.planEntrustTypeWithSuffix.enums,
        [EntrustTypeEnum.stopLimit]: orderEnums.stopLimitEntrustTypeWithSuffix.enums,
      }[entrustType]?.slice() || []
    orderTypeFilter.options.unshift({
      label: t`common.all`,
      value: '',
    })
  }

  return filterOptions
}
/** 将本地参数转换为最终查询所需要的参数 */
export function paramsToQueryReq(params: IPrams) {
  return params
}
export function FutureCurrentOrdersFilter({ params, onChange, filterOptions }: IFiltersProps<IPrams>) {
  const { allTradePairs } = useContractMarketStore()
  const pairOptions = allTradePairs.map(pair => ({
    label: pair.symbolName,
    value: pair.id?.toString(),
    name: pair.symbolName,
  }))
  pairOptions.unshift({
    label: t`common.all`,
    value: '',
    name: t`common.all`,
  })

  return (
    <div className="flex flex-wrap items-center">
      <div className="mr-3 mb-4 inline-flex items-center">
        <span className="mr-3 font-medium">{t`future.funding-history.future-select.future`}</span>
        <PopupSearchSelect
          className="w-40 h-10"
          popupClassName="w-44 "
          value={params.tradeId}
          options={pairOptions}
          searchPlaceHolder={t`features_orders_filters_future_5101480`}
          onChange={id => {
            onChange({
              tradeId: id,
            })
          }}
        />
      </div>
      {filterOptions.map(({ paramsKey, ...filterOption }) => (
        <OrderFilterSelect
          key={paramsKey}
          paramsKey={paramsKey}
          value={params[paramsKey]}
          {...filterOption}
          setParams={onChange}
        />
      ))}
    </div>
  )
}
export function getFutureOrderDefaultParams(tab: OrderTabTypeEnum) {
  const params: IPrams = {}

  return params
}

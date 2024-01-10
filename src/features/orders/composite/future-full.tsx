import { useEffect, useRef, useState } from 'react'
import { useCreation, useMount, useUpdateEffect } from 'ahooks'
import {
  EntrustTypeEnum,
  FutureNormalOrderStatusParamsCompositionEnum,
  FuturePlanOrderStatusParamsCompositionEnum,
  FutureStopLimitOrderStatusParamsCompositionEnum,
  getOrderEntrustTypeEnumName,
  OrderTabTypeEnum,
} from '@/constants/order'
import { FutureOrder } from '@/features/orders/composite/future'
import { enumValuesToOptions } from '@/helper/order'
import { t } from '@lingui/macro'
import MiniSelect from '@/components/mini-select'
import { useFutureOpenOrders } from '@/hooks/features/order'
import { Button, Checkbox, TableColumnProps } from '@nbit/arco'
import classNames from 'classnames'
import ButtonRadios, { TradeButtonRadiosPresetClassNames } from '@/components/button-radios'
import { IQueryFutureOrderListReq } from '@/typings/api/order'
import { ORDER_TABLE_COLUMN_ID } from '@/features/orders/order-columns/base'
import { useOrderFutureStore } from '@/store/order/future'
import { subscribeFutureOrders } from '@/helper/order/future'
import styles from './spot.module.css'
import { FutureOrderModuleContext, useCreateOrderModuleContext } from '../order-module-context'
import { OrderDateFiltersInTable } from '../filters/base'
import { FutureCurrentOrdersFilter, getFutureOrderFilterOptions } from '../filters/future'

type IFutureFullBaseOrderProps = {
  orderTab: OrderTabTypeEnum
  entrustType: EntrustTypeEnum
  futureOrderHookResult: ReturnType<typeof useFutureOpenOrders>
  commonParams: IQueryFutureOrderListReq
  onCommonParamsChange: (params: IQueryFutureOrderListReq, isReset?: boolean) => void
  tableLayoutProps: any
  visible: boolean
  orders?: any[]
  showSelect?: boolean
  onResetCommonParams?: () => void
}
export function FutureFullBaseOrder({
  orderTab,
  entrustType,
  futureOrderHookResult,
  commonParams,
  tableLayoutProps,
  visible,
  showSelect,
  orders,
  onCommonParamsChange,
}: IFutureFullBaseOrderProps) {
  const inTrade = tableLayoutProps.inTrade
  const { openOrderModule, orderEnums } = useOrderFutureStore()
  const contextValue = useCreateOrderModuleContext(futureOrderHookResult)
  const { setEntrustType, cancelAll } = futureOrderHookResult

  const placeEntrustTypes = enumValuesToOptions(
    [EntrustTypeEnum.normal, EntrustTypeEnum.stopLimit, EntrustTypeEnum.plan],
    getOrderEntrustTypeEnumName
  )
  const isCurrentEntrustTypeTab = orderTab === OrderTabTypeEnum.current
  const defaultParams: IQueryFutureOrderListReq = {
    typeInd: '',
    status: '',
    orderType: '',
  }
  const [filterParams, setFilterParams] = useState<IQueryFutureOrderListReq>(defaultParams)
  const onFilterParamsChange = (val: any) => {
    const { tradeId, ...other } = val
    setFilterParams(old => {
      return {
        ...old,
        ...other,
      }
    })
    if (tradeId !== undefined) {
      // 交易对 id 单独处理
      onCommonParamsChange({
        tradeId,
      })
    }
  }
  const [orderList, setOrderList] = useState<any[]>([])
  const statusList = [
    {
      label: t`common.all`,
      value: '',
    },
    ...{
      [EntrustTypeEnum.normal]: orderEnums.orderStatusInFilters.enums,
      [EntrustTypeEnum.plan]: orderEnums.planOrderStatusInFilters.enums,
      [EntrustTypeEnum.stopLimit]: orderEnums.stopLimitOrderStatusInFilters.enums,
    }[entrustType],
  ].map(item => {
    return {
      ...item,
      selectedLabel: t`order.filters.status.label`,
    }
  })
  const onStatusChange = (val: any) => {
    onFilterParamsChange({
      status: val,
    })
  }
  const statusTitleNodeFn = (col: TableColumnProps<any>) => {
    return {
      ...col,
      title: (
        <MiniSelect
          inThead
          label={t`order.filters.status.label`}
          triggerProps={{
            autoAlignPopupWidth: false,
            autoAlignPopupMinWidth: true,
            position: 'bl',
          }}
          value={filterParams.status}
          onChange={onStatusChange}
          options={statusList as any}
        />
      ),
    }
  }
  const columnsMap = {
    [ORDER_TABLE_COLUMN_ID.futureStatus]: statusTitleNodeFn,
    [ORDER_TABLE_COLUMN_ID.futurePlanStatus]: statusTitleNodeFn,
    [ORDER_TABLE_COLUMN_ID.futureStopLimitStatus]: statusTitleNodeFn,
  }
  const reset = () => {
    onFilterParamsChange(defaultParams)
    onCommonParamsChange({} as any, true /** reset */)
  }
  const customParams = useCreation(() => {
    return {
      ...filterParams,
      ...commonParams,
      entrustType,
    } as Partial<IQueryFutureOrderListReq>
  }, [commonParams, filterParams, entrustType])
  const filterOptions = getFutureOrderFilterOptions(orderTab, customParams)
  const hiddenCanceledStatus = {
    [EntrustTypeEnum.normal]: [
      FutureNormalOrderStatusParamsCompositionEnum.settled,
      FutureNormalOrderStatusParamsCompositionEnum.partlyCanceled,
    ].join(','),
    [EntrustTypeEnum.plan]: [FuturePlanOrderStatusParamsCompositionEnum.triggered].join(','),
    [EntrustTypeEnum.stopLimit]: [FutureStopLimitOrderStatusParamsCompositionEnum.triggered].join(','),
  }[entrustType]
  const hiddenCanceled = filterParams.status === hiddenCanceledStatus
  const onHiddenCanceledChange = (val: boolean) => {
    // 这里改变的时候应该同步修改弹出框中的值，反之亦然，但受限于目前状态是单选
    onStatusChange(!val ? '' : hiddenCanceledStatus)
  }
  const onClickCancelAll = () =>
    cancelAll({
      tradeId: customParams.tradeId?.toString(),
      orderType: customParams.typeInd,
    })
  const cancelAllNode = (
    <div
      className={classNames('mb-filter-block text-brand_color cursor-pointer', {
        'text-xs': inTrade,
      })}
      onClick={onClickCancelAll}
    >
      {t`features_trade_trade_order_index_5101089`}
    </div>
  )
  const { refreshEvent$ } = contextValue

  const refresh = () => {
    refreshEvent$.emit()
  }
  useUpdateEffect(() => {
    if (visible) {
      // 切换时仅做历史订单的刷新，当前订单由 websocket 负责，否则会陷入无限循环
      refresh()
    }
  }, [visible])
  const visibleRef = useRef(visible)
  visibleRef.current = visible
  useEffect(() => {
    const unsubscribeFn = subscribeFutureOrders(() => {
      return () => {
        if (visibleRef.current) {
          refresh()
        }
      }
    })
    return unsubscribeFn
  }, [])
  const showCancelAll = (orders?.length || orderList.length) > 0

  return (
    <FutureOrderModuleContext.Provider value={contextValue}>
      <div
        className={classNames(styles['spot-full-wrapper'], 'scrollbar-custom', {
          '!hidden': !visible,
          'in-trade': inTrade,
        })}
      >
        {!inTrade && (
          <div className="order-types">
            <ButtonRadios
              hasGap
              bothClassName="px-5 py-2 text-sm font-medium"
              inactiveClassName="text-text_color_02"
              activeClassName="bg-bg_sr_color rounded"
              options={placeEntrustTypes}
              onChange={setEntrustType}
              value={futureOrderHookResult.entrustType}
            />
            {!isCurrentEntrustTypeTab && (
              <div className="flex items-center text-text_color_03 text-xs">
                <Checkbox checked={hiddenCanceled} onChange={onHiddenCanceledChange} />
                <span className="ml-1">{t`features_orders_composite_spot_full_5101180`}</span>
              </div>
            )}
          </div>
        )}
        <div className="filters-wrapper">
          <div className="flex items-center flex-wrap">
            {inTrade && (
              <div className="mb-filter-block mr-4">
                <ButtonRadios
                  hasGap
                  bothClassName="px-2.5 h-6 text-xs"
                  inactiveClassName={classNames(TradeButtonRadiosPresetClassNames.inActive.sr)}
                  activeClassName={classNames(TradeButtonRadiosPresetClassNames.active.brand)}
                  options={placeEntrustTypes}
                  onChange={setEntrustType}
                  value={futureOrderHookResult.entrustType}
                />
              </div>
            )}
            {showSelect && (
              <FutureCurrentOrdersFilter
                filterOptions={filterOptions}
                params={customParams}
                onChange={onFilterParamsChange}
              />
            )}
            {!isCurrentEntrustTypeTab && (
              <OrderDateFiltersInTable
                inTrade={inTrade}
                params={customParams}
                onChange={onCommonParamsChange}
                filterOptions={[]}
              />
            )}
            {(!inTrade || !isCurrentEntrustTypeTab) && (
              <div className="mb-filter-block">
                <Button className="mr-4 action-btn" onClick={refresh} type="primary">
                  {t`assets.financial-record.search.search`}
                </Button>
                <Button className="action-btn" onClick={reset}>
                  {t`user.field.reuse_47`}
                </Button>
              </div>
            )}
          </div>

          {showCancelAll && isCurrentEntrustTypeTab && cancelAllNode}
        </div>
        {/* 解决 display 隐藏后空数据宽度不对的问题 */}
        {visible && (
          <div className="h-0 flex-1">
            <FutureOrder
              inTrade={inTrade}
              columnsMap={columnsMap as any}
              tableLayoutProps={tableLayoutProps}
              customParams={customParams}
              key={orderTab}
              onListChange={setOrderList}
              tab={orderTab}
              orders={orders}
            />
          </div>
        )}
      </div>
    </FutureOrderModuleContext.Provider>
  )
}

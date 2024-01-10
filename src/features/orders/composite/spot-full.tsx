import { useEffect, useState } from 'react'
import { useCreation, useUpdateEffect } from 'ahooks'
import {
  EntrustTypeEnum,
  getOrderEntrustTypeEnumName,
  OrderTabTypeEnum,
  SpotOrderStatusParamsCompositionEnum,
  SpotPlanOrderStatusParamsCompositionEnum,
} from '@/constants/order'
import { SpotOrder } from '@/features/orders/composite/spot'
import { enumValuesToOptions } from '@/helper/order'
import { t } from '@lingui/macro'
import MiniSelect from '@/components/mini-select'
import { useSpotOpenOrders } from '@/hooks/features/order'
import { Button, Checkbox, TableColumnProps } from '@nbit/arco'
import classNames from 'classnames'
import ButtonRadios, { TradeButtonRadiosPresetClassNames } from '@/components/button-radios'
import {
  CurrentOrdersFilter,
  getOrderFilterOptions,
  OrderParamsKeyEnum,
  SpotFiltersInTable,
} from '@/features/orders/filters/spot'
import { IQuerySpotOrderReqParams } from '@/typings/api/order'
import { ORDER_TABLE_COLUMN_ID } from '@/features/orders/order-columns/base'
import { useBaseOrderSpotStore } from '@/store/order/spot'
import { storeEnumsToOptions } from '@/helper/store'
import styles from './spot.module.css'
import { SpotOrderModuleContext, useCreateOrderModuleContext, useSpotOrderModuleContext } from '../order-module-context'

type IQueryOrderListReq = IQuerySpotOrderReqParams

type ISpotFullBaseOrderProps = {
  orderTab: OrderTabTypeEnum
  entrustType: EntrustTypeEnum
  spotOrderHookResult: ReturnType<typeof useSpotOpenOrders>
  commonParams: IQueryOrderListReq
  onCommonParamsChange: (params: IQueryOrderListReq, isReset?: boolean) => void
  tableLayoutProps: any
  visible: boolean
  orders?: any[]
  showSelect?: boolean
  onResetCommonParams?: () => void
}
export function SpotFullBaseOrder({
  orderTab,
  entrustType,
  spotOrderHookResult,
  commonParams,
  tableLayoutProps,
  visible,
  showSelect,
  orders,
  onCommonParamsChange,
}: ISpotFullBaseOrderProps) {
  const inTrade = tableLayoutProps.inTrade
  const { openOrderModule, orderEnums } = useBaseOrderSpotStore()
  const contextValue = useCreateOrderModuleContext(spotOrderHookResult)
  const { setEntrustType, cancelAll } = spotOrderHookResult

  const placeEntrustTypes = enumValuesToOptions(
    [EntrustTypeEnum.normal, EntrustTypeEnum.plan],
    getOrderEntrustTypeEnumName
  )
  const isCurrentEntrustTypeTab = orderTab === OrderTabTypeEnum.current
  const defaultParams: IQueryOrderListReq = {
    orderType: '',
    status: '',
  }
  const [filterParams, setFilterParams] = useState<IQueryOrderListReq>(defaultParams)
  const onFilterParamsChange = (val: any) => {
    const { tradeId, ...other } = val
    setFilterParams({
      ...filterParams,
      ...other,
    })
    if (tradeId !== undefined) {
      // 交易对 id 单独处理
      onCommonParamsChange({
        tradeId,
      })
    }
  }
  const [orderList, setOrderList] = useState<any[]>([])
  const normalStatusList = storeEnumsToOptions(orderEnums.orderStatusInFilters.enums)
  const planStatusList = storeEnumsToOptions(orderEnums.planOrderStatusInFilters.enums)
  const isNormalOrder = entrustType === EntrustTypeEnum.normal
  const statusList = [
    {
      label: t`common.all`,
      value: '',
    },
    ...(isNormalOrder ? normalStatusList : planStatusList),
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
  const columnsMap = {
    [ORDER_TABLE_COLUMN_ID.status]: (col: TableColumnProps<any>) => {
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
    },
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
    } as Partial<IQueryOrderListReq>
  }, [commonParams, filterParams, entrustType])
  const filterOptions = getOrderFilterOptions([OrderParamsKeyEnum.placeOrderType], customParams)

  const hiddenCanceledStatus = isNormalOrder
    ? [SpotOrderStatusParamsCompositionEnum.settled, SpotOrderStatusParamsCompositionEnum.partlyCanceled].join(',')
    : [SpotPlanOrderStatusParamsCompositionEnum.triggered].join(',')
  const hiddenCanceled = filterParams.status === hiddenCanceledStatus
  const onHiddenCanceledChange = (val: boolean) => {
    // 这里改变的时候应该同步修改弹出框中的值，反之亦然，但受限于目前状态是单选
    onStatusChange(!val ? '' : hiddenCanceledStatus)
  }
  const onClickCancelAll = () =>
    cancelAll({
      tradeId: customParams.tradeId,
      orderType: customParams.orderType,
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
  }, [openOrderModule.plan, visible])
  const showCancelAll = orders?.length || orderList.length > 0

  return (
    <SpotOrderModuleContext.Provider value={contextValue}>
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
              value={spotOrderHookResult.entrustType}
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
                  bothClassName="px-2.5 py-0.5 text-xs"
                  inactiveClassName={classNames(TradeButtonRadiosPresetClassNames.inActive.sr)}
                  activeClassName={classNames(TradeButtonRadiosPresetClassNames.active.brand)}
                  options={placeEntrustTypes}
                  onChange={setEntrustType}
                  value={spotOrderHookResult.entrustType}
                />
              </div>
            )}
            {showSelect && (
              <CurrentOrdersFilter
                filterOptions={filterOptions}
                params={customParams}
                onChange={onFilterParamsChange}
              />
            )}
            {!isCurrentEntrustTypeTab && (
              <>
                <SpotFiltersInTable
                  inTrade={inTrade}
                  params={customParams}
                  onChange={onCommonParamsChange}
                  filterOptions={[]}
                />
                <div className="mb-filter-block">
                  <Button className="mr-4 action-btn" onClick={refresh} type="primary">
                    {t`assets.financial-record.search.search`}
                  </Button>
                  <Button className="action-btn" onClick={reset}>
                    {t`user.field.reuse_47`}
                  </Button>
                </div>
              </>
            )}
          </div>

          {showCancelAll && isCurrentEntrustTypeTab && cancelAllNode}
        </div>
        {/* 解决 display 隐藏后空数据宽度不对的问题 */}
        {visible && (
          <div className="h-0 flex-1">
            <SpotOrder
              columnsMap={columnsMap as any}
              isNormalOrder={isNormalOrder}
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
    </SpotOrderModuleContext.Provider>
  )
}

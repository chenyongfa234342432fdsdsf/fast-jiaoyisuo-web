import {
  getFutureOrderPositionTypeEnumName,
  getFutureOrderEntrustTypeName,
  getFutureOrderPriceTypeEnumName,
  FutureOrderSystemTypeEnum,
  FutureOrderStatusEnum,
  OrderTabTypeEnum,
  FuturePlanOrderStatusEnum,
  FutureOrderReasonEnum,
  FutureStopLimitOrderStopLimitTypeEnum,
  EntrustTypeEnum,
  FutureNormalOrderTypeIndEnum,
  FutureOrderDirectionEnum,
} from '@/constants/order'
import { formatDate } from '@/helper/date'
import { replaceEmpty } from '@/helper/filters'
import { IFutureOrderItem, IQueryFutureOrderListReq } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { TableColumnProps } from '@nbit/arco'
import { formatCurrency } from '@/helper/decimal'
import {
  getFuture,
  getFutureOrderCountByTradeUnit,
  getFutureOrderCountSymbol,
  getFutureOrderDirectionColorClass,
  getFutureOrderValueEnumText,
} from '@/helper/order/future'
import { TradeFuturesOrderAssetsTypesEnum } from '@/constants/trade'
import { baseAssetsFuturesStore } from '@/store/assets/futures'
import { IncreaseTag } from '@nbit/react'
import { getOrderTableColumns, ORDER_TABLE_COLUMN_ID } from './base'
import {
  FutureActionCell,
  FutureNameCell,
  FuturePlanOrderTriggerCondition,
  FutureStopLimitActionCell,
  FutureStopLimitCell,
  FutureTriggerEntrustAmountCell,
} from '../order-table-cell'
import { getBaseFutureHoldingColumns } from './holding'
import { getBaseFutureMarginColumns } from './margin'

export function getBaseFutureColumns(tab: OrderTabTypeEnum, params: IQueryFutureOrderListReq, inTrade?: boolean) {
  const { futuresCurrencySettings } = baseAssetsFuturesStore.getState()

  const baseColumns: Array<
    TableColumnProps<IFutureOrderItem> & {
      id: ORDER_TABLE_COLUMN_ID
    }
  > = [
    {
      title: t`future.funding-history.future-select.future`,
      width: 140,
      id: ORDER_TABLE_COLUMN_ID.futureName,
      render(_col, item) {
        return <FutureNameCell order={item} />
      },
    },
    {
      title: t`features_orders_order_columns_future_5101347`,
      width: 140,
      id: ORDER_TABLE_COLUMN_ID.futureDirectionLeverage,
      render(_col, item) {
        const texts = getFutureOrderValueEnumText(item)
        return (
          <div>
            <span className={getFutureOrderDirectionColorClass(item.sideInd)}>{texts.directionText}</span>/
            <span>{item.lever} X</span>
          </div>
        )
      },
    },
    {
      title: t`features_orders_order_columns_future_5101347`,
      width: 140,
      id: ORDER_TABLE_COLUMN_ID.futureStopLimitDirectionLeverage,
      render(_col, item) {
        const texts = getFutureOrderValueEnumText(item)
        return (
          <div>
            <span className="text-warning_color">{texts.directionText}</span>/<span>{item.lever} X</span>
          </div>
        )
      },
    },
    {
      title: t`features/orders/order-columns/future-0`,
      width: 80,
      id: ORDER_TABLE_COLUMN_ID.futureLeverage,
      render(_col, item) {
        return (
          <div>
            <span>{item.lever} X</span>
          </div>
        )
      },
    },
    {
      title: t`features/orders/order-columns/future-1`,
      width: 100,
      id: ORDER_TABLE_COLUMN_ID.futurePositionType,
      render(_col, item) {
        return <div>{getFutureOrderPositionTypeEnumName(item.positionType)}</div>
      },
    },
    {
      title: t`order.columns.date`,
      width: 180,
      id: ORDER_TABLE_COLUMN_ID.futureTime,
      render(_col, item) {
        return <div>{formatDate(item.createdByTime)}</div>
      },
    },
    {
      title: t`features/orders/details/future-0`,
      width: 180,
      id: ORDER_TABLE_COLUMN_ID.futurePlanTime,
      render(_col, item) {
        return <div>{formatDate(item.createdByTime)}</div>
      },
    },
    {
      title: t`assets.coin.trade-records.table.type`,
      width: 100,
      id: ORDER_TABLE_COLUMN_ID.futureEntrustType,
      render(_col, item) {
        const texts = getFutureOrderValueEnumText(item)
        return <div>{texts.typeTextWithSuffix}</div>
      },
    },
    {
      title: t`assets.coin.trade-records.table.type`,
      width: 100,
      id: ORDER_TABLE_COLUMN_ID.planEntrustType,
      render(_col, item) {
        const texts = getFutureOrderValueEnumText(item)
        return <div>{texts.typeTextWithSuffix}</div>
      },
    },
    {
      title: t`order.columns.entrustType`,
      width: 120,
      id: ORDER_TABLE_COLUMN_ID.futureStopLimitEntrustType,
      render(_col, item) {
        return (
          <div>
            {getFutureOrderEntrustTypeName(item.systemType, item.stopLimitType, FutureStopLimitOrderStopLimitTypeEnum)}
          </div>
        )
      },
    },
    {
      title: t`order.columns.entrustPrice`,
      id: ORDER_TABLE_COLUMN_ID.futurePrice,
      width: 135,
      render(_col, item) {
        const future = getFuture(item.symbol)

        return (
          <div>
            {item.systemType === FutureOrderSystemTypeEnum.market
              ? t`trade.tab.orderType.marketPrice`
              : item.orderPriceType > 0
              ? getFutureOrderPriceTypeEnumName(item.orderPriceType)
              : replaceEmpty(formatCurrency(item.price, future?.priceOffset, false))}
          </div>
        )
      },
    },
    {
      title: t`features_orders_order_columns_spot_5101083`,
      id: ORDER_TABLE_COLUMN_ID.futureEntrustCount,
      width: 240,
      render(_col, item) {
        const { size, tradeSize, symbolName } = getFutureOrderCountByTradeUnit(item)

        return (
          <div>
            {replaceEmpty(formatCurrency(tradeSize))} / {replaceEmpty(formatCurrency(size))} {symbolName}
          </div>
        )
      },
    },
    {
      title: t`features_orders_order_columns_spot_5101083`,
      id: ORDER_TABLE_COLUMN_ID.futureStopLimitTradedEntrustCount,
      width: 240,
      render(_col, item) {
        const { size, tradeSize, symbolName } = getFutureOrderCountByTradeUnit(item)

        return (
          <div>
            {replaceEmpty(formatCurrency(tradeSize))} / {replaceEmpty(formatCurrency(size))} {symbolName}
          </div>
        )
      },
    },
    {
      title: t`features_orders_order_columns_spot_5101084`,
      id: ORDER_TABLE_COLUMN_ID.futureAvgPrice,
      width: 240,
      render(_col, item) {
        const future = getFuture(item.symbol)
        const isMarketPrice = item.typeInd === FutureNormalOrderTypeIndEnum.market || item.entrustTypeInd === 'market'

        return (
          <div>
            <span>{replaceEmpty(formatCurrency(item.tradePrice, future?.priceOffset, false))}</span>/
            <span>
              {isMarketPrice
                ? t`trade.tab.orderType.marketPrice`
                : formatCurrency(item.price || 0, future?.priceOffset, false)}
            </span>
          </div>
        )
      },
    },
    {
      title: t`trade.c2c.procedureFee`,
      id: ORDER_TABLE_COLUMN_ID.futureFee,
      width: 100,
      render(_col, item) {
        return <div>{replaceEmpty(item.fee)}</div>
      },
    },
    {
      title: t`order.columns.status`,
      id: ORDER_TABLE_COLUMN_ID.futureStatus,
      width: 100,
      render(_col, item) {
        const texts = getFutureOrderValueEnumText(item)
        return <div>{texts.statusText}</div>
      },
    },
    {
      title: t`order.columns.status`,
      id: ORDER_TABLE_COLUMN_ID.futureStopLimitStatus,
      width: 100,
      render(_col, item) {
        return (
          <div>
            {[FutureOrderStatusEnum.unTrigger, FutureOrderStatusEnum.canceled].includes(item.statusCd as any)
              ? t`features/orders/order-columns/future-3`
              : t`features/orders/order-columns/future-4`}
          </div>
        )
      },
    },
    {
      title: t`order.columns.status`,
      id: ORDER_TABLE_COLUMN_ID.futurePlanStatus,
      width: 100,
      render(_col, item) {
        const texts = getFutureOrderValueEnumText(item)
        return <div>{texts.statusText}</div>
      },
    },
    {
      title: t`order.columns.action`,
      width: 160,
      fixed: 'right',
      id: ORDER_TABLE_COLUMN_ID.futureActions,
      render(_col, item) {
        return <FutureActionCell tab={tab} order={item} />
      },
    },
    {
      title: t`features/orders/details/future-11`,
      width: 100,
      id: ORDER_TABLE_COLUMN_ID.futureStopLimit,
      render(_col, item) {
        return <FutureStopLimitCell order={item} />
      },
    },
    {
      title: t`features/orders/order-columns/future-5`,
      width: 160,
      id: ORDER_TABLE_COLUMN_ID.futureTriggerPrice,
      render(_col, item) {
        return <FuturePlanOrderTriggerCondition order={item} />
      },
    },
    {
      title: t`features/orders/order-columns/future-7`,
      width: 100,
      id: ORDER_TABLE_COLUMN_ID.futureStopLimitPrice,
      render(_col, item) {
        return <div></div>
      },
    },
    {
      title: t`features/orders/order-columns/future-8`,
      width: 180,
      id: ORDER_TABLE_COLUMN_ID.futureTriggerCancelTime,
      render(_col, item) {
        const isUnTrigger = [FuturePlanOrderStatusEnum.unTrigger, FuturePlanOrderStatusEnum.unTrigger2].includes(
          item.statusCd as any
        )
        const useModifyDate =
          FuturePlanOrderStatusEnum.entrusted === (item.statusCd as any) ||
          (FuturePlanOrderStatusEnum.canceled === (item.statusCd as any) &&
            [FutureOrderReasonEnum.user, FutureOrderReasonEnum.system].includes(item.reason))
        return (
          <div>{isUnTrigger ? replaceEmpty('') : formatDate(useModifyDate ? item.modifyDate : item.triggerDate)}</div>
        )
      },
    },
    {
      title: t`features/orders/order-columns/future-9`,
      width: 180,
      id: ORDER_TABLE_COLUMN_ID.futureTriggerEntrustCount,
      render(_col, item) {
        return <FutureTriggerEntrustAmountCell order={item} />
      },
    },
    {
      title: t`constants/order-4`,
      width: 80,
      id: ORDER_TABLE_COLUMN_ID.futureGroup,
      render(_col, item) {
        return <div>{item.groupName || t`constants/order-4`}</div>
      },
    },
    {
      title: t`features_orders_order_columns_spot_5101085`,
      width: 80,
      id: ORDER_TABLE_COLUMN_ID.percent,
      render(_col, item) {
        return (
          <div>
            <span>{item.completeness}</span>
          </div>
        )
      },
    },
    {
      title: t({
        id: 'features_orders_order_columns_future_5101349',
        values: {
          0: futuresCurrencySettings.currencySymbol,
        },
      }),
      width: 120,
      id: ORDER_TABLE_COLUMN_ID.futureExtraMargin,
      render(_col, item) {
        // 为空（平仓）或者合约组开仓不展示
        return item.marginType === TradeFuturesOrderAssetsTypesEnum.assets ? (
          <div>
            <span>{replaceEmpty(formatCurrency(item.totalMargin))}</span>
          </div>
        ) : (
          <div>{replaceEmpty()}</div>
        )
      },
    },
    {
      title: t({
        id: 'features_orders_order_columns_future_rbb5tpo9az4vbxxqwf5c4',
        values: { 0: futuresCurrencySettings.currencySymbol },
      }),
      width: 120,
      id: ORDER_TABLE_COLUMN_ID.realizedProfit,
      render(_col, item) {
        // 平仓单且有成交
        const visible =
          [FutureOrderDirectionEnum.closeBuy, FutureOrderDirectionEnum.closeSell].includes(item.sideInd as any) &&
          item.tradePrice
        return (
          <div>
            <IncreaseTag hasPrefix={false} value={replaceEmpty(!visible ? undefined : item.realizedProfit)} kSign />
          </div>
        )
      },
    },

    {
      title: t`order.columns.action`,
      width: 120,
      fixed: 'right',
      align: 'right',
      id: ORDER_TABLE_COLUMN_ID.stopLimitActions,
      render(_col, item) {
        return <FutureStopLimitActionCell order={item} />
      },
    },
    {
      title: t`features/trade/trade-order-confirm/index-3`,
      id: ORDER_TABLE_COLUMN_ID.futurePlanEntrustCount,
      width: 120,
      render(_col, item) {
        const { size, symbolName } = getFutureOrderCountByTradeUnit(item)

        return (
          <div>
            {replaceEmpty(formatCurrency(size))} {symbolName}
          </div>
        )
      },
    },
    {
      title: t`features/trade/trade-order-confirm/index-3`,
      id: ORDER_TABLE_COLUMN_ID.futureStopLimitEntrustCount,
      width: 120,
      render(_col, item) {
        // 止盈止损委托只能是标的币
        // 更新：全局统一
        const { size, symbolName } = getFutureOrderCountByTradeUnit(item)
        return (
          <div>
            {replaceEmpty(formatCurrency(size))} {symbolName}
          </div>
        )
      },
    },
    {
      title: t`features/trade/trade-order-confirm/index-1`,
      id: ORDER_TABLE_COLUMN_ID.futurePlanPrice,
      width: 120,
      render(_col, item) {
        const future = getFuture(item.symbol)
        const isMarketPrice = item.entrustTypeInd === 'market'
        return (
          <div>
            {isMarketPrice
              ? t`trade.tab.orderType.marketPrice`
              : replaceEmpty(formatCurrency(item.price, future?.priceOffset, false))}
          </div>
        )
      },
    },
  ]
  return baseColumns
}
export function getFutureColumns(
  tab: OrderTabTypeEnum,
  params: IQueryFutureOrderListReq,
  inTrade?: boolean,
  mapFnRecord?: Parameters<typeof getOrderTableColumns>[2]
) {
  const entrustType = params.entrustType!
  const planColumnIds = [
    ORDER_TABLE_COLUMN_ID.futureTime,
    ORDER_TABLE_COLUMN_ID.futureName,
    ORDER_TABLE_COLUMN_ID.futureGroup,
    ORDER_TABLE_COLUMN_ID.planEntrustType,
    ORDER_TABLE_COLUMN_ID.futureDirectionLeverage,
    ORDER_TABLE_COLUMN_ID.futurePlanEntrustCount,
    ORDER_TABLE_COLUMN_ID.futurePlanPrice,
    ORDER_TABLE_COLUMN_ID.futureTriggerPrice,
    ORDER_TABLE_COLUMN_ID.futureExtraMargin,
    ORDER_TABLE_COLUMN_ID.futureActions,
  ]
  const historyPlanColumnIds = [
    ORDER_TABLE_COLUMN_ID.futureTime,
    ORDER_TABLE_COLUMN_ID.futureName,
    ORDER_TABLE_COLUMN_ID.futureGroup,
    ORDER_TABLE_COLUMN_ID.planEntrustType,
    ORDER_TABLE_COLUMN_ID.futureDirectionLeverage,
    ORDER_TABLE_COLUMN_ID.futurePlanEntrustCount,
    ORDER_TABLE_COLUMN_ID.futurePlanPrice,
    ORDER_TABLE_COLUMN_ID.futureTriggerPrice,
    ORDER_TABLE_COLUMN_ID.futureExtraMargin,
    ORDER_TABLE_COLUMN_ID.futurePlanStatus,
    ORDER_TABLE_COLUMN_ID.futureActions,
  ]
  const stopLimitColumnIds = [
    ORDER_TABLE_COLUMN_ID.futureTime,
    ORDER_TABLE_COLUMN_ID.futureName,
    ORDER_TABLE_COLUMN_ID.futureGroup,
    ORDER_TABLE_COLUMN_ID.planEntrustType,
    ORDER_TABLE_COLUMN_ID.futureStopLimitDirectionLeverage,
    ORDER_TABLE_COLUMN_ID.futureStopLimitEntrustCount,
    ORDER_TABLE_COLUMN_ID.futurePlanPrice,
    ORDER_TABLE_COLUMN_ID.futureTriggerPrice,
    ORDER_TABLE_COLUMN_ID.futureActions,
  ]
  const historyColumnsIds = [
    ORDER_TABLE_COLUMN_ID.futureTime,
    ORDER_TABLE_COLUMN_ID.futureName,
    ORDER_TABLE_COLUMN_ID.futureGroup,
    ORDER_TABLE_COLUMN_ID.futureEntrustType,
    ORDER_TABLE_COLUMN_ID.futureDirectionLeverage,
    ORDER_TABLE_COLUMN_ID.futureEntrustCount,
    ORDER_TABLE_COLUMN_ID.futureAvgPrice,
    ORDER_TABLE_COLUMN_ID.futureExtraMargin,
    ORDER_TABLE_COLUMN_ID.realizedProfit,
    ORDER_TABLE_COLUMN_ID.percent,
    ORDER_TABLE_COLUMN_ID.futureStatus,
    ORDER_TABLE_COLUMN_ID.futureActions,
  ]
  const historyStopLimitColumnIds = [
    ORDER_TABLE_COLUMN_ID.futureTime,
    ORDER_TABLE_COLUMN_ID.futureName,
    ORDER_TABLE_COLUMN_ID.futureGroup,
    ORDER_TABLE_COLUMN_ID.planEntrustType,
    ORDER_TABLE_COLUMN_ID.futureStopLimitDirectionLeverage,
    ORDER_TABLE_COLUMN_ID.futureStopLimitTradedEntrustCount,
    ORDER_TABLE_COLUMN_ID.futureAvgPrice,
    ORDER_TABLE_COLUMN_ID.futureTriggerPrice,
    ORDER_TABLE_COLUMN_ID.futurePlanStatus,
    ORDER_TABLE_COLUMN_ID.futureActions,
  ]
  const currentColumnsIds = [
    ORDER_TABLE_COLUMN_ID.futureTime,
    ORDER_TABLE_COLUMN_ID.futureName,
    ORDER_TABLE_COLUMN_ID.futureGroup,
    ORDER_TABLE_COLUMN_ID.futureEntrustType,
    ORDER_TABLE_COLUMN_ID.futureDirectionLeverage,
    ORDER_TABLE_COLUMN_ID.futureEntrustCount,
    ORDER_TABLE_COLUMN_ID.futureAvgPrice,
    ORDER_TABLE_COLUMN_ID.futureExtraMargin,
    ORDER_TABLE_COLUMN_ID.percent,
    ORDER_TABLE_COLUMN_ID.futureActions,
  ]
  const holdingColumnsIds = [
    ORDER_TABLE_COLUMN_ID.futureName,
    ORDER_TABLE_COLUMN_ID.futureHoldingDirection,
    ORDER_TABLE_COLUMN_ID.futureLeverage,
    ORDER_TABLE_COLUMN_ID.futureHoldingPositionType,
    ORDER_TABLE_COLUMN_ID.futureHoldings,
    ORDER_TABLE_COLUMN_ID.futureOpenPrice,
    ORDER_TABLE_COLUMN_ID.futureLiquidationPrice,
    ORDER_TABLE_COLUMN_ID.futureMargin,
    ORDER_TABLE_COLUMN_ID.futureMarginRate,
    ORDER_TABLE_COLUMN_ID.futureUnRealizedSurplus,
    ORDER_TABLE_COLUMN_ID.futureRealizedSurplus,
    ORDER_TABLE_COLUMN_ID.futureEarnings,
    ORDER_TABLE_COLUMN_ID.futureHoldingActions,
  ]
  const columnsMap = {
    [EntrustTypeEnum.plan]: {
      [OrderTabTypeEnum.current]: planColumnIds,
      [OrderTabTypeEnum.history]: historyPlanColumnIds,
    },
    [EntrustTypeEnum.normal]: {
      [OrderTabTypeEnum.current]: currentColumnsIds,
      [OrderTabTypeEnum.history]: historyColumnsIds,
    },
    [EntrustTypeEnum.stopLimit]: {
      [OrderTabTypeEnum.current]: stopLimitColumnIds,
      [OrderTabTypeEnum.history]: historyStopLimitColumnIds,
    },
  }

  const columns = getOrderTableColumns(
    () => {
      return getBaseFutureColumns(tab, params, inTrade)
        .concat(getBaseFutureHoldingColumns())
        .concat(getBaseFutureMarginColumns())
    },
    tab === OrderTabTypeEnum.holdings ? holdingColumnsIds : columnsMap[entrustType]?.[tab] || [],
    mapFnRecord
  )

  return columns
}

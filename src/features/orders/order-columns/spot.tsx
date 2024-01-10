import {
  EntrustTypeEnum,
  getOrderDirectionEnumName,
  getTradePriceTypeEnumName,
  OrderDirectionEnum,
  OrderStatusEnum,
  OrderTabTypeEnum,
  PlanOrderMatchTypeEnum,
  SpotNormalOrderMarketUnitEnum,
  SpotPlanOrderStatusEnum,
  SpotPlanTriggerDirection,
} from '@/constants/order'
import { formatDate } from '@/helper/date'
import { replaceEmpty } from '@/helper/filters'
import { IBaseOrderItem, IQuerySpotOrderReqParams, ISpotPlanOrderItem } from '@/typings/api/order'
import { TableColumnProps } from '@nbit/arco'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { formatCurrency } from '@/helper/decimal'
import { getOrderValueEnumText } from '@/helper/order/spot'
import { ActionCell, SpotTradeOpenCurrencyCell } from '../order-table-cell'
import { getOrderTableColumns, ORDER_TABLE_COLUMN_ID } from './base'

type IQueryOrderListReq = IQuerySpotOrderReqParams

function getBaseColumns(params: IQueryOrderListReq) {
  const baseColumns: Array<
    TableColumnProps<IBaseOrderItem & ISpotPlanOrderItem> & {
      id: ORDER_TABLE_COLUMN_ID
    }
  > = [
    {
      title: t`order.columns.date`,
      width: 200,
      id: ORDER_TABLE_COLUMN_ID.date,
      render(_col, item) {
        return <div>{formatDate(Number(item.createdByTime!))}</div>
      },
    },
    {
      title: t`order.columns.currency`,
      id: ORDER_TABLE_COLUMN_ID.currency,
      width: 140,
      render(_col, item) {
        return (
          <div>
            {item.sellCoinShortName?.toUpperCase()}/{item.buyCoinShortName?.toUpperCase()}
          </div>
        )
      },
    },
    {
      title: t`order.columns.currency`,
      id: ORDER_TABLE_COLUMN_ID.tradeOpenCurrency,
      width: 140,
      render(_col, item) {
        return <SpotTradeOpenCurrencyCell order={item} />
      },
    },
    {
      title: t`order.columns.direction`,
      id: ORDER_TABLE_COLUMN_ID.direction,
      width: 80,
      render(_col, item) {
        return (
          <div
            className={classNames(item.side === OrderDirectionEnum.buy ? 'text-buy_up_color' : 'text-sell_down_color')}
          >
            {getOrderValueEnumText(item).directionText}
          </div>
        )
      },
    },
    {
      title: t`order.columns.entrustType`,
      id: ORDER_TABLE_COLUMN_ID.planEntrustType,
      width: 100,
      render(_col, item: ISpotPlanOrderItem) {
        return <div>{getOrderValueEnumText(item).typeTextWithSuffix}</div>
      },
    },
    {
      title: t`order.columns.entrustType`,
      id: ORDER_TABLE_COLUMN_ID.entrustType,
      width: 100,
      render(_col, item) {
        return <div>{getOrderValueEnumText(item).typeTextWithSuffix}</div>
      },
    },
    {
      title: t`features/trade/trade-order-confirm/index-3`,
      id: ORDER_TABLE_COLUMN_ID.entrustAmount,
      width: 140,
      render(_col, item: ISpotPlanOrderItem) {
        const isMarketPrice = item.matchType === PlanOrderMatchTypeEnum.marketPrice
        const coinName = isMarketPrice
          ? item.orderAmount
            ? item.sellCoinShortName
            : item.buyCoinShortName
          : item.sellCoinShortName

        return (
          <div>
            <span>{formatCurrency(item.orderAmount || item.orderPrice)}</span> <span>{coinName}</span>
          </div>
        )
      },
    },
    {
      title: t`order.columns.entrustPrice`,
      id: ORDER_TABLE_COLUMN_ID.price,
      width: 120,
      render(_col, item: ISpotPlanOrderItem) {
        const isMarketPrice = item.matchType === PlanOrderMatchTypeEnum.marketPrice

        return (
          <div>
            {isMarketPrice ? t`trade.tab.orderType.marketPrice` : replaceEmpty(formatCurrency(item.orderPrice))}
          </div>
        )
      },
    },
    {
      title: t`order.columns.triggerPrice`,
      id: ORDER_TABLE_COLUMN_ID.triggerPrice,
      width: 120,
      render(_col, item: ISpotPlanOrderItem) {
        return <div>{replaceEmpty(formatCurrency(item.triggerPrice))}</div>
      },
    },
    {
      title: t`features/orders/order-columns/future-5`,
      id: ORDER_TABLE_COLUMN_ID.triggerCondition,
      width: 160,
      render(_col, order: ISpotPlanOrderItem) {
        const triggerPriceTypeName = getTradePriceTypeEnumName(order.triggerTypeInd)

        return (
          <div>
            {triggerPriceTypeName}
            <span className="mx-1">{order.triggerDirectionInd === SpotPlanTriggerDirection.up ? '≥' : '≤'}</span>
            {formatCurrency(order.triggerPrice)}
          </div>
        )
      },
    },
    {
      title: t`order.columns.triggerTime`,
      id: ORDER_TABLE_COLUMN_ID.triggerTime,
      width: 180,
      render(_col, item) {
        return <div>{formatDate(item.triggerTime!)}</div>
      },
    },
    {
      title: t`features_orders_order_columns_spot_5101083`,
      id: ORDER_TABLE_COLUMN_ID.count,
      width: 240,
      render(_col, item) {
        const isMarketPrice = item.orderType === EntrustTypeEnum.market
        const marketOrderIsEntrustAmount = item.marketUnit === SpotNormalOrderMarketUnitEnum.entrustAmount
        const coinName = isMarketPrice
          ? marketOrderIsEntrustAmount
            ? item.sellCoinShortName
            : item.buyCoinShortName
          : item.sellCoinShortName
        return (
          <div>
            <span>{formatCurrency(item.successCount)}</span>/<span>{formatCurrency(item.entrustCount)}</span>
            <span>&nbsp;{coinName}</span>
          </div>
        )
      },
    },
    {
      title: t`features_orders_order_columns_spot_5101084`,
      id: ORDER_TABLE_COLUMN_ID.avgPrice,
      width: 240,
      render(_col, item) {
        const isMarketPrice = item.orderType === EntrustTypeEnum.market
        return (
          <div>
            <span>{replaceEmpty(formatCurrency(item.averagePrice))}</span>/
            <span>{isMarketPrice ? t`trade.tab.orderType.marketPrice` : formatCurrency(item.entrustPrice || 0)}</span>
          </div>
        )
      },
    },
    {
      title: t`features_orders_order_columns_spot_5101085`,
      id: ORDER_TABLE_COLUMN_ID.percent,
      width: 80,
      render(_col, item) {
        return (
          <div>
            <span>{item.completeness}</span>
          </div>
        )
      },
    },
    {
      title: t`order.columns.status`,
      width: 100,
      id: ORDER_TABLE_COLUMN_ID.status,
      render(_col, item) {
        const statusText = getOrderValueEnumText(item).statusText

        return <div>{statusText}</div>
      },
    },
    {
      title: t`order.columns.action`,
      width: 80,
      align: 'center',
      fixed: 'right',
      id: ORDER_TABLE_COLUMN_ID.action,
      render(_col, item) {
        return <ActionCell order={item} />
      },
    },
  ]
  return baseColumns
}

export function getSpotColumns(
  tab: OrderTabTypeEnum,
  params: IQueryOrderListReq,
  inTrade?: boolean,
  mapFnRecord?: Parameters<typeof getOrderTableColumns>[2]
) {
  const isHistoryTab = tab === OrderTabTypeEnum.history
  const currencyId = !isHistoryTab && inTrade ? ORDER_TABLE_COLUMN_ID.tradeOpenCurrency : ORDER_TABLE_COLUMN_ID.currency
  const normalColumnIds = [
    ORDER_TABLE_COLUMN_ID.date,
    currencyId,
    ORDER_TABLE_COLUMN_ID.direction,
    ORDER_TABLE_COLUMN_ID.entrustType,
    ORDER_TABLE_COLUMN_ID.amount,
    ORDER_TABLE_COLUMN_ID.count,
    ORDER_TABLE_COLUMN_ID.avgPrice,
    ORDER_TABLE_COLUMN_ID.percent,
    ...(isHistoryTab ? [ORDER_TABLE_COLUMN_ID.status] : []),
    ORDER_TABLE_COLUMN_ID.action,
  ]
  const planColumnIds = [
    ORDER_TABLE_COLUMN_ID.date,
    currencyId,
    ORDER_TABLE_COLUMN_ID.planEntrustType,
    ORDER_TABLE_COLUMN_ID.direction,
    ORDER_TABLE_COLUMN_ID.entrustAmount,
    ORDER_TABLE_COLUMN_ID.price,
    ORDER_TABLE_COLUMN_ID.triggerCondition,
    ...(isHistoryTab ? [ORDER_TABLE_COLUMN_ID.status] : []),
    ORDER_TABLE_COLUMN_ID.action,
  ]
  const isNormalOrder = Number(params.entrustType) !== EntrustTypeEnum.plan
  const columns = getOrderTableColumns(
    () => {
      return getBaseColumns(params)
    },
    isNormalOrder ? normalColumnIds : planColumnIds,
    mapFnRecord
  )

  return columns
}

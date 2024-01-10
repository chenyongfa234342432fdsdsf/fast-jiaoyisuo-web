import { TableColumnProps } from '@nbit/arco'

export enum ORDER_TABLE_COLUMN_ID {
  date,
  currency,
  tradeOpenCurrency,
  type,
  direction,
  price,
  amount,
  count,
  percent,
  condition,
  status,
  avgPrice,
  entrustType,
  planEntrustType,
  entrustAmount,
  triggerTime,
  triggerPrice,
  triggerCondition,
  action,
  futureName,
  futureGroup,
  futureDirection,
  futureDirectionLeverage,
  futureStopLimitDirectionLeverage,
  futureLeverage,
  futurePositionType,
  futureTime,
  futurePlanTime,
  futureEntrustType,
  futureStopLimitEntrustType,
  futurePrice,
  futureEntrustCount,
  futureDealCount,
  futureAvgPrice,
  futureFee,
  futureStatus,
  futureActions,
  futureExtraMargin,
  futureTriggerPrice,
  futurePlanStatus,
  futureTriggerCancelTime,
  futureTriggerEntrustCount,
  futureStopLimit,
  futureStopLimitPrice,
  futureStopLimitStatus,
  futureHoldings,
  futureHoldingDirection,
  futureHoldingPositionType,
  futureOpenPrice,
  futureLiquidationPrice,
  futureMargin,
  futureMarginRate,
  futureUnRealizedSurplus,
  futureRealizedSurplus,
  futureHoldingActions,
  futureEarnings,
  stopLimitActions,
  marginFutureName,
  marginDate,
  marginType,
  marginAmount,
  marginBeforeAmount,
  marginAfterAmount,
  MarginBeforeLiquidatePrice,
  MarginAfterLiquidatePrice,
  futurePlanEntrustCount,
  futureStopLimitEntrustCount,
  futureStopLimitTradedEntrustCount,
  futurePlanPrice,
  realizedProfit,
}
/** 传入 id 数组 和可选映射函数返回筛选和重新排序后的列 */
export function getOrderTableColumns(
  getBaseColumns: () => any[],
  ids: ORDER_TABLE_COLUMN_ID[],
  map?: Record<any, (col: TableColumnProps<any>) => TableColumnProps<any>>
): TableColumnProps<any>[] {
  const columns = getBaseColumns()
    .filter(col => ids.includes(col.id))
    .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
  columns.forEach((col, index) => {
    if (col.align) {
      return
    }
    if (index === 0) {
      col.align = 'left'
    } else if (index > 0) {
      col.align = 'right'
    }
  })
  return columns.map(col => (map?.[col.id] ? map[col.id](col) : col))
}

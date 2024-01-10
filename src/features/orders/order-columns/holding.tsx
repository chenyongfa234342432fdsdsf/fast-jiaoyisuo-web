import {
  FutureHoldingOrderDirectionEnum,
  getFutureHoldingOrderDirectionEnumName,
  getFutureHoldingOrderPositionTypeEnumName,
} from '@/constants/order'
import { IFutureHoldingOrderItem } from '@/typings/api/order'
import { t } from '@lingui/macro'
import classNames from 'classnames'
import { TableColumnProps } from '@nbit/arco'
import { FutureHoldingActionCell, FutureHoldingCell, FutureMarginCell } from '../order-table-cell'
import { ORDER_TABLE_COLUMN_ID } from './base'

export function getBaseFutureHoldingColumns() {
  const baseColumns: Array<
    TableColumnProps<IFutureHoldingOrderItem> & {
      id: ORDER_TABLE_COLUMN_ID
    }
  > = [
    {
      title: (
        <div className="flex items-center justify-center">
          <span>{t`features/orders/order-columns/holding-0`}</span>
          <span className="mx-2 text-lg">|</span>
          <span>{t`features/orders/order-columns/holding-1`}</span>
        </div>
      ),
      align: 'center',
      width: 150,
      id: ORDER_TABLE_COLUMN_ID.futureHoldings,
      render(_col, item) {
        return <FutureHoldingCell order={item as any} />
      },
    },
    {
      title: t`features/orders/order-columns/future-1`,
      width: 100,
      id: ORDER_TABLE_COLUMN_ID.futureHoldingPositionType,
      render(_col, item) {
        return <div>{getFutureHoldingOrderPositionTypeEnumName(item.type)}</div>
      },
    },
    {
      title: t`features/orders/details/modify-stop-limit-9`,
      width: 120,
      dataIndex: 'price',
      id: ORDER_TABLE_COLUMN_ID.futureOpenPrice,
    },
    {
      title: t`features/orders/order-columns/holding-2`,
      width: 120,
      dataIndex: 'liqudatePrice',
      id: ORDER_TABLE_COLUMN_ID.futureLiquidationPrice,
    },
    {
      title: t`order.columns.direction`,
      width: 90,
      id: ORDER_TABLE_COLUMN_ID.futureHoldingDirection,
      render(_col, item) {
        return (
          <div
            className={classNames(
              [FutureHoldingOrderDirectionEnum.buy].includes(item.side as any)
                ? 'text-buy_up_color'
                : 'text-sell_down_color'
            )}
          >
            {getFutureHoldingOrderDirectionEnumName(item.side as any)}
          </div>
        )
      },
    },
    {
      title: t`features/orders/order-columns/holding-3`,
      width: 180,
      id: ORDER_TABLE_COLUMN_ID.futureMargin,
      render(_col, item) {
        return <FutureMarginCell order={item} />
      },
    },
    {
      title: t`features/orders/order-columns/holding-4`,
      width: 120,
      id: ORDER_TABLE_COLUMN_ID.futureMarginRate,
      render(_col, item) {
        return <div>{item.frontendCalcOpenMarginRateTwo}%</div>
      },
    },
    {
      title: (
        <div className="flex items-center justify-center">
          <span>{t`features/orders/order-columns/future-2`}</span>
          <span className="mx-2 text-lg">|</span>
          <span>{t`features/orders/order-columns/holding-5`}</span>
        </div>
      ),
      align: 'center',
      width: 150,
      id: ORDER_TABLE_COLUMN_ID.futureEarnings,
      render(_col, item) {
        return (
          <div
            className={classNames({
              'text-buy_up_color': item.frontendCalcEarnings >= 0,
              'text-sell_down_color': item.frontendCalcEarnings < 0,
            })}
          >
            <div>{item.frontendCalcEarnings}</div>
            <div>{item.frontendCalcYieldRate}%</div>
          </div>
        )
      },
    },
    {
      title: t`features/orders/order-columns/holding-6`,
      width: 120,
      dataIndex: 'frontendCalcUnRealizedSurplus',
      id: ORDER_TABLE_COLUMN_ID.futureUnRealizedSurplus,
    },
    {
      title: t`features/orders/order-columns/holding-7`,
      width: 120,
      dataIndex: 'realizedSurplus',
      id: ORDER_TABLE_COLUMN_ID.futureRealizedSurplus,
    },
    {
      title: t`order.columns.action`,
      width: 250,
      fixed: 'right',
      align: 'right',
      id: ORDER_TABLE_COLUMN_ID.futureHoldingActions,
      render(_col, item) {
        return <FutureHoldingActionCell order={item} />
      },
    },
  ]
  return baseColumns as any
}

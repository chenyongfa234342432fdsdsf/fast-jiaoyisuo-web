import { formatDate } from '@/helper/date'
import { IMarginOrderItem } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { TableColumnProps } from '@nbit/arco'
import { FutureNameCell } from '../order-table-cell'
import { ORDER_TABLE_COLUMN_ID } from './base'

export function getBaseFutureMarginColumns() {
  const baseColumns: Array<
    TableColumnProps<IMarginOrderItem> & {
      id: ORDER_TABLE_COLUMN_ID
    }
  > = [
    {
      title: t`features/orders/filters/future-1`,
      width: 120,
      align: 'left',
      id: ORDER_TABLE_COLUMN_ID.marginFutureName,
      render(_col, item) {
        return <FutureNameCell order={item.contract as any} />
      },
    },
    {
      title: t`assets.financial-record.search.time`,
      width: 180,
      id: ORDER_TABLE_COLUMN_ID.marginDate,
      render(_col, item) {
        return <div>{formatDate(item.createdDate)}</div>
      },
    },
    {
      title: t`assets.financial-record.search.type`,
      width: 100,
      id: ORDER_TABLE_COLUMN_ID.marginType,
      dataIndex: 'type',
    },
    {
      title: t`features/orders/order-columns/margin-0`,
      width: 120,
      id: ORDER_TABLE_COLUMN_ID.marginAmount,
      dataIndex: 'amount',
    },
    {
      title: t`features/orders/order-columns/margin-1`,
      width: 140,
      id: ORDER_TABLE_COLUMN_ID.marginBeforeAmount,
      dataIndex: 'beforeMargin',
    },
    {
      title: t`features/orders/order-columns/margin-2`,
      width: 140,
      id: ORDER_TABLE_COLUMN_ID.marginAfterAmount,
      dataIndex: 'beforeMargin',
    },
    {
      title: t`features/orders/order-columns/margin-3`,
      width: 150,
      id: ORDER_TABLE_COLUMN_ID.MarginBeforeLiquidatePrice,
      dataIndex: 'beforeLiquidatePrice',
    },
    {
      title: t`features/orders/order-columns/margin-4`,
      width: 150,
      id: ORDER_TABLE_COLUMN_ID.MarginAfterLiquidatePrice,
      dataIndex: 'afterLiquidatePrice',
    },
  ]
  return baseColumns as any
}

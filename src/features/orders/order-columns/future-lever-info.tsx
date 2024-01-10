import { getPercentDisplay } from '@/helper/common'
import { formatCurrency } from '@/helper/decimal'
import { IFutureLeverInfoItem } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { TableColumnProps, Tooltip } from '@nbit/arco'

export function getFutureLeverInfoColumns(coinName: string) {
  const baseColumns: Array<TableColumnProps<IFutureLeverInfoItem>> = [
    {
      title: t`features_orders_order_columns_future_lever_info_5101380`,
      width: 60,
      render(_col, item) {
        return <div>{item.level}</div>
      },
    },
    {
      title: (
        <div>
          <Tooltip content={t`features_orders_order_columns_future_lever_info_5101377`}>
            <span className="dashed-border">
              {t`features_orders_order_columns_future_lever_info_5101381`} ({coinName})
            </span>
          </Tooltip>
        </div>
      ),
      align: 'right',
      width: 80,
      render(_col, item) {
        return <div>{formatCurrency(item.maxHolding)}</div>
      },
    },
    {
      title: (
        <div>
          <Tooltip content={t`features_orders_order_columns_future_lever_info_5101378`}>
            <span className="dashed-border">{t`features_orders_order_columns_future_lever_info_5101382`}</span>
          </Tooltip>
        </div>
      ),
      align: 'right',
      width: 80,
      render(_col, item) {
        return <div>{formatCurrency(item.lever)}X</div>
      },
    },
    {
      title: (
        <div>
          <Tooltip content={t`features_orders_order_columns_future_lever_info_5101379`}>
            <span className="dashed-border">{t`features_orders_order_columns_future_lever_info_5101383`}</span>
          </Tooltip>
        </div>
      ),
      align: 'right',
      width: 80,
      render(_col, item) {
        return <div>{getPercentDisplay(item.marginRate)}</div>
      },
    },
  ]
  return baseColumns
}

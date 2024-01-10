import { formatDate } from '@/helper/date'
import { baseAssetsFuturesStore } from '@/store/assets/futures'
import { IFutureFundingFeeLog } from '@/typings/api/order'
import { t } from '@lingui/macro'
import { TableColumnProps } from '@nbit/arco'
import { IncreaseTag } from '@nbit/react'
import { FutureFundingFeeActionCell, FutureNameCell } from '../order-table-cell'

export function getFutureFundingColumns() {
  const { futuresCurrencySettings } = baseAssetsFuturesStore.getState()
  const baseColumns: Array<TableColumnProps<IFutureFundingFeeLog>> = [
    {
      title: t`order.columns.date`,
      width: 180,
      render(_col, item) {
        return <div>{formatDate(item.createdByTimeLong!)}</div>
      },
    },
    {
      title: t`future.funding-history.future-select.future`,
      width: 180,
      render(_col, item) {
        return <FutureNameCell order={item as any} />
      },
    },
    {
      title: t`features/assets/futures/history-list/index-0`,
      width: 180,
      render(_col, item) {
        return (
          <div>
            <IncreaseTag isRound={false} digits={futuresCurrencySettings?.offset} value={item.amount} kSign />
            &nbsp;
            {item.quoteSymbolName}
          </div>
        )
      },
    },
    {
      title: t`order.columns.action`,
      width: 80,
      align: 'center',
      fixed: 'right',
      render(_col, item) {
        return <FutureFundingFeeActionCell item={item} />
      },
    },
  ]
  return baseColumns as any
}

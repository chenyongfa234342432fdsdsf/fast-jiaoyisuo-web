/**
 * 财务记录详情 - 成交明细
 */
import { PerpetualDealDetail } from '@/typings/api/assets/assets'
import { TableColumnProps } from '@nbit/arco'
import Table from '@/components/table'
import { formatDate } from '@/helper/date'
import { replaceEmpty } from '@/helper/filters'
import { formatCurrency } from '@/helper/decimal'
import { t } from '@lingui/macro'
import styles from './base.module.css'

// 交易日志
export function OrderLogs({ logs }: { logs: PerpetualDealDetail[] }) {
  const columns: TableColumnProps<PerpetualDealDetail>[] = [
    {
      title: t`future.funding-history.index-price.column.time`,
      render(_, log) {
        return formatDate(log.time!)
      },
    },
    {
      title: t`Amount`,
      align: 'right',
      render(_, log) {
        return `${replaceEmpty(log.size)} ${replaceEmpty(log.baseSymbolName)}`
      },
    },
    {
      title: t`future.funding-history.index.table-type.price`,
      align: 'right',
      render(_, log) {
        return replaceEmpty(formatCurrency(log.price!))
      },
    },
    {
      title: t`order.columns.logFee`,
      align: 'right',
      render(_, log) {
        return `${replaceEmpty(formatCurrency(log.fee))} ${replaceEmpty(log.quoteSymbolName)}`
      },
    },
  ]
  if (!logs || logs.length === 0) {
    return <div className="text-center text-text_color_03 py-9 text-xs">{t`trade.c2c.noData`}</div>
  }

  return (
    <div className={styles['logs-table-wrapper']}>
      <Table
        border={false}
        scroll={{
          y: 100,
          x: 600,
        }}
        className="scrollbar-custom"
        pagination={false}
        columns={columns}
        data={logs}
        rowKey={record => `${record.time}${Math.ceil(Math.random() * 100)}`}
      />
    </div>
  )
}

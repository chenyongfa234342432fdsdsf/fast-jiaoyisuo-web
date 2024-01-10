import { ReactNode, useState } from 'react'
import { t } from '@lingui/macro'
import { TableColumnProps } from '@nbit/arco'
import Table from '@/components/table'
import { useMount, useRequest } from 'ahooks'
import { IOrderDetail, IOrderDetailLog } from '@/typings/api/order'
import { queryOrderDetail } from '@/apis/order'
import { formatDate } from '@/helper/date'
import { OrderDirectionEnum } from '@/constants/order'
import styles from './order.module.css'

export type IOrderDetailTableProps = {
  children?: ReactNode
  order: IOrderDetail
}

export function OrderDetailTable({ children, order }: IOrderDetailTableProps) {
  const [detail, setDetail] = useState<IOrderDetailLog[]>([])
  const [page, setPage] = useState(1)
  const columns: TableColumnProps<IOrderDetailLog>[] = [
    {
      title: t`order.columns.logTime`,
      width: 150,
      render(_col, item) {
        return <div>{formatDate(item.lastupdattime)}</div>
      },
    },
    {
      title: t`order.columns.logCount`,
      width: 150,
      render(_col, item) {
        return (
          <div>
            {item.count} {order.sellCoinShortName?.toUpperCase()}
          </div>
        )
      },
    },
    {
      title: t`order.columns.logPrice`,
      width: 150,
      render(_col, item) {
        return (
          <div>
            {item.prize} {order.buyCoinShortName?.toUpperCase()}
          </div>
        )
      },
    },
    {
      title: t`order.columns.logFee`,
      width: 150,
      render(_col, item) {
        return (
          <div>
            {item.fee}{' '}
            {(order.side === OrderDirectionEnum.sell ? order.buyCoinShortName : order.sellCoinShortName)?.toUpperCase()}
          </div>
        )
      },
    },
  ]
  const { run: runFetchDetail, loading } = useRequest(
    async () => {
      const res = await queryOrderDetail({
        entrustId: order.id,
        matchType: 1,
      })
      if (!res.data || !res.isOk) {
        return
      }
      setDetail(res.data.entrustLogs)
    },
    {
      manual: true,
    }
  )
  useMount(runFetchDetail)

  return (
    <div className={styles['order-detail-table-wrapper']}>
      <Table
        pagination={{
          current: page,
          onChange: setPage,
          total: detail.length,
          pageSize: 10,
          hideOnSinglePage: true,
        }}
        data={detail.slice((page - 1) * 10, page * 10)}
        loading={loading}
        columns={columns}
        rowKey={item => item.id}
      />
      {children}
    </div>
  )
}
export function expandedRowRender(record: any) {
  return <OrderDetailTable order={record} />
}

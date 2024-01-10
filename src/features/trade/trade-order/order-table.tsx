import { expandedRowRender } from '@/features/orders/order-detail-table'
import {} from '@nbit/arco'
import Table from '@/components/table'
import classNames from 'classnames'
import { getSpotColumns } from '@/features/orders/order-columns/spot'
import { OrderTabTypeEnum } from '@/constants/order'
import styles from './index.module.css'

const columns = getSpotColumns(OrderTabTypeEnum.current, {} as any)
const width = columns.reduce((acc, cur) => acc + (cur.width as number), 0)

export function TradeOrderTable() {
  const data = []
  return (
    <div className={classNames(styles['order-table-wrapper'], 'markcoin-order-arco-table-wrapper mini')}>
      <Table
        scroll={{
          x: width,
        }}
        rowKey={i => i.orderId}
        columns={columns}
        data={data}
        pagination={false}
        expandedRowRender={expandedRowRender}
        expandProps={{
          rowExpandable() {
            return true
          },
        }}
      />
    </div>
  )
}

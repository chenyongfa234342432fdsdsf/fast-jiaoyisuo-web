import { TableProps } from '@nbit/arco'
import Table from '@/components/table'
import { uniqueId } from 'lodash'
import styles from './index.module.css'

interface ITableProps extends TableProps {
  sortable?: boolean
}

export default function SortableTable(props: ITableProps) {
  let { columns, sortable, ...rest } = props

  if (sortable) {
    columns = columns!.map(col => {
      return {
        ...col,
        sorter: (a, b) => {
          const lastIdx = a[col.dataIndex as string].length - 1
          if (typeof a[col.dataIndex as string] === 'string' && a[col.dataIndex as string][lastIdx] === '%') {
            return parseInt(a[col.dataIndex as string]) - parseInt(b[col.dataIndex as string])
          } else if (typeof a[col.dataIndex as string] === 'string') {
            const aString = a[col.dataIndex as string]
            const bString = b[col.dataIndex as string]
            if (aString < bString) return -1
            if (aString > bString) return 1
            return 0
          }
          // default is number type
          return a[col.dataIndex as string] - b[col.dataIndex as string]
        },
      }
    })
  }

  return (
    <div className={styles.scoped}>
      <Table rowKey={item => item?.id || uniqueId} {...rest} columns={columns} showSorterTooltip={false} />
    </div>
  )
}

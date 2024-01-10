import Table, { ITableProps as IProps } from '@/components/table'
import styles from './index.module.css'

interface ITableProps extends IProps {
  sortable?: boolean
}

export default function AssetsTable(props: ITableProps) {
  let { columns, sortable, ...rest } = props

  if (sortable) {
    columns = columns!.map(col => {
      if (!col.sorter) {
        return col
      }

      const sorterCol = {
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

      return sorterCol
    })
  }

  return (
    <div className={styles.scoped}>
      <Table
        {...rest}
        className="scrollbar-custom"
        columns={columns}
        border={{
          bodyCell: false,
          cell: false,
          wrapper: false,
        }}
        showSorterTooltip={false}
      />
    </div>
  )
}

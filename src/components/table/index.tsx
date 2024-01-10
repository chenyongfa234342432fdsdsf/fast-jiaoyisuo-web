import { useTableAutoWidth } from '@/hooks/use-table-auto-width'
import { TableProps as ArcoTableProps, Table as ArcoTable } from '@nbit/arco'
import classNames from 'classnames'
import styles from './index.module.css'

export type ITableProps<T = any> = ArcoTableProps<T> & {
  /** 启用宽度自适应功能 */
  autoWidth?: boolean
  /** 所以自适应根据内容来启用，开启不换行 */
  fitByContent?: boolean
  /** 每一列设置好的宽度最是否为最小宽度 */
  minWidthWithColumn?: boolean
}
/**
 * 主要做了宽度自适应和一些滚动条优化，其它样式统一细节会后续加入
 * 注意事项：
 * 1、开启 autoWidth 后，只是会在列宽度总和小于表格宽度时分配剩余宽度（如果表格宽度固定，比如 1200px，所有列宽度总和小于 1200px，仍然会分配剩余宽度，同时如果超出 1200px，会出现滚动行为）,table 组件 scroll.x 设置无效
 * 2、开启 fitByContent 默认不换行，每一列宽度根据内容部电话，但每一列设置的宽度即使 columns.width 为最小宽度， 且 columns.width 设置无效
 * 2.1、如果需要换行，请在 render 函数内指定组件最大宽度并设置为可换行（非 columns.width）（否则每次计算得到的宽度是不一致的）
 * 2.2 如果需要完全根据内容宽度自适应，需要设置 minWidthWithColumn 为 false
 * 3、暂无
 */
function Table<T = any>(props: ITableProps<T>) {
  const {
    autoWidth = false,
    fitByContent = false,
    minWidthWithColumn = true,
    className,
    data,
    scroll,
    pagination,
    columns: propColumns,
    ...rest
  } = props
  let columns = propColumns?.map(col => ({ ...col })) || []
  const page = typeof pagination === 'boolean' ? pagination : pagination?.current
  const pageSize = typeof pagination === 'boolean' ? pagination : pagination?.pageSize
  const { tableContainerRef, innerColumns } = useTableAutoWidth({
    columns,
    deps: [page, pageSize, data, propColumns],
    fitByContent,
    enabled: autoWidth,
    minWidthWithColumn,
  })
  columns = propColumns?.map(col => ({ ...col })) || []
  if (autoWidth) {
    columns.forEach((col, index) => {
      col.width = innerColumns[index].width
      col.render = innerColumns[index].renderInlineBlock
      col.title = innerColumns[index].titleInlineBlock
    })
  }
  const width: number = columns.reduce((acc, cur) => acc + (cur.width as number), 0)
  let overflowY = true
  let overflowX = true
  if (tableContainerRef.current && autoWidth) {
    // 一定误差内不展示滚动条
    if (width - tableContainerRef.current.clientWidth < 12) {
      overflowX = false
    }
    if (scroll?.y) {
      const bodyHeight = tableContainerRef.current.querySelector('.arco-table-body')?.scrollHeight || 0
      if (typeof scroll?.y === 'number' && bodyHeight - scroll.y < 8) {
        overflowY = false
      }
    }
  }
  return (
    <ArcoTable
      className={classNames(className, autoWidth ? styles['table-component-wrapper'] : '', {
        'width-false': overflowX === false,
        'height-false': !overflowY,
      })}
      ref={instance => {
        tableContainerRef.current = instance?.getRootDomElement?.()
      }}
      scroll={{
        x: autoWidth && overflowX ? width : scroll?.x,
        y: scroll?.y,
      }}
      pagination={pagination}
      data={data}
      columns={columns}
      {...rest}
    />
  )
}

export default Table

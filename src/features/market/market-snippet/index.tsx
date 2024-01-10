import SortableTable from '@/components/sortable-table'
import { IconRightCircle } from '@nbit/arco/icon'
import classNames from 'classnames'
import { createRef } from 'react'
import styles from './index.module.css'

export default MarketSnippet

function MarketSnippet({ title, columns, data }) {
  const iconRef = createRef() as React.RefObject<HTMLDivElement>

  const showIcon = () => {
    iconRef.current?.classList.remove('invisible')
  }
  const hideIcon = () => {
    iconRef.current?.classList.add('invisible')
  }

  return (
    <div className={classNames(styles.scoped)} onFocus={showIcon} onMouseOver={showIcon} onMouseLeave={hideIcon}>
      <div className="snippet-header">
        <div className="capitalize text-text_color_3">{title}</div>
        <IconRightCircle ref={iconRef} className="invisible" />
      </div>
      <SortableTable
        rowKey={record => `${record.coin}_${record.id}`}
        columns={columns}
        data={data}
        showHeader={false}
        border={{
          bodyCell: false,
          cell: false,
          wrapper: false,
        }}
        pagination={false}
      />
    </div>
  )
}

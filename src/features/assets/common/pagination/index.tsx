import { Pagination, PaginationProps } from '@nbit/arco'
import { RefObject } from 'react'
import styles from './index.module.css'

interface AssetsPaginationProps extends PaginationProps {
  children?: React.ReactNode
  /** 需要置顶的 Dom 节点 */
  targetRef?: RefObject<HTMLDivElement>
}
export default function AssetsPagination({ targetRef, ...props }: AssetsPaginationProps) {
  // const handleClick = () => {
  //   // 将目标 DOM 元素滚动到视图中
  //   targetRef && targetRef.current && targetRef.current.scrollIntoView({ behavior: 'smooth' })
  // }
  return (
    <div className={styles.scoped}>
      <Pagination
        showTotal
        showJumper
        sizeCanChange
        hideOnSinglePage
        pageSizeChangeResetCurrent
        {...props}
        onChange={(pageNumber: number, pageSize: number) => {
          // handleClick()
          props.onChange && props.onChange(pageNumber, pageSize)
        }}
      />
    </div>
  )
}

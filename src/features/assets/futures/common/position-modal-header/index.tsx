/**
 * 合约持仓 - 操作类弹窗头部
 */

import { IPositionListData } from '@/typings/api/assets/futures/position'
import FuturesInfoTag from '../futures-info-tag'
import styles from './index.module.css'

interface IPositionModalHeaderProps {
  /** 标题 */
  title: string
  /** 仓位信息 */
  positionData: IPositionListData
}

function PositionModalHeader(props: IPositionModalHeaderProps) {
  const { title, positionData } = props
  return (
    <div className={`${styles['position-modal-header-root']}`}>
      <div className="px-8">
        <div className="position-modal-header-title">{title}</div>
        <div className="name-cell">
          <FuturesInfoTag positionData={positionData} />
        </div>
      </div>
    </div>
  )
}

export { PositionModalHeader }

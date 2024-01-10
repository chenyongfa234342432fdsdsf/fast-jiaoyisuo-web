/**
 * 合约 - 交易方向标签组件
 */
import classNames from 'classnames'
import { IPositionListData } from '@/typings/api/assets/futures/position'
import {
  getFuturesGroupTypeName,
  getFuturePositionDirectionEnumName,
  FuturePositionDirectionEnum,
} from '@/constants/assets/futures'
import styles from './index.module.css'

interface FuturesInfoTagProps {
  /** 是否展示交易方向标签，默认展示 */
  showDirection?: boolean
  /** 是否展示合约组标签，默认展示 */
  showGroupName?: boolean
  /** 是否展示币对，默认展示 */
  showSymbolName?: boolean
  /** 是否展示杠杆倍数，默认展示 */
  showLever?: boolean
  /** 仓位信息 */
  positionData: IPositionListData
}
export default function FuturesInfoTag(props: FuturesInfoTagProps) {
  const {
    /** 是否展示币对名 */
    showSymbolName = true,
    /** 是否展示交易方向 */
    showDirection = true,
    /** 是否展示杠杆倍数 */
    showLever = true,
    /** 是否展示合约组名称 */
    showGroupName = true,
    /**
     * symbol: 币对名
     * typeInd: 合约类型 perpetual:永续 delivery:交割
     * sideInd: 交易方向 open_long:多仓位 open_short:空仓位
     * lever: 杠杆倍数
     * groupName: 合约组名
     */
    positionData: { symbol = '', typeInd = '', sideInd = '', lever = '', groupName = 'A' },
  } = props || {}

  const isBuy = sideInd === FuturePositionDirectionEnum.openBuy
  return (
    <div className={styles['futures-info-tag-root']}>
      {showSymbolName && (
        <span className="name">
          {symbol} {getFuturesGroupTypeName(typeInd)}
        </span>
      )}
      {showDirection && (
        <div
          className={classNames('direction-tag', {
            'bg-sell_down_color_special_02': !isBuy,
            'text-sell_down_color': !isBuy,
            'bg-buy_up_color_special_02': isBuy,
            'text-buy_up_color': isBuy,
          })}
        >
          {getFuturePositionDirectionEnumName(sideInd)}
        </div>
      )}
      {showLever && (
        <div className="lever-tag">
          <span>{lever}X</span>
        </div>
      )}
      {showGroupName && <div className="futures-tag">{groupName}</div>}
    </div>
  )
}

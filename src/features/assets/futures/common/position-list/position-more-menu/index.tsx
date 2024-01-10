/**
 * 合约 - 持仓列表 - 更多功能列表
 */
import classNames from 'classnames'
import { getMoreOperateList, MoreOperateEnum, FuturesPositionStatusTypeEnum } from '@/constants/assets/futures'
import { Spin } from '@nbit/arco'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import styles from './index.module.css'

type IMenuCellsProps = {
  /** 操作回调 */
  onClickMenu?: (v) => void
  /** 当前操作项 */
  activeType?: number
  /** 锁仓状态 */
  lockStatus?: string
  /** 是否专业版 */
  isProfessionalVersion?: boolean
}
export function PositionMoreMenuList({ onClickMenu, activeType, lockStatus, isProfessionalVersion }: IMenuCellsProps) {
  const onClick = values => {
    onClickMenu && onClickMenu(values)
  }
  const assetsFuturesStore = useAssetsFuturesStore()
  /** 商户设置的计价币的法币精度和法币符号，USD 或 CNY 等 */
  const { positionListLoading } = { ...assetsFuturesStore }
  const moreOperateList = getMoreOperateList(lockStatus, isProfessionalVersion)

  return (
    <div className={styles['menu-cells']}>
      <Spin loading={positionListLoading}>
        {moreOperateList.map(v => (
          <div className="cell" key={v.type} onClick={() => onClick(v.type)}>
            <div className="cell-wrap">
              <span
                className={classNames({
                  'is-selected': Number(activeType) === Number(v.type),
                  'is-disabled': lockStatus === FuturesPositionStatusTypeEnum.locked && v.type !== MoreOperateEnum.lock,
                })}
              >
                {v.name}
              </span>
            </div>
          </div>
        ))}
      </Spin>
    </div>
  )
}

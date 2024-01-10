/**
 * 合约 - 保证金资产划出划入菜单
 */
import classNames from 'classnames'
import { getFuturesTransferList } from '@/constants/assets/futures'
import { Spin } from '@nbit/arco'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import styles from './index.module.css'

type IMenuCellsProps = {
  /** 当前操作项 */
  activeType?: number
  groupId: string
  coinId?: string
}
export function MarginTransferMenuList({ activeType, groupId, coinId }: IMenuCellsProps) {
  const { updateFuturesTransferModal } = useAssetsFuturesStore()
  const onClick = values => {
    updateFuturesTransferModal({ visible: true, type: values, coinId, groupId })
  }
  const assetsFuturesStore = useAssetsFuturesStore()
  const { positionListLoading } = { ...assetsFuturesStore }
  const moreOperateList = getFuturesTransferList()

  return (
    <div className={styles['menu-cells']}>
      <Spin loading={positionListLoading}>
        {moreOperateList.map(v => (
          <div className="cell" key={v.type} onClick={() => onClick(v.type)}>
            <div className="cell-wrap">
              <span
                className={classNames({
                  'is-selected': Number(activeType) === Number(v.type),
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

/**
 * 合约资产首页 - 逐仓保证金资产列表
 */
import { Popover } from '@nbit/arco'
import Icon from '@/components/icon'
import { formatAssetInfo, rateFilterFuturesMargin } from '@/helper/assets/futures'
import ListEmpty from '@/components/list-empty'
import { IFuturesAssetsGroupList } from '@/typings/api/assets/futures'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { formatCoinAmount } from '@/helper/assets'
import styles from '../index.module.css'
import { MarginTransferMenuList } from '../transfer-menu'

type IMarginPositionCellProps = {
  groupList: IFuturesAssetsGroupList[]
  symbol: string
  coinId?: string
}

export default function MarginPositionCell({ groupList, symbol, coinId }: IMarginPositionCellProps) {
  const assetsFuturesStore = useAssetsFuturesStore()
  const {
    futuresCurrencySettings: { currencySymbol, offset },
  } = { ...assetsFuturesStore }

  return (
    <div className={styles['list-wrap']}>
      {groupList && groupList?.length > 0 ? (
        groupList?.map(item => (
          <div className="group-list-item" key={item.groupName}>
            <div className="coin-name">{item.groupName}</div>
            <div className="list-right">
              <div className="item-value">
                <span className="font-medium">{formatCoinAmount(symbol, item.amount)}</span>
                <span className="currency">≈{formatAssetInfo(item.convertedValue, currencySymbol, offset)}</span>
              </div>
              <Popover
                position="bottom"
                trigger="hover"
                triggerProps={{
                  className: styles['more-popup-wrapper'],
                }}
                content={<MarginTransferMenuList groupId={item.groupId} coinId={coinId} />}
              >
                <div className="flex h-full items-center">
                  <Icon hasTheme name="msg_more_def" className="ml-4" />
                </div>
              </Popover>
            </div>
          </div>
        ))
      ) : (
        <ListEmpty />
      )}
    </div>
  )
}

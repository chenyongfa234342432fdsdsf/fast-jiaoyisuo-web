/**
 * 合约资产首页 - 保证金资产列表
 */
import { Drawer, Popover } from '@nbit/arco'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import LazyImage from '@/components/lazy-image'
import { rateFilterFuturesMargin } from '@/helper/assets/futures'
import { formatCoinAmount } from '@/helper/assets'
import ListEmpty from '@/components/list-empty'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { usePageContext } from '@/hooks/use-page-context'
import styles from '../index.module.css'
import { MarginTransferMenuList } from '../transfer-menu'

type IMenuCellsProps = {
  visible: boolean
  setVisible: (val: boolean) => void
}

export function FuturesDetailMarginAssetList(props: IMenuCellsProps) {
  const { visible, setVisible } = props || {}
  const pageContext = usePageContext()
  const { groupId } = pageContext.routeParams
  const assetsFuturesStore = useAssetsFuturesStore()
  const {
    futuresCurrencySettings: { offset, currencySymbol },
  } = { ...assetsFuturesStore }
  const { marginList } = useAssetsFuturesStore()
  const marginAssetData = marginList.list

  return (
    <Drawer
      className={styles.scoped}
      width={400}
      title={t`features_assets_futures_futures_detail_index_6idfpkpwfmdr18zxis0fr`}
      visible={visible}
      footer={null}
      onOk={() => {
        setVisible(false)
      }}
      onCancel={() => {
        setVisible(false)
      }}
    >
      <div className={styles['list-wrap']}>
        {marginAssetData && marginAssetData?.length > 0 ? (
          marginAssetData?.map(item => (
            <div className="list-item" key={item.coinId}>
              <div className="coin-name !font-normal">
                <LazyImage className="mr-2" src={item.webLogo} width={24} height={24} />
                {item.coinName}
              </div>
              <div className="list-right">
                <div className="item-value">
                  <span className="font-medium">{formatCoinAmount(item.symbol, item.amount)}</span>
                  <span className="currency">{`≈${rateFilterFuturesMargin({
                    amount: item.amount,
                    symbol: item.symbol,
                    currencySymbol,
                  })}`}</span>
                </div>
                <Popover
                  position="bottom"
                  trigger="hover"
                  triggerProps={{
                    className: styles['more-popup-wrapper'],
                  }}
                  content={<MarginTransferMenuList coinId={item.coinId} groupId={groupId} />}
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
    </Drawer>
  )
}

import Icon from '@/components/icon'
import Link from '@/components/link'
import { Tooltip } from '@nbit/arco'
import { t } from '@lingui/macro'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import { rateFilter, formatCoinAmount } from '@/helper/assets'
import ListEmpty from '@/components/list-empty'
import LazyImage from '@/components/lazy-image'
import { useUpdateEffect } from 'ahooks'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import styles from './index.module.css'
import { ToolTipContent } from '../../common/assets-tooltip-info'

interface IAssetsListProps {
  loading: boolean
  assetsListData: any
}
export function AssetsList(props: IAssetsListProps) {
  const { loading, assetsListData } = props

  // 监听折算法币的变化
  useUpdateEffect(() => {}, [usePersonalCenterStore().fiatCurrencyData])

  return (
    <div className={styles.scoped}>
      {!loading && (!assetsListData || assetsListData.length === 0) && <ListEmpty />}
      {assetsListData &&
        assetsListData.map(item => (
          <Link key={item.coinId} href={`/assets/main/detail?cid=${item.coinId}`} className="coin-item">
            <div className="flex">
              <LazyImage src={item.webLogo ? item.webLogo : ''} width={32} height={32} />
              <div className="coin-name">
                <span>{item.coinName}</span>
                <span className="full-name">{item.coinFullName}</span>
              </div>
            </div>
            <div className="coin-val-wrap">
              <Tooltip
                content={
                  <ToolTipContent
                    data={[
                      { label: t`assets.common.available_count`, symbol: item.symbol, value: item.availableAmount },
                      {
                        label: t`features_assets_main_assets_list_index_5101066`,
                        symbol: item.symbol,
                        value: item.lockAmount,
                      },
                    ]}
                  />
                }
              >
                <div className="coin-val">
                  <AssetsEncrypt
                    content={
                      <>
                        <span className="total-amount">{formatCoinAmount(item.symbol, item.totalAmount)}</span>
                        <span className="total-price">
                          {rateFilter({ symbol: item.symbol, amount: item.totalAmount })}
                        </span>
                      </>
                    }
                  />
                </div>
              </Tooltip>
              {/* <Icon hasTheme name="next_arrow" className="text-base" /> */}
            </div>
          </Link>
        ))}
    </div>
  )
}

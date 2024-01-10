import { Tooltip } from '@nbit/arco'
import { t } from '@lingui/macro'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import { rateFilter, formatCoinAmount } from '@/helper/assets'
import ListEmpty from '@/components/list-empty'
import LazyImage from '@/components/lazy-image'
import { useUpdateEffect } from 'ahooks'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import { AssetsC2CListResp } from '@/typings/api/assets/c2c'
import { decimalUtils } from '@nbit/utils'
import Link from '@/components/link'
import styles from './index.module.css'
import { ToolTipContent } from '../../common/assets-tooltip-info'

interface IAssetsListProps {
  loading: boolean
  assetsListData: AssetsC2CListResp[]
}

const SafeCalcUtil = decimalUtils.SafeCalcUtil
export function AssetsList(props: IAssetsListProps) {
  const { loading, assetsListData } = props

  // 监听折算法币的变化
  useUpdateEffect(() => {}, [usePersonalCenterStore().fiatCurrencyData])

  return (
    <div className={styles.scoped}>
      {!loading && (!assetsListData || assetsListData.length === 0) && <ListEmpty />}
      {assetsListData &&
        assetsListData.map(item => (
          <Link key={item.coinId} className="coin-item" href={`/assets/c2c/detail?cid=${item.coinId}`}>
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
                      { label: t`assets.common.available_count`, symbol: item.symbol, value: item.balance },
                      {
                        label: t`features_assets_main_assets_list_index_5101066`,
                        symbol: item.symbol,
                        value: item?.merchantFreezeBalance
                          ? Number(SafeCalcUtil.add(item?.merchantFreezeBalance, item?.freezeBalance))
                          : Number(item?.freezeBalance),
                      },
                    ]}
                  />
                }
              >
                <div className="coin-val">
                  <AssetsEncrypt
                    content={
                      <>
                        <span className="total-amount">
                          {formatCoinAmount(
                            item.symbol,
                            String(
                              item?.merchantFreezeBalance
                                ? SafeCalcUtil.add(
                                    SafeCalcUtil.add(item?.merchantFreezeBalance, item?.freezeBalance),
                                    item?.balance
                                  )
                                : SafeCalcUtil.add(item?.balance, item?.freezeBalance)
                            )
                          )}
                        </span>
                        <span className="total-price">
                          {rateFilter({
                            symbol: item.symbol,
                            amount: String(
                              item?.merchantFreezeBalance
                                ? SafeCalcUtil.add(
                                    SafeCalcUtil.add(item?.merchantFreezeBalance, item?.freezeBalance),
                                    item?.balance
                                  )
                                : SafeCalcUtil.add(item?.balance, item?.freezeBalance)
                            ),
                          })}
                        </span>
                      </>
                    }
                  />
                </div>
              </Tooltip>
              {/* <Icon hasTheme name="next_arrow" className="arrow-icon" /> */}
            </div>
          </Link>
        ))}
    </div>
  )
}

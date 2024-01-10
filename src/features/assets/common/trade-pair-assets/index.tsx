/**
 * 交易 - 币种资产组件
 */
import { t } from '@lingui/macro'
import { Button } from '@nbit/arco'
import { useAssetsStore } from '@/store/assets'
import { useUserStore } from '@/store/user'
import Link from '@/components/link'
import { WithDrawTypeEnum } from '@/constants/assets'
import { NoDataElement } from '@/features/orders/order-table-layout'
import styles from './index.module.css'

export function TradePairAssets() {
  const { buyCoin, sellCoin } = useAssetsStore().userAssetsSpot || {}
  const { isLogin } = useUserStore()

  const renderBtn = ({ url, title }: { url: string; title: string }) => {
    if (isLogin) {
      return (
        <Link href={url} target>
          <Button type="secondary" className="right-btn" disabled={!isLogin}>
            {title}
          </Button>
        </Link>
      )
    }

    return (
      <Button type="secondary" className="right-btn" disabled={!isLogin}>
        {title}
      </Button>
    )
  }

  return (
    <div className={styles['trade-pair-assets-wrapper']}>
      <div className="assets-item">
        <span className="title">{t`features/user/personal-center/menu-navigation/index-1`}</span>

        <div className="header-right">
          {renderBtn({ url: `/assets/main/deposit?id=${sellCoin?.coinId}`, title: t`assets.deposit.title` })}
          {renderBtn({
            url: `/assets/main/withdraw?type=${WithDrawTypeEnum.blockChain}&id=${sellCoin?.coinId}`,
            title: t`assets.common.withdraw`,
          })}
        </div>
      </div>

      {isLogin && (
        <>
          <div className="assets-item">
            <div>
              <span className="coin-name">{sellCoin?.coinName || '--'}</span>
              <span className="available">{t`Avbl`}：</span>
            </div>

            <span className="num">{sellCoin?.availableAmountText || '--'}</span>
          </div>

          <div className="assets-item">
            <div>
              <span className="coin-name">{buyCoin?.coinName || '--'}</span>
              <span className="available">{t`Avbl`}：</span>
            </div>

            <span className="num">{buyCoin?.availableAmountText || '--'}</span>
          </div>
        </>
      )}
      {!isLogin && <NoDataElement />}
    </div>
  )
}

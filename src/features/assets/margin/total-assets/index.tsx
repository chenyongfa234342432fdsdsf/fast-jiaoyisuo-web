import { t } from '@lingui/macro'
import { Tooltip } from '@nbit/arco'
import { formatCurrency } from '@/helper/decimal'
import { useAssetsStore } from '@/store/assets'
import { useUserStore } from '@/store/user'
import { TradeMarginEnum } from '@/constants/trade'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import { EyesIcon } from '@/features/assets/common/eyes-icon'
import styles from './index.module.css'

type ITotalAssetsProps = {
  type: TradeMarginEnum
}

function TotalAssets({ type }: ITotalAssetsProps) {
  const assetsStore = useAssetsStore()
  const useStore = useUserStore()
  const currencyInfo = useAssetsStore().currencyInfo
  const userInfo = useStore.personalCenterSettings
  const allAssets = assetsStore.allMarginAssets // 充提币、划转默认选中 usdt

  /** 资产标题 */
  const getTitleInfo = () => {
    if (type === 'margin') {
      return t`features/assets/margin/total-assets/index-0`
    }
    return t`features/assets/margin/total-assets/index-1`
  }

  return (
    <div className={styles.scoped}>
      <div className="total-wrap">
        <div>
          <div className="asset-labal">
            <span>{getTitleInfo()}</span>
            <EyesIcon />
          </div>
          <div className="assets-number">
            <AssetsEncrypt
              content={`${allAssets.allCrossAssetsInUsdt} USDT ≈ ${userInfo.currencySymbol} ${allAssets.allCrossAssetsInCny}`}
            />
          </div>
        </div>
      </div>
      <div className="assets-item-wrap">
        <div className="asset-item">
          <div className="label">
            <Tooltip
              content={<span className="text-xs">{t`features/assets/main/index-5`}</span>}
            >{t`features/assets/margin/total-assets/index-2`}</Tooltip>
          </div>
          <span className="value">
            <AssetsEncrypt
              content={`${allAssets.allCrossDebtInUsdt} USDT ≈ ${userInfo.currencySymbol} ${allAssets.allCrossDebtInCny}`}
            />
          </span>
        </div>
        <div className="asset-item">
          <span className="label">{t`features/assets/futures/futuresList/index-0`}</span>
          <span className="value">
            <AssetsEncrypt
              content={`${allAssets.allCrossNetAssetsInUsdt} USDT ≈ ${userInfo.currencySymbol} ${allAssets.allCrossNetAssetsInCny}`}
            />
          </span>
        </div>
      </div>
    </div>
  )
}

export { TotalAssets }

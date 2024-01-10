import { t } from '@lingui/macro'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import { AssetsOverviewResp, FinancialAssetsData } from '@/typings/api/assets/assets'
import { EyesIcon } from '@/features/assets/common/eyes-icon'
import { CurrencySymbolEnum } from '@/constants/assets'
import { rateFilter } from '@/helper/assets'
import { SetCurrency } from '@/features/assets/common/set-currency'
import { useUpdateEffect } from 'ahooks'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import { formatCurrency } from '@nbit/utils/lib/decimal'
import styles from './index.module.css'

interface ITotalAssetsProps {
  assetsData: AssetsOverviewResp | undefined
}

function TotalAssets(props: ITotalAssetsProps) {
  const {
    totalAmount = 0,
    availableAmount = 0,
    lockAmount = 0,
    symbol = '--',
  } = {
    ...props.assetsData,
  }

  const totalAssets = formatCurrency(totalAmount, 2)
  const availableAssets = formatCurrency(availableAmount, 2)
  const lockAssets = formatCurrency(lockAmount, 2)

  // const totalAssets = rateFilter({
  //   symbol,
  //   amount: totalAmount,
  //   unit: CurrencySymbolEnum.code,
  //   showUnit: false,
  //   isFormat: true,
  // })
  // const availableAssets = rateFilter({ symbol, amount: availableAmount, unit: CurrencySymbolEnum.code })
  // const lockAssets = rateFilter({ symbol, amount: lockAmount, unit: CurrencySymbolEnum.code })

  // 监听折算法币的变化
  useUpdateEffect(() => {}, [usePersonalCenterStore().fiatCurrencyData])

  return (
    <div className={styles.scoped}>
      <div className="asset-item-wrap">
        <div className="asset-item">
          <div className="asset-total">
            <span>C2C {t`features_assets_c2c_total_assets_index_pu81ikjruc5xjrm--osae`}</span>
            <EyesIcon />
          </div>

          <span className="asset-total-num">
            <AssetsEncrypt content={`≈ ${totalAssets}`} />
            <SetCurrency />
          </span>
        </div>
      </div>

      <div className="asset-item-wrap">
        <div className="asset-item">
          <span className="asset-label">{t`assets.common.flow_assets`}</span>
          <span className="value">
            <AssetsEncrypt content={availableAssets} />
          </span>
        </div>
        <div className="asset-item">
          <span className="asset-label">{t`features/assets/margin/all/assets-list/index-2`}</span>
          <span className="value">
            <AssetsEncrypt content={lockAssets} />
          </span>
        </div>
      </div>
    </div>
  )
}

export { TotalAssets }

import { t } from '@lingui/macro'
import { IncreaseTag } from '@nbit/react'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import { AssetsOverviewResp } from '@/typings/api/assets/assets'
import { EyesIcon } from '@/features/assets/common/eyes-icon'
import { CurrencySymbolEnum } from '@/constants/assets'
import { rateFilter, rateFilterFutures } from '@/helper/assets'
import { SetCurrency } from '@/features/assets/common/set-currency'
import { useUpdateEffect } from 'ahooks'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import styles from './index.module.css'

interface ITotalAssetsProps {
  assetsData: AssetsOverviewResp
}

function TotalAssets(props: ITotalAssetsProps) {
  const {
    totalAmount = 0,
    availableAmount = 0,
    lockAmount = 0,
    positionAmount = 0,
    symbol = '',
    yesterdayProfitAndLoss = 0, // `${userCurrencySymbol}88.60`,
    yesterdayProfitAndLossRate = 0,
  } = {
    ...props.assetsData,
  }

  const defaultRateFilterParams = { unit: CurrencySymbolEnum.code, symbol: symbol || '' }
  const totalAssets = rateFilterFutures({ amount: totalAmount, showUnit: false, ...defaultRateFilterParams })
  const availableAssets = rateFilterFutures({
    amount: availableAmount,
    unit: CurrencySymbolEnum.code,
    symbol: symbol || '',
  })
  const lockAssets = rateFilterFutures({ amount: lockAmount, ...defaultRateFilterParams })
  const positionAssets = rateFilterFutures({
    amount: positionAmount,
    ...defaultRateFilterParams,
  })

  // 监听折算法币的变化
  useUpdateEffect(() => {}, [usePersonalCenterStore().fiatCurrencyData])

  return (
    <div className={styles.scoped}>
      <div className="asset-item-wrap">
        <div className="asset-item">
          <div className="asset-total">
            <span>{t`assets.common.total_assets_equal`}</span>
            <EyesIcon />
          </div>

          <span className="asset-total-num">
            <AssetsEncrypt content={`≈ ${totalAssets}`} />
            <SetCurrency />
          </span>
        </div>

        <div className="asset-item">
          <span className="asset-label"> {t`assets.common.yesterday_profit`}</span>
          <div className="value">
            <AssetsEncrypt
              content={
                <>
                  <IncreaseTag value={yesterdayProfitAndLoss || '--'} />
                  {/* <span className="percent">
                      <Icon className="profit-rate-icon" name="green_rise" />
                      <IncreaseTag
                        hasPrefix={false}
                        hasPostfix
                        digits={2}
                        value={yesterdayProfitAndLossRate}
                      />
                    </span> */}
                </>
              }
            />
          </div>
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
          <span className="asset-label">{t`assets.common.position_assets`}</span>
          <span className="value">
            <AssetsEncrypt content={positionAssets} />
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

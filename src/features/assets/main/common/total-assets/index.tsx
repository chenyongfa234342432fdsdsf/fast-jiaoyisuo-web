import { t } from '@lingui/macro'
import { IncreaseTag } from '@nbit/react'
import { AssetsEncrypt } from '@/features/assets/common/assets-encrypt'
import { AssetsOverviewResp } from '@/typings/api/assets/assets'
import { EyesIcon } from '@/features/assets/common/eyes-icon'
import { CurrencySymbolEnum } from '@/constants/assets'
import { rateFilter } from '@/helper/assets'
import { SetCurrency } from '@/features/assets/common/set-currency'
import { useUpdateEffect } from 'ahooks'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import styles from './index.module.css'

interface ITotalAssetsProps {
  assetsData: AssetsOverviewResp
}

function TotalAssets(props: ITotalAssetsProps) {
  // TODO 昨日盈亏第一期后端不做，前端先写死假数据
  const {
    totalAmount = 0,
    availableAmount = 0,
    lockAmount = 0,
    symbol = '--',
    yesterdayProfitAndLoss = 0,
    yesterdayProfitAndLossRate = 0,
  } = {
    ...props.assetsData,
  }

  const totalAssets = rateFilter({
    symbol,
    amount: totalAmount,
    unit: CurrencySymbolEnum.code,
    showUnit: false,
    isFormat: true,
  })
  const availableAssets = rateFilter({ symbol, amount: availableAmount, unit: CurrencySymbolEnum.code })
  const lockAssets = rateFilter({ symbol, amount: lockAmount, unit: CurrencySymbolEnum.code })

  // 监听折算法币的变化
  useUpdateEffect(() => {}, [usePersonalCenterStore().fiatCurrencyData])

  return (
    <div className={styles.scoped}>
      <div className="asset-item-wrap">
        <div className="asset-item">
          <div className="asset-total">
            <span>{t`features_assets_main_common_total_assets_index_qeof1mv-ldde91mkzwk4e`}</span>
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

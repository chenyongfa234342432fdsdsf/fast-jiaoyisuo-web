/**
 * 合约 - 仓位价格展示组件
 */
import { t } from '@lingui/macro'
import { formatCurrency } from '@/helper/decimal'
import { useAssetsFuturesStore } from '@/store/assets/futures'
import { formatRatioNumber } from '@/helper/assets/futures'
import styles from './index.module.css'

export default function MarginTotalInfo() {
  const assetsFuturesStore = useAssetsFuturesStore()
  const {
    futuresCurrencySettings: { offset, currencySymbol },
    futuresAssetsMarginScale,
  } = { ...assetsFuturesStore }
  const { coinValue = '', marginValue = '', averageScale = '' } = { ...futuresAssetsMarginScale } || {}
  const priceList = [
    {
      // 币种资产
      label: t({
        id: 'features_assets_futures_futures_detail_margin_total_info_index_5101366',
        values: { 0: currencySymbol },
      }),
      value: formatCurrency(coinValue, offset),
    },
    {
      // 保证金价值
      label: t({
        id: 'features_assets_futures_futures_detail_margin_total_info_index_5101367',
        values: { 0: currencySymbol },
      }),
      value: formatCurrency(marginValue, offset),
    },
    {
      // 平均折算比率
      label: t`features_assets_futures_futures_detail_margin_scale_modal_margin_total_info_index_veja73j76bkbwvdn_ucvb`,
      value: `${formatRatioNumber(averageScale)}%`,
    },
  ]
  return (
    <div className={styles['position-price-root']}>
      {priceList.map((item, index: number) => {
        return (
          <div className="price-item" key={index}>
            <span>{item.label}</span>
            <span className="value">{item.value}</span>
          </div>
        )
      })}
    </div>
  )
}

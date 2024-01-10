/**
 * 合约 - 仓位价格和预计盈亏
 */
import { Tooltip } from '@nbit/arco'
import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { IncreaseTag } from '@nbit/react'
import { useAssetsFuturesStore } from '@/store/assets/futures'

interface PlanPriceProps {
  direction?: boolean
  profitLossAmount: number
  size: string | number
  quoteSymbolName: string
  baseSymbolName: string
  positionAmountText?: string
}
export function PlanPrice(props: PlanPriceProps) {
  const assetsFuturesStore = useAssetsFuturesStore()
  /** 商户设置的计价币的法币精度和法币符号，USD 或 CNY 等 */
  const {
    futuresCurrencySettings: { currencySymbol, offset },
  } = { ...assetsFuturesStore }
  const {
    profitLossAmount = 0,
    // quoteSymbolName = '',
    baseSymbolName = '',
    size = '',
    positionAmountText = t`features_assets_futures_common_position_price_footer_position_price_index_5101498`,
  } = props || {}
  return (
    <div className="info-list-wrap">
      <div className="info-item">
        <span>{positionAmountText}</span>
        <span className="value">
          {size} {baseSymbolName}
        </span>
      </div>
      <div className="info-item">
        <div>
          {t`features_assets_futures_common_position_price_footer_position_price_index_5101499`}
          <Tooltip
            content={
              <span>
                {t`features_assets_futures_common_position_price_footer_position_price_index_5101500`}
                <br />
                {t`features_assets_futures_common_position_price_footer_position_price_index_5101501`}{' '}
                {t`features_assets_futures_common_position_price_footer_position_price_index_5101502`}
              </span>
            }
          >
            <span>
              <Icon className="ml-1" name="msg" />
            </span>
          </Tooltip>
        </div>
        <div className="value">
          <span className="mr-1">
            <IncreaseTag value={profitLossAmount || '--'} hasPrefix digits={offset} isRound={false} />
          </span>
          {currencySymbol}
        </div>
      </div>
    </div>
  )
}

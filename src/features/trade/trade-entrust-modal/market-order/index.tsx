import { memo } from 'react'
import { t } from '@lingui/macro'
import LazyImage from '@/components/lazy-image'
import { oss_svg_image_domain_address } from '@/constants/oss'
import styles from './index.module.css'

type Props = {
  imgName: string
}

function MarketOrder(props: Props) {
  const { imgName } = props

  return (
    <div className={styles.scope}>
      <div className="market-order-tip">
        {t`features_trade_trade_entrust_modal_market_order_index_2478`}，
        {t`features_trade_trade_entrust_modal_market_order_index_2479`}。
      </div>
      <div className="market-order-illustration">
        <div className="market-illustration-title">{t`features_trade_trade_entrust_modal_limit_order_index_2453`}</div>
        <div className="market-illustration-img">
          <div className="market-illustration-merit">
            <div>2400</div>
          </div>
          <div className="illustration-img-detail">
            <LazyImage src={`${oss_svg_image_domain_address}market_k_line_${imgName}.svg`} />
          </div>
        </div>
        <div className="market-illustration-explain">
          <div className="illustration-explain-text">
            A-{t`features_trade_trade_entrust_modal_limit_order_index_2454`}
          </div>
        </div>
      </div>
      <div className="market-order-content">
        {t`features_trade_trade_entrust_modal_limit_order_index_2454`} 2400，
        {t`features_trade_trade_entrust_modal_market_order_index_2480`}，
        {t`features_trade_trade_entrust_modal_market_order_index_2481`}，
        {t`features_trade_trade_entrust_modal_market_order_index_2482`}
        2400。{t`features_trade_trade_entrust_modal_market_order_index_2483`}，
        {t`features_trade_trade_entrust_modal_market_order_index_2484`}，
        {t`features_trade_trade_entrust_modal_market_order_index_2485`} 2400。
      </div>
      <div className="market-order-remarks">
        <div className="order-remarks">{t`assets.withdraw.remark`}：</div>
        <div>
          (1) {t`features_trade_trade_entrust_modal_market_order_index_2486`}，
          {t`features_trade_trade_entrust_modal_market_order_index_2487`}；
          {t`features_trade_trade_entrust_modal_market_order_index_2488`}，
          {t`features_trade_trade_entrust_modal_market_order_index_2489`}；
        </div>
        <div>
          (2) {t`features_trade_trade_entrust_modal_market_order_index_2490`}，
          {t`features_trade_trade_entrust_modal_market_order_index_2491`}【{t`Amount`}】{t`user.third_party_01`}【
          {t`features_market_real_time_quote_index_5101265`}】
          {t`features_trade_trade_entrust_modal_market_order_index_2492`}；
        </div>
      </div>
    </div>
  )
}

export default memo(MarketOrder)

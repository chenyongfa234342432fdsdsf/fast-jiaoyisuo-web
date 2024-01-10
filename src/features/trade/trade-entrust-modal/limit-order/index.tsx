import { memo, useState } from 'react'
import { t } from '@lingui/macro'
import { oss_svg_image_domain_address } from '@/constants/oss'
import LazyImage from '@/components/lazy-image'
import cn from 'classnames'
import Icon from '@/components/icon'
import { HandleMode, useTradeEntrust } from '../tradeentrust'
import styles from './index.module.css'

type Props = {
  imgName: string
}

function LimitOrder(props: Props) {
  const { imgName } = props

  const { limitOrderExplain } = useTradeEntrust()

  const [buyHandleMode, setBuyHandleMode] = useState<string>(HandleMode.BUY)

  const setJudgeBuy = () => {
    return buyHandleMode === HandleMode.BUY
  }

  const setJudgeSell = () => {
    return buyHandleMode === HandleMode.SELL
  }

  return (
    <div className={styles.scope}>
      <div className="limit-order-tip">
        {t`features_trade_trade_entrust_modal_limit_order_index_2451`}，
        {t`features_trade_trade_entrust_modal_limit_order_index_2452`}。
      </div>
      <div className="limit-order-illustration">
        <div className="limit-illustration-title">
          <span>{t`features_trade_trade_entrust_modal_limit_order_index_2453`}</span>
          <div className="limit-illustration-handle">
            <div
              className={cn('illustration-handle-buy', {
                'limit-illustration-handle-buy': setJudgeBuy(),
                'limit-illustration-handle-sell': setJudgeSell(),
              })}
              onClick={() => setBuyHandleMode(HandleMode.BUY)}
            >
              <Icon name={setJudgeBuy() ? 'login_satisfied' : 'login_unsatisfied_black'} />{' '}
              {t`order.constants.direction.buy`}
            </div>
            <div
              className={cn({
                'limit-illustration-handle-buy': setJudgeSell(),
                'limit-illustration-handle-sell': setJudgeBuy(),
              })}
              onClick={() => setBuyHandleMode(HandleMode.SELL)}
            >
              <Icon name={setJudgeSell() ? 'sell_confirm' : 'login_unsatisfied_black'} />{' '}
              {t`order.constants.direction.sell`}
            </div>
          </div>
        </div>
        <div className="limit-illustration-img">
          <div className="limit-illustration-merit">
            <div>3000</div>
            <div>1500</div>
          </div>
          <div className="illustration-img-detail">
            <LazyImage src={`${oss_svg_image_domain_address}check_k_line_${buyHandleMode}_${imgName}.svg`} />
          </div>
        </div>
        <div className="limit-illustration-explain">
          <div className="illustration-explain-not-text">
            A-{t`features_trade_trade_entrust_modal_limit_order_index_2454`}
          </div>
          <div className="illustration-explain-text">B/C-{t`order.columns.entrustPrice`}</div>
        </div>
      </div>
      <div className="limit-order-content">{limitOrderExplain[buyHandleMode].content}</div>
      <div className="limit-order-remarks">
        <div className="order-remarks">{t`features_trade_trade_entrust_modal_limit_order_index_2464`}：</div>
        <div>{limitOrderExplain[buyHandleMode].remark}</div>
        <div>{limitOrderExplain[buyHandleMode].reverse}</div>
      </div>
    </div>
  )
}

export default memo(LimitOrder)

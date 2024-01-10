import { t } from '@lingui/macro'
import { Button } from '@nbit/arco'
import { useCountDown, useMount, useUpdateEffect } from 'ahooks'
import classNames from 'classnames'
import { ReactNode, useState } from 'react'
import { formatDate } from '@/helper/date'
import { checkLogin, getIsLogin } from '@/helper/auth'
import LazyImage from '@/components/lazy-image'
import { querySpotCoinSubscribed, subscribeSpotCoin } from '@/apis/trade'
import { oss_domain_address, oss_svg_image_domain_address } from '@/constants/oss'
import { YapiGetV1TradePairDetailData as ISpotCoin } from '@/typings/yapi/TradePairDetailV1GetApi'
import { SpotStopStatusEnum } from '@/constants/market'
import styles from './index.module.css'

export type ISpotNotAvailableProps = {
  children?: ReactNode
  className?: string
  placeNode?: ReactNode
  tradeCoin: ISpotCoin
}

function useSubscription(coin: ISpotCoin) {
  function getIsSubscribed() {
    return coin.subscribed?.toString() === '1'
  }
  const [isSubscribed, setIsSubscribed] = useState(getIsSubscribed)
  useUpdateEffect(() => {
    setIsSubscribed(getIsSubscribed())
  }, [coin])

  const subscribe = async () => {
    if (!checkLogin()) {
      return
    }
    const res = await subscribeSpotCoin({
      tradeId: coin.id!,
    })
    if (!res.isOk) {
      return
    }
    setIsSubscribed(true)
  }
  return {
    isSubscribed,
    subscribe,
  }
}

/**
 * 现货不可用组件，可用会正常展示，不可用则展示上线日期
 */
export function SpotNotAvailable({ children, className, placeNode, tradeCoin }: ISpotNotAvailableProps) {
  const { isSubscribed, subscribe } = useSubscription(tradeCoin as ISpotCoin)

  const [, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: tradeCoin.openTime,
  })
  const available = tradeCoin.marketStatus !== SpotStopStatusEnum.appoint
  if (available) {
    return children! as JSX.Element
  }
  const countdowns = [days, hours, minutes, seconds]
  return (
    <div className={classNames(className, styles['not-available-wrapper'], 'text-sm')}>
      {placeNode || (
        <div>
          <div className="flex flex-col items-center mb-2">
            <div className="mb-4 bg-card_bg_color_01 px-2.5 py-4">
              <div className="flex justify-center mb-1">
                {countdowns.map((countdown, index) => {
                  return (
                    <div className="flex text-button_text_02 font-medium" key={index}>
                      {index > 0 && <span className="mx-1">:</span>}
                      <div className="countdown-tag">{countdown}</div>
                    </div>
                  )
                })}
              </div>
              <div className="text-center">{t`components_chart_not_available_2743`}</div>
            </div>

            <LazyImage
              className="mb-4 w-52"
              whetherPlaceholdImg={false}
              src={`${oss_svg_image_domain_address}login_plate.png`}
            />
            <span className="text-text_color_02 mb-4">{formatDate(tradeCoin.openTime!)}</span>
            <Button onClick={subscribe} type="primary" className="h-10" disabled={isSubscribed}>
              {!isSubscribed ? t`components_chart_not_available_2741` : t`components_chart_not_available_2742`}
            </Button>
          </div>
          <div className="text-xs text-text_color_02 text-center">* {t`components_chart_not_available_2744`}</div>
        </div>
      )}
    </div>
  )
}

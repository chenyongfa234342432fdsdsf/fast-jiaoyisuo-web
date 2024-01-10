import { useCountDown, useSafeState } from 'ahooks'
import { fillZero, getFutureFundingRateNextDate } from '@/helper/date'
import { memo, useEffect, useRef } from 'react'
import Styles from './index.module.css'

interface CountDownProps {
  settle: {
    settleTimes: string
    settleSpan: number
  }
  monenyRate: {
    rate: number
    time: number
  }
}

function CountDown(props: CountDownProps) {
  const { settle, monenyRate } = props
  const [, { hours, seconds, minutes }] = useCountDown({
    targetDate: getFutureFundingRateNextDate(settle?.settleTimes?.toString() || '', Number(settle?.settleSpan)),
  })

  return (
    <span className={Styles.scoped}>
      <span className="mark-price">
        <span className="text-brand_color">{`${Number(Number(monenyRate?.rate) * 100).toFixed(4)}%`}</span> /{' '}
        {fillZero(hours)}:{fillZero(minutes)}:{fillZero(seconds)}
      </span>
    </span>
  )
}

export default memo(CountDown)

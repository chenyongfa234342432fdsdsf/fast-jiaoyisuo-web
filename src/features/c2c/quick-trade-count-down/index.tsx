import { useCountDown } from 'ahooks'

import { memo } from 'react'
import classNames from 'classnames'
import { t } from '@lingui/macro'
import Styles from './index.module.css'

interface CountDownProps {
  restSecond: number
  setRestSecond: (v) => void
}

function QuickTradeCountDown(props: CountDownProps) {
  const { restSecond, setRestSecond } = props
  const [countdown] = useCountDown({
    leftTime: restSecond * 1000,
    onEnd: () => {
      setRestSecond(0)
    },
  })

  return (
    <span>
      {t`user.field.reuse_17`}({Math.round(countdown / 1000)})s
    </span>
  )
}

export default memo(QuickTradeCountDown)

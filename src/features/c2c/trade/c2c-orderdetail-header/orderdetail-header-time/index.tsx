import { useEffect, memo, useState } from 'react'
import { fillZero } from '@/helper/date'
import { useCountDown } from 'ahooks'
import styles from './index.module.css'

type Props = {
  targetDateTime: number
}

function C2COrderDetailHeader(props: Props) {
  const { targetDateTime } = props

  const [targetTime, setTargetTime] = useState<number>(targetDateTime)

  const [, { seconds, minutes }] = useCountDown({
    leftTime: targetTime,
    onEnd: () => {
      console.log('onEndonEndonEndonEndonEndonEnd')
    },
  })

  useEffect(() => {
    setTargetTime(targetDateTime)
  }, [targetDateTime])

  return (
    <div className={styles.container}>
      {fillZero(minutes)}:{fillZero(seconds)}s
    </div>
  )
}

export default memo(C2COrderDetailHeader)

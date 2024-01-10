import { ReactNode } from 'react'
import { Spin } from '@nbit/arco'
import styles from './index.module.css'

interface SpinProps {
  isShow: boolean
  delay?: number
  tip?: string
  loading?: boolean
  icon?: ReactNode
  customBackground?: string
}

function FullScreenSpin({ isShow, customBackground, ...props }: SpinProps) {
  return (
    <div className={`spin ${isShow ? 'flex' : 'hidden'} ${customBackground || 'bg-bg_color'} ${styles.scoped}`}>
      <Spin dot {...props} />
    </div>
  )
}

export default FullScreenSpin

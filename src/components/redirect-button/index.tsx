import { IconRight } from '@nbit/arco/icon'
import { ReactNode } from 'react'
import styles from './index.module.css'

interface RedirectButtonProps {
  children: ReactNode
}

function RedirectButton(props: RedirectButtonProps) {
  const { children } = props
  return (
    <span className={styles.scoped}>
      {children}
      <IconRight />
    </span>
  )
}

export default RedirectButton

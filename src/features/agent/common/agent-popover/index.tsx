import { Popover } from '@nbit/arco'
import { ReactNode } from 'react'
import styles from './index.module.css'

type TAgentPopover = {
  children: ReactNode
  content: string
  className?: string
  onClick?: React.MouseEventHandler<HTMLSpanElement>
}

function AgentPopover({ children, content, className, onClick }: TAgentPopover) {
  return (
    <Popover className={styles.scoped} content={content}>
      <span onClick={onClick} className={className}>
        {children}
      </span>
    </Popover>
  )
}

export default AgentPopover

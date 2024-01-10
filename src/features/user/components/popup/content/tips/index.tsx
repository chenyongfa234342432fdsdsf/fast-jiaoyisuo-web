import Icon from '@/components/icon'
import classNames from 'classnames'
import { ReactNode } from 'react'

type UserPopupTipsContentProps = {
  className?: string
  slotContent: ReactNode
  headerIcon?: ReactNode | string
}

function UserPopupTipsContent({ headerIcon, slotContent, className }: UserPopupTipsContentProps) {
  return (
    <div className={classNames('user-popup-tips', className)}>
      <div className="popup-icon">{headerIcon || <Icon name="tips_icon" />}</div>
      <div className="slot-content">{slotContent}</div>
    </div>
  )
}

export default UserPopupTipsContent

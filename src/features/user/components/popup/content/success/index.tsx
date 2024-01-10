import { ReactNode } from 'react'
import Icon from '@/components/icon'

interface UserPopUpSuccessContentProps {
  /** 插槽内容 */
  slotContent: ReactNode
  /** 自定义图标 */
  icon?: ReactNode
}

function UserPopUpSuccessContent({ slotContent, icon }: UserPopUpSuccessContentProps) {
  return (
    <div className="user-popup-success">
      <div className="popup-icon">{icon || <Icon name="success_icon" isRemoteUrl />}</div>
      <div className="slot-content">{slotContent}</div>
    </div>
  )
}

export default UserPopUpSuccessContent

import { ReactNode } from 'react'

interface UserPopUpBlankContentProps {
  /** 插槽内容 */
  children: ReactNode
}

function UserPopUpBlankContent({ children }: UserPopUpBlankContentProps) {
  return <div className="user-popup-blank">{children}</div>
}

export default UserPopUpBlankContent

import { ReactNode } from 'react'
import { getUserInfo } from '@/helper/cache'
import Icon from '@/components/icon'
import styles from './index.module.css'

interface UserSettingsHeaderInfoProps {
  /** 详细的设置信息 */
  footerContent: ReactNode
  /** 按钮类操作 */
  operateContent: ReactNode
}

function UserSettingsHeaderInfo({ footerContent, operateContent }: UserSettingsHeaderInfoProps) {
  const userInfo = getUserInfo()
  return (
    <div className={`user-settings-header-info ${styles.scoped}`}>
      <div className="user-settings-header-info-wrap">
        <div className="info">
          <div className="info-wrap">
            <div className="icon">
              <Icon name="user_head_hover" />
            </div>
            <div className="content">
              <div className="header">
                <div className="name">
                  <label>Hi, {userInfo.fnickname}</label>
                </div>
                <div className="uid">
                  <label>UID: {userInfo.fid}</label>
                </div>
              </div>
              <div className="footer">{footerContent}</div>
            </div>
          </div>
        </div>

        <div className="operate">{operateContent}</div>
      </div>
    </div>
  )
}

export default UserSettingsHeaderInfo

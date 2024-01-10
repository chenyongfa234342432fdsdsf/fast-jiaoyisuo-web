import { ReactNode, useEffect, useMemo } from 'react'
import { Trigger, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import { useCopyToClipboard } from 'react-use'
import { getMemberUserLoginOut } from '@/apis/user'
import { removeUserInfo, getUserInfo, removeC2CParamsTipsCache } from '@/helper/cache'
import { removeToken } from '@/helper/auth'
import cn from 'classnames'
import { UserKycTypeEnum } from '@/constants/user'
import { useUserStore } from '@/store/user'
import { usePageContext } from '@/hooks/use-page-context'
import { getMergeModeStatus } from '@/features/user/utils/common'
import Icon from '@/components/icon'

import styles from './index.module.css'

interface MenuCellListType {
  key: number
  /** 图标 */
  icon: ReactNode
  /** 文字 */
  text: string
  /** 是否跳转 */
  isLink: boolean
  /** 路由地址 */
  link?: string
  /** 弹窗类型 */
  type?: string
}

enum aboutEnum {
  about = 'about',
}

function MenuCell({ onLink, isMergeMode }) {
  const withdrawalAddress = {
    key: 3,
    icon: <Icon name="user_down_address" fontSize={24} />,
    text: t`user.personal_center_08`,
    isLink: true,
    link: '/assets/main/withdraw/address',
  }

  const accountSecurity = {
    key: 4,
    icon: <Icon name="user_down_security" fontSize={24} />,
    text: t`user.personal_center_09`,
    isLink: true,
    link: '/personal-center/account-security',
  }

  const settings = {
    key: 5,
    icon: <Icon name="user_down_set_up" fontSize={24} />,
    text: t`user.field.reuse_08`,
    isLink: true,
    link: '/personal-center/settings',
  }

  const aboutUs = {
    key: 6,
    icon: <Icon name="user_down_about" fontSize={24} />,
    text: t`features_user_personal_center_menu_navigation_index_2612`,
    isLink: false,
    type: 'about',
  }

  let menuList = isMergeMode ? [] : [withdrawalAddress, accountSecurity, settings, aboutUs]

  return (
    <>
      {menuList.map(v => (
        <div className="cell" key={v.key} onClick={() => onLink(v)}>
          <div className="cell-wrap">
            <div className="icon">{v.icon}</div>
            <div className="text">
              <label>{v.text}</label>
            </div>
            <div className="subfix-icon">
              <Icon name="next_arrow_two" fontSize={14} />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

function MenuHeader({ onClick }) {
  const store = useUserStore()
  const userInfo = store.userInfo || getUserInfo()
  const [state, copyToClipboard] = useCopyToClipboard()

  const handleCopy = (key: string) => {
    copyToClipboard(key)
    state.error ? Message.error(t`user.secret_key_02`) : Message.success(t`user.secret_key_01`)
  }

  const gotoKyc = () => {
    link('/kyc-authentication-homepage')
  }

  return (
    <div className="header">
      <div className="name" onClick={onClick}>
        <label>{userInfo?.nickName || t`user.personal_center_01`}</label>
        <Icon name="next_arrow" hasTheme fontSize={10} />
      </div>

      <div className="uid">
        <label>UID: {userInfo?.uid}</label>
        <Icon name="copy" hasTheme fontSize={16} onClick={() => handleCopy(userInfo?.uid)} />
      </div>

      <div className={cn(`tag ${userInfo?.kycType === UserKycTypeEnum.notCertified ? 'off' : 'on'}`, 'cursor-pointer')}>
        <Icon
          name={
            userInfo?.kycType === UserKycTypeEnum.notCertified
              ? 'user_safety_label_unopened'
              : 'user_safety_label_activated'
          }
          isRemoteUrl
          width={14}
          height={14}
        />
        <label className="cursor-pointer" onClick={gotoKyc}>
          {userInfo?.kycType === UserKycTypeEnum.notCertified && t`user.personal_center_03`}
          {userInfo?.kycType === UserKycTypeEnum.standardCertification &&
            t`features_user_personal_center_menu_navigation_index_5101265`}
          {userInfo?.kycType === UserKycTypeEnum.advancedCertification &&
            t`features_user_personal_center_menu_navigation_index_5101266`}
          {userInfo?.kycType === UserKycTypeEnum.enterpriseCertification &&
            t`features/user/personal-center/profile/index-17`}
        </label>
      </div>
    </div>
  )
}

function MenuLoginOut() {
  const handleLoginOut = async () => {
    const res = await getMemberUserLoginOut({})
    res.isOk && Message.success(t`features_user_personal_center_menu_navigation_index_2443`)
    removeUserInfo()
    await removeToken()
    removeC2CParamsTipsCache()
    link('/')
  }

  return (
    <div className="login-out">
      <div className="cell" onClick={() => handleLoginOut()}>
        <div className="cell-wrap">
          <div className="icon">
            <Icon name="user_down_log_out" fontSize={24} />
          </div>

          <div className="text">
            <label>{t`user.personal_center_13`}</label>
          </div>

          <div className="subfix-icon">
            <Icon name="next_arrow_two" fontSize={14} />
          </div>
        </div>
      </div>
    </div>
  )
}

function UserPersonalCenterMenuNavigation({ isAboutShow, handleAboutPopUpShow }) {
  const { path } = usePageContext()
  const isMergeMode = getMergeModeStatus()
  const { updateUserInfoData } = useUserStore()

  useEffect(() => {
    if (isAboutShow) handleAboutPopUpShow(false)
  }, [path])

  const handleLink = (v: MenuCellListType) => {
    if (v.isLink) link(v.link)

    v.type === aboutEnum.about && handleAboutPopUpShow(true)
  }

  const menuCell = useMemo(() => {
    return <MenuCell onLink={handleLink} isMergeMode={isMergeMode} />
  }, [])

  const onPersonalCenterChange = e => {
    if (e) {
      updateUserInfoData()
    }
  }

  return (
    <Trigger
      popupAlign={{
        bottom: [-110, 16],
      }}
      onVisibleChange={onPersonalCenterChange}
      popup={() => (
        <div className={`user-personal-center-menu ${styles.scoped}`}>
          <div className="user-personal-center-menu-wrap">
            <MenuHeader onClick={() => link('/personal-center/settings')} />

            {menuCell}
          </div>

          {!isMergeMode && <MenuLoginOut />}
        </div>
      )}
    >
      <div className="user-menu-icon">
        <Icon name="user_head" fontSize={22} hasTheme hover />
      </div>
    </Trigger>
  )
}

export default UserPersonalCenterMenuNavigation

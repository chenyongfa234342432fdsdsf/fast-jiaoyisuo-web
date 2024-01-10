import Icon from '@/components/icon'
import { t } from '@lingui/macro'
import { useState } from 'react'
import { IconType } from '@/typings/api/inmail'
import { Checkbox, Popover, Tooltip, Modal } from '@nbit/arco'
import styles from './index.module.css'

type InmailHeaderType = {
  onSettingChange?: () => void
  onAllReadChange?: () => void
  onAllCleanChange?: () => void
  onHideReadChange?: (v: boolean) => void
}

type DelModalType = {
  visible: boolean
  onChange?: () => void
  onCancel?: () => void
}

function DelModal({ visible, onChange, onCancel }: DelModalType) {
  const onChangeMessage = () => {
    onChange && onChange()
  }

  const onChangeCancel = () => {
    onCancel && onCancel()
  }
  return (
    <Modal
      simple
      autoFocus={false}
      visible={visible}
      className={styles['inmail-modal']}
      footer={
        <div className="w-full flex items-center justify-between">
          <div className="inmail-modal-footer-left" onClick={onChangeCancel}>{t`trade.c2c.cancel`}</div>
          <div className="inmail-modal-footer-right" onClick={onChangeMessage}>{t`user.field.reuse_17`}</div>
        </div>
      }
    >
      <div className="inmail-modal-content">
        <Icon name={'close'} hasTheme className="inmail-modal-close-icon" onClick={onChangeCancel} />
        <Icon name={'tips_icon'} className="inmail-modal-icon" />
        <div className="inmail-modal-text">{t`features_inmail_component_inmail_header_index_5101213`}</div>
      </div>
    </Modal>
  )
}

function InmailHeader(props: InmailHeaderType) {
  const { onSettingChange, onAllReadChange, onAllCleanChange, onHideReadChange } = props
  const [settingIcon, setSettingIcon] = useState<string>(IconType.setting)
  const [readIcon, setReadIcon] = useState<string>(IconType.read)
  const [moreIcon, setMoreIcon] = useState<string>(IconType.more)
  const [visible, setVisible] = useState<boolean>(false)
  const [settingVisible, setSettingVisible] = useState<boolean>(true)

  const onChange = () => {
    setVisible(false)
    onAllCleanChange && onAllCleanChange()
  }

  const onCancel = () => {
    setVisible(false)
  }

  const handleHideRead = v => {
    onHideReadChange && onHideReadChange(v)
  }

  const handleSetting = () => {
    onSettingChange && onSettingChange()
  }

  const handleAllRead = () => {
    onAllReadChange && onAllReadChange()
  }

  const handleAllClear = () => {
    setVisible(true)
  }

  const onSettingEnter = () => {
    setSettingIcon(IconType.sethover)
  }

  const onSettingLeave = () => {
    setSettingIcon(IconType.setting)
  }

  const onAllReadEnter = () => {
    setReadIcon(IconType.readhover)
  }

  const onAllReadLeave = () => {
    setReadIcon(IconType.read)
  }

  const onMoreEnter = () => {
    setMoreIcon(IconType.morehover)
  }

  const onMoreLeave = () => {
    setMoreIcon(IconType.more)
  }

  const onChangeSetting = () => {
    setSettingVisible(false)
  }

  return (
    <div className={styles.scoped}>
      <div className="inmail-header-wrap">
        <div className="title">
          <label>{t`features/inmail/index-5`}</label>
        </div>
        <div className="settings">
          <div className="hide-read">
            <Checkbox onChange={handleHideRead}>
              {({ checked }) => {
                return (
                  <>
                    {checked ? <Icon name="login_verify_selected" /> : <Icon name="login_verify_unselected" hasTheme />}

                    <span className="checkbox-label">{t`features/inmail/index-6`}</span>
                  </>
                )
              }}
            </Checkbox>
          </div>

          <Tooltip
            content={
              <div className="setting-tooltip">
                <div className="setting-tooltip-text">{t`features_inmail_component_inmail_header_index_5101214`}</div>
                <Icon name="close_black" onClick={onChangeSetting} />
              </div>
            }
            blurToHide={false}
            popupVisible={settingVisible}
            className={styles['setting-tooltip-wrap']}
          >
            <div
              className="setting"
              onClick={handleSetting}
              onMouseEnter={onSettingEnter}
              onMouseLeave={onSettingLeave}
            >
              <Icon name={settingIcon} className="setting-icon" hasTheme={settingIcon === IconType.setting} />
            </div>
          </Tooltip>

          <Tooltip content={t`features_inmail_component_inmail_header_index_5101215`}>
            <div
              className="all-read"
              onClick={handleAllRead}
              onMouseEnter={onAllReadEnter}
              onMouseLeave={onAllReadLeave}
            >
              <Icon name={readIcon} hasTheme={readIcon === IconType.read} />
            </div>
          </Tooltip>

          <Tooltip content={t`features_inmail_component_inmail_header_index_5101216`}>
            <div className="more" onMouseEnter={onMoreEnter} onMouseLeave={onMoreLeave}>
              <Popover
                trigger="click"
                position="bottom"
                className="inmail-popover"
                content={
                  <span className="popover-item" onClick={handleAllClear}>
                    {t`features_inmail_component_inmail_header_index_5101312`}
                  </span>
                }
              >
                <Icon name={moreIcon} hasTheme={moreIcon === IconType.more} />
              </Popover>
            </div>
          </Tooltip>
        </div>
      </div>
      <DelModal visible={visible} onChange={onChange} onCancel={onCancel} />
    </div>
  )
}
export default InmailHeader

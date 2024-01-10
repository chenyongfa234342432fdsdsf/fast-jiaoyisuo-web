import Icon from '@/components/icon'
import { useInmailStore } from '@/store/inmail/setting'
import { t } from '@lingui/macro'
import { Button, Checkbox, Drawer } from '@nbit/arco'
import classNames from 'classnames'
import { useState, useEffect } from 'react'
import { SettingInmailModules } from '@/typings/api/user'
import { InmailTypeEnum } from '@/constants/inmail'
import Styles from './index.module.css'

type InmailSettingType = {
  visible: boolean
  className?: string
  onChange?: (v) => void
  onCancel?: () => void
  inmailData?: Array<SettingInmailModules>
  inmailSettingData: Array<SettingInmailModules>
}

function InmailSetting(props: InmailSettingType) {
  const { className, inmailData, onCancel, visible, onChange, inmailSettingData } = props
  const newInmailSettingData = inmailSettingData.filter(item => item?.codeName === InmailTypeEnum.system)

  const [selectAll, setSelectAll] = useState(false)
  const { setting, setSetting, restSetting } = useInmailStore()
  const handleInmailSaveSettings = () => {
    let selectMenuData: Array<any> = []
    for (let key in setting) {
      if (setting[key]) {
        const data = newInmailSettingData?.find(v => v.codeName === key)
        data && selectMenuData.push(data.id)
      }
    }
    onChange && onChange(selectMenuData)
  }
  const handleAllSelect = v => {
    newInmailSettingData?.forEach(item => {
      setSetting(item.codeName, v)
    })
    setSelectAll(v)
  }

  const onModalCancel = () => {
    onCancel && onCancel()
  }

  useEffect(() => {
    let num = 0
    for (let key in setting) {
      if (setting[key]) {
        num += 1
      }
    }
    setSelectAll(num === newInmailSettingData?.length)
  }, [setting])

  useEffect(() => {
    if (inmailData?.length && visible && newInmailSettingData?.length) {
      setSelectAll(newInmailSettingData.length <= inmailData.length)
      inmailData.forEach(v => {
        const data = newInmailSettingData.find(item => item.id === v.id)
        data && setSetting(data.codeName, true)
      })
    }
    !visible && restSetting()
  }, [inmailData, visible])

  return (
    <div className={classNames(Styles.scoped, className)}>
      <Drawer
        width={400}
        title={
          <div className="flex items-center justify-between">
            <span className="text-xl font-medium text-text_color_01">{t`features_user_personal_center_settings_inmail_setting_index_5101255`}</span>
            <Icon name="close" hasTheme onClick={onModalCancel} className="inmail-setting-drawer-icon" />
          </div>
        }
        closable={false}
        visible={visible}
        footer={null}
        unmountOnExit
        onCancel={onModalCancel}
        className={Styles['inmail-setting-main-wrap']}
      >
        <div className="tips">
          <Icon name="msg" className="tipes-icon" />
          <span className="text-xs">{t`features_user_personal_center_settings_inmail_setting_index_5101256`}</span>
        </div>
        <div className="list-wrap inmail-list-wrap">
          {newInmailSettingData?.map(v => {
            return (
              <div className="list" key={v.id}>
                <div className="label">{v.name}</div>
                <div className="value">
                  <Checkbox
                    checked={setting[v?.codeName as string]}
                    onChange={val => {
                      setSetting(v?.codeName as string, val)
                    }}
                  >
                    {({ checked }) => {
                      return checked ? (
                        <Icon name="login_verify_selected" />
                      ) : (
                        <Icon name="login_verify_unselected" hasTheme />
                      )
                    }}
                  </Checkbox>
                </div>
              </div>
            )
          })}
          <div className="list">
            <div className="label">{t`features_user_personal_center_settings_inmail_setting_index_5101257`}</div>
            <div className="value">
              <Checkbox checked={selectAll} onChange={handleAllSelect}>
                {({ checked }) => {
                  return checked ? (
                    <Icon name="login_verify_selected" />
                  ) : (
                    <Icon name="login_verify_unselected" hasTheme />
                  )
                }}
              </Checkbox>
            </div>
          </div>
        </div>

        <div className="inmail-setting-btn">
          <Button type="default" onClick={onModalCancel} className="w-full h-10">
            <span className="text-text_color_02">{t`trade.c2c.cancel`}</span>
          </Button>
          <Button type="primary" onClick={handleInmailSaveSettings} className="w-full h-10">
            {t`components_chart_header_data_2622`}
          </Button>
        </div>
      </Drawer>
    </div>
  )
}

export default InmailSetting

import { ReactNode, useState, useEffect, useRef } from 'react'
import { Button, Switch } from '@nbit/arco'
import { t } from '@lingui/macro'
// import { link } from '@/helper/link'
import UserPopUp from '@/features/user/components/popup'
import UserPersonalCenterModifyUserName from '@/features/user/personal-center/modify-username'
import UserPersonalCenterConvertedCurrency from '@/features/user/personal-center/settings/converted-currency'
import UserPersonalCenterUpsAndDowns from '@/features/user/personal-center/settings/ups-and-downs'
import UserPersonalCenterPushLanguage from '@/features/user/personal-center/settings/language'
import { setNoticeType, getInmailSettings, setMarketingEmail } from '@/apis/user'
import { SettingInmailModules, SettingInmailType } from '@/typings/api/user'
import { UserEnabledStateTypeEnum } from '@/constants/user'
import { useUserStore } from '@/store/user'
import InmailSetting from '@/features/user/personal-center/settings/inmail-setting'
import FullScreenLoading from '@/features/user/components/full-screen-loading'
import Icon from '@/components/icon'
import { useRequest } from 'ahooks'
import { I18nsEnum } from '@/constants/i18n'
import { getInmailMenu } from '@/apis/inmail'
import styles from './index.module.css'

interface SettingsCellProps {
  /** 标题 */
  text: string
  /** 左图标 */
  icon: ReactNode
  /** 提示文字 */
  placeholderText: string
  /** 提示图标 */
  placeholderIcon?: ReactNode
  /** 昵称、文字内容 */
  contentText?: string
  /** 头像 */
  contentIcon?: ReactNode
  /** 内容插槽 */
  contentSlot?: ReactNode
  /** 按钮颜色* */
  buttonClassName?: string
  /** 是否显示按钮 */
  isShow?: boolean
  /** 是否显示 switch 按钮 */
  isSwitch?: boolean
  /** 按钮文字 */
  buttonText?: string | ReactNode
  /** 操作插槽 */
  operateSlot?: ReactNode
  /** switch 值 */
  switchValue?: boolean
  /** 点击回调函数 */
  onClick?(): void
  /** 值变化回调函数 */
  onChange?(status: boolean): void
}

enum OrderStatusType {
  enable = 1, // 开启
  noEnable = 2, // 关闭
}

function SettingsCell({
  text,
  icon,
  placeholderText,
  placeholderIcon,
  contentText,
  contentIcon,
  contentSlot,
  buttonClassName,
  isShow,
  isSwitch,
  buttonText,
  operateSlot,
  switchValue,
  onClick,
  onChange,
}: SettingsCellProps) {
  return (
    <div className="cell">
      <div className="cell-wrap">
        <div className="cell-icon">{icon}</div>
        <div className="cell-title">
          <div className="text">
            <label>{text}</label>
          </div>
          <div className="placeholder">
            {placeholderIcon}
            <label>{placeholderText}</label>
          </div>
        </div>
        <div className="cell-content">
          {contentIcon || null}
          <label>{contentText}</label>
          {contentSlot}
        </div>
        <div className="cell-btn">
          {isShow && (
            <Button type="primary" onClick={onClick} className={buttonClassName}>
              {buttonText || t`user.field.reuse_08`}
            </Button>
          )}
          {isSwitch && <Switch checked={switchValue} onChange={onChange} />}
          {operateSlot}
        </div>
      </div>
    </div>
  )
}

function UserPersonalCenterSettings() {
  const [visibleModifyName, setVisibleModifyName] = useState<boolean>(false)
  const [visibleConvertedCurrency, setVisibleConvertedCurrency] = useState<boolean>(false)
  const [visibleUpsAndDowns, setVisibleUpsAndDowns] = useState<boolean>(false)
  const [visibleLanguage, setVisibleLanguage] = useState<boolean>(false)
  const [visibleInmail, setVisibleInmail] = useState<boolean>(false)
  // const [perpetualOrderStatus, setPerpetualOrderStatus] = useState<boolean>(false)
  const [detailInmail, setDetailInmail] = useState<SettingInmailType>()
  const [inmailData, setInmailData] = useState<Array<SettingInmailModules>>([])

  const upsAndDownsRef = useRef<Record<'resetTrendColors', () => void>>()

  const { userInfo, updatePreferenceAndUserInfoData, personalCenterSettings, setPersonalCenterSettings } =
    useUserStore()
  const colors = personalCenterSettings.colors

  /** 获取已设置内容* */
  const getInmailData = async () => {
    const { data: inmailAllData } = await getInmailMenu({})
    const res = await getInmailSettings({})
    if (!res.isOk && !res.data) return
    setDetailInmail(res.data)
    setInmailData(inmailAllData)
    setPersonalCenterSettings({ pushLanguage: res.data?.pushLanguage })
  }

  const setVisibleHandle = () => {
    upsAndDownsRef.current?.resetTrendColors()
    setVisibleUpsAndDowns(false)
  }

  // const getPerpetualUserProfile = async () => {
  //   const res = await getMonkeyMemberPerpetualUserProfile({})
  //   if (res.isOk) {
  //     setPerpetualOrderStatus(res.data.enablePerpetualOrderConfirm)
  //   }
  // }

  const getInfo = async () => {
    await Promise.all([updatePreferenceAndUserInfoData(), getInmailData()])
  }

  const { run, loading } = useRequest(getInfo, { manual: true })

  useEffect(() => {
    run()
  }, [])

  // const handleContractOrder = async status => {
  //   const value = status ? ContractOrderStatusType.enable : ContractOrderStatusType.noEnable
  //   const res = await putMonkeyMemberPerpetualUserProfile({ value })
  //   if (res.isOk) {
  //     value === ContractOrderStatusType.enable
  //       ? Message.success(t`features/user/personal-center/settings/index-0`)
  //       : Message.success(t`features/user/personal-center/settings/index-1`)
  //     getPerpetualUserProfile()
  //   }
  // }

  const handleMarketinSoftwareStatus = async () => {
    const status =
      detailInmail?.isOpenMarketingEmail === OrderStatusType.enable ? OrderStatusType.noEnable : OrderStatusType.enable
    const options = {
      isOpenMarketingEmail: status,
    }
    const res = await setMarketingEmail(options)
    if (!res.isOk && !res.data) return
    getInmailData()
  }

  // 保存站内信
  const onInmailChange = async v => {
    const options = { moduleIds: v }
    const res = await setNoticeType(options)
    if (!res.isOk && !res.data) return
    getInmailData()
    setVisibleInmail(false)
  }

  const onCancelInmail = () => {
    setVisibleInmail(false)
  }

  const onChangeOpenInmail = () => {
    setVisibleInmail(true)
  }

  return (
    <div className={`user-personal-center-settings ${styles.scoped}`}>
      <div className="user-personal-center-settings-wrap">
        <div className="title">
          <h1 className="wrap">{t`user.field.reuse_08`}</h1>
        </div>

        <div className="personal-information">
          <div className="personal-information-wrap wrap">
            <div className="subtitle">
              <label>{t`user.personal_center_14`}</label>
            </div>

            <SettingsCell
              text={t`user.account_security.modify_username_04`}
              isShow={userInfo?.setNicknameInd === UserEnabledStateTypeEnum.unEnable}
              icon={<Icon name="user_icon_nickname" />}
              placeholderText={t`user.account_security.modify_username_01`}
              placeholderIcon={<Icon name="msg" />}
              contentText={userInfo?.nickName}
              buttonText={t`user.field.reuse_43`}
              onClick={() => setVisibleModifyName(true)}
            />

            {/* <SettingsCell
              text={t`user.account_security.modify_username_05`}
              icon={<Icon name="user_icon_avatar" />}
              placeholderText={t`user.account_security.modify_username_06`}
              contentIcon={<Icon name="user_head_hover" />}
            />

            <SettingsCell
              text={t`features/user/personal-center/settings/index-2`}
              isShow
              icon={<Icon name="nav_order_c2c" />}
              placeholderText={t`features/user/personal-center/settings/index-3`}
              onClick={() => link('/personal-center/settings/payment')}
            /> */}

            {/* <SettingsCell
              text={t`features/user/personal-center/settings/index-6`}
              isShow
              icon={<Icon name="user_down_set_up" />}
              placeholderText={t`features/user/personal-center/settings/api/index-11`}
              onClick={() => link('/personal-center/settings/api')}
            /> */}

            <SettingsCell
              text={t`user.account_security.settings_02`}
              isShow
              icon={<Icon name="currency_selected" />}
              // contentText={info?.currencySymbol || UserCurrencySymbolEnum.cny}
              placeholderText={t`features_user_personal_center_settings_index_2617`}
              onClick={() => setVisibleConvertedCurrency(true)}
            />

            {/* <SettingsCell
              text={t`features/user/personal-center/settings/index-4`}
              isSwitch
              switchValue={perpetualOrderStatus}
              icon={<Icon name="contract_order_confirmation" />}
              placeholderText={t`features/user/personal-center/settings/index-5`}
              onChange={handleContractOrder}
            /> */}
          </div>
        </div>

        <div className="personal-information">
          <div className="personal-information-wrap wrap">
            <div className="subtitle">
              <label>{t`features_user_personal_center_settings_index_5101259`}</label>
            </div>

            <SettingsCell
              text={t`features/user/personal-center/settings/index-7`}
              isShow
              contentText={detailInmail?.pushLanguage ? I18nsEnum[detailInmail?.pushLanguage] : ''}
              icon={<Icon name="language_setting" hasTheme />}
              placeholderText={t`features_user_personal_center_settings_index_2619`}
              onClick={() => setVisibleLanguage(true)}
            />

            <SettingsCell
              isShow
              text={t`features_user_personal_center_settings_inmail_setting_index_5101255`}
              contentSlot={
                <div className="cell-content-slot">
                  <Icon name="login_satisfied" />
                  <p>{detailInmail?.modules?.map(item => item.name)?.join(',')}</p>
                </div>
              }
              icon={<Icon name="station_letter" hasTheme />}
              placeholderText={t`features_user_personal_center_settings_inmail_setting_index_5101256`}
              onClick={onChangeOpenInmail}
            />
          </div>
        </div>
      </div>

      <UserPopUp
        className="user-popup"
        title={<div style={{ textAlign: 'left' }}>{t`user.account_security.modify_username_03`}</div>}
        visible={visibleModifyName}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisibleModifyName(false)}
        footer={null}
      >
        <UserPersonalCenterModifyUserName
          isShow={visibleModifyName}
          setVisible={setVisibleModifyName}
          onSuccess={updatePreferenceAndUserInfoData}
        />
      </UserPopUp>

      <UserPopUp
        className="user-popup"
        title={
          <div style={{ textAlign: 'left' }}>
            {t`user.account_security.settings_02`}
            {t`user.field.reuse_08`}
          </div>
        }
        visible={visibleConvertedCurrency}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisibleConvertedCurrency(false)}
        footer={null}
      >
        <UserPersonalCenterConvertedCurrency setVisible={setVisibleConvertedCurrency} />
      </UserPopUp>

      <UserPopUp
        className="user-popup"
        title={
          <div style={{ textAlign: 'left' }}>
            {t`user.account_security.settings_03`}
            {t`user.field.reuse_08`}
          </div>
        }
        visible={visibleUpsAndDowns}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisibleHandle()}
        footer={null}
      >
        <UserPersonalCenterUpsAndDowns ref={upsAndDownsRef} setVisible={setVisibleUpsAndDowns} />
      </UserPopUp>

      <UserPopUp
        className="user-popup"
        title={
          <div style={{ textAlign: 'left' }}>
            {t`features/user/personal-center/settings/index-7`}
            {t`user.field.reuse_08`}
          </div>
        }
        visible={visibleLanguage}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisibleLanguage(false)}
        footer={null}
      >
        <UserPersonalCenterPushLanguage setVisible={setVisibleLanguage} onSuccess={getInmailData} />
      </UserPopUp>

      <InmailSetting
        visible={visibleInmail}
        onCancel={onCancelInmail}
        onChange={onInmailChange}
        inmailData={detailInmail?.modules}
        inmailSettingData={inmailData}
      />

      <FullScreenLoading isShow={loading} />
    </div>
  )
}

export default UserPersonalCenterSettings

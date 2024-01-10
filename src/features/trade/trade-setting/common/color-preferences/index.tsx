import { useRequest } from 'ahooks'
import { Radio, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import { UserUpsAndDownsColorEnum } from '@/constants/user'
import { useUserStore } from '@/store/user'
import { postMemberBaseColorType } from '@/apis/user'
import { getIsLogin } from '@/helper/auth'
import Icon from '@/components/icon'
import Styles from '../../index.module.css'

const RadioGroup = Radio.Group

function TradeColorPreferences() {
  const useStore = useUserStore()
  const { setMemberBaseColor, updateUserSettingsInfo } = useStore
  const info = useStore.personalCenterSettings
  const isLogin = getIsLogin()

  const colorsList = [
    {
      value: UserUpsAndDownsColorEnum.greenUpRedDown,
      text: t`features_user_personal_center_settings_ups_and_downs_index_2701`,
    },
    {
      value: UserUpsAndDownsColorEnum.redUpGreenDown,
      text: t`user.account_security.settings_04`,
    },
  ]

  const postBaseColorType = async (color: number) => {
    if (isLogin) {
      const res = await postMemberBaseColorType({ marketSetting: color })
      if (res.isOk && res.data?.isSuccess) {
        setMemberBaseColor(color)
        updateUserSettingsInfo()

        Message.success(t`features/user/personal-center/settings/converted-currency/index-0`)
      }

      return
    }

    setMemberBaseColor(color)
    Message.success(t`features/user/personal-center/settings/converted-currency/index-0`)
  }

  const { run } = useRequest(postBaseColorType, {
    manual: true,
  })

  return (
    <>
      <div className="title line line-width-full">{t`features_trade_trade_setting_index_5101274`}</div>
      <div className="list list-margin-spacing">
        <div className="label">
          <div className={Styles['trade-setting-radio-style']}>
            <RadioGroup direction="vertical" value={info?.colors} onChange={run}>
              {colorsList.map((v, index) => (
                <Radio value={v.value} key={index}>
                  {({ checked }) => {
                    return (
                      <div className="radio">
                        <Icon name={checked ? 'agreement_select' : 'agreement_unselect'} />
                        <label>{v.text}</label>
                      </div>
                    )
                  }}
                </Radio>
              ))}
            </RadioGroup>
          </div>
        </div>
        <div className="value">
          <div className={Styles['trade-setting-radio-style']}>
            <div className="icon normal-icon">
              <Icon name="user_green_up_red_down" />
            </div>
            <div className="icon normal-icon">
              <Icon name="user_red_up_green_down" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TradeColorPreferences

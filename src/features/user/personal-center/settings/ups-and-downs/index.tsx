import { Dispatch, SetStateAction, forwardRef, useImperativeHandle } from 'react'
import { Button, Form, Select, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import { useMount, useRequest } from 'ahooks'
import { PersonalCenterSettingsRules } from '@/features/user/utils/validate'
import { useUserStore } from '@/store/user'
import { UserUpsAndDownsColorEnum } from '@/constants/user'
import { postMemberBaseColorType } from '@/apis/user'
import Icon from '@/components/icon'
import styles from './index.module.css'

const FormItem = Form.Item
const Option = Select.Option

function UserPersonalCenterUpsAndDowns({ setVisible }: { setVisible: Dispatch<SetStateAction<boolean>> }, ref) {
  const colorList = [
    {
      key: 1,
      value: UserUpsAndDownsColorEnum.greenUpRedDown,
      icon: <Icon name="user_green_up_red_down" />,
      text: t`features_user_personal_center_settings_ups_and_downs_index_2701`,
    },
    {
      key: 2,
      value: UserUpsAndDownsColorEnum.redUpGreenDown,
      icon: <Icon name="user_red_up_green_down" />,
      text: t`user.account_security.settings_04`,
    },
  ]

  const [form] = Form.useForm()
  const { setMemberBaseColor, personalCenterSettings, updatePreferenceAndUserInfoData } = useUserStore()
  const colors = personalCenterSettings?.colors

  const rule = PersonalCenterSettingsRules()

  useImperativeHandle(ref, () => ({
    resetTrendColors() {
      form.setFieldsValue({ colors })
    },
  }))

  useMount(() => {
    form.setFieldsValue({ colors })
  })

  const postBaseColorType = async (color: number) => {
    const res = await postMemberBaseColorType({ marketSetting: color })
    if (res.isOk && res.data?.isSuccess) {
      setMemberBaseColor(color)
      updatePreferenceAndUserInfoData()

      Message.success(t`features/user/personal-center/settings/converted-currency/index-0`)
      setVisible(false)
    }
  }

  const { run, loading } = useRequest(postBaseColorType, {
    manual: true,
  })

  const onSubmit = values => run(values.colors)

  return (
    <div className={`user-personal-center-settings ${styles.scoped}`}>
      <div className="user-personal-center-settings-wrap">
        <Form form={form} layout="vertical" onSubmit={onSubmit} initialValues={{ colors }}>
          <FormItem field="colors" requiredSymbol={false} rules={[rule.upsAndDownsColor]}>
            <Select placeholder={t`user.account_security.settings_07`} arrowIcon={<Icon name="arrow_open" hasTheme />}>
              {colorList.map(v => (
                <Option key={v.key} value={v.value}>
                  {v.icon}
                  {v.text}
                </Option>
              ))}
            </Select>
          </FormItem>

          <FormItem style={{ marginBottom: 0, marginTop: 12 }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              {t`user.field.reuse_17`}
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  )
}

export default forwardRef(UserPersonalCenterUpsAndDowns)

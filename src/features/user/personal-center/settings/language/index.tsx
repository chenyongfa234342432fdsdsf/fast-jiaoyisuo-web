import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useMount } from 'react-use'
import { Button, Form, Select, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import { PersonalCenterSettingsRules } from '@/features/user/utils/validate'
import { I18nsEnum, I18nsMap } from '@/constants/i18n'
import { UserSelectConfigurationItemType } from '@/typings/api/user'
import { useUserStore } from '@/store/user'
import { getMemberBaseSettingsInfo, postMemberBasePushLanguage } from '@/apis/user'
import Icon from '@/components/icon'
import styles from './index.module.css'

const FormItem = Form.Item
const Option = Select.Option

function UserPersonalCenterPushLanguage({
  setVisible,
  onSuccess,
}: {
  setVisible: Dispatch<SetStateAction<boolean>>
  onSuccess(): void
}) {
  const [languageList, setLanguageList] = useState<Array<UserSelectConfigurationItemType>>([])
  const [form] = Form.useForm()
  const store = useUserStore()
  const info = store.personalCenterSettings
  const locale = info.pushLanguage

  const language = locale
  const rule = PersonalCenterSettingsRules()

  const getBaseSettingsInfo = async () => {
    const res = await getMemberBaseSettingsInfo({})
    if (res.isOk) {
      let list: UserSelectConfigurationItemType[] = []
      Object.keys(I18nsMap).forEach((v, i) => {
        list.push({ key: i, value: I18nsEnum[v], text: I18nsMap[v], isChecked: v === res.data?.pushLanguage })
      })

      store.setPersonalCenterSettings({ pushLanguage: res.data?.pushLanguage })

      setLanguageList(list)
    }
  }

  useMount(getBaseSettingsInfo)

  const onSubmit = async values => {
    const res = await postMemberBasePushLanguage({ language: values.language })
    if (res.isOk && res.data?.isSuccess) {
      Message.success(t`features/user/personal-center/settings/converted-currency/index-0`)
      setVisible(false)
      onSuccess()
    }
  }

  useEffect(() => {
    if (language) {
      form.setFieldsValue({ language })
    }
  }, [language])

  return (
    <div className={`user-personal-center-settings ${styles.scoped}`}>
      <div className="user-personal-center-settings-wrap">
        <Form form={form} layout="vertical" onSubmit={onSubmit} initialValues={{ language }}>
          <FormItem field="language" requiredSymbol={false} rules={[rule.language]}>
            <Select placeholder={t`features/user/utils/validate-1`} arrowIcon={<Icon name="arrow_open" hasTheme />}>
              {languageList.map(v => (
                <Option key={v.key} value={v.value}>
                  {v.text}
                </Option>
              ))}
            </Select>
          </FormItem>

          <FormItem style={{ marginBottom: 0, marginTop: 12 }}>
            <Button type="primary" htmlType="submit">
              {t`user.field.reuse_17`}
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  )
}

export default UserPersonalCenterPushLanguage

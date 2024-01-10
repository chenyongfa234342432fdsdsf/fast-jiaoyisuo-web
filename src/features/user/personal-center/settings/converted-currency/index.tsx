import { Dispatch, SetStateAction, useEffect } from 'react'
import { Button, Form, Select, Message, Image } from '@nbit/arco'
import { useRequest } from 'ahooks'
import { t } from '@lingui/macro'
import { PersonalCenterSettingsRules } from '@/features/user/utils/validate'
import { usePersonalCenterStore } from '@/store/user/personal-center'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { postMemberBaseCurrencyType } from '@/apis/user'
import { useUserStore } from '@/store/user'
import Icon from '@/components/icon'
import styles from './index.module.css'

const FormItem = Form.Item
const Option = Select.Option

function UserPersonalCenterConvertedCurrency({ setVisible }: { setVisible: Dispatch<SetStateAction<boolean>> }) {
  const [form] = Form.useForm()
  const rule = PersonalCenterSettingsRules()

  const { fiatCurrencyData, getFiatCurrencyData, updateFiatCurrencyData } = usePersonalCenterStore()
  const { updatePreferenceAndUserInfoData } = useUserStore()

  useEffect(() => {
    getFiatCurrencyData()
  }, [])

  const postBaseCurrencyType = async (currencyTypeCd: string) => {
    const res = await postMemberBaseCurrencyType({ currencyTypeCd })
    if (res.isOk && res.data?.isSuccess) {
      updateFiatCurrencyData('currencyTypeCd', currencyTypeCd)
      updatePreferenceAndUserInfoData()

      getFiatCurrencyData()
      Message.success(t`features/user/personal-center/settings/converted-currency/index-0`)
      setVisible(false)
    }
  }

  const { run, loading } = useRequest(postBaseCurrencyType, { manual: true })

  const onSubmit = values => run(values.currencyTypeCd)

  return (
    <div className={`user-personal-center-settings ${styles.scoped}`}>
      <div className="user-personal-center-settings-wrap">
        <Form
          form={form}
          layout="vertical"
          onSubmit={onSubmit}
          initialValues={{ currencyTypeCd: fiatCurrencyData?.currencyTypeCd }}
        >
          <FormItem field="currencyTypeCd" requiredSymbol={false} rules={[rule.currency]}>
            <Select placeholder={t`user.account_security.settings_06`} arrowIcon={<Icon name="arrow_open" hasTheme />}>
              {fiatCurrencyData?.currencyList.map(v => (
                <Option key={v.id} value={v.currencyTypeCd as string}>
                  {<Image preview={false} src={`${oss_area_code_image_domain_address}${v.countryFlagImg}.png`} />}
                  {v.currencyEnName}
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

export default UserPersonalCenterConvertedCurrency

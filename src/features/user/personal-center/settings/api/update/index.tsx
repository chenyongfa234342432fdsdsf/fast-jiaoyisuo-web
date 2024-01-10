import { useState } from 'react'
import { Button, Form, Input, Checkbox, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import UniversalSecurityVerification from '@/features/user/universal-security-verification'
import { postMonkeyMemberUpdateOpenApi } from '@/apis/user'
import { UserSettingsApiRules } from '@/features/user/utils/validate'
import UserBackToTheLastPage from '@/features/user/common/back'
import { usePageContext } from '@/hooks/use-page-context'
import { UserInfoSecurityItemValidateCodeType } from '@/typings/api/user'
import Icon from '@/components/icon'
import styles from './index.module.css'

const FormItem = Form.Item
const TextArea = Input.TextArea
const CheckboxGroup = Checkbox.Group

function UserSettingsUpdateApiKey() {
  const [verificaitonShow, setVerificaitonShow] = useState<boolean>(false)
  const [validateCode, setValidateCode] = useState<UserInfoSecurityItemValidateCodeType>()

  const [form] = Form.useForm()
  const pageContext = usePageContext()
  const { id } = pageContext.urlParsed.search

  const rule = UserSettingsApiRules()

  const checkBoxOptions = [
    {
      label: t`features/user/personal-center/settings/api/index-14`,
      value: 1,
    },
    {
      label: t`trade.c2c.trade`,
      value: 2,
    },
    {
      label: t`assets.financial-record.search.withdraw`,
      value: 3,
    },
  ]

  const handleOnSuccess = (isSuccess, code) => {
    isSuccess ? setValidateCode(code) : setVerificaitonShow(false)
  }

  const onSubmit = async values => {
    if (!verificaitonShow) {
      setVerificaitonShow(true)
      return
    }

    const options = {
      id,
      remark: values.remark,
      types: values.types,
      googleValidCode: validateCode?.googleValidCode,
      mobileValidCode: validateCode?.googleValidCode,
      mailValidCode: validateCode?.googleValidCode,
    }

    const res = await postMonkeyMemberUpdateOpenApi(options)
    if (res.isOk) {
      Message.success(t`features/user/personal-center/settings/api/update/index-0`)
    }
  }
  return (
    <div className={`user-settings-update-open-api user-form-style ${styles.scoped}`}>
      <div className="user-settings-update-open-api-wrap">
        <UserBackToTheLastPage />

        <div className="form">
          <Form form={form} layout="vertical" onSubmit={onSubmit}>
            <FormItem label={t`assets.withdraw.remark`} field="remark" requiredSymbol={false} rules={[rule.remark]}>
              <Input placeholder={t`features/user/personal-center/settings/api/index-16`} />
            </FormItem>

            <FormItem
              label={t`features/user/personal-center/settings/api/index-17`}
              field="types"
              requiredSymbol={false}
              rules={[rule.types]}
            >
              <CheckboxGroup options={checkBoxOptions} />
            </FormItem>

            <FormItem label={t`features/user/personal-center/settings/api/index-18`} field="ip">
              <TextArea />
            </FormItem>

            <FormItem>
              <div className="no-bind-ip-tips">
                <div className="icon">
                  <Icon name="msg" />
                </div>
                <div className="text">
                  <label>未绑定 IP 地址的密钥有效期为 90 天</label>
                </div>
              </div>
            </FormItem>

            <FormItem style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                {t`assets.common.comfirm`}
              </Button>
            </FormItem>
          </Form>
        </div>

        <div className="placeholder"></div>
      </div>
      <UniversalSecurityVerification isShow={verificaitonShow} onSuccess={handleOnSuccess as unknown as any} />
    </div>
  )
}

export default UserSettingsUpdateApiKey

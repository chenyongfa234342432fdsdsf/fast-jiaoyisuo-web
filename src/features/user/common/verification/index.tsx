import { useEffect } from 'react'
import { Button, Form, Input } from '@nbit/arco'
import Link from '@/components/link'
import { UserValidateMethodEnum, UserValidateFormTypeEnum, UserAgreementEnum } from '@/constants/user'
import { t } from '@lingui/macro'
import { PersonalCenterAccountSecurityType } from '@/typings/api/user'
import UserCountDown from '@/features/user/components/count-down'
import { useLayoutStore } from '@/store/layout'
import styles from './index.module.css'

const FormItem = Form.Item

type UserValidateInfoType = Pick<PersonalCenterAccountSecurityType, 'email' | 'mobileCountryCd' | 'mobileNumber'>

interface UserVerificationProps {
  /** 是否显示 */
  isShow: boolean
  /** 验证方式 */
  type: string
  /** 登录、注册 */
  mode: string
  /** 邮箱、手机号、手机区号 */
  info: UserValidateInfoType
  /** 发送验证码 */
  onSend(): void
  /** 表单提交回调函数 */
  onSubmit(code: string): void
}

function UserVerification({ isShow, type, mode, info, onSend, onSubmit }: UserVerificationProps) {
  const [form] = Form.useForm()
  const title = mode === UserValidateFormTypeEnum.login ? t`user.field.reuse_07` : t`user.validate_form_11`

  const dataByCd = useLayoutStore().columnsDataByCd

  useEffect(() => {
    isShow && form.clearFields()
  }, [isShow])

  const handleSend = () => {
    const isTrue = onSend()
    return isTrue
  }

  const handleSubmit = () => {
    onSubmit(form.getFieldValue('validCode'))
  }
  return (
    <div className={`user-verification ${styles.scoped}`}>
      <div className="user-verification-wrap">
        <div className="title">
          <label>
            {type === UserValidateMethodEnum.email
              ? `${title} - ${t`user.field.reuse_03`}`
              : type === UserValidateMethodEnum.phone
              ? `${title} - ${t`user.field.reuse_04`}`
              : `${title} - ${t`user.field.reuse_05`}`}
          </label>
        </div>

        <div className="text">
          <label>
            {type === UserValidateMethodEnum.email
              ? `${t`user.retrieve.reset_password_04`} ${info.email} ${t`user.retrieve.reset_password_06`}`
              : type === UserValidateMethodEnum.phone
              ? `${t`user.retrieve.reset_password_05`} +${info.mobileCountryCd} ${
                  info.mobileNumber
                } ${t`user.retrieve.reset_password_06`}`
              : `${t`user.safety_verification_06`} ${t`user.retrieve.reset_password_06`}`}
          </label>
        </div>

        <div className="form">
          <Form form={form} layout="vertical" onSubmit={handleSubmit}>
            {type === UserValidateMethodEnum.email && (
              <FormItem
                field="validCode"
                label={t`user.field.reuse_03`}
                requiredSymbol={false}
                rules={[{ required: true, message: t`user.field.reuse_49` }]}
              >
                <Input placeholder={t`user.validate_form_02`} suffix={<UserCountDown onSend={handleSend} />} />
              </FormItem>
            )}

            {type === UserValidateMethodEnum.phone && (
              <FormItem
                field="validCode"
                label={t`user.field.reuse_04`}
                requiredSymbol={false}
                rules={[{ required: true, message: t`user.field.reuse_49` }]}
              >
                <Input placeholder={t`user.field.reuse_21`} suffix={<UserCountDown onSend={handleSend} />} />
              </FormItem>
            )}

            {type === UserValidateMethodEnum.validator && (
              <FormItem
                field="validCode"
                label={t`user.field.reuse_05`}
                requiredSymbol={false}
                rules={[{ required: true, message: t`user.field.reuse_49` }]}
              >
                <Input placeholder={t`user.safety_verification_05`} />
              </FormItem>
            )}

            <div className="security-item">
              <Link
                href={dataByCd?.[UserAgreementEnum.unreceiveVerificationCode]?.webUrl}
              >{t`user.field.reuse_22`}</Link>
            </div>

            <FormItem style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                {t`user.field.reuse_02`}
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default UserVerification

import { useState } from 'react'
import { Button, Form, Input, Message } from '@nbit/arco'
import { useUpdateEffect } from 'ahooks'
import { t } from '@lingui/macro'
import UserTipsInfo from '@/features/user/common/tips-info'
import UserPasswordValidateTips from '@/features/user/common/password-validate'
import UserPopUp from '@/features/user/components/popup'
import UserPopUpSuccessContent from '@/features/user/components/popup/content/success'
import UserFormLayout from '@/features/user/common/user-form-layout'
import { link } from '@/helper/link'
import { postMemberSafePassword } from '@/apis/user'
import { PersonalCenterModifyPasswordRules } from '@/features/user/utils/validate'
import { FormValuesTrim } from '@/features/user/utils/common'
import { useUserStore } from '@/store/user'
import Icon from '@/components/icon'

const FormItem = Form.Item

function UserModifyPassword() {
  const [password, setPassword] = useState<string>('')
  const [visible, setVisible] = useState<boolean>(false)
  const [passwordValidate, setPasswordValidate] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  // const [disabled, setDisabled] = useState<boolean>(true)
  const [passwordShow, setPasswordShow] = useState({
    oldPasswordShow: false,
    newPasswordShow: false,
    confirmPasswordShow: false,
  })
  const [form] = Form.useForm()
  const store = useUserStore()
  const oldPassword = Form.useWatch('oldPassword', form)
  const newPassword = Form.useWatch('newPassword', form)
  const confirmPassword = Form.useWatch('confirmPassword', form)

  const rules = PersonalCenterModifyPasswordRules(newPassword)

  // const handleValidateChange = () => {
  //   form
  //     .validate()
  //     .then(() => setDisabled(false))
  //     .catch(() => setDisabled(true))
  // }

  useUpdateEffect(() => {
    newPassword && confirmPassword && form.validate(['newPassword', 'confirmPassword'])
  }, [newPassword, confirmPassword])

  const handleClearPassword = (key: string) => {
    form.setFieldValue(key, '')
    key === 'newPassword' && setPassword('')
  }

  const handleToLogin = async () => {
    await store.clearUserCacheData()
    Message.success(t`features_user_personal_center_menu_navigation_index_2443`)
    link('/login')
  }

  const onSubmit = async values => {
    if (!passwordValidate) {
      Message.warning(t`features_user_register_flow_index_2448`)
      return
    }

    setLoading(true)
    const res = await postMemberSafePassword(values)
    if (res.isOk) {
      setVisible(true)
    }
    setLoading(false)
  }

  return (
    <div className="user-modify-password user-form-style mt-36">
      <div className="user-modify-password-wrap">
        <UserFormLayout title={t`user.pageContent.title_20`}>
          <UserTipsInfo
            slotContent={
              <>
                <p>{t`user.account_security.modify_password_09`}</p>
                <p>{t`user.account_security.modify_password_02`}</p>
              </>
            }
          />

          <Form
            form={form}
            layout="vertical"
            onSubmit={onSubmit}
            autoComplete="off"
            validateTrigger="onBlur"
            // onChange={handleValidateChange}
          >
            <FormItem
              label={t`user.account_security.modify_password_03`}
              field="oldPassword"
              requiredSymbol={false}
              rules={[rules.oldPassword]}
            >
              <Input
                placeholder={t`user.account_security.modify_password_04`}
                type={passwordShow.oldPasswordShow ? 'text' : 'password'}
                suffix={
                  <>
                    {oldPassword && (
                      <Icon name="del_input_box" hasTheme onClick={() => handleClearPassword('oldPassword')} />
                    )}

                    <Icon
                      name={passwordShow.oldPasswordShow ? 'eyes_open' : 'eyes_close'}
                      hasTheme
                      onClick={() =>
                        setPasswordShow({
                          ...passwordShow,
                          oldPasswordShow: !passwordShow.oldPasswordShow,
                        })
                      }
                    />
                  </>
                }
              />
            </FormItem>

            <FormItem
              label={t`user.account_security.modify_password_05`}
              field="newPassword"
              requiredSymbol={false}
              rules={[rules.password]}
              formatter={FormValuesTrim}
            >
              <Input
                onChange={setPassword}
                placeholder={t`user.field.reuse_19`}
                maxLength={16}
                type={passwordShow.newPasswordShow ? 'text' : 'password'}
                suffix={
                  <>
                    {newPassword && (
                      <Icon name="del_input_box" hasTheme onClick={() => handleClearPassword('newPassword')} />
                    )}

                    <Icon
                      name={passwordShow.newPasswordShow ? 'eyes_open' : 'eyes_close'}
                      hasTheme
                      onClick={() =>
                        setPasswordShow({
                          ...passwordShow,
                          newPasswordShow: !passwordShow.newPasswordShow,
                        })
                      }
                    />
                  </>
                }
              />
            </FormItem>

            <UserPasswordValidateTips password={FormValuesTrim(password) as string} validate={setPasswordValidate} />

            <FormItem
              label={t`user.account_security.modify_password_06`}
              field="confirmPassword"
              requiredSymbol={false}
              formatter={FormValuesTrim}
              rules={[rules.confirmPassword]}
            >
              <Input
                type={passwordShow.confirmPasswordShow ? 'text' : 'password'}
                maxLength={16}
                placeholder={t`user.account_security.modify_password_07`}
                suffix={
                  <>
                    {confirmPassword && (
                      <Icon name="del_input_box" hasTheme onClick={() => handleClearPassword('confirmPassword')} />
                    )}

                    <Icon
                      name={passwordShow.confirmPasswordShow ? 'eyes_open' : 'eyes_close'}
                      hasTheme
                      onClick={() =>
                        setPasswordShow({
                          ...passwordShow,
                          confirmPasswordShow: !passwordShow.confirmPasswordShow,
                        })
                      }
                    />
                  </>
                }
              />
            </FormItem>

            <FormItem style={{ marginBottom: 0 }}>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                // disabled={disabled || !oldPassword || !newPassword || !confirmPassword}
              >
                {t`user.field.reuse_10`}
              </Button>
            </FormItem>
          </Form>
        </UserFormLayout>
      </div>

      <UserPopUp
        className="user-popup user-popup-success"
        visible={visible}
        closable={false}
        onCancel={handleToLogin}
        footer={<Button type="primary" onClick={handleToLogin}>{t`user.field.reuse_32`}</Button>}
      >
        <UserPopUpSuccessContent slotContent={<p>{t`user.account_security.modify_password_08`}</p>} />
      </UserPopUp>
    </div>
  )
}

export default UserModifyPassword

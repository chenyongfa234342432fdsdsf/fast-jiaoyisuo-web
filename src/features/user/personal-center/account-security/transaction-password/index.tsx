import { useState } from 'react'
import { Button, Form, Input, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import UserTipsInfo from '@/features/user/common/tips-info'
import UserPopUp from '@/features/user/components/popup'
import UserPopUpSuccessContent from '@/features/user/components/popup/content/success'
import UserBackToTheLastPage from '@/features/user/common/back'
import Icon from '@/components/icon'
import { postMemberBaseTradePassword } from '@/apis/user'
import { PersonalCenterModifyPasswordRules } from '@/features/user/utils/validate'
import { usePageContext } from '@/hooks/use-page-context'
import { AccountSecurityOperationTypeEnum } from '@/constants/user'
import styles from './index.module.css'

const FormItem = Form.Item

function UserPersonalCenterTransactionPassword() {
  const [visible, setVisible] = useState<boolean>(false)
  const [passwordShow, setPasswordShow] = useState({
    newPasswordShow: false,
    confirmPasswordShow: false,
  })

  const [form] = Form.useForm()
  const newPassword = Form.useWatch('newPassword', form)
  const pageContext = usePageContext()

  const mode = pageContext.urlParsed.search?.type || ''

  const rules = PersonalCenterModifyPasswordRules(newPassword)

  const handleToLogin = async () => {
    Message.success(t`features_user_personal_center_account_security_transaction_password_index_2435`)
    window.history.back()
  }

  const onSubmit = async values => {
    const res = await postMemberBaseTradePassword(values)
    if (res.isOk) {
      setVisible(true)
    }
  }

  return (
    <div className={`user-modify-password user-form-style ${styles.scoped}`}>
      <div className="user-modify-password-wrap">
        <UserBackToTheLastPage />

        <div className="form">
          <div className="title">
            <label>{t`features_user_personal_center_account_security_transaction_password_index_2437`}</label>
          </div>

          {mode === AccountSecurityOperationTypeEnum.modify && (
            <UserTipsInfo
              slotContent={<p>{t`features_user_personal_center_account_security_transaction_password_index_2438`}</p>}
            />
          )}

          <Form form={form} layout="vertical" onSubmit={onSubmit}>
            {mode === AccountSecurityOperationTypeEnum.modify && (
              <FormItem
                label={t`features_user_personal_center_account_security_transaction_password_index_2439`}
                field="oldPassword"
                requiredSymbol={false}
                rules={[rules.oldPassword]}
              >
                <Input
                  placeholder={t`features_user_personal_center_account_security_transaction_password_index_2440`}
                />
              </FormItem>
            )}

            <FormItem
              label={t`features_user_personal_center_account_security_transaction_password_index_2437`}
              field="newPassword"
              requiredSymbol={false}
              rules={[rules.password]}
            >
              <Input
                placeholder={t`features_user_personal_center_account_security_transaction_password_index_2441`}
                type={passwordShow.newPasswordShow ? 'text' : 'password'}
                suffix={
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
                }
              />
            </FormItem>

            <FormItem
              label={t`user.account_security.modify_password_06`}
              field="confirmPassword"
              requiredSymbol={false}
              rules={[rules.confirmPassword]}
            >
              <Input
                type={passwordShow.confirmPasswordShow ? 'text' : 'password'}
                placeholder={t`features_user_personal_center_account_security_transaction_password_index_2442`}
                suffix={
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
                }
              />
            </FormItem>

            <FormItem style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                {t`user.field.reuse_17`}
              </Button>
            </FormItem>
          </Form>
        </div>
        <div className="placeholder"></div>
      </div>

      <UserPopUp
        className="user-popup user-popup-success"
        visible={visible}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisible(false)}
        footer={<Button type="primary" onClick={handleToLogin}>{t`user.field.reuse_32`}</Button>}
      >
        <UserPopUpSuccessContent slotContent={<p>{t`user.account_security.modify_password_08`}</p>} />
      </UserPopUp>
    </div>
  )
}

export default UserPersonalCenterTransactionPassword

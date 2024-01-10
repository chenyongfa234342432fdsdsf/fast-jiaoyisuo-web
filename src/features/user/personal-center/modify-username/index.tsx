import { Dispatch, SetStateAction, useEffect } from 'react'
import { Button, Form, Input, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import UserTipsInfo from '@/features/user/common/tips-info'
import { PersonalCenterModifyUsernameRules } from '@/features/user/utils/validate'
import { postMemberPersonalCenterSetNick } from '@/apis/user'
import { useRequest } from 'ahooks'
import styles from './index.module.css'

const FormItem = Form.Item

function UserPersonalCenterModifyUserName({
  isShow,
  onSuccess,
  setVisible,
}: {
  isShow: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  onSuccess(): void
}) {
  const [form] = Form.useForm()

  const rules = PersonalCenterModifyUsernameRules()

  const setNickName = async values => {
    const res = await postMemberPersonalCenterSetNick(values)
    if (res.isOk && res.data?.isSuccess) {
      Message.success(t`user.field.reuse_40`)
      setVisible(false)
      onSuccess()
    }
  }

  const { run, loading } = useRequest(setNickName, { manual: true })

  useEffect(() => {
    isShow && form.clearFields()
  }, [isShow])

  return (
    <div className={`user-modify-name ${styles.scoped}`}>
      <div className="user-modify-name-wrap">
        <UserTipsInfo slotContent={<p>{t`user.account_security.modify_username_01`}</p>} />

        <Form form={form} layout="vertical" onSubmit={run} autoComplete="off" validateTrigger="onBlur">
          <FormItem
            label={t`user.pageContent.title_10`}
            field="nickName"
            requiredSymbol={false}
            rules={[rules.nickName]}
          >
            <Input maxLength={12} placeholder={t`user.form.validation_10`} />
          </FormItem>

          <FormItem>
            <Button loading={loading} type="primary" htmlType="submit">
              {t`user.field.reuse_02`}
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  )
}

export default UserPersonalCenterModifyUserName

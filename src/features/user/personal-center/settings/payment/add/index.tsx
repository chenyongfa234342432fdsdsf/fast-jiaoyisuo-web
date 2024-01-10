import { useState } from 'react'
import { Button, Form, Input, Upload } from '@nbit/arco'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import { usePageContext } from '@/hooks/use-page-context'
import UserBackToTheLastPage from '@/features/user/common/back'
import { UserSettingsAddPaymentRules } from '@/features/user/utils/validate'
import { postUploadImage } from '@/apis/user'
import Icon from '@/components/icon'
import styles from './index.module.css'

const FormItem = Form.Item

enum paymentTypeEnum {
  wechat = 'wechat',
  alipay = 'alipay',
  bank = 'bank',
}

function UserSettingsAddPayment() {
  const [uploaderImage, setUploaderImage] = useState<string>('')
  const cs = `arco-upload-list-item${uploaderImage === '' ? ' is-error' : ''}`

  const [form] = Form.useForm()
  const pageContext = usePageContext()
  const params = pageContext.routeParams.id
  console.log(params)

  const payment =
    params === paymentTypeEnum.wechat
      ? t`features/user/personal-center/settings/payment/add/index-0`
      : params === paymentTypeEnum.alipay
      ? t`features/user/personal-center/settings/payment/add/index-1`
      : t`features/user/personal-center/settings/payment/add/index-2`

  const rule = UserSettingsAddPaymentRules()

  const handleUploadImage = async option => {
    const { file } = option

    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileDir', 'security_item')

    const res = await postUploadImage(formData)
    if (res.isOk) {
      setUploaderImage(res.data.filePathUrl)
    }
  }

  const onSubmit = () => {
    link('/personal-center/settings/payment')
  }
  return (
    <section className={`user-settings-add-payment user-form-style ${styles.scoped}`}>
      <div className="user-settings-add-payment-wrap">
        <UserBackToTheLastPage />

        <div className="form">
          <div className="title">
            <label>{t`features/user/personal-center/settings/payment/add/index-3`}-</label>
            <label>{payment}</label>
          </div>

          <Form form={form} layout="vertical" onSubmit={onSubmit}>
            <FormItem
              label={t`features/user/personal-center/settings/payment/add/index-4`}
              field="name"
              requiredSymbol={false}
              rules={[rule.name]}
            >
              <Input placeholder={t`features/user/personal-center/settings/payment/add/index-5`} />
            </FormItem>

            {(params === paymentTypeEnum.wechat || params === paymentTypeEnum.alipay) && (
              <>
                <FormItem
                  label={t`features/user/personal-center/settings/payment/add/index-6`}
                  field="account"
                  requiredSymbol={false}
                  rules={[rule.account]}
                >
                  <Input placeholder={t`features/user/personal-center/settings/payment/add/index-7`} />
                </FormItem>

                <FormItem label={t`features/user/personal-center/settings/payment/add/index-8`} field="qrCodeUrl">
                  <Upload showUploadList={false} customRequest={handleUploadImage}>
                    <div className={cs}>
                      {uploaderImage !== '' ? (
                        <div className="arco-upload-list-item-picture custom-upload-avatar">
                          <img src={uploaderImage} alt="" />
                          <div className="arco-upload-list-item-picture-mask">
                            <Icon name="property_icon_increase" />
                          </div>
                        </div>
                      ) : (
                        <div className="arco-upload-trigger-picture">
                          <div className="arco-upload-trigger-picture-text">
                            <Icon name="property_icon_increase" />
                          </div>
                        </div>
                      )}
                    </div>
                  </Upload>
                </FormItem>
              </>
            )}

            {params === paymentTypeEnum.bank && (
              <>
                <FormItem
                  label={t`features/user/personal-center/settings/payment/add/index-9`}
                  field="bankName"
                  requiredSymbol={false}
                  rules={[rule.bankName]}
                >
                  <Input placeholder={t`features/user/personal-center/settings/payment/add/index-10`} />
                </FormItem>

                <FormItem
                  label={t`features/user/personal-center/settings/payment/add/index-11`}
                  field="bankCardNumber"
                  requiredSymbol={false}
                  rules={[rule.bankCardNumber]}
                >
                  <Input placeholder={t`features/user/personal-center/settings/payment/add/index-12`} />
                </FormItem>

                <FormItem label={t`features/user/personal-center/settings/payment/add/index-13`} field="branchName">
                  <Input placeholder={t`features/user/personal-center/settings/payment/add/index-14`} />
                </FormItem>

                <FormItem
                  label={t`user.account_security.settings_08`}
                  field="capitalPwd"
                  requiredSymbol={false}
                  rules={[rule.capitalPwd]}
                >
                  <Input type="password" placeholder={t`trade.c2c.max.Pleaseenterthefundpassword`} />
                </FormItem>
              </>
            )}

            <FormItem style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit">
                {t`user.field.reuse_17`}
              </Button>
            </FormItem>
          </Form>
        </div>
        <div className="placeholder"></div>
      </div>
    </section>
  )
}

export default UserSettingsAddPayment

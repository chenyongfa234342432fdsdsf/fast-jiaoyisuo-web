import { useState } from 'react'
import { Button, Form, Input, Message, Select, Image } from '@nbit/arco'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import UserTipsInfo from '@/features/user/common/tips-info'
import UserChooseVerificationMethod from '@/features/user/common/choose-verification-method'
import UserSearchArea from '@/features/user/common/search-area'
import UserPopUp from '@/features/user/components/popup'
import UserFormLayout from '@/features/user/common/user-form-layout'
import { MemberMemberAreaType } from '@/typings/user'
import { UserValidateMethodEnum, UserVerifyTypeEnum, ChinaAreaCodeEnum } from '@/constants/user'
import { RetrieveValidateRules, formatPhoneNumber } from '@/features/user/utils/validate'
import { useUserStore } from '@/store/user'
import { IsAccountType } from '@/features/user/utils/common'
import { oss_area_code_image_domain_address } from '@/constants/oss'
// import { postMemberVerifyByAccoun } from '@/apis/user'
import Icon from '@/components/icon'
import styles from './index.module.css'

const FormItem = Form.Item

function UserRetrieve() {
  const [visible, setVisible] = useState<boolean>(false)
  const [method, setMethod] = useState<string>(UserValidateMethodEnum.email)
  // const [disabled, setDisabled] = useState<boolean>(true)
  const [area, setArea] = useState<MemberMemberAreaType>({
    codeVal: ChinaAreaCodeEnum.code,
    codeKey: t`features_user_personal_center_account_security_phone_index_2432`,
    remark: ChinaAreaCodeEnum.remark,
  })
  // const verifyAccount = useRef<boolean>(false)

  const [form] = Form.useForm()
  const store = useUserStore()

  // const email = Form.useWatch('email', form)
  // const phone = Form.useWatch('phone', form)

  // const isAccount = email || phone
  // const info = store.userTransitionDatas

  const rules = RetrieveValidateRules()

  // const handleVerifyByAccoun = async () => {
  //   const options = {
  //     type: method === UserValidateMethodEnum.email ? UserVerifyTypeEnum.email : UserVerifyTypeEnum.phone,
  //     account: isAccount, // 邮箱
  //     mobileCountryCode: method === UserValidateMethodEnum.phone ? area.enCode : '', // 区号
  //   }
  //   const res = await postMemberVerifyByAccoun(options)
  //   if (res.isOk) {
  //     verifyAccount.current = true
  //     form.submit()
  //     return
  //   }

  //   verifyAccount.current = false
  // }

  // const handleValidateChange = () => {
  //   form
  //     .validate()
  //     .then(() => setDisabled(false))
  //     .catch(() => setDisabled(true))
  // }

  const handleChoosMethod = (type: string) => {
    setMethod(type)
    form.clearFields()
  }

  const handleSelectArea = (v: MemberMemberAreaType) => {
    setArea(v)
    setVisible(false)
  }

  const onSubmit = async values => {
    // if (!verifyAccount.current) {
    //   handleVerifyByAccoun()
    //   return
    // }

    const isAccountType = values.email && IsAccountType(values.email)

    if (values.email && !isAccountType) {
      Message.warning(t`features/user/retrieve/index-0`)
      return
    }

    await store.setUserTransitionDatas({
      accountType: method === UserValidateMethodEnum.email ? UserVerifyTypeEnum.email : UserVerifyTypeEnum.phone,
      email: isAccountType === UserVerifyTypeEnum.email && values.email,
      mobileNumber: values.phone?.replace(/\s/g, ''),
      mobileCountryCode: area.codeVal,
      uid: isAccountType === UserVerifyTypeEnum.uid && values.email,
    })

    link(`/retrieve/reset-password`)
  }

  return (
    <div className={`user-retrive user-form-style ${styles.scoped}`}>
      <div className="user-retrive-wrap">
        <UserFormLayout title={t`user.field.reuse_24`}>
          <UserTipsInfo slotContent={<p>{t`user.field.reuse_30`}</p>} />

          <UserChooseVerificationMethod
            tabList={[
              { title: t`user.safety_items_04`, id: 'email' },
              { title: t`user.validate_form_header_02`, id: 'phone' },
            ]}
            method={method}
            choosMethod={handleChoosMethod}
          />

          <Form
            form={form}
            layout="vertical"
            onSubmit={onSubmit}
            autoComplete="off"
            validateTrigger="onBlur"
            // onChange={handleValidateChange}
          >
            {method === UserValidateMethodEnum.email && (
              <FormItem label={t`user.safety_items_04`} field="email" rules={[rules.email]} requiredSymbol={false}>
                <Input placeholder={t`user.validate_form_02`} />
              </FormItem>
            )}

            {method === UserValidateMethodEnum.phone && (
              <FormItem
                label={t`user.validate_form_03`}
                field="phone"
                rules={[rules.phone]}
                requiredSymbol={false}
                formatter={value => formatPhoneNumber(value, area?.codeVal)}
              >
                <Input
                  placeholder={t`user.field.reuse_11`}
                  addBefore={
                    <Select
                      onClick={() => setVisible(true)}
                      style={{ width: 100 }}
                      popupVisible={false}
                      arrowIcon={<Icon name="arrow_open" hasTheme />}
                      prefix={
                        <>
                          <Image preview={false} src={`${oss_area_code_image_domain_address}${area?.remark}.png`} /> +
                          {area?.codeVal}{' '}
                        </>
                      }
                    />
                  }
                />
              </FormItem>
            )}

            <FormItem style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                // disabled={disabled || !isAccount}
              >
                {t`user.field.reuse_23`}
              </Button>
            </FormItem>
          </Form>
        </UserFormLayout>
      </div>
      <UserPopUp
        title={<div style={{ textAlign: 'left' }}>{t`user.search_area_04`}</div>}
        className="user-popup"
        maskClosable={false}
        visible={visible}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <UserSearchArea
          type="area"
          checkedValue={area?.codeVal}
          placeholderText={t`user.field.reuse_25`}
          selectArea={handleSelectArea}
        />
      </UserPopUp>
    </div>
  )
}

export default UserRetrieve

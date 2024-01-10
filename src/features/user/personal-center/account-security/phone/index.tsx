import { useState, useRef } from 'react'
import { Button, Form, Input, Message, Select, Image } from '@nbit/arco'
import UserTipsInfo from '@/features/user/common/tips-info'
import UserPopUp from '@/features/user/components/popup'
import UserPopUpSuccessContent from '@/features/user/components/popup/content/success'
import UserCountDown from '@/features/user/components/count-down'
import UserSearchArea from '@/features/user/common/search-area'
import UserFormLayout from '@/features/user/common/user-form-layout'
import { t } from '@lingui/macro'
import { usePageContext } from '@/hooks/use-page-context'
import Icon from '@/components/icon'
import {
  AccountSecurityOperationTypeEnum,
  UserSendValidateCodeBusinessTypeEnum,
  ChinaAreaCodeEnum,
} from '@/constants/user'
import { postMemberSafeMobileUpdate, postMemberSafePhoneBind, postMemberSafeVerifyPhoneSend } from '@/apis/user'
import { MemberMemberAreaType } from '@/typings/user'
import { PersonalCenterPhoneRules, formatPhoneNumber } from '@/features/user/utils/validate'
import { useUserStore } from '@/store/user'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { link } from '@/helper/link'

const FormItem = Form.Item

function UserAccountSecurityPhone() {
  const [visible, setVisible] = useState<boolean>(false)
  const [selectArea, setSelectArea] = useState<boolean>(false)
  const [newPhone, setNewPhone] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const isPhoneSend = useRef<boolean>(false)
  // const [disabled, setDisabled] = useState<boolean>(true)
  const [area, setArea] = useState<MemberMemberAreaType>({
    codeVal: ChinaAreaCodeEnum.code,
    codeKey: t`features_user_personal_center_account_security_phone_index_2432`,
    remark: ChinaAreaCodeEnum.remark,
  })

  const pageContext = usePageContext()
  const [form] = Form.useForm()
  const store = useUserStore()
  const mobile = Form.useWatch('mobileNumber', form)
  // const verifyCode = Form.useWatch('verifyCode', form)

  const rules = PersonalCenterPhoneRules(isPhoneSend)

  const mode = pageContext.urlParsed.search?.type || ''

  const type =
    mode === AccountSecurityOperationTypeEnum.modify
      ? UserSendValidateCodeBusinessTypeEnum.modifyNewPhone
      : UserSendValidateCodeBusinessTypeEnum.bindPhone

  // const handleValidateChange = () => {
  //   form
  //     .validate()
  //     .then(() => setDisabled(false))
  //     .catch(() => setDisabled(true))
  // }

  const handleSendPhoneValidateCode = async () => {
    if (!mobile) {
      Message.warning(t`features_user_personal_center_account_security_phone_index_2433`)
      return false
    }

    const res = await postMemberSafeVerifyPhoneSend({
      type,
      mobile: mobile?.replace(/\s/g, ''),
      mobileCountryCode: area.codeVal,
    })

    const isTrue = (res.isOk && res.data?.isSuccess) || false
    if (isTrue) {
      isPhoneSend.current = true
      Message.success(t`user.field.reuse_38`)
    }
    return isTrue
  }

  const handleSelectArea = v => {
    setArea(v)
    setSelectArea(false)
  }

  const onSubmit = async values => {
    values.mobileCountryCode = area.codeVal
    values.mobileNumber = values.mobileNumber?.replace(/\s/g, '')
    values.operateType = type
    setLoading(true)

    if (mode === AccountSecurityOperationTypeEnum.modify) {
      const res = await postMemberSafeMobileUpdate(values)
      if (res.isOk && res.data?.isSuccess) {
        setNewPhone(form.getFieldValue('mobileNumber'))
        setVisible(true)
      }
      setLoading(false)
    } else {
      const res = await postMemberSafePhoneBind(values)
      if (res.isOk && res.data?.isSuccess) {
        Message.success(t`features_user_personal_center_account_security_phone_index_2434`)
        link('/personal-center/account-security')
      }
      setLoading(false)
    }
  }

  const handleModifySuccess = async () => {
    if (mode === AccountSecurityOperationTypeEnum.modify) {
      await store.clearUserCacheData()
      Message.success(t`features_user_personal_center_menu_navigation_index_2443`)
      setVisible(false)
      setLoading(false)
      link('/login')
      return
    }

    link('/personal-center/account-security')
  }

  return (
    <div className="user-account-security-phone user-form-style mt-36">
      <div className="user-account-security-phone-wrap">
        <UserFormLayout
          title={
            mode === AccountSecurityOperationTypeEnum.bind
              ? t`features_user_personal_center_account_security_phone_index_2605`
              : t`features_user_personal_center_account_security_phone_index_2606`
          }
        >
          {mode === AccountSecurityOperationTypeEnum.modify && (
            <UserTipsInfo
              slotContent={
                <>
                  <p>{t`user.account_security.phone.verification_01`}</p>
                  <p>{t`user.account_security.phone.verification_02`}</p>
                </>
              }
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onSubmit={onSubmit}
            autoComplete="off"
            validateTrigger="onBlur"
            // onChange={handleValidateChange}
          >
            <FormItem
              label={t`user.account_security.phone.verification_03`}
              field="mobileNumber"
              rules={[rules.phone]}
              requiredSymbol={false}
              formatter={value => formatPhoneNumber(value, area?.codeVal)}
            >
              <Input
                placeholder={t`user.field.reuse_11`}
                addBefore={
                  <Select
                    onClick={() => setSelectArea(true)}
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

            <FormItem
              label={t`user.field.reuse_18`}
              field="verifyCode"
              requiredSymbol={false}
              rules={[rules.phoneCode]}
            >
              <Input
                type="number"
                maxLength={6}
                placeholder={t`user.account_security.phone.verification_04`}
                suffix={<UserCountDown onSend={handleSendPhoneValidateCode} />}
              />
            </FormItem>

            <FormItem style={{ marginBottom: 0 }}>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                // disabled={disabled || !mobile || !verifyCode}
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
        onCancel={handleModifySuccess}
        footer={<Button type="primary" onClick={handleModifySuccess}>{t`user.field.reuse_32`}</Button>}
      >
        <UserPopUpSuccessContent
          slotContent={
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {mode === AccountSecurityOperationTypeEnum.modify ? (
                <p>{t`user.account_security.phone.verification_07`}</p>
              ) : (
                <>
                  <p>{t`user.account_security.phone.verification_05`}</p>
                  <p>
                    {t`user.account_security.phone.verification_06`} {newPhone}
                  </p>
                </>
              )}
            </>
          }
        />
      </UserPopUp>

      <UserPopUp
        title={<div style={{ textAlign: 'left' }}>{t`user.search_area_04`}</div>}
        className="user-popup"
        maskClosable={false}
        visible={selectArea}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={() => setSelectArea(false)}
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

export default UserAccountSecurityPhone

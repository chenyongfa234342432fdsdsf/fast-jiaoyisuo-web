import { useState, useEffect, useMemo } from 'react'
import { Button, Form, Select, Image, Input, Checkbox, Message } from '@nbit/arco'
import { useUpdateEffect } from 'ahooks'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import Link from '@/components/link'
import UserSearchArea from '@/features/user/common/search-area'
import {
  UserValidateMethodEnum,
  UserVerifyTypeEnum,
  GeeTestOperationTypeEnum,
  // UserEnabledStateTypeEnum,
  UserRegisterTypeEnum,
  UserAgreementEnum,
  ChinaAreaCodeEnum,
} from '@/constants/user'
import UserPopUp from '@/features/user/components/popup'
import { MemberMemberAreaType } from '@/typings/user'
import UserChooseVerificationMethod from '@/features/user/common/choose-verification-method'
import UserPasswordValidateTips from '@/features/user/common/password-validate'
import UserFormLayout from '@/features/user/common/user-form-layout'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { RegisterFlowRules, formatPhoneNumber } from '@/features/user/utils/validate'
import { postMemberRegisterValidEmail, postMemberRegisterValidPhone } from '@/apis/user'
import { useGeeTestBind } from '@/features/user/common/geetest'
import { usePageContext } from '@/hooks/use-page-context'
import { useUserStore } from '@/store/user'
import { FormValuesTrim } from '@/features/user/utils/common'
import { useLayoutStore } from '@/store/layout'
import Icon from '@/components/icon'
import styles from './index.module.css'

const FormItem = Form.Item

function UserRegisterFlow() {
  // const [isEnble, setIsEnble] = useState<boolean>(true)
  const [method, setMethod] = useState<string>(UserValidateMethodEnum.email)
  const [selectArea, setSelectArea] = useState<boolean>(false)
  const [passwordValue, setPasswordValue] = useState<string>('')
  const [passwordValidate, setPasswordValidate] = useState<boolean>(false)
  const [invitationCodeShow, setInvitationCodeShow] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  // const [disabled, setDisabled] = useState<boolean>(true)
  const [checkBoxStatus, setCheckBoxStatus] = useState<boolean>(false)
  const [area, setArea] = useState({
    codeVal: ChinaAreaCodeEnum.code,
    codeKey: t`features_user_personal_center_account_security_phone_index_2432`,
    remark: ChinaAreaCodeEnum.remark,
  })
  const [passwordShow, setPasswordShow] = useState({
    newPasswordShow: true,
    confirmPasswordShow: true,
  })
  const [form] = Form.useForm()
  // const email = Form.useWatch('email', form)
  // const mobile = Form.useWatch('mobileNumber', form)
  const loginPassword = Form.useWatch('loginPassword', form)
  const confirmPassword = Form.useWatch('confirmPassword', form)

  // const isAccount = email || mobile

  const rules = RegisterFlowRules(loginPassword)

  useUpdateEffect(() => {
    loginPassword && confirmPassword && form.validate(['loginPassword', 'confirmPassword'])
  }, [loginPassword, confirmPassword])

  const geeTestInit = useGeeTestBind()
  const pageContext = usePageContext()
  const store = useUserStore()
  const layoutStore = useLayoutStore()
  const info = store.userTransitionDatas
  const { invitationCode, regCountry = null } = pageContext.urlParsed.search

  const getThirdPartyAccountDisplayType = useMemo(() => {
    if (info.registerType === UserRegisterTypeEnum.default) {
      return [
        { title: t`user.safety_items_04`, id: 'email' },
        { title: t`user.validate_form_header_02`, id: 'phone' },
      ]
    }

    setMethod(
      info.thirdPartyAccountType === UserVerifyTypeEnum.email
        ? UserValidateMethodEnum.email
        : UserValidateMethodEnum.phone
    )

    return info.thirdPartyAccountType === UserVerifyTypeEnum.email
      ? [{ title: t`user.safety_items_04`, id: 'email' }]
      : [{ title: t`user.validate_form_header_02`, id: 'phone' }]
  }, [info.registerType, info.thirdPartyAccountType])

  // useEffect(() => {
  //   if (!info.codeVal || !regCountry) link('/register')
  // }, [])

  useEffect(() => {
    if (info.thirdPartyAccount) {
      info.thirdPartyAccountType === UserVerifyTypeEnum.email
        ? form.setFieldValue('email', info.thirdPartyAccount)
        : form.setFieldValue('mobileNumber', info.thirdPartyAccount)
    }
  }, [])

  useEffect(() => {
    setArea({
      codeVal: info.codeVal,
      codeKey: info.codeKey,
      remark: info.remark,
    })
  }, [])

  useEffect(() => {
    invitationCode && form.setFieldValue('invite', invitationCode)
  }, [])

  // const handleValidateChange = () => {
  //   form
  //     .validate()
  //     .then(() => setDisabled(false))
  //     .catch(() => setDisabled(true))
  // }

  const handleClearPassword = (key: string) => {
    form.setFieldValue(key, '')
    key === 'loginPassword' && setPasswordValue('')
  }

  const handleChoosMethod = (type: string) => {
    setMethod(type)
    setPasswordValue('')
    setCheckBoxStatus(false)
    form.clearFields()
    invitationCode && form.setFieldValue('invite', invitationCode)
  }

  const handleSelectArea = (v: MemberMemberAreaType) => {
    // if (v.enableInd === UserEnabledStateTypeEnum.enable) setIsEnble(true)
    setArea(v as unknown as any)
    setSelectArea(false)
  }

  const handleRegister = async values => {
    values.regCountry = regCountry
    values.mobileCountryCode = area.codeVal
    values.mobileNumber = values.mobileNumber?.replace(/\s/g, '')

    store.setUserTransitionDatas(values)

    setLoading(true)
    switch (method) {
      case UserValidateMethodEnum.email:
        const emailRes = await postMemberRegisterValidEmail(values)

        if (emailRes.isOk) {
          emailRes.data?.isSuccess && link(`/register/verification?type=${method}`)
          return
        }
        setLoading(false)
        break
      case UserValidateMethodEnum.phone:
        values.mobileCountryCode = area.codeVal

        const phoneRes = await postMemberRegisterValidPhone(values)
        if (phoneRes.isOk) {
          phoneRes.data?.isSuccess && link(`/register/verification?type=${method}`)
          return
        }
        setLoading(false)
        break
      default:
        break
    }
  }

  const geeTestOnSuccess = async () => {
    setLoading(false)
    handleRegister(form.getFieldsValue())
  }

  const geeTestOnError = () => setLoading(false)

  const onSubmit = async values => {
    // if (method === UserValidateMethodEnum.phone && !isEnble) {
    //   Message.warning(t`features_user_register_flow_index_2693`)
    //   return
    // }

    if (!passwordValidate) {
      Message.warning(t`features_user_register_flow_index_2448`)
      return
    }

    if (!values.serviceAgreement) {
      Message.warning(t`features_user_register_flow_index_2450`)
      return
    }

    setLoading(true)

    /** 极验验证 */
    const account = values.email || values.mobileNumber?.replace(/\s/g, '')
    const operateType = GeeTestOperationTypeEnum.register
    geeTestInit(account, operateType, geeTestOnSuccess, geeTestOnError)
  }

  return (
    <div className={`user-register-flow user-form-style ${styles.scoped}`}>
      <div className="user-register-flow-wrap">
        <UserFormLayout
          title={t({
            id: 'user.register_07',
            values: { 0: layoutStore.headerData?.businessName },
          })}
        >
          <UserChooseVerificationMethod
            tabList={getThirdPartyAccountDisplayType}
            method={method}
            choosMethod={handleChoosMethod}
          />

          <Form
            form={form}
            layout="vertical"
            onSubmit={onSubmit}
            autoComplete="off"
            initialValues={{ serviceAgreement: false }}
            validateTrigger="onBlur"
            // onChange={handleValidateChange}
          >
            {method === UserValidateMethodEnum.email && (
              <FormItem label={t`user.safety_items_04`} field="email" requiredSymbol={false} rules={[rules.email]}>
                <Input placeholder={t`user.validate_form_02`} disabled={info.thirdPartyAccount} />
              </FormItem>
            )}

            {method === UserValidateMethodEnum.phone && (
              <FormItem
                label={t`user.validate_form_03`}
                field="mobileNumber"
                requiredSymbol={false}
                rules={[rules.phone]}
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
                        // isEnble ? (
                        <>
                          <Image preview={false} src={`${oss_area_code_image_domain_address}${area?.remark}.png`} /> +
                          {area?.codeVal}{' '}
                        </>
                        // ) : (
                        //   `-- : --`
                        // )
                      }
                    />
                  }
                />
              </FormItem>
            )}

            <FormItem
              label={t`user.validate_form_05`}
              field="loginPassword"
              requiredSymbol={false}
              formatter={FormValuesTrim}
              rules={[rules.password]}
            >
              <Input
                type={passwordShow.newPasswordShow ? 'password' : 'text'}
                maxLength={16}
                onChange={setPasswordValue}
                placeholder={t`user.validate_form_06`}
                suffix={
                  <>
                    {loginPassword && (
                      <Icon name="del_input_box" hasTheme onClick={() => handleClearPassword('loginPassword')} />
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

            <UserPasswordValidateTips
              password={FormValuesTrim(passwordValue) as string}
              validate={setPasswordValidate}
            />

            <FormItem
              label={t`user.field.reuse_12`}
              field="confirmPassword"
              requiredSymbol={false}
              formatter={FormValuesTrim}
              rules={[rules.confirmPassword]}
            >
              <Input
                type={passwordShow.confirmPasswordShow ? 'password' : 'text'}
                maxLength={16}
                placeholder={t`user.validate_form_06`}
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

            <div className="invitation-code" onClick={() => setInvitationCodeShow(!invitationCodeShow)}>
              <label>{t`user.validate_form_07`}</label>
              <Icon name={invitationCodeShow ? 'arrow_close' : 'arrow_open'} hasTheme fontSize={8} />
            </div>

            {invitationCodeShow && (
              <FormItem field="invite" style={{ marginTop: 0 }} formatter={FormValuesTrim}>
                <Input placeholder={t`user.validate_form_08`} disabled={!!invitationCode} />
              </FormItem>
            )}

            <FormItem field="serviceAgreement" requiredSymbol={false} rules={[rules.serviceAgreement]}>
              <Checkbox onChange={setCheckBoxStatus}>
                {() => {
                  return (
                    <div className="service-agreement">
                      <Icon name={`${checkBoxStatus ? 'agreement_select' : 'agreement_unselect'}`} />
                      <div className="text">
                        <label>
                          {t({
                            id: 'user.validate_form_09',
                            values: { 0: layoutStore.headerData?.businessName },
                          })}
                        </label>
                        <Link
                          href={layoutStore.columnsDataByCd?.[UserAgreementEnum.termsService]?.webUrl}
                          className="customize-link-style"
                        >
                          《{t`user.validate_form_10`}》
                        </Link>
                      </div>
                    </div>
                  )
                }}
              </Checkbox>
            </FormItem>

            <FormItem>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                // disabled={disabled || !isAccount || !loginPassword || !confirmPassword}
              >
                {t`user.validate_form_11`}
              </Button>
            </FormItem>

            <div className="login">
              <label>{t`user.field.reuse_06`}</label>{' '}
              <Link href="/login" className="customize-link-style">{t`user.field.reuse_07`}</Link>
            </div>
          </Form>
        </UserFormLayout>

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
    </div>
  )
}

export default UserRegisterFlow

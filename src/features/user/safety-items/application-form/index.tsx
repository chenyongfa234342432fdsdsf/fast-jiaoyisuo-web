import { useState, useEffect, useMemo, useRef } from 'react'
import { Button, Form, Input, Upload, Message, Select, Image, Checkbox } from '@nbit/arco'
import { RequestOptions } from '@nbit/arco/es/Upload'
import { t } from '@lingui/macro'
import UserSecretKey from '@/features/user/common/secret-key'
import UserPopUp from '@/features/user/components/popup'
import UserPopUpSuccessContent from '@/features/user/components/popup/content/success'
import UserCountDown from '@/features/user/components/count-down'
import UserSearchArea from '@/features/user/common/search-area'
import UserFormLayout from '@/features/user/common/user-form-layout'
import {
  postMemberSafeVerifyGenerateGoogleQrCode,
  postMemberSafeVerifyEmailSend,
  postMemberSafeVerifyPhoneSend,
  postMemberSafeVerifyReset,
  postMemberUpload,
} from '@/apis/user'
import { UserSendValidateCodeBusinessTypeEnum, UserKycTypeEnum, ChinaAreaCodeEnum } from '@/constants/user'
import { oss_area_code_image_domain_address } from '@/constants/oss'
import { MemberMemberAreaType } from '@/typings/user'
import { SafetyItemsApplicationFormRules, formatPhoneNumber } from '@/features/user/utils/validate'
import { useUserStore } from '@/store/user'
import Icon from '@/components/icon'
import { link } from '@/helper/link'
import styles from './index.module.css'

const FormItem = Form.Item

function UserSafetyItemsApplicationForm() {
  const [selectArea, setSelectArea] = useState<boolean>(false)
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false)
  const [uploaderImage, setUploaderImage] = useState<string>('')
  const [qrCode, setQrCode] = useState<string>('')
  const [secretKey, setSecretKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const isEmailSend = useRef<boolean>(false)
  const isPhoneSend = useRef<boolean>(false)
  // const [disabled, setDisabled] = useState<boolean>(true)
  const [area, setArea] = useState<MemberMemberAreaType>({
    codeVal: ChinaAreaCodeEnum.code,
    codeKey: t`features_user_personal_center_account_security_phone_index_2432`,
    remark: ChinaAreaCodeEnum.remark,
  })

  const store = useUserStore()
  const [form] = Form.useForm()

  const info = store.userTransitionDatas

  const rule = SafetyItemsApplicationFormRules(isEmailSend, isPhoneSend)

  const limitSize = useMemo(() => {
    const size = 5 * (1024 * 1024) // 5MB
    return size
  }, [])

  // const handleValidateChange = () => {
  //   form
  //     .validate()
  //     .then(() => setDisabled(false))
  //     .catch(() => setDisabled(true))
  // }

  const getGoogleSecretKey = async () => {
    const res = await postMemberSafeVerifyGenerateGoogleQrCode({ account: info.account })
    if (res.isOk) {
      setQrCode(res.data!.qrPath)
      setSecretKey(res.data!.secretKey)
    }
  }

  useEffect(() => {
    if (info.resetItem?.isGoogle) {
      getGoogleSecretKey()
    }
  }, [])

  const handleSelectArea = v => {
    setArea(v)
    setSelectArea(false)
  }

  const handleFileReader = async (e: ProgressEvent<FileReader>) => {
    const baseImage = e.target?.result

    const res = await postMemberUpload({ image: baseImage as string })
    if (res.isOk) {
      setUploaderImage(res.data!.url)
    }
  }

  const handleUploadImage = async (option: RequestOptions) => {
    const { file } = option

    if (file.size > limitSize) {
      Message.warning(t`features/user/safety-items/application-form/index-0`)
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = handleFileReader
  }

  const handleSendEmailValidateCode = async () => {
    const email = form.getFieldValue('email')

    if (!email) {
      Message.warning(t`features/user/safety-items/application-form/index-1`)
      return false
    }

    const res = await postMemberSafeVerifyEmailSend({
      type: UserSendValidateCodeBusinessTypeEnum.securityItemApply,
      email,
      uid: info?.userInfo?.uid,
    })

    const isTrue = (res.isOk && res.data?.isSuccess) || false
    if (isTrue) {
      isEmailSend.current = true
      Message.success(t`user.field.reuse_38`)
    }
    return isTrue
  }

  const handleSendPhoneValidateCode = async () => {
    const phone = form.getFieldValue('mobile')

    if (!phone) {
      Message.warning(t`features/user/safety-items/application-form/index-2`)
      return false
    }

    const res = await postMemberSafeVerifyPhoneSend({
      type: UserSendValidateCodeBusinessTypeEnum.securityItemApply,
      mobileCountryCode: area.codeVal,
      mobile: phone?.replace(/\s/g, ''),
      uid: info?.userInfo?.uid,
    })

    const isTrue = (res.isOk && res.data?.isSuccess) || false
    if (isTrue) {
      isPhoneSend.current = true
      Message.success(t`user.field.reuse_38`)
    }
    return isTrue
  }

  const handleWorkOrderSubmitSuccess = async () => {
    await store.removeUserTransitionDatas()
    link('/')
  }

  const onSubmit = async values => {
    setLoading(true)

    values.mobile = values.mobile?.replace(/\s/g, '')

    const options = {
      ...values,
      ...info.resetItem,
      googleSecretKey: secretKey,
      mobileCountryCode: area.codeVal,
      applyPhotoPath: uploaderImage,
      account: info.account,
      accountType: info.type,
      oldMobileCountryCode: info.mobileCountryCode,
    }

    const res = await postMemberSafeVerifyReset(options)
    res.isOk && res.data?.isSuccess && setSubmitSuccess(true)

    setLoading(false)
  }

  return (
    <div className={`user-safety-items-application-form user-form-style ${styles.scoped}`}>
      <div className="user-safety-items-application-form-wrap">
        <UserFormLayout title={t`user.safety_items_01`}>
          {info.resetItem?.isGoogle && <UserSecretKey qrcode={qrCode} secretKey={secretKey} />}

          <Form
            form={form}
            layout="vertical"
            onSubmit={onSubmit}
            validateTrigger="onBlur"
            scrollToFirstError
            // onChange={handleValidateChange}
          >
            {info.resetItem?.isGoogle && (
              <FormItem
                label={t`features_user_safety_items_application_form_index_2596`}
                field="googleVerifyCode"
                requiredSymbol={false}
                rules={[rule.googleKey]}
              >
                <Input type="number" maxLength={6} placeholder={t`user.safety_verification_05`} />
              </FormItem>
            )}

            {info.resetItem?.isEmail && (
              <>
                <FormItem label={t`user.application_form_04`} field="email" requiredSymbol={false} rules={[rule.email]}>
                  <Input placeholder={t`user.validate_form_02`} />
                </FormItem>

                <FormItem
                  label={t`user.application_form_06`}
                  field="emailVerifyCode"
                  requiredSymbol={false}
                  rules={[rule.emailCode]}
                >
                  <Input
                    type="number"
                    maxLength={6}
                    placeholder={t`user.field.reuse_20`}
                    suffix={<UserCountDown onSend={handleSendEmailValidateCode} />}
                  />
                </FormItem>
              </>
            )}

            <FormItem
              label={
                info.resetItem?.isMobile
                  ? t`features_user_safety_items_application_form_index_2597`
                  : t`features_user_safety_items_application_form_index_2598`
              }
              field="mobile"
              requiredSymbol={false}
              rules={[rule.phone]}
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
              label={t`user.field.reuse_21`}
              field="mobileVerifyCode"
              requiredSymbol={false}
              rules={[rule.phoneCode]}
            >
              <Input
                type="number"
                maxLength={6}
                placeholder={t`user.field.reuse_21`}
                suffix={<UserCountDown onSend={handleSendPhoneValidateCode} />}
              />
            </FormItem>

            {info?.kycType !== UserKycTypeEnum.notCertified && (
              <>
                <FormItem>
                  <div className="update-image">
                    <FormItem>
                      <div className="sample">
                        <Icon name="login_form_example" hasTheme />
                      </div>
                    </FormItem>

                    <FormItem field="applyPhotoPath" requiredSymbol={false} rules={[rule.photo]}>
                      <Upload className="update" showUploadList={false} customRequest={handleUploadImage}>
                        <>
                          <div className="update-wrap" style={{ backgroundImage: `url("${uploaderImage || ''}")` }}>
                            <Icon name="login_id_frame" hasTheme />
                          </div>
                          <div className="update-text">
                            {uploaderImage === '' ? (
                              <label>{t`user.application_form_14`}</label>
                            ) : (
                              <label>{t`user.application_form_15`}</label>
                            )}
                          </div>
                        </>
                      </Upload>
                    </FormItem>
                  </div>
                </FormItem>

                <div className="tips">
                  <div className="describe">
                    <Icon name="prompt-symbol" fontSize={6} />
                    <p>{t`user.application_form_08`}</p>
                  </div>
                  <div className="describe">
                    <Icon name="prompt-symbol" fontSize={6} />
                    <p>{t`user.application_form_09`}</p>
                  </div>
                  <div className="describe">
                    <Icon name="prompt-symbol" fontSize={6} />
                    <p>{t`user.application_form_10`}</p>
                  </div>
                </div>
              </>
            )}

            <FormItem
              field="serviceAgreement"
              style={{ marginBottom: 24 }}
              requiredSymbol={false}
              rules={[rule.serviceAgreement]}
            >
              <Checkbox>
                {({ checked }) => {
                  return (
                    <div className="service-agreement">
                      <Icon name={`${checked ? 'agreement_select' : 'agreement_unselect'}`} fontSize={12} />
                      <div className="text">
                        <label>{t`features_user_safety_items_application_form_index_2599`}</label>
                      </div>
                    </div>
                  )
                }}
              </Checkbox>
            </FormItem>

            <FormItem style={{ marginBottom: 0, marginTop: 0 }}>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                // disabled={disabled}
              >
                {t`user.application_form_11`}
              </Button>
            </FormItem>
          </Form>
        </UserFormLayout>
      </div>

      <UserPopUp
        className="user-popup user-popup-success"
        visible={submitSuccess}
        closeIcon={<Icon name="close" hasTheme />}
        onCancel={handleWorkOrderSubmitSuccess}
        footer={
          <Button type="primary" onClick={handleWorkOrderSubmitSuccess}>
            {t`features_user_safety_items_application_form_index_adtnks7d43`}
          </Button>
        }
      >
        <UserPopUpSuccessContent
          slotContent={<p>{t`user.application_form_12`}</p>}
          icon={
            <div className="register-icon">
              <Icon name="sign_complete" hasTheme isRemoteUrl />
            </div>
          }
        />
      </UserPopUp>

      <UserPopUp
        title={<div style={{ textAlign: 'left' }}>{t`user.search_area_04`}</div>}
        className="user-popup"
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

export default UserSafetyItemsApplicationForm

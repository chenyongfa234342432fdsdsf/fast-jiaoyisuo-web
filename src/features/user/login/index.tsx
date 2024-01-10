import { useState, useRef, useEffect } from 'react'
import { useMount } from 'react-use'
import Lottie from 'lottie-react'
import { t } from '@lingui/macro'
import Link from '@/components/link'
import { link } from '@/helper/link'
import { Button, Form, Input, Select, Image, Message } from '@nbit/arco'
import { useCountDown, useRequest, useUnmount } from 'ahooks'
import { QRCodeCanvas } from 'qrcode.react'
import LazyImage, { Type } from '@/components/lazy-image'
import {
  UserValidateMethodEnum,
  UserVerifyTypeEnum,
  GeeTestOperationTypeEnum,
  // UserEnabledStateTypeEnum,
  UserUpsAndDownsColorEnum,
  ChinaAreaCodeEnum,
} from '@/constants/user'
import UserChooseVerificationMethod from '@/features/user/common/choose-verification-method'
import UserSearchArea from '@/features/user/common/search-area'
import UserPopUp from '@/features/user/components/popup'
import UserPopupTipsContent from '@/features/user/components/popup/content/tips'
import UserFormHeader from '@/features/user/common/user-form-layout/header'
import { MemberMemberAreaType } from '@/typings/user'
import { oss_area_code_image_domain_address, oss_svg_image_domain_address } from '@/constants/oss'
import { LoginValidateRules, formatPhoneNumber } from '@/features/user/utils/validate'
import {
  postMemberLoginQrcode,
  postMemberLoginScan,
  postMemberLoginEmail,
  postMemberLoginByUid,
  postMemberLoginPhone,
  getMemberAreaIp,
} from '@/apis/user'
import { getBrowser, getOperationSystem, IsAccountType, FormValuesTrim } from '@/features/user/utils/common'
import { useGeeTestBind } from '@/features/user/common/geetest'
import { setToken } from '@/helper/auth'
import { useUserStore } from '@/store/user'
import { toKenTtlDefaultValue } from '@/constants/auth'
import { usePageContext } from '@/hooks/use-page-context'
import { useLayoutStore } from '@/store/layout'
import jsonData from '@/assets/json/scan-code-bubble.json'
import Icon from '@/components/icon'
import SignInWith from '@/features/user/login/component/sign-in-with'
import styles from './index.module.css'

const FormItem = Form.Item

interface qrCodeLoginInfoType {
  /** 登录信息 */
  loginInfo: string
  /** 验证扫码登录 */
  qrCode: string
}

function UserLogin() {
  // const [isEnble, setIsEnble] = useState<boolean>(true)
  const [area, setArea] = useState<MemberMemberAreaType>({
    codeVal: ChinaAreaCodeEnum.code,
    codeKey: t`features_user_personal_center_account_security_phone_index_2432`,
    remark: ChinaAreaCodeEnum.remark,
  })
  const [visible, setVisible] = useState<boolean>(false)
  const [method, setMethod] = useState<string>(UserValidateMethodEnum.email)
  const [passwordShow, setPasswordShow] = useState<boolean>(false)
  const [targetDate, setTargetDate] = useState<number>()
  const [qrcodeShow, setQrCodeShow] = useState<boolean>(true)
  const [qrcodeButtonDisabled, setQrcodeButtonDisabled] = useState<boolean>(false)
  const [qrCodeLoginText, setQrCodeLoginText] = useState<string>(t`user.login_08`)
  const [resePasswordPopUpTips, setResePasswordPopUpTips] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  // const [disabled, setDisabled] = useState<boolean>(true)
  const qrCodeLoginInfo = useRef<qrCodeLoginInfoType>()

  const [qrcodeInfo, setQrCodeInfo] = useState<qrCodeLoginInfoType>()

  const geeTestInit = useGeeTestBind()
  const store = useUserStore()
  const pageContext = usePageContext()

  const [form] = Form.useForm()
  const email = Form.useWatch('email', form)
  const mobile = Form.useWatch('mobile', form)
  // const password = Form.useWatch('password', form)

  const { redirect } = pageContext.urlParsed.search
  const { searchOriginal } = pageContext.urlParsed
  const isAccount = email || mobile

  const { tokenTtl } = store.personalCenterSettings

  const rule = LoginValidateRules()

  const getAreaIp = async () => {
    const res = await getMemberAreaIp({})
    if (res.isOk) {
      const { enCode, fullName, shortName } = res.data

      setArea({
        codeVal: enCode,
        codeKey: fullName,
        remark: shortName,
      })

      // res.data.enableInd === UserEnabledStateTypeEnum.unEnable ? setIsEnble(false) : setIsEnble(true)
    }
  }

  const getQrCode = async () => {
    const browser = getBrowser()
    const system = getOperationSystem()
    const deviceName = `${browser} (${system})`
    const res = await postMemberLoginQrcode({ deviceName })
    if (res.isOk) {
      qrCodeLoginInfo.current = res.data
      setQrCodeInfo(res.data)
    }
  }

  const haveTheQrCodeLogin = async () => {
    const res = await postMemberLoginScan({ qrCode: qrCodeLoginInfo.current?.qrCode, tokenTtl })
    if (res.isOk && res.data) {
      if (res.data.token === null && !res.data.isWaiting) {
        setQrcodeButtonDisabled(true)
        setQrCodeShow(false)
        setQrCodeLoginText(t`features_user_login_index_2694`)
        return
      }

      if (res.data.token) {
        setToken(res.data)
        store.setUserInfo({ ...res.data?.userInfo, ...res.data?.usrMemberSettingsVO })
        store.setMemberBaseColor(
          res.data?.usrMemberSettingsVO?.marketSetting || UserUpsAndDownsColorEnum.greenUpRedDown
        )
        store.setLogin(true)
        redirect ? link(redirect) : link('/')
      }
    }
  }

  const { run, cancel } = useRequest(haveTheQrCodeLogin, {
    pollingInterval: 5000,
    manual: true,
  })

  const handleCountDown = async () => {
    await getQrCode()
    setQrCodeLoginText(t`user.login_05`)
    setQrCodeShow(true)
    setTargetDate(60 * 1000)
    run()
  }

  useCountDown({
    leftTime: targetDate,
    onEnd: () => {
      setQrCodeLoginText(t`user.login_05`)
      setQrcodeButtonDisabled(false)
      setQrCodeShow(false)
      setTargetDate(0)
      cancel()
    },
  })

  useMount(handleCountDown)
  useMount(getAreaIp)

  useUnmount(cancel)

  useEffect(() => {
    if (store.isLogin && cancel && !targetDate) {
      cancel()
    }
  }, [store.isLogin, targetDate])

  // const handleValidateChange = () => {
  //   form
  //     .validate()
  //     .then(() => setDisabled(false))
  //     .catch(() => setDisabled(true))
  // }

  const handleChoosMethod = (type: string) => {
    setMethod(type)
    // setDisabled(true)
    form.clearFields()
  }

  const handleSelectArea = (v: MemberMemberAreaType) => {
    // if (v.enableInd === UserEnabledStateTypeEnum.enable) setIsEnble(true)
    setArea(v)
    setVisible(false)
  }

  const handleLoginSuccess = async (res, values) => {
    if (res.isOk && res.data.isSuccess) {
      const cacheData = {
        ...values,
        ...res.data,
      }
      await store.setUserTransitionDatas(cacheData)

      redirect ? link(`/safety-verification${searchOriginal || `?redirect=${redirect}`}`) : link('/safety-verification')
      return
    }

    setLoading(false)
  }

  const handleLogin = async values => {
    values.tokenTtl = tokenTtl || toKenTtlDefaultValue

    setLoading(true)
    switch (method) {
      case UserValidateMethodEnum.email:
        const isAccountType = IsAccountType(values.email)
        values.accountType = isAccountType

        if (!isAccountType) {
          setLoading(false)
          Message.warning(t`features/user/retrieve/index-0`)
          return
        }

        if (isAccountType === UserVerifyTypeEnum.email) {
          const res = await postMemberLoginEmail(values)
          handleLoginSuccess(res, values)
        }

        if (isAccountType === UserVerifyTypeEnum.uid) {
          const res = await postMemberLoginByUid({ ...values, uid: values.email })
          handleLoginSuccess(res, values)
        }
        break
      case UserValidateMethodEnum.phone:
        values.mobileCountryCode = area.codeVal
        values.accountType = UserVerifyTypeEnum.phone
        values.mobile = values.mobile?.replace(/\s/g, '')

        const res = await postMemberLoginPhone(values)
        handleLoginSuccess(res, values)
        break
      default:
        break
    }
  }

  const handlelRetrieve = () => {
    cancel()
    link('/retrieve')
  }

  const geeTestOnSuccess = async () => {
    setLoading(false)
    handleLogin(form.getFieldsValue())
  }

  const geeTestOnError = () => setLoading(false)

  const onSubmit = async () => {
    // if (method === UserValidateMethodEnum.phone && !isEnble) {
    //   Message.warning(t`features_user_register_flow_index_2693`)
    //   return
    // }

    setLoading(true)

    /** 极验验证 */
    const operateType = GeeTestOperationTypeEnum.login
    const account = isAccount?.replace(/\s/g, '')
    geeTestInit(account, operateType, geeTestOnSuccess, geeTestOnError)
  }
  const { headerData } = useLayoutStore()

  return (
    <div className={`user-login user-form-style ${styles.scoped}`}>
      <UserFormHeader
        title={t({
          id: 'features_user_login_index_5101321',
          values: { 0: headerData?.businessName },
        })}
      />

      <div className="user-login-wrap">
        <div className="form">
          <UserChooseVerificationMethod
            tabList={[
              { title: t`features/user/personal-center/settings/payment/add/index-6`, id: 'email' },
              { title: t`user.validate_form_03`, id: 'phone' },
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
              <FormItem label={t`user.validate_form_01`} field="email" rules={[rule.account]} requiredSymbol={false}>
                <Input placeholder={t`features_user_login_index_2604`} />
              </FormItem>
            )}

            {method === UserValidateMethodEnum.phone && (
              <FormItem
                label={t`user.validate_form_03`}
                field="mobile"
                rules={[rule.phone]}
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
              field="password"
              formatter={FormValuesTrim}
              rules={[rule.password]}
              requiredSymbol={false}
            >
              <Input
                type={passwordShow ? 'text' : 'password'}
                placeholder={t`user.validate_form_06`}
                suffix={
                  <Icon
                    name={passwordShow ? 'eyes_open' : 'eyes_close'}
                    hasTheme
                    onClick={() => setPasswordShow(!passwordShow)}
                  />
                }
              />
            </FormItem>

            <FormItem style={{ marginBottom: 0 }}>
              <Button
                loading={loading}
                type="primary"
                htmlType="submit"
                // disabled={disabled || password}
              >
                {t`user.field.reuse_07`}
              </Button>
            </FormItem>
          </Form>

          <SignInWith />

          <div className="register-or-retrieve">
            <div className="register">
              <Link href="/register" className="customize-link-style" prefetch>
                {t`user.login_02`}
              </Link>
            </div>

            <div className="retrieve">
              <label onClick={() => setResePasswordPopUpTips(true)}>{t`user.login_03`}</label>
            </div>
          </div>
        </div>
        <div className="qrcode">
          <div className="container">
            <div className="code">
              <QRCodeCanvas style={{ width: '100%', height: '100%' }} value={qrcodeInfo?.loginInfo || ''} />

              {!qrcodeShow && (
                <>
                  <div className="mask"></div>
                  <div className="refresh">
                    <Button type="primary" onClick={handleCountDown} disabled={qrcodeButtonDisabled}>
                      {qrCodeLoginText}
                    </Button>
                  </div>
                </>
              )}
            </div>
            <div className="image">
              <LazyImage
                src={`${oss_svg_image_domain_address}scanqr_tips`}
                imageType={Type.png}
                hasTheme
                whetherPlaceholdImg={false}
              />
              <div className="animation">
                <Lottie animationData={jsonData} width={36} height={36} />
              </div>
            </div>
          </div>
          <div className="text">
            <label>
              {t`features_user_login_index_5101344`}{' '}
              <span>
                {t({
                  id: 'user.login_07',
                  values: { 0: headerData?.businessName },
                })}
              </span>{' '}
              {t`features_user_login_index_5101345`}
            </label>
          </div>
        </div>
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

      <UserPopUp
        className="user-popup user-popup-tips"
        autoFocus={false}
        visible={resePasswordPopUpTips}
        closeIcon={<Icon name="close" hasTheme />}
        okText={t`features_user_login_index_5101198`}
        cancelText={t`user.field.reuse_09`}
        onOk={handlelRetrieve}
        onCancel={() => setResePasswordPopUpTips(false)}
      >
        <UserPopupTipsContent
          slotContent={
            <p>
              {t`features_user_login_index_5101199`} <label>{t`user.account_security.google_05`}</label>{' '}
              {t`features_user_login_index_5101200`}
            </p>
          }
        />
      </UserPopUp>
    </div>
  )
}

export default UserLogin

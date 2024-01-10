import { useState, useEffect, useRef, useMemo } from 'react'
import { Button, Checkbox, Form, Message } from '@nbit/arco'
import { t } from '@lingui/macro'
import { link } from '@/helper/link'
import UserTipsInfo from '@/features/user/common/tips-info'
import UserFormLayout from '@/features/user/common/user-form-layout'
import { getIsLogin } from '@/helper/auth'
import { useUserStore } from '@/store/user'
import {
  UserValidateMethodEnum,
  UserEnabledStateTypeEnum,
  UserVerifyTypeEnum,
  GeeTestOperationTypeEnum,
} from '@/constants/user'
import { postMemberVerifyByAccoun } from '@/apis/user'
import { MemberVerifyMemberByAccounResp, MemberVerifyMemberByAccounReq } from '@/typings/user'
import { useGeeTestBind } from '@/features/user/common/geetest'
import Icon from '@/components/icon'
import styles from './index.module.css'

const CheckboxGroup = Checkbox.Group

function UserSafetyItems() {
  const [options, setOptions] = useState<Array<string>>([])
  const [userInfo, setUserInfo] = useState<MemberVerifyMemberByAccounResp>()
  const [loading, setLoading] = useState<boolean>(false)
  const data = useRef<MemberVerifyMemberByAccounReq>()

  const store = useUserStore()
  const isLogin = getIsLogin()
  const geeTestInit = useGeeTestBind()
  const [form] = Form.useForm()

  const info = useMemo(() => {
    return isLogin ? store.userInfo : store.userTransitionDatas
  }, [])

  const getVerifyByAccoun = async () => {
    const type = isLogin
      ? info.isBindEmailVerify === UserEnabledStateTypeEnum.enable
        ? UserVerifyTypeEnum.email
        : UserVerifyTypeEnum.phone
      : info.accountType

    data.current = {
      type,
      account:
        type === UserVerifyTypeEnum.phone
          ? info.mobile || info.mobileNumber
          : type === UserVerifyTypeEnum.email
          ? info.email
          : info.uid || info.userInfo.uid,
      mobileCountryCode: info.mobileCountryCode || info.mobileCountryCd,
    }

    const res = await postMemberVerifyByAccoun(data.current)
    if (res.isOk) {
      setUserInfo({ ...info, ...res.data })
    }
  }

  useEffect(() => {
    getVerifyByAccoun()
  }, [])

  const handleTransitionData = async () => {
    const resetItem = {
      isEmail: options.includes(UserValidateMethodEnum.email),
      isMobile: options.includes(UserValidateMethodEnum.phone),
      isGoogle: options.includes(UserValidateMethodEnum.validator),
    }

    const cacheInfo = isLogin ? { ...store.userInfo } : {}
    const cacheData = {
      ...cacheInfo,
      ...data.current,
      resetItem,
      kycType: userInfo?.kycType,
    }

    await store.setUserTransitionDatas(cacheData)

    link('/safety-items/application-form')
  }

  const geeTestOnSuccess = async () => {
    setLoading(false)
    handleTransitionData()
  }

  const geeTestOnError = () => setLoading(false)

  const onSubmit = async () => {
    if (options.length < 1) {
      Message.warning(t`features_user_safety_items_index_5101197`)
      return
    }

    setLoading(true)

    /** 极验验证 */
    const account = data.current?.account as string
    const operateType = GeeTestOperationTypeEnum.resetSecurity
    geeTestInit(account, operateType, geeTestOnSuccess, geeTestOnError)
  }

  return (
    <div className={`user-safety-items ${styles.scoped}`}>
      <div className="user-safety-items-wrap">
        <UserFormLayout title={t`user.safety_items_01`}>
          <UserTipsInfo slotContent={<p>{t`user.safety_items_08`}</p>} />
          <div className="checked-box">
            <Form form={form} layout="vertical" onSubmit={onSubmit}>
              <CheckboxGroup onChange={(v: string[]) => setOptions(v)}>
                {userInfo?.isOpenGoogleVerify === UserEnabledStateTypeEnum.enable && (
                  <Checkbox value="validator">
                    {({ checked }) => {
                      return (
                        <div className="items">
                          <div className="icon">
                            {checked ? (
                              <Icon name="login_verify_selected" />
                            ) : (
                              <Icon name="login_verify_unselected" hasTheme />
                            )}
                          </div>
                          <div className="text">
                            <label>{t`features_user_safety_items_index_2555`}</label>
                          </div>
                        </div>
                      )
                    }}
                  </Checkbox>
                )}

                {userInfo?.isOpenEmailVerify === UserEnabledStateTypeEnum.enable && (
                  <Checkbox value="email">
                    {({ checked }) => {
                      return (
                        <div className="items">
                          <div className="icon">
                            {checked ? (
                              <Icon name="login_verify_selected" />
                            ) : (
                              <Icon name="login_verify_unselected" hasTheme />
                            )}
                          </div>
                          <div className="text">
                            <label>
                              {t`user.safety_items_04`} {userInfo.email as string} {t`user.safety_items_03`}
                            </label>
                          </div>
                        </div>
                      )
                    }}
                  </Checkbox>
                )}

                {userInfo?.isOpenPhoneVerify === UserEnabledStateTypeEnum.enable && (
                  <Checkbox value="phone">
                    {({ checked }) => {
                      return (
                        <div className="items">
                          <div className="icon">
                            {checked ? (
                              <Icon name="login_verify_selected" />
                            ) : (
                              <Icon name="login_verify_unselected" hasTheme />
                            )}
                          </div>
                          <div className="text">
                            <label>
                              {t`user.safety_items_02`} {`+${userInfo.mobileCountryCd}`}{' '}
                              {userInfo.mobileNumber as string} {t`user.safety_items_05`}
                            </label>
                          </div>
                        </div>
                      )
                    }}
                  </Checkbox>
                )}
              </CheckboxGroup>

              <Button
                loading={loading}
                type="primary"
                // disabled={options.length < 1}
                htmlType="submit"
              >
                {t`user.safety_items_07`}
              </Button>
            </Form>
          </div>
        </UserFormLayout>
      </div>
    </div>
  )
}

export default UserSafetyItems

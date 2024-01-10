import { MutableRefObject } from 'react'
import { t } from '@lingui/macro'

const emailExp = /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/
const cnExp = /[\u4e00-\u9fa5]/g

const accountValidate = () => {
  return {
    required: true,
    validator: (value: string | undefined, cb) => {
      const regExp = /@/g
      const isEmail = value && value.match(regExp)
      if (!value) return cb(t`features_user_login_index_2604`)
      if (cnExp.test(value)) return cb(t`features_user_utils_validate_2695`)
      if (isEmail && !emailExp.test(value)) {
        return cb(t`features_user_utils_validate_2695`)
      }
      return cb()
    },
  }
}

export const emailValidate = () => {
  return {
    required: true,
    validator: (value: string | undefined, cb) => {
      if (!value) return cb(t`user.validate_form_02`)
      if (value && !emailExp.test(value)) {
        return cb(t`features_user_utils_validate_2556`)
      }
      return cb()
    },
  }
}

const phoneValidate = () => {
  return {
    required: true,
    validator: (value, cb) => {
      if (!value) {
        return cb(t`features_agent_utils_validate_ag_3oloifriddaw0xyzzy`)
      }

      const { inputVal = '', selectVal = '' } = value

      if (!selectVal && inputVal) return cb(t`features_user_country_select_index_2593`)
      if (!inputVal) return cb(t`user.field.reuse_11`)
      if (inputVal && !/^\d+$/.test(inputVal)) {
        return cb(t`features_user_utils_validate_2696`)
      }
      return cb()
    },
  }
}

const verificationCode = (senVerificationCode?: MutableRefObject<boolean>) => {
  return {
    required: true,
    validator: (value: string | undefined, cb) => {
      if (!value) return cb(t`features_user_utils_validate_5101195`)
      if (senVerificationCode && !senVerificationCode?.current) return cb(t`features_user_utils_validate_5101213`)
      if (value && value.length < 6) {
        return cb(t`features_user_utils_validate_2697`)
      }

      return cb()
    },
  }
}

const passwordValidate = (isVerifyNull?: boolean, isLogin?: boolean) => {
  return {
    required: true,
    validator: (value: string | undefined, cb) => {
      if (!value) return cb(t`user.validate_form_06`)
      if (cnExp.test(value) && isLogin) return cb(t`features_user_utils_validate_5101201`)
      if ((value && value.length < 8) || (value && value.length > 16)) {
        return isVerifyNull ? cb(t`features_user_utils_validate_5101196`) : cb(' ')
      }

      return cb()
    },
  }
}

const confirmPasswordValidate = (password: string) => {
  return {
    required: true,
    validator: (value: string | undefined, cb) => {
      if (!value) return cb(t`features_user_personal_center_account_security_transaction_password_index_2436`)
      if (value && value !== password) {
        return cb(t`features_user_personal_center_account_security_transaction_password_index_2436`)
      }

      return cb()
    },
  }
}

const antiPhishingCodeValidate = () => {
  return {
    required: true,
    validator: (value: string | undefined, cb) => {
      if (!value) return cb(t`user.account_security.anti_phishing_02`)
      if (value && value.length < 4) {
        return cb(t`features_user_utils_validate_2698`)
      }

      return cb()
    },
  }
}

const serviceAgreementValidate = () => {
  return {
    required: true,
    validator: (value: boolean | undefined, cb) => {
      if (!value) {
        return cb(t`user.form.validation_11`)
      }

      return cb()
    },
  }
}

const nickNameValidate = () => {
  return {
    require: true,
    validator: (value: string | undefined, cb) => {
      if (!value) {
        return cb(t`features_user_utils_validate_5101341`)
      }
      if ((value && value.length < 2) || (value && value.length > 12)) {
        return cb(t`features_user_utils_validate_2699`)
      }
      return cb()
    },
  }
}

/** 登录 */
export const LoginValidateRules = () => {
  return {
    account: accountValidate(),
    phone: phoneValidate(),
    password: passwordValidate(true, true),
  }
}

/** 个人中心 - 邮箱 */
export const PersonalCenterEmailRules = (isEmailSend: MutableRefObject<boolean>) => {
  return {
    email: emailValidate(),
    emailCode: verificationCode(isEmailSend),
  }
}

/** 个人中心 - 谷歌 */
export const PersonalCenterGoogleRules = () => {
  return {
    googleKey: verificationCode(),
  }
}

/** 个人中心 - 手机 */
export const PersonalCenterPhoneRules = (isPhoneSend: MutableRefObject<boolean>) => {
  return {
    phone: phoneValidate(),
    phoneCode: verificationCode(isPhoneSend),
  }
}

/** 个人中心 - 修改密码 */
export const PersonalCenterModifyPasswordRules = (password: string) => {
  return {
    oldPassword: {
      required: true,
      message: t`user.form.validation_07`,
    },
    password: passwordValidate(),
    confirmPassword: confirmPasswordValidate(password),
  }
}

/** 个人中心 - 修改昵称 */
export const PersonalCenterModifyUsernameRules = () => {
  return {
    nickName: nickNameValidate(),
  }
}

/** 个人中心 - 设置 */
export const PersonalCenterSettingsRules = () => {
  return {
    currency: {
      required: true,
      message: t`user.account_security.settings_06`,
    },
    upsAndDownsColor: {
      required: true,
      message: t`user.account_security.settings_07`,
    },
    language: {
      require: true,
      message: t`features/user/utils/validate-1`,
    },
  }
}

/** 注册 - 账户信息 */
export const RegisterFlowRules = (password: string) => {
  return {
    email: emailValidate(),
    phone: phoneValidate(),
    password: passwordValidate(true),
    confirmPassword: confirmPasswordValidate(password),
    serviceAgreement: serviceAgreementValidate(),
  }
}

/** 注册 - 验证 */
export const RegisterVerificationRules = (
  isEmailSend: MutableRefObject<boolean>,
  isPhoneSend: MutableRefObject<boolean>
) => {
  return {
    emailCode: verificationCode(isEmailSend),
    phoneCode: verificationCode(isPhoneSend),
  }
}

/** 重置密码 */
export const RetrieveRestPasswordRules = (
  password: string,
  isEmailSend: MutableRefObject<boolean>,
  isPhoneSend: MutableRefObject<boolean>
) => {
  return {
    password: passwordValidate(),
    confirmPassword: confirmPasswordValidate(password),
    emailCode: verificationCode(isEmailSend),
    phoneCode: verificationCode(isPhoneSend),
  }
}

/** 重置密码 - 验证方式 */
export const RetrieveValidateRules = () => {
  return {
    email: emailValidate(),
    phone: phoneValidate(),
    password: passwordValidate(),
  }
}

/** 安全验证 */
export const SafetyItemsApplicationFormRules = (
  isEmailSend: MutableRefObject<boolean>,
  isPhoneSend: MutableRefObject<boolean>
) => {
  return {
    googleKey: verificationCode(),
    email: emailValidate(),
    emailCode: verificationCode(isEmailSend),
    phone: phoneValidate(),
    phoneCode: verificationCode(isPhoneSend),
    photo: {
      required: true,
      message: t`user.form.validation_13`,
    },
    serviceAgreement: serviceAgreementValidate(),
  }
}

/** 安全验证 - 验证方式 */
export const SafetyVerificationRules = (
  isEmailSend: MutableRefObject<boolean>,
  isPhoneSend: MutableRefObject<boolean>
) => {
  return {
    emailCode: verificationCode(isEmailSend),
    googleKey: verificationCode(),
    phoneCode: verificationCode(isPhoneSend),
  }
}

/** 防钓鱼码 */
export const AntiPhishingCodeRules = () => {
  return {
    antiPhishingCode: antiPhishingCodeValidate(),
  }
}

/** 通用安全验证 */
export const UniversalSecurityVerificationRules = (
  isEmailSend: MutableRefObject<boolean>,
  isPhoneSend: MutableRefObject<boolean>
) => {
  return {
    fundPassword: {
      required: true,
      message: t`user.universal_security_verification_12`,
    },
    emailCode: verificationCode(isEmailSend),
    googleKey: verificationCode(),
    phoneCode: verificationCode(isPhoneSend),
  }
}

/** 添加 C2C 付款方式 */
export const UserSettingsAddPaymentRules = () => {
  return {
    name: {
      required: true,
      message: t`features/user/utils/validate-0`,
    },
    account: {
      required: true,
      message: t`user.form.validation_12`,
    },
    bankCardNumber: {
      required: true,
      message: t`features/user/utils/validate-2`,
    },
    bankName: {
      required: true,
      message: t`features/user/utils/validate-3`,
    },
    capitalPwd: {
      required: true,
      message: t`user.universal_security_verification_12`,
    },
  }
}

/** 添加 C2C 付款方式 */
export const UserSettingsApiRules = () => {
  return {
    remark: {
      required: true,
      message: t`features/user/utils/validate-4`,
    },
    types: {
      required: true,
      message: t`features/user/utils/validate-5`,
    },
  }
}

/** 代理商 - 提交申请代理商 */
export const AgentJoinRules = () => {
  return {
    email: emailValidate(),
    phone: phoneValidate(),
    socialMedia: {
      require: true,
      validator: (value, cb) => {
        if (!value) {
          return cb(t`features_agent_join_index_jt_e1w2md3uqcbf4urgyc`)
        }

        const { inputVal = '', selectVal = '' } = value

        if (!selectVal) {
          return cb(t`features_agent_join_index_jt_e1w2md3uqcbf4urgyc`)
        }

        if (!inputVal) {
          return cb(t`features_agent_join_index_fxy85auu4rtheyh6n1vz4`)
        }
        return cb()
      },
    },
    spot: {
      required: true,
      validator: (value: string | undefined, cb) => cb(),
    },
    contract: {
      required: true,
      validator: (value: string | undefined, cb) => cb(),
    },
    borrowCoin: {
      required: true,
      validator: (value: string | undefined, cb) => cb(),
    },
    userNumber: {
      require: true,
      validator: (value: string | undefined, cb) => {
        if (!value || (value && !(+value > 0))) {
          return cb(t`features_agent_utils_validate_fsnv_j4kknbs0mccrnllh`)
        }
        return cb()
      },
    },
  }
}

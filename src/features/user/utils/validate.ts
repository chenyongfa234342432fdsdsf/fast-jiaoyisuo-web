import { MutableRefObject } from 'react'
import { MinAndMaxTypeEnum, ChinaAreaCodeEnum, UserPhoneSliceNumEnum } from '@/constants/user'
import dayjs from 'dayjs'
import { t } from '@lingui/macro'

const emailExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const cnExp = /[\u4e00-\u9fa5]/g
const twoDecimalPlacesExp = /^([0-9]|[1-9]\d+)(\.\d{0,2})?$/

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

const emailValidate = () => {
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
    validator: (value: string | undefined, cb) => {
      if (!value) return cb(t`user.field.reuse_11`)
      if (value && value.length < 8) {
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

/** 判断有对应关系的两个值，其中一个是否有空值 */
export const IsEmptyValidate = (targetValue: number | string, message: string) => {
  return {
    require: true,
    validator: (value, cb) => {
      if (!value && value !== 0 && targetValue) {
        return cb(message)
      }

      return cb()
    },
  }
}

const marginCallValidate = (quantity: MutableRefObject<string>) => {
  return {
    require: true,
    validator: (value: string | undefined, cb) => {
      if (Number(value) > Number(quantity.current)) {
        return cb(t`features_user_utils_validate_5101578`)
      }
      return cb()
    },
  }
}

/** 数值比大小 */
export const ThanSizeValidate = (targetValue: number, mode: number, message: string) => {
  return {
    require: true,
    validator: (value, cb) => {
      const isTrue = mode === MinAndMaxTypeEnum.min ? value < targetValue : value > targetValue
      return isTrue ? cb(message) : cb()
    },
  }
}

/** 数值比大小不能相等 */
export const ThanSizeEqualValidate = (targetValue: number, mode: number, message: string) => {
  return {
    require: true,
    validator: (value, cb) => {
      const isTrue = mode === MinAndMaxTypeEnum.min ? value <= targetValue : value >= targetValue
      return isTrue ? cb(message) : cb()
    },
  }
}

/** 日期数值比大小 */
export const DateThanSizeValidate = (targetValue: string, mode: number, message: string) => {
  return {
    require: true,
    validator: (value, cb) => {
      const isTrue =
        mode === MinAndMaxTypeEnum.min
          ? dayjs(value).valueOf() < dayjs(targetValue).valueOf()
          : dayjs(value).valueOf() > dayjs(targetValue).valueOf()
      return isTrue ? cb(message) : cb()
    },
  }
}

/** 判断是否保留两位数的小数点 */
export const TwoDecimalPlaces = () => {
  return {
    require: true,
    validator: (value, cb) => {
      if (value && !twoDecimalPlacesExp.test(value)) {
        return cb(t`features_user_utils_validate_5101600`)
      }
      return cb()
    },
  }
}

export function formatPhoneNumber(numbers: string | undefined, formatMode: string) {
  if (!numbers) return numbers

  const purePhone = numbers.replace(/\D/g, '')
  const { length } = purePhone

  const num = formatMode === ChinaAreaCodeEnum.code ? UserPhoneSliceNumEnum.chinaNum : UserPhoneSliceNumEnum.defaultNum

  const sliceNum =
    formatMode === ChinaAreaCodeEnum.code ? UserPhoneSliceNumEnum.chinaSliceNum : UserPhoneSliceNumEnum.defaultSliceNum

  if (length <= num) {
    return purePhone
  } else if (length <= sliceNum) {
    const regex = new RegExp(`(\\d{${num}})(\\d{0,4})`)
    return purePhone.replace(regex, '$1 $2')
  } else {
    const firstPart = purePhone.slice(0, num)
    const middlePart = purePhone.slice(num, sliceNum)
    const lastPart = purePhone.slice(sliceNum)
    const formatLastPart = lastPart.replace(/(\d{4})/g, '$1 ')
    const formattedPhone = `${firstPart} ${middlePart} ${formatLastPart}`

    return formattedPhone.trim()
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

/** 追加保证金币种 */
export const ContractMarginCallRules = (quantity: MutableRefObject<string>) => {
  return {
    marginCall: marginCallValidate(quantity),
  }
}

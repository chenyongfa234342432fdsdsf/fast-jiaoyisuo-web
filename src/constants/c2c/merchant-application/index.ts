import { t } from '@lingui/macro'

export const c2cOssImgMaNameMap = {
  ma_bg_contact: 'ma_bg_contact',
  ma_bg_icon: 'ma_bg_icon',
  ma_bg_star: 'ma_bg_star',
  ma_contact: 'ma_contact',
  ma_header_bg: 'ma_header_bg',
  ma_header_logo: 'ma_header_logo',
  ma_star: 'ma_star',
  ma_title_dot: 'ma_title_dot',
  ma_title_rectangle: 'ma_title_rectangle',
  c2c_hand_held: 'c2c_hand_held',
  c2c_upload_video: 'c2c_upload_video',
  ma_replace: 'ma_replace.png',
  ma_msg_icon: 'ma_msg_icon',
  ma_msg_succeed_icon: 'ma_msg_succeed_icon',
}

export enum SendEmailApiTypeEnum {
  Register = 1,
  Login = 2,
  Withdraw = 3,
  ModifyPassword = 4,
  CommonVerificationBeforeModifyingEmail = 5,
  CommonVerificationBeforeClosingEmail = 6,
  ModifyPhoneNumber = 7,
  BindPhoneNumber = 8,
  CommonVerificationBeforeModifyingPhoneNumber = 9,
  CommonVerificationBeforeClosingPhoneNumber = 10,
  ResetSecurityVerification = 13,
  MerchantRegister = 21,
}

export enum C2cMaUserCurrentStatusEnum {
  applying = 'applying',
  enable = 'enable',
  none = 'none',
  apply_blacklist = 'apply_blacklist',
  terminating = 'terminating',
  terminated = 'terminated',
  disable = 'disable',
}

export enum C2cMaUserDismissingStateEnum {
  hasOnlineAd,
}

// same as H5
export enum C2cKycLevelStrEnum {
  NONE = 'NONE',
  ELEMENTARY = 'ELEMENTARY',
  SENIOR = 'SENIOR',
  ENTERPRISE = 'ENTERPRISE',
}
export const C2cKycLevelNumberEnum = {
  [C2cKycLevelStrEnum.NONE]: 1,
  [C2cKycLevelStrEnum.ELEMENTARY]: 2,
  [C2cKycLevelStrEnum.SENIOR]: 3,
  [C2cKycLevelStrEnum.ENTERPRISE]: 4,
}

export function getC2cKycLevelStrEnumName(value: C2cKycLevelStrEnum) {
  return {
    [C2cKycLevelStrEnum.NONE]: t`user.personal_center_03`,
    [C2cKycLevelStrEnum.ELEMENTARY]: t`features_user_person_application_index_2651`,
    [C2cKycLevelStrEnum.SENIOR]: t`features_kyc_kyc_header_index_5101171`,
    [C2cKycLevelStrEnum.ENTERPRISE]: t`features/user/personal-center/profile/index-17`,
  }[value]
}

import request, { MarkcoinRequest } from '@/plugins/request'
import {
  MemberTokenResp,
  MemberSuccessResp,
  MemberRegisterEmailReq,
  MemberRegisterPhoneReq,
  MemberRegisterGoogleReq,
  MemberRegisterAppleReq,
  MemberLoginEmailReq,
  MemberLoginPhoneReq,
  MemberLoginUidReq,
  MemberLoginGoogleReq,
  MemberLoginAppleReq,
  MemberSafePhoneBindReq,
  MemberSafeEmailBindReq,
  MemberSafeGoogleBindReq,
  MemberSafeGoogleStatusReq,
  MemberSafePhoneStatusReq,
  MemberSafeEmailStatusReq,
  MemberSafeVerifyPhoneSendReq,
  MemberSafeVerifyEmailSendReq,
  MemberSafeVerifyPhoneCheck,
  MemberSafeVerifyEmailCheck,
  MemberSafeVerifyGoogleCheck,
  MemberSafePasswordReq,
  MemberSafeResetPasswordReq,
  MemberSafeVerifyGoogleSecretKeyReq,
  MemberSafeVerifyGoogleSecretKeyResp,
  MemberBaseGetPhishingCodeReq,
  MemberBaseGetPhishingCodeResp,
  MemberBaseVerifyPhishingCodeReq,
  MemberPersonalCenterSetNickReq,
  MemberBaseSafaVerifyBaseInfoReq,
  MemberBaseSafaVerifyBaseInfoResp,
  MemberSafeEmailUpdateReq,
  MemberSafeMobileUpdateReq,
  MemberSafeGoogleUpdateReq,
  MemberGeeTestInitConfigReq,
  MemberGeeTestInitConfigResp,
  MemberPhoneAreaCodeReq,
  MemberPhoneAreaCodeResp,
  MemberMemberPhoneAreaReq,
  MemberMemberPhoneAreaResp,
  MemberBaseSettingsInfoReq,
  MemberBaseSettingsInfoResp,
  MemberBaseCurrencyTypeReq,
  MemberBaseColorTypeReq,
  MemberIdentityApplyReq,
  MemberIdentityApplyRes,
  MemberVerifyRecordReq,
  MemberVerifyRecordRes,
  MemberVerifyResultReq,
  MemberVerifyResultRes,
  MemberAdvancedApplyReq,
  MemberAdvancedApplyRes,
  MemberPermissionDetailReq,
  MemberPermissionDetailRes,
  MemberPermissionDepositReq,
  MemberPermissionDepositRes,
  MemberStatusPermissiontReq,
  MemberStatusPermissiontRes,
  MemberPermissionUserInfoRes,
  MemberMerchantApplyReq,
  MemberMerchantApplyRes,
  MemberVerifyGeeTestReq,
  MemberRegisterValidEmailReq,
  MemberRegisterEmailResp,
  MemberRegisterPhoneResp,
  postMemberRegisterValidPhoneReq,
  MemberVerifyMemberByAccounReq,
  MemberVerifyMemberByAccounResp,
  MemberThirdPartyConfigReq,
  MemberThirdPartyConfigResp,
  MemberQueryWorkOrderStatusReq,
  MemberQueryWorkOrderStatusResp,
  MemberSafeVerifyGenerateGoogleQrCodeReq,
  MemberSafeVerifyGenerateGoogleQrCodeResp,
  MemberSafeVerifyResetReq,
  MemberUniversalSecurityVerificationRep,
  MemberUploadReq,
  MemberUploadResp,
  MemberUserInfoReq,
  MemberUserInfoResp,
  MemberBasePushLanguageReq,
  MemberBaseTradePasswordReq,
  MemberLoginGenerateUserInfomationReq,
  MemberAuthRefreshTokenReq,
  MemberAuthRefreshTokenResp,
  MemberSafeVerifyWithdrawalEmailSendReq,
  MemberSafeVerifyWithdrawalPhoneSendReq,
  MemberBaseApplicationLanguageReq,
} from '@/typings/user'
import {
  YapiGetIdentityCompanyBasicInfoApiRequest,
  YapiDtoIdentityCompanyVO,
} from '@/typings/yapi-old/IdentityCompanyBasicinfoGetApi'
import { YapiGetIdentityCompanyDirectorInfoApiRequest } from '@/typings/yapi-old/IdentityCompanyDirectorinfoGetApi'
import {
  YapiGetIdentityCompanyFilesInfoApiRequest,
  YapiDtoIdentityCompanyFilesInfoVO,
} from '@/typings/yapi-old/IdentityCompanyFilesinfoGetApi'
import {
  YapiPostIdentityCompanySaveBasicInfoApiRequest,
  YapiPostIdentityCompanySaveBasicInfoApiResponse,
} from '@/typings/yapi-old/IdentityCompanySavebasicinfoPostApi'
import {
  YapiPostIdentityCompanySaveDirectorApiRequest,
  YapiPostIdentityCompanySaveDirectorApiResponse,
} from '@/typings/yapi-old/IdentityCompanySavedirectorPostApi'
import {
  YapiPostIdentityCompanySaveFilesApiRequest,
  YapiPostIdentityCompanySaveFilesApiResponse,
} from '@/typings/yapi-old/IdentityCompanySavefilesPostApi'
import { YapiDtoIdentityCompanyMembersInfoVO } from '@/typings/yapi-old/IdentityCompanyTraderinfoGetApi'
import {
  YapiGetIdentityGetUserRightsApiRequest,
  YapiGetIdentityGetUserRightsApiResponse,
} from '@/typings/yapi-old/IdentityGetuserrightsGetApi'
import {
  YapiPostV1LinkedUserLoginApiRequest,
  YapiPostV1LinkedUserLoginApiResponse,
} from '@/typings/yapi/LinkedUserLoginV1PostApi'

/* ========== 第三方服务配置 ========== */
/**
 * 配置信息
 * https://yapi.coin-online.cc/project/44/interface/api/240
 */
export const getThirdPartyConfig: MarkcoinRequest<MemberThirdPartyConfigReq, MemberThirdPartyConfigResp> = () => {
  return request({
    path: `/v1/google/param/get`,
    method: 'GET',
  })
}

/* ========== 注册 ========== */

/**
 * 邮箱注册
 * https://yapi.coin-online.cc/project/44/interface/api/145
 */
export const postMemberRegisterEmail: MarkcoinRequest<MemberRegisterEmailReq, MemberRegisterEmailResp> = options => {
  return request({
    path: `/v1/member/register/email`,
    method: 'POST',
    signature: true,
    data: {
      email: options.email, // 邮箱
      loginPassword: options.loginPassword, // 密码
      regCountry: options.regCountry, // 国籍
      invite: options.invite, // 邀请码 (非必传)
    },
  })
}
/**
 * 手机注册
 * https://yapi.coin-online.cc/project/44/interface/api/142
 */
export const postMemberRegisterPhone: MarkcoinRequest<MemberRegisterPhoneReq, MemberRegisterPhoneResp> = options => {
  return request({
    path: `/v1/member/register/mobile`,
    method: 'POST',
    signature: true,
    data: {
      mobileCountryCode: options.mobileCountryCode, // 手机区号
      mobileNumber: options.mobileNumber, // 手机号码
      loginPassword: options.loginPassword, // 密码
      regCountry: options.regCountry, // 国籍
      invite: options.invite, // 邀请码 (非必传)
    },
  })
}
/**
 * Google 注册
 * https://yapi.coin-online.cc/project/44/interface/api/280
 */
export const postMemberRegisterGoogle: MarkcoinRequest<MemberRegisterGoogleReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/register/google`,
    method: 'POST',
    data: {
      idToken: options.idToken, // google 返回的 token
    },
  })
}
/**
 * Apple 注册
 * https://yapi.coin-online.cc/project/44/interface/api/288
 */
export const postMemberRegisterApple: MarkcoinRequest<MemberRegisterAppleReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/register/apple`,
    method: 'POST',
    data: {
      idToken: options.idToken, // apple 返回的 token
    },
  })
}
/**
 * 校验邮箱注册
 * https://yapi.coin-online.cc/project/44/interface/api/602
 */
export const postMemberRegisterValidEmail: MarkcoinRequest<
  MemberRegisterValidEmailReq,
  MemberSuccessResp
> = options => {
  return request({
    path: `/v1/member/register/valid/email`,
    method: 'POST',
    data: {
      email: options.email, // 邮箱
      invite: options.invite, // 邀请码
    },
  })
}
/**
 * 校验手机号注册
 * https://yapi.coin-online.cc/project/44/interface/api/608
 */
export const postMemberRegisterValidPhone: MarkcoinRequest<
  postMemberRegisterValidPhoneReq,
  MemberSuccessResp
> = options => {
  return request({
    path: `/v1/member/register/valid/mobile`,
    method: 'POST',
    data: {
      mobileCountryCode: options.mobileCountryCode, // 区号
      mobileNumber: options.mobileNumber, // 手机号
      invite: options.invite, // 邀请码
    },
  })
}

/* ========== 登录 ========== */

/**
 * 手机号登录
 * https://yapi.coin-online.cc/project/44/interface/api/127
 */
export const postMemberLoginPhone: MarkcoinRequest<MemberLoginPhoneReq, MemberTokenResp> = options => {
  return request({
    path: `/v1/member/login/mobile`,
    method: 'POST',
    signature: true,
    data: {
      mobile: options.mobile, // 手机号
      password: options.password, // 密码
      mobileCountryCode: options.mobileCountryCode, // 手机区号
      tokenTtl: options.tokenTtl, // token 有效期 毫秒数
    },
  })
}
/**
 * 邮箱登录
 * https://yapi.coin-online.cc/project/44/interface/api/136
 */
export const postMemberLoginEmail: MarkcoinRequest<MemberLoginEmailReq, MemberTokenResp> = options => {
  return request({
    path: `/v1/member/login/email`,
    method: 'POST',
    signature: true,
    data: {
      email: options.email, // 邮箱
      password: options.password, // 密码
      tokenTtl: options.tokenTtl, // token 有效期 毫秒数
    },
  })
}
/**
 * uId 登录
 * https://yapi.coin-online.cc/project/44/interface/api/248
 */
export const postMemberLoginByUid: MarkcoinRequest<MemberLoginUidReq, MemberTokenResp> = options => {
  return request({
    path: `/v1/member/login/uid`,
    method: 'POST',
    signature: true,
    data: {
      uid: options.uid, // uid
      password: options.password, // 密码
      tokenTtl: options.tokenTtl, // token 有效期 毫秒数
    },
  })
}

/**
 * Google 登录
 * https://yapi.coin-online.cc/project/44/interface/api/240
 */
export const postMemberLoginGoogle: MarkcoinRequest<MemberLoginGoogleReq, MemberTokenResp> = options => {
  return request({
    path: `/v1/member/login/google`,
    method: 'POST',
    data: {
      idToken: options.idToken, // google 返回的 token
    },
  })
}
/**
 * Apple 登录
 * https://yapi.coin-online.cc/project/44/interface/api/184
 */
export const postMemberLoginApple: MarkcoinRequest<MemberLoginAppleReq, MemberTokenResp> = options => {
  return request({
    path: `/v1/member/login/apple`,
    method: 'POST',
    data: {
      idToken: options.idToken, // apple 返回的 token
    },
  })
}

/**
 * 分发 userInfo, token 接口
 * https://yapi.admin-devops.com/project/44/interface/api/2786
 */
export const postMemberLoginGenerateUserInfomation: MarkcoinRequest<
  MemberLoginGenerateUserInfomationReq,
  MemberTokenResp
> = options => {
  return request({
    path: `/v1/member/login/generate_user_Infomation`,
    method: 'POST',
    data: {
      account: options.account, // apple 返回的 token
      accountType: options.accountType, // 类型 1 手机 2 邮箱 3 uid
      mobileCountryCode: options.mobileCountryCode, // 手机区号
    },
  })
}

/**
 * 获取登录二维码
 * https://yapi.admin-devops.com/project/44/interface/api/2591
 */
export const postMemberLoginQrcode: MarkcoinRequest = options => {
  return request({
    path: `/v1/member/login/generate_qrcode_token`,
    method: 'POST',
    data: {
      deviceName: options.deviceName,
    },
  })
}

/**
 * 扫码 登录
 * https://yapi.admin-devops.com/project/44/interface/api/200
 */
export const postMemberLoginScan: MarkcoinRequest = options => {
  return request({
    path: `/v1/member/login/scan`,
    method: 'POST',
    data: {
      qrCode: options.qrCode, // token
      tokenTtl: options.tokenTtl, // 时间戳
    },
  })
}
/* ========== 绑定验证 ========== */
/**
 * 绑定 google 验证
 * https://yapi.coin-online.cc/project/44/interface/api/151
 */
export const postMemberSafeGoogleBind: MarkcoinRequest<MemberSafeGoogleBindReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/safe/google/bind`,
    method: 'POST',
    data: {
      secretKey: options.secretKey, // google 密钥
      verifyCode: options.verifyCode, // 验证码
    },
  })
}
/**
 * 绑定 手机 验证
 * https://yapi.coin-online.cc/project/44/interface/api/154
 */
export const postMemberSafePhoneBind: MarkcoinRequest<MemberSafePhoneBindReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/safe/mobile/bind`,
    method: 'POST',
    data: {
      mobileCountryCode: options.mobileCountryCode, // 区号
      mobileNumber: options.mobileNumber, // 手机号码
      verifyCode: options.verifyCode, // 验证码
      operateType: options.operateType, // 类型
    },
  })
}
/**
 * 绑定 邮箱 验证
 * https://yapi.coin-online.cc/project/44/interface/api/157
 */
export const postMemberSafeEmailBind: MarkcoinRequest<MemberSafeEmailBindReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/safe/email/bind`,
    method: 'POST',
    data: {
      email: options.email, // 邮箱地址
      verifyCode: options.verifyCode, // 验证码
      operateType: options.operateType, // 类型
    },
  })
}
/* ========== 关闭验证 ========== */
/**
 * 关闭 google 验证
 * https://yapi.coin-online.cc/project/44/interface/api/347
 */
export const postMemberSafeGoogleStatus: MarkcoinRequest<MemberSafeGoogleStatusReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/safe/google/status`,
    method: 'POST',
    data: {
      status: options.status,
    },
  })
}
/**
 * 关闭 手机 验证
 * https://yapi.coin-online.cc/project/44/interface/api/350
 */
export const postMemberSafePhoneStatus: MarkcoinRequest<MemberSafePhoneStatusReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/safe/mobile/status`,
    method: 'POST',
    data: {
      status: options.status,
    },
  })
}
/**
 * 关闭 邮箱 验证
 * https://yapi.coin-online.cc/project/44/interface/api/356
 */
export const postMemberSafeEmailStatus: MarkcoinRequest<MemberSafeEmailStatusReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/safe/email/status`,
    method: 'POST',
    data: {
      status: options.status,
    },
  })
}

/**
 * 删除 手机 验证
 * https://yapi.admin-devops.com/project/44/interface/api/428
 */
export const deleteMemberSafeMobile: MarkcoinRequest = () => {
  return request({
    path: `/v1/member/safe/mobile`,
    method: 'DELETE',
  })
}

/* ========== 验证码 ========== */

/**
 * 发送手机验证码
 * https://yapi.coin-online.cc/project/44/interface/api/554
 */
export const postMemberSafeVerifyPhoneSend: MarkcoinRequest<
  MemberSafeVerifyPhoneSendReq,
  MemberSuccessResp
> = options => {
  return request({
    path: `/v1/send/sms`,
    method: 'POST',
    data: {
      type: options.type, // 类型，1，手机号注册，2，极验验证，3，提现
      mobileCountryCode: options.mobileCountryCode, // 手机区号，未登陆必传
      mobile: options.mobile, // 手机号，未登陆必传
      uid: options.uid,
    },
  })
}
/**
 * 发送邮箱验证码
 * https://yapi.coin-online.cc/project/44/interface/api/557
 */
export const postMemberSafeVerifyEmailSend: MarkcoinRequest<
  MemberSafeVerifyEmailSendReq,
  MemberSuccessResp
> = options => {
  return request({
    path: `/v1/send/email`,
    method: 'POST',
    data: {
      type: options.type, // 类型，1，邮箱注册，2，极验验证，3，提现
      email: options.email, // 邮箱
      uid: options.uid,
    },
  })
}
/**
 * 发送手机验证码
 * https://yapi.nbttfc365.com/project/44/interface/api/3815
 */
export const postMemberSafeVerifyWithdrawalPhoneSend: MarkcoinRequest<
  MemberSafeVerifyWithdrawalPhoneSendReq,
  MemberSuccessResp
> = options => {
  return request({
    path: `/v1/send/withdrawalSms`,
    method: 'POST',
    data: {
      type: options.type, // 类型，1，手机号注册，2，极验验证，3，提现
      mobileCountryCode: options.mobileCountryCode, // 手机区号，未登陆必传
      mobile: options.mobile, // 手机号，未登陆必传
      address: options.address, // 提币地址
      quantity: options.quantity, // 提币数量
      currencyCode: options.currencyCode, // 提币币种
      memo: options.memo, // memo 地址
    },
  })
}
/**
 * 发送邮箱验证码 - 提币
 * https://yapi.nbttfc365.com/project/44/interface/api/3819
 */
export const postMemberSafeVerifyWithdrawalEmailSend: MarkcoinRequest<
  MemberSafeVerifyWithdrawalEmailSendReq,
  MemberSuccessResp
> = options => {
  return request({
    path: `/v1/send/withdrawalEmail`,
    method: 'POST',
    data: {
      type: options.type, // 类型，1，邮箱注册，2，极验验证，3，提现
      email: options.email, // 邮箱
      address: options.address, // 提币地址
      quantity: options.quantity, // 提币数量
      currencyCode: options.currencyCode, // 提币币种
      memo: options.memo, // memo 地址
    },
  })
}
/**
 * 手机验证码验证
 * https://yapi.coin-online.cc/project/44/interface/api/560
 */
export const postMemberSafeVerifyPhoneCheck: MarkcoinRequest<
  MemberSafeVerifyPhoneCheck,
  MemberSuccessResp
> = options => {
  return request({
    path: `/v1/send/checkSmsCode`,
    method: 'POST',
    data: {
      type: options.type, // 类型，1，注册，2，极验验证，3，提现
      verifyCode: options.verifyCode, // 验证码
      mobileCountryCode: options.mobileCountryCode, // 区号 用户未登录时验证需要传入
      mobile: options.mobile, // 电话号码 用户未登录时验证需要传入
    },
  })
}

/**
 * 邮箱验证码验证
 * https://yapi.coin-online.cc/project/44/interface/api/563
 */
export const postMemberSafeVerifyEmailCheck: MarkcoinRequest<
  MemberSafeVerifyEmailCheck,
  MemberSuccessResp
> = options => {
  return request({
    path: `/v1/send/checkEmailCode`,
    method: 'POST',
    data: {
      type: options.type, // 类型，1，注册，2，极验验证，3，提现
      verifyCode: options.verifyCode, // 验证码
      email: options.email, // 邮箱，未登陆必传
    },
  })
}
/**
 * 谷歌验证码验证
 * https://yapi.admin-devops.com/project/44/interface/api/2789
 */
export const getMemberSafeVerifyGoogleCheck: MarkcoinRequest<
  MemberSafeVerifyGoogleCheck,
  MemberSuccessResp
> = options => {
  return request({
    path: `/v1/member/safe/verify/google/login_check`,
    method: 'GET',
    params: {
      verifyCode: options.verifyCode, // 验证码
      uid: options.uid, // uid
    },
  })
}

/* ========== 密码 ========== */
/**
 * 修改密码
 * https://yapi.coin-online.cc/project/44/interface/api/166
 */
export const postMemberSafePassword: MarkcoinRequest<MemberSafePasswordReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/safe/pwd`,
    method: 'POST',
    signature: true,
    data: {
      oldPassword: options.oldPassword, // 老密码
      newPassword: options.newPassword, // 新密码
      safeVerifyType: options.safeVerifyType, // 安全验证类型，1 手机  2 邮箱
      verifyCode: options.verifyCode, // 验证码
    },
  })
}
/**
 * 重置密码
 * https://yapi.coin-online.cc/project/44/interface/api/365
 */
export const postMemberSafeResetPassword: MarkcoinRequest<MemberSafeResetPasswordReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/safe/pwd/reset`,
    method: 'POST',
    signature: true,
    data: {
      mobileCountryCode: options.mobileCountryCode, // 手机区号（当 safeVerifyType=1 时不能为空）
      account: options.account, // safeVerifyType=1 传手机号，safeVerifyType=2 传 email , safeVerifyType=3 传 uid
      newPassword: options.newPassword, // 新密码
      safeVerifyType: options.safeVerifyType, // 类型 1 手机  2 邮箱 3 uid
      verifyCode: options.verifyCode, // 验证码
    },
  })
}

/**
 * 交易密码
 * https://yapi.coin-online.cc/project/44/interface/api/365
 */
export const postMemberBaseTradePassword: MarkcoinRequest<MemberBaseTradePasswordReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/safe/trade/pwd`,
    method: 'POST',
    data: {
      oldPassword: options.oldPassword || '', // 老密码
      newPassword: options.newPassword, // 新密码
    },
  })
}

/* ========== 谷歌 Key  ========== */
/**
 * 获取 google 绑定密钥
 * https://yapi.coin-online.cc/project/44/interface/api/160
 */
export const getMemberSafeVerifyGoogleSecretKey: MarkcoinRequest<
  MemberSafeVerifyGoogleSecretKeyReq,
  MemberSafeVerifyGoogleSecretKeyResp
> = () => {
  return request({
    path: `/v1/member/safe/verify/google/secret/key`,
    method: 'GET',
  })
}

/**
 * 获取 google 绑定密钥
 * https://yapi.admin-devops.com/project/44/interface/api/2681
 */
export const postMemberSafeVerifyGenerateGoogleQrCode: MarkcoinRequest<
  MemberSafeVerifyGenerateGoogleQrCodeReq,
  MemberSafeVerifyGenerateGoogleQrCodeResp
> = options => {
  return request({
    path: `/v1/member/safe/verify/generate_google_qrcode`,
    method: 'POST',
    data: {
      account: options.account, // 账号
    },
  })
}

/* ========== 防钓鱼码  ========== */
/**
 * 获取防钓鱼码
 * https://yapi.coin-online.cc/project/44/interface/api/338
 */
export const getMemberBaseGetPhishingCode: MarkcoinRequest<
  MemberBaseGetPhishingCodeReq,
  MemberBaseGetPhishingCodeResp
> = () => {
  return request({
    path: `/v1/member/base/getPhishingCode`,
    method: 'GET',
  })
}
/**
 * 设置防钓鱼码
 * https://yapi.coin-online.cc/project/44/interface/api/341
 */
export const getMemberBaseVerifyPhishingCode: MarkcoinRequest<
  MemberBaseVerifyPhishingCodeReq,
  MemberSuccessResp
> = options => {
  return request({
    path: `/v1/member/base/verifyPhishingCode`,
    method: 'POST',
    data: {
      phishingCode: options.phishingCode, // 防钓鱼码
    },
  })
}

/* ========== 个人中心设置头像、名称  ========== */
/**
 * 设置昵称
 * https://yapi.coin-online.cc/project/44/interface/api/264
 */
export const postMemberPersonalCenterSetNick: MarkcoinRequest<
  MemberPersonalCenterSetNickReq,
  MemberSuccessResp
> = options => {
  return request({
    path: `/v1/member/base/nickName`,
    method: 'POST',
    data: {
      nickName: options.nickName, // 昵称
    },
  })
}

/* ========== 个人中心会员 google 验证，手机验证，邮箱验证状态查询  ========== */
/**
 * 会员 google 验证，手机验证，邮箱验证状态查询
 * https://yapi.coin-online.cc/project/44/interface/api/148
 */
export const getMemberBaseSafaVerifyBaseInfo: MarkcoinRequest<
  MemberBaseSafaVerifyBaseInfoReq,
  MemberBaseSafaVerifyBaseInfoResp
> = () => {
  return request({
    path: `/v1/member/safe/verifyMemberBaseInfo`,
    method: 'GET',
  })
}

/* ========== 个人中心会员 推送语言  ========== */
/**
 * 推送语言设置
 * https://yapi.admin-devops.com/project/44/interface/api/2687
 */
export const postMemberBasePushLanguage: MarkcoinRequest<MemberBasePushLanguageReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/base/language`,
    method: 'POST',
    data: {
      language: options.language, // 语言
    },
  })
}

/* ========== 重置安全项 (人工)  ========== */
/**
 * 重置安全项工单
 * https://yapi.coin-online.cc/project/44/interface/api/133
 */
export const postMemberSafeVerifyReset: MarkcoinRequest<MemberSafeVerifyResetReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/safe/verify/reset`,
    method: 'POST',
    data: {
      isGoogle: options.isGoogle, // 谷歌
      isEmail: options.isEmail, // 邮箱
      isMobile: options.isMobile, // 手机
      googleSecretKey: options.googleSecretKey, // 谷歌 SecretKey
      googleVerifyCode: options.googleVerifyCode, // 谷歌验证码
      email: options.email, // 邮箱
      emailVerifyCode: options.emailVerifyCode, // 邮箱验证码
      mobile: options.mobile, // 新手机
      mobileCountryCode: options.mobileCountryCode, // 新手机区号
      mobileVerifyCode: options.mobileVerifyCode, // 新手机验证码
      applyPhotoPath: options.applyPhotoPath, // 认证照片 OSS 地址
      account: options.account, // 账号
      accountType: options.accountType, // 账户类型
      oldMobileCountryCode: options.oldMobileCountryCode, // 旧手机区号
    },
  })
}

/* ========== 个人中心修改、手机、邮箱、谷歌 key  ========== */
/**
 * 修改邮箱
 * https://yapi.coin-online.cc/project/44/interface/api/425
 */
export const postMemberSafeEmailUpdate: MarkcoinRequest<MemberSafeEmailUpdateReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/safe/email/update`,
    method: 'POST',
    data: {
      operateType: options.operateType, // 业务类型
      email: options.email, // 邮箱
      verifyCode: options.verifyCode, // 新邮箱验证码
    },
  })
}
/**
 * 修改手机
 * https://yapi.coin-online.cc/project/44/interface/api/422
 */
export const postMemberSafeMobileUpdate: MarkcoinRequest<MemberSafeMobileUpdateReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/safe/mobile/update`,
    method: 'POST',
    data: {
      operateType: options.operateType, // 业务类型
      mobileCountryCode: options.mobileCountryCode, // 区号
      mobileNumber: options.mobileNumber, // 手机号码
      verifyCode: options.verifyCode, // 新手机号码验证码
    },
  })
}
/**
 * 修改谷歌 key
 * https://yapi.coin-online.cc/project/44/interface/api/419
 */
export const postMemberSafeGoogleUpdate: MarkcoinRequest<MemberSafeGoogleUpdateReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/safe/google/update`,
    method: 'POST',
    data: {
      operateType: options.operateType, // 业务类型
      secretKey: options.secretKey, // google 密钥
      verifyCode: options.verifyCode, // 会员 id
    },
  })
}

/* ========== 获取极验配置  ========== */
/**
 * 获取极验初始化配置
 * https://yapi.coin-online.cc/project/44/interface/api/2585
 */
export const getMemberGeeTestInitConfig: MarkcoinRequest<
  MemberGeeTestInitConfigReq,
  MemberGeeTestInitConfigResp
> = options => {
  return request({
    path: '/v1/gee_test/get_behavior_verify_model',
    method: 'GET',
    params: {
      account: options.account, // 账户名
      clientType: options.clientType, // 	客户端类型（注：1.web 2.h5 3.android  4.ios)
      operateType: options.operateType, // 操作的类型（注：1.注册 2.登录 3.修改密码 4.通用安全项验证)
    },
  })
}

/**
 * 校验极验验证
 */
export const postMonkeyMemberVerifyGeeTest: MarkcoinRequest<MemberVerifyGeeTestReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/gee_test/set_verified_gee`,
    method: 'POST',
    data: {
      account: options.account, // 账户名
      gtChallenge: options.gtChallenge, // 极验码 唯一标识
    },
  })
}

/* ========== 国籍、区号查询  ========== */
/**
 * 手机区域列表查询
 * https://yapi.coin-online.cc/project/44/interface/api/139
 */
export const getMemberPhoneAreaCode: MarkcoinRequest<MemberPhoneAreaCodeReq, MemberPhoneAreaCodeResp> = options => {
  return request({
    path: `/v1/member/phone/area_code`,
    method: 'GET',
    params: {
      searchParam: options.searchParam,
    },
  })
}
/**
 * 国籍列表查询
 * https://yapi.coin-online.cc/project/44/interface/api/181
 */
export const getMemberPhoneArea: MarkcoinRequest<MemberMemberPhoneAreaReq, MemberMemberPhoneAreaResp> = options => {
  return request({
    path: `/v1/member/phone/area`,
    method: 'GET',
    params: {
      searchParam: options.searchParam,
    },
  })
}

/* ========== 个人中心 账户设置 折算货币、涨跌色、选择语言  ========== */
/**
 * 会员信息
 * https://yapi.coin-online.cc/project/44/interface/api/446
 */
export const getMemberBaseSettingsInfo: MarkcoinRequest<MemberBaseSettingsInfoReq, MemberBaseSettingsInfoResp> = () => {
  return request({
    path: `/v1/member/base/settings/info`,
    method: 'GET',
  })
}

/**
 * 折算货币设置
 * https://yapi.coin-online.cc/project/44/interface/api/440
 */
export const postMemberBaseCurrencyType: MarkcoinRequest<MemberBaseCurrencyTypeReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/base/currency`,
    method: 'POST',
    data: {
      currencyTypeCd: options.currencyTypeCd, // USD 美元 CNY 人民币 HKD 港币
    },
  })
}

/**
 * 涨跌色设置
 * https://yapi.coin-online.cc/project/44/interface/api/443
 */
export const postMemberBaseColorType: MarkcoinRequest<MemberBaseColorTypeReq, MemberSuccessResp> = options => {
  return request({
    path: `/v1/member/base/market/color`,
    method: 'POST',
    data: {
      marketSetting: options.marketSetting, // 1.绿涨红跌 2.红涨绿跌
    },
  })
}

/**
 * 应用语言设置
 * https://yapi.nbttfc365.com/project/44/interface/api/5749
 */
export const postMemberBaseApplicationLanguage: MarkcoinRequest<
  MemberBaseApplicationLanguageReq,
  MemberSuccessResp
> = options => {
  return request({
    path: `/v1/member/base/applicationLanguage`,
    method: 'POST',
    data: {
      type: options.type, // zh-CN、en-US
    },
  })
}

/* ========== 通过邮箱、手机、uid 获取信息  ========== */
/**
 * 通过 邮箱、密码 获取安全项启用状态
 * https://yapi.coin-online.cc/project/44/interface/api/2579
 */
export const postMemberVerifyMemberByAccoun: MarkcoinRequest<
  MemberVerifyMemberByAccounReq,
  MemberVerifyMemberByAccounResp
> = options => {
  return request({
    path: `/v1/member/safe/verifyMemberByAccount`,
    method: 'POST',
    data: {
      type: options.type, // 类型 1 手机 2 邮箱 3 uid
      account: options.account, // 邮箱
      password: options.password, // 密码
    },
  })
}

/**
 * 无密码 获取安全项启用状态
 * https://yapi.admin-devops.com/project/44/interface/api/2606
 */
export const postMemberVerifyByAccoun: MarkcoinRequest<
  MemberVerifyMemberByAccounReq,
  MemberVerifyMemberByAccounResp
> = options => {
  return request({
    path: `/v1/member/safe/query_verify_subject_by_account`,
    method: 'POST',
    data: {
      type: options.type, // 类型 1 手机 2 邮箱 3 uid
      account: options.account, // 邮箱
      mobileCountryCode: options.mobileCountryCode, // 区号
    },
  })
}

/**
 * 通过 邮箱、手机号 获取工单状态
 * https://yapi.admin-devops.com/project/44/interface/api/2645
 */
export const postMemberQueryWorkOrderStatus: MarkcoinRequest<
  MemberQueryWorkOrderStatusReq,
  MemberQueryWorkOrderStatusResp
> = options => {
  return request({
    path: `/v1/member/safe/query_is_process_by_account`,
    method: 'POST',
    data: {
      type: options.type, // 类型 1 手机 2 邮箱
      account: options.account, // 邮箱
      mobileCountryCode: options.mobileCountryCode, // 区号
    },
  })
}

/** ============ 上传图片 ============ */
/**
 * 通过 邮箱、手机号 获取工单状态
 * https://yapi.admin-devops.com/project/44/interface/api/2678
 */
export const postMemberUpload: MarkcoinRequest<MemberUploadReq, MemberUploadResp> = options => {
  return request({
    path: `/v1/storage/file/upload`,
    method: 'POST',
    data: {
      image: options.image, // base64 文件
    },
  })
}

/** ============ 通用安全验证 ============ */
/**
 * 通过 邮箱、手机号 获取工单状态
 * https://yapi.admin-devops.com/project/44/interface/api/2603
 */
export const postMemberUniversalSecurityVerification: MarkcoinRequest<
  MemberUniversalSecurityVerificationRep,
  MemberSuccessResp
> = options => {
  return request({
    path: `/v1/member/safe/common_verify`,
    method: 'POST',
    data: {
      operateType: options.operateType, // 业务类型
      mobileVerifyCode: options.mobileVerifyCode, // 手机验证码
      emailVerifyCode: options.emailVerifyCode, // 邮箱验证码
      googleVerifyCode: options.googleVerifyCode, // 谷歌验证码
    },
  })
}

/** ============ 获取用户信息 ============ */
/**
 * 获取用户信息 userInfo
 * https://yapi.admin-devops.com/project/44/interface/api/2576
 */
export const getMemberUserInfo: MarkcoinRequest<MemberUserInfoReq, MemberUserInfoResp> = () => {
  return request({
    path: `/v1/member/base/info`,
    method: 'GET',
  })
}

/** ============ 用户登出 ============ */
/**
 * 用户登出
 * https://yapi.admin-devops.com/project/44/interface/api/2711
 */
export const getMemberUserLoginOut: MarkcoinRequest = () => {
  return request({
    path: `/v1/member/logout`,
    method: 'GET',
  })
}

/** ============ 根据 ip 查询国家 ============ */
/**
 * 根据 ip 查询国家
 * https://yapi.admin-devops.com/project/44/interface/api/2867
 */
export const getMemberAreaIp: MarkcoinRequest = () => {
  return request({
    path: `/v1/member/phone/area_ip`,
    method: 'GET',
  })
}

/** ============ 刷新 token ============ */
/**
 * 刷新 token
 * https://yapi.admin-devops.com/project/44/interface/api/3507
 */
export const postMemberAuthRefreshToken: MarkcoinRequest<
  MemberAuthRefreshTokenReq,
  MemberAuthRefreshTokenResp
> = options => {
  return request({
    path: `/auth/refreshToken`,
    method: 'POST',
    data: {
      refreshToken: options.refreshToken, // 登陆成功后获取的 refreshToken 值
      tokenTtl: options.tokenTtl, // tokenTtl 时间戳
    },
  })
}

/** ============ 获取法币列表 ============ */
/**
 * 获取法币列表
 * https://yapi.nbttfc365.com/project/44/interface/api/2948
 */
export const getMemberCurrencyList: MarkcoinRequest = () => {
  return request({
    path: `/v1/member/currency/list`,
    method: 'GET',
  })
}

/* ========== 老 tule user 接口  ========== */

/* ========== 老 tule user 接口  ========== */

/* ========== 老 tule user 接口  ========== */

/* ========== 老 tule user 接口  ========== */

/**
 * 上传图片 tule
 */
export const postUploadImage: MarkcoinRequest = formData => {
  return request({
    path: `https://gw.monkey.com/oss-server/oss_server/security/upload`,
    method: 'POST',
    contentType: 3, // formData upload 上传类型
    data: formData,
  })
}

/**
 * 获取用户登录信息 tule
 */
export const getMonkeyMemberGetLoginLogs: MarkcoinRequest = () => {
  return request({
    path: `/user/getLoginLogs`,
    method: 'GET',
  })
}

/**
 * 获取用户安全设置信息 tule
 */
export const getMonkeyMemberGetSecurityLogs: MarkcoinRequest = () => {
  return request({
    path: `/user/getSecurityLogs`,
    method: 'GET',
  })
}

/**
 * 合约二次下单启用或关闭 tule
 */
export const putMonkeyMemberPerpetualUserProfile: MarkcoinRequest = options => {
  return request({
    path: `/v1/perpetual/users/profile`,
    method: 'PUT',
    params: {
      type: 1,
      value: options.value,
    },
  })
}

/**
 * 合约二次下单启用或关闭 tule
 */
export const getMonkeyMemberPerpetualUserProfile: MarkcoinRequest = () => {
  return request({
    path: `/v1/perpetual/users/profile`,
    method: 'GET',
  })
}

/**
 * 获取 api key 列表 tule
 */
export const getMonkeyMemberOpenApi: MarkcoinRequest = () => {
  return request({
    path: `/openapi/apikey/mine`,
    method: 'GET',
  })
}

/**
 * 创建 api key tule
 */
export const postMonkeyMemberCreateOpenApi: MarkcoinRequest = options => {
  return request({
    path: `/openapi/apikey/create`,
    method: 'POST',
    contentType: 1,
    signature: 'decrypted',
    data: {
      remark: options.remark,
      types: options.types,
      googleValidCode: options.googleCode,
      mobileValidCode: options.phoneCode,
      mailValidCode: options.emailCode,
    },
  })
}

/**
 * 更新 api key tule
 */
export const postMonkeyMemberUpdateOpenApi: MarkcoinRequest = options => {
  return request({
    path: `/openapi/apikey/update`,
    method: 'POST',
    contentType: 1,
    signature: true,
    data: {
      id: options.id,
      remark: options.remark,
      types: options.types,
      googleValidCode: options.googleCode,
      mobileValidCode: options.phoneCode,
      mailValidCode: options.emailCode,
    },
  })
}

/* ========== 老 tule 认证 接口  ========== */

/**
 * 实名认证申请
 */
export const setIdentityApply: MarkcoinRequest<MemberIdentityApplyReq, MemberIdentityApplyRes> = data => {
  return request({
    path: `/identity/standard/apply`,
    method: 'POST',
    data,
    contentType: 1,
  })
}

/**
 * 实名认证回显示
 */
export const getVerifyRecord: MarkcoinRequest<MemberVerifyRecordReq, MemberVerifyRecordRes> = params => {
  return request({
    path: `/identity/getVerifyRecord`,
    method: 'GET',
    params,
    contentType: 1,
  })
}

/**
 * 实名认证结果
 */
export const getVerifyResult: MarkcoinRequest<MemberVerifyResultReq, MemberVerifyResultRes> = params => {
  return request({
    path: `/identity/getVerifyResult`,
    method: 'GET',
    params,
    contentType: 1,
  })
}

/**
 * 个人高级认证
 */
export const setAdvancedApply: MarkcoinRequest<MemberAdvancedApplyReq, MemberAdvancedApplyRes> = data => {
  return request({
    path: `identity/advanced/apply`,
    method: 'POST',
    data,
    contentType: 1,
  })
}

/**
 * 获取权限审核详情
 */
export const getPermissionDetail: MarkcoinRequest<MemberPermissionDetailReq, MemberPermissionDetailRes> = params => {
  return request({
    path: `otc/merchant/applyStatus`,
    method: 'GET',
    params,
    contentType: 1,
  })
}

/**
 * 获取保证金
 */
export const getPermissionDeposit: MarkcoinRequest<MemberPermissionDepositReq, MemberPermissionDepositRes> = () => {
  return request({
    path: `/otc/deposit`,
    method: 'GET',
    contentType: 1,
  })
}

/**
 * 获取保证金
 */
export const resetStatusPermission: MarkcoinRequest<MemberStatusPermissiontReq, MemberStatusPermissiontRes> = () => {
  return request({
    path: `otc/merchant/resetStatus`,
    method: 'GET',
    contentType: 1,
  })
}

/**
 * 获取个人实名
 */
export const getPermissionUserInfo: MarkcoinRequest<MemberStatusPermissiontReq, MemberPermissionUserInfoRes> = () => {
  return request({
    path: `otc/user/info`,
    method: 'GET',
    contentType: 1,
  })
}

/**
 * 获取权限审核详情
 */
export const setMerchantApply: MarkcoinRequest<MemberMerchantApplyReq, MemberMerchantApplyRes> = data => {
  return request({
    path: `otc/merchant/apply`,
    method: 'POST',
    data,
    contentType: 1,
  })
}

/**
 * 获取当前权益
 */
export const getUserRights: MarkcoinRequest<
  YapiGetIdentityGetUserRightsApiRequest,
  YapiGetIdentityGetUserRightsApiResponse
> = () => {
  return request({
    path: `/identity/getUserRights`,
    method: 'GET',
    contentType: 1,
  })
}

/**
 * 获取当前权益
 */
export const getBasicInfo: MarkcoinRequest<
  YapiGetIdentityCompanyBasicInfoApiRequest,
  YapiDtoIdentityCompanyVO
> = params => {
  return request({
    path: `/identity/company/basicInfo`,
    method: 'GET',
    contentType: 1,
    params,
  })
}

/**
 * 保存商户基本信息
 */
export const setSaveBasicInfo: MarkcoinRequest<
  YapiPostIdentityCompanySaveBasicInfoApiRequest,
  YapiPostIdentityCompanySaveBasicInfoApiResponse
> = data => {
  return request({
    path: `/identity/company/saveBasicInfo`,
    method: 'POST',
    contentType: 1,
    data,
  })
}

/**
 * 保存商户文件相关基本信息
 */
export const setCompanySaveFiles: MarkcoinRequest<
  YapiPostIdentityCompanySaveFilesApiRequest,
  YapiPostIdentityCompanySaveFilesApiResponse
> = data => {
  return request({
    path: `/identity/company/saveFiles`,
    method: 'POST',
    contentType: 1,
    data,
  })
}

/**
 * 保存商户文件相关基本信息
 */
export const getCompanyFilesInfo: MarkcoinRequest<
  YapiGetIdentityCompanyFilesInfoApiRequest,
  YapiDtoIdentityCompanyFilesInfoVO[]
> = data => {
  return request({
    path: `/identity/company/filesInfo`,
    method: 'GET',
    contentType: 1,
    data,
  })
}

/**
 * 获取商户认证董事相关信息
 */
export const getCompanyTraderInfo: MarkcoinRequest<
  YapiGetIdentityCompanyDirectorInfoApiRequest,
  YapiDtoIdentityCompanyMembersInfoVO[]
> = data => {
  return request({
    path: `/identity/company/directorInfo`,
    method: 'GET',
    contentType: 1,
    data,
  })
}

/**
 * 获取商户认证董事相关信息
 */
export const setSaveDirector: MarkcoinRequest<
  YapiPostIdentityCompanySaveDirectorApiRequest,
  YapiPostIdentityCompanySaveDirectorApiResponse
> = data => {
  return request({
    path: `/identity/company/saveDirector`,
    method: 'POST',
    contentType: 1,
    data,
  })
}

/**
 * 获取站内信设置内容
 */
export const getInmailSettings: MarkcoinRequest = () => {
  return request({
    path: `/v1/inbox/settings`,
    method: 'GET',
  })
}

/**
 * 设置营销开关
 */
export const setMarketingEmail: MarkcoinRequest = data => {
  return request({
    path: `/v1/inbox/setting/marketingEmail`,
    method: 'POST',
    data,
  })
}

/**
 * 设置通知类型
 */
export const setNoticeType: MarkcoinRequest = data => {
  return request({
    path: `/v1/inbox/setting/modules`,
    method: 'POST',
    data,
  })
}

// /**
// * [关联账户注册/登陆↗](https://yapi.nbttfc365.com/project/44/interface/api/18444)
// **/
export const postV1LinkedUserLoginApiRequest: MarkcoinRequest<
  YapiPostV1LinkedUserLoginApiRequest,
  YapiPostV1LinkedUserLoginApiResponse['data']
> = data => {
  return request({
    path: '/v1/linked/user/login',
    method: 'POST',
    data,
  })
}

/**
 * apple 注册
 * https://yapi.nbttfc365.com/project/44/interface/api/184
 */
export const postRegisterAppleRequest: MarkcoinRequest = data => {
  return request({
    path: '/v1/member/register/apple',
    method: 'POST',
    data,
  })
}

/**
 * google 注册
 * https://yapi.nbttfc365.com/project/44/interface/api/240
 */
export const postRegisterGoogleRequest: MarkcoinRequest = data => {
  return request({
    path: '/v1/member/register/google',
    method: 'POST',
    data,
  })
}

/** 设置密码* */
export const postSetPasswordRequest: MarkcoinRequest = data => {
  return request({
    path: '/v1/member/login/passwordSet',
    method: 'POST',
    signature: true,
    data,
  })
}

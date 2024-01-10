export interface UserInfoSecurityItemValidateCodeType {
  /** 谷歌验证码 */
  googleValidCode?: string
  /** 手机验证码 */
  mobileValidCode?: string
  /** 邮箱验证码 */
  mailValidCode?: string
}

export interface PersonalCenterAccountSecurityType {
  /** 邮箱 */
  email?: string
  /** 是否启用 */
  isOpenEmailVerify?: number
  /** 手机区号 */
  mobileCountryCd?: string
  /** 手机号码 */
  mobileNumber?: string
  /** 是否启用 */
  isOpenPhoneVerify?: number
  /** 秘钥 */
  googleSecretKey?: string
  /** 是否启用 */
  isOpenGoogleVerify?: number
  /** 会员 ID */
  uid: string
}
export interface UserInfoSecurityItemEnabledStatusType {
  /** 账号 */
  floginname?: string
  /** 是否开启资金密码 */
  ftradepassword?: string
  /** 是否开启邮箱验证 */
  isOpenEmailValidate: boolean
  /** 是否开启手机验证 */
  isOpenPhoneValidate: boolean
  /** 是否开启谷歌验证 */
  isOpenGoogleValidate: boolean
  /** 邮箱 */
  femail?: string
  /** 手机 */
  ftelephone?: string
}

export interface SecurityItemEnabledCodeType {
  /** 是否开启资金密码 */
  fundPassword?: string
  /** 邮箱验证码 */
  emailVerifyCode?: string
  /** 手机验证码 */
  mobileVerifyCode?: string
  /** 谷歌验证码 */
  googleVerifyCode?: string
}

export interface UniversalSecurityVerificationType {
  /** 是否显示弹窗 */
  isShow: boolean
  /** 是否是交易模块 */
  isTrade?: boolean
  /** 业务类型 */
  businessType?: string
  /** 安全项 */
  userInfoSecurityItem?: UserInfoSecurityItemEnabledStatusType,
  /** 验证通过函数 */
  onSuccess(isSuccess: boolean, validateCode?: SecurityItemEnabledCodeType): void
  /** 新发送接口处理函数 组件内不处理新接口请求，请外部处理 返回 boolean 来调用 倒计时组件 */
  handleNewSendCodeInterface?(): boolean
}
export interface UserSecurityType {
  antiPhishingCode?: string | null
  country?: string
  device_name?: string
  email?: string
  identityStatus?: number
  isBindEmail?: boolean
  isBindGoogle?: boolean
  isBindTelephone?: boolean
  isIdentity?: boolean
  isLoginPass?: boolean
  isOpenEmailValidate?: boolean
  isOpenGoogleValidate?: boolean
  isOpenPhoneValidate?: boolean
  isTradePass?: boolean
  loginName?: string
  loginTtl?: number
  phone?: string
  secondaryVerification?: number
  securityLevel?: number
  unrealFiatWithdraw?: boolean
}

export interface UserSecuritySettingsType {
  email: string
  isOpenEmailValidate: boolean
  isOpenGoogleValidate: boolean
  isOpenPhoneValidate: boolean
  isSecurityValidateDone: boolean
  isUserIdentityAuth: boolean
  isUserTradePasswordSet: boolean
  phone: string
}

export interface UserSafetyRecordType {
  /** 城市 */
  city?: string
  /** 客户端 */
  client?: number
  /** 创建时间 */
  createTime?: number
  /** 设备 ID */
  deviceId?: string
  /** ID */
  id?: number
  /** IP 地址 */
  ipAddress?: string
  /** 是否成功 */
  status?: number
  /** uid */
  uid?: number
  /** 安全设置操作 */
  securityDesc?: string
}

/** 极验验证类型 */
interface GeeTestSuccessResultType {
  geetest_challenge: string
  geetest_seccode: string
  geetest_validate: string
}

export type MemberVerifyMemberByAccounResp = {
  isOpenEmailVerify: number // 是否启用邮箱 1 启用 2 未启用
  isOpenGoogleVerify: number // 是否启用谷歌 1 启用 2 未启用
  isOpenPhoneVerify: number // 是否启用手机 1 启用 2 未启用
  mobileCountryCd?: string // 手机区号
  mobileNumber?: string // 手机号
  email?: string // 邮箱
}

export interface PersonalCenterAccountSecurityType {
  /** 邮箱 */
  email?: string
  /** 邮箱是否启用 */
  isOpenEmailVerify?: number
  /** 手机是否启用 */
  isOpenPhoneVerify?: number
  /** 谷歌是否启用 */
  isOpenGoogleVerify?: number
  /** 邮箱是否绑定 */
  isBindEmailVerify?: number
  /** 手机是否绑定 */
  isBindPhoneVerify?: number
  /** 谷歌是否绑定 */
  isBindGoogleVerify?: number
  /** 手机区号 */
  mobileCountryCd?: string
  /** 手机号码 */
  mobileNumber?: string
  /** 秘钥 */
  googleSecretKey?: string
  /** 会员 ID */
  uid: string
}

export interface UserSelectConfigurationItemType {
  /** key */
  key: number
  /** 图标 */
  icon?: React.ReactNode
  /** 设置的值 */
  value: string | number
  /** 文本 */
  text: string
  /** 是否选择 */
  isChecked?: boolean
}

export interface UserLoginInfoType {
  /** 邮箱 */
  email?: string
  /** 手机 */
  mobile?: string
  /** 密码 */
  password: string
  /** 手机区号 */
  mobileCountryCode?: string
}

export interface UserVerifyMemberAccountInfoType {
  /** 邮箱是否启用 */
  isOpenEmailVerify: number
  /** 谷歌验证器是否启用 */
  isOpenGoogleVerify: number
  /** 手机是否启用 */
  isOpenPhoneVerify: number
  /** 手机区号 */
  mobileCountryCd?: string
  /** 手机 */
  mobileNumber?: string
  /** 邮箱 */
  email?: string
}

export interface UserInfoType {
  /** b 端平台 id */
  businessId?: string
  /** 头像地址 */
  avatarPath?: string
  /** 合约交易状态 */
  contractStatusInd?: number
  /** 充提状态 1=可充币不可提币；2=可提币不可充币；3=不可充提币 */
  deWStatusInd?: number
  id?: number
  /** 删除 flag:1 已删除，2 未删除 */
  isDelete?: number
  /** 是否绑定邮箱 */
  isBindEmailVerify: number
  /** 是否绑定谷歌 */
  isBindGoogleVerify: number
  /** 是否绑定手机 */
  isBindPhoneVerify: number
  /** 是否启用邮箱验证 1 已开启，2 未开启 */
  isOpenEmailVerify?: number
  /** 是否启用 google 验证 1 已开启，2 未开启 */
  isOpenGoogleVerify?: number
  /** 是否启用手机验证 1 已开启，2 未开启 */
  isOpenPhoneVerify?: number
  /** 是否设置交易密码 */
  isSettedTradePassword?: boolean
  /** 是否开通合约 */
  isOpenContractStatus: number
  /** 手机区号 */
  mobileCountryCd?: string
  /** 手机号码 */
  mobileNumber?: string
  /** 是否设置交易密码 */
  settedTradePassword?: boolean
  /** 注册时的账号，风控备份使用 */
  regAccount?: string
  /** 注册国籍 字典表编码 */
  regCountryCd?: number
  /** 注册方式 1=邮箱注册；2=console 台注册；3=手机号注册；4=appid 注册；5=google 注册 */
  regTypeInd?: number
  /** 0000-00-00 00:00:00 重置密码特殊限制到期时间 */
  rsPwdLimitExpDate?: string
  /** 重置密码特殊限制 1=已限制 24 小时；2=无限制 */
  rsPwdLimitInd?: number
  /** 0000-00-00 00:00:00 重置安全项特殊限制 到期时间 */
  rsSafeLimitExpDate?: string
  /** 重置安全项特殊限制 1=限制 48 小时；2=无限制； */
  rsSafeLimitInd?: number
  /* 是否已设置昵称 1 ture 2 false */
  setNicknameInd?: number
  /** 现货交易状态 1=现货可卖出不可买入；2=可现货交易;3=不可现货交易； */
  spotStatusInd?: number
  /** 用户状态 1 正常，2 失效 */
  statusInd?: number
  /** uid */
  uid?: string
  /** 版本号 */
  version?: number
  /** 昵称 */
  nickName?: string
  /** 国籍 字典表编码 */
  kycCountryCd?: string
  /** 邮箱 */
  email?: string
  /** 备注 */
  remark?: string
  /** kyc 认证等级 */
  kycType?: string
}

/** 极验验证类型 */
interface GeeTestSuccessResultType {
  geetest_challenge: string
  geetest_seccode: string
  geetest_validate: string
}

export type SettingInmailModules = {
  id: number
  name: string
  codeName?: string
  unReadNum?: number
}

/** 站内信设置 */
export type SettingInmailType = {
  pushLanguage: string
  isOpenMarketingEmail: number
  modules: Array<SettingInmailModules>
}
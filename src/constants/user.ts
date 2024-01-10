/** 验证方式 */
export enum UserValidateMethodEnum {
  email = 'email', // 邮箱验证
  phone = 'phone', // 手机验证
  validator = 'validator', // 验证器验证
  uid = 'uid', // uid
}

/** 表单验证类型 */
export enum UserValidateFormTypeEnum {
  login = 'login', // 登录
  register = 'register', // 注册
  retrieve = 'retrieve', // 重置密码
}

/** 注册方式 */
export enum UserRegisterTypeEnum {
  default = 'default', // 默认
  thirdParty = 'thirdParty', // 第三方
}

/** 平台类型 */
export enum PlatformTypeEnum {
  web = 1, // web
  h5, // h5
  android, // android
  ios, // ios
}

/** GeeTest 操作类型 */
export enum GeeTestOperationTypeEnum {
  register = 1, // 注册
  login, // 登录
  modifyPassword, // 修改密码
  resetSecurity, // 重置安全项
  createApi, // 创建 Api
}

/** 启用状态 */
export enum UserEnabledStateTypeEnum {
  enable = 1, // 已启用
  unEnable = 2, // 未启用
}

/** 选择国家或者区号类型 */
export enum UserSelectAreaTypeEnum {
  phone = 'phone', // 手机
  area = 'area', // 国家
}

/** 账户安全操作类型 */
export enum AccountSecurityOperationTypeEnum {
  bind = 'bind', // 绑定
  modify = 'modify', // 修改
  delete = 'delete', // 删除
}

/** 涨跌色 */
export enum UserUpsAndDownsColorEnum {
  greenUpRedDown = 1, // 绿涨红跌
  redUpGreenDown = 2, // 红涨绿跌
}

/** 货币符号 */
export enum UserCurrencySymbolEnum {
  cny = '¥', // 人民币
  usd = '$', // 美元
}

/** 货币名称 */
export enum UserCurrencyNameEnum {
  '¥' = 'CNY', // 人民币
  '$' = 'USD', // 美元
}

/** 用户实名认证状态类型 */
export enum UserAuthenticationStatusTypeEnum {
  notCertified = 0, // 未认证
  underReview, // 审核中
  examinationPassed, // 审核通过
  notApprovedCertified, // 不适用
  AuditNotPassed, // 审核不通过
}

/** 登录方式 */
export enum UserLoginMethod {
  web = 1,
  android,
  api,
  h5,
  ios,
}

/** 验证类型 */
export enum UserVerifyTypeEnum {
  phone = 1,
  email,
  uid,
}

/** 验证码验证类型 */
export enum UserSendValidateCodeBusinessTypeEnum {
  register = 1, // 注册
  login, // 登录
  withdraw, // 提币
  resetPassword, // 重置密码
  modifyEmail, // 修改邮箱前进行通用验证
  closeEmailVerification, // 关闭邮箱前进行通用验证
  modifyNewEmail, // 修改新邮箱号
  bindEmail, // 邮箱号绑定
  modifyPhone, // 修改手机号前进行通用验证
  closePhoneVerification, // 关闭手机号前进行通用验证
  modifyNewPhone, // 修改新手机号码
  bindPhone, // 手机号码绑定
  securityItemApply, // 重置安全项申请表单
  modifyGoogle, // 修改谷歌验证
  closeGoogleVerification, // 关闭谷歌验证
  deletePhoneVerification, // 删除手机验证
  resetSecurityItemApprovals, // 重置安全项审批
  closeBiosafetyAuthentication, // 关闭生物安全认证
  createApi, // 创建 Api
  userLogoutApplication = 24,
}

/** KYC 认证状态 */
export enum UserKycTypeEnum {
  notCertified = 1, // 未认证
  standardCertification, // 个人标准认证
  advancedCertification, // 个人高级认证
  enterpriseCertification, // 企业认证
}

/** 最大值最小值 */

export enum MinAndMaxTypeEnum {
  min = 1, // 最小值
  max, // 最大值
}
/** 合约 */
export enum UserContractVersionEnum {
  professional = 1, // 专业版
  base, // 基础版
}

export enum UserEnableEnum {
  yes = 'yes',
  no = 'no',
}

export enum UserOpenEnum {
  open = 'open',
  close = 'close',
}

/** 开仓额外保证金模式 */
export enum UserMarginSourceEnum {
  wallet = 'wallet', // 资金账户
  group = 'group', // 合约组剩余额外保证金
}

/** 保证金取回方式 */
export enum UserRetrieveWayEnum {
  auto = 'auto', // 自动取回
  manual = 'manual', // 手动取回
}

/** 自动追加保证金档位 */
export enum GearEnum {
  low = 0.7, // 低档
  middle = 0.85, // 中档
  high = 1, // 高档
}

/** 用户当前开启合约状态 */
export enum UserFuturesTradeStatus {
  open = 1,
  close = 2,
}
/** 现货用户当前允许交易状态 /** * 现货交易状态 1=可买可卖；2=不可卖可买;3=不可买可卖 */
export enum UserSpotTradeStatus {
  all = 1,
  buy = 2,
  sell = 3,
}

/** 下单单位 */
export enum UserOrderUnit {
  targetCurrency = 'sell', // 标记币
  priceCurrency = 'buy', //  计价币
}

export enum ContractPreferencesTermsEnum {
  marginProtection = 'margin_protection', // 价差保护
  contractTeachPro = 'contract_teach_pro', // 合约开通专业版教程
  contractTeachNormal = 'contract_teach_normal', // 合约开通普通版教程
}

export enum UserAgreementEnum {
  unreceiveVerificationCode = 'unreceive_verification_code', // 未收到验证码
  termsService = 'terms_service', // 服务条款
}

export const MergeModeRoutingWhiteList = [
  /** 资产 */
  '/assets', // 资产总览
  '/assets/main', // 币种资产
  '/assets/main/financial-record', // 财务记录 (交易)
  '/assets/main/detail', // 资产详情
  '/assets/futures', // 合约资产
  '/assets/futures/history', // 合约资产历史
  '/assets/futures/detail', // 合约资产详情
  '/assets/financial-record', // 财务记录

  /** 订单 */
  '/orders/future', // 合约订单
  '/orders/future/funding', // 合约订单 资金费用

  /** 交易 */
  '/futures', // 合约交易
  '/futures/funding-history', // 合约信息指数
  '/futures/funding-history/quarterly', // 合约信息资金费率历史
  '/ternary-option',

  /** 行情 */
  '/markets', // 自选行情
  '/markets/futures', // 合约行情
  '/markets/sector', // 行情板块
  '/markets/sector/table', // 更多板块
  '/order-book', // 盘口独立页

  /** 公共 */
  '/help/fee', // 手续费率
  '/stay-tuned', // 正在开发页面

  /** 娱乐区 */
  '/recreation',
]

export const MergeModeRoutingBlackList = [
  '/', // 首页
  /** 代理商 */
  '/agent', // 代理商首页
  '/agent/agency-center', // 代理商中心
  '/agent/apply', // 成为代理商
  '/agent/gains', // 收益分析
  '/agent/invitation', // 邀请用户详情
  '/agent/invite-analytics', // 邀请分析
  '/agent/join', // 申请成为顶级代理商
  '/agent/manage', // 管理代理商邀请码

  /** 交易 */
  '/trade', // 现货交易

  /** 订单 */
  '/orders/spot', // 现货订单

  /** 行情 */
  '/markets/spot', // 现货行情

  /** 资产 */
  '/assets/c2c', // C2C 资产
  '/assets/main/withdraw', // 提币
  '/assets/main/withdraw/result', // 提币申请
  '/assets/main/withdraw/address', // 提币地址管理
  '/assets/main/deposit', // 充值

  /** C2C */
  '/c2c/trade', // c2c 交易
  '/c2c/post/adv', // c2c 创建广告单
  '/c2c/orders', // c2c 订单
  '/c2c/orders/detail', // c2c 订单详情
  '/c2c/merchant', // c2c 商家
  '/c2c/merchant/application', // c2c 申请成为商家
  '/c2c/fast-trade', // c2c 快捷交易
  '/c2c/center', // c2c 中心
  '/c2c/adv/detail', // c2c 广告内容
  '/c2c/ads/history', // c2c 广告单

  /** 认证 */
  '/company-verified-material', // 企业认证
  '/enterprise-certification-submit', // 企业认证表单
  '/enterprise-certification', // 企业认证 确认企业类型
  '/kyc-authentication-homepage', // KYC 认证
  '/personal-high-certification', // 个人高级认证
  '/personal-verify', // 个人标准认证
  '/verified-result', // KYC 提交审核

  /** 用户 */
  '/register', // 注册
  '/register/residence', // 选择国家
  '/register/flow', // 验证表单
  '/register/verification', // 注册验证
  '/login', // 登录
  '/safety-verification', // 登录安全验证
  '/safety-items', // 重置安全项
  '/safety-items/application-form', // 安全项验证
  '/retrieve', // 重置密码
  '/retrieve/reset-password', // 重置密码表单
  '/personal-center/account-security/email', // 个人中心安全项邮箱
  '/personal-center/account-security/modify-password', // 个人中心安全项修改密码
  '/personal-center/account-security/phone', // 个人中心安全项手机
  '/personal-center/account-security/safety-record', // 个人中心安全记录
  '/personal-center/account-security/transaction-password', // 个人中心交易密码
  '/personal-center/account-security', // 个人中心安全项
  '/personal-center/settings/api', // API 管理
  '/personal-center/settings', // 个人设置

  /** 公共 */
  '/community-groups', // 加入 Monkey 社群'
  '/download', // 下载
  '/inmail', // 通知中心
  '/support/article', // 帮助中心文章
  '/support/navigation', // 帮助中心导航
  '/support/search', // 帮助中心搜索
  '/support', // 帮助中心
  '/announcement/article', // 公告中心文章页
  '/announcement', // 公告中心
]

export enum ColorBlockSettingsEnum {
  grandTotal = 1, // 累计
  Single, // 单条
}

export enum UserModuleDescribeKeyEnum {
  login = 'login', // 登录
  register = 'register', // 注册
  agentCenter = 'agentCenter', // 代理商中心
  default = 'default', // 默认描述
}

export enum UserPhoneSliceNumEnum {
  chinaNum = 3, // 中国截取前 3
  defaultNum = 4, // 默认 4 位
  chinaSliceNum = 7, // 中国从第 7 位截取
  defaultSliceNum = 8, // 默认第 8 位截取
}

export enum ChinaAreaCodeEnum {
  code = '86', // 中国区号
  remark = 'CN', // 中国
}

export enum UserClassificationEnum {
  default = 0, // 默认
  novice, // 新手
  traders, // 交易员
}

export enum UserHandleIntroEnum {
  assets = 'assets',
  futures = 'futures', // 合约
}

export enum ManageAccountEnum {
  noAccount = '1', // 不想再使用该账户
  allAccount = '2', // 合并多个账户
  other = '3', // 其它
}

export enum SignInWithEnum {
  apple = 'apple',
  google = 'google',
}

export enum BindTypeEnum {
  apple = 'appid',
  google = 'google',
}

export enum LoginTypeStatusEnum {
  isLogin = 'isLogin',
  needBind = 'needBind',
  registering = 'registering',
}

export enum ThirdPartyCheckoutType {
  apple = 'apple',
  firebase = 'firebase',
}

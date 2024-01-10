/**
 * 此文档为 businessType 业务类型 代码查询
 */
enum BusinessTypeEnum {
  SECURITY_ITEM_APPLY = 'security_item_apply', // "安全项申请", //
  REGISTER = 'register', // "注册", //
  MODIFY_EMAIL = 'modify_email', // "修改邮箱", //
  MODIFY_TELEPHONE = 'modify_telephone', // "修改手机", //
  MODIFY_GOOGLE = 'modify_google', // "修改谷歌", //
  BIND_EMAIL = 'bind_email', // "绑定邮箱", //
  BIND_TELEPHONE = 'bind_telephone', // "绑定手机", //
  BIND_GOOGLE = 'bind_google', // "绑定谷歌", //
  OPEN_PHONE_VALIDATE = 'open_phone_validate', // "开启手机验证", //
  CLOSE_PHONE_VALIDATE = 'close_phone_validate', // "关闭手机验证", //
  OPEN_EMAIL_VALIDATE = 'open_email_validate', // "开启邮箱验证", //
  CLOSE_EMAIL_VALIDATE = 'close_email_validate', // "关闭邮箱验证", //
  OPEN_GOOGLE_VALIDATE = 'open_google_validate', // "开启 google 验证", //
  CLOSE_GOOGLE_VALIDATE = 'close_google_validate', // "关闭 google 验证", //
  MODIFY_LOGIN_PWD = 'modify_login_pwd', // "修改登录密码", //
  RESET_LOGIN_PWD = 'reset_login_pwd', // "重置登录密码", //
  RESET_TRADE_PWD = 'reset_trade_pwd', // "重置资金密码", //
  LOGIN = 'login_v3', // "登录", //
  FRIEND_INVITATION = 'friend_invitation', // "好友邀请", //
  IDENTITY_AUTH_SUCCESS = 'real_name_auth_success', // "人工审核成功", //
  IDENTITY_AUTH_FAIL = 'real_name_auth_failed', // "人工审核失败", //
  SMS_CHARGE_TO_ACCOUNT = 'charge_coin_to_account', //  "用户充币到账", //
  SMS_WITHDRAW_TO_ACCOUNT = 'withdraw_coin_to_account', //  "用户提币到账", //
  SUBMIT_CAPITAL_WITHDRAW = 'submit_capital_withdraw', //  "提币申请", //
  CREATE_WITHDRAW_ADDRESS = 'create_withdraw_address', //  "添加提现地址", //
  WITHDRAW_COIN_REJECT_REASON = 'withdraw_coin_reject_reason', //  "提币审核驳回", //
  TRANSFER_TO_COIN_REJECT = 'transfer_to_coin_reject', //  "划转到币币驳回", //
  TRANSFER_TO_COIN_SUCCESS = 'transfer_to_coin_success', //  "划转到币币成功", //
  TRANSFER_TO_CROSS_REJECT = 'transfer_to_cross_reject', //  "划转到全仓杠杆驳回", //
  TRANSFER_TO_ISOLATED_REJECT = 'transfer_to_isolated_reject', //  "划转到逐仓杠杆驳回", //
  TRANSFER_TO_CROSS_SUCCESS = 'transfer_to_cross_success', //  "划转到全仓杠杆成功", //
  TRANSFER_TO_ISOLATED_SUCCESS = 'transfer_to_isolated_success', //  "划转到逐仓杠杆成功", //
  STANDARD_AUTH_SUCCESS = 'standard_auth_success', // "个人标准认证成功", //
  STANDARD_AUTH_FAIL = 'standard_auth_failed', // "个人标准认证失败", //
  ADVANCED_AUTH_SUCCESS = 'advanced_auth_success', // "个人高级认证成功", //
  ADVANCED_AUTH_FAIL = 'advanced_auth_failed', // "个人高级认证失败", //
  ENTERPRISE_AUTH_SUCCESS = 'enterprise_auth_success', // "企业认证成功", //
  ENTERPRISE_AUTH_FAIL = 'enterprise_auth_failed', // "企业认证失败", //
}

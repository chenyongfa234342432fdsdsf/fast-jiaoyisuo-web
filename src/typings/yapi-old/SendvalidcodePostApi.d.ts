/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [发送验证码(email\/sms)↗](https://yapi.coin-online.cc/project/72/interface/api/2015) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /sendValidCode`
 * @更新时间 `2022-08-29 13:58:26`
 */
export interface YapiPostSendValidCodeApiRequest {
  /**
   * 手机号或者邮件或者登录名,不传则取从token 中获取，手机号格式例如 86-15711941299，国内可以不加区号可以传15711941299
   */
  address?: string
  /**
   * 业务类型 security_item_apply 安全项申请、register 注册、modify_email 修改邮箱、modify_telephone 修改手机、modify_google 修改谷歌、bind_email 绑定邮箱、bind_telephone 绑定手机、bind_google 绑定谷歌、open_phone_validate 开启手机验证、close_phone_validate 关闭手机验证open_email_validate 开启邮箱验证、close_email_validate 关闭邮箱验证、open_google_validate 开启google验证、close_google_validate、 关闭google验证、login_v3 登陆modify_login_pwd 修改登录密码、reset_login_pwd 重置登录密码、 reset_trade_pwd 重置资金密码 friend_invitation 好友邀请、submit_capital_withdraw 提币申请、create_withdraw_address 添加提现地址
   */
  businessType?: string
  /**
   * 图形验证码
   */
  imageCode?: string
  /**
   * 1-手机 2-邮箱
   */
  sendType?: number
}

/**
 * 接口 [发送验证码(email\/sms)↗](https://yapi.coin-online.cc/project/72/interface/api/2015) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /sendValidCode`
 * @更新时间 `2022-08-29 13:58:26`
 */
export interface YapiPostSendValidCodeApiResponse {
  code?: number
  data?: YapiDtoSendValidCodeVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoSendValidCodeVO {
  /**
   * 短信有效期，单位秒
   */
  ttl?: number
}

/* prettier-ignore-end */

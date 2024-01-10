/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [三项安全验证↗](https://yapi.coin-online.cc/project/72/interface/api/1952) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /modifySafetyCheck`
 * @更新时间 `2022-09-02 11:48:00`
 */
export interface YapiPostModifySafetyCheckApiRequest {
  /**
   * 加密后的业务数据
   */
  bizData?: string
  bizDataView: YapiDtoundefined
  /**
   * 随机向量
   */
  randomIv?: string
  /**
   * 随机密钥
   */
  randomKey?: string
  /**
   * 签名串
   */
  signature?: string
  targetObj?: {}
  /**
   * 时间戳
   */
  timestamp?: number
}
/**
 * bizData的请求参数格式（仅展示）
 */
export interface YapiDtoundefined {
  /**
   * 手机验证码
   */
  smsValidCode?: string
  /**
   * 谷歌验证码
   */
  googleValidCode?: string
  /**
   * 邮箱验证码
   */
  emailValidCode?: string
  /**
   * 业务类型 security_item_apply 安全项申请、register 注册、modify_email 修改邮箱、modify_telephone 修改手机、modify_google 修改谷歌、bind_email 绑定邮箱、bind_telephone 绑定手机、bind_google 绑定谷歌、open_phone_validate 开启手机验证、close_phone_validate 关闭手机验证open_email_validate 开启邮箱验证、close_email_validate 关闭邮箱验证、open_google_validate 开启google验证、close_google_validate 关闭google验证modify_login_pwd 修改登录密码、 reset_trade_pwd 重置资金密码
   */
  businessType: string
}

/**
 * 接口 [三项安全验证↗](https://yapi.coin-online.cc/project/72/interface/api/1952) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /modifySafetyCheck`
 * @更新时间 `2022-09-02 11:48:00`
 */
export interface YapiPostModifySafetyCheckApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */

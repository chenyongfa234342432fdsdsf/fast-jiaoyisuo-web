/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [安全项丢失申请↗](https://yapi.coin-online.cc/project/72/interface/api/2171) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /v2/safetyItem/apply`
 * @更新时间 `2022-09-02 11:50:51`
 */
export interface YapiPostV2SafetyItemApplyApiRequest {
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
   * 不可用安全项（1-手机 2-邮箱 3-谷歌验证）
   */
  item: number
  /**
   * 账号
   */
  account: string
  /**
   * 邮箱
   */
  email?: string
  /**
   * 邮箱验证码
   */
  emailValidCode?: string
  /**
   * 区号
   */
  areaCode?: string
  /**
   * 手机号
   */
  phoneNum?: string
  /**
   * 手机验证码
   */
  smsValidCode?: string
  /**
   * 手持证件照片
   */
  photoUrl: string
  /**
   * 谷歌key
   */
  googleKey?: string
  /**
   * 谷歌验证码
   */
  googleValidCode?: string
  /**
   * 极验或图片验证码
   */
  imageCode?: string
}

/**
 * 接口 [安全项丢失申请↗](https://yapi.coin-online.cc/project/72/interface/api/2171) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /v2/safetyItem/apply`
 * @更新时间 `2022-09-02 11:50:51`
 */
export interface YapiPostV2SafetyItemApplyApiResponse {
  code?: number
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}

/* prettier-ignore-end */

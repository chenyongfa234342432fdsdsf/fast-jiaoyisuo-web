/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [通过登录名获取手机邮箱信息，手机邮箱脱敏处理↗](https://yapi.coin-online.cc/project/72/interface/api/1712) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /getFuzzyInfo`
 * @更新时间 `2022-08-29 13:58:15`
 */
export interface YapiGetGetFuzzyInfoApiRequest {
  /**
   * loginName
   */
  loginName: string
}

/**
 * 接口 [通过登录名获取手机邮箱信息，手机邮箱脱敏处理↗](https://yapi.coin-online.cc/project/72/interface/api/1712) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `GET /getFuzzyInfo`
 * @更新时间 `2022-08-29 13:58:15`
 */
export interface YapiGetGetFuzzyInfoApiResponse {
  code?: number
  data?: YapiDtoFuzzyInfoVO
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoFuzzyInfoVO {
  /**
   * 邮箱(脱敏)
   */
  email?: string
  /**
   * 是否开启邮箱验证
   */
  isOpenEmailValidate?: boolean
  /**
   * 是否开启google验证
   */
  isOpenGoogleValidate?: boolean
  /**
   * 是否开启手机验证
   */
  isOpenPhoneValidate?: boolean
  /**
   * 手机(脱敏)
   */
  phone?: string
}

/* prettier-ignore-end */

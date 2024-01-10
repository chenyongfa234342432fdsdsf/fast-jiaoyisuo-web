/* prettier-ignore-start */
/* tslint:disable */
/* eslint-disable */

/* 该文件由 yapi-to-typescript 自动生成，请勿直接修改！！！ */

/**
 * 接口 [注册↗](https://yapi.coin-online.cc/project/72/interface/api/2258) 的 **请求类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /v3/registerByBatch`
 * @更新时间 `2022-08-29 13:58:35`
 */
export interface YapiPostV3RegisterByBatchApiRequest {
  /**
   * 手机号码或者邮箱，手机号格式 86-15711941299
   */
  address?: string
  /**
   * 国家或地区，例如中国 传CN
   */
  country?: string
  /**
   * 极验验证码
   */
  imageCode?: string
  /**
   * 邀请码
   */
  inviteCode?: string
  lang?: string
  /**
   * 密码
   */
  pwd?: string
  /**
   * 邮箱或手机验证码
   */
  validCode?: string
}

/**
 * 接口 [注册↗](https://yapi.coin-online.cc/project/72/interface/api/2258) 的 **返回类型**
 *
 * @分类 [hotcoin优化相关接口↗](https://yapi.coin-online.cc/project/72/interface/api/cat_401)
 * @标签 `hotcoin优化相关接口`
 * @请求头 `POST /v3/registerByBatch`
 * @更新时间 `2022-08-29 13:58:35`
 */
export interface YapiPostV3RegisterByBatchApiResponse {
  code?: number
  data?: YapiDtoApiKeyEntity
  msg?: string
  pageNum?: number
  startDate?: string
  time?: number
  totalCount?: number
  totalPages?: number
}
export interface YapiDtoApiKeyEntity {
  accessKey?: string
  createTime?: string
  id?: number
  ip?: string
  rate?: number
  remark?: string
  secretKey?: string
  status?: number
  types?: string
  uid?: number
  updateTime?: string
  whiteList?: boolean
}

/* prettier-ignore-end */
